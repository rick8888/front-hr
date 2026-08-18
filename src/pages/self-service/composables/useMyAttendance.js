import { computed, onMounted, ref } from "vue";
import { format, parseISO, isValid } from "date-fns";
import { attendanceApiService } from "../services/attendance.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";

function parseDate(iso) {
  if (!iso) return null;
  try {
    const d = parseISO(String(iso).slice(0, 10));
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

function formatDisplayDate(iso) {
  const d = parseDate(iso);
  return d ? format(d, "MMM dd, yyyy") : iso || "—";
}

function formatDayName(iso) {
  const d = parseDate(iso);
  return d ? format(d, "EEEE") : "—";
}

function formatTime12(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return raw;
  let hours = Number(match[1]);
  const minutes = match[2];
  const seconds = match[3] || "00";
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${suffix}`;
}

function formatOvertime(minutes) {
  const m = Number(minutes) || 0;
  if (m <= 0) return null;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r}m`;
  if (r === 0) return `${h}h`;
  return `${h}h ${r}m`;
}

function statusLabel(rawStatus, checkIn, checkOut) {
  if (checkIn && !checkOut) return "Checked in";
  const map = {
    on_time: "Present",
    late: "Late",
    half_day: "Half Day",
    leave: "Leave",
    absent: "Absent",
  };
  return map[rawStatus] || rawStatus || "—";
}

function buildLogs(raw) {
  const location = raw.location || "N/A";
  const logs = [];
  if (raw.check_in || raw.checkIn) {
    logs.push({
      type: "Check In",
      time: formatTime12(raw.check_in ?? raw.checkIn),
      location,
    });
  }
  if (raw.check_out || raw.checkOut) {
    logs.push({
      type: "Check Out",
      time: formatTime12(raw.check_out ?? raw.checkOut),
      location,
    });
  }
  return logs;
}

function toSelfServiceRow(raw) {
  if (!raw) return null;
  const isoDate = raw.date ?? raw.attendance_date ?? "";
  const checkInRaw = raw.check_in ?? raw.checkIn ?? null;
  const checkOutRaw = raw.check_out ?? raw.checkOut ?? null;
  const statusValue = raw.status ?? "on_time";
  const totalMinutes = Number(raw.working_minutes ?? raw.workingMinutes ?? 0);
  const overtimeMinutes = Number(raw.overtime_minutes ?? raw.overtimeMinutes ?? 0);

  return {
    id: raw.id,
    isoDate,
    date: formatDisplayDate(isoDate),
    day: formatDayName(isoDate),
    checkIn: formatTime12(checkInRaw),
    checkOut: formatTime12(checkOutRaw),
    totalMinutes,
    overtime: formatOvertime(overtimeMinutes),
    status: statusLabel(statusValue, checkInRaw, checkOutRaw),
    statusValue,
    location: raw.location || "N/A",
    logs: buildLogs(raw),
  };
}

const EMPTY_SUMMARY = {
  presentDays: 0,
  absentDays: 0,
  lateArrivals: 0,
  halfDays: 0,
  monthLabel: "This Month",
};

const EMPTY_TODAY = {
  date: format(new Date(), "EEEE, MMMM dd, yyyy"),
  hasRecord: false,
  record: null,
  message:
    "No attendance record for today. Please check in to mark your attendance.",
};

export function useMyAttendance() {
  const records = ref([]);
  const summary = ref({ ...EMPTY_SUMMARY });
  const today = ref({ ...EMPTY_TODAY });
  const loading = ref(true);
  const error = ref("");
  const dateRange = ref("");
  const rangeStart = ref(null);
  const rangeEnd = ref(null);

  const {
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  } = usePaginatedSearch(records, {
    pageSize: 10,
    searchFields: ["date", "day", "status"],
    customFilter: (row) => {
      if (!rangeStart.value) return true;
      const d = parseDate(row.isoDate);
      if (!d) return true;
      if (rangeEnd.value) return d >= rangeStart.value && d <= rangeEnd.value;
      return d.toDateString() === rangeStart.value.toDateString();
    },
  });

  function onChangeRange({ start, end }) {
    rangeStart.value = start;
    rangeEnd.value = end;
    page.value = 1;
  }

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const payload = await attendanceApiService.fetchMine();
      const history = Array.isArray(payload.history) ? payload.history : [];
      records.value = history.map(toSelfServiceRow).filter(Boolean);

      const s = payload.summary || {};
      summary.value = {
        presentDays: Number(s.present_days ?? s.presentDays ?? 0),
        absentDays: Number(s.absent_days ?? s.absentDays ?? 0),
        lateArrivals: Number(s.late_arrivals ?? s.lateArrivals ?? 0),
        halfDays: Number(s.half_days ?? s.halfDays ?? 0),
        monthLabel: s.month_label || s.monthLabel || "This Month",
      };

      const t = payload.today || {};
      const todayRow = toSelfServiceRow(t.record);
      today.value = {
        date: t.date_label || t.dateLabel || EMPTY_TODAY.date,
        hasRecord: Boolean(t.has_record ?? t.hasRecord ?? todayRow),
        record: todayRow,
        message:
          t.message ||
          "No attendance record for today. Please check in to mark your attendance.",
      };
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos présences.";
      records.value = [];
      summary.value = { ...EMPTY_SUMMARY };
      today.value = { ...EMPTY_TODAY };
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return {
    loading,
    error,
    summary: computed(() => summary.value),
    today: computed(() => today.value),
    records,
    dateRange,
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    onChangeRange,
    load,
  };
}
