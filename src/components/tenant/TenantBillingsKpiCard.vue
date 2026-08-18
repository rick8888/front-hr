<template>
  <article
    class="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-neutral-500">{{ label }}</p>
      <div v-if="loading" class="mt-2 flex h-8 items-center">
        <span
          class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
          aria-hidden="true"
        />
      </div>
      <p v-else class="mt-2 text-2xl font-bold text-neutral-900">{{ value }}</p>
    </div>
    <span
      :class="[
        'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
        toneClass,
      ]"
      aria-hidden="true"
    >
      <component :is="iconComponent" class="h-4 w-4" />
    </span>
  </article>
</template>

<script setup>
import { computed, h } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  loading: { type: Boolean, default: false },
  /** 'success' | 'warning' | 'info' */
  tone: {
    type: String,
    default: "success",
    validator: (v) => ["success", "warning", "info"].includes(v),
  },
  /** 'check' | 'clock' | 'receipt' */
  icon: {
    type: String,
    default: "check",
    validator: (v) => ["check", "clock", "receipt"].includes(v),
  },
});

const toneClass = computed(() => {
  const map = {
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-sky-50 text-sky-600",
  };
  return map[props.tone] || map.success;
});

const iconComponent = computed(() => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
  };
  if (props.icon === "clock") {
    return () =>
      h("svg", common, [
        h("circle", {
          cx: "12",
          cy: "12",
          r: "9",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 7v5l3 2",
        }),
      ]);
  }
  if (props.icon === "receipt") {
    return () =>
      h("svg", common, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        }),
      ]);
  }
  return () =>
    h("svg", common, [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M5 13l4 4L19 7",
      }),
    ]);
});
</script>
