<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.holidays.calendarTitle", { year }) }}</h2>
    </header>

    <div class="space-y-4 px-5 pb-5 pt-4 md:px-6">
      <!-- Top toolbar : nav + title + view toggle -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50"
            :aria-label="t('ss.holidays.prevMonth')"
            @click="shiftMonth(-1)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50"
            :aria-label="t('ss.holidays.nextMonth')"
            @click="shiftMonth(1)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex h-8 items-center rounded-md bg-secondary-50 px-3 text-xs font-medium text-secondary-700 transition-colors hover:bg-secondary-100"
            @click="goToday"
          >
            {{ t("ss.holidays.today") }}
          </button>
        </div>

        <h3 class="text-base font-semibold text-neutral-800">{{ monthTitle }}</h3>

        <div class="inline-flex rounded-md border border-neutral-200 bg-white p-0.5 text-xs font-medium">
          <button
            type="button"
            :class="[
              'inline-flex h-7 items-center rounded px-3 transition-colors',
              view === 'month' ? 'bg-secondary-500 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50',
            ]"
            @click="view = 'month'"
          >
            {{ t("ss.holidays.viewMonth") }}
          </button>
          <button
            type="button"
            :class="[
              'inline-flex h-7 items-center rounded px-3 transition-colors',
              view === 'list' ? 'bg-secondary-500 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-50',
            ]"
            @click="view = 'list'"
          >
            {{ t("ss.holidays.viewList") }}
          </button>
        </div>
      </div>

      <!-- Month view -->
      <div v-if="view === 'month'" class="overflow-hidden rounded-lg border border-neutral-100">
        <div class="grid grid-cols-7 bg-neutral-50 text-center text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          <div v-for="d in weekdays" :key="d" class="border-b border-r border-neutral-100 px-2 py-2 last:border-r-0">
            {{ d }}
          </div>
        </div>
        <div class="grid grid-cols-7">
          <div
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            :class="[
              'min-h-[72px] border-b border-r border-neutral-100 px-2 py-1.5 text-xs last:border-r-0',
              !cell.inMonth && 'bg-neutral-50/40',
              cell.isToday && 'bg-neutral-100/60 ring-1 ring-inset ring-neutral-200',
              (idx + 1) % 7 === 0 && 'border-r-0',
              idx >= calendarCells.length - 7 && 'border-b-0',
            ]"
          >
            <p
              :class="[
                'text-[11px] font-medium',
                cell.inMonth ? 'text-neutral-700' : 'text-neutral-400',
              ]"
            >
              {{ cell.day }}
            </p>
            <ul v-if="cell.holidays.length" class="mt-1 space-y-0.5">
              <li
                v-for="h in cell.holidays"
                :key="h.id"
                class="truncate rounded bg-secondary-50 px-1.5 py-0.5 text-[10px] font-medium text-secondary-700"
                :title="h.name"
              >
                {{ h.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- List view -->
      <div v-else class="overflow-hidden rounded-lg border border-neutral-100">
        <ul v-if="monthHolidays.length" class="divide-y divide-neutral-100">
          <li
            v-for="h in monthHolidays"
            :key="h.id"
            class="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p class="text-sm font-semibold text-neutral-900">{{ h.name }}</p>
              <p class="text-xs text-neutral-500">{{ formatLong(h.date) }}</p>
            </div>
            <span
              :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(h)]"
            >
              {{ statusLabel(h) }}
            </span>
          </li>
        </ul>
        <div v-else class="px-4 py-10 text-center text-sm text-neutral-500">
          {{ t("ss.holidays.emptyMonth", { month: monthTitle }) }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { daysBetween, parseIso } from "../../data/myHolidaysDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  holidays: { type: Array, required: true },
  year: { type: Number, required: true },
  today: { type: String, required: true },
  /** Mois de départ (0-11). Par défaut = mois courant si année = today.year, sinon 0. */
  initialMonth: { type: Number, default: null },
});

const { t, locale, bcp47 } = useI18n();

const view = ref("month");

const todayDate = parseIso(props.today);
const month = ref(
  props.initialMonth ??
    (todayDate && todayDate.getFullYear() === props.year ? todayDate.getMonth() : 0),
);

const weekdays = computed(() => {
  void locale.value;
  const base = new Date(2026, 0, 4);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toLocaleDateString(bcp47.value, { weekday: "short" });
  });
});

const monthTitle = computed(() => {
  void locale.value;
  const d = new Date(props.year, month.value, 1);
  return d.toLocaleDateString(bcp47.value, { month: "long", year: "numeric" });
});

const monthHolidays = computed(() =>
  props.holidays
    .filter((h) => {
      const d = parseIso(h.date);
      return d && d.getFullYear() === props.year && d.getMonth() === month.value;
    })
    .sort((a, b) => (a.date < b.date ? -1 : 1)),
);

/** 6×7 grille avec jours du mois + bordures débordantes. */
const calendarCells = computed(() => {
  const first = new Date(props.year, month.value, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(props.year, month.value + 1, 0).getDate();
  const prevMonthDays = new Date(props.year, month.value, 0).getDate();

  const cells = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      inMonth: false,
      isToday: false,
      holidays: [],
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = isoFor(props.year, month.value, d);
    cells.push({
      day: d,
      inMonth: true,
      isToday: iso === props.today,
      holidays: props.holidays.filter((h) => h.date === iso),
    });
  }

  while (cells.length < 42) {
    const idx = cells.length - (startWeekday + daysInMonth);
    cells.push({
      day: idx + 1,
      inMonth: false,
      isToday: false,
      holidays: [],
    });
  }

  return cells.slice(0, 42);
});

function isoFor(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function shiftMonth(delta) {
  const next = month.value + delta;
  if (next < 0) {
    month.value = 11;
  } else if (next > 11) {
    month.value = 0;
  } else {
    month.value = next;
  }
}

function goToday() {
  if (todayDate && todayDate.getFullYear() === props.year) {
    month.value = todayDate.getMonth();
  }
}

function formatLong(iso) {
  const d = parseIso(iso);
  if (!d) return iso;
  return d.toLocaleDateString(bcp47.value, {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function isPast(h) {
  return daysBetween(props.today, h.date) < 0;
}

function statusLabel(h) {
  return isPast(h) ? t("ss.holidays.status.past") : t("ss.holidays.status.upcomingLabel");
}

function statusClass(h) {
  return isPast(h)
    ? "bg-neutral-100 text-neutral-600"
    : "bg-sky-100 text-sky-700";
}
</script>
