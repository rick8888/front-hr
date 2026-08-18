<template>
  <section class="space-y-4">
    <header v-if="title || $slots.header" class="border-b border-neutral-100 pb-3">
      <slot name="header">
        <h3 class="text-base font-semibold text-neutral-900">{{ title }}</h3>
        <p v-if="description" class="mt-0.5 text-xs text-neutral-500">
          {{ description }}
        </p>
      </slot>
    </header>
    <div :class="bodyClass">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  bodyClass: { type: String, default: "space-y-4" },
});
</script>
