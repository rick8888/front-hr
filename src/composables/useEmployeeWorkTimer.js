import { computed, onMounted, onUnmounted, ref } from "vue";
import { attendanceApiService } from "../pages/self-service/services/attendance.api.service.js";
import { parseApiError } from "../utils/apiErrors.js";
import { formatHoursLabel } from "../data/dashboardEmployeeDemo.js";

function toIsoDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function formatTime12(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return raw;
  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

function minutesSinceCheckIn(checkIn, dayIso) {
  if (!checkIn) return 0;
  const match = String(checkIn).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const day = toIsoDate(dayIso) || toIsoDate(new Date());
  const start = new Date(
    `${day}T${String(match[1]).padStart(2, "0")}:${match[2]}:00`
  );
  if (Number.isNaN(start.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 60000));
}

const EMPTY = {
  todayIso: toIsoDate(new Date()),
  phase: "out",
  checkIn: null,
  checkOut: null,
  checkInRaw: null,
  workingHours: "0m",
};

function mapPayload(payload) {
  const today = payload?.today || {};
  const record = today.record || null;
  const checkIn = record?.check_in ?? record?.checkIn ?? null;
  const checkOut = record?.check_out ?? record?.checkOut ?? null;
  const dateIso =
    toIsoDate(record?.date ?? today.date) || toIsoDate(new Date());
  const workingMinutes = Number(
    record?.working_minutes ?? record?.workingMinutes ?? 0
  );

  let phase = "out";
  if (checkIn && !checkOut) phase = "in";
  else if (checkIn && checkOut) phase = "done";

  return {
    todayIso: dateIso,
    phase,
    checkIn: formatTime12(checkIn),
    checkOut: formatTime12(checkOut),
    checkInRaw: checkIn,
    workingHours: formatHoursLabel(workingMinutes),
  };
}

/** Pointage flottant (FAB + modal présence). */
export function useEmployeeWorkTimer() {
  const open = ref(false);
  const loading = ref(true);
  const acting = ref(false);
  const error = ref("");
  const state = ref({ ...EMPTY });
  const tick = ref(0);
  let tickTimer = null;

  const summary = computed(() => {
    void tick.value;
    const s = state.value;
    const workingHours =
      s.phase === "in" && s.checkInRaw
        ? formatHoursLabel(minutesSinceCheckIn(s.checkInRaw, s.todayIso))
        : s.workingHours;
    return {
      checkIn: s.checkIn || "—",
      checkOut: s.checkOut || "—",
      workingHours: workingHours || "0m",
    };
  });

  const durationLabel = computed(() => {
    void tick.value;
    const s = state.value;
    if (s.phase === "in" && s.checkInRaw) {
      return formatHoursLabel(minutesSinceCheckIn(s.checkInRaw, s.todayIso));
    }
    if (s.phase === "done") return s.workingHours || "0m";
    return "Check In";
  });

  const modalTitle = computed(() => {
    if (state.value.phase === "in") return "You are Checked In";
    if (state.value.phase === "done") return "You are Checked Out";
    return "Ready to Check In";
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
        parseApiError(e) || "Impossible de charger la présence du jour.";
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
      error.value = parseApiError(e) || "Échec du pointage d’entrée.";
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
      error.value = parseApiError(e) || "Échec du pointage de sortie.";
    } finally {
      acting.value = false;
    }
  }

  function startBreak() {
    error.value = "Les pauses ne sont pas encore disponibles.";
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
  };
}
