<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-neutral-200 flex items-center gap-2">
      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 class="text-lg font-semibold text-neutral-900">Salary Breakdown</h2>
    </div>
    <div class="p-5">
      <ul class="space-y-2.5 text-sm">
        <li
          v-for="line in lines"
          :key="line.key"
          class="flex justify-between gap-4"
          :class="line.rowClass"
        >
          <span>{{ line.label }}</span>
          <span class="font-medium tabular-nums" :class="line.amountClass">{{ line.amount }}</span>
        </li>
      </ul>
      <div
        class="mt-5 rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 flex justify-between items-baseline gap-3"
      >
        <span class="font-bold text-neutral-900">Net Salary</span>
        <span class="text-lg font-bold text-primary-600 tabular-nums">{{ formatMoney(net) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  earnings: { type: Array, default: () => [] },
  deductions: { type: Array, default: () => [] },
  gross: { type: Number, required: true },
  net: { type: Number, required: true },
});

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function labelWithPercent(item) {
  if (item.percent == null) return item.name;
  return `${item.name} (${item.percent}%)`;
}

const lines = computed(() => {
  const out = [];
  props.earnings.forEach((e, i) => {
    const isBase = i === 0 || e.isBase || e.name === "Basic Salary";
    out.push({
      key: `e-${e.name}`,
      label: isBase ? e.name : `+ ${labelWithPercent(e)}`,
      amount: formatMoney(e.amount),
      rowClass: isBase ? "text-neutral-800 font-medium" : "text-green-700",
      amountClass: isBase ? "text-neutral-900" : "text-green-700",
    });
  });
  out.push({
    key: "gross",
    label: "Gross Salary",
    amount: formatMoney(props.gross),
    rowClass: "pt-2 mt-1 border-t border-neutral-100 font-bold text-neutral-900",
    amountClass: "text-neutral-900 font-bold",
  });
  props.deductions.forEach((d) => {
    out.push({
      key: `d-${d.name}`,
      label: `− ${d.name}`,
      amount: `−${formatMoney(d.amount)}`,
      rowClass: "text-red-600",
      amountClass: "text-red-600",
    });
  });
  return out;
});
</script>
