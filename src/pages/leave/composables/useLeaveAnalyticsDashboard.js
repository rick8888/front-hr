import { computed, ref } from "vue";
import { format } from "date-fns";
import { leaveBalancesApiService } from "../services/leaveBalances.api.service.js";
import { leaveRequestsApiService } from "../services/leaveRequests.api.service.js";
import { leaveTypesApiService } from "../services/leaveTypes.api.service.js";
import { normalizeLeaveRequest } from "./useLeaveRequests.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function normalizeEmployee(raw = {}) {
  return {
    id: raw.id,
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    department: raw.team ?? raw.department ?? "Unassigned",
    balances: raw.balances ?? {},
  };
}

export function useLeaveAnalyticsDashboard() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const initialDate = `${currentYear}-01-01`;
  const loading = ref(false);
  const error = ref("");
  const employees = ref([]);
  const requests = ref([]);
  const leaveTypes = ref([]);

  const draftFilters = ref({
    from: initialDate,
    department: "",
    leaveType: "",
  });
  const activeFilters = ref({ ...draftFilters.value });

  const departmentOptions = computed(() =>
    [...new Set(employees.value.map((row) => row.department).filter(Boolean))].sort(),
  );

  const leaveTypeOptions = computed(() =>
    leaveTypes.value.map((type) => ({
      code: type.code,
      name: type.name,
    })),
  );

  const employeeByCode = computed(() => {
    const map = new Map();
    for (const employee of employees.value) {
      if (employee.employeeCode) map.set(employee.employeeCode, employee);
    }
    return map;
  });

  const filteredEmployees = computed(() => {
    const department = activeFilters.value.department;
    if (!department) return employees.value;
    return employees.value.filter((employee) => employee.department === department);
  });

  const filteredRequests = computed(() => {
    const filters = activeFilters.value;
    return requests.value.filter((request) => {
      const department =
        employeeByCode.value.get(request.employeeCode)?.department ||
        request.department ||
        "Unassigned";
      if (filters.from && request.to && request.to < filters.from) return false;
      if (filters.department && department !== filters.department) return false;
      if (
        filters.leaveType &&
        String(request.leaveTypeValue).toUpperCase() !==
          String(filters.leaveType).toUpperCase()
      ) {
        return false;
      }
      return true;
    });
  });

  const totalBalance = computed(() =>
    filteredEmployees.value.reduce(
      (total, employee) =>
        total +
        Object.values(employee.balances).reduce(
          (sum, balance) =>
            sum +
            Number(
              balance.available ??
                Number(balance.entitled ?? 0) +
                  Number(balance.carried_forward ?? 0) +
                  Number(balance.additional ?? 0) -
                  Number(balance.used ?? 0),
            ),
          0,
        ),
      0,
    ),
  );

  const kpis = computed(() => {
    const list = filteredRequests.value;
    const today = format(new Date(), "yyyy-MM-dd");
    const approved = list.filter((request) => request.statusValue === "approved");
    const totalLeavesTaken = approved.reduce((sum, request) => sum + request.days, 0);
    const onLeaveCodes = new Set(
      approved
        .filter((request) => request.from <= today && request.to >= today)
        .map((request) => request.employeeCode || request.id),
    );
    const employeeCount = filteredEmployees.value.length;

    return {
      totalLeavesTaken: Number(totalLeavesTaken.toFixed(2)),
      pendingApprovals: list.filter((request) => request.statusValue === "pending").length,
      averageBalance: employeeCount
        ? (totalBalance.value / employeeCount).toFixed(1)
        : "0.0",
      onLeaveToday: onLeaveCodes.size,
    };
  });

  const monthlyTrend = computed(() => {
    const values = Array(12).fill(0);
    for (const request of filteredRequests.value) {
      if (!request.from) continue;
      const month = Number(request.from.slice(5, 7)) - 1;
      if (month >= 0 && month < 12) values[month] += 1;
    }
    return MONTHS.map((label, index) => ({ label, value: values[index] }));
  });

  const leaveTypeDistribution = computed(() => {
    const counts = new Map();
    for (const request of filteredRequests.value) {
      const key = request.leaveType || "Other";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  });

  const departmentUtilization = computed(() => {
    const stats = new Map();
    for (const employee of filteredEmployees.value) {
      const department = employee.department || "Unassigned";
      if (!stats.has(department)) {
        stats.set(department, { employees: 0, used: 0 });
      }
      const bucket = stats.get(department);
      bucket.employees += 1;
      bucket.used += Object.values(employee.balances).reduce(
        (sum, balance) => sum + Number(balance.used ?? 0),
        0,
      );
    }
    return [...stats.entries()]
      .map(([label, value]) => ({
        label,
        value: value.employees ? value.used / value.employees : 0,
      }))
      .sort((a, b) => b.value - a.value);
  });

  const statusDistribution = computed(() => {
    const counts = {
      approved: 0,
      pending: 0,
      rejected: 0,
      cancelled: 0,
    };
    for (const request of filteredRequests.value) {
      if (request.statusValue === "approved") counts.approved += 1;
      else if (request.statusValue === "pending") counts.pending += 1;
      else if (request.statusValue === "cancelled") counts.rejected += 1;
      else counts.cancelled += 1;
    }
    return [
      { label: "Approved", value: counts.approved, color: "#84cc16" },
      { label: "Pending", value: counts.pending, color: "#f59e0b" },
      { label: "Rejected", value: counts.rejected, color: "#ef6b5b" },
      { label: "Cancelled", value: counts.cancelled, color: "#94a3b8" },
    ];
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const year = Number((activeFilters.value.from || initialDate).slice(0, 4));
      const [balancesPayload, requestList, typeList] = await Promise.all([
        leaveBalancesApiService.fetchAll(year),
        leaveRequestsApiService.fetchAll(),
        leaveTypesApiService.fetchAll().catch(() => []),
      ]);
      employees.value = (balancesPayload?.employees ?? []).map(normalizeEmployee);
      leaveTypes.value = Array.isArray(typeList) ? typeList : [];
      requests.value = (Array.isArray(requestList) ? requestList : []).map((request) =>
        normalizeLeaveRequest(request, leaveTypes.value),
      );
    } catch (exception) {
      error.value =
        parseApiError(exception) || t("admin.leave.reports.dashboard.loadError");
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
      from: initialDate,
      department: "",
      leaveType: "",
    };
    activeFilters.value = { ...draftFilters.value };
    await loadData();
  }

  return {
    loading,
    error,
    draftFilters,
    departmentOptions,
    leaveTypeOptions,
    kpis,
    monthlyTrend,
    leaveTypeDistribution,
    departmentUtilization,
    statusDistribution,
    loadData,
    applyFilters,
    resetFilters,
  };
}
