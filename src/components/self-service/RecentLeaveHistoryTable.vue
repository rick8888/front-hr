<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.leave.recentHistory") }}</h2>
    </header>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-neutral-100 bg-neutral-50/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.leaveType") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.fromDate") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.toDate") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.days") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("common.status") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.requestDate") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="px-5 py-16 text-center">
              <div class="inline-flex items-center justify-center gap-2 text-sm text-neutral-500">
                <span
                  class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
                  aria-hidden="true"
                />
                {{ t("common.loading") }}
              </div>
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td colspan="6" class="px-5 py-12 text-center text-sm text-neutral-500">
              {{ t("ss.leave.noHistory") }}
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="row in rows"
              :key="row.id"
              class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
            >
              <td class="px-5 py-3.5 md:px-6 font-medium text-neutral-800">
                {{ row.leaveType }}
              </td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-600">{{ row.fromDate }}</td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-600">{{ row.toDate }}</td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-700">{{ formatDays(row.days) }}</td>
              <td class="px-5 py-3.5 md:px-6">
                <span
                  :class="[
                    'inline-flex rounded-md px-2.5 py-1 text-xs font-medium',
                    statusClass(row.status),
                  ]"
                >
                  {{ tStatus(row.status) }}
                </span>
              </td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-600">{{ row.appliedOn }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();

function tStatus(status) {
  const key = `ss.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

const STATUS_CLASSES = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
};

function statusClass(status) {
  return STATUS_CLASSES[status] || "bg-neutral-100 text-neutral-700";
}

function formatDays(n) {
  const v = Number(n) || 0;
  return v.toFixed(2);
}
</script>
