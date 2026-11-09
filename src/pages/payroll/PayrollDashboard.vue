<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.dashboard.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">{{ t("admin.payroll.dashboard.subtitle") }}</p>
      </div>
      <div class="flex flex-col items-stretch sm:items-end gap-3">
        <nav
          class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
          aria-label="Breadcrumb"
        >
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.breadcrumb.dashboard") }}</span>
        </nav>
        <RouterLink
          to="/payroll/records"
          class="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          {{ t("admin.payroll.dashboard.viewAll") }}
        </RouterLink>
      </div>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <!-- KPI -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <PayrollKpiCard
        :label="t('admin.payroll.dashboard.kpi.employees')"
        :value="loading ? '…' : String(kpi.employees)"
        :sublabel="t('admin.payroll.dashboard.kpi.employeesHint')"
        icon-class="bg-secondary-100 text-secondary-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.dashboard.kpi.pending')"
        :value="loading ? '…' : String(kpi.pending)"
        :sublabel="t('admin.payroll.dashboard.kpi.pendingHint')"
        value-class="text-amber-600"
        icon-class="bg-amber-100 text-amber-700"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.dashboard.kpi.paymentThisMonth')"
        :value="loading ? '…' : formatCurrencyGroups(kpi.paymentThisMonthByCurrency)"
        :sublabel="t('admin.payroll.dashboard.kpi.paymentThisMonthHint')"
        value-class="text-secondary-600"
        icon-class="bg-secondary-100 text-secondary-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m8-4a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.dashboard.kpi.avgSalary')"
        :value="loading ? '…' : formatCurrencyGroups(kpi.avgSalaryByCurrency)"
        :sublabel="t('admin.payroll.dashboard.kpi.avgSalaryHint')"
        value-class="text-primary-600"
        icon-class="bg-primary-100 text-primary-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </template>
      </PayrollKpiCard>
    </div>

    <!-- Graphiques -->
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 class="text-base font-semibold text-neutral-900 mb-4">{{ t("admin.payroll.dashboard.chart.trend") }}</h2>
        <p v-if="!hasMixedCurrencies" class="-mt-2 mb-3 text-xs text-neutral-500">{{ trendCurrency }}</p>
        <div
          v-if="loading"
          class="flex h-[220px] sm:h-[260px] items-center justify-center text-sm text-neutral-500"
        >
          {{ t("common.loading") }}
        </div>
        <p
          v-else-if="hasMixedCurrencies"
          class="flex h-[220px] sm:h-[260px] items-center justify-center text-sm text-neutral-500 text-center"
        >
          {{ t("admin.payroll.dashboard.chart.multiCurrencyHint") }}
        </p>
        <PayrollTrendChart
          v-else
          :title="t('admin.payroll.dashboard.chart.trend')"
          :labels="trend.labels"
          :gross="trend.gross"
          :net="trend.net"
        />
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 class="text-base font-semibold text-neutral-900 mb-4 text-center">
          {{ t("admin.payroll.dashboard.chart.statusDistribution") }}
        </h2>
        <div
          v-if="loading"
          class="flex h-48 items-center justify-center text-sm text-neutral-500"
        >
          {{ t("common.loading") }}
        </div>
        <PayrollStatusDonut
          v-else
          :segments="statusSegments"
          :center-value="kpi.totalStatuses"
          :center-caption="t('admin.payroll.dashboard.chart.statuses')"
        />
      </div>
    </div>

    <!-- Paies récentes -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <span class="text-neutral-400" aria-hidden="true">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <h2 class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.dashboard.recent.title") }}</h2>
        </div>
        <RouterLink
          to="/payroll/records"
          class="text-sm font-medium text-secondary-600 hover:text-secondary-700"
        >
          {{ t("admin.payroll.dashboard.recent.viewAll") }}
        </RouterLink>
      </div>
      <div class="overflow-x-auto relative">
        <div
          v-if="loading"
          class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm text-neutral-600"
        >
          {{ t("admin.payroll.dashboard.recent.loading") }}
        </div>
        <table class="w-full text-sm min-w-[720px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="pl-5 pr-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.employee") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.period") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.grossSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.netSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.status") }}</th>
              <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right w-14">
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="!loading && !recentPayrolls.length">
              <td colspan="6" class="px-5 py-10 text-center text-neutral-500">
                {{ t("admin.payroll.dashboard.recent.empty") }}
              </td>
            </tr>
            <tr
              v-for="row in recentPayrolls"
              :key="row.id"
              class="hover:bg-neutral-50/80 transition-colors"
            >
              <td class="pl-5 pr-3 py-3">
                <div class="flex items-center gap-3">
                  <EmployeeAvatar
                    :name="row.name"
                    :avatar-url="row.avatarUrl"
                    size-class="h-10 w-10 text-xs font-semibold"
                    fallback-class="text-white"
                    :style="{ backgroundColor: avatarColor(row.name) }"
                  />
                  <div class="min-w-0">
                    <p class="font-semibold text-neutral-900 truncate">{{ row.name }}</p>
                    <p class="text-xs text-neutral-500">{{ row.code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-3 py-3 text-neutral-700">{{ row.period }}</td>
              <td class="px-3 py-3 font-medium text-primary-600 tabular-nums">
                {{ formatMoney(row.gross, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-success-700 tabular-nums">
                {{ formatMoney(row.net, row.currency) }}
              </td>
              <td class="px-3 py-3">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="statusBadge(row.status)"
                >
                  {{ statusLabel(row.status) }}
                </span>
              </td>
              <td class="pr-5 pl-3 py-3 text-right relative" @click.stop>
                <button
                  type="button"
                  class="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
                  :aria-label="t('common.actions')"
                  @click.stop="toggleMenu(row.id)"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                    />
                  </svg>
                </button>
                <div
                  v-if="openMenuId === row.id"
                  class="absolute right-4 top-full mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-left z-20"
                  @click.stop
                >
                  <RouterLink
                    :to="`/payroll/show/${row.id}`"
                    class="block px-3 py-2 text-sm hover:bg-neutral-50"
                    @click="openMenuId = null"
                  >
                    {{ t("admin.payroll.dashboard.recent.viewSlip") }}
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "../../i18n/index.js";
import PayrollKpiCard from "../../components/payroll/PayrollKpiCard.vue";
import PayrollTrendChart from "../../components/payroll/PayrollTrendChart.vue";
import PayrollStatusDonut from "../../components/payroll/PayrollStatusDonut.vue";
import EmployeeAvatar from "../../components/common/EmployeeAvatar.vue";
import { usePayrollDashboard } from "./composables/usePayrollDashboard.js";
import { PAYROLL_STATUS_UI } from "./mappers/payroll-record.mapper.js";

const { t, bcp47 } = useI18n();

const {
  kpi,
  trend,
  statusSegments,
  recentPayrolls,
  hasMixedCurrencies,
  trendCurrency,
  loading,
  error,
  bootstrap,
} = usePayrollDashboard();

const openMenuId = ref(null);

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function onDocClick() {
  openMenuId.value = null;
}

onMounted(() => {
  document.addEventListener("click", onDocClick);
  bootstrap();
});

onUnmounted(() => document.removeEventListener("click", onDocClick));

function formatMoney(n, currency = "EUR") {
  return new Intl.NumberFormat(bcp47.value, {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function formatCurrencyGroups(groups = []) {
  return groups.length
    ? groups.map(({ currency, amount }) => formatMoney(amount, currency)).join(" · ")
    : "—";
}

function avatarColor(name) {
  const colors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#059669", "#d97706", "#7c3aed", "#ec4899"];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
}

const STATUS_BADGE = {
  pending: "bg-amber-500 text-white",
  approved: "bg-sky-400 text-white",
  paid: "bg-success-600 text-white",
  cancelled: "bg-red-500 text-white",
};

function statusLabel(key) {
  return t(`admin.payroll.status.${key}`);
}

function statusBadge(key) {
  return STATUS_BADGE[key] ?? PAYROLL_STATUS_UI[key]?.badge ?? "bg-neutral-200 text-neutral-800";
}
</script>
