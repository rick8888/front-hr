<template>
  <div
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-neutral-800">
          {{ title }}
        </p>
        <p v-if="subtitle" class="mt-0.5 text-xs text-neutral-500">
          {{ subtitle }}
        </p>
      </div>
      <span
        v-if="chipValue !== null && chipValue !== undefined"
        class="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold"
        :class="palette.chip"
      >
        {{ chipValue }}
      </span>
    </div>

    <div class="mt-5 flex items-center gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        :class="palette.icon"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>
      <div class="min-w-0 leading-tight">
        <p class="text-xs text-neutral-500">{{ unitLabel }}</p>
        <p v-if="loading" class="flex h-8 items-center">
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
            aria-hidden="true"
          />
        </p>
        <p v-else class="text-2xl font-bold text-neutral-900">
          {{ formattedValue }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  unitLabel: { type: String, default: "Days" },
  value: { type: [Number, String], default: 0 },
  chipValue: { type: [Number, String, null], default: null },
  loading: { type: Boolean, default: false },
  tone: {
    type: String,
    default: "violet",
    validator: (v) => ["violet", "green", "blue", "red", "neutral"].includes(v),
  },
});

const TONES = {
  violet: {
    icon: "bg-primary-500 text-white",
    chip: "bg-primary-50 text-primary-700",
  },
  green: {
    icon: "bg-green-500 text-white",
    chip: "bg-green-50 text-green-700",
  },
  blue: {
    icon: "bg-sky-500 text-white",
    chip: "bg-sky-50 text-sky-700",
  },
  red: {
    icon: "bg-red-500 text-white",
    chip: "bg-red-50 text-red-700",
  },
  neutral: {
    icon: "bg-neutral-700 text-white",
    chip: "bg-neutral-100 text-neutral-700",
  },
};

const palette = computed(() => TONES[props.tone] ?? TONES.violet);

const formattedValue = computed(() =>
  typeof props.value === "number"
    ? new Intl.NumberFormat("en-US").format(props.value)
    : props.value,
);
</script>
