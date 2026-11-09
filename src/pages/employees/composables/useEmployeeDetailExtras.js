import { leaveBalancesApiService } from "../../leave/services/leaveBalances.api.service.js";
import { leaveRequestsApiService } from "../../leave/services/leaveRequests.api.service.js";
import { attendanceRecordsApiService } from "../../attendance/services/attendanceRecords.api.service.js";
import { employeesApiService } from "../services/employees.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

function toDateInput(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatMinutes(minutes) {
  const total = Number(minutes) || 0;
  if (total <= 0) return "—";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function weekdayLabel(iso) {
  if (!iso) return "—";
  const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { weekday: "long" });
}

function titleCase(value) {
  const raw = String(value || "").trim();
  if (!raw) return "—";
  return raw
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function attendanceStatusLabel(status) {
  const map = {
    on_time: "Present",
    present: "Present",
    late: "Late",
    half_day: "Half Day",
    leave: "Leave",
    absent: "Absent",
  };
  return map[String(status || "").toLowerCase()] || titleCase(status);
}

function leaveStatusLabel(status) {
  const map = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return map[String(status || "").toLowerCase()] || titleCase(status);
}

function normalizeAttendanceRow(raw = {}) {
  const status = attendanceStatusLabel(raw.status);
  const lateMinutes = Number(raw.late_minutes ?? raw.lateMinutes ?? 0);
  return {
    date: raw.date ?? raw.attendance_date ?? "",
    day: weekdayLabel(raw.date ?? raw.attendance_date),
    shift: raw.shift_name ?? raw.shiftName ?? raw.shift ?? "—",
    checkIn: raw.check_in ?? raw.checkIn ?? "—",
    checkOut: raw.check_out ?? raw.checkOut ?? "—",
    workHours: formatMinutes(raw.working_minutes ?? raw.workingMinutes),
    status,
    remarks:
      lateMinutes > 0
        ? `Late by ${formatMinutes(lateMinutes)}`
        : raw.remarks || "",
  };
}

function normalizeLeaveBalance(raw = {}) {
  const entitled = Number(raw.entitled ?? 0);
  const carried = Number(raw.carried_forward ?? raw.carriedForward ?? 0);
  const additional = Number(raw.additional ?? 0);
  const used = Number(raw.used ?? 0);
  const total = entitled + carried + additional;
  const remaining = Number(
    raw.available ?? Math.max(0, total - used)
  );

  return {
    name: raw.name || raw.code || "Leave",
    code: raw.code || "",
    total,
    used,
    remaining,
  };
}

function normalizeLeaveHistory(raw = {}) {
  return {
    type: raw.leave_type ?? raw.leaveType ?? "—",
    from: raw.start_date ?? raw.startDate ?? "",
    to: raw.end_date ?? raw.endDate ?? "",
    days: Number(raw.total_days ?? raw.totalDays ?? 0),
    status: leaveStatusLabel(raw.status),
    reason: raw.reason || "—",
    appliedOn: raw.submitted_at ?? raw.submittedAt ?? raw.created_at ?? "",
  };
}

function timelineCategory(activity = {}) {
  const event = String(activity.event || "").toLowerCase();
  if (event.startsWith("employee.onboarding_")) return "onboarding";
  if (event.startsWith("employee.offboarding_")) return "offboarding";
  if (event.startsWith("employee.probation_")) return "probation";
  if (
    event.startsWith("performance_review.") ||
    event.startsWith("performance_objective.") ||
    event.startsWith("training_enrollment.created_from_performance_objective")
  ) {
    return "performance";
  }
  if (event.startsWith("training_enrollment.")) return "training";
  if (event.startsWith("equipment_assignment.")) return "equipment";
  if (event.startsWith("payroll.")) return "payroll";

  const type = String(activity.type || "").toLowerCase();
  const title = String(activity.title || "").toLowerCase();
  const description = String(activity.description || "").toLowerCase();
  const blob = `${type} ${title} ${description}`;

  if (blob.includes("probation")) return "probation";

  if (
    blob.includes("status") ||
    blob.includes("inactive") ||
    blob.includes("terminated") ||
    blob.includes("suspend") ||
    blob.includes("retired") ||
    blob.includes("created") ||
    blob.includes("joined") ||
    type === "status"
  ) {
    return "status";
  }

  return "changes";
}

function normalizeTimelineEvent(activity = {}, index = 0) {
  const eventTitle = activity.event
    ? t(`admin.employees.activityEvents.${activity.event}`)
    : "";
  return {
    id: activity.id ?? `timeline-${index + 1}`,
    title:
      eventTitle && eventTitle !== `admin.employees.activityEvents.${activity.event}`
        ? eventTitle
        : activity.title || t("admin.employees.view.activity"),
    date: activity.timestamp
      ? new Date(activity.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    description: activity.description || "",
    category: timelineCategory(activity),
    timestamp: activity.timestamp || null,
  };
}

function computeKpis({ attendanceLog, leaveBalances, leaveHistory }) {
  const presentDays = attendanceLog.filter((r) =>
    ["Present", "Late", "Half Day"].includes(r.status)
  ).length;
  const lateArrivals = attendanceLog.filter((r) => r.status === "Late").length;
  const absentDays = attendanceLog.filter((r) => r.status === "Absent").length;
  const leaveDays = attendanceLog.filter((r) => r.status === "Leave").length;
  const plannedDays = presentDays + absentDays + leaveDays || attendanceLog.length;
  const attendanceRate = plannedDays
    ? Number(((presentDays / plannedDays) * 100).toFixed(1))
    : 0;
  const totalLeave = leaveBalances.reduce((sum, b) => sum + Number(b.used || 0), 0);
  const pendingApprovals = leaveHistory.filter(
    (r) => String(r.status).toLowerCase() === "pending"
  ).length;

  return {
    totalLeave: Number(totalLeave.toFixed(1)),
    attendanceRate,
    pendingApprovals,
    activeWarnings: 0,
    presentDays,
    plannedDays,
    lateArrivals,
    absentDays,
  };
}

function emptyExtras() {
  return {
    kpis: {
      totalLeave: 0,
      attendanceRate: 0,
      pendingApprovals: 0,
      activeWarnings: 0,
      presentDays: 0,
      plannedDays: 0,
      lateArrivals: 0,
      absentDays: 0,
    },
    attendanceLog: [],
    leaveBalances: [],
    leaveHistory: [],
    timeline: [],
  };
}

/**
 * Charge les blocs manquants de la fiche employé :
 * présence, soldes/historique de congés, timeline + KPI.
 */
export async function loadEmployeeDetailExtras(employee) {
  if (!employee?.id) return emptyExtras();

  const year = new Date().getFullYear();
  const to = toDateInput(new Date());
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 90);
  const from = toDateInput(fromDate);
  const code = employee.matricule || employee.code;

  const [attendanceResult, balancesResult, leavesResult, activitiesResult] =
    await Promise.allSettled([
      attendanceRecordsApiService.fetchAll({
        employee_id: employee.id,
        from,
        to,
      }),
      code && code !== "—"
        ? leaveBalancesApiService.fetchEmployee(code, year)
        : Promise.resolve({ balances: [] }),
      leaveRequestsApiService.fetchAll({ employee_id: employee.id }),
      employeesApiService.fetchActivities(employee.id, { limit: 100 }),
    ]);

  const attendanceRaw =
    attendanceResult.status === "fulfilled" && Array.isArray(attendanceResult.value)
      ? attendanceResult.value
      : [];
  const balancesRaw =
    balancesResult.status === "fulfilled"
      ? balancesResult.value?.balances ?? []
      : [];
  const leavesRaw =
    leavesResult.status === "fulfilled" && Array.isArray(leavesResult.value)
      ? leavesResult.value
      : [];
  const activitiesRaw =
    activitiesResult.status === "fulfilled" && Array.isArray(activitiesResult.value)
      ? activitiesResult.value
      : [];

  const attendanceLog = attendanceRaw
    .map(normalizeAttendanceRow)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const leaveBalances = (Array.isArray(balancesRaw) ? balancesRaw : []).map(
    normalizeLeaveBalance
  );

  const leaveHistory = leavesRaw
    .map(normalizeLeaveHistory)
    .sort((a, b) => String(b.appliedOn).localeCompare(String(a.appliedOn)));

  const timeline = [];
  if (employee.joinDate) {
    timeline.push({
      id: "joined",
      title: t("admin.employees.view.joinedCompany"),
      date: new Date(employee.joinDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      description: `Date of joining: ${employee.joinDate}`,
      category: "status",
    });
  }

  activitiesRaw.forEach((activity, index) => {
    timeline.push(normalizeTimelineEvent(activity, index));
  });

  timeline.sort((a, b) => {
    const da = a.timestamp ? new Date(a.timestamp) : new Date(a.date);
    const db = b.timestamp ? new Date(b.timestamp) : new Date(b.date);
    const aTime = da.getTime();
    const bTime = db.getTime();
    if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
    return bTime - aTime;
  });

  const kpis = computeKpis({ attendanceLog, leaveBalances, leaveHistory });

  const errors = [
    attendanceResult,
    balancesResult,
    leavesResult,
    activitiesResult,
  ]
    .filter((r) => r.status === "rejected")
    .map((r) => parseApiError(r.reason))
    .filter(Boolean);

  return {
    kpis,
    attendanceLog,
    leaveBalances,
    leaveHistory,
    timeline,
    error: errors[0] || "",
  };
}

export { emptyExtras };
