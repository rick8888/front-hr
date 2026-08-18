<template>
  <div class="border-b border-neutral-200 py-6">
    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">
      Billing Details
    </p>
    <dl class="mt-4 space-y-3">
      <div
        v-for="(row, idx) in lines"
        :key="idx"
        class="flex items-start justify-between gap-4 text-sm"
      >
        <dt class="text-neutral-600">{{ row.label }}</dt>
        <dd
          class="shrink-0 font-medium tabular-nums"
          :class="row.tone === 'muted' ? 'text-neutral-500' : 'text-neutral-900'"
        >
          {{ row.amount }}
        </dd>
      </div>
    </dl>
    <div
      class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm"
    >
      <span class="font-bold text-neutral-900">Amount due today</span>
      <span class="text-lg font-bold text-neutral-900">{{ amountDue }}</span>
    </div>
    <div
      class="mt-4 flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-sky-800"
      role="note"
    >
      <svg
        class="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>{{ notice }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lines: { type: Array, required: true },
  amountDue: { type: String, required: true },
  notice: { type: String, required: true },
});
</script>
