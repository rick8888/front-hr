<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.holidays.byMonth") }}</h2>
    </header>

    <ul class="divide-y divide-neutral-100">
      <li
        v-for="group in groups"
        :key="group.monthIdx"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50/60 md:px-6"
          :aria-expanded="isOpen(group.monthIdx)"
          @click="toggle(group.monthIdx)"
        >
          <div class="inline-flex items-center gap-2">
            <span class="text-sm font-medium text-neutral-800">{{ group.monthLabel }}</span>
            <span class="inline-flex items-center rounded-md bg-secondary-50 px-2 py-0.5 text-xs font-medium text-secondary-700">
              {{ group.items.length }}
            </span>
          </div>
          <svg
            class="h-4 w-4 text-neutral-400 transition-transform"
            :class="isOpen(group.monthIdx) ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <ul
          v-if="isOpen(group.monthIdx)"
          class="space-y-2 px-5 pb-4 md:px-6"
        >
          <li
            v-for="h in group.items"
            :key="h.id"
            class="flex items-start justify-between gap-3 rounded-lg bg-neutral-50/50 px-3 py-2"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-neutral-800">{{ h.name }}</p>
              <p class="text-xs text-neutral-500">
                {{ shortDayName(h.date, bcp47) }}, {{ shortMonthDay(h.date) }}
              </p>
            </div>
            <svg
              v-if="isPast(h)"
              class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              :aria-label="t('ss.holidays.status.past')"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else
              class="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              :aria-label="t('ss.holidays.status.upcomingLabel')"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </li>
        </ul>
      </li>

      <li v-if="!groups.length" class="px-5 py-10 text-center text-sm text-neutral-500 md:px-6">
        {{ t("ss.holidays.empty") }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from "vue";
import {
  daysBetween,
  parseIso,
  shortDayName,
} from "../../data/myHolidaysDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  groups: { type: Array, required: true },
  today: { type: String, required: true },
  /** Index du mois ouvert par défaut (0-11). Si omis, le 1er groupe est ouvert. */
  defaultOpen: { type: Number, default: null },
});

const { t, bcp47 } = useI18n();

const openSet = ref(
  new Set(
    props.defaultOpen != null
      ? [props.defaultOpen]
      : props.groups.length
        ? [props.groups[0].monthIdx]
        : [],
  ),
);

function isOpen(monthIdx) {
  return openSet.value.has(monthIdx);
}

function toggle(monthIdx) {
  const next = new Set(openSet.value);
  if (next.has(monthIdx)) next.delete(monthIdx);
  else next.add(monthIdx);
  openSet.value = next;
}

function isPast(h) {
  return daysBetween(props.today, h.date) < 0;
}

function shortMonthDay(iso) {
  const d = parseIso(iso);
  if (!d) return iso;
  return d.toLocaleDateString(bcp47.value, {
    month: "short",
    day: "2-digit",
  });
}
</script>
