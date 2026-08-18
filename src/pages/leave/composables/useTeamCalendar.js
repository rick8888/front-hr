import { computed, ref } from "vue";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { leaveRequestsApiService } from "../services/leaveRequests.api.service.js";
import { leaveTypesApiService } from "../services/leaveTypes.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";
import {
  LEAVE_STATUS_LABELS,
  LEAVE_TYPE_OPTIONS,
  leaveStatusLabel,
  leaveStatusValue,
  normalizeLeaveRequest,
} from "./useLeaveRequests.js";
import {
  buildCalendarWeeks,
  buildLeaveSegments,
  markTodayCells,
  monthTitle,
} from "../../../composables/useTeamCalendarMonth.js";

const ALL_DESIGNATIONS = "All Designations";
const ALL_LEAVE_TYPES = "All Leave Types";
const ALL_STATUSES = "All Statuses";

function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

function toIsoDay(value) {
  if (!value) return "";
  const match = String(value).match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function eventsOnDay(events, isoDay) {
  return events.filter((e) => e.start && e.end && isoDay >= e.start && isoDay <= e.end);
}

function overlapsMonth(leave, monthDate) {
  if (!leave.start || !leave.end) return false;
  const ms = format(startOfMonth(monthDate), "yyyy-MM-dd");
  const me = format(endOfMonth(monthDate), "yyyy-MM-dd");
  return !(leave.end < ms || leave.start > me);
}

function overlapsGrid(leave, weeks) {
  if (!leave.start || !leave.end || !weeks.length) return false;
  const from = weeks[0][0].iso;
  const to = weeks[weeks.length - 1][6].iso;
  return !(leave.end < from || leave.start > to);
}

export function useTeamCalendar() {
  const { t } = useI18n();
  const employees = ref([]);
  const leaveTypes = ref([]);
  const filterCatalog = ref({ designations: [], leave_types: [], statuses: [] });
  const leaves = ref([]);
  const loading = ref(true);
  const error = ref("");

  const today = todayIso();
  const monthAnchor = ref(startOfMonth(new Date()));

  function initialFilters() {
    return {
      designation: ALL_DESIGNATIONS,
      leaveType: ALL_LEAVE_TYPES,
      status: ALL_STATUSES,
    };
  }

  const draftFilters = ref(initialFilters());
  const activeFilters = ref(initialFilters());

  const employeeById = computed(() => {
    const map = new Map();
    for (const employee of employees.value) map.set(employee.id, employee);
    return map;
  });

  const designationOptions = computed(() => [
    ALL_DESIGNATIONS,
    ...filterCatalog.value.designations,
  ]);

  const leaveTypeOptions = computed(() => [
    ALL_LEAVE_TYPES,
    ...filterCatalog.value.leave_types.map((type) => type.name),
  ]);

  const statusOptions = computed(() => {
    const fromApi = filterCatalog.value.statuses.map(leaveStatusLabel);
    return [ALL_STATUSES, ...(fromApi.length ? fromApi : LEAVE_STATUS_LABELS)];
  });

  /** Événements calendrier dérivés des demandes de congé + fiche employé. */
  const allLeaves = computed(() =>
    leaves.value.map((request) => {
      const employee = employeeById.value.get(request.employeeId);
      return {
        id: request.id,
        employee: request.employee,
        designation:
          employee?.job_title || employee?.role || employee?.designation || "—",
        leaveType: request.leaveType,
        status: request.status,
        statusValue: request.statusValue,
        start: toIsoDay(request.from),
        end: toIsoDay(request.to),
      };
    })
  );

  const monthSubtitle = computed(() => monthTitle(monthAnchor.value));

  const weeks = computed(() => {
    const w = buildCalendarWeeks(monthAnchor.value);
    markTodayCells(w, today);
    return w;
  });

  const visibleLeaves = computed(() => {
    const filters = activeFilters.value;
    return allLeaves.value.filter((leave) => {
      if (!overlapsGrid(leave, weeks.value)) return false;
      if (
        filters.designation !== ALL_DESIGNATIONS &&
        leave.designation !== filters.designation
      ) {
        return false;
      }
      if (
        filters.leaveType !== ALL_LEAVE_TYPES &&
        leave.leaveType !== filters.leaveType
      ) {
        return false;
      }
      if (
        filters.status !== ALL_STATUSES &&
        leave.status !== filters.status &&
        leave.statusValue !== leaveStatusValue(filters.status)
      ) {
        return false;
      }
      return true;
    });
  });

  const segmentsByWeek = computed(() =>
    buildLeaveSegments(weeks.value, visibleLeaves.value)
  );

  const onLeaveDateLabel = computed(() => format(new Date(), "MMM dd, yyyy"));

  const onLeaveMembers = computed(() =>
    eventsOnDay(visibleLeaves.value, today).map((e) => ({
      id: e.id,
      label: `${e.employee} - ${e.leaveType}`,
    }))
  );

  const teamStats = computed(() => {
    const teamSize = employees.value.length;
    const count = visibleLeaves.value.filter((leave) =>
      overlapsMonth(leave, monthAnchor.value)
    ).length;
    const avg = teamSize > 0 ? count / teamSize : 0;
    return {
      leavesThisMonth: count,
      teamSize,
      avgPerPerson: avg.toFixed(1),
    };
  });

  async function loadEmployeesAndTypes() {
    const [employeeList, typeList, filterOptions] = await Promise.all([
      employeesApiService.fetchAll().catch(() => []),
      leaveTypesApiService.fetchAll().catch(() => []),
      leaveRequestsApiService.fetchFilterOptions().catch(() => null),
    ]);
    employees.value = Array.isArray(employeeList) ? employeeList : [];
    leaveTypes.value = Array.isArray(typeList) ? typeList : [];
    if (filterOptions) {
      filterCatalog.value = {
        designations: filterOptions.designations ?? [],
        leave_types: filterOptions.leave_types ?? [],
        statuses: filterOptions.statuses ?? [],
      };
    }
  }

  async function loadLeaves() {
    const filters = activeFilters.value;
    const selectedType = leaveTypes.value.find(
      (type) => type.name === filters.leaveType,
    );
    const fallbackType = LEAVE_TYPE_OPTIONS.find(
      (type) => type.label === filters.leaveType,
    );
    const params = {};
    if (filters.designation !== ALL_DESIGNATIONS) {
      params.designation = filters.designation;
    }
    if (filters.leaveType !== ALL_LEAVE_TYPES) {
      params.leave_type =
        selectedType?.code ?? fallbackType?.value ?? filters.leaveType;
    }
    if (filters.status !== ALL_STATUSES) {
      params.status = leaveStatusValue(filters.status);
    }
    const list = await leaveRequestsApiService.fetchAll(params);
    leaves.value = (Array.isArray(list) ? list : []).map((request) =>
      normalizeLeaveRequest(request, leaveTypes.value)
    );
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      if (!leaveTypes.value.length) {
        await loadEmployeesAndTypes();
      }
      await loadLeaves();
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.leave.calendar.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    activeFilters.value = { ...draftFilters.value };
    loading.value = true;
    error.value = "";
    try {
      await loadLeaves();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.calendar.filterError");
    } finally {
      loading.value = false;
    }
  }

  async function resetFilters() {
    const init = initialFilters();
    draftFilters.value = { ...init };
    activeFilters.value = { ...init };
    await applyFilters();
  }

  function goThisMonth() {
    monthAnchor.value = startOfMonth(new Date());
  }

  function prevMonth() {
    monthAnchor.value = subMonths(monthAnchor.value, 1);
  }

  function nextMonth() {
    monthAnchor.value = addMonths(monthAnchor.value, 1);
  }

  return {
    loading,
    error,
    draftFilters,
    designationOptions,
    leaveTypeOptions,
    statusOptions,
    monthSubtitle,
    weeks,
    segmentsByWeek,
    onLeaveDateLabel,
    onLeaveMembers,
    teamStats,
    loadData,
    applyFilters,
    resetFilters,
    goThisMonth,
    prevMonth,
    nextMonth,
  };
}
