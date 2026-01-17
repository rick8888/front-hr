<template>
  <div class="flex flex-col">
    <label v-if="label" class="block text-sm font-medium text-neutral-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :class="[
        'w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 bg-white',
        'transition-colors duration-200',
        'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
          : '',
      ]"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-error-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  options: {
    type: Array,
    default: () => [],
  },
  error: String,
  disabled: Boolean,
  required: Boolean,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
