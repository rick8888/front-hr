<template>
  <button
    :class="[
      'font-medium transition-all duration-200 rounded-lg',
      sizeClass,
      variantClass,
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
    ]"
    :disabled="disabled"
  >
    <span v-if="icon" class="mr-2">{{ icon }}</span>
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary", "outline", "ghost"].includes(v),
  },
  size: {
    type: String,
    default: "md",
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
  disabled: Boolean,
  icon: String,
});

const sizeClass = computed(() => {
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return sizes[props.size];
});

const variantClass = computed(() => {
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    outline: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
    ghost: "text-neutral-700 hover:bg-neutral-100",
  };
  return variants[props.variant];
});
</script>

<style scoped></style>
