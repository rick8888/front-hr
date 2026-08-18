import { computed } from "vue";
import { useRoute } from "vue-router";

export function useTenantPlanChangeFlow(subscription) {
  const route = useRoute();

  const planId = computed(() => String(route.query.plan || ""));

  const selectedPlan = computed(
    () => subscription.plans.value.find((plan) => plan.id === planId.value) ?? null
  );

  const flow = computed(() => {
    const current = subscription.current.value;
    const next = selectedPlan.value;

    if (!current || !next || next.isCurrent) {
      return null;
    }

    const isDowngrade = next.cta?.label === "Downgrade";

    return {
      currentPlan: {
        name: current.planName,
        priceLine: current.price,
      },
      newPlan: {
        name: next.name,
        priceLine: `${next.price}${next.cadence}`,
      },
      billingLines: [
        { label: "New plan price", amount: next.price, tone: "neutral" },
      ],
      amountDueToday: next.price,
      infoNotice: isDowngrade
        ? "Your plan will change at the start of the next billing period."
        : "You will be upgraded immediately after payment. Your next billing date will remain the same.",
      currentFeatures: current.features,
      newFeatures: next.features,
    };
  });

  const isReady = computed(
    () => !subscription.loading.value && Boolean(flow.value)
  );

  const isInvalidSelection = computed(() => {
    if (subscription.loading.value || !subscription.current.value || !planId.value) {
      return false;
    }

    if (!selectedPlan.value || selectedPlan.value.isCurrent) {
      return true;
    }

    return false;
  });

  return {
    planId,
    selectedPlan,
    flow,
    isReady,
    isInvalidSelection,
  };
}
