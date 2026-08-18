<template>
  <div class="flex flex-col gap-1">
    <span class="text-sm font-medium text-neutral-800">{{ label }}</span>
    <label class="inline-flex items-center gap-3 cursor-pointer select-none">
      <input
        :checked="modelValue"
        type="checkbox"
        class="sr-only peer"
        @change="emit('update:modelValue', $event.target.checked)"
      />
      <span
        class="relative h-6 w-11 shrink-0 rounded-full bg-neutral-200 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-secondary-400 peer-focus-visible:ring-offset-2 peer-checked:bg-secondary-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
      <span class="text-sm text-neutral-600">{{ description }}</span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
});

const emit = defineEmits(["update:modelValue"]);
</script>
