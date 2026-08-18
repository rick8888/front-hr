/**
 * Agrégation des bulletins → synthèse par département
 * (/payroll/reports/department-summary).
 */

import { t } from "../../../i18n/index.js";
import { mapPayrollRegisterFromApi } from "./payroll-register.mapper.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

function deptId(name) {
  return (
    String(name || "unassigned")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "unassigned"
  );
}

/** Date ISO (YYYY-MM-DD) → période YYYY-MM */
export function dateToPeriodKey(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).slice(0, 7);
  return /^\d{4}-\d{2}$/.test(s) ? s : null;
}

/**
 * @param {Array<object>} rawPayrolls — PayrollResource[]
 * @returns {Array<object>} lignes registre
 */
export function mapPayrollsForDepartmentSummary(rawPayrolls) {
  return (Array.isArray(rawPayrolls) ? rawPayrolls : [])
    .map(mapPayrollRegisterFromApi)
    .filter(Boolean);
}

/**
 * Agrège les paies par département.
 * @param {Array<object>} registerRows
 * @returns {Array<object>}
 */
export function aggregateByDepartment(registerRows) {
  const byDept = new Map();

  for (const row of registerRows || []) {
    const department =
      row.department && String(row.department).trim() && row.department !== "—"
        ? String(row.department).trim()
        : t("admin.payroll.noDepartment");

    if (!byDept.has(department)) {
      byDept.set(department, {
        department,
        employeeIds: new Set(),
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        cycles: new Set(),
        currency: row.currency || "EUR",
      });
    }

    const bucket = byDept.get(department);
    if (row.employeeId != null) bucket.employeeIds.add(Number(row.employeeId));
    bucket.totalGross += Number(row.grossSalary) || 0;
    bucket.totalDeductions += Number(row.deductions) || 0;
    bucket.totalNet += Number(row.netPay) || 0;
    if (row.cycle) bucket.cycles.add(row.cycle);
    if (row.currency) bucket.currency = row.currency;
  }

  return [...byDept.values()]
    .map((b) => {
      const employees = b.employeeIds.size;
      const totalGross = round2(b.totalGross);
      const totalDeductions = round2(b.totalDeductions);
      const totalNet = round2(b.totalNet);
      return {
        id: deptId(b.department),
        department: b.department,
        employees,
        totalGross,
        totalDeductions,
        totalNet,
        averageSalary: employees > 0 ? round2(totalNet / employees) : 0,
        cycles: b.cycles.size ? [...b.cycles].sort() : ["monthly"],
        currency: b.currency || "EUR",
      };
    })
    .sort((a, b) => a.department.localeCompare(b.department, "fr"));
}

/**
 * @param {Array<object>} departmentRows
 */
export function computeDepartmentSummaryKpi(departmentRows) {
  const list = Array.isArray(departmentRows) ? departmentRows : [];
  const totalEmployees = list.reduce((s, r) => s + (Number(r.employees) || 0), 0);
  const totalPayroll = round2(list.reduce((s, r) => s + (Number(r.totalNet) || 0), 0));
  return {
    totalDepartments: list.length,
    totalEmployees,
    totalPayroll,
    averagePerEmployee: totalEmployees > 0 ? round2(totalPayroll / totalEmployees) : 0,
  };
}
