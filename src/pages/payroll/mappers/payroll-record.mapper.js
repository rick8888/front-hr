/**
 * Mapping API Payroll ↔ ligne UI « All Records ».
 *
 * Statuts backend : draft | computed | validated | paid | cancelled
 * Statuts UI      : pending | approved | paid | cancelled
 */

/** @typedef {'pending'|'approved'|'paid'|'cancelled'} UiPayrollStatus */

export const PAYROLL_STATUS_UI = {
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-800",
  },
  approved: {
    label: "Approved",
    badge: "bg-sky-100 text-sky-800",
  },
  paid: {
    label: "Paid",
    badge: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-800",
  },
};

/**
 * UI status → statut(s) API pour filtres GET /payrolls?status=
 * @param {string} uiStatus
 * @returns {string|null}
 */
export function mapUiStatusToApiFilter(uiStatus) {
  if (!uiStatus) return null;
  const map = {
    pending: "draft,computed",
    approved: "validated",
    paid: "paid",
    cancelled: "cancelled",
    // passthrough si déjà un statut backend
    draft: "draft",
    computed: "computed",
    validated: "validated",
  };
  return map[uiStatus] ?? uiStatus;
}

/**
 * @param {string|null|undefined} apiStatus
 * @returns {UiPayrollStatus}
 */
export function mapApiStatusToUi(apiStatus) {
  const s = String(apiStatus || "").toLowerCase();
  if (s === "paid") return "paid";
  if (s === "validated") return "approved";
  if (s === "cancelled") return "cancelled";
  return "pending"; // draft | computed | …
}

/**
 * @param {string|null|undefined} period YYYY-MM
 * @param {string} [locale]
 */
export function formatPeriodLabel(period, locale = "en-US") {
  if (!period) return "—";
  const [y, m] = String(period).split("-").map(Number);
  if (!y || !m) return String(period);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(locale, { month: "short", year: "numeric" });
}

/**
 * @param {object} raw — PayrollResource
 */
export function mapPayrollRecordFromApi(raw) {
  if (!raw) return null;

  const emp = raw.employee || {};
  const employeeName =
    emp.full_name ||
    emp.name ||
    [emp.first_name, emp.last_name].filter(Boolean).join(" ") ||
    `Employee #${raw.employee_id}`;

  const totals = raw.totals || {};
  const periodKey = raw.period || null;

  return {
    id: raw.id,
    employeeId: raw.employee_id,
    employeeName,
    empCode: emp.matricule || `EMP-${raw.employee_id}`,
    email: emp.email || "",
    department: emp.department || null,
    period: formatPeriodLabel(periodKey),
    periodKey,
    periodStart: raw.period_start || null,
    periodEnd: raw.period_end || null,
    basicSalary: Number(totals.base_salary ?? raw.base_salary ?? 0),
    grossSalary: Number(totals.gross ?? raw.gross ?? 0),
    netSalary: Number(totals.net ?? raw.net ?? 0),
    status: mapApiStatusToUi(raw.status),
    statusRaw: raw.status,
    currency: raw.currency || "EUR",
    generatedAt: raw.generated_at || null,
  };
}

/**
 * @param {Array<object>} list
 * @returns {{ total: number, pending: number, approved: number, paid: number, totalPayout: number }}
 */
export function computePayrollRecordsKpi(list) {
  const rows = Array.isArray(list) ? list : [];
  const pending = rows.filter((r) => r.status === "pending").length;
  const approved = rows.filter((r) => r.status === "approved").length;
  const paid = rows.filter((r) => r.status === "paid");
  return {
    total: rows.length,
    pending,
    approved,
    paid: paid.length,
    totalPayout: paid.reduce((s, r) => s + (Number(r.netSalary) || 0), 0),
  };
}
