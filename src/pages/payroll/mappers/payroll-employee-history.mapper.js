/**
 * Mapping API Payroll / Employees → Employee Payslip History report.
 */

import {
  mapPayrollRecordFromApi,
  formatPeriodLabel,
  mapApiStatusToUi,
  mapUiStatusToApiFilter,
} from "./payroll-record.mapper.js";
import { mapEmployeeBase } from "./salary-structure.mapper.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * @param {string|null|undefined} isoDate YYYY-MM-DD
 * @returns {string}
 */
export function formatJoinDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return String(isoDate);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Option pour EmployeeSearchSelect + carte profil.
 * @param {object} raw — EmployeeResource
 */
export function mapHistoryEmployeeOption(raw) {
  if (!raw) return null;
  const base = mapEmployeeBase(raw);
  const designation =
    raw.designation || raw.job_title || raw.role || "—";
  const joinRaw = raw.hired_at || raw.joinDate || null;

  return {
    id: base.id,
    name: base.name,
    empCode: base.empCode,
    department:
      base.departmentName && base.departmentName !== "—"
        ? base.departmentName
        : "—",
    designation,
    joinDate: formatJoinDate(joinRaw),
    avatarUrl: base.avatarUrl || null,
  };
}

/**
 * Ligne d’historique (bulletin).
 * @param {object} raw — PayrollResource
 */
export function mapHistoryRowFromApi(raw) {
  const base = mapPayrollRecordFromApi(raw);
  if (!base) return null;

  const totals = raw.totals || {};
  const baseSalary = Number(totals.base_salary ?? 0);
  const gross = Number(totals.gross ?? base.grossSalary ?? 0);
  const totalEarnings = Number(totals.total_earnings ?? gross);
  const tax = Number(totals.total_employee_charges ?? 0);
  const totalDeductions = Number(totals.total_deductions ?? 0);
  // Deductions hors charges salariales / impôts
  const deductions = Math.max(0, totalDeductions - tax);
  // Allocations / éléments au-dessus du base
  const allowances = Math.max(0, totalEarnings - baseSalary);

  const periodKey = base.periodKey;
  const periodLong = formatPeriodLabelLong(periodKey) || base.period;

  return {
    id: base.id,
    employeeId: base.employeeId,
    period: periodLong,
    periodKey,
    cycle: periodLong,
    grossSalary: round2(gross),
    allowances: round2(allowances),
    deductions: round2(deductions),
    tax: round2(tax),
    netSalary: round2(Number(totals.net ?? base.netSalary ?? 0)),
    status: mapApiStatusToUi(raw.status),
    statusRaw: raw.status,
    currency: base.currency || "EUR",
  };
}

/**
 * Libellé mois long "April 2026" (filtre date range client / graph).
 * @param {string|null|undefined} periodKey YYYY-MM
 */
export function formatPeriodLabelLong(periodKey) {
  if (!periodKey) return null;
  const [y, m] = String(periodKey).split("-").map(Number);
  if (!y || !m) return String(periodKey);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

/**
 * KPI dérivés de l’historique (ligne filtrée).
 * @param {Array<object>} rows
 */
export function computePayslipHistoryKpis(rows = []) {
  const list = Array.isArray(rows) ? rows : [];
  const total = list.length;
  const grouped = (selector, average = false) => {
    const groups = new Map();
    for (const row of list) {
      const currency = row.currency || "EUR";
      const group = groups.get(currency) || { amount: 0, count: 0 };
      group.amount += Number(selector(row)) || 0;
      group.count += 1;
      groups.set(currency, group);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([currency, group]) => ({
        currency,
        amount: round2(average && group.count ? group.amount / group.count : group.amount),
      }));
  };
  return {
    totalRecords: total,
    totalEarnedByCurrency: grouped((row) => row.grossSalary),
    totalDeductionsByCurrency: grouped((row) => Number(row.deductions || 0) + Number(row.tax || 0)),
    averageNetPayByCurrency: grouped((row) => row.netSalary, true),
  };
}

/**
 * Série tendance salaire net (ordre chronologique croissant).
 * @param {Array<object>} rows
 * @returns {{ labels: string[], values: number[] }}
 */
export function buildSalaryTrendFromHistory(rows = []) {
  const list = Array.isArray(rows) ? [...rows] : [];
  if (!list.length) {
    return {
      labels: ["", "", "", "", ""],
      values: [0, 0, 0, 0, 0],
    };
  }

  list.sort((a, b) => {
    const ka = a.periodKey || "";
    const kb = b.periodKey || "";
    if (ka && kb) return ka.localeCompare(kb);
    return 0;
  });

  return {
    labels: list.map((r) => {
      if (r.periodKey) return formatPeriodLabel(r.periodKey);
      return String(r.period || "").replace(/ 20/, " ");
    }),
    values: list.map((r) => Number(r.netSalary) || 0),
  };
}

export { formatPeriodLabel, mapUiStatusToApiFilter, mapApiStatusToUi };
