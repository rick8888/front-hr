<template>
  <div ref="rootEl" class="w-full min-w-0">
    <div class="flex flex-wrap items-center gap-5 mb-4 text-sm text-neutral-600">
      <span class="inline-flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-primary-500" />
        Total Gross
      </span>
      <span class="inline-flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-success-500" />
        Total Net
      </span>
    </div>

    <svg
      class="block w-full"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="title"
    >
      <title>{{ title }}</title>

      <!-- Grille + labels Y -->
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

      <!-- Groupes de barres (pleine largeur) -->
      <g v-for="(label, i) in labels" :key="label">
        <rect
          :x="groupX(i)"
          :y="yAt(gross[i] || 0)"
          :width="barWidth"
          :height="Math.max(0, yAt(0) - yAt(gross[i] || 0))"
          class="fill-primary-500"
          rx="3"
        />
        <rect
          :x="groupX(i) + barWidth + barGap"
          :y="yAt(net[i] || 0)"
          :width="barWidth"
          :height="Math.max(0, yAt(0) - yAt(net[i] || 0))"
          class="fill-success-500"
          rx="3"
        />
        <text
          :x="groupX(i) + barWidth + barGap / 2"
          :y="height - 12"
          text-anchor="middle"
          class="fill-neutral-600 text-[11px] font-medium"
        >
          {{ shortLabel(label) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Payroll by Department" },
  labels: { type: Array, default: () => [] },
  gross: { type: Array, default: () => [] },
  net: { type: Array, default: () => [] },
});

const rootEl = ref(null);
const width = ref(960);
const height = 320;
const pad = { t: 16, r: 12, b: 40, l: 64 };
/** Espace entre les barres Gross / Net d’un même groupe */
const barGap = 10;
/** Marge latérale mini dans chaque colonne (les barres utilisent le reste) */
const groupInsetRatio = 0.08;

let resizeObserver = null;

const maxValue = computed(() => {
  const all = [...props.gross, ...props.net].map(Number).filter((n) => !Number.isNaN(n));
  const m = Math.max(0, ...all, 1);
  // Paliers type $800K → $4M
  const step = 800_000;
  return Math.max(step, Math.ceil(m / step) * step);
});

const yTicks = computed(() => {
  const max = maxValue.value;
  const steps = 5;
  return Array.from({ length: steps + 1 }, (_, i) => (max * (steps - i)) / steps);
});

const groupWidth = computed(() => {
  const n = Math.max(props.labels.length, 1);
  return (width.value - pad.l - pad.r) / n;
});

/** Deux barres côte à côte occupent ~84 % de la colonne */
const barWidth = computed(() => {
  const usable = groupWidth.value * (1 - groupInsetRatio * 2);
  return Math.max(16, (usable - barGap) / 2);
});

function groupX(i) {
  const pairWidth = barWidth.value * 2 + barGap;
  const offset = (groupWidth.value - pairWidth) / 2;
  return pad.l + i * groupWidth.value + offset;
}

function yAt(value) {
  const max = maxValue.value;
  const usable = height - pad.t - pad.b;
  return pad.t + usable * (1 - Number(value || 0) / max);
}

function formatAxis(n) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${Number.isInteger(v) ? v : v.toFixed(1)}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function shortLabel(label) {
  return (
    String(label || "")
      .replace(/\s*Department\s*/i, "")
      .trim() || label
  );
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
