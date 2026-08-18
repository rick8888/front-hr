<template>
  <div class="space-y-1.5">
    <label class="block text-xs font-medium text-neutral-500">{{ label }}</label>
    <select
      :value="modelValue"
      class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  options: { type: Array, default: () => [] },
});

defineEmits(["update:modelValue"]);

const normalizedOptions = computed(() =>
  (props.options || []).map((option) => {
    if (option && typeof option === "object") {
      const value = String(option.value ?? option.slug ?? option.id ?? "");
      const label = String(option.label ?? option.name ?? value);
      return { value, label };
    }
    const value = String(option ?? "");
    return { value, label: value };
  }).filter((option) => option.value !== "")
);
</script>
