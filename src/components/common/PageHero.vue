<template>
  <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <h1 class="text-2xl font-semibold tracking-tight text-neutral-800">
      {{ title }}
    </h1>
    <nav
      class="flex flex-wrap items-center gap-2 text-sm text-neutral-500"
      aria-label="Breadcrumb"
    >
      <RouterLink
        :to="homeTo"
        class="inline-flex items-center gap-1.5 transition-colors hover:text-secondary-600"
      >
        <svg
          class="h-4 w-4 text-neutral-400"
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
      <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
        <span class="select-none text-neutral-300" aria-hidden="true">/</span>
        <RouterLink
          v-if="crumb.to && idx < breadcrumbs.length - 1"
          :to="crumb.to"
          class="transition-colors hover:text-secondary-600"
        >
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="font-medium text-neutral-700">{{ crumb.label }}</span>
      </template>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

defineProps({
  title: { type: String, required: true },
  /** Array of `{ label, to? }`. The last item is rendered as plain text. */
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  homeTo: { type: [String, Object], default: "/" },
});

const { t } = useI18n();
</script>
