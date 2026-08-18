<template>
  <section
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6"
  >
    <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.dashboard2.quickActions.title") }}</h2>

    <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <button
        v-for="action in actions"
        :key="action.id"
        type="button"
        :disabled="action.disabled || action.loading"
        :class="[
          'group inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          variantClass(action.variant),
        ]"
        @click="$emit('action', action)"
      >
        <span
          v-if="action.loading"
          class="inline-block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden="true"
        />
        <component
          v-else
          :is="iconFor(action.icon)"
          class="h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
        <span>{{ action.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { h } from "vue";
import { useI18n } from "../../i18n/index.js";

defineProps({
  actions: {
    type: Array,
    required: true,
  },
});

defineEmits(["action"]);

const { t } = useI18n();

function variantClass(variant) {
  switch (variant) {
    case "amber":
      return "bg-amber-500 hover:bg-amber-600 active:bg-amber-700";
    case "sky":
      return "bg-sky-400 hover:bg-sky-500 active:bg-sky-600";
    case "emerald":
      return "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800";
    case "secondary":
      return "bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700";
    case "primary":
    default:
      return "bg-primary-500 hover:bg-primary-600 active:bg-primary-700";
  }
}

function iconFor(name) {
  const map = {
    checkOut: () =>
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
          h("path", {
            d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4",
          }),
          h("polyline", { points: "16 17 21 12 16 7" }),
          h("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
        ]
      ),
    checkIn: () =>
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
          h("path", {
            d: "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4",
          }),
          h("polyline", { points: "10 17 15 12 10 7" }),
          h("line", { x1: "15", y1: "12", x2: "3", y2: "12" }),
        ]
      ),
    leave: () =>
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
          h("rect", {
            x: "3",
            y: "5",
            width: "18",
            height: "16",
            rx: "2",
          }),
          h("path", { d: "M16 3v4M8 3v4M3 11h18" }),
        ]
      ),
    expense: () =>
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
          h("path", {
            d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z",
          }),
          h("polyline", { points: "14 2 14 8 20 8" }),
          h("path", { d: "M9 13h6M9 17h4" }),
        ]
      ),
    profile: () =>
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
          h("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
          h("circle", { cx: "12", cy: "7", r: "4" }),
        ]
      ),
  };
  return map[name] || (() => null);
}
</script>
