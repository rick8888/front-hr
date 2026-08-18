<template>
  <div class="space-y-1">
    <p class="text-xs font-medium text-neutral-500">{{ label }}</p>
    <slot>
      <p class="text-sm font-medium text-neutral-900">{{ displayValue }}</p>
    </slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number, null], default: "" },
});

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === "") {
    return "—";
  }
  return props.value;
});
</script>
