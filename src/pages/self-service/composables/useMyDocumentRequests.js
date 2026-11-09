import { computed, onMounted, reactive, ref } from "vue";
import { documentRequestsApiService } from "../services/documentRequests.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";

export const DOC_REQUEST_TYPE_OPTIONS = [
  { value: "employment_certificate", label: "Employment Certificate" },
  { value: "salary_letter", label: "Salary Letter" },
  { value: "experience_letter", label: "Experience Letter" },
  { value: "noc", label: "No Objection Certificate (NOC)" },
  { value: "address_proof", label: "Address Proof" },
  { value: "bank_letter", label: "Bank Letter" },
  { value: "other", label: "Other" },
];

export const DOC_REQUEST_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
];

const TYPE_LABEL = Object.fromEntries(
  DOC_REQUEST_TYPE_OPTIONS.map((o) => [o.value, o.label])
);
const STATUS_LABEL = Object.fromEntries(
  DOC_REQUEST_STATUS_OPTIONS.map((o) => [o.value, o.label])
);

function emptyFilters() {
  return { type: "", status: "" };
}

function hasActiveFilters(f) {
  return Boolean(f.type || f.status);
}

function toQueryParams(f) {
  const params = { mine: 1 };
  if (f.type) params.type = f.type;
  if (f.status) params.status = f.status;
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

export function normalizeDocumentRequest(raw = {}) {
  const typeValue = String(raw.type || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const statusValue = String(raw.status || "pending")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId ?? null,
    employee: raw.employee_name ?? raw.employee ?? "—",
    employeeAvatarUrl: raw.employee_avatar_url ?? raw.avatar_url ?? null,
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    typeValue,
    type: TYPE_LABEL[typeValue] || raw.type || "—",
    purpose: raw.purpose ?? "",
    requestedDate:
      raw.requested_date ?? raw.requestedDate ?? raw.created_at?.slice?.(0, 10) ?? "",
    neededBy: raw.needed_by ?? raw.neededBy ?? null,
    statusValue,
    status: catalogStatusLabel(
      "document_requests",
      statusValue,
      STATUS_LABEL[statusValue] || statusValue
    ),
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
    managerName: raw.manager_name ?? raw.managerName ?? null,
    reviewedAt: raw.reviewed_at ?? raw.reviewedAt ?? null,
    fileUrl: resolveFileUrl(raw.file_url ?? raw.fileUrl),
  };
}

export function useMyDocumentRequests() {
  const records = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");
  const today = new Date().toISOString().slice(0, 10);

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
    searchFields: ["type", "status", "purpose", "requestedDate", "id"],
  });

  function onFiltersChange(next) {
    Object.assign(filters, next);
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await documentRequestsApiService.fetchAll(
        toQueryParams(applied)
      );
      records.value = list.map(normalizeDocumentRequest);
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos demandes de documents.";
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

  async function createRequest(payload) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      const created = normalizeDocumentRequest(
        await documentRequestsApiService.create(payload)
      );
      records.value = [created, ...records.value];
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de soumettre la demande de document.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function cancelRequest(id) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await documentRequestsApiService.remove(id);
      records.value = records.value.filter((r) => r.id !== id);
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'annuler la demande de document.";
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
    typeOptions: DOC_REQUEST_TYPE_OPTIONS,
    statusOptions: computed(() =>
      catalogStatusOptions("document_requests", DOC_REQUEST_STATUS_OPTIONS)
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
    createRequest,
    cancelRequest,
    loadData,
  };
}
