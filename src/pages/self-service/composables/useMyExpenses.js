import { computed, onMounted, reactive, ref } from "vue";
import { expensesApiService } from "../services/expenses.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";
import {
  EXPENSE_TYPE_OPTIONS,
  expenseTypeLabel,
  expenseTypesApiService,
  fallbackExpenseTypes,
} from "../../expenses/services/expenseTypes.api.service.js";

export { EXPENSE_TYPE_OPTIONS };

export const EXPENSE_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "reimbursed", label: "Reimbursed" },
];

const STATUS_LABEL = Object.fromEntries(
  EXPENSE_STATUS_OPTIONS.map((o) => [o.value, o.label])
);

function emptyFilters() {
  return { date: "", type: "", status: "" };
}

function hasActiveFilters(f) {
  return Boolean(f.date || f.type || f.status);
}

function toQueryParams(f) {
  const params = { mine: 1 };
  if (f.date) params.date = f.date;
  if (f.type) params.type = f.type;
  if (f.status) params.status = f.status;
  return params;
}

function resolveReceiptUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function normalizeExpense(raw = {}, catalog = []) {
  const typeValue = String(raw.type || "").toLowerCase();
  const statusValue = String(raw.status || "pending").toLowerCase();

  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId ?? null,
    employee: raw.employee_name ?? raw.employee ?? "—",
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    typeValue,
    type: expenseTypeLabel(typeValue, catalog),
    expenseDate: raw.expense_date ?? raw.expenseDate ?? "",
    amount: Number(raw.amount ?? 0),
    currency: raw.currency || "USD",
    statusValue,
    status: catalogStatusLabel(
      "expenses",
      statusValue,
      STATUS_LABEL[statusValue] || statusValue
    ),
    description: raw.description ?? "",
    receiptUrl: resolveReceiptUrl(raw.receipt_url ?? raw.receiptUrl),
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
  };
}

export function useMyExpenses() {
  const records = ref([]);
  const typeCatalog = ref(fallbackExpenseTypes());
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");
  const today = new Date().toISOString().slice(0, 10);

  const typeOptions = computed(() =>
    typeCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const filters = reactive(emptyFilters());
  const applied = reactive(emptyFilters());

  const {
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  } = usePaginatedSearch(records, {
    pageSize: 7,
    searchFields: ["type", "status", "description", "expenseDate", "id"],
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
      records.value = list.map((item) => normalizeExpense(item, typeCatalog.value));
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos notes de frais.";
      records.value = [];
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
    page.value = 1;
    await loadData();
  }

  async function createExpense(payload) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      const created = normalizeExpense(
        await expensesApiService.create(payload),
        typeCatalog.value,
      );
      records.value = [created, ...records.value];
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de soumettre la note de frais.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(loadData);

  return {
    today,
    loading,
    saving,
    error,
    filters,
    typeOptions,
    statusOptions: computed(() =>
      catalogStatusOptions("expenses", EXPENSE_STATUS_OPTIONS)
    ),
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    hasActiveFilters: computed(() => hasActiveFilters(applied)),
    onFiltersChange,
    applyFilters,
    resetFilters,
    createExpense,
    loadData,
  };
}
