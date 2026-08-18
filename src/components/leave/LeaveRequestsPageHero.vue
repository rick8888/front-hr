<template>
  <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
    <h1 class="text-2xl font-semibold text-neutral-800 tracking-tight">
      {{ title || t("admin.leave.title") }}
    </h1>
    <nav
      class="flex items-center gap-2 text-sm text-neutral-500 shrink-0"
      aria-label="Breadcrumb"
    >
      <RouterLink
        to="/"
        class="inline-flex items-center gap-1.5 hover:text-secondary-600 transition-colors"
      >
        <svg
          class="w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>{{ t("common.home") }}</span>
      </RouterLink>
      <span class="text-neutral-300 select-none" aria-hidden="true">/</span>
      <span class="text-neutral-700 font-medium">{{ breadcrumbCurrent || t("admin.leave.breadcrumb") }}</span>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

defineProps({
  title: { type: String, default: "" },
  breadcrumbCurrent: { type: String, default: "" },
});

const { t } = useI18n();
</script>
