import { computed, ref, watch } from "vue";
import { attendanceRecordsApiService } from "../services/attendanceRecords.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { departmentsApiService } from "../../organization/services/departments.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { normalizeAttendanceRecord } from "./useAttendanceRecords.js";
import { useI18n } from "../../../i18n/index.js";

const isoDate = (date) => date.toISOString().slice(0, 10);

function defaultRange() {
  const now = new Date();
  return {
    from: isoDate(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: isoDate(now),
  };
}

/** Jours ouvrés (lun-ven) entre deux dates incluses. */
function workingDaysBetween(from, to) {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  let count = 0;
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    const weekday = day.getDay();
    if (weekday !== 0 && weekday !== 6) count++;
  }
  return Math.max(0, count);
}

export function formatWorkingHours(minutes) {
  const total = Number(minutes || 0);
  return `${Math.floor(total / 60)}h ${total % 60}m`;
}

export function useDepartmentComparison() {
  const { t } = useI18n();
  const departmentsList = ref([]);
  const employees = ref([]);
  const records = ref([]);
  const loading = ref(false);
  const error = ref("");

  const range = defaultRange();
  const startDate = ref(range.from);
  const endDate = ref(range.to);
  const departmentFilter = ref("");
  const appliedRange = ref({ ...range });
  const applied = ref({ department: "" });

  const search = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const workingDays = computed(() =>
    workingDaysBetween(appliedRange.value.from, appliedRange.value.to)
  );

  const departmentCodeByName = computed(() => {
    const map = new Map();
    for (const department of departmentsList.value) {
      map.set(department.name, department.code || "");
    }
    return map;
  });

  const employeeDepartmentById = computed(() => {
    const map = new Map();
    for (const employee of employees.value) {
      map.set(employee.id, employee.department || "");
    }
    return map;
  });

  /** Lignes agrégées par département, triées par taux de présence décroissant. */
  const rows = computed(() => {
    const groups = new Map();
    for (const employee of employees.value) {
      const name = employee.department;
      if (!name) continue;
      const group = groups.get(name) || { employees: 0, records: [] };
      group.employees++;
      groups.set(name, group);
    }
    for (const record of records.value) {
      const name = employeeDepartmentById.value.get(record.employeeId);
      if (!name || !groups.has(name)) continue;
      groups.get(name).records.push(record);
    }

    let list = [...groups.entries()];
    if (applied.value.department) {
      list = list.filter(([name]) => name === applied.value.department);
    }

    return list
      .map(([name, group]) => {
        const presentDays = group.records.filter(
          (r) => r.status === "on_time" || r.status === "late"
        ).length;
        const halfDays = group.records.filter((r) => r.status === "half_day").length;
        const attendanceEquivalent = presentDays + halfDays * 0.5;
        const expectedDays = workingDays.value * group.employees;
        const lateInstances = group.records.filter(
          (r) => r.status === "late" || r.lateMinutes > 0
        ).length;
        const sum = (key) =>
          group.records.reduce((total, r) => total + (r[key] || 0), 0);
        const attendedRecords = presentDays + halfDays;

        return {
          name,
          code: departmentCodeByName.value.get(name) || "",
          employees: group.employees,
          attendanceRate: expectedDays
            ? Math.round((attendanceEquivalent / expectedDays) * 100)
            : 0,
          presentDays,
          workingMinutes: sum("workingMinutes"),
          lateInstances,
          avgLateMinutes: lateInstances
            ? Math.round(sum("lateMinutes") / lateInstances)
            : 0,
          overtimeMinutes: sum("overtimeMinutes"),
          avgOvertimeMinutes: attendedRecords
            ? Math.round(sum("overtimeMinutes") / attendedRecords)
            : 0,
          punctualityScore: attendedRecords
            ? Math.round(((attendedRecords - lateInstances) / attendedRecords) * 100)
            : 100,
        };
      })
      .sort((a, b) => b.attendanceRate - a.attendanceRate || a.name.localeCompare(b.name))
      .map((row, index) => ({ ...row, rank: index + 1 }));
  });

  const kpis = computed(() => {
    const list = rows.value;
    if (!list.length) {
      return {
        best: null,
        worst: null,
        averageAttendance: 0,
        totalWorkingMinutes: 0,
      };
    }
    return {
      best: list[0],
      worst: list[list.length - 1],
      averageAttendance: Math.round(
        list.reduce((sum, row) => sum + row.attendanceRate, 0) / list.length
      ),
      totalWorkingMinutes: list.reduce((sum, row) => sum + row.workingMinutes, 0),
    };
  });

  const attendanceRateChart = computed(() =>
    rows.value.map((row) => ({
      label: row.name,
      value: row.attendanceRate,
      valueLabel: `${row.attendanceRate}%`,
    }))
  );

  const workingHoursChart = computed(() =>
    rows.value
      .filter((row) => row.workingMinutes > 0)
      .map((row) => ({
        label: row.name,
        value: row.workingMinutes,
        valueLabel: formatWorkingHours(row.workingMinutes),
      }))
  );

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return rows.value;
    return rows.value.filter((row) =>
      [row.name, row.code].some((value) =>
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
      const [departmentList, employeeList, recordList] = await Promise.all([
        departmentsList.value.length
          ? Promise.resolve(departmentsList.value)
          : departmentsApiService.fetchAll(),
        employees.value.length
          ? Promise.resolve(employees.value)
          : employeesApiService.fetchAll(),
        attendanceRecordsApiService.fetchAll({
          from: startDate.value,
          to: endDate.value,
        }),
      ]);
      departmentsList.value = departmentList;
      employees.value = employeeList;
      records.value = recordList.map(normalizeAttendanceRecord);
      appliedRange.value = { from: startDate.value, to: endDate.value };
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.attendance.reports.dept.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    applied.value = { department: departmentFilter.value };
    page.value = 1;
    await loadData();
  }

  return {
    departmentsList,
    loading,
    error,
    startDate,
    endDate,
    departmentFilter,
    appliedRange,
    search,
    page,
    pageSize,
    workingDays,
    rows,
    kpis,
    attendanceRateChart,
    workingHoursChart,
    filtered,
    totalPages,
    start,
    end,
    paginated,
    loadData,
    applyFilters,
  };
}
