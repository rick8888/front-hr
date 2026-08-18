<template>
  <article
    class="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm font-medium text-neutral-500">{{ label }}</p>
      <span
        :class="[
          'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
          iconWrapClass,
        ]"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>
    </div>

    <div v-if="loading" class="mt-3 flex h-8 items-center">
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
    </div>
    <p v-else class="mt-3 text-2xl font-bold text-neutral-900">{{ value }}</p>

    <div class="mt-2 min-h-[1.25rem]">
      <div
        v-if="loading"
        class="h-4 w-24 animate-pulse rounded bg-neutral-100"
        aria-hidden="true"
      />
      <slot v-else name="footer" />
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  loading: { type: Boolean, default: false },
  /** 'purple' | 'cyan' | 'green' */
  tone: {
    type: String,
    default: "purple",
    validator: (v) => ["purple", "cyan", "green"].includes(v),
  },
});

const iconWrapClass = computed(() => {
  const map = {
    purple: "bg-secondary-50 text-[#7c7cf8]",
    cyan: "bg-sky-50 text-sky-500",
    green: "bg-emerald-50 text-emerald-600",
  };
  return map[props.tone] || map.purple;
});
</script>
