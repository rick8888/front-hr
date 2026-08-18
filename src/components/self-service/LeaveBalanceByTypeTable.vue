<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header
      class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 md:px-6"
    >
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.leave.balanceByType") }}</h2>
      <RouterLink
        to="/self-service/leave-requests/new"
        class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-600"
      >
        {{ t("ss.applyLeave") }}
      </RouterLink>
    </header>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-neutral-100 bg-neutral-50/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.leaveType") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.entitlement") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.used") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.pending") }}</th>
            <th scope="col" class="px-5 py-3 md:px-6">{{ t("ss.leave.col.available") }}</th>
            <th scope="col" class="min-w-[140px] px-5 py-3 md:px-6">{{ t("ss.leave.col.usage") }}</th>
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
              {{ t("ss.leave.noTypes") }}
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="row in rows"
              :key="row.code || row.leaveType"
              class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
            >
              <td class="px-5 py-3.5 md:px-6 font-medium text-neutral-800">
                {{ row.leaveType }}
              </td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-700">{{ row.entitlement }}</td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-700">{{ formatNum(row.used) }}</td>
              <td class="px-5 py-3.5 md:px-6">
                <span
                  v-if="Number(row.pending) > 0"
                  class="inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"
                >
                  {{ formatNum(row.pending) }}
                </span>
                <span v-else class="text-neutral-400">0</span>
              </td>
              <td class="px-5 py-3.5 md:px-6">
                <span
                  class="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                >
                  {{ formatNum(row.available) }}
                </span>
              </td>
              <td class="px-5 py-3.5 md:px-6">
                <div class="flex items-center gap-2">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="usageBarClass(row)"
                      :style="{ width: usagePct(row) + '%' }"
                    />
                  </div>
                  <span class="w-10 shrink-0 text-right text-xs text-neutral-500">
                    {{ usagePct(row) }}%
                  </span>
                </div>
              </td>
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

function formatNum(n) {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function usagePct(row) {
  const ent = Number(row.entitlement) || 0;
  const used = Number(row.used) || 0;
  if (ent <= 0) return 0;
  return Math.min(100, Math.round((used / ent) * 100));
}

function usageBarClass(row) {
  const p = usagePct(row);
  if (p < 45) return "bg-emerald-500";
  if (p < 80) return "bg-amber-500";
  return "bg-rose-500";
}
</script>
