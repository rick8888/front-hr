import { computed, reactive, ref, watch } from "vue";
import { addMonths, endOfYear, format, parseISO } from "date-fns";
import { leaveBalancesApiService } from "../services/leaveBalances.api.service.js";
import { leaveTypesApiService } from "../services/leaveTypes.api.service.js";
import { leaveRequestsApiService } from "../services/leaveRequests.api.service.js";
import {
  leaveStatusLabel,
  normalizeLeaveRequest,
} from "./useLeaveRequests.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

const HIGH_BALANCE_THRESHOLD = 10;
const EXTENDED_LEAVE_DAYS = 10;

function formatDays(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function formatDate(isoOrDate) {
  if (!isoOrDate) return "—";
  try {
    const date = typeof isoOrDate === "string" ? parseISO(isoOrDate) : isoOrDate;
    return format(date, "dd MMM yyyy");
  } catch {
    return String(isoOrDate);
  }
}

function computeExpiryDate(year, leaveTypeMeta, carriedForward) {
  if (!carriedForward || carriedForward <= 0) return null;
  const months = Number(leaveTypeMeta?.carryForwardExpiryMonths ?? 0);
  if (!months) return endOfYear(new Date(year, 0, 1));
  return addMonths(endOfYear(new Date(year - 1, 0, 1)), months);
}

function urgencyForExpiry(expiryDate) {
  if (!expiryDate) return { label: "—", tone: "neutral" };
  const now = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / 86400000);
  if (daysLeft <= 7) return { label: "Critical", tone: "red" };
  if (daysLeft <= 15) return { label: "High", tone: "amber" };
  return { label: "Medium", tone: "blue" };
}

function createTableState(sourceRows) {
  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const filtered = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return sourceRows.value;
    return sourceRows.value.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(q),
      ),
    );
  });

  const total = computed(() => filtered.value.length);
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
  const paginated = computed(() => {
    const safePage = Math.min(page.value, pageCount.value);
    const start = (safePage - 1) * pageSize.value;
    return filtered.value.slice(start, start + pageSize.value);
  });
  const range = computed(() => {
    if (!total.value) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, total.value),
    };
  });

  watch([searchQuery, pageSize], () => {
    page.value = 1;
  });
  watch(total, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  // reactive() auto-unwraps nested refs for template v-model bindings
  return reactive({
    searchQuery,
    page,
    pageSize,
    total,
    pageCount,
    paginated,
    range,
  });
}

function rangesOverlap(aFrom, aTo, bFrom, bTo) {
  return aFrom <= bTo && bFrom <= aTo;
}

export function useLeaveComplianceReport() {
  const { t } = useI18n();
  const year = ref(new Date().getFullYear());
  const loading = ref(false);
  const error = ref("");

  const employees = ref([]);
  const leaveTypeCatalog = ref([]);
  const leaveRequests = ref([]);

  const leaveTypeMetaByCode = computed(() => {
    const map = new Map();
    for (const type of leaveTypeCatalog.value) {
      map.set(String(type.code).toUpperCase(), type);
    }
    return map;
  });

  const balanceRows = computed(() => {
    const rows = [];
    for (const employee of employees.value) {
      const balances = employee.balances || {};
      for (const [code, balance] of Object.entries(balances)) {
        const typeMeta = leaveTypeMetaByCode.value.get(String(code).toUpperCase()) || {
          code,
          name: code,
        };
        const carriedForward = Number(
          balance.carried_forward ?? balance.carriedForward ?? 0,
        );
        const entitled = Number(balance.entitled ?? 0);
        const used = Number(balance.used ?? 0);
        const additional = Number(balance.additional ?? 0);
        const available = Number(
          balance.available ?? entitled + carriedForward + additional - used,
        );
        const expiryDate = computeExpiryDate(year.value, typeMeta, carriedForward);

        rows.push({
          id: `${employee.id}-${code}`,
          employeeId: employee.id,
          employee: employee.employee,
          employeeCode: employee.employeeCode,
          leaveType: typeMeta.name || code,
          leaveTypeCode: code,
          carriedForward,
          available,
          expiryDate,
          expiryLabel: formatDate(expiryDate),
          allowEncashment: !!typeMeta.allowEncashment,
          maxEncashmentDays: Number(typeMeta.maxEncashmentDays ?? 0),
        });
      }
    }
    return rows;
  });

  const expiringRows = computed(() => {
    const now = new Date();
    const soon = addMonths(now, 1);
    return balanceRows.value
      .filter((row) => row.carriedForward > 0 && row.expiryDate)
      .filter((row) => row.expiryDate >= now && row.expiryDate <= soon)
      .map((row) => {
        const urgency = urgencyForExpiry(row.expiryDate);
        return {
          ...row,
          cfLeaves: formatDays(row.carriedForward),
          urgencyLabel: urgency.label,
          urgencyTone: urgency.tone,
        };
      });
  });

  const encashmentRows = computed(() =>
    balanceRows.value
      .filter((row) => row.allowEncashment)
      .filter((row) => row.available >= HIGH_BALANCE_THRESHOLD || row.available > 0)
      .map((row) => {
        const maxEncashment = row.maxEncashmentDays || HIGH_BALANCE_THRESHOLD;
        const eligible = Math.min(row.available, maxEncashment);
        const isEligible = eligible > 0 && row.available >= Math.min(HIGH_BALANCE_THRESHOLD, maxEncashment);
        return {
          ...row,
          availableLabel: formatDays(row.available),
          maxEncashmentLabel: formatDays(maxEncashment),
          eligibleLabel: formatDays(isEligible ? eligible : 0),
          statusLabel: isEligible ? "Eligible" : "Below threshold",
          statusTone: isEligible ? "green" : "neutral",
          isEligible,
        };
      })
      .filter((row) => row.isEligible),
  );

  const policyAlertRows = computed(() => {
    const requests = leaveRequests.value;
    const alerts = [];

    for (const request of requests) {
      const foundAlerts = [];
      const typeCode = String(request.leaveTypeValue || "").toUpperCase();
      const balance = balanceRows.value.find(
        (row) =>
          row.employeeCode === request.employeeCode &&
          String(row.leaveTypeCode).toUpperCase() === typeCode,
      );

      if (balance && request.days > balance.available && request.statusValue !== "cancelled") {
        foundAlerts.push("Insufficient balance");
      }
      if (request.days >= EXTENDED_LEAVE_DAYS) {
        foundAlerts.push("Extended leave");
      }

      const overlaps = requests.some(
        (other) =>
          other.id !== request.id &&
          other.employeeCode === request.employeeCode &&
          other.statusValue !== "cancelled" &&
          request.statusValue !== "cancelled" &&
          rangesOverlap(request.from, request.to, other.from, other.to),
      );
      if (overlaps) foundAlerts.push("Overlap");

      if (!foundAlerts.length) continue;

      alerts.push({
        id: request.id,
        employee: request.employee,
        employeeCode: request.employeeCode,
        leaveType: request.leaveType,
        dateRange: `${formatDate(request.from)} → ${formatDate(request.to)}`,
        days: request.days,
        alerts: foundAlerts,
        alertsLabel: foundAlerts.join(", "),
        statusLabel:
          request.statusValue === "cancelled" ? "Rejected" : leaveStatusLabel(request.statusValue),
        statusValue: request.statusValue,
      });
    }

    return alerts;
  });

  const expiringTable = createTableState(expiringRows);
  const encashmentTable = createTableState(encashmentRows);
  const alertsTable = createTableState(policyAlertRows);

  const kpis = computed(() => ({
    expiringSoon: expiringRows.value.length,
    encashmentEligible: encashmentRows.value.length,
    policyAlerts: policyAlertRows.value.length,
  }));

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [balancesPayload, typesList, requestsList] = await Promise.all([
        leaveBalancesApiService.fetchAll(year.value),
        leaveTypesApiService.fetchAll().catch(() => []),
        leaveRequestsApiService.fetchAll().catch(() => []),
      ]);

      leaveTypeCatalog.value = (Array.isArray(typesList) ? typesList : []).map((type) => ({
        id: type.id,
        code: type.code,
        name: type.name,
        allowEncashment: !!(type.allow_encashment ?? type.allowEncashment),
        maxEncashmentDays: type.max_encashment_days ?? type.maxEncashmentDays ?? 0,
        carryForwardExpiryMonths:
          type.carry_forward_expiry_months ??
          type.carryForwardExpiryMonths ??
          null,
      }));

      employees.value = (balancesPayload?.employees ?? []).map((raw) => ({
        id: raw.id,
        employee: raw.employee ?? "",
        employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
        balances: raw.balances ?? {},
      }));

      leaveRequests.value = (Array.isArray(requestsList) ? requestsList : []).map((raw) =>
        normalizeLeaveRequest(raw, leaveTypeCatalog.value),
      );
    } catch (exception) {
      error.value =
        parseApiError(exception) || t("admin.leave.reports.compliance.loadError");
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    kpis,
    formatDays,
    loadData,
    expiringTable,
    encashmentTable,
    alertsTable,
  };
}
