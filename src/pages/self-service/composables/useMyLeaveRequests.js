import { computed, onMounted, reactive, ref } from "vue";
import { format, parseISO, isValid } from "date-fns";
import { leaveRequestsApiService } from "../../leave/services/leaveRequests.api.service.js";
import { leaveTypesApiService } from "../../leave/services/leaveTypes.api.service.js";
import {
  leaveStatusValue,
  leaveTypeLabel,
  normalizeLeaveRequest,
} from "../../leave/composables/useLeaveRequests.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";

/** Valeurs API + labels UI (Rejected = cancelled côté API). */
const STATUS_FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "cancelled", label: "Rejected" },
];

function emptyFilters() {
  return {
    status: "",
    leaveType: "",
    dateFrom: "",
    dateTo: "",
  };
}

function hasActiveFilters(f) {
  return Boolean(f.status || f.leaveType || f.dateFrom || f.dateTo);
}

function toQueryParams(f) {
  const params = { mine: 1 };
  if (f.status) params.status = f.status;
  if (f.leaveType) params.leave_type = f.leaveType;
  if (f.dateFrom) params.from = f.dateFrom;
  if (f.dateTo) params.to = f.dateTo;
  return params;
}

function formatDisplayDate(iso) {
  if (!iso) return "—";
  try {
    const d = parseISO(iso);
    return isValid(d) ? format(d, "MMM dd, yyyy") : iso;
  } catch {
    return iso;
  }
}

/** Affiche « Rejected » pour cancelled (aligné UI self-service). */
function selfServiceStatusLabel(statusValue) {
  return catalogStatusLabel("leave_requests", statusValue, statusValue || "—");
}

function toSelfServiceRow(raw, catalog = []) {
  const base = normalizeLeaveRequest(raw, catalog);
  const statusValue = leaveStatusValue(base.statusValue || base.status);

  return {
    ...base,
    requestDate: formatDisplayDate(base.submittedAt || raw.created_at),
    fromDate: formatDisplayDate(base.from),
    toDate: formatDisplayDate(base.to),
    days: base.days,
    status: selfServiceStatusLabel(statusValue),
    statusValue,
    leaveType: leaveTypeLabel(base.leaveTypeValue || base.leaveType, catalog),
  };
}

function computeSummary(list) {
  return {
    total: list.length,
    pending: list.filter((r) => r.statusValue === "pending").length,
    approved: list.filter((r) => r.statusValue === "approved").length,
    rejected: list.filter((r) => r.statusValue === "cancelled").length,
  };
}

export function useMyLeaveRequests() {
  const records = ref([]);
  const leaveTypesCatalog = ref([]);
  const loading = ref(true);
  const kpiLoading = ref(true);
  const error = ref("");
  const cancelBusy = ref(false);
  const summary = ref(computeSummary([]));

  const leaveTypes = computed(() =>
    leaveTypesCatalog.value
      .filter((t) => t.active !== false && t.is_active !== false)
      .map((t) => ({ code: t.code, name: t.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  const statuses = computed(() =>
    catalogStatusOptions("leave_requests", STATUS_FILTERS)
  );

  /** Filtres du formulaire (non appliqués tant qu’on n’a pas cliqué Apply). */
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
    searchFields: ["leaveType", "status", "requestDate", "fromDate", "toDate"],
  });

  function onFiltersChange(next) {
    Object.assign(filters, next);
  }

  async function loadLeaveTypes() {
    try {
      leaveTypesCatalog.value = await leaveTypesApiService.fetchAll();
    } catch {
      leaveTypesCatalog.value = [];
    }
  }

  async function loadData({ updateSummary = false } = {}) {
    loading.value = true;
    error.value = "";
    try {
      if (!leaveTypesCatalog.value.length) {
        await loadLeaveTypes();
      }
      const list = await leaveRequestsApiService.fetchAll(toQueryParams(applied));
      const rows = list.map((raw) =>
        toSelfServiceRow(raw, leaveTypesCatalog.value)
      );
      records.value = rows;
      if (updateSummary || !hasActiveFilters(applied)) {
        summary.value = computeSummary(rows);
        kpiLoading.value = false;
      }
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos demandes de congé.";
      records.value = [];
      if (updateSummary) kpiLoading.value = false;
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
    await loadData({ updateSummary: true });
  }

  async function cancelRequest(row, cancelReason = null) {
    if (!row?.id || cancelBusy.value) return false;
    cancelBusy.value = true;
    error.value = "";
    try {
      const updated = toSelfServiceRow(
        await leaveRequestsApiService.updateStatus(row.id, "cancelled", {
          cancel_reason: cancelReason,
        }),
        leaveTypesCatalog.value
      );
      const idx = records.value.findIndex((r) => r.id === row.id);
      if (idx !== -1) records.value[idx] = updated;

      if (row.statusValue === "pending") {
        summary.value = {
          ...summary.value,
          pending: Math.max(0, summary.value.pending - 1),
          rejected: summary.value.rejected + 1,
        };
      }
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'annuler la demande.";
      return false;
    } finally {
      cancelBusy.value = false;
    }
  }

  onMounted(() => loadData({ updateSummary: true }));

  return {
    records,
    loading,
    kpiLoading,
    error,
    cancelBusy,
    filters,
    statuses,
    leaveTypes,
    summary,
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    onFiltersChange,
    applyFilters,
    resetFilters,
    loadData,
    cancelRequest,
  };
}
