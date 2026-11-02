import { computed, ref, watch } from "vue";
import { attendanceRecordsApiService } from "../services/attendanceRecords.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { shiftsApiService } from "../services/shifts.api.service.js";
import { normalizeEmployee } from "../../employees/composables/useEmployees.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { normalizeAttendanceRecord } from "./useAttendanceRecords.js";
import {
  fetchDepartmentCatalog,
  mergeDepartmentNames,
} from "./attendanceReportFilters.js";
import { useI18n } from "../../../i18n/index.js";

const isoDate = (date) => date.toISOString().slice(0, 10);

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from: isoDate(from), to: isoDate(to) };
}

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function useLateArrivalsReport() {
  const { t } = useI18n();
  const employees = ref([]);
  const departmentCatalog = ref([]);
  const shifts = ref([]);
  const records = ref([]);
  const loading = ref(false);
  const error = ref("");

  const range = defaultRange();
  const fromDate = ref(range.from);
  const toDate = ref(range.to);
  const departmentFilter = ref("");
  const employeeFilter = ref("");
  const minLateMinutes = ref(0);
  const applied = ref({ department: "", employeeId: "", minLate: 0 });

  const search = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const departments = computed(() =>
    mergeDepartmentNames(departmentCatalog.value, employees.value)
  );

  const employeeById = computed(() => {
    const map = new Map();
    for (const employee of employees.value) map.set(employee.id, employee);
    return map;
  });

  const shiftById = computed(() => {
    const map = new Map();
    for (const shift of shifts.value) map.set(shift.id, shift);
    return map;
  });

  /** Instances de retard enrichies (département, horaire prévu). */
  const lateInstances = computed(() => {
    const minLate = Number(applied.value.minLate || 0);
    return records.value
      .filter((record) => record.lateMinutes > 0 || record.status === "late")
      .filter((record) => record.lateMinutes >= minLate)
      .map((record) => {
        const employee = employeeById.value.get(record.employeeId);
        const shift = shiftById.value.get(record.shiftId);
        const day = record.date
          ? WEEKDAYS[new Date(`${record.date}T12:00:00`).getDay()]
          : "—";
        return {
          ...record,
          department: employee?.department || "—",
          day,
          scheduledTime: shift?.start_time || shift?.start || null,
        };
      })
      .filter((record) =>
        applied.value.department
          ? record.department === applied.value.department
          : true
      )
      .filter((record) =>
        applied.value.employeeId
          ? String(record.employeeId) === String(applied.value.employeeId)
          : true
      );
  });

  const kpis = computed(() => {
    const instances = lateInstances.value;
    const total = instances.length;
    const avg = total
      ? Math.round(instances.reduce((sum, r) => sum + r.lateMinutes, 0) / total)
      : 0;

    let mostLate = null;
    if (total) {
      const counts = new Map();
      for (const record of instances) {
        counts.set(record.employee, (counts.get(record.employee) || 0) + 1);
      }
      mostLate = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }

    return { total, avgLateMinutes: avg, mostLateEmployee: mostLate };
  });

  const byDayOfWeek = computed(() => {
    const counts = WEEKDAYS.map((day) => ({ day, count: 0 }));
    for (const record of lateInstances.value) {
      const index = WEEKDAYS.indexOf(record.day);
      if (index !== -1) counts[index].count++;
    }
    return counts;
  });

  const trend = computed(() => {
    const counts = new Map();
    for (const record of lateInstances.value) {
      counts.set(record.date, (counts.get(record.date) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));
  });

  const topEmployees = computed(() => {
    const counts = new Map();
    for (const record of lateInstances.value) {
      counts.set(record.employee, (counts.get(record.employee) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  });

  const byDepartment = computed(() => {
    const counts = new Map();
    for (const record of lateInstances.value) {
      counts.set(record.department, (counts.get(record.department) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  });

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return lateInstances.value;
    return lateInstances.value.filter((record) =>
      [record.employee, record.employeeCode, record.department, record.shift, record.date]
        .some((value) => String(value || "").toLowerCase().includes(q))
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
      const [employeeList, shiftList, recordList, deptList] = await Promise.all([
        employees.value.length
          ? Promise.resolve(employees.value)
          : employeesApiService.fetchAll(),
        shifts.value.length
          ? Promise.resolve(shifts.value)
          : shiftsApiService.fetchAll(),
        attendanceRecordsApiService.fetchAll({
          from: fromDate.value,
          to: toDate.value,
        }),
        fetchDepartmentCatalog(departmentCatalog.value),
      ]);
      employees.value = (Array.isArray(employeeList) ? employeeList : []).map(
        normalizeEmployee
      );
      departmentCatalog.value = deptList;
      shifts.value = shiftList;
      records.value = recordList.map(normalizeAttendanceRecord);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.reports.late.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    applied.value = {
      department: departmentFilter.value,
      employeeId: employeeFilter.value,
      minLate: Number(minLateMinutes.value || 0),
    };
    page.value = 1;
    await loadData();
  }

  async function resetFilters() {
    const range = defaultRange();
    fromDate.value = range.from;
    toDate.value = range.to;
    departmentFilter.value = "";
    employeeFilter.value = "";
    minLateMinutes.value = 0;
    applied.value = { department: "", employeeId: "", minLate: 0 };
    page.value = 1;
    await loadData();
  }

  return {
    employees,
    loading,
    error,
    fromDate,
    toDate,
    departmentFilter,
    employeeFilter,
    minLateMinutes,
    departments,
    search,
    page,
    pageSize,
    kpis,
    byDayOfWeek,
    trend,
    topEmployees,
    byDepartment,
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
