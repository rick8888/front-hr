<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs"
  >
    <header class="mb-6 flex items-start justify-between gap-4">
      <h3 class="text-base font-semibold text-neutral-800">
        {{ title }}
      </h3>
      <span v-if="legend" class="shrink-0 text-xs font-medium text-neutral-500">
        {{ legend }}
      </span>
    </header>

    <div class="grid grid-cols-[2.5rem_1fr] gap-3">
      <div
        class="flex flex-col-reverse justify-between text-[11px] text-neutral-400"
        :style="{ height: chartHeight + 'px' }"
        aria-hidden="true"
      >
        <span v-for="t in yAxisTicks" :key="t">{{ t }}</span>
      </div>

      <div class="relative">
        <span
          v-if="yLabel"
          class="absolute -left-7 top-1/2 origin-center -translate-y-1/2 -rotate-90 text-[11px] font-medium text-neutral-500"
        >
          {{ yLabel }}
        </span>

        <div
          class="grid items-end gap-1 sm:gap-2 border-l border-b border-neutral-100"
          :style="{
            height: chartHeight + 'px',
            gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))`,
          }"
        >
          <div
            v-for="(m, idx) in months"
            :key="m.label + idx"
            class="flex h-full items-end justify-center px-0.5"
            :title="`${m.label}: ${m.value}`"
          >
            <div
              class="w-full max-w-[2.5rem] rounded-md transition-colors"
              :class="barColorClass"
              :style="{
                height:
                  m.value > 0 ? `${(m.value / safeMax) * 100}%` : '2px',
                opacity: m.value > 0 ? 1 : 0,
              }"
            />
          </div>
        </div>

        <div
          class="mt-2 grid gap-1 sm:gap-2 text-[11px] text-neutral-500"
          :style="{
            gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))`,
          }"
        >
          <span
            v-for="(m, idx) in months"
            :key="'lbl-' + m.label + idx"
            class="truncate text-center"
          >
            {{ m.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  legend: { type: String, default: "" },
  yLabel: { type: String, default: "Days" },
  /** [{ label: 'Jan', value: 5 }, ...] */
  months: { type: Array, required: true },
  chartHeight: { type: Number, default: 240 },
  /** When omitted, derived from data (rounded up to next int). */
  maxValue: { type: Number, default: null },
  yTickCount: { type: Number, default: 6 },
  barColorClass: { type: String, default: "bg-primary-500" },
});

const safeMax = computed(() => {
  if (props.maxValue && props.maxValue > 0) return props.maxValue;
  const dataMax = Math.max(0, ...props.months.map((m) => Number(m.value) || 0));
  return Math.max(1, Math.ceil(dataMax));
});

const yAxisTicks = computed(() => {
  const count = Math.max(2, props.yTickCount);
  const step = safeMax.value / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const v = i * step;
    return Number.isInteger(v) ? v : Number(v.toFixed(1));
  });
});
</script>
