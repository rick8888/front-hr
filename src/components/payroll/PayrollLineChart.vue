<template>
  <div ref="rootEl" class="w-full min-w-0">
    <svg
      class="block w-full"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="title"
    >
      <title>{{ title }}</title>

      <!-- Grille -->
      <g class="text-neutral-200" stroke="currentColor" stroke-width="1">
        <line
          v-for="(tick, i) in yTicks"
          :key="'g' + i"
          :x1="pad.l"
          :y1="yAt(tick)"
          :x2="width - pad.r"
          :y2="yAt(tick)"
        />
      </g>

      <!-- Axe Y -->
      <g class="fill-neutral-500 text-[11px] font-medium">
        <text
          v-for="(tick, i) in yTicks"
          :key="'yl' + i"
          :x="pad.l - 8"
          :y="yAt(tick) + 4"
          text-anchor="end"
        >
          {{ formatAxis(tick) }}
        </text>
      </g>
      <text
        v-if="yAxisLabel"
        :x="14"
        :y="height / 2"
        text-anchor="middle"
        class="fill-neutral-500 text-[10px] font-medium"
        :transform="`rotate(-90 14 ${height / 2})`"
      >
        {{ yAxisLabel }}
      </text>

      <!-- Courbe + zone optionnelle -->
      <polyline
        v-if="points"
        fill="none"
        :stroke="lineColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        :points="points"
      />
      <g v-for="(v, i) in values" :key="'p' + i">
        <circle
          :cx="xAt(i)"
          :cy="yAt(v)"
          r="4.5"
          :fill="lineColor"
          class="stroke-white"
          stroke-width="2"
        />
      </g>

      <!-- Axe X -->
      <g class="fill-neutral-600 text-[11px] font-medium">
        <text
          v-for="(label, i) in labels"
          :key="'xl' + i"
          :x="xAt(i)"
          :y="height - 14"
          text-anchor="middle"
        >
          {{ label }}
        </text>
      </g>
      <text
        v-if="xAxisLabel"
        :x="(width + pad.l - pad.r) / 2"
        :y="height - 2"
        text-anchor="middle"
        class="fill-neutral-500 text-[10px]"
      >
        {{ xAxisLabel }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Trend" },
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  lineColor: { type: String, default: "#ef4444" },
  yAxisLabel: { type: String, default: "" },
  xAxisLabel: { type: String, default: "" },
  height: { type: Number, default: 300 },
});

const rootEl = ref(null);
const width = ref(960);
const pad = { t: 20, r: 20, b: 48, l: 64 };

let resizeObserver = null;

const maxValue = computed(() => {
  const nums = props.values.map(Number).filter((n) => !Number.isNaN(n));
  const m = Math.max(0, ...nums, 1);
  const step = m >= 1000 ? 5000 : 10;
  return Math.max(step, Math.ceil(m / step) * step);
});

const yTicks = computed(() => {
  const max = maxValue.value;
  const steps = 5;
  return Array.from({ length: steps + 1 }, (_, i) => (max * (steps - i)) / steps);
});

function xAt(i) {
  const n = Math.max(props.labels.length, 1);
  const inner = width.value - pad.l - pad.r;
  if (n <= 1) return pad.l + inner / 2;
  return pad.l + (inner * i) / (n - 1);
}

function yAt(value) {
  const max = maxValue.value;
  const usable = props.height - pad.t - pad.b;
  return pad.t + usable * (1 - Number(value || 0) / max);
}

const points = computed(() =>
  props.values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")
);

function formatAxis(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

function updateWidth() {
  if (!rootEl.value) return;
  const next = Math.max(320, Math.round(rootEl.value.clientWidth));
  if (next !== width.value) width.value = next;
}

onMounted(() => {
  updateWidth();
  if (typeof ResizeObserver !== "undefined" && rootEl.value) {
    resizeObserver = new ResizeObserver(() => updateWidth());
    resizeObserver.observe(rootEl.value);
  } else {
    window.addEventListener("resize", updateWidth);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", updateWidth);
});
</script>
