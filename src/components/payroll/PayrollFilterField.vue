<template>
  <div>
    <label class="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
});
</script>
