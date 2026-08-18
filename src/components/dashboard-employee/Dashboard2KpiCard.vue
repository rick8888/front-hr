<template>
  <article
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm text-neutral-500">{{ title }}</p>
      <span
        :class="[
          'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md',
          tone.iconWrap,
        ]"
        aria-hidden="true"
      >
        <component :is="iconComponent" class="h-4 w-4" />
      </span>
    </div>

    <p v-if="loading" class="mt-3 flex h-8 items-center">
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
    </p>
    <p v-else class="mt-3 text-2xl font-bold text-neutral-900">{{ value }}</p>

    <p
      v-if="!loading && note"
      :class="['mt-2 inline-flex items-center gap-1.5 text-xs font-medium', tone.note]"
    >
      <component
        v-if="noteIconComponent"
        :is="noteIconComponent"
        class="h-3.5 w-3.5"
        aria-hidden="true"
      />
      <span>{{ note }}</span>
    </p>
    <p v-else-if="loading" class="mt-2 h-4 w-24 animate-pulse rounded bg-neutral-100" />
  </article>
</template>

<script setup>
import { computed, h } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  note: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  icon: {
    type: String,
    default: "clock",
    validator: (v) => ["clock", "calendar", "leave", "task"].includes(v),
  },
  noteIcon: {
    type: String,
    default: "",
    validator: (v) => ["", "trendUp", "calendar"].includes(v),
  },
  tone: {
    type: String,
    default: "primary",
    validator: (v) =>
      ["primary", "info", "warning", "success", "secondary"].includes(v),
  },
});

const TONES = {
  primary: {
    iconWrap: "bg-primary-50 text-primary-600",
    note: "text-emerald-600",
  },
  info: {
    iconWrap: "bg-sky-50 text-sky-600",
    note: "text-sky-600",
  },
  warning: {
    iconWrap: "bg-amber-50 text-amber-600",
    note: "text-amber-600",
  },
  success: {
    iconWrap: "bg-emerald-50 text-emerald-600",
    note: "text-emerald-600",
  },
  secondary: {
    iconWrap: "bg-secondary-50 text-secondary-600",
    note: "text-secondary-600",
  },
};

const tone = computed(() => TONES[props.tone] || TONES.primary);

const ClockIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [h("circle", { cx: 12, cy: 12, r: 9 }), h("polyline", { points: "12 7 12 12 15 14" })]
  );

const CalendarIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("rect", { x: 3, y: 5, width: 18, height: 16, rx: 2 }),
      h("path", { d: "M16 3v4M8 3v4M3 11h18" }),
    ]
  );

const TaskIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("path", { d: "M9 11l3 3L22 4" }),
      h("path", { d: "M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" }),
    ]
  );

const LeaveIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("rect", { x: 3, y: 5, width: 18, height: 16, rx: 2 }),
      h("path", { d: "M16 3v4M8 3v4M3 11h18 M9 16l2 2 4-4" }),
    ]
  );

const TrendUpIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }),
      h("polyline", { points: "17 6 23 6 23 12" }),
    ]
  );

const iconComponent = computed(() => {
  switch (props.icon) {
    case "calendar":
      return CalendarIcon;
    case "task":
      return TaskIcon;
    case "leave":
      return LeaveIcon;
    case "clock":
    default:
      return ClockIcon;
  }
});

const noteIconComponent = computed(() => {
  if (props.noteIcon === "trendUp") return TrendUpIcon;
  if (props.noteIcon === "calendar") return CalendarIcon;
  return null;
});
</script>
