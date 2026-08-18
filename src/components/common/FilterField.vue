<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="id"
      class="block text-xs font-medium text-neutral-500"
    >
      {{ label }}
    </label>
    <slot :id="id" />
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, default: "" },
});
</script>
