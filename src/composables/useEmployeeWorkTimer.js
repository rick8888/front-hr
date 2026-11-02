import { computed, onMounted, onUnmounted, ref } from "vue";
import { attendanceApiService } from "../pages/self-service/services/attendance.api.service.js";
import { parseApiError } from "../utils/apiErrors.js";
import { minutesSinceCheckIn } from "../utils/attendanceDuration.js";
import { formatHoursLabel } from "../data/dashboardEmployeeDemo.js";
import { useI18n } from "../i18n/index.js";

function toIsoDate(value) {
  if (!value) return "";
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const iso = String(value).match(/\d{4}-\d{2}-\d{2}/);
  return iso ? iso[0] : "";
}

function formatClock(value, locale) {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(value);
  const hours = Number(match[1]);
  const minutes = match[2];
  if (locale === "en") {
    const suffix = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${suffix}`;
  }
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

const EMPTY = {
  todayIso: toIsoDate(new Date()),
  phase: "out",
  checkIn: null,
  checkOut: null,
  checkInRaw: null,
  workingHours: "0m",
  breakMinutes: 0,
  breakStartedAt: null,
  isOnBreak: false,
};

function mapPayload(payload) {
  const today = payload?.today || {};
  const record = today.record || null;
  const checkIn = record?.check_in ?? record?.checkIn ?? null;
  const checkOut = record?.check_out ?? record?.checkOut ?? null;
  const breakStartedAt = record?.active_break_started_at ?? null;
  const isOnBreak = Boolean(record?.is_on_break);
  const dateIso =
    toIsoDate(record?.date ?? today.date) || toIsoDate(new Date());
  const workingMinutes = Number(
    record?.working_minutes ?? record?.workingMinutes ?? 0
  );

  let phase = "out";
  if (checkIn && !checkOut) phase = isOnBreak ? "break" : "in";
  else if (checkIn && checkOut) phase = "done";

  return {
    todayIso: dateIso,
    phase,
    checkIn: checkIn,
    checkOut: checkOut,
    checkInRaw: checkIn,
    workingHours: formatHoursLabel(workingMinutes),
    breakMinutes: Math.max(
      0,
      Number(record?.recorded_break_minutes ?? record?.break_minutes ?? 0) || 0,
    ),
    breakStartedAt,
    isOnBreak,
  };
}

/** Pointage flottant (FAB + modal présence). */
export function useEmployeeWorkTimer() {
  const { t, locale } = useI18n();
  const open = ref(false);
  const loading = ref(true);
  const acting = ref(false);
  const error = ref("");
  const state = ref({ ...EMPTY });
  const tick = ref(0);
  let tickTimer = null;

  const summary = computed(() => {
    void tick.value;
    void locale.value;
    const s = state.value;
    const workingHours =
      (s.phase === "in" || s.phase === "break") && s.checkInRaw
        ? formatHoursLabel(minutesSinceCheckIn(s.checkInRaw, s.todayIso))
        : s.workingHours;
    const activeBreakTimestamp = s.isOnBreak && s.breakStartedAt
      ? Date.parse(s.breakStartedAt)
      : Number.NaN;
    const activeBreakMinutes = Number.isFinite(activeBreakTimestamp)
      ? Math.max(0, Math.floor((Date.now() - activeBreakTimestamp) / 60000))
      : 0;
    return {
      checkIn: formatClock(s.checkIn, locale.value) || "—",
      checkOut: formatClock(s.checkOut, locale.value) || "—",
      workingHours: workingHours || "0m",
      breakDuration: formatHoursLabel(s.breakMinutes + activeBreakMinutes),
    };
  });

  const durationLabel = computed(() => {
    void tick.value;
    void locale.value;
    const s = state.value;
    if ((s.phase === "in" || s.phase === "break") && s.checkInRaw) {
      if (s.phase === "break") return summary.value.breakDuration;
      return formatHoursLabel(minutesSinceCheckIn(s.checkInRaw, s.todayIso));
    }
    if (s.phase === "done") return s.workingHours || "0m";
    return t("ss.attendance.modal.fabCheckIn");
  });

  const modalTitle = computed(() => {
    void locale.value;
    if (state.value.phase === "in") return t("ss.attendance.modal.titleIn");
    if (state.value.phase === "break") return t("ss.attendance.modal.titleBreak");
    if (state.value.phase === "done") return t("ss.attendance.modal.titleOut");
    return t("ss.attendance.modal.titleReady");
  });

  const todayIso = computed(() => state.value.todayIso);
  const phase = computed(() => state.value.phase);

  function applyPayload(payload) {
    state.value = mapPayload(payload);
  }

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      applyPayload(await attendanceApiService.fetchMine());
    } catch (e) {
      error.value =
        parseApiError(e) || t("ss.attendance.modal.loadError");
      state.value = { ...EMPTY };
    } finally {
      loading.value = false;
    }
  }

  async function checkIn() {
    acting.value = true;
    error.value = "";
    try {
      applyPayload(await attendanceApiService.checkIn());
    } catch (e) {
      error.value = parseApiError(e) || t("ss.attendance.modal.checkInError");
    } finally {
      acting.value = false;
    }
  }

  async function checkOut() {
    acting.value = true;
    error.value = "";
    try {
      applyPayload(await attendanceApiService.checkOut());
      open.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("ss.attendance.modal.checkOutError");
    } finally {
      acting.value = false;
    }
  }

  async function startBreak() {
    acting.value = true;
    error.value = "";
    try {
      applyPayload(await attendanceApiService.startBreak());
    } catch (e) {
      error.value = parseApiError(e) || t("ss.attendance.modal.startBreakError");
    } finally {
      acting.value = false;
    }
  }

  async function endBreak() {
    acting.value = true;
    error.value = "";
    try {
      applyPayload(await attendanceApiService.endBreak());
    } catch (e) {
      error.value = parseApiError(e) || t("ss.attendance.modal.endBreakError");
    } finally {
      acting.value = false;
    }
  }

  onMounted(() => {
    load();
    tickTimer = window.setInterval(() => {
      tick.value += 1;
    }, 30000);
  });

  onUnmounted(() => {
    if (tickTimer) window.clearInterval(tickTimer);
  });

  return {
    open,
    loading,
    acting,
    error,
    summary,
    durationLabel,
    modalTitle,
    todayIso,
    phase,
    load,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
  };
}
