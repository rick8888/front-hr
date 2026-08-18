<template>
  <aside
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6"
  >
    <h3 class="mb-4 text-base font-semibold text-neutral-900">
      {{ title }}
    </h3>
    <ul class="space-y-4">
      <li
        v-for="(item, idx) in items"
        :key="idx"
        class="flex items-start gap-3"
      >
        <span
          class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          :class="iconBgClass(item.tone)"
          aria-hidden="true"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            class="h-4 w-4"
            :class="iconColorClass(item.tone)"
          />
          <svg
            v-else
            class="h-4 w-4"
            :class="iconColorClass(item.tone)"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="iconPath(item.tone)"
            />
          </svg>
        </span>
        <div class="space-y-0.5">
          <p class="text-sm font-semibold text-neutral-900">{{ item.title }}</p>
          <p class="text-xs leading-relaxed text-neutral-500">
            {{ item.description }}
          </p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Guidelines" },
  /**
   * Array of guideline items.
   * Each item: { title, description, tone?: 'blue' | 'amber' | 'green' | 'sky' }
   */
  items: { type: Array, required: true },
});

const TONES = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600" },
  sky: { bg: "bg-sky-100", text: "text-sky-600" },
};

const PATHS = {
  blue: "M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-9 4h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v15a1 1 0 001 1z",
  amber: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  green: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  sky: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
};

function iconBgClass(tone) {
  return (TONES[tone] || TONES.blue).bg;
}

function iconColorClass(tone) {
  return (TONES[tone] || TONES.blue).text;
}

function iconPath(tone) {
  return PATHS[tone] || PATHS.blue;
}
</script>
