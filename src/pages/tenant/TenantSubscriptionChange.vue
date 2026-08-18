<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-3xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Change Subscription Plan
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          Review the changes and select your payment method
        </p>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="paymentSuccess"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ paymentSuccess }}
      </div>

      <div
        v-if="!loading && isInvalidSelection"
        class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        Selected plan is not available.
        <button
          type="button"
          class="ml-2 font-semibold text-[#7c7cf8] hover:underline"
          @click="onCancel"
        >
          Back to subscription
        </button>
      </div>

      <div
        v-else-if="!loading && !error && !isReady && !isInvalidSelection"
        class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        Unable to load plan change details.
        <button
          type="button"
          class="ml-2 font-semibold text-[#7c7cf8] hover:underline"
          @click="onCancel"
        >
          Back to subscription
        </button>
      </div>

      <template v-else>
        <section
          class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div
            v-if="loading"
            class="flex min-h-[14rem] items-center justify-center"
          >
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
            <span class="ml-2 text-sm text-neutral-500">Loading plan details…</span>
          </div>
          <template v-else-if="isReady && flow">
            <TenantChangePlanComparison
              :current="flow.currentPlan"
              :next="flow.newPlan"
            />
            <TenantChangeBillingDetails
              :lines="flow.billingLines"
              :amount-due="flow.amountDueToday"
              :notice="flow.infoNotice"
            />
            <TenantChangeFeatureCompare
              :current-features="flow.currentFeatures"
              :new-features="flow.newFeatures"
            />
          </template>
        </section>

        <section
          class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div
            v-if="loading"
            class="flex min-h-[10rem] items-center justify-center"
          >
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
            <span class="ml-2 text-sm text-neutral-500">Loading payment methods…</span>
          </div>
          <TenantChangePaymentMethod
            v-else-if="isReady && flow"
            :methods="paymentMethods"
            :busy="submitting"
            :context="{ plan_id: planId, plan_code: planId, amount_due: flow.amountDueToday }"
            @cancel="onCancel"
            @proceed="onProceed"
          />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TenantChangePlanComparison from "../../components/tenant/TenantChangePlanComparison.vue";
import TenantChangeBillingDetails from "../../components/tenant/TenantChangeBillingDetails.vue";
import TenantChangeFeatureCompare from "../../components/tenant/TenantChangeFeatureCompare.vue";
import TenantChangePaymentMethod from "../../components/tenant/TenantChangePaymentMethod.vue";
import { usePaymentMethods } from "../../composables/usePaymentMethods.js";
import { useTenantPlanChangeFlow } from "../../composables/useTenantPlanChangeFlow.js";
import { useTenantSubscription } from "../../composables/useTenantSubscription.js";

const router = useRouter();
const subscription = useTenantSubscription();
const { loading, error, load, changePlan } = subscription;
const { flow, isReady, isInvalidSelection, planId } = useTenantPlanChangeFlow(subscription);
const { methods: paymentMethods, load: loadPaymentMethods } = usePaymentMethods();
const paymentSuccess = ref("");
const submitting = ref(false);

onMounted(async () => {
  await Promise.all([load(), loadPaymentMethods()]);
});

function onCancel() {
  router.push("/tenant/subscription");
}

async function onProceed(payload) {
  submitting.value = true;
  paymentSuccess.value = "";
  error.value = "";

  try {
    const result = await changePlan({
      plan_code: payload.plan_code || payload.plan_id || planId.value,
      payment_method: payload.payment_method,
      mobile_operator: payload.mobile_operator || null,
      phone_number: payload.phone_number || null,
      reference: payload.reference || null,
      receipt: payload.receipt || null,
    });

    paymentSuccess.value =
      result.message ||
      (result.status === "completed"
        ? "Plan updated successfully."
        : "Payment request submitted.");

    const delay = result.status === "completed" ? 1800 : 2500;
    setTimeout(() => router.push("/tenant/subscription"), delay);
  } catch {
    // error handled in composable
  } finally {
    submitting.value = false;
  }
}
</script>
