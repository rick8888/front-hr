import { ref, computed } from "vue";
import { useI18n } from "../../../i18n/index.js";
import { payrollApiService } from "../services/payroll.api.service.js";
import {
  mapDashboardRecordFromApi,
  computeDashboardKpi,
  buildPaymentTrend,
  buildStatusSegments,
  pickRecentPayrolls,
  currentPeriodKey,
  lastPeriodKeys,
} from "../mappers/payroll-dashboard.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";

/**
 * Composable tableau de bord paie (/payroll/dashboard).
 * Pattern : API · mapper · état/actions.
 */
export function usePayrollDashboard() {
  const { bcp47 } = useI18n();
  const records = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const companyId = () => useAuthStore().user?.company_id ?? null;

  function buildApiParams() {
    const params = { per_page: 500 };
    const cid = companyId();
    if (cid) params.company_id = cid;

    // Fenêtre large pour KPI + tendance 6 mois (périodes passées)
    const end = currentPeriodKey();
    const [y, m] = end.split("-").map(Number);
    const from = new Date(y, m - 1 - 11, 1); // 12 mois glissants
    params.period_from = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`;
    params.period_to = end;

    return params;
  }

  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      const raw = await payrollApiService.fetchAll(buildApiParams());
      records.value = raw.map(mapDashboardRecordFromApi).filter(Boolean);
    } catch (e) {
      error.value = parseApiError(e);
      records.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function bootstrap() {
    await fetchDashboard();
  }

  const kpi = computed(() => computeDashboardKpi(records.value));

  const trend = computed(() => buildPaymentTrend(records.value, 6, bcp47.value));
  const trendPeriods = new Set(lastPeriodKeys(6));
  const trendRecords = computed(() =>
    records.value.filter((record) => trendPeriods.has(record.periodKey))
  );
  const hasMixedCurrencies = computed(
    () => new Set(trendRecords.value.map((record) => record.currency).filter(Boolean)).size > 1
  );
  const trendCurrency = computed(() => trendRecords.value[0]?.currency || "EUR");

  const statusSegments = computed(() => buildStatusSegments(records.value));

  const recentPayrolls = computed(() => pickRecentPayrolls(records.value, 6));

  return {
    records,
    kpi,
    trend,
    hasMixedCurrencies,
    trendCurrency,
    statusSegments,
    recentPayrolls,
    loading,
    error,
    bootstrap,
    fetchDashboard,
  };
}
