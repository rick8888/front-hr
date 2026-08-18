import { ref, computed, shallowRef } from "vue";
import { useI18n } from "../../../i18n/index.js";
import { payrollApiService } from "../services/payroll.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  mapPayrollRecordFromApi,
  mapUiStatusToApiFilter,
  computePayrollRecordsKpi,
  PAYROLL_STATUS_UI,
} from "../mappers/payroll-record.mapper.js";
import { mapEmployeeBase } from "../mappers/salary-structure.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";
import {
  fallbackPayrollCycles,
  payrollCyclesApiService,
} from "../services/payrollCycles.api.service.js";

/**
 * Composable liste des bulletins de paie (/payroll/records).
 * Sépare : API · mapping · état UI · actions.
 */
export function usePayrollRecords() {
  const { t } = useI18n();
  const records = ref([]);
  const employeeOptions = ref([]);
  const cycleCatalog = ref(fallbackPayrollCycles());
  const loading = ref(false);
  const deleting = ref(false);
  const error = ref(null);

  /** Filtres du panneau (édition locale) */
  const filters = ref(emptyFilters());
  /** Filtres appliqués (envoyés au backend au clic Apply) */
  const applied = shallowRef(emptyFilters());

  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const kpi = computed(() => computePayrollRecordsKpi(records.value));

  const cycleOptions = computed(() =>
    cycleCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const companyId = () => useAuthStore().user?.company_id ?? null;

  function emptyFilters() {
    return {
      dateRange: "all",
      employeeId: "",
      status: "",
      cycle: "all",
      period: "",
    };
  }

  /**
   * Construit les query params API à partir des filtres appliqués + recherche.
   */
  function buildApiParams() {
    const f = applied.value;
    const params = {
      per_page: 200,
    };
    const cid = companyId();
    if (cid) params.company_id = cid;

    if (f.period) params.period = f.period;
    if (f.employeeId) params.employee_id = Number(f.employeeId);

    const statusFilter = mapUiStatusToApiFilter(f.status);
    if (statusFilter) params.status = statusFilter;

    const q = searchQuery.value.trim();
    if (q) params.search = q;

    return params;
  }

  async function loadEmployees() {
    try {
      const raw = await employeesApiService.fetchAll();
      employeeOptions.value = raw
        .map(mapEmployeeBase)
        .map((e) => ({ id: e.id, name: e.name }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    } catch {
      // Fallback : options dérivées des enregistrements chargés
      const seen = new Map();
      for (const r of records.value) {
        if (r.employeeId && !seen.has(r.employeeId)) {
          seen.set(r.employeeId, { id: r.employeeId, name: r.employeeName });
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
      records.value = raw.map(mapPayrollRecordFromApi).filter(Boolean);
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

  /**
   * Raccourcis pending / approved / thisMonth / lastMonth
   */
  async function applyQuickFilter(key) {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

    if (key === "pending") {
      filters.value.status = "pending";
    } else if (key === "approved") {
      filters.value.status = "approved";
    } else if (key === "thisMonth") {
      filters.value.period = thisMonth;
      filters.value.dateRange = "month";
    } else if (key === "lastMonth") {
      filters.value.period = lastMonth;
      filters.value.dateRange = "all";
    }
    await applyFilters();
  }

  /**
   * Recherche tableau : debounce côté page via watch → re-fetch backend
   */
  async function setSearchAndReload(q) {
    searchQuery.value = q;
    currentPage.value = 1;
    await fetchRecords();
  }

  async function deleteRecord(id) {
    deleting.value = true;
    error.value = null;
    try {
      await payrollApiService.remove(id);
      records.value = records.value.filter((r) => r.id !== id);
      return true;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      deleting.value = false;
    }
  }

  // Pagination pure UI sur le jeu déjà filtré par l’API
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(records.value.length / itemsPerPage.value))
  );

  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return records.value.slice(start, start + itemsPerPage.value);
  });

  const rangeStart = computed(() =>
    records.value.length === 0
      ? 0
      : (currentPage.value - 1) * itemsPerPage.value + 1
  );

  const rangeEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, records.value.length)
  );

  function statusLabel(key) {
    return t(`admin.payroll.status.${key}`);
  }

  function statusBadgeClass(key) {
    return PAYROLL_STATUS_UI[key]?.badge ?? "bg-neutral-100 text-neutral-700";
  }

  return {
    // data
    records,
    employeeOptions,
    cycleOptions,
    kpi,
    loading,
    deleting,
    error,
    // filters
    filters,
    applied,
    searchQuery,
    // pagination
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedRows,
    rangeStart,
    rangeEnd,
    // actions
    bootstrap,
    fetchRecords,
    applyFilters,
    resetFilters,
    applyQuickFilter,
    setSearchAndReload,
    deleteRecord,
    statusLabel,
    statusBadgeClass,
  };
}
