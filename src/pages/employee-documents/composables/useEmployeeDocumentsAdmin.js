import { computed, onMounted, reactive, ref, watch } from "vue";
import { employeeDocumentsApiService } from "../../self-service/services/employeeDocuments.api.service.js";
import {
  DOCUMENT_STATUS_OPTIONS,
  DOCUMENT_EXPIRY_OPTIONS,
  normalizeEmployeeDocument,
} from "../../self-service/composables/useMyDocuments.js";
import {
  documentCategoriesApiService,
  fallbackDocumentCategories,
} from "../services/documentCategories.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { catalogStatusOptions } from "../../../stores/entityStatusCatalog.store.js";
import { useI18n } from "../../../i18n/index.js";

function emptyFilters() {
  return {
    employeeCode: "",
    category: "",
    status: "",
    expiry: "",
  };
}

function toQueryParams(f) {
  const params = {};
  if (f.employeeCode) params.employee_code = f.employeeCode;
  if (f.expiry) params.expiry = f.expiry;
  if (f.status) {
    const status =
      catalogStatusOptions("employee_documents", DOCUMENT_STATUS_OPTIONS).find(
        (o) => o.label === f.status || o.value === f.status
      )?.value || String(f.status).toLowerCase();
    if (status) params.status = status;
  }
  if (f.category) params.category = f.category;
  return params;
}

export function useEmployeeDocumentsAdmin() {
  const { t } = useI18n();
  const rows = ref([]);
  const categoryCatalog = ref(fallbackDocumentCategories());
  const loading = ref(false);
  const actionBusy = ref(false);
  const error = ref("");

  const filters = reactive(emptyFilters());
  const applied = reactive(emptyFilters());

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const categoryOptions = computed(() =>
    categoryCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );
  const statusOptions = computed(() =>
    catalogStatusOptions("employee_documents", DOCUMENT_STATUS_OPTIONS).map(
      (o) => o.label
    )
  );
  const expiryOptions = DOCUMENT_EXPIRY_OPTIONS;

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
      [
        row.employee,
        row.employeeCode,
        row.name,
        row.reference,
        row.category,
        row.status,
        String(row.id),
      ].some((value) => String(value || "").toLowerCase().includes(q))
    );
  });

  const totalFiltered = computed(() => searchedRows.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value))
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
      verified: list.filter((r) => r.statusValue === "verified").length,
      rejected: list.filter((r) => r.statusValue === "rejected").length,
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
      rows.value = list.map((item) =>
        normalizeEmployeeDocument(item, categoryCatalog.value)
      );
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.leave.documents.loadError");
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
      const updated = normalizeEmployeeDocument(
        await employeeDocumentsApiService.updateStatus(row.id, status, extra),
        categoryCatalog.value
      );
      const idx = rows.value.findIndex((item) => item.id === row.id);
      if (idx !== -1) rows.value[idx] = updated;
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.leave.documents.statusError");
      return false;
    } finally {
      actionBusy.value = false;
    }
  }

  async function verifyDocument(row) {
    return patchStatus(row, "verified");
  }

  async function rejectDocument(row, rejectReason = null) {
    return patchStatus(row, "rejected", {
      reject_reason: rejectReason || "Document rejeté par l’administrateur.",
    });
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
    categoryOptions,
    statusOptions,
    expiryOptions,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    kpis,
    loadData,
    onFiltersChange,
    applyFilters,
    resetFilters,
    verifyDocument,
    rejectDocument,
  };
}
