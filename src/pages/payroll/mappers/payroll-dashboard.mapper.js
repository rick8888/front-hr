/**
 * Mapping API Payroll → données tableau de bord paie.
 * Agrège les bulletins (pas d'endpoint dédié dashboard).
 */

import { t } from "../../../i18n/index.js";
import {
  mapPayrollRecordFromApi,
  formatPeriodLabel,
} from "./payroll-record.mapper.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * @param {object} raw — PayrollResource
 */
export function mapDashboardRecordFromApi(raw) {
  const base = mapPayrollRecordFromApi(raw);
  if (!base) return null;
  return {
    id: base.id,
    employeeId: base.employeeId,
    name: base.employeeName,
    code: base.empCode,
    period: base.period,
    periodKey: base.periodKey,
    gross: base.grossSalary,
    net: base.netSalary,
    status: base.status,
    generatedAt: base.generatedAt,
  };
}

/**
 * Période calendaire courante YYYY-MM.
 */
export function currentPeriodKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * N clés de période mensuelle (croissant), se terminant par `endKey` ou aujourd'hui.
 * @param {number} months
 * @param {string} [endKey] YYYY-MM
 */
export function lastPeriodKeys(months = 6, endKey = currentPeriodKey()) {
  const [ey, em] = String(endKey).split("-").map(Number);
  if (!ey || !em) return [];
  const keys = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(ey, em - 1 - i, 1);
    keys.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return keys;
}

/**
 * KPI du tableau de bord.
 * @param {Array<object>} records — lignes mapDashboardRecordFromApi
 * @param {string} [period] période « ce mois » (YYYY-MM)
 */
export function computeDashboardKpi(records, period = currentPeriodKey()) {
  const rows = Array.isArray(records) ? records : [];
  const employeeIds = new Set(
    rows.map((r) => r.employeeId).filter((id) => id != null)
  );
  const pending = rows.filter((r) => r.status === "pending").length;

  const thisMonth = rows.filter((r) => r.periodKey === period);
  const paymentThisMonth = round2(
    thisMonth.reduce((s, r) => s + (Number(r.net) || 0), 0)
  );

  // Salaire moyen : moyenne des nets de la période, sinon sur tout le jeu
  const avgSource = thisMonth.length ? thisMonth : rows;
  const avgSalary =
    avgSource.length > 0
      ? round2(
          avgSource.reduce((s, r) => s + (Number(r.net) || 0), 0) /
            avgSource.length
        )
      : 0;

  return {
    employees: employeeIds.size,
    pending,
    paymentThisMonth,
    avgSalary,
    totalStatuses: rows.length,
    currentPeriod: period,
  };
}

/**
 * Tendance brut / net des N derniers mois.
 * @param {Array<object>} records
 * @param {number} [months=6]
 * @param {string} [locale='fr-FR']
 * @returns {{ labels: string[], gross: number[], net: number[] }}
 */
export function buildPaymentTrend(records, months = 6, locale = "fr-FR") {
  const rows = Array.isArray(records) ? records : [];
  const keys = lastPeriodKeys(months);
  const byPeriod = new Map();

  for (const k of keys) {
    byPeriod.set(k, { gross: 0, net: 0 });
  }
  for (const r of rows) {
    if (!r.periodKey || !byPeriod.has(r.periodKey)) continue;
    const bucket = byPeriod.get(r.periodKey);
    bucket.gross += Number(r.gross) || 0;
    bucket.net += Number(r.net) || 0;
  }

  return {
    labels: keys.map((k) => formatPeriodLabel(k, locale)),
    gross: keys.map((k) => round2(byPeriod.get(k).gross)),
    net: keys.map((k) => round2(byPeriod.get(k).net)),
  };
}

const STATUS_DONUT = [
  { key: "pending", color: "#fbbf24" },
  { key: "approved", color: "#7dd3fc" },
  { key: "paid", color: "#22c55e" },
  { key: "cancelled", color: "#f87171" },
];

/**
 * Segments du donut de statuts.
 * @param {Array<object>} records
 */
export function buildStatusSegments(records) {
  const rows = Array.isArray(records) ? records : [];
  const counts = { pending: 0, approved: 0, paid: 0, cancelled: 0 };
  for (const r of rows) {
    const s = r.status === "cancelled" ? "cancelled" : r.status;
    if (counts[s] != null) counts[s] += 1;
    else counts.pending += 1;
  }
  return STATUS_DONUT.map((meta) => ({
    ...meta,
    label: t(`admin.payroll.status.${meta.key}`),
    count: counts[meta.key] || 0,
  }));
}

/**
 * N bulletins les plus récents (période puis id).
 * @param {Array<object>} records
 * @param {number} [limit=6]
 */
export function pickRecentPayrolls(records, limit = 6) {
  const rows = Array.isArray(records) ? [...records] : [];
  rows.sort((a, b) => {
    const ka = a.periodKey || "";
    const kb = b.periodKey || "";
    if (ka !== kb) return kb.localeCompare(ka);
    // generatedAt ISO décroissant
    const ga = a.generatedAt || "";
    const gb = b.generatedAt || "";
    if (ga !== gb) return gb.localeCompare(ga);
    return (b.id || 0) - (a.id || 0);
  });
  return rows.slice(0, limit);
}

export { formatPeriodLabel };
