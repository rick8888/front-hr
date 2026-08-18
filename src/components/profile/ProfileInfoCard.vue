<template>
  <article
    class="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 sm:p-6"
    :aria-busy="loading"
  >
    <div
      v-for="(section, idx) in sections"
      :key="section.title"
      :class="idx > 0 ? 'mt-6 pt-6 border-t border-neutral-100' : ''"
    >
      <h3 class="text-[11px] font-semibold tracking-[0.08em] uppercase text-neutral-500 mb-3">
        {{ section.title }}
      </h3>
      <ul class="space-y-2.5">
        <li
          v-for="item in section.items"
          :key="item.label"
          class="flex items-start gap-3 text-sm"
        >
          <ProfileIcon
            :name="item.icon"
            size="sm"
            class="mt-0.5 text-neutral-400 flex-shrink-0"
          />
          <div class="flex-1 min-w-0 flex flex-wrap items-center gap-x-2">
            <span class="text-neutral-500">{{ item.label }}:</span>
            <span
              v-if="loading"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
              aria-hidden="true"
            />
            <span
              v-else-if="item.badge"
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                badgeClass(item.badge),
              ]"
            >
              {{ item.value }}
            </span>
            <span v-else class="text-neutral-900 font-medium break-words">
              {{ item.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup>
import ProfileIcon from "./ProfileIcon.vue";

defineProps({
  sections: {
    type: Array,
    required: true,
    // [{ title, items: [{ icon, label, value, badge?: 'neutral' | 'success' | 'info' | 'warning' }] }]
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const BADGE_CLASSES = {
  neutral: "bg-neutral-100 text-neutral-700",
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
  primary: "bg-primary-50 text-primary-700",
  secondary: "bg-secondary-50 text-secondary-700",
};

function badgeClass(name) {
  return BADGE_CLASSES[name] || BADGE_CLASSES.neutral;
}
</script>
