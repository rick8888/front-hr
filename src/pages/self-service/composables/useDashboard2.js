import { computed, onMounted, ref, unref, watch } from "vue";
import { useAuthStore } from "../../../stores/authStore.js";
import { attendanceApiService } from "../services/attendance.api.service.js";
import { leaveRequestsApiService } from "../../leave/services/leaveRequests.api.service.js";
import { expensesApiService } from "../services/expenses.api.service.js";
import { trainingEnrollmentsApiService } from "../../training/services/trainings.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { formatHoursLabel } from "../../../data/dashboardEmployeeDemo.js";
import { useI18n } from "../../../i18n/index.js";

function toIsoDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function parseLocalDate(iso) {
  if (!iso) return null;
  const d = new Date(`${toIsoDate(iso)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatTime(value, locale = "en-US") {
  if (!value) return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return raw;
  const d = new Date();
  d.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

function titleCase(value) {
  const raw = String(value || "").replace(/[_-]+/g, " ").trim();
  if (!raw) return "";
  return raw
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

function formatMoney(amount, currency = "USD", locale = "en-US") {
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount ?? "");
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency || ""}`.trim();
  }
}

function formatLeaveRange(start, end, locale = "en-US") {
  const a = parseLocalDate(start);
  const b = parseLocalDate(end || start);
  if (!a) return "—";
  const opts = { month: "short", day: "2-digit", year: "numeric" };
  if (!b || toIsoDate(start) === toIsoDate(end)) {
    return a.toLocaleDateString(locale, opts);
  }
  const sameYear = a.getFullYear() === b.getFullYear();
  const left = a.toLocaleDateString(locale, {
    month: "short",
    day: "2-digit",
    year: sameYear ? undefined : "numeric",
  });
  const right = b.toLocaleDateString(locale, opts);
  return `${left} - ${right}`;
}

function minutesSinceCheckIn(checkIn, dayIso) {
  if (!checkIn) return 0;
  const match = String(checkIn).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const now = new Date();
  const base = dayIso ? new Date(`${toIsoDate(dayIso)}T00:00:00`) : new Date();
  if (Number.isNaN(base.getTime())) return 0;
  base.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return Math.max(0, Math.floor((now.getTime() - base.getTime()) / 60000));
}

function sumWorkingMinutes(history, predicate, liveExtra = 0) {
  const total = (Array.isArray(history) ? history : []).reduce((sum, row) => {
    const iso = toIsoDate(row.date ?? row.attendance_date);
    const d = parseLocalDate(iso);
    if (!d || !predicate(d, row)) return sum;
    return sum + Number(row.working_minutes ?? row.workingMinutes ?? 0);
  }, 0);
  return total + liveExtra;
}

function mapLeaveStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "cancelled") return "Cancelled";
  if (s === "rejected") return "Rejected";
  if (s === "approved") return "Approved";
  if (s === "pending") return "Pending";
  return titleCase(status) || "Pending";
}

function mapExpenseStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "reimbursed") return "Reimbursed";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  if (s === "cancelled") return "Cancelled";
  if (s === "pending") return "Pending";
  return titleCase(status) || "Pending";
}

function mapEnrollmentStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "completed") return "Completed";
  if (s === "cancelled") return "Cancelled";
  if (s === "in_progress" || s === "enrolled") return "In_Progress";
  return titleCase(status).replace(/\s+/g, "_") || "In_Progress";
}

function mapTodayAttendance(payload, locale = "en-US") {
  const today = payload?.today || {};
  const record = today.record || null;
  const checkIn = record?.check_in ?? record?.checkIn ?? null;
  const checkOut = record?.check_out ?? record?.checkOut ?? null;
  const statusRaw = String(record?.status || "").toLowerCase();

  if (!record || !today.has_record) {
    return {
      statusKey: "notCheckedIn",
      checkInTime: null,
      workingDuration: null,
      checkOutTime: null,
    };
  }

  if (statusRaw === "leave") {
    return {
      statusKey: "onLeave",
      checkInTime: formatTime(checkIn, locale),
      workingDuration: null,
      checkOutTime: formatTime(checkOut, locale),
    };
  }

  if (checkIn && !checkOut) {
    const live = minutesSinceCheckIn(checkIn, record.date ?? today.date);
    return {
      statusKey: "inProgress",
      checkInTime: formatTime(checkIn, locale),
      workingDuration: formatHoursLabel(live),
      checkOutTime: null,
    };
  }

  return {
    statusKey: "checkedOut",
    checkInTime: formatTime(checkIn, locale),
    workingDuration: formatHoursLabel(
      record.working_minutes ?? record.workingMinutes ?? 0
    ),
    checkOutTime: formatTime(checkOut, locale),
  };
}

function normalizeLeaveActivity(raw, t, locale) {
  const status = mapLeaveStatus(raw.status);
  return {
    id: raw.id,
    label: raw.leave_type ? `${raw.leave_type}` : t("ss.dashboard2.leaveRequest"),
    range: formatLeaveRange(raw.start_date ?? raw.startDate, raw.end_date ?? raw.endDate, locale),
    status,
    occurredOn: toIsoDate(
      raw.submitted_at ?? raw.submittedAt ?? raw.created_at ?? raw.end_date ?? raw.start_date
    ),
  };
}

function normalizeExpenseActivity(raw, locale) {
  const amount = formatMoney(raw.amount, raw.currency || "MAD", locale);
  const type = titleCase(raw.type) || "Expense";
  return {
    id: raw.id,
    label: raw.description || type,
    range: `${amount} - ${type}`,
    status: mapExpenseStatus(raw.status),
    occurredOn: toIsoDate(raw.expense_date ?? raw.expenseDate ?? raw.created_at),
  };
}

function normalizeTaskActivity(raw, t) {
  const training = raw.training || {};
  return {
    id: raw.id,
    label: training.name || raw.training_name || t("ss.dashboard2.training"),
    range: titleCase(training.category || raw.category || t("ss.dashboard2.training")),
    status: mapEnrollmentStatus(raw.status),
    occurredOn: toIsoDate(
      raw.updated_at ?? raw.created_at ?? training.start_date
    ),
  };
}

export function useDashboard2(options = {}) {
  const auth = useAuthStore();
  const { t, locale, bcp47 } = useI18n();
  const punchingRef = options.punching;
  const error = ref("");

  const loadingAttendance = ref(true);
  const loadingLeaves = ref(true);
  const loadingExpenses = ref(true);
  const loadingTasks = ref(true);

  const todayIso = ref(toIsoDate(new Date()));
  const kpis = ref({
    weekHoursMinutes: 0,
    monthHoursMinutes: 0,
    totalLeaves: 0,
    leavesApproved: 0,
    leavesPending: 0,
    myTasks: 0,
    tasksCompleted: 0,
    tasksPending: 0,
  });
  const attendance = ref({
    statusKey: "notCheckedIn",
    checkInTime: null,
    workingDuration: null,
    checkOutTime: null,
  });
  const recentActivities = ref({
    leaves: [],
    expenses: [],
    tasks: [],
  });

  const user = computed(() => {
    void locale.value;
    return {
      name: auth.user?.name || t("ss.dashboard2.defaultUserName"),
      greeting: t("ss.dashboard2.greeting"),
      subtitle: t("ss.dashboard2.subtitle"),
    };
  });

  const weekHoursLabel = computed(() =>
    formatHoursLabel(kpis.value.weekHoursMinutes)
  );
  const monthHoursLabel = computed(() =>
    formatHoursLabel(kpis.value.monthHoursMinutes)
  );
  const leavesNote = computed(() => {
    void locale.value;
    return t("ss.dashboard2.kpi.leavesNote", {
      approved: kpis.value.leavesApproved,
      pending: kpis.value.leavesPending,
    });
  });
  const tasksNote = computed(() => {
    void locale.value;
    return t("ss.dashboard2.kpi.tasksNote", {
      completed: kpis.value.tasksCompleted,
      pending: kpis.value.tasksPending,
    });
  });

  const attendancePhase = computed(() => {
    const key = attendance.value?.statusKey;
    if (key === "inProgress") return "in";
    if (key === "checkedOut") return "done";
    return "out";
  });

  const quickActions = computed(() => {
    void locale.value;
    const punching = unref(punchingRef) ?? false;
    let punchAction;
    if (attendancePhase.value === "in") {
      punchAction = {
        id: "checkOut",
        label: t("ss.dashboard2.quickActions.checkOut"),
        icon: "checkOut",
        variant: "amber",
        loading: punching,
      };
    } else if (attendancePhase.value === "done") {
      punchAction = {
        id: "checkOut",
        label: t("ss.dashboard2.quickActions.checkedOut"),
        icon: "checkOut",
        variant: "amber",
        disabled: true,
        loading: false,
      };
    } else {
      punchAction = {
        id: "checkIn",
        label: t("ss.dashboard2.quickActions.checkIn"),
        icon: "checkIn",
        variant: "emerald",
        loading: punching,
      };
    }
    return [
      punchAction,
      {
        id: "applyLeave",
        label: t("ss.dashboard2.quickActions.applyLeave"),
        icon: "leave",
        variant: "sky",
      },
      {
        id: "submitExpense",
        label: t("ss.dashboard2.quickActions.submitExpense"),
        icon: "expense",
        variant: "amber",
      },
      {
        id: "myProfile",
        label: t("ss.dashboard2.quickActions.myProfile"),
        icon: "profile",
        variant: "secondary",
      },
    ];
  });

  async function loadAttendance() {
    loadingAttendance.value = true;
    try {
      const attendancePayload = await attendanceApiService.fetchMine();
      const history = Array.isArray(attendancePayload?.history)
        ? attendancePayload.history
        : [];
      const todayRecord = attendancePayload?.today?.record || null;
      const liveToday =
        todayRecord &&
        (todayRecord.check_in || todayRecord.checkIn) &&
        !(todayRecord.check_out || todayRecord.checkOut)
          ? minutesSinceCheckIn(
              todayRecord.check_in ?? todayRecord.checkIn,
              todayRecord.date ?? attendancePayload?.today?.date
            )
          : 0;

      const now = new Date();
      const weekStart = startOfWeek(now);
      const monthStart = startOfMonth(now);

      kpis.value = {
        ...kpis.value,
        weekHoursMinutes: sumWorkingMinutes(
          history,
          (d) => d >= weekStart && d <= now,
          liveToday
        ),
        monthHoursMinutes: sumWorkingMinutes(
          history,
          (d) => d >= monthStart && d <= now,
          liveToday
        ),
      };
      attendance.value = mapTodayAttendance(attendancePayload, bcp47.value);
    } catch (e) {
      error.value = parseApiError(e) || t("ss.dashboard2.loadError");
    } finally {
      loadingAttendance.value = false;
    }
  }

  async function loadLeaves() {
    loadingLeaves.value = true;
    try {
      const leaves = await leaveRequestsApiService.fetchAll({ mine: 1 });
      const leaveList = Array.isArray(leaves) ? leaves : [];
      const leavesApproved = leaveList.filter(
        (r) => String(r.status).toLowerCase() === "approved"
      ).length;
      const leavesPending = leaveList.filter(
        (r) => String(r.status).toLowerCase() === "pending"
      ).length;

      kpis.value = {
        ...kpis.value,
        totalLeaves: leaveList.length,
        leavesApproved,
        leavesPending,
      };
      recentActivities.value = {
        ...recentActivities.value,
        leaves: leaveList
          .map((row) => normalizeLeaveActivity(row, t, bcp47.value))
          .sort((a, b) =>
            String(b.occurredOn).localeCompare(String(a.occurredOn))
          )
          .slice(0, 8),
      };
    } catch {
      recentActivities.value = { ...recentActivities.value, leaves: [] };
    } finally {
      loadingLeaves.value = false;
    }
  }

  async function loadExpenses() {
    loadingExpenses.value = true;
    try {
      const expenses = await expensesApiService.fetchAll({ mine: 1 });
      const expenseList = Array.isArray(expenses) ? expenses : [];
      recentActivities.value = {
        ...recentActivities.value,
        expenses: expenseList
          .map((row) => normalizeExpenseActivity(row, bcp47.value))
          .sort((a, b) =>
            String(b.occurredOn).localeCompare(String(a.occurredOn))
          )
          .slice(0, 8),
      };
    } catch {
      recentActivities.value = { ...recentActivities.value, expenses: [] };
    } finally {
      loadingExpenses.value = false;
    }
  }

  async function loadTasks() {
    loadingTasks.value = true;
    try {
      const enrollments = await trainingEnrollmentsApiService.fetchAll({
        mine: 1,
      });
      const enrollmentList = (
        Array.isArray(enrollments) ? enrollments : []
      ).filter((row) => String(row.status || "").toLowerCase() !== "cancelled");

      const tasksCompleted = enrollmentList.filter(
        (r) => String(r.status).toLowerCase() === "completed"
      ).length;
      const tasksPending = enrollmentList.filter((r) =>
        ["enrolled", "in_progress"].includes(String(r.status).toLowerCase())
      ).length;

      kpis.value = {
        ...kpis.value,
        myTasks: enrollmentList.length,
        tasksCompleted,
        tasksPending,
      };
      recentActivities.value = {
        ...recentActivities.value,
        tasks: enrollmentList
          .map((row) => normalizeTaskActivity(row, t))
          .sort((a, b) =>
            String(b.occurredOn).localeCompare(String(a.occurredOn))
          )
          .slice(0, 8),
      };
    } catch {
      recentActivities.value = { ...recentActivities.value, tasks: [] };
    } finally {
      loadingTasks.value = false;
    }
  }

  async function load() {
    error.value = "";
    todayIso.value = toIsoDate(new Date());
    await Promise.all([
      loadAttendance(),
      loadLeaves(),
      loadExpenses(),
      loadTasks(),
    ]);
  }

  onMounted(load);

  watch(locale, () => {
    loadAttendance();
    loadLeaves();
    loadExpenses();
    loadTasks();
  });

  return {
    error,
    loadingAttendance,
    loadingLeaves,
    loadingExpenses,
    loadingTasks,
    today: todayIso,
    user,
    kpis,
    attendance,
    recentActivities,
    weekHoursLabel,
    monthHoursLabel,
    leavesNote,
    tasksNote,
    quickActions,
    attendancePhase,
    load,
    loadAttendance,
    formatHoursLabel,
  };
}
