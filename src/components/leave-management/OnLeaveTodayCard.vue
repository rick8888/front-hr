<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6">
    <h3 class="text-base font-semibold text-neutral-800">{{ t("admin.leave.calendar.onLeaveToday") }}</h3>
    <p class="mt-1 text-xs text-neutral-500">{{ dateLabel }}</p>
    <div class="mt-4">
      <div
        v-if="loading"
        class="flex min-h-[120px] flex-col items-center justify-center gap-2 text-sm text-neutral-500"
        aria-busy="true"
      >
        <span
          class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
          aria-hidden="true"
        />
        {{ t("common.loading") }}
      </div>
      <p v-else-if="!members.length" class="text-center text-sm text-neutral-400">
        {{ t("admin.leave.calendar.noOneToday") }}
      </p>
      <ul v-else class="space-y-2 text-sm text-neutral-800">
        <li v-for="m in members" :key="m.id">{{ m.label }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

defineProps({
  dateLabel: { type: String, required: true },
  members: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();
</script>
