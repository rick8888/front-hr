<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHero :title="t('ss.leaveBalance.title')" :breadcrumbs="breadcrumbs" />

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <!-- KPI row -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SelfServiceKpiCard
          :title="t('ss.kpi.totalEntitlement')"
          :value="summary.totalEntitlement"
          :suffix="t('common.days')"
          icon="calendar"
          tone="info"
          :colorize-value="false"
          :loading="loading"
        />
        <SelfServiceKpiCard
          :title="t('ss.kpi.usedLeaves')"
          :value="formatDecimal(summary.usedLeaves)"
          :suffix="t('common.days')"
          icon="calendar"
          tone="danger"
          :loading="loading"
        />
        <SelfServiceKpiCard
          :title="t('ss.kpi.pendingApproval')"
          :value="formatDecimal(summary.pendingApproval)"
          :suffix="t('common.days')"
          icon="clock"
          tone="warning"
          :loading="loading"
        />
        <SelfServiceKpiCard
          :title="t('ss.kpi.availableBalance')"
          :value="formatDecimal(summary.availableBalance)"
          :suffix="t('common.days')"
          icon="check"
          tone="success"
          :loading="loading"
        />
      </section>

      <!-- Middle: table + sidebar -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div class="xl:col-span-2 space-y-6">
          <LeaveBalanceByTypeTable :rows="byType" :loading="loading" />
        </div>
        <div class="space-y-6">
          <LeaveBalanceGroupedBarChart
            :rows="chartRows"
            :max-days="chartMaxDays"
          />
          <UpcomingLeavesCard :items="upcoming" :loading="loading" />
        </div>
      </div>

      <!-- Bottom history -->
      <RecentLeaveHistoryTable :rows="recentHistory" :loading="loading" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SelfServiceKpiCard from "../../components/self-service/SelfServiceKpiCard.vue";
import LeaveBalanceByTypeTable from "../../components/self-service/LeaveBalanceByTypeTable.vue";
import LeaveBalanceGroupedBarChart from "../../components/self-service/LeaveBalanceGroupedBarChart.vue";
import UpcomingLeavesCard from "../../components/self-service/UpcomingLeavesCard.vue";
import RecentLeaveHistoryTable from "../../components/self-service/RecentLeaveHistoryTable.vue";
import { useMyLeaveBalance } from "./composables/useMyLeaveBalance.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.leaveBalance.title") },
  ];
});
const {
  loading,
  error,
  summary,
  byType,
  chartRows,
  chartMaxDays,
  upcoming,
  recentHistory,
} = useMyLeaveBalance();

function formatDecimal(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return String(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}
</script>
