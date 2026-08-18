<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6">
    <h3 class="text-base font-semibold text-neutral-800">{{ t("admin.leave.calendar.stats") }}</h3>
    <div
      v-if="loading"
      class="mt-4 flex min-h-[120px] flex-col items-center justify-center gap-2 text-sm text-neutral-500"
      aria-busy="true"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>
    <dl v-else class="mt-4 space-y-3">
      <div class="flex items-center justify-between gap-4 text-sm">
        <dt class="text-neutral-500">{{ t("admin.leave.calendar.thisMonth") }}</dt>
        <dd class="font-semibold text-neutral-900">
          {{ t("admin.leave.calendar.leavesCount", { count: stats.leavesThisMonth }) }}
        </dd>
      </div>
      <div class="flex items-center justify-between gap-4 text-sm">
        <dt class="text-neutral-500">{{ t("admin.leave.calendar.teamSize") }}</dt>
        <dd class="font-semibold text-neutral-900">
          {{ t("admin.leave.calendar.membersCount", { count: stats.teamSize }) }}
        </dd>
      </div>
      <div class="flex items-center justify-between gap-4 text-sm">
        <dt class="text-neutral-500">{{ t("admin.leave.calendar.avgLeave") }}</dt>
        <dd class="font-semibold text-neutral-900">{{ stats.avgPerPerson }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

defineProps({
  stats: {
    type: Object,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();
</script>
