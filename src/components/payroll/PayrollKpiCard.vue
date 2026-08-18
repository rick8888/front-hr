<template>
  <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
      :class="iconClass"
    >
      <slot name="icon" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-neutral-500">{{ label }}</p>
      <p class="text-2xl font-bold tabular-nums leading-tight mt-0.5" :class="valueClass">
        {{ value }}
      </p>
      <p v-if="sublabel" class="text-xs text-neutral-500 mt-1">{{ sublabel }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  sublabel: { type: String, default: "" },
  valueClass: { type: String, default: "text-neutral-900" },
  iconClass: { type: String, default: "" },
});
</script>
