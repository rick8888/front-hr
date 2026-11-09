<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.reports.dept.title") }}</h1>
      </div>
      <div class="flex flex-col items-stretch sm:items-end gap-3">
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
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.reports.dept.breadcrumb") }}</span>
        </nav>
        <button
          type="button"
          class="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          @click="exportPdf"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
            />
          </svg>
          {{ t("admin.payroll.exportPdf") }}
        </button>
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
        :label="t('admin.payroll.reports.dept.kpi.departments')"
        :value="loading ? '…' : String(kpi.totalDepartments)"
        :sublabel="t('admin.payroll.reports.dept.kpi.departmentsHint')"
        icon-class="bg-secondary-100 text-secondary-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.reports.dept.kpi.employees')"
        :value="loading ? '…' : String(kpi.totalEmployees)"
        :sublabel="t('admin.payroll.reports.dept.kpi.employeesHint')"
        icon-class="bg-sky-100 text-sky-600"
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
        :label="t('admin.payroll.reports.dept.kpi.payroll')"
        :value="loading ? '…' : formatCurrencyGroups(kpi.totalPayrollByCurrency)"
        :sublabel="t('admin.payroll.reports.dept.kpi.payrollHint')"
        value-class="text-success-600"
        icon-class="bg-success-50 text-success-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.reports.dept.kpi.avg')"
        :value="loading ? '…' : formatCurrencyGroups(kpi.averagePerEmployeeByCurrency)"
        :sublabel="t('admin.payroll.reports.dept.kpi.avgHint')"
        value-class="text-amber-600"
        icon-class="bg-amber-100 text-amber-700"
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

    <!-- Filtres -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
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
      <div class="px-5 py-4 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PayrollFilterField :label="t('admin.payroll.filter.startDate')">
            <input v-model="filters.startDate" type="date" class="input-base text-sm" />
          </PayrollFilterField>
          <PayrollFilterField :label="t('admin.payroll.filter.endDate')">
            <input v-model="filters.endDate" type="date" class="input-base text-sm" />
          </PayrollFilterField>
          <PayrollFilterField :label="t('common.department')">
            <select v-model="filters.department" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allDepartments") }}</option>
              <option v-for="d in departmentOptions" :key="d" :value="d">{{ d }}</option>
            </select>
          </PayrollFilterField>
          <PayrollFilterField :label="t('admin.payroll.filter.cycle')">
            <select v-model="filters.cycle" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allCycles") }}</option>
              <option v-for="c in cycleOptions" :key="c.value || c" :value="c.value || c">{{ c.label || c }}</option>
            </select>
          </PayrollFilterField>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="btn-secondary inline-flex items-center gap-2"
            :disabled="loading"
            @click="onApplyFilters"
          >
            <span
              v-if="loading"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden="true"
            />
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
              />
            </svg>
            {{ t("common.applyFilters") }}
          </button>
          <button
            type="button"
            class="btn-outline inline-flex items-center gap-2"
            :disabled="loading"
            @click="onResetFilters"
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
    </div>

    <!-- Graphique -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6">
      <div class="flex items-center justify-between gap-3 mb-2">
        <h2 class="flex items-center gap-2 text-base font-semibold text-neutral-900">
          <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {{ t("admin.payroll.reports.dept.chartTitle") }}
        </h2>
        <button
          type="button"
          class="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
          :aria-label="t('admin.payroll.reports.dept.chartOptions')"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
      <div v-if="loading" class="flex justify-center py-12">
        <span
          class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        />
      </div>
      <p
        v-else-if="hasMixedCurrencies"
        class="py-12 text-center text-sm text-neutral-500"
      >
        {{ t("admin.payroll.dashboard.chart.multiCurrencyHint") }}
      </p>
      <PayrollDepartmentBarChart
        v-else
        :title="t('admin.payroll.reports.dept.chartTitle')"
        :labels="chartLabels"
        :gross="chartGross"
        :net="chartNet"
      />
    </div>

    <!-- Tableau -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M3 14h18M3 6h18M3 18h18"
            />
          </svg>
          {{ t("admin.payroll.reports.dept.tableTitle") }}
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
          <span>{{ t("common.search") }}:</span>
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('common.search')"
            class="w-40 sm:w-56 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
          />
        </div>
      </div>

      <div class="overflow-x-auto relative" :class="{ 'min-h-[160px]': loading }">
        <div
          v-if="loading"
          class="absolute inset-0 z-[1] flex items-center justify-center bg-white/70"
          aria-busy="true"
        >
          <span
            class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
          />
        </div>
        <table class="w-full text-sm min-w-[960px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="pl-5 pr-2 py-3 font-medium uppercase text-xs tracking-wide w-12">#</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("common.department") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.reports.dept.col.employees") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.reports.dept.col.gross") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.reports.dept.col.deductions") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.reports.dept.col.net") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.reports.dept.col.avg") }}</th>
              <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right">
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading && filteredRows.length === 0">
            <tr>
              <td
                colspan="8"
                class="px-5 py-10 text-center text-sm text-neutral-500"
              >
                {{
                  searchQuery.trim() ||
                  filters.department ||
                  filters.cycle ||
                  filters.startDate ||
                  filters.endDate
                    ? t("admin.payroll.reports.dept.emptyFiltered")
                    : t("admin.payroll.reports.dept.empty")
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-neutral-100">
            <tr
              v-for="(row, index) in paginatedRows"
              :key="row.id"
              class="hover:bg-neutral-50/80 transition-colors"
            >
              <td class="pl-5 pr-2 py-3 text-neutral-600 tabular-nums">
                {{ rangeStart + index }}
              </td>
              <td class="px-3 py-3 font-semibold text-neutral-900">{{ row.department }}</td>
              <td class="px-3 py-3 text-neutral-700 tabular-nums">{{ row.employees }}</td>
              <td class="px-3 py-3 font-medium text-primary-600 tabular-nums">
                {{ formatMoney(row.totalGross, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-error-600 tabular-nums">
                {{ formatMoney(row.totalDeductions, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-success-600 tabular-nums">
                {{ formatMoney(row.totalNet, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-amber-600 tabular-nums">
                {{ formatMoney(row.averageSalary, row.currency) }}
              </td>
              <td class="pr-5 pl-3 py-3 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white bg-secondary-500 hover:bg-secondary-600 transition-colors"
                  @click="viewDetails(row)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {{ t("admin.payroll.viewDetails") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="filteredRows.length > 0"
        class="px-5 py-4 border-t border-neutral-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-600"
      >
        <span>
          {{ t("common.showingEntries", { from: rangeStart, to: rangeEnd, total: filteredRows.length }) }}
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
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "../../../i18n/index.js";
import PayrollKpiCard from "../../../components/payroll/PayrollKpiCard.vue";
import PayrollFilterField from "../../../components/payroll/PayrollFilterField.vue";
import PayrollDepartmentBarChart from "../../../components/payroll/PayrollDepartmentBarChart.vue";
import { useDepartmentSummary } from "../composables/useDepartmentSummary.js";

const { t, bcp47 } = useI18n();
const route = useRoute();
const router = useRouter();
const pageSizeOptions = [10, 25, 50, 100];

const {
  filteredRows,
  departmentOptions,
  cycleOptions,
  kpi,
  hasMixedCurrencies,
  chartLabels,
  chartGross,
  chartNet,
  loading,
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
  applyFilters,
  resetFilters,
  setDepartmentFilter,
  fetchSummary,
} = useDepartmentSummary();

let bootstrapped = false;

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

function syncDepartmentQuery(department) {
  const query = { ...route.query };
  if (department) query.department = department;
  else delete query.department;
  router.replace({ path: route.path, query });
}

async function onApplyFilters() {
  await applyFilters();
  syncDepartmentQuery(filters.value.department);
}

async function onResetFilters() {
  await resetFilters();
  router.replace({ path: route.path, query: {} });
}

/** Drill-down : refiltre par département + recharge l’API */
async function viewDetails(row) {
  if (!row?.department) return;
  setDepartmentFilter(row.department);
  syncDepartmentQuery(row.department);
  await fetchSummary();
}

function exportPdf() {
  window.print();
}

watch(
  () => route.query.department,
  async (department, prev) => {
    if (!bootstrapped) return;
    const dept = Array.isArray(department) ? department[0] : department || "";
    const prevDept = Array.isArray(prev) ? prev[0] : prev || "";
    if (String(dept) === String(prevDept || "")) return;
    setDepartmentFilter(dept);
    await fetchSummary();
  }
);

watch([searchQuery, filteredRows, itemsPerPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

onMounted(async () => {
  const dept = route.query.department;
  if (dept) {
    setDepartmentFilter(Array.isArray(dept) ? dept[0] : String(dept));
  }
  await bootstrap();
  bootstrapped = true;
});
</script>
