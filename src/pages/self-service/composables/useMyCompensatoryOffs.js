import { computed, onMounted, reactive, ref } from "vue";
import { compensatoryOffsApiService } from "../../leave/services/compensatoryOffs.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";

const STATUS_FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function emptyFilters() {
  return { status: "", dateFrom: "", dateTo: "" };
}

function hasActiveFilters(f) {
  return Boolean(f.status || f.dateFrom || f.dateTo);
}

function toQueryParams(f) {
  const params = { mine: 1 };
  if (f.status) params.status = f.status;
  if (f.dateFrom) params.from = f.dateFrom;
  if (f.dateTo) params.to = f.dateTo;
  return params;
}

function emptyKpis() {
  return { totalEarned: 0, available: 0, used: 0, expired: 0 };
}

function computeKpis(rows) {
  let totalEarned = 0;
  let used = 0;
  let expired = 0;
  let available = 0;

  for (const row of rows) {
    if (row.statusValue !== "approved") continue;
    totalEarned += row.compOffDays;
    if (row.usageStatusValue === "used") used += row.compOffDays;
    else if (row.usageStatusValue === "expired") expired += row.compOffDays;
    else available += row.compOffDays;
  }

  return {
    totalEarned: Math.round(totalEarned * 100) / 100,
    available: Math.round(available * 100) / 100,
    used: Math.round(used * 100) / 100,
    expired: Math.round(expired * 100) / 100,
  };
}

export function normalizeMyCompOff(raw = {}) {
  const statusValue = String(raw.status || "pending").toLowerCase();
  let usageValue = raw.usage_status ?? raw.usageStatus ?? null;
  if (statusValue !== "approved") usageValue = null;

  return {
    id: raw.id,
    workedDate: raw.worked_date ?? raw.workedDate ?? "",
    hoursWorked: Number(raw.hours_worked ?? raw.hoursWorked ?? 0),
    compOffDays: Number(raw.comp_off_days ?? raw.compOffDays ?? 0),
    expiryDate: raw.expiry_date ?? raw.expiryDate ?? "",
    statusValue,
    status: catalogStatusLabel("compensatory_offs", statusValue, statusValue),
    usageStatusValue: usageValue,
    usageStatus: usageValue
      ? catalogStatusLabel("compensatory_off_usage", usageValue, usageValue)
      : "-",
    reason: raw.reason ?? "",
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
  };
}

export function useMyCompensatoryOffs() {
  const records = ref([]);
  const loading = ref(true);
  const kpiLoading = ref(true);
  const saving = ref(false);
  const cancelBusy = ref(false);
  const error = ref("");
  const kpis = ref(emptyKpis());
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
    searchFields: ["workedDate", "expiryDate", "status", "usageStatus", "reason"],
  });

  function onFiltersChange(next) {
    Object.assign(filters, next);
  }

  async function loadData({ updateSummary = false } = {}) {
    loading.value = true;
    error.value = "";
    try {
      const list = await compensatoryOffsApiService.fetchAll(toQueryParams(applied));
      const rows = list.map(normalizeMyCompOff);
      records.value = rows;
      if (updateSummary || !hasActiveFilters(applied)) {
        kpis.value = computeKpis(rows);
        kpiLoading.value = false;
      }
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos compensatory offs.";
      records.value = [];
      if (updateSummary) {
        kpis.value = emptyKpis();
        kpiLoading.value = false;
      }
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

  async function createRequest(payload) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      const created = normalizeMyCompOff(
        await compensatoryOffsApiService.create({
          worked_date: payload.workedDate,
          hours_worked: payload.hoursWorked,
          comp_off_days: payload.compOffDays,
          reason: payload.reason,
        })
      );
      records.value = [created, ...records.value];
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de créer la demande.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function cancelRequest(row) {
    if (!row?.id || cancelBusy.value) return false;
    if (row.statusValue !== "pending") return false;
    cancelBusy.value = true;
    error.value = "";
    try {
      await compensatoryOffsApiService.remove(row.id);
      records.value = records.value.filter((r) => r.id !== row.id);
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
    today,
    loading,
    kpiLoading,
    saving,
    cancelBusy,
    error,
    kpis: computed(() => kpis.value),
    filters,
    statuses: computed(() => catalogStatusOptions("compensatory_offs", STATUS_FILTERS)),
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
    createRequest,
    cancelRequest,
    loadData,
  };
}
