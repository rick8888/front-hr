import { ref, computed, shallowRef } from "vue";
import { payrollApiService } from "../services/payroll.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  mapTaxSummaryFromApi,
  computeTaxSummaryKpi,
  buildTaxTrendFromRows,
  dateToPeriodKey,
} from "../mappers/payroll-tax-summary.mapper.js";
import { mapEmployeeBase } from "../mappers/salary-structure.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";
import {
  fallbackPayrollCycles,
  payrollCyclesApiService,
} from "../services/payrollCycles.api.service.js";

/**
 * Composable rapport tax summary (/payroll/reports/tax-summary).
 * Pattern : API · mapper · état/actions.
 */
export function useTaxSummary() {
  const records = ref([]);
  const employeeOptions = ref([]);
  const cycleCatalog = ref(fallbackPayrollCycles());
  const loading = ref(false);
  const error = ref(null);

  const filters = ref(emptyFilters());
  const applied = shallowRef(emptyFilters());
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const cycleOptions = computed(() =>
    cycleCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const companyId = () => useAuthStore().user?.company_id ?? null;

  function emptyFilters() {
    return {
      fromDate: "",
      toDate: "",
      employeeId: "",
      department: "",
      cycle: "",
    };
  }

  function buildApiParams() {
    const f = applied.value;
    const params = { per_page: 500 };
    const cid = companyId();
    if (cid) params.company_id = cid;

    const from = dateToPeriodKey(f.fromDate);
    const to = dateToPeriodKey(f.toDate);
    if (from) params.period_from = from;
    if (to) params.period_to = to;

    if (f.employeeId) params.employee_id = Number(f.employeeId);
    if (f.department) params.department = f.department;

    return params;
  }

  async function loadEmployees() {
    try {
      const raw = await employeesApiService.fetchAll();
      employeeOptions.value = raw
        .map(mapEmployeeBase)
        .map((e) => ({
          id: e.id,
          name: e.name,
          department: e.departmentName && e.departmentName !== "—" ? e.departmentName : null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    } catch {
      const seen = new Map();
      for (const r of records.value) {
        if (r.employeeId && !seen.has(r.employeeId)) {
          seen.set(r.employeeId, {
            id: r.employeeId,
            name: r.employeeName,
            department: r.department,
          });
        }
      }
      employeeOptions.value = [...seen.values()].sort((a, b) =>
        a.name.localeCompare(b.name, "fr")
      );
    }
  }

  async function fetchRecords() {
    loading.value = true;
    error.value = null;
    try {
      const raw = await payrollApiService.fetchAll(buildApiParams());
      records.value = raw.map(mapTaxSummaryFromApi).filter(Boolean);
    } catch (e) {
      error.value = parseApiError(e);
      records.value = [];
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
    await Promise.all([fetchRecords(), loadEmployees(), loadCycles()]);
  }

  async function applyFilters() {
    applied.value = { ...filters.value };
    currentPage.value = 1;
    await fetchRecords();
  }

  async function resetFilters() {
    filters.value = emptyFilters();
    applied.value = emptyFilters();
    searchQuery.value = "";
    currentPage.value = 1;
    await fetchRecords();
  }

  const departmentOptions = computed(() => {
    const set = new Set();
    for (const e of employeeOptions.value) {
      if (e.department) set.add(e.department);
    }
    for (const r of records.value) {
      if (r.department && r.department !== "—") set.add(r.department);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  });

  /** Filtre local (cycle + recherche) — le reste est côté API */
  const filteredRows = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    const f = applied.value;

    return records.value.filter((row) => {
      if (f.cycle && row.cycle !== f.cycle) return false;
      if (!q) return true;
      const hay =
        `${row.employeeName} ${row.empCode} ${row.period} ${row.department}`.toLowerCase();
      return hay.includes(q);
    });
  });

  const kpi = computed(() => computeTaxSummaryKpi(filteredRows.value));
  const hasMixedCurrencies = computed(
    () => new Set(records.value.map((row) => row.currency).filter(Boolean)).size > 1
  );

  /** Tendance 6 mois : basée sur tout le jeu chargé (pas seulement page) */
  const trend = computed(() => buildTaxTrendFromRows(records.value, 6));

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
    records,
    filteredRows,
    employeeOptions,
    departmentOptions,
    cycleOptions,
    kpi,
    hasMixedCurrencies,
    trend,
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
    fetchRecords,
    applyFilters,
    resetFilters,
  };
}
