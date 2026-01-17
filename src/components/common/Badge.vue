<template>
  <div
    :class="[
      'px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1',
      colorClass,
    ]"
  >
    <span>{{ icon }}</span>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (v) =>
      ["primary", "success", "warning", "error", "info"].includes(v),
  },
  icon: String,
});

const colorClass = computed(() => {
  const variants = {
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-50 text-warning-700",
    error: "bg-error-50 text-error-700",
    info: "bg-info-50 text-info-700",
  };
  return variants[props.variant];
});
</script>

<style scoped></style>
