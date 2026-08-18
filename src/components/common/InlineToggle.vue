<template>
  <label
    class="inline-flex items-center gap-2 select-none"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label"
      :disabled="disabled"
      class="relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none"
      :class="modelValue ? 'bg-secondary-500' : 'bg-neutral-300'"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span
        class="pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
        :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
      />
    </button>
    <span class="text-sm text-neutral-700">{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
</script>
