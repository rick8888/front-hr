<template>
  <article
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="text-sm text-neutral-500">{{ title }}</p>
      <span
        :class="['inline-flex h-7 w-7 items-center justify-center rounded-full', tone.badge]"
        aria-hidden="true"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-for="(d, i) in iconPaths"
            :key="i"
            :d="d"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </span>
    </div>
    <p class="mt-3 flex items-baseline gap-2">
      <span
        v-if="loading"
        class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        aria-hidden="true"
      />
      <template v-else>
        <span class="text-2xl font-semibold text-neutral-900">{{ value }}</span>
        <span :class="['text-xs font-medium', tone.note]">({{ note }})</span>
      </template>
    </p>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  note: { type: String, default: "This Month" },
  loading: { type: Boolean, default: false },
  icon: {
    type: String,
    default: "check",
    validator: (v) => ["check", "x", "clock", "hourglass"].includes(v),
  },
  tone: {
    type: String,
    default: "success",
    validator: (v) => ["success", "danger", "warning", "info"].includes(v),
  },
});

const TONES = {
  success: { badge: "bg-emerald-50 text-emerald-600", note: "text-emerald-600" },
  danger: { badge: "bg-rose-50 text-rose-600", note: "text-rose-600" },
  warning: { badge: "bg-amber-50 text-amber-600", note: "text-amber-600" },
  info: { badge: "bg-sky-50 text-sky-600", note: "text-sky-600" },
};

const ICONS = {
  check: ["M9 12l2 2 4-4", "M12 22a10 10 0 100-20 10 10 0 000 20z"],
  x: ["M15 9l-6 6M9 9l6 6", "M12 22a10 10 0 100-20 10 10 0 000 20z"],
  clock: ["M12 8v4l3 2", "M12 22a10 10 0 100-20 10 10 0 000 20z"],
  hourglass: [
    "M6 2h12M6 22h12",
    "M6 2v4a6 6 0 0012 0V2",
    "M18 22v-4a6 6 0 00-12 0v4",
  ],
};

const tone = computed(() => TONES[props.tone] || TONES.success);
const iconPaths = computed(() => ICONS[props.icon] || ICONS.check);
</script>
