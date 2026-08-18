<template>
  <div class="flex items-center justify-between gap-4">
    <div class="min-w-0">
      <p class="text-sm font-medium text-neutral-800">{{ label }}</p>
      <p v-if="hint" class="mt-0.5 text-xs text-neutral-500">{{ hint }}</p>
    </div>
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label"
      class="relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      :class="modelValue ? 'bg-primary-500' : 'bg-neutral-300'"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span
        class="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  hint: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>
