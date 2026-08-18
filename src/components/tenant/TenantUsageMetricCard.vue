<template>
  <article
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <header class="flex items-center justify-between">
      <p class="text-sm font-semibold text-neutral-900">
        {{ loading ? "…" : metric.label }}
      </p>
      <span
        class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary-50 text-[#7c7cf8]"
        aria-hidden="true"
      >
        <component :is="iconComponent" class="h-4 w-4" />
      </span>
    </header>

    <div v-if="loading" class="mt-4 flex min-h-[3.25rem] items-center justify-center">
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
    </div>

    <template v-else>
      <div class="mt-4 flex items-center justify-between text-sm">
        <span class="text-neutral-500">Used</span>
        <span class="font-medium text-neutral-700">{{ usageLabel }}</span>
      </div>

      <div
        class="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        :aria-valuenow="percent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="h-full rounded-full bg-[#7c7cf8] transition-[width] duration-300"
          :style="{ width: percent + '%' }"
        />
      </div>
    </template>
  </article>
</template>

<script setup>
import { computed, h } from "vue";
import { usagePercent } from "../../composables/useTenantUsage.js";

const props = defineProps({
  metric: { type: Object, required: true },
  loading: { type: Boolean, default: false },
});

const percent = computed(() =>
  usagePercent(props.metric.used, props.metric.limit),
);

const usageLabel = computed(() => {
  if (props.metric.display) {
    return props.metric.display;
  }
  if (typeof props.metric.formatUsage === "function") {
    return props.metric.formatUsage(
      props.metric.used,
      props.metric.limit,
      props.metric.unit,
    );
  }
  if (props.metric.limit == null) {
    return `${props.metric.used} / Unlimited`;
  }
  return `${props.metric.used} / ${props.metric.limit}`;
});

const iconComponent = computed(() => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
  };
  if (props.metric.icon === "storage") {
    return () =>
      h("svg", common, [
        h("ellipse", {
          cx: "12",
          cy: "6",
          rx: "8",
          ry: "3",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
        }),
      ]);
  }
  return () =>
    h("svg", common, [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      }),
    ]);
});
</script>
