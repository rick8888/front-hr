<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-neutral-200 flex items-center gap-2">
      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
      <h2 class="text-lg font-semibold text-neutral-900">Modifiers Details</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm min-w-[520px]">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
            <th class="px-5 py-3 font-medium uppercase text-xs tracking-wide">Name</th>
            <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">Type</th>
            <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide text-right">Percentage</th>
            <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="m in modifiers" :key="m.name + m.type" class="hover:bg-neutral-50/60">
            <td class="px-5 py-3 font-medium text-neutral-900">{{ m.name }}</td>
            <td class="px-3 py-3">
              <span
                :class="[
                  'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                  m.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                ]"
              >
                {{ m.type === "earning" ? "earning" : "deduction" }}
              </span>
            </td>
            <td class="px-3 py-3 text-right text-neutral-600 tabular-nums">
              {{ m.percent != null ? `${m.percent}%` : "—" }}
            </td>
            <td
              class="pr-5 pl-3 py-3 text-right font-semibold tabular-nums"
              :class="m.type === 'earning' ? 'text-green-700' : 'text-red-600'"
            >
              {{ m.type === "earning" ? "+" : "−" }}{{ formatMoney(m.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({
  modifiers: { type: Array, default: () => [] },
});

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}
</script>
