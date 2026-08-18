<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.reports.history.title") }}</h1>
      </div>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="inline-flex items-center gap-1 hover:text-secondary-600">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z"
            />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span>
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/reports/payroll-register" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.reports") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.payroll.reports.history.breadcrumb") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <!-- Select Employee -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6 overflow-visible relative z-10">
      <h2 class="flex items-center gap-2 text-base font-semibold text-neutral-900 mb-4">
        <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {{ t("admin.payroll.reports.history.selectEmployee") }}
      </h2>
      <EmployeeSearchSelect
        v-model="selectedEmployeeId"
        :options="employees"
        :label="t('common.employee')"
        required
        :placeholder="t('admin.payroll.reports.history.searchPlaceholder')"
        :hint="t('admin.payroll.reports.history.hint')"
        @change="onEmployeeChange"
      />
      <p v-if="loadingEmployees" class="mt-3 text-sm text-neutral-500">{{ t("admin.payroll.reports.history.loadingEmployees") }}</p>
    </section>

    <!-- Contenu dépendant de la sélection -->
    <template v-if="selectedEmployee">
      <!-- Profil -->
      <section class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
            :style="{ backgroundColor: avatarColor(selectedEmployee.name) }"
          >
            {{ initials(selectedEmployee.name) }}
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 flex-1 min-w-0 text-sm">
            <div>
              <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ t("admin.payroll.reports.history.col.name") }}</p>
              <p class="mt-0.5 font-semibold text-neutral-900">{{ selectedEmployee.name }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ t("admin.payroll.reports.history.col.empId") }}</p>
              <p class="mt-0.5 font-medium text-neutral-800 font-mono">{{ selectedEmployee.empCode }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ t("admin.payroll.reports.history.col.department") }}</p>
              <p class="mt-0.5 font-medium text-neutral-800">{{ selectedEmployee.department }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ t("admin.payroll.reports.history.col.designation") }}</p>
              <p class="mt-0.5 font-medium text-neutral-800">{{ selectedEmployee.designation }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ t("admin.payroll.reports.history.col.joinDate") }}</p>
              <p class="mt-0.5 font-medium text-neutral-800">{{ selectedEmployee.joinDate }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- KPI -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PayrollKpiCard
          :label="t('admin.payroll.reports.history.kpi.records')"
          :value="loadingHistory ? '…' : String(kpi.totalRecords)"
          :sublabel="t('admin.payroll.reports.history.kpi.recordsHint')"
          icon-class="bg-secondary-100 text-secondary-600"
        >
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </template>
        </PayrollKpiCard>
        <PayrollKpiCard
          :label="t('admin.payroll.reports.history.kpi.earned')"
          :value="loadingHistory ? '…' : formatMoney(kpi.totalEarned)"
          :sublabel="t('admin.payroll.reports.history.kpi.earnedHint')"
          value-class="text-success-600"
          icon-class="bg-success-50 text-success-600"
        >
          <template #icon>
            <span class="text-lg font-bold">$</span>
          </template>
        </PayrollKpiCard>
        <PayrollKpiCard
          :label="t('admin.payroll.reports.history.kpi.deductions')"
          :value="loadingHistory ? '…' : formatMoney(kpi.totalDeductions)"
          :sublabel="t('admin.payroll.reports.history.kpi.deductionsHint')"
          value-class="text-error-600"
          icon-class="bg-error-50 text-error-600"
        >
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </template>
        </PayrollKpiCard>
        <PayrollKpiCard
          :label="t('admin.payroll.reports.history.kpi.avgNet')"
          :value="loadingHistory ? '…' : formatMoney(kpi.averageNetPay)"
          :sublabel="t('admin.payroll.reports.history.kpi.avgNetHint')"
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

      <!-- Salary Trend -->
      <section class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6">
        <h2 class="flex items-center gap-2 text-base font-semibold text-neutral-900 mb-4">
          <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          {{ t("admin.payroll.reports.history.chartTitle") }}
        </h2>
        <div
          v-if="loadingHistory"
          class="flex items-center justify-center h-[280px] text-sm text-neutral-500"
        >
          {{ t("admin.payroll.reports.history.loadingTrend") }}
        </div>
        <PayrollLineChart
          v-else
          :title="t('admin.payroll.reports.history.chartTitle')"
          line-color="#5b99f5"
          :labels="trend.labels"
          :values="trend.values"
          :height="280"
        />
      </section>

      <!-- Filters -->
      <section class="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div class="px-5 py-4 border-b border-neutral-100">
          <h2 class="flex items-center gap-2 text-base font-semibold text-neutral-900">
            <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
              />
            </svg>
            {{ t("common.filters") }}
          </h2>
        </div>
        <div class="px-5 py-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
          <PayrollFilterField :label="t('admin.payroll.filter.dateRange')" class="min-w-[200px]">
            <input v-model="filters.dateRange" type="month" class="input-base text-sm" />
          </PayrollFilterField>
          <PayrollFilterField :label="t('common.status')" class="min-w-[180px]">
            <select v-model="filters.status" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allStatuses") }}</option>
              <option value="pending">{{ t("admin.payroll.status.pending") }}</option>
              <option value="approved">{{ t("admin.payroll.status.approved") }}</option>
              <option value="paid">{{ t("admin.payroll.status.paid") }}</option>
            </select>
          </PayrollFilterField>
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="btn-secondary inline-flex items-center gap-2"
              :disabled="loadingHistory"
              @click="applyFilters"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
                />
              </svg>
              {{ t("admin.payroll.reports.history.applyFilter") }}
            </button>
            <button
              type="button"
              class="btn-outline inline-flex items-center gap-2"
              :disabled="loadingHistory"
              @click="resetFilters"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ t("common.reset") }}
            </button>
          </div>
        </div>
      </section>

      <!-- Payslip History table -->
      <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-neutral-200">
          <h2 class="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t("admin.payroll.reports.history.tableTitle") }}
          </h2>
        </div>
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 py-3 border-b border-neutral-100"
        >
          <div class="flex items-center gap-2 text-sm text-neutral-600">
            <span>{{ t("common.show") }}</span>
            <select
              v-model.number="itemsPerPage"
              class="input-base py-1.5 w-auto text-sm"
              @change="currentPage = 1"
            >
              <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
            </select>
            <span>{{ t("common.entries") }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-600">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('common.search')"
              class="w-40 sm:w-56 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
            />
          </div>
        </div>

        <div class="overflow-x-auto relative">
          <div
            v-if="loadingHistory"
            class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm text-neutral-600"
          >
            {{ t("admin.payroll.reports.history.loadingPayslips") }}
          </div>
          <table class="w-full text-sm min-w-[1040px]">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
                <th class="pl-5 pr-2 py-3 font-medium uppercase text-xs tracking-wide w-12">#</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.period") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.cycle") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.grossSalary") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.allowances") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.deductions") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.tax") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.netSalary") }}</th>
                <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.status") }}</th>
                <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right">
                  {{ t("common.actions") }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-if="!loadingHistory && !paginatedRows.length">
                <td colspan="10" class="px-5 py-10 text-center text-neutral-500">
                  {{ t("admin.payroll.reports.history.empty") }}
                </td>
              </tr>
              <tr
                v-for="(row, index) in paginatedRows"
                :key="row.id"
                class="hover:bg-neutral-50/80 transition-colors"
              >
                <td class="pl-5 pr-2 py-3 text-neutral-600 tabular-nums">
                  {{ rangeStart + index }}
                </td>
                <td class="px-3 py-3 text-neutral-800">{{ row.period }}</td>
                <td class="px-3 py-3 text-neutral-700">{{ row.cycle }}</td>
                <td class="px-3 py-3 font-medium tabular-nums">{{ formatMoney(row.grossSalary) }}</td>
                <td class="px-3 py-3 text-success-600 font-medium tabular-nums">
                  {{ formatMoney(row.allowances) }}
                </td>
                <td class="px-3 py-3 text-error-600 font-medium tabular-nums">
                  {{ formatMoney(row.deductions) }}
                </td>
                <td class="px-3 py-3 text-error-600 font-medium tabular-nums">
                  {{ formatMoney(row.tax) }}
                </td>
                <td class="px-3 py-3 text-primary-600 font-semibold tabular-nums">
                  {{ formatMoney(row.netSalary) }}
                </td>
                <td class="px-3 py-3">
                  <span
                    :class="[
                      'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                      statusBadgeClass(row.status),
                    ]"
                  >
                    {{ statusLabel(row.status) }}
                  </span>
                </td>
                <td class="pr-5 pl-3 py-3 text-right">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white bg-secondary-500 hover:bg-secondary-600"
                    @click="viewPayslip(row)"
                  >
                    {{ t("common.view") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="px-5 py-4 border-t border-neutral-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-600"
        >
          <span>
            {{ t("common.showingEntries", { from: filteredRows.length ? rangeStart : 0, to: rangeEnd, total: filteredRows.length }) }}
          </span>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg border border-neutral-300 text-sm disabled:opacity-40"
              :disabled="currentPage <= 1"
              @click="currentPage--"
            >
              {{ t("common.previous") }}
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              type="button"
              class="min-w-[2.25rem] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="
                currentPage === page
                  ? 'bg-secondary-600 text-white'
                  : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              "
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg border border-neutral-300 text-sm disabled:opacity-40"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              {{ t("common.next") }}
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "../../../i18n/index.js";
import PayrollKpiCard from "../../../components/payroll/PayrollKpiCard.vue";
import PayrollFilterField from "../../../components/payroll/PayrollFilterField.vue";
import PayrollLineChart from "../../../components/payroll/PayrollLineChart.vue";
import EmployeeSearchSelect from "../../../components/payroll/EmployeeSearchSelect.vue";
import { useEmployeeHistory } from "../composables/useEmployeeHistory.js";
import { PAYROLL_STATUS_UI } from "../mappers/payroll-record.mapper.js";

const { t, bcp47 } = useI18n();
const router = useRouter();
const pageSizeOptions = [10, 25, 50, 100];

const {
  employees,
  selectedEmployeeId,
  selectedEmployee,
  filteredRows,
  kpi,
  trend,
  loadingEmployees,
  loadingHistory,
  error,
  filters,
  searchQuery,
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedRows,
  rangeStart,
  rangeEnd,
  visiblePages,
  bootstrap,
  onEmployeeChange,
  applyFilters,
  resetFilters,
} = useEmployeeHistory();

onMounted(() => {
  bootstrap();
});

function formatMoney(n) {
  return new Intl.NumberFormat(bcp47.value, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function statusLabel(key) {
  return t(`admin.payroll.status.${key}`);
}

function statusBadgeClass(key) {
  return PAYROLL_STATUS_UI[key]?.badge ?? "bg-neutral-100 text-neutral-700";
}

function initials(name) {
  if (!name) return "??";
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(name) {
  const colors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#059669", "#d97706", "#7c3aed", "#ec4899"];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
}

function viewPayslip(row) {
  router.push({ path: `/payroll/show/${row.id}`, query: { from: "employee-history" } });
}
</script>
