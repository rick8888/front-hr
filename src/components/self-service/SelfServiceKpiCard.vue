<template>
  <article
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm text-neutral-500">{{ title }}</p>
      <span
        :class="['inline-flex h-7 w-7 items-center justify-center rounded-full', toneStyle.badge]"
        aria-hidden="true"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-for="(d, i) in iconPaths"
            :key="i"
            :d="d"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </span>
    </div>
    <p class="mt-3 flex flex-wrap items-baseline gap-x-1 gap-y-1">
      <span
        v-if="loading"
        class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        aria-hidden="true"
      />
      <template v-else>
        <span :class="['text-2xl font-semibold', toneStyle.value]">{{ value }}</span>
        <span v-if="suffix" class="text-base font-medium text-neutral-600">{{ suffix }}</span>
        <span v-if="note" :class="['text-xs font-medium', toneStyle.note]">
          ({{ note }})
        </span>
      </template>
    </p>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  /** Affixe après la valeur (ex. « days »), sans parenthèses. */
  suffix: { type: String, default: "" },
  note: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  icon: {
    type: String,
    default: "check",
    validator: (v) =>
      ["check", "x", "clock", "hourglass", "calendar", "user", "doc"].includes(v),
  },
  tone: {
    type: String,
    default: "neutral",
    validator: (v) =>
      ["success", "danger", "warning", "info", "secondary", "neutral"].includes(v),
  },
  /** Si false, la valeur reste en gris foncé (utile pour "Total"). */
  colorizeValue: { type: Boolean, default: true },
});

const TONES = {
  success: { badge: "bg-emerald-50 text-emerald-600", note: "text-emerald-600", value: "text-emerald-600" },
  danger: { badge: "bg-rose-50 text-rose-600", note: "text-rose-600", value: "text-rose-600" },
  warning: { badge: "bg-amber-50 text-amber-600", note: "text-amber-600", value: "text-amber-600" },
  info: { badge: "bg-sky-50 text-sky-600", note: "text-sky-600", value: "text-sky-600" },
  secondary: { badge: "bg-secondary-50 text-secondary-600", note: "text-secondary-600", value: "text-secondary-700" },
  neutral: { badge: "bg-neutral-100 text-neutral-600", note: "text-neutral-500", value: "text-neutral-900" },
};

const ICONS = {
  check: ["M9 12l2 2 4-4", "M12 22a10 10 0 100-20 10 10 0 000 20z"],
  x: ["M15 9l-6 6M9 9l6 6", "M12 22a10 10 0 100-20 10 10 0 000 20z"],
  clock: ["M12 8v4l3 2", "M12 22a10 10 0 100-20 10 10 0 000 20z"],
  hourglass: [
    "M6 2h12M6 22h12",
    "M6 2v4a6 6 0 0012 0V2",
    "M18 22v-4a6 6 0 00-12 0v4",
  ],
  calendar: [
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  ],
  user: ["M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"],
  doc: [
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  ],
};

const toneStyle = computed(() => {
  const base = TONES[props.tone] || TONES.neutral;
  if (!props.colorizeValue) {
    return { ...base, value: TONES.neutral.value };
  }
  return base;
});

const iconPaths = computed(() => ICONS[props.icon] || ICONS.check);
</script>
