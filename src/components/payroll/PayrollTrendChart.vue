<template>
  <div class="w-full">
    <svg
      class="w-full h-[220px] sm:h-[260px]"
      viewBox="0 0 520 220"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="title"
    >
      <title>{{ title }}</title>
      <!-- Grille horizontale -->
      <g class="text-neutral-200" stroke="currentColor" stroke-width="1">
        <line v-for="i in 5" :key="i" x1="48" :y1="yGrid(i - 1)" x2="500" :y2="yGrid(i - 1)" />
      </g>
      <!-- Axe Y (libellés simplifiés) -->
      <g class="fill-neutral-500 text-[10px] font-medium">
        <text
          v-for="(t, i) in yTickLabels"
          :key="i"
          x="4"
          :y="yGrid(i) + 4"
        >
          {{ t }}
        </text>
      </g>
      <!-- Courbes -->
      <polyline
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-secondary-500"
        :points="pointsGross"
      />
      <polyline
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-success-600"
        :points="pointsNet"
      />
      <!-- Points -->
      <g v-for="(lbl, i) in labels" :key="lbl">
        <circle
          :cx="xAt(i)"
          :cy="yAt(grossNormalized[i])"
          r="4"
          fill="currentColor"
          class="text-secondary-500 stroke-white"
          stroke-width="2"
        />
        <circle
          :cx="xAt(i)"
          :cy="yAt(netNormalized[i])"
          r="4"
          fill="currentColor"
          class="text-success-600 stroke-white"
          stroke-width="2"
        />
      </g>
      <!-- Libellés mois -->
      <g class="fill-neutral-500 text-[10px] font-medium">
        <text
          v-for="(lbl, i) in labels"
          :key="'l' + i"
          :x="xAt(i)"
          y="208"
          text-anchor="middle"
        >
          {{ lbl }}
        </text>
      </g>
    </svg>
    <div class="flex flex-wrap items-center justify-center gap-6 mt-2 text-xs font-medium">
      <span class="inline-flex items-center gap-2 text-neutral-600">
        <span class="w-3 h-0.5 rounded-full bg-secondary-500" />
        Salaire brut
      </span>
      <span class="inline-flex items-center gap-2 text-neutral-600">
        <span class="w-3 h-0.5 rounded-full bg-success-600" />
        Salaire net
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, default: "Tendance des paiements" },
  /** Libellés d’axes (ex. mois) */
  labels: { type: Array, required: true },
  /** Valeurs brut (même unité que net, ex. millions USD) */
  gross: { type: Array, required: true },
  net: { type: Array, required: true },
});

const pad = { l: 48, r: 20, t: 16, b: 36 };
const w = 520;
const h = 220;

const innerW = w - pad.l - pad.r;
const innerH = h - pad.t - pad.b;

const allValues = computed(() => [...props.gross, ...props.net]);
const vmin = computed(() => Math.min(...allValues.value));
const vmax = computed(() => Math.max(...allValues.value));
const vrange = computed(() => Math.max(vmax.value - vmin.value, 1e-6));

/** Lignes horizontales y = pad.t … pad.t+innerH (5 niveaux) */
const yGrid = (i) => pad.t + (innerH / 4) * i;

const yTickLabels = computed(() => {
  const n = 5;
  const labels = [];
  for (let i = 0; i < n; i++) {
    const t = 1 - i / (n - 1 || 1);
    const v = vmin.value + t * vrange.value;
    labels.push(formatCompact(v));
  }
  return labels;
});

function formatCompact(v) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}k`;
  return v.toFixed(1);
}

const grossNormalized = computed(() => props.gross.map((v) => (v - vmin.value) / vrange.value));
const netNormalized = computed(() => props.net.map((v) => (v - vmin.value) / vrange.value));

function xAt(i) {
  const n = props.labels.length;
  if (n <= 1) return pad.l + innerW / 2;
  return pad.l + (innerW * i) / (n - 1);
}

function yAt(t) {
  return pad.t + innerH * (1 - t);
}

const pointsGross = computed(() =>
  props.labels.map((_, i) => `${xAt(i)},${yAt(grossNormalized.value[i])}`).join(" ")
);
const pointsNet = computed(() =>
  props.labels.map((_, i) => `${xAt(i)},${yAt(netNormalized.value[i])}`).join(" ")
);
</script>
