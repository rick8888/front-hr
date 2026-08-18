<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.leave.upcoming") }}</h2>
    </header>
    <ul class="divide-y divide-neutral-100">
      <li v-if="loading" class="px-5 py-10 text-center md:px-6">
        <div class="inline-flex items-center justify-center gap-2 text-sm text-neutral-500">
          <span
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
            aria-hidden="true"
          />
          {{ t("common.loading") }}
        </div>
      </li>
      <template v-else>
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-center justify-between gap-3 px-5 py-4 md:px-6"
        >
          <div class="min-w-0">
            <p class="font-medium text-neutral-900">{{ item.leaveType }}</p>
            <p class="mt-0.5 text-sm text-neutral-500">{{ item.rangeLabel }}</p>
          </div>
          <span
            class="inline-flex shrink-0 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700"
          >
            {{ t("ss.table.daysCount", { n: formatDays(item.days) }) }}
          </span>
        </li>
        <li v-if="!items.length" class="px-5 py-8 text-center text-sm text-neutral-500 md:px-6">
          {{ t("ss.leave.noUpcoming") }}
        </li>
      </template>
    </ul>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();

function formatDays(n) {
  const v = Number(n) || 0;
  return v.toFixed(2);
}
</script>
