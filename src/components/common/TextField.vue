<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-neutral-800"
    >
      {{ label }}<span v-if="required" class="text-red-500" aria-hidden="true">*</span>
    </label>

    <component
      :is="multiline ? 'textarea' : 'input'"
      :id="id"
      :type="multiline ? undefined : type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled || undefined"
      :readonly="readonly || undefined"
      :rows="multiline ? rows : undefined"
      :inputmode="inputmode || undefined"
      :min="min ?? undefined"
      :max="max ?? undefined"
      :step="step ?? undefined"
      class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-700 read-only:bg-neutral-50"
      :class="multiline ? 'resize-y' : ''"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <p v-if="hint" class="mt-1.5 text-xs text-neutral-500">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  hint: { type: String, default: "" },
  type: { type: String, default: "text" },
  multiline: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  inputmode: { type: String, default: "" },
  min: { type: [String, Number], default: null },
  max: { type: [String, Number], default: null },
  step: { type: [String, Number], default: null },
});

defineEmits(["update:modelValue"]);
</script>
