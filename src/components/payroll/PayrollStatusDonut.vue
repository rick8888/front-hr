<template>
  <div class="flex flex-col items-center">
    <div
      class="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full shrink-0"
      :style="{ background: donutGradient }"
      role="img"
      :aria-label="ariaLabel"
    >
      <div
        class="absolute inset-[22%] rounded-full bg-white border border-neutral-100 flex flex-col items-center justify-center text-center px-2 shadow-inner"
      >
        <p class="text-lg font-bold text-neutral-900 tabular-nums leading-none">{{ centerValue }}</p>
        <p class="text-[10px] text-neutral-500 mt-1 leading-tight">{{ centerCaption }}</p>
      </div>
    </div>
    <ul class="mt-4 w-full max-w-[220px] space-y-2 text-xs">
      <li
        v-for="s in segments"
        :key="s.key"
        class="flex items-center justify-between gap-2 text-neutral-600"
      >
        <span class="inline-flex items-center gap-2 min-w-0">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: s.color }" />
          <span class="truncate">{{ s.label }}</span>
        </span>
        <span class="font-semibold text-neutral-800 tabular-nums shrink-0">{{ s.count }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** { key, label, count, color } */
  segments: { type: Array, required: true },
  centerValue: { type: [String, Number], required: true },
  centerCaption: { type: String, default: "Statuts" },
});

const total = computed(() =>
  props.segments.reduce((sum, s) => sum + Math.max(0, Number(s.count) || 0), 0)
);

const donutGradient = computed(() => {
  const t = total.value;
  if (t <= 0) {
    return "conic-gradient(from -90deg, #e5e7eb 0% 100%)";
  }
  let acc = 0;
  const parts = [];
  for (const s of props.segments) {
    const c = Math.max(0, Number(s.count) || 0);
    if (c <= 0) continue;
    const pct = (c / t) * 100;
    const start = acc;
    const end = acc + pct;
    parts.push(`${s.color} ${start}% ${end}%`);
    acc = end;
  }
  if (parts.length === 0) {
    return "conic-gradient(from -90deg, #e5e7eb 0% 100%)";
  }
  return `conic-gradient(from -90deg, ${parts.join(", ")})`;
});

const ariaLabel = computed(() => {
  const parts = props.segments.map((s) => `${s.label}: ${s.count}`).join(", ");
  return `Répartition des statuts. ${parts}`;
});
</script>
