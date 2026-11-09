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

    const currency = row.currency || "EUR";
    const key = `${department}\u0000${currency}`;
    if (!byDept.has(key)) {
      byDept.set(key, {
        department,
        employeeIds: new Set(),
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        cycles: new Set(),
        currency,
      });
    }

    const bucket = byDept.get(key);
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
        id: `${deptId(b.department)}-${b.currency.toLowerCase()}`,
        department: b.department,
        employees,
        employeeIds: [...b.employeeIds],
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
  const employeeIds = new Set(list.flatMap((row) => row.employeeIds || []));
  const payrollByCurrency = new Map();
  const employeesByCurrency = new Map();
  for (const row of list) {
    const currency = row.currency || "EUR";
    payrollByCurrency.set(
      currency,
      (payrollByCurrency.get(currency) || 0) + (Number(row.totalNet) || 0)
    );
    const employees = employeesByCurrency.get(currency) || new Set();
    for (const employeeId of row.employeeIds || []) employees.add(employeeId);
    employeesByCurrency.set(currency, employees);
  }
  const payrollByCurrencyList = [...payrollByCurrency.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([currency, amount]) => ({ currency, amount: round2(amount) }));
  const averageByCurrency = payrollByCurrencyList.map(({ currency, amount }) => {
    const count = employeesByCurrency.get(currency)?.size || 0;
    return { currency, amount: count > 0 ? round2(amount / count) : 0 };
  });
  return {
    totalDepartments: new Set(list.map((row) => row.department)).size,
    totalEmployees: employeeIds.size,
    totalPayrollByCurrency: payrollByCurrencyList,
    averagePerEmployeeByCurrency: averageByCurrency,
  };
}
