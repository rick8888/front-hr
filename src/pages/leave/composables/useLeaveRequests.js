import { computed, ref, watch } from "vue";
import { leaveRequestsApiService } from "../services/leaveRequests.api.service.js";
import { leaveTypesApiService } from "../services/leaveTypes.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";
import { catalogStatusLabel, catalogStatusOptions } from "../../../stores/entityStatusCatalog.store.js";

/** Fallback pour d'anciennes demandes stockées en slug. */
export const LEAVE_TYPE_OPTIONS = [
  { value: "casual_leave", label: "Casual Leave" },
  { value: "emergency_leave", label: "Emergency Leave" },
  { value: "sick_leave", label: "Sick Leave" },
  { value: "voting_leave", label: "Voting Leave" },
  { value: "work_from_home", label: "Work From Home" },
  { value: "maternity_leave", label: "Maternity Leave" },
  { value: "paternity_leave", label: "Paternity Leave" },
];

export const LEAVE_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "cancelled", label: "Cancelled" },
];

export const LEAVE_TYPE_LABELS = LEAVE_TYPE_OPTIONS.map((o) => o.label);
export const LEAVE_STATUS_LABELS = LEAVE_STATUS_OPTIONS.map((o) => o.label);

const TYPE_LABEL_BY_VALUE = Object.fromEntries(
  LEAVE_TYPE_OPTIONS.map((o) => [o.value, o.label])
);
const STATUS_LABEL_BY_VALUE = Object.fromEntries(
  LEAVE_STATUS_OPTIONS.map((o) => [o.value, o.label])
);
const STATUS_VALUE_BY_LABEL = Object.fromEntries(
  LEAVE_STATUS_OPTIONS.map((o) => [o.label, o.value])
);

function normalize(s) {
  return (s || "").toString().toLowerCase().trim();
}

function dateInRange(isoDay, from, to) {
  if (!isoDay) return true;
  return isoDay >= from && isoDay <= to;
}

export function leaveTypeLabel(valueOrLabel, catalog = []) {
  if (!valueOrLabel) return "—";
  const code = String(valueOrLabel).toUpperCase();
  const fromDb = catalog.find(
    (t) => String(t.code).toUpperCase() === code || t.name === valueOrLabel
  );
  if (fromDb) return fromDb.name;
  return TYPE_LABEL_BY_VALUE[valueOrLabel] || valueOrLabel;
}

export function leaveStatusLabel(valueOrLabel, t) {
  if (!valueOrLabel) return "—";
  const value = STATUS_LABEL_BY_VALUE[valueOrLabel]
    ? valueOrLabel
    : leaveStatusValue(valueOrLabel);
  const fromCatalog = catalogStatusLabel("leave_requests", value);
  if (fromCatalog && fromCatalog !== value) return fromCatalog;
  if (t && value) return t(`admin.leave.status.${value}`);
  return STATUS_LABEL_BY_VALUE[valueOrLabel] || valueOrLabel;
}

export function leaveStatusValue(valueOrLabel) {
  if (!valueOrLabel) return "";
  return STATUS_VALUE_BY_LABEL[valueOrLabel] || valueOrLabel;
}

export function normalizeLeaveRequest(raw, catalog = [], t) {
  const leaveTypeRaw = raw.leave_type ?? raw.leaveType ?? "";
  const statusRaw = raw.status ?? "pending";

  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId ?? null,
    employee: raw.employee_name ?? raw.employee ?? "—",
    employeeCode: raw.employee_code ?? raw.employeeCode ?? raw.matricule ?? "",
    department: raw.department || "—",
    leaveType: leaveTypeLabel(leaveTypeRaw, catalog),
    leaveTypeValue: leaveTypeRaw,
    from: raw.start_date ?? raw.startDate ?? raw.from ?? "",
    to: raw.end_date ?? raw.endDate ?? raw.to ?? "",
    days: Number(raw.total_days ?? raw.totalDays ?? raw.days ?? 0),
    durationKind: raw.duration_kind ?? raw.durationKind ?? "full",
    status: leaveStatusLabel(statusRaw, t),
    statusValue: leaveStatusValue(statusRaw),
    reason: raw.reason ?? "",
    document: raw.document ?? null,
    submittedAt: raw.submitted_at ?? raw.submittedAt ?? "",
    emergencyContact: Boolean(raw.emergency_contact ?? raw.emergencyContact),
    travelingAbroad: Boolean(raw.traveling_abroad ?? raw.travelingAbroad),
    managerName: raw.manager_name ?? raw.managerName ?? null,
    cancelReason: raw.cancel_reason ?? raw.cancelReason ?? null,
    reviewedAt: raw.reviewed_at ?? raw.reviewedAt ?? null,
    approvedAt:
      leaveStatusValue(statusRaw) === "approved"
        ? raw.reviewed_at ?? raw.reviewedAt ?? null
        : null,
    cancelledAt:
      leaveStatusValue(statusRaw) === "cancelled"
        ? raw.reviewed_at ?? raw.reviewedAt ?? null
        : null,
  };
}

function toApiPayload(payload) {
  return {
    employee_id: Number(payload.employeeId),
    leave_type: String(payload.leaveTypeCode || payload.leaveType || "").trim(),
    duration_kind: payload.durationKind || "full",
    start_date: payload.from,
    end_date: payload.to,
    total_days: Number(payload.days),
    reason: (payload.reason || "").trim(),
    emergency_contact: Boolean(payload.emergencyContact),
    traveling_abroad: Boolean(payload.travelingAbroad),
    document: payload.document || null,
  };
}

export function useLeaveRequests() {
  const { t, locale } = useI18n();
  const requests = ref([]);
  const employees = ref([]);
  const leaveTypes = ref([]);
  const loading = ref(true);
  const filtering = ref(false);
  const saving = ref(false);
  const error = ref("");
  let filteringTimer = null;

  const filters = ref({
    employeeCode: "",
    date: "",
    leaveType: "",
    status: "",
  });
  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const isNewRequestModalOpen = ref(false);
  const isRejectModalOpen = ref(false);
  const selectedRequest = ref(null);

  const employeeOptions = computed(() =>
    employees.value.map((e) => ({
      id: e.id,
      name: e.name || e.full_name || `${e.first_name || ""} ${e.last_name || ""}`.trim(),
      code: e.matricule || e.code || "",
    }))
  );

  /** Types actifs pour la modal (code + name). */
  const leaveTypeOptions = computed(() =>
    leaveTypes.value
      .filter((t) => t.active !== false && t.is_active !== false)
      .map((t) => ({
        code: t.code,
        name: t.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  /** Labels pour le filtre de la liste. */
  const leaveTypeFilterLabels = computed(() =>
    leaveTypeOptions.value.map((t) => t.name)
  );

  const leaveStatusFilterOptions = computed(() => {
    void locale.value;
    return catalogStatusOptions("leave_requests", LEAVE_STATUS_OPTIONS).map((o) => ({
      value: o.value,
      label: o.label || t(`admin.leave.status.${o.value}`),
    }));
  });

  const filtered = computed(() => {
    let list = requests.value;
    const f = filters.value;
    const q = normalize(searchQuery.value);

    if (f.employeeCode) {
      list = list.filter((r) => r.employeeCode === f.employeeCode);
    }
    if (f.leaveType) {
      list = list.filter((r) => r.leaveType === f.leaveType);
    }
    if (f.status) {
      list = list.filter((r) => r.statusValue === f.status);
    }
    if (f.date) {
      list = list.filter((r) => dateInRange(f.date, r.from, r.to));
    }
    if (q) {
      list = list.filter(
        (r) =>
          normalize(r.employee).includes(q) ||
          normalize(r.employeeCode).includes(q) ||
          normalize(r.leaveType).includes(q) ||
          normalize(r.status).includes(q)
      );
    }
    return list;
  });

  const totalFiltered = computed(() => filtered.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value))
  );
  const paginatedRows = computed(() => {
    const p = Math.min(page.value, pageCount.value);
    const start = (p - 1) * pageSize.value;
    return filtered.value.slice(start, start + pageSize.value);
  });
  const rangeLabel = computed(() => {
    if (totalFiltered.value === 0) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, totalFiltered.value),
    };
  });

  watch(
    () => ({ ...filters.value, q: searchQuery.value, ps: pageSize.value }),
    () => {
      page.value = 1;
    },
    { deep: true }
  );

  watch(
    () => ({ ...filters.value, q: searchQuery.value }),
    () => {
      filtering.value = true;
      if (filteringTimer) clearTimeout(filteringTimer);
      filteringTimer = setTimeout(() => {
        filtering.value = false;
        filteringTimer = null;
      }, 300);
    },
    { deep: true }
  );

  watch(totalFiltered, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  watch(locale, () => {
    requests.value = requests.value.map((r) => ({
      ...r,
      status: t(`admin.leave.status.${r.statusValue}`),
    }));
  });

  function mapRequests(list) {
    void locale.value;
    return list.map((raw) => normalizeLeaveRequest(raw, leaveTypes.value, t));
  }

  async function loadEmployees() {
    try {
      employees.value = await employeesApiService.fetchAll();
    } catch {
      employees.value = [];
    }
  }

  async function loadLeaveTypes() {
    try {
      leaveTypes.value = await leaveTypesApiService.fetchAll();
    } catch {
      leaveTypes.value = [];
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      if (!leaveTypes.value.length) {
        await loadLeaveTypes();
      }
      const list = await leaveRequestsApiService.fetchAll();
      requests.value = mapRequests(list);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function createRequest(payload) {
    if (saving.value) return;
    saving.value = true;
    error.value = "";
    try {
      const created = normalizeLeaveRequest(
        await leaveRequestsApiService.create(toApiPayload(payload)),
        leaveTypes.value,
        t
      );
      requests.value = [created, ...requests.value];
      page.value = 1;
      isNewRequestModalOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.createError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function approveRequest(row) {
    error.value = "";
    try {
      const updated = normalizeLeaveRequest(
        await leaveRequestsApiService.updateStatus(row.id, "approved"),
        leaveTypes.value,
        t
      );
      const idx = requests.value.findIndex((r) => r.id === row.id);
      if (idx !== -1) requests.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.approveError");
    }
  }

  function openRejectModal(row) {
    selectedRequest.value = row;
    isRejectModalOpen.value = true;
  }

  async function rejectRequest({ reason }) {
    const req = selectedRequest.value;
    if (!req) return;
    error.value = "";
    try {
      const updated = normalizeLeaveRequest(
        await leaveRequestsApiService.updateStatus(req.id, "cancelled", {
          cancel_reason: reason || null,
        }),
        leaveTypes.value,
        t
      );
      const idx = requests.value.findIndex((r) => r.id === req.id);
      if (idx !== -1) requests.value[idx] = updated;
      selectedRequest.value = null;
      isRejectModalOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.rejectError");
    }
  }

  return {
    requests,
    employees,
    leaveTypes,
    loading,
    filtering,
    saving,
    error,
    filters,
    searchQuery,
    page,
    pageSize,
    isNewRequestModalOpen,
    isRejectModalOpen,
    selectedRequest,
    employeeOptions,
    leaveTypeOptions,
    leaveTypeFilterLabels,
    leaveStatusFilterOptions,
    filtered,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    loadData,
    loadEmployees,
    loadLeaveTypes,
    createRequest,
    approveRequest,
    openRejectModal,
    rejectRequest,
  };
}
