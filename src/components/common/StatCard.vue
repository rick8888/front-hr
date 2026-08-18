<template>
  <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <p class="text-sm text-neutral-600 mb-1">{{ title }}</p>

        <div v-if="loading" class="mb-2 flex h-9 items-center">
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
            aria-hidden="true"
          />
        </div>
        <h3 v-else class="text-3xl font-bold text-neutral-900 mb-2">{{ value }}</h3>

        <div v-if="!loading" class="flex items-center gap-2 text-xs text-neutral-500">
          <span>Update: {{ updateDate }}</span>
        </div>
        <div
          v-else
          class="h-4 w-28 animate-pulse rounded bg-neutral-100"
          aria-hidden="true"
        />
      </div>
    </div>

    <div v-if="!loading" class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg
          v-if="changeDirection === 'up'"
          class="w-4 h-4 text-success-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          ></path>
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-error-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          ></path>
        </svg>
        <span
          :class="[
            'text-sm font-medium',
            changeDirection === 'up' ? 'text-success-600' : 'text-error-600',
          ]"
        >
          {{ change }}
        </span>
      </div>
    </div>
    <div
      v-else
      class="h-4 w-16 animate-pulse rounded bg-neutral-100"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: { type: [String, Number], default: "—" },
  change: String,
  updateDate: String,
  changeDirection: {
    type: String,
    default: "up",
  },
  loading: { type: Boolean, default: false },
});
</script>
