import { computed, ref, watch } from "vue";
import { leaveBalancesApiService } from "../services/leaveBalances.api.service.js";
import { leaveRequestsApiService } from "../services/leaveRequests.api.service.js";
import { normalizeLeaveRequest } from "./useLeaveRequests.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function formatDays(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0.0%";
  return `${n.toFixed(1)}%`;
}

function normalizeEmployee(raw = {}) {
  return {
    id: raw.id,
    employee: raw.employee ?? "",
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    department: raw.team ?? raw.department ?? "-",
    balances: raw.balances ?? {},
  };
}

export function useLeaveDepartmentStatisticsReport() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const year = ref(currentYear);
  const loading = ref(false);
  const error = ref("");

  const employees = ref([]);
  const leaveRequests = ref([]);

  const draftFilters = ref({
    department: "",
  });
  const activeFilters = ref({ ...draftFilters.value });

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(25);
  const sortKey = ref("department");
  const sortDir = ref("asc");

  const yearOptions = computed(() => {
    const years = [];
    for (let y = currentYear + 1; y >= currentYear - 5; y -= 1) years.push(y);
    return years;
  });

  const departmentOptions = computed(() =>
    [
      ...new Set(
        employees.value
          .map((row) => row.department)
          .filter((dept) => dept && dept !== "-"),
      ),
    ].sort((a, b) => a.localeCompare(b)),
  );

  const pendingByDepartment = computed(() => {
    const map = new Map();
    const yearStart = `${year.value}-01-01`;
    const yearEnd = `${year.value}-12-31`;

    for (const request of leaveRequests.value) {
      if (request.statusValue !== "pending") continue;
      if (request.from && request.to) {
        if (request.from > yearEnd || request.to < yearStart) continue;
      }

      const dept =
        request.department && request.department !== "—" ? request.department : null;
      const employee = employees.value.find(
        (row) =>
          row.employeeCode &&
          request.employeeCode &&
          row.employeeCode === request.employeeCode,
      );
      const key = employee?.department || dept || "Unassigned";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  });

  const departmentRows = computed(() => {
    const byDept = new Map();

    for (const employee of employees.value) {
      const dept =
        employee.department && employee.department !== "-"
          ? employee.department
          : "Unassigned";
      if (!byDept.has(dept)) {
        byDept.set(dept, {
          department: dept,
          employeeCodes: new Set(),
          totalLeavesTaken: 0,
          totalEntitled: 0,
        });
      }
      const bucket = byDept.get(dept);
      bucket.employeeCodes.add(employee.employeeCode || employee.id);
      const balances = employee.balances || {};
      for (const balance of Object.values(balances)) {
        bucket.totalLeavesTaken += Number(balance.used ?? 0);
        bucket.totalEntitled += Number(balance.entitled ?? 0);
      }
    }

    return [...byDept.values()]
      .map((bucket) => {
        const totalEmployees = bucket.employeeCodes.size;
        const averagePerEmployee =
          totalEmployees > 0 ? bucket.totalLeavesTaken / totalEmployees : 0;
        const utilizationRate =
          bucket.totalEntitled > 0
            ? (bucket.totalLeavesTaken / bucket.totalEntitled) * 100
            : 0;
        const pendingRequests = pendingByDepartment.value.get(bucket.department) || 0;

        return {
          id: bucket.department,
          department: bucket.department,
          totalEmployees,
          totalLeavesTaken: bucket.totalLeavesTaken,
          averagePerEmployee,
          utilizationRate,
          pendingRequests,
          totalLeavesTakenLabel: formatDays(bucket.totalLeavesTaken),
          averagePerEmployeeLabel: formatDays(averagePerEmployee),
          utilizationRateLabel: formatPercent(utilizationRate),
        };
      })
      .sort((a, b) => a.department.localeCompare(b.department));
  });

  const filteredRows = computed(() => {
    const deptFilter = activeFilters.value.department;
    const q = searchQuery.value.trim().toLowerCase();

    let rows = departmentRows.value;
    if (deptFilter) {
      rows = rows.filter((row) => row.department === deptFilter);
    }
    if (q) {
      rows = rows.filter((row) =>
        [
          row.department,
          row.totalEmployees,
          row.totalLeavesTakenLabel,
          row.averagePerEmployeeLabel,
          row.utilizationRateLabel,
          row.pendingRequests,
        ].some((value) => String(value).toLowerCase().includes(q)),
      );
    }

    const key = sortKey.value;
    const dir = sortDir.value === "desc" ? -1 : 1;
    return [...rows].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (typeof av === "string" || typeof bv === "string") {
        return String(av).localeCompare(String(bv)) * dir;
      }
      return (Number(av) - Number(bv)) * dir;
    });
  });

  const chartItems = computed(() =>
    filteredRows.value.map((row) => ({
      label: row.department,
      totalLeavesTaken: row.totalLeavesTaken,
      averagePerEmployee: row.averagePerEmployee,
    })),
  );

  const totalFiltered = computed(() => filteredRows.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)),
  );
  const paginatedRows = computed(() => {
    const safePage = Math.min(page.value, pageCount.value);
    const start = (safePage - 1) * pageSize.value;
    return filteredRows.value.slice(start, start + pageSize.value);
  });
  const rangeLabel = computed(() => {
    if (!totalFiltered.value) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, totalFiltered.value),
    };
  });

  watch([searchQuery, pageSize, activeFilters, sortKey, sortDir], () => {
    page.value = 1;
  }, { deep: true });

  watch(totalFiltered, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  function toggleSort(key) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
      return;
    }
    sortKey.value = key;
    sortDir.value = "asc";
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [balancesPayload, requestsList] = await Promise.all([
        leaveBalancesApiService.fetchAll(year.value),
        leaveRequestsApiService.fetchAll().catch(() => []),
      ]);

      employees.value = (balancesPayload?.employees ?? []).map(normalizeEmployee);
      leaveRequests.value = (Array.isArray(requestsList) ? requestsList : []).map((raw) =>
        normalizeLeaveRequest(raw),
      );
    } catch (exception) {
      error.value =
        parseApiError(exception) ||
        t("admin.leave.reports.dept.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    activeFilters.value = { ...draftFilters.value };
    await loadData();
  }

  async function resetFilters() {
    year.value = currentYear;
    draftFilters.value = { department: "" };
    activeFilters.value = { ...draftFilters.value };
    searchQuery.value = "";
    page.value = 1;
    sortKey.value = "department";
    sortDir.value = "asc";
    await loadData();
  }

  return {
    year,
    yearOptions,
    loading,
    error,
    draftFilters,
    searchQuery,
    page,
    pageSize,
    sortKey,
    sortDir,
    departmentOptions,
    chartItems,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    formatDays,
    toggleSort,
    loadData,
    applyFilters,
    resetFilters,
  };
}
