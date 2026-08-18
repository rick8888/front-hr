import { ref, computed, shallowRef } from "vue";
import { t } from "../../../i18n/index.js";
import { payrollApiService } from "../services/payroll.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  mapPayrollRegisterFromApi,
  mapUiStatusToApiFilter,
  computePayrollRegisterKpi,
  PAYROLL_STATUS_UI,
  formatPeriodLabel,
} from "../mappers/payroll-register.mapper.js";
import { mapEmployeeBase } from "../mappers/salary-structure.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";
import {
  fallbackPayrollCycles,
  payrollCycleLabel,
  payrollCyclesApiService,
} from "../services/payrollCycles.api.service.js";

/**
 * Composable rapport registre de paie (/payroll/reports/payroll-register).
 * Pattern : API service · mapper · état/actions.
 */
export function usePayrollRegister() {
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
  const activeQuick = ref("");

  const companyId = () => useAuthStore().user?.company_id ?? null;

  function emptyFilters() {
    return {
      dateRange: "all",
      employeeId: "",
      department: "",
      status: "",
      cycle: "",
      period: "",
    };
  }

  function monthKey(offset = 0) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  function buildApiParams() {
    const f = applied.value;
    const params = { per_page: 200 };
    const cid = companyId();
    if (cid) params.company_id = cid;

    let period = f.period || "";
    if (!period && f.dateRange === "month") period = monthKey(0);
    if (!period && f.dateRange === "lastMonth") period = monthKey(-1);
    if (period) params.period = period;

    if (f.employeeId) params.employee_id = Number(f.employeeId);
    if (f.department) params.department = f.department;

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
        .map((e) => ({
          id: e.id,
          name: e.name,
          department: e.departmentName || e.departmentId || null,
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
      let rows = raw.map(mapPayrollRegisterFromApi).filter(Boolean);

      // Filtre cycle purement UI (API n’a pas de cycle)
      if (applied.value.cycle) {
        rows = rows.filter((r) => r.cycle === applied.value.cycle);
      }

      records.value = rows;
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
    activeQuick.value = "";
    currentPage.value = 1;
    await fetchRecords();
  }

  async function resetFilters() {
    filters.value = emptyFilters();
    applied.value = emptyFilters();
    searchQuery.value = "";
    activeQuick.value = "";
    currentPage.value = 1;
    await fetchRecords();
  }

  async function applyQuickFilter(key) {
    activeQuick.value = key;
    const next = emptyFilters();

    if (key === "pending" || key === "approved" || key === "paid") {
      next.status = key;
    } else if (key === "thisMonth") {
      next.dateRange = "month";
      next.period = monthKey(0);
    } else if (key === "lastMonth") {
      next.dateRange = "lastMonth";
      next.period = monthKey(-1);
    }

    filters.value = { ...next };
    applied.value = { ...next };
    currentPage.value = 1;
    await fetchRecords();
  }

  async function setSearchAndReload(q) {
    searchQuery.value = q;
    currentPage.value = 1;
    await fetchRecords();
  }

  // Options de filtres dérivées des données chargées + employés
  const departmentOptions = computed(() => {
    const set = new Set();
    for (const e of employeeOptions.value) {
      if (e.department && e.department !== "—") set.add(e.department);
    }
    for (const r of records.value) {
      if (r.department && r.department !== "—") set.add(r.department);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  });

  const cycleOptions = computed(() =>
    cycleCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  /** Périodes disponibles (value = YYYY-MM, label formaté) */
  const periodOptions = computed(() => {
    const map = new Map();
    for (const r of records.value) {
      if (r.periodKey && !map.has(r.periodKey)) {
        map.set(r.periodKey, r.period || formatPeriodLabel(r.periodKey));
      }
    }
    // garder aussi la période filtrée même si 0 résultat
    if (applied.value.period && !map.has(applied.value.period)) {
      map.set(applied.value.period, formatPeriodLabel(applied.value.period));
    }
    return [...map.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([value, label]) => ({ value, label }));
  });

  const kpi = computed(() => computePayrollRegisterKpi(records.value));

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

  function statusLabel(key) {
    return t(`admin.payroll.status.${key}`);
  }

  function statusBadgeClass(key) {
    return PAYROLL_STATUS_UI[key]?.badge ?? "bg-neutral-100 text-neutral-700";
  }

  function cycleLabel(code) {
    return payrollCycleLabel(code, cycleCatalog.value);
  }

  return {
    records,
    employeeOptions,
    departmentOptions,
    cycleOptions,
    periodOptions,
    kpi,
    loading,
    error,
    filters,
    applied,
    searchQuery,
    currentPage,
    itemsPerPage,
    activeQuick,
    totalPages,
    paginatedRows,
    rangeStart,
    rangeEnd,
    visiblePages,
    bootstrap,
    fetchRecords,
    applyFilters,
    resetFilters,
    applyQuickFilter,
    setSearchAndReload,
    statusLabel,
    statusBadgeClass,
    cycleLabel,
  };
}
