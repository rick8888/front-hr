<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.holidays.upcomingTitle") }}</h2>
    </header>

    <ul v-if="items.length" class="divide-y divide-neutral-100">
      <li
        v-for="h in items"
        :key="h.id"
        class="flex items-start justify-between gap-3 px-5 py-3.5 md:px-6"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-neutral-900">{{ h.name }}</p>
          <p class="mt-0.5 inline-flex items-center gap-1.5 text-xs text-neutral-500">
            <svg class="h-3.5 w-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{{ shortDateLabel(h.date, bcp47) }}</span>
            <span class="text-neutral-300" aria-hidden="true">·</span>
            <span>{{ h.day }}</span>
          </p>
        </div>
        <span
          class="inline-flex shrink-0 items-center rounded-md bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700"
        >
          {{ t("ss.holidays.daysLeft", { n: h.daysLeft }) }}
        </span>
      </li>
    </ul>

    <p v-else class="px-5 py-10 text-center text-sm text-neutral-500 md:px-6">
      {{ t("ss.holidays.noUpcoming") }}
    </p>
  </section>
</template>

<script setup>
import { shortDateLabel } from "../../data/myHolidaysDemo.js";
import { useI18n } from "../../i18n/index.js";

defineProps({
  items: { type: Array, required: true },
});

const { t, bcp47 } = useI18n();
</script>
