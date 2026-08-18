import { computed, onMounted, ref } from "vue";
import { format, parseISO, isValid } from "date-fns";
import { myLeaveBalanceApiService } from "../services/myLeaveBalance.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";

const EMPTY_SUMMARY = {
  totalEntitlement: 0,
  usedLeaves: 0,
  pendingApproval: 0,
  availableBalance: 0,
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

function statusLabel(value) {
  if (value === "cancelled") return "Rejected";
  if (value === "approved") return "Approved";
  if (value === "pending") return "Pending";
  return value || "—";
}

function toByTypeRow(raw = {}) {
  return {
    code: raw.code ?? "",
    leaveType: raw.leave_type ?? raw.leaveType ?? "—",
    entitlement: Number(raw.entitlement ?? 0),
    used: Number(raw.used ?? 0),
    pending: Number(raw.pending ?? 0),
    available: Number(raw.available ?? 0),
  };
}

function toUpcomingItem(raw = {}) {
  return {
    id: raw.id,
    leaveType: raw.leave_type ?? raw.leaveType ?? "—",
    rangeLabel: raw.range_label ?? raw.rangeLabel ?? "—",
    days: Number(raw.days ?? 0),
    status: statusLabel(raw.status),
  };
}

function toHistoryRow(raw = {}) {
  return {
    id: raw.id,
    leaveType: raw.leave_type ?? raw.leaveType ?? "—",
    fromDate: formatDisplayDate(raw.start_date ?? raw.fromDate),
    toDate: formatDisplayDate(raw.end_date ?? raw.toDate),
    days: Number(raw.days ?? 0),
    status: statusLabel(raw.status),
    appliedOn: formatDisplayDate(raw.submitted_at ?? raw.appliedOn),
  };
}

function toSummary(raw = {}) {
  return {
    totalEntitlement: Number(raw.total_entitlement ?? raw.totalEntitlement ?? 0),
    usedLeaves: Number(raw.used_leaves ?? raw.usedLeaves ?? 0),
    pendingApproval: Number(raw.pending_approval ?? raw.pendingApproval ?? 0),
    availableBalance: Number(raw.available_balance ?? raw.availableBalance ?? 0),
  };
}

export function useMyLeaveBalance() {
  const year = ref(new Date().getFullYear());
  const loading = ref(true);
  const error = ref("");
  const summary = ref({ ...EMPTY_SUMMARY });
  const byType = ref([]);
  const upcoming = ref([]);
  const recentHistory = ref([]);

  /** Aperçu graphique : types avec un peu d’activité / solde, max 8. */
  const chartRows = computed(() => {
    const rows = byType.value.filter(
      (r) => r.entitlement > 0 || r.used > 0 || r.available > 0
    );
    const source = rows.length ? rows : byType.value;
    return source.slice(0, 8);
  });

  const chartMaxDays = computed(() => {
    let max = 8;
    for (const row of chartRows.value) {
      max = Math.max(max, row.entitlement, row.used, row.available);
    }
    return Math.min(96, Math.ceil(max) || 8);
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const payload = await myLeaveBalanceApiService.fetchMine(year.value);
      summary.value = toSummary(payload.summary);
      byType.value = (payload.by_type ?? payload.byType ?? []).map(toByTypeRow);
      upcoming.value = (payload.upcoming ?? []).map(toUpcomingItem);
      recentHistory.value = (payload.recent_history ?? payload.recentHistory ?? []).map(
        toHistoryRow
      );
      if (payload.year) year.value = Number(payload.year);
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger votre solde de congé.";
      summary.value = { ...EMPTY_SUMMARY };
      byType.value = [];
      upcoming.value = [];
      recentHistory.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadData);

  return {
    year,
    loading,
    error,
    summary,
    byType,
    chartRows,
    chartMaxDays,
    upcoming,
    recentHistory,
    loadData,
  };
}
