import { computed, ref, watch } from "vue";
import { leaveBalancesApiService } from "../services/leaveBalances.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function normalizeEmployee(raw = {}) {
  return {
    id: raw.id,
    employee: raw.employee ?? "",
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    designation: raw.designation ?? "-",
    team: raw.team ?? raw.department ?? "-",
    email: raw.email ?? "",
    status: raw.status ?? (raw.is_active === false ? "inactive" : "active"),
    isActive: raw.is_active !== false && raw.isActive !== false,
    balances: raw.balances ?? {},
  };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

function normalizeBalance(raw = {}) {
  return {
    id: raw.id,
    code: raw.code ?? "",
    name: raw.name ?? "",
    entitled: Number(raw.entitled ?? 0),
    carriedForward: Number(raw.carried_forward ?? raw.carriedForward ?? 0),
    additional: Number(raw.additional ?? 0),
    used: Number(raw.used ?? 0),
    available: Number(raw.available ?? 0),
  };
}

function normalizeAdjustment(raw = {}) {
  return {
    id: raw.id,
    date: raw.date ? new Date(raw.date).toLocaleString() : "-",
    leaveType: raw.leave_type ?? "-",
    type: String(raw.type ?? "").replaceAll("_", " "),
    days: Number(raw.days ?? 0),
    balanceBefore: Number(raw.balance_before ?? 0),
    balanceAfter: Number(raw.balance_after ?? 0),
    reason: raw.reason ?? "-",
    adjustedBy: raw.adjusted_by ?? "System",
  };
}

export function useLeaveBalances() {
  const { t } = useI18n();
  const rows = ref([]);
  const leaveTypes = ref([]);
  const year = ref(new Date().getFullYear());
  const loading = ref(false);
  const error = ref("");
  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);
  const filters = ref({ employeeCode: "", team: "" });

  const leaveCodes = computed(() => leaveTypes.value.map((type) => type.code));
  const employeeOptions = computed(() =>
    rows.value.map((row) => ({ code: row.employeeCode, name: row.employee })),
  );
  const teamOptions = computed(() =>
    [...new Set(rows.value.map((row) => row.team).filter((team) => team && team !== "-"))].sort(),
  );
  const filteredRows = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    return rows.value.filter((row) => {
      if (filters.value.employeeCode && row.employeeCode !== filters.value.employeeCode) return false;
      if (filters.value.team && row.team !== filters.value.team) return false;
      if (!query) return true;
      return [row.employee, row.employeeCode, row.designation, row.team]
        .some((value) => String(value).toLowerCase().includes(query));
    });
  });
  const totalFiltered = computed(() => filteredRows.value.length);
  const pageCount = computed(() => Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)));
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

  watch([searchQuery, pageSize, filters], () => {
    page.value = 1;
  }, { deep: true });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const payload = await leaveBalancesApiService.fetchAll(year.value);
      leaveTypes.value = asArray(payload?.leave_types ?? payload?.leaveTypes);
      rows.value = asArray(payload?.employees).map(normalizeEmployee);
    } catch (exception) {
      error.value = parseApiError(exception) || t("admin.leave.balances.loadError");
      leaveTypes.value = [];
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  function resetFilters() {
    filters.value = { employeeCode: "", team: "" };
    searchQuery.value = "";
  }

  return {
    rows,
    leaveTypes,
    leaveCodes,
    year,
    loading,
    error,
    searchQuery,
    page,
    pageSize,
    filters,
    employeeOptions,
    teamOptions,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    loadData,
    resetFilters,
  };
}

export function useEmployeeLeaveBalance(employeeCode) {
  const { t } = useI18n();
  const year = ref(new Date().getFullYear());
  const employee = ref(null);
  const balanceRows = ref([]);
  const adjustmentHistory = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  async function loadData() {
    if (!employeeCode.value) return;
    loading.value = true;
    error.value = "";
    try {
      const payload = await leaveBalancesApiService.fetchEmployee(employeeCode.value, year.value);
      employee.value = normalizeEmployee(payload?.employee);
      balanceRows.value = asArray(payload?.balances).map(normalizeBalance);
      adjustmentHistory.value = asArray(payload?.adjustments).map(normalizeAdjustment);
    } catch (exception) {
      employee.value = null;
      balanceRows.value = [];
      adjustmentHistory.value = [];
      error.value = parseApiError(exception) || t("admin.leave.balances.detailLoadError");
    } finally {
      loading.value = false;
    }
  }

  async function setInitial({ leaveTypeId, entitled, reason = null }) {
    saving.value = true;
    error.value = "";
    try {
      const payload = await leaveBalancesApiService.setInitial(employeeCode.value, {
        leave_type_id: leaveTypeId,
        year: year.value,
        entitled,
        reason,
      });
      employee.value = normalizeEmployee(payload?.employee);
      balanceRows.value = asArray(payload?.balances).map(normalizeBalance);
      adjustmentHistory.value = asArray(payload?.adjustments).map(normalizeAdjustment);
      return true;
    } catch (exception) {
      error.value = parseApiError(exception) || t("admin.leave.balances.saveError");
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    year,
    employee,
    balanceRows,
    adjustmentHistory,
    loading,
    saving,
    error,
    loadData,
    setInitial,
  };
}
