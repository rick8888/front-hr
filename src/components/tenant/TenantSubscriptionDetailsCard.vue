<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <div class="mb-5 flex items-start justify-between gap-3">
      <h3 class="text-base font-bold text-neutral-900">{{ t("tenant.dashboard.subscriptionDetails") }}</h3>
      <span
        v-if="loading"
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
      <span
        v-else
        class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ status }}
      </span>
    </div>

    <div
      v-if="loading"
      class="flex min-h-[8rem] items-center justify-center"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
    </div>

    <template v-else>
      <dl class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("tenant.dashboard.plan") }}</dt>
          <dd class="mt-0.5 text-sm font-semibold text-neutral-900">{{ plan }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("tenant.dashboard.price") }}</dt>
          <dd class="mt-0.5 text-sm font-semibold text-neutral-900">{{ price }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("tenant.dashboard.started") }}</dt>
          <dd class="mt-0.5 text-sm font-semibold text-neutral-900">{{ started }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("tenant.dashboard.nextBilling") }}</dt>
          <dd class="mt-0.5 text-sm font-semibold text-neutral-900">{{ nextBilling }}</dd>
        </div>
      </dl>

      <div class="mt-6">
        <RouterLink
          :to="manageTo"
          class="inline-flex items-center justify-center rounded-lg bg-[#7c7cf8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8]"
        >
          {{ t("tenant.dashboard.manageSubscription") }}
        </RouterLink>
      </div>
    </template>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

defineProps({
  status: { type: String, default: "" },
  plan: { type: String, default: "—" },
  price: { type: String, default: "—" },
  started: { type: String, default: "—" },
  nextBilling: { type: String, default: "—" },
  manageTo: { type: String, default: "/tenant/subscription" },
  loading: { type: Boolean, default: false },
});
</script>
