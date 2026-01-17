<template>
  <div class="flex flex-col">
    <label v-if="label" class="block text-sm font-medium text-neutral-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400',
        'transition-colors duration-200',
        'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
          : '',
      ]"
    />
    <p v-if="error" class="text-xs text-error-500 mt-1">{{ error }}</p>
    <p v-if="hint" class="text-xs text-neutral-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  type: {
    type: String,
    default: "text",
  },
  label: String,
  placeholder: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
