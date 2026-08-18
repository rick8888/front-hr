import { computed, ref, watch } from "vue";
import { format, parseISO } from "date-fns";
import { leaveRequestsApiService } from "../services/leaveRequests.api.service.js";
import {
  LEAVE_STATUS_OPTIONS,
  leaveStatusLabel,
  leaveStatusValue,
  leaveTypeLabel,
  normalizeLeaveRequest,
} from "./useLeaveRequests.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function formatDisplayDate(iso) {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd MMM yyyy");
  } catch {
    return iso;
  }
}

function statusBadgeClass(statusValue) {
  if (statusValue === "approved") {
    return "bg-green-50 text-green-700 ring-green-600/15";
  }
  if (statusValue === "pending") {
    return "bg-amber-50 text-amber-700 ring-amber-600/15";
  }
  if (statusValue === "cancelled") {
    return "bg-red-50 text-red-700 ring-red-600/15";
  }
  return "bg-neutral-100 text-neutral-600 ring-neutral-300/60";
}

function statusReportLabel(statusValue) {
  if (statusValue === "cancelled") return "Rejected";
  return leaveStatusLabel(statusValue);
}

export function useLeaveHistoryReport() {
  const { t } = useI18n();
  const loading = ref(false);
  const error = ref("");
  const rows = ref([]);
  const leaveTypeCatalog = ref([]);

  const draftFilters = ref({
    from: "",
    to: "",
    employeeCode: "",
    department: "",
    leaveType: "",
    status: "",
  });
  const activeFilters = ref({ ...draftFilters.value });

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(25);

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

  const departmentOptions = computed(() =>
    [
      ...new Set(
        rows.value
          .map((row) => row.department)
          .filter((dept) => dept && dept !== "—"),
      ),
    ].sort(),
  );

  const leaveTypeOptions = computed(() => {
    const fromCatalog = leaveTypeCatalog.value.map((type) => ({
      code: type.code,
      name: type.name,
    }));
    if (fromCatalog.length) return fromCatalog;
    const fromRows = new Map();
    for (const row of rows.value) {
      if (row.leaveTypeValue) {
        fromRows.set(row.leaveTypeValue, row.leaveType);
      }
    }
    return [...fromRows.entries()].map(([code, name]) => ({ code, name }));
  });

  const statusOptions = computed(() =>
    LEAVE_STATUS_OPTIONS.map((option) => ({
      value: option.value,
      label: option.value === "cancelled" ? "Rejected" : option.label,
    })),
  );

  const filteredRows = computed(() => {
    const f = activeFilters.value;
    const q = searchQuery.value.trim().toLowerCase();

    return rows.value.filter((row) => {
      if (f.employeeCode && row.employeeCode !== f.employeeCode) return false;
      if (f.department && row.department !== f.department) return false;
      if (f.leaveType) {
        const code = String(row.leaveTypeValue || "").toUpperCase();
        const selected = String(f.leaveType).toUpperCase();
        if (code !== selected && row.leaveType !== f.leaveType) return false;
      }
      if (f.status && row.statusValue !== f.status) return false;
      if (f.from && row.to && row.to < f.from) return false;
      if (f.to && row.from && row.from > f.to) return false;
      if (!q) return true;
      return [
        row.employee,
        row.employeeCode,
        row.leaveType,
        row.status,
        row.department,
        row.managerName,
      ].some((value) => String(value || "").toLowerCase().includes(q));
    });
  });

  const kpis = computed(() => {
    const list = filteredRows.value;
    return {
      total: list.length,
      approved: list.filter((row) => row.statusValue === "approved").length,
      pending: list.filter((row) => row.statusValue === "pending").length,
      rejected: list.filter((row) => row.statusValue === "cancelled").length,
    };
  });

  const totalFiltered = computed(() => filteredRows.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)),
  );
  const paginatedRows = computed(() => {
    const safePage = Math.min(page.value, pageCount.value);
    const start = (safePage - 1) * pageSize.value;
    return filteredRows.value.slice(start, start + pageSize.value).map((row) => ({
      ...row,
      dateRangeLabel: `${formatDisplayDate(row.from)} → ${formatDisplayDate(row.to)}`,
      requestedOnLabel: formatDisplayDate(row.submittedAt),
      actionBy: row.managerName || "—",
      statusLabel: statusReportLabel(row.statusValue),
      statusClass: statusBadgeClass(row.statusValue),
    }));
  });
  const rangeLabel = computed(() => {
    if (!totalFiltered.value) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, totalFiltered.value),
    };
  });

  watch([searchQuery, pageSize, activeFilters], () => {
    page.value = 1;
  }, { deep: true });

  async function loadFilterCatalog() {
    try {
      const options = await leaveRequestsApiService.fetchFilterOptions();
      leaveTypeCatalog.value = Array.isArray(options.leave_types)
        ? options.leave_types
        : [];
    } catch {
      leaveTypeCatalog.value = [];
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      if (!leaveTypeCatalog.value.length) {
        await loadFilterCatalog();
      }

      const f = activeFilters.value;
      const params = {
        from: f.from || undefined,
        to: f.to || undefined,
        leave_type: f.leaveType || undefined,
        status: f.status || undefined,
      };

      const list = await leaveRequestsApiService.fetchAll(params);
      rows.value = list.map((raw) =>
        normalizeLeaveRequest(raw, leaveTypeCatalog.value),
      );
    } catch (exception) {
      error.value =
        parseApiError(exception) || t("admin.leave.reports.history.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    activeFilters.value = { ...draftFilters.value };
    await loadData();
  }

  async function resetFilters() {
    draftFilters.value = {
      from: "",
      to: "",
      employeeCode: "",
      department: "",
      leaveType: "",
      status: "",
    };
    activeFilters.value = { ...draftFilters.value };
    searchQuery.value = "";
    page.value = 1;
    await loadData();
  }

  return {
    loading,
    error,
    draftFilters,
    searchQuery,
    page,
    pageSize,
    employeeOptions,
    departmentOptions,
    leaveTypeOptions,
    statusOptions,
    kpis,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    loadData,
    applyFilters,
    resetFilters,
    leaveStatusValue,
    leaveTypeLabel,
  };
}
