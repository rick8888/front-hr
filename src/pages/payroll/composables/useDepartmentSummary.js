import { ref, computed, shallowRef } from "vue";
import { payrollApiService } from "../services/payroll.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  mapPayrollsForDepartmentSummary,
  aggregateByDepartment,
  computeDepartmentSummaryKpi,
  dateToPeriodKey,
} from "../mappers/payroll-department-summary.mapper.js";
import { mapEmployeeBase } from "../mappers/salary-structure.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";
import {
  fallbackPayrollCycles,
  payrollCyclesApiService,
} from "../services/payrollCycles.api.service.js";

/**
 * Composable — /payroll/reports/department-summary
 * Pattern : API · mapper (agrégation) · état / actions.
 */
export function useDepartmentSummary() {
  /** Lignes agrégées (résultat API + mapping) */
  const rows = ref([]);
  const employeeDepartments = ref([]);
  const cycleCatalog = ref(fallbackPayrollCycles());
  const loading = ref(false);
  const error = ref(null);

  const filters = ref(emptyFilters());
  const applied = shallowRef(emptyFilters());
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(25);

  const cycleOptions = computed(() =>
    cycleCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const companyId = () => useAuthStore().user?.company_id ?? null;

  function emptyFilters() {
    return {
      startDate: "",
      endDate: "",
      department: "",
      cycle: "",
    };
  }

  function buildApiParams() {
    const f = applied.value;
    const params = { per_page: 500 };
    const cid = companyId();
    if (cid) params.company_id = cid;

    const from = dateToPeriodKey(f.startDate);
    const to = dateToPeriodKey(f.endDate);
    if (from) params.period_from = from;
    if (to) params.period_to = to;

    // Département aussi côté API (filtre employé.department)
    if (f.department) params.department = f.department;

    return params;
  }

  async function loadDepartmentOptions() {
    try {
      const raw = await employeesApiService.fetchAll();
      const set = new Set();
      for (const e of raw.map(mapEmployeeBase)) {
        const d = e.departmentName;
        if (d && d !== "—") set.add(d);
      }
      employeeDepartments.value = [...set].sort((a, b) => a.localeCompare(b, "fr"));
    } catch {
      employeeDepartments.value = [];
    }
  }

  async function fetchSummary() {
    loading.value = true;
    error.value = null;
    try {
      const raw = await payrollApiService.fetchAll(buildApiParams());
      const registerRows = mapPayrollsForDepartmentSummary(raw);
      rows.value = aggregateByDepartment(registerRows);
    } catch (e) {
      error.value = parseApiError(e);
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function loadCycles() {
    try {
      const list = await payrollCyclesApiService.fetchAll({ activeOnly: true });
      cycleCatalog.value = list.length ? list : fallbackPayrollCycles();
    } catch {
      cycleCatalog.value = fallbackPayrollCycles();
    }
  }

  async function bootstrap() {
    error.value = null;
    await Promise.all([fetchSummary(), loadDepartmentOptions(), loadCycles()]);
  }

  async function applyFilters() {
    applied.value = { ...filters.value };
    currentPage.value = 1;
    await fetchSummary();
  }

  async function resetFilters() {
    filters.value = emptyFilters();
    applied.value = emptyFilters();
    searchQuery.value = "";
    currentPage.value = 1;
    await fetchSummary();
  }

  function setDepartmentFilter(department) {
    const dept = typeof department === "string" ? department.trim() : "";
    filters.value = { ...filters.value, department: dept };
    applied.value = { ...applied.value, department: dept };
    currentPage.value = 1;
    searchQuery.value = "";
  }

  const departmentOptions = computed(() => {
    const set = new Set(employeeDepartments.value);
    for (const r of rows.value) {
      if (r.department) set.add(r.department);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  });

  /** Filtres résiduels côté UI (cycle + recherche) */
  const filteredRows = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    const cycle = applied.value.cycle;

    return rows.value.filter((row) => {
      if (cycle && !(row.cycles || []).includes(cycle)) return false;
      if (q && !row.department.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  const kpi = computed(() => computeDepartmentSummaryKpi(filteredRows.value));
  const chartLabels = computed(() => filteredRows.value.map((r) => r.department));
  const chartGross = computed(() => filteredRows.value.map((r) => r.totalGross));
  const chartNet = computed(() => filteredRows.value.map((r) => r.totalNet));

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value))
  );

  const rangeStart = computed(() =>
    filteredRows.value.length === 0
      ? 0
      : (currentPage.value - 1) * itemsPerPage.value + 1
  );

  const rangeEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, filteredRows.value.length)
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

  return {
    filteredRows,
    departmentOptions,
    cycleOptions,
    kpi,
    chartLabels,
    chartGross,
    chartNet,
    loading,
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
    fetchSummary,
    applyFilters,
    resetFilters,
    setDepartmentFilter,
  };
}
