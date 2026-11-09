import {
  initialsFromName,
  periodToDateEnd,
  periodToDateStart,
  toPeriodMonth,
} from "../utils/payroll-http.js";

/**
 * Mappe PayrollModifier API ↔ UI modificateurs.
 * UI : type earning|deduction, applicability all|individual, valueKind amount|percent
 * API : sign +|-, scope global|employee, type fixed|percent|formula
 */

export function mapModifierFromApi(raw) {
  if (!raw) return null;

  const isEarning = raw.sign === "+";
  const valueKind = raw.type === "percent" ? "percent" : "amount";
  let displayValue = Number(raw.value) || 0;
  // API stocke le % en décimal (0.03) — UI en points (3)
  if (valueKind === "percent" && Math.abs(displayValue) <= 1) {
    displayValue = displayValue * 100;
  }

  const periodFrom = raw.period_from;
  const periodTo = raw.period_to;
  const temporary = !!(periodFrom || periodTo);

  const emp = raw.employee
    ? {
        id: raw.employee.id,
        name: raw.employee.name,
        empCode: raw.employee.matricule || `EMP-${raw.employee.id}`,
        initials: initialsFromName(raw.employee.name),
        avatarUrl: raw.employee.avatar_url ?? raw.employee.avatarUrl ?? null,
      }
    : null;

  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    type: isEarning ? "earning" : "deduction",
    applicability: raw.scope === "employee" ? "individual" : "all",
    employee: emp,
    employee_id: raw.employee_id,
    valueKind,
    value: displayValue,
    duration: temporary ? "temporary" : "permanent",
    validFrom: periodToDateStart(periodFrom),
    validTo: periodToDateEnd(periodTo),
    target: raw.target || "NET",
    formula: raw.formula,
    sequence: raw.sequence ?? 100,
    is_active: raw.is_active !== false,
    company_id: raw.company_id,
  };
}

export function mapModifierToApi(form, companyId = null) {
  const code = String(form.code || "")
    .replace(/\s+/g, "_")
    .toUpperCase();

  const scope = form.applicability === "individual" ? "employee" : "global";
  const sign = form.type === "earning" ? "+" : "-";
  const type = form.valueKind === "percent" ? "percent" : "fixed";

  let value = Number(form.value) || 0;
  if (type === "percent") {
    // UI points → décimal API
    value = value / 100;
  }

  const temporary = form.duration === "temporary";

  return {
    scope,
    company_id: companyId || undefined,
    employee_id: scope === "employee" ? Number(form.employeeId) || null : null,
    code,
    name: String(form.name || "").trim(),
    target: form.target || "NET",
    type,
    value,
    formula: null,
    sign,
    period_from: temporary ? toPeriodMonth(form.validFrom) : null,
    period_to: temporary ? toPeriodMonth(form.validTo) : null,
    is_active: true,
    sequence: form.sequence ?? 100,
  };
}
