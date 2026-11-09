import { computed, onMounted, reactive, ref } from "vue";
import { employeeDocumentsApiService } from "../services/employeeDocuments.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";
import {
  DOCUMENT_CATEGORY_OPTIONS,
  documentCategoriesApiService,
  documentCategoryLabel,
  fallbackDocumentCategories,
} from "../../employee-documents/services/documentCategories.api.service.js";

export { DOCUMENT_CATEGORY_OPTIONS };

export const DOCUMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

export const DOCUMENT_EXPIRY_OPTIONS = [
  { value: "expired", label: "Expired" },
  { value: "expiring", label: "Expiring soon (60 days)" },
  { value: "valid", label: "Valid" },
  { value: "no-expiry", label: "No expiry" },
];

const STATUS_LABEL = Object.fromEntries(
  DOCUMENT_STATUS_OPTIONS.map((o) => [o.value, o.label])
);

function emptyFilters() {
  return { category: "", status: "", expiry: "" };
}

function hasActiveFilters(f) {
  return Boolean(f.category || f.status || f.expiry);
}

function toQueryParams(f) {
  const params = { mine: 1 };
  if (f.category) params.category = f.category;
  if (f.status) params.status = f.status;
  if (f.expiry) params.expiry = f.expiry;
  return params;
}

function resolveFileUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function normalizeEmployeeDocument(raw = {}, catalog = []) {
  const categoryValue = String(raw.category || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const statusValue = String(raw.status || "pending").toLowerCase();

  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId ?? null,
    employee: raw.employee_name ?? raw.employee ?? "—",
    employeeAvatarUrl: raw.employee_avatar_url ?? raw.avatar_url ?? null,
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    name: raw.name || "—",
    reference: raw.reference || "—",
    categoryValue,
    category: documentCategoryLabel(categoryValue, catalog),
    issueDate: raw.issue_date ?? raw.issueDate ?? "",
    expiryDate: raw.expiry_date ?? raw.expiryDate ?? null,
    statusValue,
    status: catalogStatusLabel(
      "employee_documents",
      statusValue,
      STATUS_LABEL[statusValue] || statusValue
    ),
    verifiedBy: raw.verified_by ?? raw.manager_name ?? raw.verifiedBy ?? null,
    verifiedOn: raw.verified_on ?? raw.reviewed_at ?? raw.verifiedOn ?? null,
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
    fileUrl: resolveFileUrl(raw.file_url ?? raw.fileUrl),
  };
}

export function useMyDocuments() {
  const records = ref([]);
  const categoryCatalog = ref(fallbackDocumentCategories());
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");
  const today = new Date().toISOString().slice(0, 10);

  const categoryOptions = computed(() =>
    categoryCatalog.value
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
    pageSize: 10,
    searchFields: ["name", "reference", "category", "status"],
  });

  function onFiltersChange(next) {
    Object.assign(filters, next);
  }

  async function loadCategories() {
    try {
      const list = await documentCategoriesApiService.fetchAll();
      categoryCatalog.value = list.length ? list : fallbackDocumentCategories();
    } catch {
      categoryCatalog.value = fallbackDocumentCategories();
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      await loadCategories();
      const list = await employeeDocumentsApiService.fetchAll(
        toQueryParams(applied)
      );
      records.value = list.map((item) =>
        normalizeEmployeeDocument(item, categoryCatalog.value)
      );
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos documents.";
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

  async function createDocument(payload) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      const created = normalizeEmployeeDocument(
        await employeeDocumentsApiService.create(payload),
        categoryCatalog.value
      );
      records.value = [created, ...records.value];
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d’ajouter le document.";
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
    categoryOptions,
    statusOptions: computed(() =>
      catalogStatusOptions("employee_documents", DOCUMENT_STATUS_OPTIONS)
    ),
    expiryOptions: DOCUMENT_EXPIRY_OPTIONS,
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
    createDocument,
    loadData,
  };
}
