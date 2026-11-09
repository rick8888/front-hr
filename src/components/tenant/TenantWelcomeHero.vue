<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm md:px-10 md:py-12"
  >
    <h2 class="text-2xl font-bold text-neutral-900 md:text-3xl">
      {{ t("tenant.dashboard.welcome", { product: productName, name: firstName }) }}
    </h2>
    <p class="mx-auto mt-3 max-w-2xl text-sm text-neutral-500 md:text-base">
      {{ t("tenant.dashboard.welcomeDescription") }}
    </p>

    <div
      class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <RouterLink
        :to="paths.subscription"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7c7cf8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8]"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2 10h20"
          />
        </svg>
        {{ t("tenant.dashboard.manageSubscription") }}
      </RouterLink>
      <RouterLink
        :to="paths.company"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary-200 bg-secondary-50 px-5 py-2.5 text-sm font-semibold text-secondary-700 shadow-sm transition-colors hover:bg-secondary-100"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        {{ t("tenant.dashboard.companyProfile") }}
      </RouterLink>
      <RouterLink
        :to="paths.support"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-200"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ t("tenant.dashboard.getSupport") }}
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

defineProps({
  productName: { type: String, required: true },
  firstName: { type: String, required: true },
  paths: {
    type: Object,
    required: true,
    /** { subscription, company, support } */
  },
});
</script>
