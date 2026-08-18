<template>
  <span
    class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
    :class="INVOICE_STATUS_TONES[status] ?? 'bg-neutral-100 text-neutral-600'"
  >
    {{ invoiceStatusLabel(status) }}
  </span>
</template>

<script setup>
import { INVOICE_STATUS_TONES, invoiceStatusLabel } from "../../../../data/billing/index.js";

defineProps({
  status: { type: String, required: true },
});
</script>
