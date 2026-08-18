<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header
      class="flex flex-col gap-4 border-b border-neutral-100 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6"
    >
      <div>
        <h2 class="text-base font-semibold text-neutral-800">{{ t("admin.leave.calendar.schedule") }}</h2>
        <p class="mt-0.5 text-sm text-neutral-500">{{ subtitle }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-50"
          :disabled="loading"
          @click="$emit('today')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ t("admin.leave.calendar.today") }}
        </button>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            :aria-label="t('common.previous')"
            :disabled="loading"
            @click="$emit('prev-month')"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            :aria-label="t('common.next')"
            :disabled="loading"
            @click="$emit('next-month')"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex min-h-[420px] flex-col items-center justify-center gap-3 text-sm text-neutral-500" aria-busy="true">
      <span
        class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>

    <div v-else class="overflow-x-auto">
      <!-- Weekday header -->
      <div class="grid min-w-[720px] grid-cols-7 border-b border-neutral-200 bg-neutral-50/90">
        <div
          v-for="d in weekdayLabels"
          :key="d"
          class="border-r border-neutral-100 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 last:border-r-0"
        >
          {{ d }}
        </div>
      </div>

      <!-- Weeks -->
      <div class="min-w-[720px]">
        <div
          v-for="(week, wi) in weeks"
          :key="wi"
          class="relative min-h-[112px] border-b border-neutral-100"
        >
          <div class="grid min-h-[112px] grid-cols-7 divide-x divide-neutral-100">
            <div
              v-for="cell in week"
              :key="cell.iso"
              class="p-2 pt-3"
              :class="[
                cell.isToday ? 'bg-neutral-100/90' : '',
              ]"
            >
              <span
                class="text-sm font-medium"
                :class="
                  cell.inCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
                "
              >
                {{ cell.dayOfMonth }}
              </span>
            </div>
          </div>

          <!-- Leave bars (aligned to week columns) -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-2 top-11 grid grid-cols-7 px-0"
          >
            <div
              v-for="seg in segmentsByWeek[wi]"
              :key="seg.key"
              class="mx-1 flex h-7 items-center self-end overflow-hidden rounded-md bg-primary-600 px-2 text-[11px] font-medium leading-tight text-white shadow-sm"
              :style="{
                gridColumnStart: seg.gridColumnStart,
                gridColumnEnd: seg.gridColumnEnd,
              }"
            >
              <span class="truncate">{{ seg.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";

defineProps({
  subtitle: { type: String, required: true },
  weeks: { type: Array, required: true },
  segmentsByWeek: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

defineEmits(["today", "prev-month", "next-month"]);

const { t, locale } = useI18n();

const weekdayLabels = computed(() => {
  void locale.value;
  return [
    t("admin.leave.calendar.weekday.sun"),
    t("admin.leave.calendar.weekday.mon"),
    t("admin.leave.calendar.weekday.tue"),
    t("admin.leave.calendar.weekday.wed"),
    t("admin.leave.calendar.weekday.thu"),
    t("admin.leave.calendar.weekday.fri"),
    t("admin.leave.calendar.weekday.sat"),
  ];
});
</script>
