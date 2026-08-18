<template>
  <article
    class="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 sm:p-5 flex flex-col items-center text-center"
  >
    <span
      :class="[
        'inline-flex items-center justify-center h-10 w-10 rounded-full mb-3',
        toneClass,
      ]"
    >
      <ProfileIcon :name="icon" size="md" />
    </span>
    <p v-if="loading" class="flex h-6 items-center" aria-busy="true">
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        aria-hidden="true"
      />
    </p>
    <p v-else class="text-base sm:text-lg font-semibold text-neutral-900 leading-tight">
      {{ value }}
    </p>
    <p class="text-xs text-neutral-500 mt-1">{{ label }}</p>
  </article>
</template>

<script setup>
import { computed } from "vue";
import ProfileIcon from "./ProfileIcon.vue";

const props = defineProps({
  icon: { type: String, required: true },
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  tone: { type: String, default: "primary" }, // primary | success | info | warning | neutral
  loading: { type: Boolean, default: false },
});

const TONE_CLASSES = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-blue-50 text-blue-600",
  warning: "bg-amber-50 text-amber-600",
  neutral: "bg-neutral-100 text-neutral-600",
};

const toneClass = computed(
  () => TONE_CLASSES[props.tone] || TONE_CLASSES.primary,
);
</script>
