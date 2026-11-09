import { ref, computed, shallowRef, watch } from "vue";
import { payrollApiService } from "../services/payroll.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  mapHistoryEmployeeOption,
  mapHistoryRowFromApi,
  computePayslipHistoryKpis,
  buildSalaryTrendFromHistory,
  mapUiStatusToApiFilter,
} from "../mappers/payroll-employee-history.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";

/**
 * Composable rapport Employee Payslip History.
 * Pattern : API · mapper · état/actions.
 */
export function useEmployeeHistory() {
  const employees = ref([]);
  const selectedEmployeeId = ref(null);
  const historyRows = ref([]);

  const loadingEmployees = ref(false);
  const loadingHistory = ref(false);
  const error = ref(null);

  const filters = ref(emptyFilters());
  const applied = shallowRef(emptyFilters());
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(25);

  const companyId = () => useAuthStore().user?.company_id ?? null;

  function emptyFilters() {
    return { dateRange: "", status: "" };
  }

  const selectedEmployee = computed(
    () =>
      employees.value.find(
        (e) => String(e.id) === String(selectedEmployeeId.value)
      ) || null
  );

  const loading = computed(
    () => loadingEmployees.value || loadingHistory.value
  );

  function buildHistoryApiParams() {
    const params = { per_page: 200 };
    const cid = companyId();
    if (cid) params.company_id = cid;

    if (selectedEmployeeId.value) {
      params.employee_id = Number(selectedEmployeeId.value);
    }

    const f = applied.value;
    if (f.dateRange) {
      params.period = f.dateRange;
    }
    if (f.status) {
      const apiStatus = mapUiStatusToApiFilter(f.status);
      if (apiStatus) params.status = apiStatus;
    }

    return params;
  }

  async function loadEmployees() {
    loadingEmployees.value = true;
    error.value = null;
    try {
      const raw = await employeesApiService.fetchAll();
      employees.value = raw
        .map(mapHistoryEmployeeOption)
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    } catch (e) {
      error.value = parseApiError(e);
      employees.value = [];
    } finally {
      loadingEmployees.value = false;
    }
  }

  async function fetchHistory() {
    if (!selectedEmployeeId.value) {
      historyRows.value = [];
      return;
    }

    loadingHistory.value = true;
    error.value = null;
    try {
      const raw = await payrollApiService.fetchAll(buildHistoryApiParams());
      historyRows.value = raw
        .map(mapHistoryRowFromApi)
        .filter(Boolean)
        .sort((a, b) => {
          const ka = a.periodKey || "";
          const kb = b.periodKey || "";
          // Plus récent en premier (table)
          return kb.localeCompare(ka);
        });
    } catch (e) {
      error.value = parseApiError(e);
      historyRows.value = [];
    } finally {
      loadingHistory.value = false;
    }
  }

  async function bootstrap() {
    await loadEmployees();
  }

  async function onEmployeeChange(emp) {
    selectedEmployeeId.value = emp?.id ?? null;
    filters.value = emptyFilters();
    applied.value = emptyFilters();
    searchQuery.value = "";
    currentPage.value = 1;
    historyRows.value = [];
    if (selectedEmployeeId.value) {
      await fetchHistory();
    }
  }

  async function applyFilters() {
    applied.value = { ...filters.value };
    currentPage.value = 1;
    await fetchHistory();
  }

  async function resetFilters() {
    filters.value = emptyFilters();
    applied.value = emptyFilters();
    searchQuery.value = "";
    currentPage.value = 1;
    await fetchHistory();
  }

  /** Recherche locale uniquement (statut / période via API) */
  const filteredRows = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return historyRows.value;
    return historyRows.value.filter((row) =>
      `${row.period} ${row.cycle} ${row.status}`.toLowerCase().includes(q)
    );
  });

  const kpi = computed(() => computePayslipHistoryKpis(filteredRows.value));

  const trend = computed(() => buildSalaryTrendFromHistory(historyRows.value));
  const hasMixedCurrencies = computed(
    () => new Set(historyRows.value.map((row) => row.currency).filter(Boolean)).size > 1
  );

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value) || 1)
  );

  const rangeStart = computed(() =>
    filteredRows.value.length === 0
      ? 0
      : (currentPage.value - 1) * itemsPerPage.value + 1
  );

  const rangeEnd = computed(() =>
    Math.min(
      currentPage.value * itemsPerPage.value,
      filteredRows.value.length
    )
  );

  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredRows.value.slice(start, start + itemsPerPage.value);
  });

  const visiblePages = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    const pages = [];
    let from = Math.max(1, cur - 2);
    let to = Math.min(total, from + 4);
    from = Math.max(1, to - 4);
    for (let p = from; p <= to; p++) pages.push(p);
    return pages;
  });

  watch([searchQuery, filteredRows, itemsPerPage], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  });

  return {
    employees,
    selectedEmployeeId,
    selectedEmployee,
    historyRows,
    filteredRows,
    kpi,
    trend,
    hasMixedCurrencies,
    loading,
    loadingEmployees,
    loadingHistory,
    error,
    filters,
    applied,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedRows,
    rangeStart,
    rangeEnd,
    visiblePages,
    bootstrap,
    fetchHistory,
    onEmployeeChange,
    applyFilters,
    resetFilters,
  };
}
