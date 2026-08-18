<template>
  <aside
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6"
  >
    <h3 class="mb-4 text-base font-semibold text-neutral-900">
      {{ title }}
    </h3>
    <ul class="space-y-3">
      <li
        v-for="(type, idx) in types"
        :key="idx"
        class="flex items-center gap-3"
      >
        <span
          class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100"
          aria-hidden="true"
        >
          <svg
            class="h-3.5 w-3.5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span class="text-sm text-neutral-700">{{ type }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Common Expense Types" },
  types: { type: Array, required: true },
});
</script>
