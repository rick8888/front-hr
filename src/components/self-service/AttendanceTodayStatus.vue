<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="flex items-center justify-between gap-3 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.attendance.todayStatus") }}</h2>
      <span class="text-sm text-neutral-500">{{ date }}</span>
    </header>
    <div class="px-5 pb-5 md:px-6 md:pb-6">
      <div
        v-if="loading"
        class="flex min-h-[56px] items-center justify-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-500"
        role="status"
      >
        <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600" aria-hidden="true" />
        {{ t("common.loading") }}
      </div>
      <div
        v-else-if="!hasRecord"
        class="flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700"
        role="status"
      >
        <svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z" />
        </svg>
        <p>{{ displayMessage }}</p>
      </div>
      <slot v-else name="record" />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  date: { type: String, required: true },
  hasRecord: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  message: { type: String, default: "" },
});

const { t } = useI18n();

const displayMessage = computed(
  () => props.message || t("ss.attendance.noRecordToday"),
);
</script>
