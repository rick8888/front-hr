import { computed, ref, watch } from "vue";
import { addMonths, endOfYear, format } from "date-fns";
import { leaveBalancesApiService } from "../services/leaveBalances.api.service.js";
import { leaveTypesApiService } from "../services/leaveTypes.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function normalizeEmployee(raw = {}) {
  return {
    id: raw.id,
    employee: raw.employee ?? "",
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    designation: raw.designation ?? "-",
    department: raw.team ?? raw.department ?? "-",
    balances: raw.balances ?? {},
  };
}

function formatDays(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function computeExpiryDate(year, leaveTypeMeta, carriedForward) {
  if (!carriedForward || carriedForward <= 0) return null;
  const months = Number(leaveTypeMeta?.carryForwardExpiryMonths ?? 0);
  if (!months) return endOfYear(new Date(year, 0, 1));
  return addMonths(endOfYear(new Date(year - 1, 0, 1)), months);
}

export function useLeaveBalanceReport() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const year = ref(currentYear);
  const loading = ref(false);
  const error = ref("");

  const employees = ref([]);
  const leaveTypes = ref([]);
  const leaveTypeCatalog = ref([]);

  const draftFilters = ref({
    employeeCode: "",
    department: "",
    leaveType: "",
    expiringSoon: false,
  });
  const activeFilters = ref({ ...draftFilters.value });

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(25);

  const yearOptions = computed(() => {
    const years = [];
    for (let y = currentYear + 1; y >= currentYear - 5; y -= 1) years.push(y);
    return years;
  });

  const leaveTypeMetaByCode = computed(() => {
    const map = new Map();
    for (const type of leaveTypeCatalog.value) {
      map.set(String(type.code).toUpperCase(), type);
    }
    return map;
  });

  const detailRows = computed(() => {
    const rows = [];
    for (const employee of employees.value) {
      const balances = employee.balances || {};
      const codes = leaveTypes.value.length
        ? leaveTypes.value.map((t) => t.code)
        : Object.keys(balances);

      for (const code of codes) {
        const balance = balances[code] || {};
        const typeMeta =
          leaveTypes.value.find((t) => t.code === code) ||
          leaveTypeMetaByCode.value.get(String(code).toUpperCase()) ||
          {};
        const entitled = Number(balance.entitled ?? 0);
        const used = Number(balance.used ?? 0);
        const available = Number(
          balance.available ??
            entitled +
              Number(balance.carried_forward ?? balance.carriedForward ?? 0) +
              Number(balance.additional ?? 0) -
              used,
        );
        const carriedForward = Number(
          balance.carried_forward ?? balance.carriedForward ?? 0,
        );
        const expiryDate = computeExpiryDate(year.value, typeMeta, carriedForward);

        rows.push({
          id: `${employee.id}-${code}`,
          employeeId: employee.id,
          employee: employee.employee,
          employeeCode: employee.employeeCode,
          department: employee.department,
          leaveType: typeMeta.name || code,
          leaveTypeCode: code,
          entitled,
          used,
          available,
          carriedForward,
          expiryDate,
          expiryLabel: expiryDate ? format(expiryDate, "dd MMM yyyy") : "—",
        });
      }
    }
    return rows;
  });

  const employeeOptions = computed(() =>
    employees.value.map((row) => ({
      code: row.employeeCode,
      name: row.employee,
    })),
  );

  const departmentOptions = computed(() =>
    [
      ...new Set(
        employees.value
          .map((row) => row.department)
          .filter((dept) => dept && dept !== "-"),
      ),
    ].sort(),
  );

  const leaveTypeOptions = computed(() =>
    (leaveTypes.value.length ? leaveTypes.value : leaveTypeCatalog.value).map(
      (type) => ({
        code: type.code,
        name: type.name,
      }),
    ),
  );

  const filteredRows = computed(() => {
    const f = activeFilters.value;
    const q = searchQuery.value.trim().toLowerCase();
    const now = new Date();
    const soonLimit = addMonths(now, 1);

    return detailRows.value.filter((row) => {
      if (f.employeeCode && row.employeeCode !== f.employeeCode) return false;
      if (f.department && row.department !== f.department) return false;
      if (f.leaveType && row.leaveTypeCode !== f.leaveType) return false;
      if (f.expiringSoon) {
        if (!row.expiryDate) return false;
        if (row.expiryDate < now || row.expiryDate > soonLimit) return false;
      }
      if (!q) return true;
      return [row.employee, row.employeeCode, row.leaveType, row.department]
        .some((value) => String(value).toLowerCase().includes(q));
    });
  });

  const kpis = computed(() => {
    const employeeCodes = new Set(filteredRows.value.map((row) => row.employeeCode));
    const entitled = filteredRows.value.reduce((sum, row) => sum + row.entitled, 0);
    const used = filteredRows.value.reduce((sum, row) => sum + row.used, 0);
    const available = filteredRows.value.reduce((sum, row) => sum + row.available, 0);
    return {
      totalEmployees: employeeCodes.size,
      totalEntitled: formatDays(entitled),
      totalUsed: formatDays(used),
      totalAvailable: formatDays(available),
    };
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

  watch([searchQuery, pageSize, activeFilters], () => {
    page.value = 1;
  }, { deep: true });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [payload, catalog] = await Promise.all([
        leaveBalancesApiService.fetchAll(year.value),
        leaveTypesApiService.fetchAll().catch(() => []),
      ]);
      leaveTypes.value = Array.isArray(payload?.leave_types) ? payload.leave_types : [];
      employees.value = (payload?.employees ?? []).map(normalizeEmployee);
      leaveTypeCatalog.value = (Array.isArray(catalog) ? catalog : []).map((type) => ({
        id: type.id,
        code: type.code,
        name: type.name,
        carryForwardExpiryMonths:
          type.carry_forward_expiry_months ??
          type.carryForwardExpiryMonths ??
          type.carryForward?.expiryMonths ??
          null,
      }));
    } catch (exception) {
      error.value =
        parseApiError(exception) || t("admin.leave.reports.balance.loadError");
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
      employeeCode: "",
      department: "",
      leaveType: "",
      expiringSoon: false,
    };
    activeFilters.value = { ...draftFilters.value };
    searchQuery.value = "";
    page.value = 1;
    await loadData();
  }

  return {
    year,
    yearOptions,
    loading,
    error,
    draftFilters,
    searchQuery,
    page,
    pageSize,
    employeeOptions,
    departmentOptions,
    leaveTypeOptions,
    kpis,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    formatDays,
    loadData,
    applyFilters,
    resetFilters,
  };
}
