import { computed, ref, watch } from "vue";
import { attendanceRecordsApiService } from "../services/attendanceRecords.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { shiftsApiService } from "../services/shifts.api.service.js";
import { holidaysApiService } from "../../holidays/services/holidays.api.service.js";
import { regularizationsApiService } from "../services/regularizations.api.service.js";
import {
  dayTypeLabel as resolveDayTypeLabel,
  dayTypesApiService,
  fallbackDayTypes,
} from "../services/dayTypes.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { normalizeAttendanceRecord } from "./useAttendanceRecords.js";
import { useI18n } from "../../../i18n/index.js";
import { useEntityStatusCatalogStore } from "../../../stores/entityStatusCatalog.store.js";

const isoDate = (date) => date.toISOString().slice(0, 10);

function defaultRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: isoDate(from), to: isoDate(to) };
}

export function toHours(minutes) {
  return (Number(minutes || 0) / 60).toFixed(2);
}

export function useOvertimeReport() {
  const { t } = useI18n();
  const statusCatalog = useEntityStatusCatalogStore();
  const employees = ref([]);
  const shifts = ref([]);
  const holidays = ref([]);
  const records = ref([]);
  const regularizations = ref([]);
  const typeCatalog = ref(fallbackDayTypes(t));
  const loading = ref(false);
  const error = ref("");

  const range = defaultRange();
  const startDate = ref(range.from);
  const endDate = ref(range.to);
  const departmentFilter = ref("");
  const employeeFilter = ref("");
  const minOvertimeHours = ref("");
  const dayTypeFilter = ref("");
  const approvalStatusFilter = ref("");
  const applied = ref({
    department: "",
    employeeId: "",
    minHours: 0,
    dayType: "",
    approvalStatus: "",
  });

  const dayTypeOptions = computed(() => [
    { value: "", label: t("admin.attendance.reports.overtime.dayType.all") },
    ...typeCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name })),
  ]);

  function dayTypeName(code) {
    return resolveDayTypeLabel(code, typeCatalog.value, t);
  }

  const fallbackStatusOptions = computed(() => [
    { value: "pending", label: t("admin.attendance.regularizations.status.pending") },
    { value: "approved", label: t("admin.attendance.regularizations.status.approved") },
    { value: "rejected", label: t("admin.attendance.regularizations.status.rejected") },
  ]);

  const statusOptions = computed(() =>
    statusCatalog.options("regularizations", fallbackStatusOptions.value)
  );

  function approvalStatusLabel(code) {
    return statusCatalog.label(
      "regularizations",
      code,
      fallbackStatusOptions.value.find((opt) => opt.value === code)?.label || code
    );
  }

  function approvalStatusClass(code) {
    return statusCatalog.pillClass("regularizations", code);
  }

  function regularizationKey(employeeId, date) {
    return `${employeeId}|${String(date || "").slice(0, 10)}`;
  }

  const statusByRecord = computed(() => {
    const map = new Map();
    for (const raw of regularizations.value) {
      const employeeId = raw.employee_id ?? raw.employeeId;
      const date = raw.attendance_date ?? raw.attendanceDate;
      if (!employeeId || !date) continue;
      const key = regularizationKey(employeeId, date);
      if (!map.has(key)) map.set(key, raw.status ?? "");
    }
    return map;
  });

  const search = ref("");
  const page = ref(1);
  const pageSize = ref(25);

  const departments = computed(() =>
    [...new Set(employees.value.map((e) => e.department).filter(Boolean))].sort()
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

  const holidayDates = computed(
    () => new Set(holidays.value.map((holiday) => holiday.date).filter(Boolean))
  );

  function dayTypeOf(date) {
    if (!date) return "weekday";
    if (holidayDates.value.has(date)) return "holiday";
    const weekday = new Date(`${date}T12:00:00`).getDay();
    return weekday === 0 || weekday === 6 ? "weekend" : "weekday";
  }

  /** Enregistrements avec heures sup, enrichis et filtrés. */
  const overtimeRecords = computed(() => {
    const minMinutes = Number(applied.value.minHours || 0) * 60;
    return records.value
      .filter((record) => record.overtimeMinutes > 0)
      .filter((record) => record.overtimeMinutes >= minMinutes)
      .map((record) => {
        const employee = employeeById.value.get(record.employeeId);
        const shift = shiftById.value.get(record.shiftId);
        return {
          ...record,
          department: employee?.department || "—",
          dayType: dayTypeOf(record.date),
          approvalStatus: statusByRecord.value.get(regularizationKey(record.employeeId, record.date)) || "",
          shiftStart: shift?.start_time || null,
          shiftEnd: shift?.end_time || null,
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
      )
      .filter((record) =>
        applied.value.dayType ? record.dayType === applied.value.dayType : true
      )
      .filter((record) =>
        applied.value.approvalStatus
          ? record.approvalStatus === applied.value.approvalStatus
          : true
      );
  });

  const kpis = computed(() => {
    const list = overtimeRecords.value;
    const totalMinutes = list.reduce((sum, r) => sum + r.overtimeMinutes, 0);
    const employeeCount = new Set(list.map((r) => r.employeeId)).size;
    const weekendMinutes = list
      .filter((r) => r.dayType === "weekend")
      .reduce((sum, r) => sum + r.overtimeMinutes, 0);
    return {
      totalHours: toHours(totalMinutes),
      employeesWithOvertime: employeeCount,
      avgHoursPerEmployee: employeeCount
        ? toHours(totalMinutes / employeeCount)
        : "0.00",
      weekendHours: toHours(weekendMinutes),
    };
  });

  const byDepartment = computed(() => {
    const totals = new Map();
    for (const record of overtimeRecords.value) {
      totals.set(
        record.department,
        (totals.get(record.department) || 0) + record.overtimeMinutes
      );
    }
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, minutes]) => ({
        label: name,
        value: minutes,
        valueLabel: `${toHours(minutes)}h`,
      }));
  });

  const breakdown = computed(() => {
    const totals = {};
    for (const record of overtimeRecords.value) {
      totals[record.dayType] = (totals[record.dayType] || 0) + record.overtimeMinutes;
    }
    const colors = { weekday: "#8b5cf6", weekend: "#0ea5e9", holiday: "#eab308" };
    const keys = typeCatalog.value.length
      ? typeCatalog.value.filter((item) => item.isActive).map((item) => item.code)
      : ["weekday", "weekend", "holiday"];
    return keys.map((key) => ({
      key,
      label: dayTypeName(key),
      value: totals[key] || 0,
      color: colors[key] || "#737373",
    }));
  });

  const monthlyTrend = computed(() => {
    const byMonth = new Map();
    for (const record of overtimeRecords.value) {
      const month = String(record.date || "").slice(0, 7);
      if (!month) continue;
      const entry = byMonth.get(month) || { minutes: 0, employees: new Set() };
      entry.minutes += record.overtimeMinutes;
      entry.employees.add(record.employeeId);
      byMonth.set(month, entry);
    }
    return [...byMonth.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, entry]) => ({
        label: month,
        barValue: Math.round((entry.minutes / 60) * 100) / 100,
        lineValue: entry.employees.size,
      }));
  });

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return overtimeRecords.value;
    return overtimeRecords.value.filter((record) =>
      [record.employee, record.employeeCode, record.department, record.shift, record.date, record.dayType]
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
      const [employeeList, shiftList, holidayList, recordList, typeList, regularizationList] = await Promise.all([
        employees.value.length
          ? Promise.resolve(employees.value)
          : employeesApiService.fetchAll(),
        shifts.value.length
          ? Promise.resolve(shifts.value)
          : shiftsApiService.fetchAll(),
        holidays.value.length
          ? Promise.resolve(holidays.value)
          : holidaysApiService.fetchAll(),
        attendanceRecordsApiService.fetchAll({
          from: startDate.value,
          to: endDate.value,
        }),
        dayTypesApiService.fetchAll().catch(() => []),
        regularizationsApiService
          .fetchAll({
            from: startDate.value,
            to: endDate.value,
          })
          .catch(() => []),
        statusCatalog.load(),
      ]);
      employees.value = employeeList;
      shifts.value = shiftList;
      holidays.value = holidayList;
      records.value = recordList.map(normalizeAttendanceRecord);
      typeCatalog.value = typeList.length ? typeList : fallbackDayTypes(t);
      regularizations.value = Array.isArray(regularizationList) ? regularizationList : [];
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.attendance.reports.overtime.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    applied.value = {
      department: departmentFilter.value,
      employeeId: employeeFilter.value,
      minHours: Number(minOvertimeHours.value || 0),
      dayType: dayTypeFilter.value,
      approvalStatus: approvalStatusFilter.value,
    };
    page.value = 1;
    await loadData();
  }

  async function resetFilters() {
    const range = defaultRange();
    startDate.value = range.from;
    endDate.value = range.to;
    departmentFilter.value = "";
    employeeFilter.value = "";
    minOvertimeHours.value = "";
    dayTypeFilter.value = "";
    approvalStatusFilter.value = "";
    applied.value = {
      department: "",
      employeeId: "",
      minHours: 0,
      dayType: "",
      approvalStatus: "",
    };
    page.value = 1;
    await loadData();
  }

  return {
    employees,
    loading,
    error,
    startDate,
    endDate,
    departmentFilter,
    employeeFilter,
    minOvertimeHours,
    dayTypeFilter,
    dayTypeOptions,
    dayTypeName,
    approvalStatusFilter,
    statusOptions,
    approvalStatusLabel,
    approvalStatusClass,
    departments,
    search,
    page,
    pageSize,
    kpis,
    byDepartment,
    breakdown,
    monthlyTrend,
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
