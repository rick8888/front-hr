<template>
  <div class="pt-6">
    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">
      Feature Changes
    </p>
    <div class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <ul class="space-y-2">
        <li
          v-for="(f, idx) in currentFeatures"
          :key="'c-' + idx"
          class="flex items-start gap-2 text-sm text-neutral-600"
        >
          <svg
            class="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400"
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
          <span>{{ f }}</span>
        </li>
      </ul>
      <ul class="space-y-2">
        <li
          v-for="(f, idx) in newFeatures"
          :key="'n-' + idx"
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
          <span>{{ f }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentFeatures: { type: Array, required: true },
  newFeatures: { type: Array, required: true },
});
</script>
