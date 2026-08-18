<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <p class="text-sm font-medium text-neutral-700">Current Plan</p>

    <div
      v-if="loading"
      class="mt-3 flex min-h-[4.5rem] items-center justify-center"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
    </div>

    <div
      v-else
      class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">{{ plan.name }}</h2>
        <p class="mt-1 text-sm text-neutral-500">{{ plan.tagline }}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-neutral-900">{{ plan.price }}</p>
        <p class="text-sm text-neutral-500">{{ plan.cadence }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  plan: { type: Object, required: true },
  loading: { type: Boolean, default: false },
});
</script>
