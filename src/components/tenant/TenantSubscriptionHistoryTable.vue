<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <h2 class="text-base font-bold text-neutral-900">Subscription History</h2>

    <div class="mt-4 overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-neutral-200 text-left">
            <th
              v-for="col in COLUMNS"
              :key="col.key"
              :class="[
                'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500',
                col.align === 'right' ? 'text-right' : 'text-left',
              ]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td
              :colspan="COLUMNS.length"
              class="px-4 py-16 text-center text-sm text-neutral-500"
            >
              <span
                class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500 align-middle"
                aria-hidden="true"
              />
              <span class="ml-2 align-middle">Loading history…</span>
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td
              :colspan="COLUMNS.length"
              class="px-4 py-6 text-center text-sm text-neutral-400"
            >
              No subscription history yet.
            </td>
          </tr>
          <tr
            v-for="row in rows"
            v-else
            :key="row.id"
            class="border-b border-neutral-100 last:border-0"
          >
            <td class="px-4 py-4 text-sm font-medium text-neutral-700">
              {{ row.plan }}
            </td>
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                  statusClass(row.status),
                ]"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-neutral-700">{{ row.period }}</td>
            <td class="px-4 py-4 text-right text-sm font-semibold text-neutral-900">
              {{ row.amount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const COLUMNS = [
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Amount", align: "right" },
];

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "active") return "bg-emerald-50 text-emerald-700";
  if (key === "cancelled" || key === "canceled") return "bg-rose-50 text-rose-700";
  if (key === "pending") return "bg-amber-50 text-amber-700";
  return "bg-neutral-100 text-neutral-600";
}
</script>
