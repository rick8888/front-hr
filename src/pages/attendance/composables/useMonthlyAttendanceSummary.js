import { computed, ref, watch } from "vue";
import { attendanceRecordsApiService } from "../services/attendanceRecords.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { normalizeAttendanceRecord } from "./useAttendanceRecords.js";
import { useI18n } from "../../../i18n/index.js";

const currentMonth = () => new Date().toISOString().slice(0, 7);

function monthRange(month) {
  const [year, monthIndex] = month.split("-").map(Number);
  const last = new Date(year, monthIndex, 0).getDate();
  return {
    from: `${month}-01`,
    to: `${month}-${String(last).padStart(2, "0")}`,
  };
}

/** Jours ouvrés (lun-ven) du mois. */
function workingDaysInMonth(month) {
  const [year, monthIndex] = month.split("-").map(Number);
  const last = new Date(year, monthIndex, 0).getDate();
  let count = 0;
  for (let day = 1; day <= last; day++) {
    const weekday = new Date(year, monthIndex - 1, day).getDay();
    if (weekday !== 0 && weekday !== 6) count++;
  }
  return count;
}

export function formatDuration(minutes, { long = false } = {}) {
  const total = Number(minutes || 0);
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (long) return `${hours}h ${rest}m`;
  return hours ? `${hours}h ${String(rest).padStart(2, "0")}m` : `${rest}m`;
}

export function useMonthlyAttendanceSummary() {
  const { t } = useI18n();
  const employees = ref([]);
  const records = ref([]);
  const loading = ref(false);
  const error = ref("");

  const month = ref(currentMonth());
  const departmentFilter = ref("");
  const employeeFilter = ref("");
  const applied = ref({ department: "", employeeId: "" });

  const search = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const departments = computed(() =>
    [...new Set(employees.value.map((e) => e.department).filter(Boolean))].sort()
  );

  const workingDays = computed(() => workingDaysInMonth(month.value));

  const summaryRows = computed(() => {
    const byEmployee = new Map();
    for (const record of records.value) {
      const list = byEmployee.get(record.employeeId) || [];
      list.push(record);
      byEmployee.set(record.employeeId, list);
    }

    let list = employees.value;
    if (applied.value.department) {
      list = list.filter((e) => e.department === applied.value.department);
    }
    if (applied.value.employeeId) {
      list = list.filter((e) => String(e.id) === String(applied.value.employeeId));
    }

    return list.map((employee) => {
      const employeeRecords = byEmployee.get(employee.id) || [];
      const presentDays = employeeRecords.filter(
        (r) => r.status === "on_time" || r.status === "late"
      ).length;
      const halfDays = employeeRecords.filter(
        (r) => r.status === "half_day"
      ).length;
      const lateDays = employeeRecords.filter(
        (r) => r.status === "late" || r.lateMinutes > 0
      ).length;
      const attendanceEquivalent = presentDays + halfDays * 0.5;
      const sum = (key) =>
        employeeRecords.reduce((total, r) => total + (r[key] || 0), 0);

      return {
        employeeId: employee.id,
        name: employee.name || employee.full_name || "—",
        code: employee.matricule || "",
        department: employee.department || "",
        presentDays,
        absentDays: Math.max(
          0,
          Math.round((workingDays.value - attendanceEquivalent) * 10) / 10
        ),
        lateDays,
        halfDays,
        workingMinutes: sum("workingMinutes"),
        lateMinutes: sum("lateMinutes"),
        earlyOutMinutes: sum("earlyOutMinutes"),
        overtimeMinutes: sum("overtimeMinutes"),
        attendancePct: workingDays.value
          ? Math.round((attendanceEquivalent / workingDays.value) * 100)
          : 0,
      };
    });
  });

  const kpis = computed(() => {
    const rows = summaryRows.value;
    const averageAttendance = rows.length
      ? Math.round(rows.reduce((total, r) => total + r.attendancePct, 0) / rows.length)
      : 0;
    return {
      totalEmployees: rows.length,
      averageAttendance,
      totalWorkingMinutes: rows.reduce((total, r) => total + r.workingMinutes, 0),
      totalOvertimeMinutes: rows.reduce((total, r) => total + r.overtimeMinutes, 0),
    };
  });

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return summaryRows.value;
    return summaryRows.value.filter((row) =>
      [row.name, row.code, row.department].some((value) =>
        String(value || "").toLowerCase().includes(q)
      )
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
  );
  const start = computed(() =>
    filtered.value.length ? (page.value - 1) * pageSize.value : 0
  );
  const end = computed(() =>
    Math.min(page.value * pageSize.value, filtered.value.length)
  );
  const paginated = computed(() => filtered.value.slice(start.value, end.value));

  watch([search, pageSize], () => {
    page.value = 1;
  });
  watch(totalPages, (count) => {
    if (page.value > count) page.value = count;
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const range = monthRange(month.value);
      const [employeeList, recordList] = await Promise.all([
        employees.value.length
          ? Promise.resolve(employees.value)
          : employeesApiService.fetchAll(),
        attendanceRecordsApiService.fetchAll(range),
      ]);
      employees.value = employeeList;
      records.value = recordList.map(normalizeAttendanceRecord);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.reports.monthly.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    applied.value = {
      department: departmentFilter.value,
      employeeId: employeeFilter.value,
    };
    page.value = 1;
    await loadData();
  }

  async function resetFilters() {
    month.value = currentMonth();
    departmentFilter.value = "";
    employeeFilter.value = "";
    applied.value = { department: "", employeeId: "" };
    page.value = 1;
    await loadData();
  }

  return {
    employees,
    loading,
    error,
    month,
    departmentFilter,
    employeeFilter,
    departments,
    search,
    page,
    pageSize,
    workingDays,
    kpis,
    filtered,
    totalPages,
    start,
    end,
    paginated,
    loadData,
    applyFilters,
    resetFilters,
  };
}
