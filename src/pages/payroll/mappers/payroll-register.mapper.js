/**
 * Mapping API Payroll → ligne UI « Payroll Register Report ».
 * Réutilise le mapping de base des bulletins.
 */

import {
  mapPayrollRecordFromApi,
  formatPeriodLabel,
  computePayrollRecordsKpi,
  PAYROLL_STATUS_UI,
  mapUiStatusToApiFilter,
  mapApiStatusToUi,
} from "./payroll-record.mapper.js";

export {
  PAYROLL_STATUS_UI,
  mapUiStatusToApiFilter,
  mapApiStatusToUi,
  formatPeriodLabel,
};

/**
 * @param {object} raw — PayrollResource
 */
export function mapPayrollRegisterFromApi(raw) {
  const base = mapPayrollRecordFromApi(raw);
  if (!base) return null;

  const totals = raw.totals || {};
  const deductions = Number(
    totals.total_deductions ?? totals.total_employee_charges ?? 0
  );
  const grossSalary = Number(totals.gross ?? base.grossSalary ?? 0);
  const netPay = Number(totals.net ?? base.netSalary ?? 0);

  // Cycle non exposé par l’API : mensuel par défaut (période = mois)
  const cycle = "monthly";

  return {
    id: base.id,
    employeeId: base.employeeId,
    employeeName: base.employeeName,
    avatarUrl: base.avatarUrl,
    empCode: base.empCode,
    department: base.department || "—",
    period: base.period, // libellé affichage (ex. "Apr 2026")
    periodKey: base.periodKey, // YYYY-MM (filtres API)
    cycle,
    grossSalary,
    deductions,
    netPay,
    status: base.status,
    statusRaw: base.statusRaw,
    currency: base.currency || "EUR",
  };
}

/**
 * KPI registre : totaux sur le jeu filtré.
 * @param {Array<object>} list
 */
export function computePayrollRegisterKpi(list) {
  const rows = Array.isArray(list) ? list : [];
  const totalsByCurrency = (selector) => {
    const totals = new Map();
    for (const row of rows) {
      const currency = row.currency || "EUR";
      totals.set(currency, (totals.get(currency) || 0) + (Number(selector(row)) || 0));
    }
    return [...totals.entries()]
      .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB))
      .map(([currency, amount]) => ({ currency, amount: Math.round(amount * 100) / 100 }));
  };
  return {
    totalRecords: rows.length,
    totalGrossByCurrency: totalsByCurrency((row) => row.grossSalary),
    totalDeductionsByCurrency: totalsByCurrency((row) => row.deductions),
    totalNetByCurrency: totalsByCurrency((row) => row.netPay),
  };
}

/** Compat KPI records si besoin */
export { computePayrollRecordsKpi };
