import { ref } from "vue";
import { tenantSubscriptionApiService } from "../pages/tenant/services/tenant-subscription.api.service.js";

function mapCurrent(apiCurrent) {
  if (!apiCurrent) return null;

  return {
    planName: apiCurrent.plan_name,
    planCode: apiCurrent.plan_code,
    status: apiCurrent.status,
    price: apiCurrent.price,
    startedDate: apiCurrent.started_date,
    applicationUrl: apiCurrent.application_url,
    nextBillingDate: apiCurrent.next_billing_date,
    features: apiCurrent.features ?? [],
    canCancel: apiCurrent.can_cancel ?? false,
  };
}

function applySubscriptionData(data, state) {
  state.current.value = mapCurrent(data.current);
  state.plans.value = mapPlans(data.plans);
  state.history.value = mapHistory(data.history);
}

function mapPlans(apiPlans) {
  return (apiPlans ?? []).map((plan) => ({
    id: plan.id,
    planId: plan.plan_id,
    code: plan.code,
    name: plan.name,
    price: plan.price,
    cadence: plan.cadence,
    tagline: plan.tagline,
    badge: plan.badge,
    highlighted: plan.highlighted,
    features: plan.features ?? [],
    isCurrent: plan.is_current,
    cta: plan.cta,
  }));
}

function mapHistory(apiHistory) {
  return (apiHistory ?? []).map((row) => ({
    id: row.id,
    plan: row.plan,
    status: row.status,
    period: row.period,
    amount: row.amount,
  }));
}

export function useTenantSubscription() {
  const loading = ref(false);
  const cancelling = ref(false);
  const error = ref("");
  const successMessage = ref("");
  const current = ref(null);
  const plans = ref([]);
  const history = ref([]);

  const state = { current, plans, history };

  async function load() {
    loading.value = true;
    error.value = "";
    successMessage.value = "";

    try {
      const data = await tenantSubscriptionApiService.fetchSubscription();
      applySubscriptionData(data, state);
    } catch (e) {
      error.value =
        e.response?.data?.message ||
        "Unable to load subscription data.";
      current.value = null;
      plans.value = [];
      history.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function cancel() {
    cancelling.value = true;
    error.value = "";
    successMessage.value = "";

    try {
      const data = await tenantSubscriptionApiService.cancelSubscription();
      applySubscriptionData(data, state);
      successMessage.value = "Your subscription has been cancelled.";
    } catch (e) {
      error.value =
        e.response?.data?.message ||
        "Unable to cancel subscription.";
      throw e;
    } finally {
      cancelling.value = false;
    }
  }

  async function changePlan(payload) {
    error.value = "";
    successMessage.value = "";

    try {
      const data = await tenantSubscriptionApiService.changePlan(payload);
      if (data.subscription) {
        applySubscriptionData(data.subscription, state);
      }
      return data;
    } catch (e) {
      error.value =
        e.response?.data?.message ||
        "Unable to process plan change.";
      throw e;
    }
  }

  return {
    loading,
    cancelling,
    error,
    successMessage,
    current,
    plans,
    history,
    load,
    cancel,
    changePlan,
  };
}
