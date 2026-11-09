<template>
  <section
    v-if="hasActiveSubscription === false"
    class="mx-auto flex max-w-7xl flex-col gap-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
    role="status"
    aria-live="polite"
  >
    <div class="flex items-start gap-3">
      <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4m0 4h.01M10.3 3.86 1.82 18.5A1.75 1.75 0 0 0 3.34 21h17.32a1.75 1.75 0 0 0 1.52-2.5L13.7 3.86a1.96 1.96 0 0 0-3.4 0Z" />
        </svg>
      </span>
      <div>
        <h2 class="text-sm font-bold text-amber-950 sm:text-base">
          {{ t("tenant.subscriptionNotice.title") }}
        </h2>
        <p class="mt-1 max-w-3xl text-sm leading-5 text-amber-900">
          {{ t("tenant.subscriptionNotice.message") }}
        </p>
      </div>
    </div>
    <RouterLink
      to="/tenant/subscription"
      class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
    >
      {{ t("tenant.subscriptionNotice.action") }}
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </RouterLink>
  </section>

  <section
    v-else-if="error"
    class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    role="alert"
  >
    <span>{{ error }}</span>
    <button
      type="button"
      class="font-semibold underline underline-offset-2"
      :disabled="loading"
      @click="loadStatus"
    >
      {{ t("tenant.subscriptionNotice.retry") }}
    </button>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../../i18n/index.js";
import { tenantSubscriptionApiService } from "../../pages/tenant/services/tenant-subscription.api.service.js";

const route = useRoute();
const { t } = useI18n();
const hasActiveSubscription = ref(null);
const loading = ref(false);
const error = ref("");
let requestId = 0;

async function loadStatus() {
  const currentRequestId = ++requestId;
  loading.value = true;
  error.value = "";

  try {
    const subscription = await tenantSubscriptionApiService.fetchSubscription();
    if (currentRequestId === requestId) {
      const activeStatus = subscription.current?.has_active_subscription;
      if (typeof activeStatus !== "boolean") {
        throw new Error("Subscription response is missing its active status.");
      }

      hasActiveSubscription.value = activeStatus;
    }
  } catch {
    if (currentRequestId === requestId) {
      hasActiveSubscription.value = null;
      error.value = t("tenant.subscriptionNotice.loadError");
    }
  } finally {
    if (currentRequestId === requestId) loading.value = false;
  }
}

watch(() => route.path, loadStatus, { immediate: true });

window.addEventListener("focus", loadStatus);

onBeforeUnmount(() => {
  requestId += 1;
  window.removeEventListener("focus", loadStatus);
});
</script>
