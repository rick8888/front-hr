<template>
  <article
    class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
  >
    <header
      v-if="!loading && plan.highlighted"
      class="flex items-center justify-center bg-[#7c7cf8] px-4 py-3"
    >
      <span
        class="inline-flex items-center rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#7c7cf8]"
      >
        {{ plan.badge }}
      </span>
    </header>

    <div
      v-if="loading"
      class="flex min-h-[16rem] items-center justify-center px-5 py-6"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
    </div>

    <div v-else class="px-5 py-6 text-center md:px-6">
      <h3 class="text-base font-semibold text-neutral-900">{{ plan.name }}</h3>

      <p class="mt-2 flex items-baseline justify-center gap-1">
        <span class="text-3xl font-bold text-neutral-900">{{ plan.price }}</span>
        <span class="text-sm text-neutral-500">{{ plan.cadence }}</span>
      </p>

      <p class="mt-3 text-sm text-neutral-500">{{ plan.tagline }}</p>

      <ul class="mt-5 space-y-2 text-left">
        <li
          v-for="(feature, idx) in plan.features"
          :key="idx"
          class="flex items-start gap-2 text-sm text-neutral-700"
        >
          <svg
            class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{{ feature }}</span>
        </li>
      </ul>

      <div class="mt-6">
        <button
          type="button"
          :disabled="plan.cta?.disabled"
          :class="[
            'inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
            ctaClass,
          ]"
          @click="onCtaClick"
        >
          {{ plan.cta?.label || "Choose Plan" }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  plan: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["choose"]);

const ctaClass = computed(() => {
  if (props.plan.cta?.disabled) {
    return "bg-neutral-100 text-neutral-400 cursor-not-allowed";
  }
  return "bg-[#7c7cf8] text-white shadow-sm hover:bg-[#6b6be8]";
});

function onCtaClick() {
  if (props.plan.cta?.disabled) return;
  emit("choose", props.plan);
}
</script>
