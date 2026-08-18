<template>
  <svg
    :class="['inline-block', sizeClass]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      v-for="(d, i) in paths"
      :key="i"
      :d="d"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: "sm" }, // xs | sm | md | lg
});

const ICONS = {
  user: ["M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"],
  calendar: [
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  ],
  globe: [
    "M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  ],
  mail: [
    "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  ],
  phone: [
    "M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21L7.6 10.55a11 11 0 005.85 5.85l1.16-1.62a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z",
  ],
  shield: [
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  ],
  flag: [
    "M5 21V4m0 0h11l-2 4 2 4H5",
  ],
  badge: [
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  ],
  clock: [
    "M12 8v4l3 2",
    "M12 22a10 10 0 100-20 10 10 0 000 20z",
  ],
  verified: [
    "M9 12l2 2 4-4",
    "M12 22a10 10 0 100-20 10 10 0 000 20z",
  ],
  activity: [
    "M22 12h-4l-3 9L9 3l-3 9H2",
  ],
  link: [
    "M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1 1",
    "M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1-1",
  ],
  pin: [
    "M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z",
    "M12 11a2 2 0 100-4 2 2 0 000 4z",
  ],
  bolt: [
    "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  ],
  chart: [
    "M3 3v18h18",
    "M7 14l3-3 4 4 6-6",
  ],
};

const sizeClass = computed(() => {
  return {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[props.size] || "h-4 w-4";
});

const paths = computed(() => ICONS[props.name] || []);
</script>
