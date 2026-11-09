import { computed, ref, watch } from "vue";
import { compensatoryOffsApiService } from "../services/compensatoryOffs.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";
import {
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";

export const COMPENSATORY_OFF_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
export const COMPENSATORY_OFF_USAGE_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "used", label: "Used" },
  { value: "expired", label: "Expired" },
];

function usageLabel(code) {
  if (!code) return "-";
  return catalogStatusLabel("compensatory_off_usage", code, code);
}

function statusLabel(code) {
  if (!code) return "—";
  return catalogStatusLabel("compensatory_offs", code, code);
}

function normalizeRow(raw = {}) {
  const statusValue = String(raw.status || "pending").toLowerCase();
  let usageValue = raw.usage_status ?? raw.usageStatus ?? null;
  if (statusValue !== "approved") {
    usageValue = null;
  }

  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId ?? null,
    employee: raw.employee_name ?? raw.employee ?? "—",
    employeeAvatarUrl: raw.employee_avatar_url ?? raw.avatar_url ?? null,
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    workedDate: raw.worked_date ?? raw.workedDate ?? "",
    hoursWorked: Number(raw.hours_worked ?? raw.hoursWorked ?? 0),
    compOffDays: Number(raw.comp_off_days ?? raw.compOffDays ?? 0),
    expiryDate: raw.expiry_date ?? raw.expiryDate ?? "",
    statusValue,
    status: statusLabel(statusValue),
    usageStatusValue: usageValue,
    usageStatus: usageLabel(usageValue),
    reason: raw.reason ?? "",
    managerName: raw.manager_name ?? raw.managerName ?? null,
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
  };
}

export function useCompensatoryOffs() {
  const { t } = useI18n();
  const rows = ref([]);
  const loading = ref(false);
  const actionBusy = ref(false);
  const error = ref("");

  const filters = ref({
    employeeCode: "",
    status: "",
    usageStatus: "",
    workedFrom: "",
    workedTo: "",
  });
  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);

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

  const statusOptions = computed(() =>
    catalogStatusOptions("compensatory_offs", COMPENSATORY_OFF_STATUS_OPTIONS)
  );

  const usageStatusOptions = computed(() => [
    ...catalogStatusOptions("compensatory_off_usage", COMPENSATORY_OFF_USAGE_OPTIONS),
    { value: "-", label: "—" },
  ]);

  const filteredRows = computed(() => {
    const f = filters.value;
    const q = searchQuery.value.trim().toLowerCase();
    const statusFilter = f.status || "";
    const usageFilter =
      f.usageStatus === "-"
        ? null
        : f.usageStatus
          ? f.usageStatus
          : undefined;

    return rows.value.filter((row) => {
      if (f.employeeCode && row.employeeCode !== f.employeeCode) return false;
      if (statusFilter && row.statusValue !== statusFilter) return false;
      if (usageFilter !== undefined) {
        if (usageFilter === null && row.usageStatusValue !== null) return false;
        if (usageFilter !== null && row.usageStatusValue !== usageFilter) return false;
      }
      if (f.workedFrom && row.workedDate < f.workedFrom) return false;
      if (f.workedTo && row.workedDate > f.workedTo) return false;
      if (!q) return true;
      return [row.employee, row.employeeCode, row.status, row.usageStatus]
        .some((value) => String(value || "").toLowerCase().includes(q));
    });
  });

  const totalFiltered = computed(() => filteredRows.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)),
  );
  const paginatedRows = computed(() => {
    const safePage = Math.min(page.value, pageCount.value);
    const start = (safePage - 1) * pageSize.value;
    return filteredRows.value.slice(start, start + pageSize.value);
  });
  const rangeLabel = computed(() => {
    if (!totalFiltered.value) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, totalFiltered.value),
    };
  });

  const kpis = computed(() => {
    let totalEarned = 0;
    let used = 0;
    let expired = 0;
    let available = 0;

    for (const row of rows.value) {
      if (row.statusValue !== "approved") continue;
      totalEarned += row.compOffDays;
      if (row.usageStatusValue === "used") used += row.compOffDays;
      else if (row.usageStatusValue === "expired") expired += row.compOffDays;
      else available += row.compOffDays;
    }

    return {
      totalEarned: Math.round(totalEarned),
      used: Math.round(used),
      expired: Math.round(expired),
      available: Math.round(available),
    };
  });

  const monthlyEarnings = computed(() => {
    const year = new Date().getFullYear();
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const buckets = Array(12).fill(0);

    for (const row of rows.value) {
      if (row.statusValue !== "approved" || !row.workedDate) continue;
      const date = new Date(`${row.workedDate}T12:00:00`);
      if (date.getFullYear() !== year) continue;
      buckets[date.getMonth()] += row.compOffDays;
    }

    return labels.map((label, index) => ({
      label,
      value: Number(buckets[index].toFixed(2)),
    }));
  });

  watch([searchQuery, pageSize, filters], () => {
    page.value = 1;
  }, { deep: true });

  watch(totalFiltered, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await compensatoryOffsApiService.fetchAll();
      rows.value = list.map(normalizeRow);
    } catch (exception) {
      error.value =
        parseApiError(exception) || t("admin.leave.compOff.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function approveRequest(row) {
    if (!row?.id || actionBusy.value) return;
    actionBusy.value = true;
    error.value = "";
    try {
      const updated = await compensatoryOffsApiService.updateStatus(row.id, "approved");
      const normalized = normalizeRow(updated);
      const idx = rows.value.findIndex((item) => item.id === row.id);
      if (idx !== -1) rows.value[idx] = normalized;
    } catch (exception) {
      error.value = parseApiError(exception) || t("admin.leave.compOff.approveError");
    } finally {
      actionBusy.value = false;
    }
  }

  async function rejectRequest(row) {
    if (!row?.id || actionBusy.value) return;
    actionBusy.value = true;
    error.value = "";
    try {
      const updated = await compensatoryOffsApiService.updateStatus(row.id, "rejected");
      const normalized = normalizeRow(updated);
      const idx = rows.value.findIndex((item) => item.id === row.id);
      if (idx !== -1) rows.value[idx] = normalized;
    } catch (exception) {
      error.value = parseApiError(exception) || t("admin.leave.compOff.rejectError");
    } finally {
      actionBusy.value = false;
    }
  }

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
    statusOptions,
    usageStatusOptions,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    kpis,
    monthlyEarnings,
    loadData,
    approveRequest,
    rejectRequest,
  };
}
