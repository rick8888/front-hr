<template>
  <aside
    class="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm md:p-8"
  >
    <div
      class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#7c7cf8] text-white"
      aria-hidden="true"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h2 class="mt-4 text-base font-bold text-neutral-900">{{ t("tenant.support.emailTitle") }}</h2>
    <p class="mt-1 text-sm text-neutral-500">{{ t("tenant.support.emailDescription") }}</p>
    <a
      :href="`mailto:${email}`"
      class="mt-3 inline-block text-sm font-semibold text-[#7c7cf8] hover:underline"
    >
      {{ email }}
    </a>
    <p class="mt-4 text-xs text-neutral-400">{{ responseTime }}</p>
  </aside>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

defineProps({
  email: { type: String, required: true },
  responseTime: { type: String, required: true },
});
</script>
