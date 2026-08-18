<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Manage Your Subscription
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          View your current plan, upgrade or downgrade, and manage billing
        </p>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="successMessage"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <TenantCurrentSubscriptionCard
        :subscription="current"
        :loading="loading"
        :cancelling="cancelling"
        @cancel="cancelDialogOpen = true"
      />

      <section>
        <h2 class="text-base font-bold text-neutral-900">Available Plans</h2>
        <div class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          <template v-if="loading && !plans.length">
            <TenantPlanCard
              v-for="i in 3"
              :key="'skeleton-plan-' + i"
              :loading="true"
            />
          </template>
          <template v-else>
            <TenantPlanCard
              v-for="plan in plans"
              :key="plan.id"
              :plan="plan"
              :loading="loading"
              @choose="onChoosePlan"
            />
          </template>
        </div>
      </section>

      <TenantSubscriptionHistoryTable :rows="history" :loading="loading" />
    </div>

    <ConfirmDialog
      v-model="cancelDialogOpen"
      title="Cancel subscription?"
      message="Your subscription will remain active until the end of the current billing period. You can resubscribe at any time."
      confirm-text="Yes, cancel"
      cancel-text="Keep subscription"
      variant="danger"
      :busy="cancelling"
      loading-text="Cancelling…"
      @confirm="confirmCancel"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import TenantCurrentSubscriptionCard from "../../components/tenant/TenantCurrentSubscriptionCard.vue";
import TenantPlanCard from "../../components/tenant/TenantPlanCard.vue";
import TenantSubscriptionHistoryTable from "../../components/tenant/TenantSubscriptionHistoryTable.vue";
import { useTenantSubscription } from "../../composables/useTenantSubscription.js";

const router = useRouter();
const cancelDialogOpen = ref(false);

const {
  loading,
  cancelling,
  error,
  successMessage,
  current,
  plans,
  history,
  load,
  cancel,
} = useTenantSubscription();

onMounted(load);

async function confirmCancel() {
  try {
    await cancel();
    cancelDialogOpen.value = false;
  } catch {
    // error handled in composable
  }
}

function onChoosePlan(plan) {
  router.push({
    name: "TenantSubscriptionChange",
    query: { plan: plan.id },
  });
}
</script>
