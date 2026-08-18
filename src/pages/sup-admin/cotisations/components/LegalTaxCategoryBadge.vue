<template>
  <span
    class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
    :class="LEGAL_TAX_CATEGORY_TONES[resolved] ?? 'bg-neutral-100 text-neutral-600'"
  >
    {{ legalTaxCategoryLabel(resolved) }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import {
  LEGAL_TAX_CATEGORY_TONES,
  legalTaxCategoryLabel,
  resolveLegalTaxCategory,
} from "../../../../data/legal-tax/index.js";

const props = defineProps({
  tax: { type: Object, required: true },
});

const resolved = computed(() => resolveLegalTaxCategory(props.tax));
</script>
