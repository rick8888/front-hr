<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-5">
    <div class="flex gap-3">
      <div
        class="w-10 h-10 shrink-0 rounded-lg bg-secondary-50 border border-secondary-100 flex items-center justify-center text-secondary-600"
        aria-hidden="true"
      >
        <slot name="icon" />
      </div>
      <div>
        <h3 class="text-base font-semibold text-neutral-900">{{ title }}</h3>
        <p class="text-sm text-neutral-500">{{ subtitle }}</p>
      </div>
    </div>
    <div class="pt-0.5">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
});
</script>
