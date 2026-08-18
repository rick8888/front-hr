<template>
  <div :class="showDivider ? 'mt-8 border-t border-neutral-200 pt-8' : ''">
    <h2 class="text-base font-bold text-neutral-900">{{ title }}</h2>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  showDivider: { type: Boolean, default: true },
});
</script>
