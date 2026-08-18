import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "../../../stores/authStore.js";
import { adminDashboardApiService } from "../services/adminDashboard.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function toIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const KPI_KEYS = {
  employees: "admin.dashboard.kpi.totalEmployee",
  applicants: "admin.dashboard.kpi.totalApplicant",
  attendance: "admin.dashboard.kpi.todayAttendance",
  open_positions: "admin.dashboard.kpi.openPositions",
};

function translateStatus(status, t) {
  const key = String(status || "").toLowerCase();
  if (key === "on time") return t("admin.dashboard.status.onTime");
  if (key === "late") return t("admin.dashboard.status.late");
  if (key === "absent") return t("admin.dashboard.status.absent");
  return status || "—";
}

export function useAdminDashboard() {
  const authStore = useAuthStore();
  const { t, locale, bcp47 } = useI18n();
  const loading = ref(true);
  const error = ref("");
  const chartFilter = ref("today");

  const kpiPlaceholders = computed(() => {
    void locale.value;
    return [
      { id: "employees", title: t("admin.dashboard.kpi.totalEmployee"), value: "—", change: "", updateDate: "", changeDirection: "up" },
      { id: "applicants", title: t("admin.dashboard.kpi.totalApplicant"), value: "—", change: "", updateDate: "", changeDirection: "up" },
      { id: "attendance", title: t("admin.dashboard.kpi.todayAttendance"), value: "—", change: "", updateDate: "", changeDirection: "up" },
      { id: "open_positions", title: t("admin.dashboard.kpi.openPositions"), value: "—", change: "", updateDate: "", changeDirection: "up" },
    ];
  });

  const stats = ref([]);
  const chartData = ref([]);
  const attendanceList = ref([]);
  const scheduledEvents = ref([]);
  const scheduleHighlightDates = ref([]);

  const currentDate = ref(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const currentMonth = computed(() => {
    void locale.value;
    return currentDate.value.toLocaleDateString(bcp47.value, {
      month: "long",
      year: "numeric",
    });
  });

  const weekdayLabels = computed(() => {
    void locale.value;
    const base = new Date(2026, 0, 4);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(bcp47.value, { weekday: "short" });
    });
  });

  const highlightSet = computed(() => new Set(scheduleHighlightDates.value));

  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    const today = new Date();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: highlightSet.value.has(toIsoDate(date)),
        date,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        isSelected: highlightSet.value.has(toIsoDate(date)),
        date,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: highlightSet.value.has(toIsoDate(date)),
        date,
      });
    }

    return days;
  });

  async function load() {
    if (!authStore.isAdmin) return;
    loading.value = true;
    error.value = "";
    try {
      const payload = await adminDashboardApiService.fetch({
        period: chartFilter.value,
      });

      stats.value = (Array.isArray(payload.kpis) ? payload.kpis : []).map(
        (kpi) => ({
          id: kpi.id,
          title: KPI_KEYS[kpi.id] ? t(KPI_KEYS[kpi.id]) : (kpi.title || kpi.id),
          value: String(kpi.value ?? 0),
          change: kpi.change || "0%",
          updateDate: kpi.update_date || kpi.updateDate || "",
          changeDirection: kpi.change_direction || kpi.changeDirection || "up",
        })
      );

      chartData.value = Array.isArray(payload.attendance_chart)
        ? payload.attendance_chart
        : [];

      attendanceList.value = (
        Array.isArray(payload.attendance_today) ? payload.attendance_today : []
      ).map((row) => ({
        id: row.id,
        name: row.name || "—",
        initials: row.initials || "—",
        designation: row.designation || "—",
        type: row.type === "Office" ? t("admin.dashboard.type.office") : (row.type || t("admin.dashboard.type.office")),
        checkIn: row.check_in || row.checkIn || "—",
        status: translateStatus(row.status, t),
        statusKey: String(row.status || "").toLowerCase(),
      }));

      scheduledEvents.value = Array.isArray(payload.schedule)
        ? payload.schedule
        : [];
      scheduleHighlightDates.value = Array.isArray(payload.schedule_dates)
        ? payload.schedule_dates
        : [];
    } catch (e) {
      error.value = parseApiError(e) || t("admin.dashboard.loadError");
      stats.value = [...kpiPlaceholders.value];
      chartData.value = [];
      attendanceList.value = [];
      scheduledEvents.value = [];
      scheduleHighlightDates.value = [];
    } finally {
      loading.value = false;
    }
  }

  function previousMonth() {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
  }

  function nextMonth() {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    );
  }

  function selectDate() {}

  function getAvatarColor(name) {
    const colors = [
      "bg-primary-500",
      "bg-secondary-500",
      "bg-success-500",
      "bg-warning-500",
      "bg-error-500",
      "bg-info-500",
      "bg-secondary-600",
      "bg-primary-600",
      "bg-success-600",
      "bg-info-600",
    ];
    const index = String(name || "A").charCodeAt(0) % colors.length;
    return colors[index];
  }

  watch(chartFilter, () => {
    load();
  });

  watch(locale, () => {
    if (authStore.isAdmin && !loading.value) {
      load();
    }
  });

  onMounted(load);

  return {
    loading,
    error,
    stats,
    chartFilter,
    filteredChartData: chartData,
    attendanceList,
    scheduledEvents,
    currentDate,
    currentMonth,
    weekdayLabels,
    calendarDays,
    previousMonth,
    nextMonth,
    selectDate,
    getAvatarColor,
    load,
  };
}
