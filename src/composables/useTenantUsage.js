import { ref } from "vue";
import { tenantUsageApiService } from "../pages/tenant/services/tenant-usage.api.service.js";

function mapPlan(apiPlan) {
  if (!apiPlan) {
    return {
      name: "—",
      tagline: "",
      price: "—",
      cadence: "per monthly",
      renewsOn: null,
    };
  }

  return {
    name: apiPlan.name ?? "—",
    tagline: apiPlan.tagline ?? "",
    price: apiPlan.price ?? "—",
    cadence: apiPlan.cadence ?? "per monthly",
    renewsOn: apiPlan.renews_on ?? null,
  };
}

function mapMetric(apiMetric) {
  return {
    id: apiMetric.id,
    label: apiMetric.label,
    icon: apiMetric.icon ?? "user",
    used: Number(apiMetric.used ?? 0),
    limit: apiMetric.limit == null ? null : Number(apiMetric.limit),
    unit: apiMetric.unit ?? null,
    display: apiMetric.display ?? null,
    warningThreshold: apiMetric.warning_threshold ?? 0.8,
  };
}

export function usagePercent(used, limit) {
  if (limit == null || limit <= 0) return 0;
  const ratio = (Number(used) / Number(limit)) * 100;
  if (!Number.isFinite(ratio)) return 0;
  return Math.max(0, Math.min(100, ratio));
}

export function useTenantUsage() {
  const loading = ref(false);
  const error = ref("");
  const plan = ref(mapPlan(null));
  const metrics = ref([]);

  async function load() {
    loading.value = true;
    error.value = "";

    try {
      const data = await tenantUsageApiService.fetchUsage();
      plan.value = mapPlan(data.plan);
      metrics.value = (data.metrics ?? []).map(mapMetric);
    } catch (e) {
      error.value =
        e.response?.data?.message || "Unable to load usage data.";
      plan.value = mapPlan(null);
      metrics.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    plan,
    metrics,
    load,
  };
}
