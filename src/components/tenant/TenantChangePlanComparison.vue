<template>
  <div class="border-b border-neutral-200 pb-6">
    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">
      Plan Comparison
    </p>
    <div class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <p class="text-xs font-medium text-neutral-500">Current Plan</p>
        <p class="mt-1 text-xl font-bold text-neutral-900">
          {{ current.name }}
        </p>
        <p class="mt-0.5 text-sm text-neutral-600">{{ current.priceLine }}</p>
      </div>
      <div>
        <p class="text-xs font-medium text-neutral-500">New Plan</p>
        <p class="mt-1 text-xl font-bold text-neutral-900">{{ next.name }}</p>
        <p class="mt-0.5 text-sm text-neutral-600">{{ next.priceLine }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: { type: Object, required: true },
  next: { type: Object, required: true },
});
</script>
