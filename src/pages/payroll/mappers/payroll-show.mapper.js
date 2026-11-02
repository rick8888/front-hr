/**
 * Mapping GET /payrolls/:id → fiche `/payroll/show/:id`.
 */
import {
  formatPeriodLabel,
  mapApiStatusToUi,
} from "./payroll-record.mapper.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

function formatDate(value, locale = "fr-FR") {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value, locale = "fr-FR") {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayRate(rate) {
  const n = Number(rate);
  if (!Number.isFinite(n) || n === 0) return null;
  const pct = Math.abs(n) <= 1 ? n * 100 : n;
  return round2(pct);
}

function mapLine(raw) {
  const rate = displayRate(raw?.rate);
  return {
    name: raw?.label || raw?.code || "—",
    code: raw?.code || null,
    amount: round2(raw?.amount),
    percent: rate,
    isBase: raw?.code === "BASE_SALARY" || raw?.meta?.kind === "base_salary",
    kind: raw?.kind || null,
    meta: raw?.meta || null,
  };
}

/**
 * @param {object} raw — PayrollResource
 * @param {string} [locale]
 */
export function mapPayrollShowFromApi(raw, locale = "fr-FR") {
  if (!raw) return null;

  const emp = raw.employee || {};
  const totals = raw.totals || {};
  const employeeName =
    emp.full_name ||
    emp.name ||
    [emp.first_name, emp.last_name].filter(Boolean).join(" ") ||
    `Employé #${raw.employee_id}`;

  const periodKey = raw.period || null;
  const periodLabel = formatPeriodLabel(periodKey, locale);
  const [year, month] = String(periodKey || "").split("-");
  const paddedId = String(raw.id).padStart(4, "0");
  const payrollNumber = `PAY-${year || ""}${month || ""}-${paddedId}`;

  const lines = Array.isArray(raw.lines) ? raw.lines : [];
  const usable = lines.filter((l) => l?.kind !== "summary" && l?.type !== "info");

  const earnings = usable
    .filter((l) => l.type === "earning")
    .map(mapLine);
  const deductions = usable
    .filter((l) => l.type === "deduction")
    .map(mapLine);

  const modifiers = [
    ...earnings.map((e) => ({
      name: e.name,
      type: "earning",
      percent: e.percent,
      amount: e.amount,
    })),
    ...deductions.map((d) => ({
      name: d.name,
      type: "deduction",
      percent: d.percent,
      amount: d.amount,
    })),
  ];

  const uiStatus = mapApiStatusToUi(raw.status);
  const workflow = raw.workflow || {};
  const attendanceSnap = raw.snapshot?.attendance || {};
  const attendanceVars = raw.snapshot?.variables || {};
  const attendance = {
    daysWorked: Number(
      attendanceSnap.days_worked ?? attendanceSnap.daysWorked ?? attendanceVars.DAYS_WORKED ?? 0
    ),
    absentDays: Number(
      attendanceSnap.absent_days ?? attendanceSnap.absentDays ?? attendanceVars.ABSENT_DAYS ?? 0
    ),
    leaveDays: Number(
      attendanceSnap.leave_days ?? attendanceSnap.leaveDays ?? attendanceVars.LEAVE_DAYS ?? 0
    ),
    recordedAbsentDays: Number(
      attendanceSnap.recorded_absent_days ??
      attendanceSnap.recordedAbsentDays ??
      attendanceVars.RECORDED_ABSENT_DAYS ??
      0
    ),
    noShowDays: Number(
      attendanceSnap.no_show_days ?? attendanceSnap.noShowDays ?? attendanceVars.NO_SHOW_DAYS ?? 0
    ),
    pendingAttendanceDays: Number(
      attendanceSnap.pending_attendance_days ??
      attendanceSnap.pendingAttendanceDays ??
      attendanceVars.PENDING_ATTENDANCE_DAYS ??
      0
    ),
    hasAbsenceBreakdown:
      attendanceSnap.recorded_absent_days != null ||
      attendanceSnap.recordedAbsentDays != null ||
      attendanceSnap.no_show_days != null ||
      attendanceSnap.noShowDays != null ||
      attendanceVars.RECORDED_ABSENT_DAYS != null ||
      attendanceVars.NO_SHOW_DAYS != null,
    overtimeHours: Number(
      attendanceSnap.overtime_hours ?? attendanceSnap.overtimeHours ?? attendanceVars.OVERTIME_HOURS ?? 0
    ),
    workingDays: Number(attendanceSnap.working_days ?? attendanceVars.WORKING_DAYS ?? 0),
    payableDays: Number(attendanceSnap.payable_days ?? attendanceVars.PAYABLE_DAYS ?? 0),
    unpaidDays: Number(attendanceSnap.unpaid_days ?? attendanceVars.UNPAID_DAYS ?? 0),
    unpaidLeaveDays: Number(attendanceSnap.unpaid_leave_days ?? 0),
    contractualSalary: Number(
      attendanceSnap.contractual_salary ?? attendanceVars.CONTRACTUAL_BASE ?? 0
    ),
    dailyRate: Number(attendanceSnap.daily_rate ?? attendanceVars.DAILY_RATE ?? 0),
  };

  return {
    id: raw.id,
    employeeId: raw.employee_id,
    employeeName,
    empCode: emp.matricule || `EMP-${raw.employee_id}`,
    email: emp.email || "—",
    phone: emp.phone || "—",
    role: emp.job_title || emp.role || emp.designation || "—",
    department: emp.department || "—",
    payrollNumber,
    period: periodLabel,
    periodLabel,
    periodKey,
    cycle: periodLabel,
    payDate: formatDate(raw.period_end, locale),
    periodStart: formatDate(raw.period_start, locale),
    periodEnd: formatDate(raw.period_end, locale),
    status: uiStatus,
    statusRaw: raw.status,
    approvalBadge: uiStatus === "approved" || uiStatus === "paid" ? "approved" : null,
    approval:
      uiStatus === "approved" || uiStatus === "paid"
        ? {
            status: "approved",
            by: workflow.updated_by ? `#${workflow.updated_by}` : "—",
            at: formatDateTime(workflow.updated_at || raw.updated_at, locale),
          }
        : null,
    defaultApproved: uiStatus === "approved" || uiStatus === "paid",
    basicSalary: Number(totals.base_salary ?? raw.base_salary ?? 0),
    earnings,
    deductions,
    grossSalary: Number(totals.gross ?? raw.gross ?? 0),
    totalDeductions: Number(totals.total_deductions ?? raw.total_deductions ?? 0),
    netSalary: Number(totals.net ?? raw.net ?? 0),
    currency: raw.currency || "EUR",
    modifiers,
    attendance,
    createdAt: formatDateTime(raw.created_at || raw.generated_at, locale),
    updatedAt: formatDateTime(raw.updated_at, locale),
    rejectReason: workflow.reason || null,
  };
}
