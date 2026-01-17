<template>
  <div
    v-if="isVisible"
    :class="['fixed top-4 right-4 p-4 rounded-lg max-w-sm', colorClass]"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <span class="text-xl">{{ icon }}</span>
      <div class="flex-1">
        <p v-if="title" class="font-medium">{{ title }}</p>
        <p class="text-sm">{{ message }}</p>
      </div>
      <button
        @click="isVisible = false"
        class="text-xl leading-none hover:opacity-75"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "info",
    validator: (v) => ["success", "error", "warning", "info"].includes(v),
  },
  title: String,
  message: String,
  duration: {
    type: Number,
    default: 3000,
  },
});

const isVisible = ref(true);

if (props.duration) {
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
}

const colorClass = computed(() => {
  const colors = {
    success: "bg-success-50 text-success-700 border border-success-200",
    error: "bg-error-50 text-error-700 border border-error-200",
    warning: "bg-warning-50 text-warning-700 border border-warning-200",
    info: "bg-info-50 text-info-700 border border-info-200",
  };
  return colors[props.type];
});

const icon = computed(() => {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[props.type];
});
</script>

<style scoped></style>
