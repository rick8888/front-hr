/**
 * Mappe settings paie API ↔ formulaire UI.
 * Aucune donnée métier hardcodée : champs vides + valeurs API uniquement.
 */

export function emptyPayrollSettingsForm() {
  return {
    statutory_mode: "",
    payroll_prefix: "",
    default_pay_period: "",
    payroll_start_day: null,
    payroll_end_day: null,
    pay_date_offset_days: null,
    working_days_per_month: null,
    lop_deduction_enabled: false,
    lop_calculation_method: "",
    lop_include_weekends: false,
    lop_include_holidays: false,
    lop_round_mode: "",
    expense_reimbursement_enabled: false,
    loan_deductions_enabled: false,
    auto_generation_enabled: false,
  };
}

/** @deprecated use emptyPayrollSettingsForm */
export function defaultPayrollSettingsForm() {
  return emptyPayrollSettingsForm();
}

function toBool(v) {
  if (v === true || v === 1 || v === "1" || v === "true") return true;
  if (v === false || v === 0 || v === "0" || v === "false") return false;
  return false;
}

function toIntOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function pickStr(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

/** Normalise la réponse API vers le form UI (source = backend uniquement) */
export function mapSettingsFromApi(raw) {
  const empty = emptyPayrollSettingsForm();
  if (!raw || typeof raw !== "object") return { ...empty };

  const periodOk = typeof raw.default_pay_period === "string" && raw.default_pay_period !== "";
  const lopMethodOk = ["working_days", "calendar_days"].includes(
    raw.lop_calculation_method
  );
  const roundOk = ["none", "half", "whole"].includes(raw.lop_round_mode);
  const modeOk = raw.statutory_mode === "manual" || raw.statutory_mode === "automatic";

  return {
    statutory_mode: modeOk ? raw.statutory_mode : "",
    payroll_prefix: pickStr(raw.payroll_prefix),
    default_pay_period: periodOk ? raw.default_pay_period : "",
    payroll_start_day: toIntOrNull(raw.payroll_start_day),
    payroll_end_day: toIntOrNull(raw.payroll_end_day),
    pay_date_offset_days: toIntOrNull(raw.pay_date_offset_days),
    working_days_per_month: toIntOrNull(raw.working_days_per_month),
    lop_deduction_enabled: toBool(raw.lop_deduction_enabled),
    lop_calculation_method: lopMethodOk ? raw.lop_calculation_method : "",
    lop_include_weekends: toBool(raw.lop_include_weekends),
    lop_include_holidays: toBool(raw.lop_include_holidays),
    lop_round_mode: roundOk ? raw.lop_round_mode : "",
    expense_reimbursement_enabled: toBool(raw.expense_reimbursement_enabled),
    loan_deductions_enabled: toBool(raw.loan_deductions_enabled),
    auto_generation_enabled: toBool(raw.auto_generation_enabled),
  };
}

/**
 * Payload PUT pour l’API.
 * N’envoie que les champs renseignés (évite d’écraser avec des faux défauts).
 */
export function mapSettingsToApi(form) {
  if (!form || typeof form !== "object") return {};

  const out = {};

  if (form.statutory_mode === "manual" || form.statutory_mode === "automatic") {
    out.statutory_mode = form.statutory_mode;
  }

  if (form.payroll_prefix != null && String(form.payroll_prefix).trim() !== "") {
    out.payroll_prefix = String(form.payroll_prefix).trim();
  }

  if (form.default_pay_period && String(form.default_pay_period).trim() !== "") {
    out.default_pay_period = String(form.default_pay_period).trim();
  }

  for (const key of [
    "payroll_start_day",
    "payroll_end_day",
    "pay_date_offset_days",
    "working_days_per_month",
  ]) {
    const n = toIntOrNull(form[key]);
    if (n != null) out[key] = n;
  }

  if (["working_days", "calendar_days"].includes(form.lop_calculation_method)) {
    out.lop_calculation_method = form.lop_calculation_method;
  }

  if (["none", "half", "whole"].includes(form.lop_round_mode)) {
    out.lop_round_mode = form.lop_round_mode;
  }

  out.lop_deduction_enabled = !!form.lop_deduction_enabled;
  out.lop_include_weekends = !!form.lop_include_weekends;
  out.lop_include_holidays = !!form.lop_include_holidays;
  out.expense_reimbursement_enabled = !!form.expense_reimbursement_enabled;
  out.loan_deductions_enabled = !!form.loan_deductions_enabled;
  out.auto_generation_enabled = !!form.auto_generation_enabled;

  return out;
}
