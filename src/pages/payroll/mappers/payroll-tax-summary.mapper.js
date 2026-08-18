/**
 * Mapping API Payroll → lignes Tax Summary Report + tendance.
 */

import {
  mapPayrollRecordFromApi,
  formatPeriodLabel,
} from "./payroll-record.mapper.js";
import { dateToPeriodKey } from "./payroll-department-summary.mapper.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * @param {object} raw — PayrollResource
 */
export function mapTaxSummaryFromApi(raw) {
  const base = mapPayrollRecordFromApi(raw);
  if (!base) return null;

  const totals = raw.totals || {};
  const grossSalary = Number(totals.gross ?? base.grossSalary ?? 0);
  const taxableIncome = Number(totals.taxable ?? 0);
  // Cotisations / impôts salariaux (tax_employee côté moteur)
  const taxAmount = Number(
    totals.total_employee_charges ?? totals.total_deductions ?? 0
  );
  const netPay = Number(totals.net ?? base.netSalary ?? 0);

  return {
    id: base.id,
    employeeId: base.employeeId,
    employeeName: base.employeeName,
    empCode: base.empCode,
    email: base.email || "",
    department: base.department || "—",
    period: base.period,
    periodKey: base.periodKey,
    periodStart: base.periodStart,
    periodEnd: base.periodEnd,
    cycle: "monthly",
    grossSalary,
    taxableIncome,
    taxAmount: round2(taxAmount),
    netPay: round2(netPay),
    currency: base.currency || "EUR",
  };
}

/**
 * KPI Tax Summary sur un jeu de lignes.
 * @param {Array<object>} list
 */
export function computeTaxSummaryKpi(list) {
  const rows = Array.isArray(list) ? list : [];
  const employeeIds = new Set(rows.map((r) => r.employeeId).filter((id) => id != null));
  const totalTax = round2(rows.reduce((s, r) => s + (Number(r.taxAmount) || 0), 0));
  const highestTax = rows.length
    ? Math.max(...rows.map((r) => Number(r.taxAmount) || 0))
    : 0;
  const employees = employeeIds.size;
  return {
    totalEmployees: employees,
    totalTax,
    averageTax: employees > 0 ? round2(totalTax / employees) : 0,
    highestTax: round2(highestTax),
  };
}

/**
 * Tendance des N derniers mois (taxe agrégée), à partir des lignes chargées.
 * @param {Array<object>} rows
 * @param {number} [months=6]
 * @returns {{ labels: string[], values: number[] }}
 */
export function buildTaxTrendFromRows(rows, months = 6) {
  const byPeriod = new Map();

  for (const r of rows || []) {
    const key = r.periodKey;
    if (!key) continue;
    byPeriod.set(key, (byPeriod.get(key) || 0) + (Number(r.taxAmount) || 0));
  }

  // Générer les N derniers mois calendaires (même si 0 data)
  const keys = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }

  // Si on a des périodes plus anciennes dans les data hors fenêtre, on reste sur la fenêtre calendaire
  return {
    labels: keys.map((k) => formatPeriodLabel(k)),
    values: keys.map((k) => round2(byPeriod.get(k) || 0)),
  };
}

export { formatPeriodLabel, dateToPeriodKey };
