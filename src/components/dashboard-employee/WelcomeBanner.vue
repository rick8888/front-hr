<template>
  <section
    class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-500 to-secondary-500 px-6 py-7 text-white shadow-md md:px-8 md:py-8"
  >
    <div class="relative z-10 max-w-3xl">
      <h1 class="text-xl font-bold md:text-2xl">
        {{ greeting }}, {{ name }}!
        <span aria-hidden="true">{{ "\u{1F44B}" }}</span>
      </h1>
      <p class="mt-1 text-sm text-white/85 md:text-base">
        {{ subtitle }}
      </p>
    </div>

    <!-- Decorative illustration on the right -->
    <div
      class="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-white/90 md:flex"
      aria-hidden="true"
    >
      <svg class="h-24 w-24" viewBox="0 0 200 200" fill="none">
        <circle cx="120" cy="60" r="22" fill="#FED7AA" />
        <rect x="92" y="86" width="56" height="68" rx="14" fill="#FBA94B" />
        <rect x="76" y="112" width="14" height="40" rx="7" fill="#FED7AA" />
        <rect x="148" y="112" width="14" height="40" rx="7" fill="#FED7AA" />
        <rect x="100" y="156" width="16" height="32" rx="6" fill="#1F2937" />
        <rect x="124" y="156" width="16" height="32" rx="6" fill="#1F2937" />
        <rect x="36" y="98" width="44" height="32" rx="6" fill="#FFFFFF" opacity="0.85" />
        <rect x="36" y="138" width="44" height="22" rx="6" fill="#FFFFFF" opacity="0.65" />
        <circle cx="170" cy="42" r="3" fill="#FBBF24" />
        <circle cx="178" cy="58" r="2.5" fill="#F472B6" />
        <circle cx="160" cy="32" r="2" fill="#FBBF24" />
      </svg>
    </div>
  </section>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  greeting: { type: String, default: "Welcome back" },
  subtitle: {
    type: String,
    default: "Here's what's happening with your work today.",
  },
});
</script>
