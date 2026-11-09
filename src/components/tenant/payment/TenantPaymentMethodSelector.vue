<template>
  <div class="space-y-3">
    <label
      v-for="method in methods"
      :key="method.code"
      :class="[
        'flex items-start gap-3 rounded-lg border-2 p-4 transition-colors',
        method.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        method.disabled
          ? 'border-neutral-200'
          : modelValue === method.code
          ? 'border-[#7c7cf8] bg-secondary-50/40'
          : 'border-neutral-200 hover:border-neutral-300',
      ]"
    >
      <input
        :checked="modelValue === method.code"
        type="radio"
        :value="method.code"
        :disabled="method.disabled"
        class="mt-0.5 h-4 w-4 border-neutral-300 text-[#7c7cf8] focus:ring-[#7c7cf8]"
        @change="$emit('update:modelValue', method.code)"
      />
      <div>
        <p class="text-sm font-bold text-neutral-900">{{ method.title }}</p>
        <p class="mt-0.5 text-xs text-neutral-500">{{ method.description }}</p>
        <p v-if="method.disabled" class="mt-1 text-xs font-semibold text-amber-700">
          Temporairement indisponible
        </p>
      </div>
    </label>
  </div>
</template>

<script setup>
defineProps({
  methods: { type: Array, required: true },
  modelValue: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>
