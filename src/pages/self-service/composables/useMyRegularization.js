import { computed, onMounted, ref } from "vue";
import { format, parseISO, isValid } from "date-fns";
import { regularizationsApiService } from "../../attendance/services/regularizations.api.service.js";
import {
  fallbackRegularizationTypes,
  regularizationTypeLabel,
  regularizationTypesApiService,
} from "../../attendance/services/regularizationTypes.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function parseDate(iso) {
  if (!iso) return null;
  try {
    const d = parseISO(String(iso).slice(0, 10));
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

function formatDisplayDate(iso) {
  const d = parseDate(iso);
  return d ? format(d, "MMM dd, yyyy") : iso || "—";
}

function typeLabel(value, catalog = []) {
  return regularizationTypeLabel(value, catalog);
}

function statusLabel(value) {
  return STATUS_LABELS[value] || value || "—";
}

function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function combineDateTime(dateIso, time) {
  if (!dateIso || !time) return "";
  return `${String(dateIso).slice(0, 10)} ${String(time).slice(0, 5)}:00`;
}

function toSelfServiceRow(raw, catalog = []) {
  const dateIso = raw.attendance_date ?? raw.attendanceDate ?? "";
  const checkIn = raw.check_in ?? raw.checkIn ?? null;
  const checkOut = raw.check_out ?? raw.checkOut ?? null;
  const statusValue = raw.status ?? "pending";
  const typeValue = raw.type ?? "";
  const managerName = raw.manager_name ?? raw.managerName ?? null;

  return {
    id: raw.id,
    dateIso,
    date: formatDisplayDate(dateIso),
    typeValue,
    type: typeLabel(typeValue, catalog),
    checkIn,
    checkOut,
    requestedIn: combineDateTime(dateIso, checkIn),
    requestedOut: combineDateTime(dateIso, checkOut),
    reason: raw.reason ?? "",
    statusValue,
    status: statusLabel(statusValue),
    approvedBy: managerName
      ? {
          initials: initialsFromName(managerName),
          name: managerName,
          email: "",
          avatarBg: "bg-secondary-200 text-secondary-700",
        }
      : null,
  };
}

function toApiPayload(form) {
  return {
    attendance_date: form.date,
    type: form.type,
    check_in: form.checkInTime || null,
    check_out: form.checkOutTime || null,
    reason: (form.reason || "").trim(),
    attachment_count: Array.isArray(form.files) ? form.files.length : 0,
  };
}

export function useMyRegularization() {
  const records = ref([]);
  const typeCatalog = ref(fallbackRegularizationTypes());
  const loading = ref(true);
  const saving = ref(false);
  const deleteBusy = ref(false);
  const error = ref("");

  const typeOptions = computed(() =>
    typeCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const {
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  } = usePaginatedSearch(records, {
    pageSize: 10,
    searchFields: ["date", "type", "status", "reason"],
  });

  async function loadTypes() {
    try {
      const list = await regularizationTypesApiService.fetchAll();
      typeCatalog.value = list.length ? list : fallbackRegularizationTypes();
    } catch {
      typeCatalog.value = fallbackRegularizationTypes();
    }
  }

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      await loadTypes();
      const list = await regularizationsApiService.fetchAll({ mine: 1 });
      records.value = list.map((raw) => toSelfServiceRow(raw, typeCatalog.value));
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos régularisations.";
      records.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function save(payload) {
    saving.value = true;
    error.value = "";
    try {
      const body = toApiPayload(payload);
      const raw = payload.id
        ? await regularizationsApiService.update(payload.id, body)
        : await regularizationsApiService.create(body);
      const row = toSelfServiceRow(raw, typeCatalog.value);
      if (payload.id) {
        const idx = records.value.findIndex((r) => r.id === payload.id);
        if (idx !== -1) records.value[idx] = row;
        else records.value = [row, ...records.value];
      } else {
        records.value = [row, ...records.value];
      }
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'enregistrer la régularisation.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function remove(row) {
    if (!row?.id || deleteBusy.value) return false;
    deleteBusy.value = true;
    error.value = "";
    try {
      await regularizationsApiService.remove(row.id);
      records.value = records.value.filter((r) => r.id !== row.id);
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de supprimer la régularisation.";
      return false;
    } finally {
      deleteBusy.value = false;
    }
  }

  onMounted(load);

  return {
    loading,
    saving,
    deleteBusy,
    error,
    records,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    typeOptions,
    load,
    save,
    remove,
  };
}
