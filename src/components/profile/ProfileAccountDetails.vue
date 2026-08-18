<template>
  <article
    class="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 sm:p-6"
    :aria-busy="loading"
  >
    <h2 class="text-base font-semibold text-neutral-900 mb-5">{{ t("ss.profile.accountDetails.title") }}</h2>
    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex items-start gap-3"
      >
        <span
          :class="[
            'inline-flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0',
            toneClass(item.tone),
          ]"
        >
          <ProfileIcon :name="item.icon" size="sm" />
        </span>
        <div class="min-w-0">
          <dt class="text-xs text-neutral-500">{{ item.label }}</dt>
          <dd v-if="loading" class="mt-1 flex h-5 items-center" aria-busy="true">
            <span
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
              aria-hidden="true"
            />
          </dd>
          <dd v-else class="text-sm font-medium text-neutral-900 break-words">
            {{ item.value }}
          </dd>
        </div>
      </div>
    </dl>
  </article>
</template>

<script setup>
import ProfileIcon from "./ProfileIcon.vue";
import { useI18n } from "../../i18n/index.js";

defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const TONES = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-blue-50 text-blue-600",
  warning: "bg-amber-50 text-amber-600",
  neutral: "bg-neutral-100 text-neutral-600",
};

function toneClass(tone) {
  return TONES[tone] || TONES.neutral;
}
</script>
