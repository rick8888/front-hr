<template>
  <span
    class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
    :class="LEGAL_TAX_TYPE_TONES[type] ?? 'bg-neutral-100 text-neutral-600'"
  >
    {{ legalTaxTypeLabel(type) }}
  </span>
</template>

<script setup>
import { LEGAL_TAX_TYPE_TONES, legalTaxTypeLabel } from "../../../../data/legal-tax/index.js";

defineProps({
  type: { type: String, required: true },
});
</script>
