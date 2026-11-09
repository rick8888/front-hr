import { ref } from "vue";
import { tenantDashboardApiService } from "../pages/tenant/services/tenant-dashboard.api.service.js";
import { t } from "../i18n/index.js";

function emptyDashboard() {
  return {
    productName: "Bravo RH",
    firstName: "—",
    applicationUrl: "#",
    currentPlan: "—",
    planStatus: "—",
    nextPaymentAmount: "—",
    nextPaymentDate: "—",
    usersCount: 0,
    usersAllowed: null,
    usersAllowedLabel: "—",
    priceLabel: "—",
    startedDate: "—",
    nextBillingDate: "—",
  };
}

function mapDashboard(data) {
  if (!data) return emptyDashboard();

  return {
    productName: data.product_name ?? "Bravo RH",
    firstName: data.first_name ?? "—",
    applicationUrl: data.application_url ?? "#",
    currentPlan: data.current_plan ?? "—",
    planStatus: data.plan_status ?? "—",
    nextPaymentAmount: data.next_payment_amount ?? "—",
    nextPaymentDate: data.next_payment_date ?? "—",
    usersCount: Number(data.users_count ?? 0),
    usersAllowed:
      data.users_allowed == null ? null : Number(data.users_allowed),
    usersAllowedLabel: data.users_allowed_label ?? "—",
    priceLabel: data.price_label ?? "—",
    startedDate: data.started_date ?? "—",
    nextBillingDate: data.next_billing_date ?? "—",
  };
}

export function useTenantDashboard() {
  const loading = ref(false);
  const error = ref("");
  const dashboard = ref(emptyDashboard());

  async function load() {
    loading.value = true;
    error.value = "";

    try {
      const data = await tenantDashboardApiService.fetchDashboard();
      dashboard.value = mapDashboard(data);
    } catch (e) {
      error.value = e.response?.data?.message || t("tenant.dashboard.loadError");
      dashboard.value = emptyDashboard();
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    dashboard,
    load,
  };
}
