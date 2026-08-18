<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">Balance Overview</h2>
    </header>

    <div class="overflow-x-auto px-4 pb-5 pt-4 md:px-6">
      <div class="mb-4 flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-primary-500" /> Entitled
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Used
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Available
        </span>
      </div>

      <div class="grid grid-cols-[1.25rem_2.25rem_minmax(0,1fr)] gap-x-2 gap-y-0">
        <div class="flex items-center justify-center self-stretch pt-2">
          <span class="text-[11px] font-medium text-neutral-500 [writing-mode:vertical-rl] rotate-180">
            Days
          </span>
        </div>
        <div
          class="flex flex-col justify-between pt-1 text-[11px] text-neutral-400"
          :style="{ height: chartHeight + 'px' }"
          aria-hidden="true"
        >
          <span v-for="t in yTicks" :key="t">{{ t }}</span>
        </div>

        <div class="relative min-w-0 border-l border-b border-neutral-100 pb-10">
          <!-- Grille horizontale (alignée sur les ticks Y) -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col justify-between px-1"
            :style="{ height: chartHeight + 'px' }"
          >
            <div
              v-for="i in gridLineCount"
              :key="'grid-' + i"
              class="h-px w-full flex-shrink-0 bg-neutral-100"
            />
          </div>

          <!-- Barres : stretch pour que les % de hauteur s’appliquent à la zone utile -->
          <div
            class="relative flex items-stretch gap-2 px-1"
            :style="{ height: chartHeight + 'px' }"
          >
            <div
              v-for="(row, idx) in chartRows"
              :key="idx"
              class="flex min-w-[3.25rem] flex-1 flex-col justify-end"
            >
              <div class="flex min-h-0 w-full flex-1 items-end justify-center gap-0.5">
                <div
                  class="w-full max-w-[1.15rem] min-h-[3px] rounded-t bg-primary-500 shadow-sm"
                  :style="{ height: barHeight(row.entitled) }"
                  :title="`Entitled: ${row.entitled} days`"
                />
                <div
                  class="w-full max-w-[1.15rem] min-h-[3px] rounded-t bg-rose-500 shadow-sm"
                  :style="{ height: barHeight(row.used) }"
                  :title="`Used: ${row.used} days`"
                />
                <div
                  class="w-full max-w-[1.15rem] min-h-[3px] rounded-t bg-emerald-500 shadow-sm"
                  :style="{ height: barHeight(row.available) }"
                  :title="`Available: ${row.available} days`"
                />
              </div>
            </div>
          </div>

          <div class="-mt-6 flex gap-2 px-1 pt-2">
            <div
              v-for="(row, idx) in chartRows"
              :key="'lbl-' + idx"
              class="flex min-w-[4rem] flex-1 justify-center"
            >
              <span
                class="block max-w-[5rem] origin-top-left -rotate-45 translate-y-4 text-[10px] leading-tight text-neutral-500"
              >
                {{ shortLabel(row.leaveType) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p class="sr-only">Balance overview chart by leave type.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  rows: { type: Array, required: true },
  chartHeight: { type: Number, default: 220 },
  maxDays: { type: Number, default: null },
});

const chartRows = computed(() =>
  props.rows.slice(0, 12).map((r) => ({
    leaveType: r.leaveType,
    entitled: Number(r.entitlement) || 0,
    used: Number(r.used) || 0,
    available: Number(r.available) || 0,
  })),
);

const safeMax = computed(() => {
  if (props.maxDays && props.maxDays > 0) return props.maxDays;
  let m = 16;
  for (const r of chartRows.value) {
    m = Math.max(m, r.entitled, r.used, r.available);
  }
  return Math.min(96, Math.ceil(m));
});

const yTicks = computed(() => {
  const max = safeMax.value;
  const step = max / 4;
  return [0, step, step * 2, step * 3, max]
    .map((v) => (Number.isInteger(v) ? v : Number(v.toFixed(1))))
    .reverse();
});

/** Lignes de grille : une ligne par graduation Y. */
const gridLineCount = computed(() => yTicks.value.length);

function barHeight(value) {
  const v = Number(value) || 0;
  const pct = safeMax.value > 0 ? (v / safeMax.value) * 100 : 0;
  if (v <= 0) return "0%";
  return `${Math.max(pct, 4)}%`;
}

function shortLabel(name) {
  return String(name || "").replace(" Leave", "").trim();
}
</script>
