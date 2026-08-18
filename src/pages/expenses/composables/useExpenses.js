import { computed, onMounted, reactive, ref, watch } from "vue";
import { expensesApiService } from "../../self-service/services/expenses.api.service.js";
import {
  EXPENSE_STATUS_OPTIONS,
  normalizeExpense,
} from "../../self-service/composables/useMyExpenses.js";
import {
  expenseTypesApiService,
  fallbackExpenseTypes,
} from "../services/expenseTypes.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";
import { catalogStatusOptions } from "../../../stores/entityStatusCatalog.store.js";

function emptyFilters() {
  return {
    employeeCode: "",
    type: "",
    status: "",
    date: "",
  };
}

function toQueryParams(f) {
  const params = {};
  if (f.employeeCode) params.employee_code = f.employeeCode;
  if (f.date) params.date = f.date;
  if (f.status) {
    const status =
      catalogStatusOptions("expenses", EXPENSE_STATUS_OPTIONS).find(
        (o) => o.label === f.status || o.value === f.status
      )?.value || f.status.toLowerCase();
    if (status) params.status = status;
  }
  if (f.type) params.type = f.type;
  return params;
}

export function useExpenses() {
  const { t } = useI18n();
  const rows = ref([]);
  const typeCatalog = ref(fallbackExpenseTypes());
  const loading = ref(false);
  const actionBusy = ref(false);
  const error = ref("");

  /** Filtres du formulaire (non appliqués tant qu’on n’a pas cliqué Apply). */
  const filters = reactive(emptyFilters());
  const applied = reactive(emptyFilters());

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const typeOptions = computed(() =>
    typeCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );
  const statusOptions = computed(() =>
    catalogStatusOptions("expenses", EXPENSE_STATUS_OPTIONS).map((o) => o.label)
  );

  const employeeOptions = computed(() => {
    const map = new Map();
    for (const row of rows.value) {
      if (!row.employeeCode) continue;
      map.set(row.employeeCode, row.employee);
    }
    return [...map.entries()]
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const searchedRows = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return rows.value;
    return rows.value.filter((row) =>
      [row.employee, row.employeeCode, row.type, row.status, String(row.id)].some(
        (value) => String(value || "").toLowerCase().includes(q),
      ),
    );
  });

  const totalFiltered = computed(() => searchedRows.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)),
  );
  const paginatedRows = computed(() => {
    const safePage = Math.min(page.value, pageCount.value);
    const start = (safePage - 1) * pageSize.value;
    return searchedRows.value.slice(start, start + pageSize.value);
  });
  const rangeLabel = computed(() => {
    if (!totalFiltered.value) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, totalFiltered.value),
    };
  });

  const kpis = computed(() => {
    const list = rows.value;
    return {
      total: list.length,
      pending: list.filter((r) => r.statusValue === "pending").length,
      approved: list.filter((r) => r.statusValue === "approved").length,
      reimbursed: list.filter((r) => r.statusValue === "reimbursed").length,
      pendingAmount: list
        .filter((r) => r.statusValue === "pending")
        .reduce((sum, r) => sum + r.amount, 0),
    };
  });

  watch([searchQuery, pageSize], () => {
    page.value = 1;
  });

  watch(totalFiltered, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  function onFiltersChange(next) {
    Object.assign(filters, next);
  }

  async function loadTypes() {
    try {
      const list = await expenseTypesApiService.fetchAll();
      typeCatalog.value = list.length ? list : fallbackExpenseTypes();
    } catch {
      typeCatalog.value = fallbackExpenseTypes();
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      await loadTypes();
      const list = await expensesApiService.fetchAll(toQueryParams(applied));
      rows.value = list.map((item) => normalizeExpense(item, typeCatalog.value));
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.leave.expenses.loadError");
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    Object.assign(applied, { ...filters });
    page.value = 1;
    await loadData();
  }

  async function resetFilters() {
    Object.assign(filters, emptyFilters());
    Object.assign(applied, emptyFilters());
    searchQuery.value = "";
    page.value = 1;
    await loadData();
  }

  async function patchStatus(row, status, extra = {}) {
    if (!row?.id || actionBusy.value) return false;
    actionBusy.value = true;
    error.value = "";
    try {
      const updated = normalizeExpense(
        await expensesApiService.updateStatus(row.id, status, extra),
        typeCatalog.value,
      );
      const idx = rows.value.findIndex((item) => item.id === row.id);
      if (idx !== -1) rows.value[idx] = updated;
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.leave.expenses.statusError");
      return false;
    } finally {
      actionBusy.value = false;
    }
  }

  async function approveRequest(row) {
    return patchStatus(row, "approved");
  }

  async function rejectRequest(row, rejectReason = null) {
    return patchStatus(row, "rejected", {
      reject_reason: rejectReason,
    });
  }

  async function reimburseRequest(row) {
    return patchStatus(row, "reimbursed");
  }

  onMounted(loadData);

  return {
    rows,
    loading,
    actionBusy,
    error,
    filters,
    searchQuery,
    page,
    pageSize,
    employeeOptions,
    typeOptions,
    statusOptions,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    kpis,
    loadData,
    onFiltersChange,
    applyFilters,
    resetFilters,
    approveRequest,
    rejectRequest,
    reimburseRequest,
  };
}
