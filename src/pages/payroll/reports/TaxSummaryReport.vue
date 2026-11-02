<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.reports.tax.title") }}</h1>
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
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.reports.tax.breadcrumb") }}</span>
        </nav>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-white bg-success-600 hover:bg-success-700 transition-colors"
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
        :label="t('admin.payroll.reports.tax.kpi.employees')"
        :value="loading ? '…' : String(kpi.totalEmployees)"
        :sublabel="t('admin.payroll.reports.tax.kpi.employeesHint')"
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
        :label="t('admin.payroll.reports.tax.kpi.deducted')"
        :value="loading ? '…' : formatMoney(kpi.totalTax)"
        :sublabel="t('admin.payroll.reports.tax.kpi.deductedHint')"
        value-class="text-error-600"
        icon-class="bg-error-50 text-error-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.reports.tax.kpi.avg')"
        :value="loading ? '…' : formatMoney(kpi.averageTax)"
        :sublabel="t('admin.payroll.reports.tax.kpi.avgHint')"
        value-class="text-amber-600"
        icon-class="bg-amber-100 text-amber-700"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.reports.tax.kpi.highest')"
        :value="loading ? '…' : formatMoney(kpi.highestTax)"
        :sublabel="t('admin.payroll.reports.tax.kpi.highestHint')"
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

    <!-- Graphique -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.reports.tax.chartTitle") }}</h2>
        <span class="text-sm text-neutral-500">{{ t("admin.payroll.reports.tax.chartSubtitle") }}</span>
      </div>
      <div v-if="loading" class="flex justify-center py-12">
        <span
          class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        />
      </div>
      <PayrollLineChart
        v-else
        :title="t('admin.payroll.reports.tax.chartTitle')"
        :y-axis-label="t('admin.payroll.reports.tax.yAxis')"
        :x-axis-label="t('admin.payroll.reports.tax.xAxis')"
        line-color="#ef4444"
        :labels="trend.labels"
        :values="trend.values"
        :height="300"
      />
    </div>

    <!-- Détails + filtres + tableau -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.reports.tax.detailsTitle") }}</h2>
      </div>

      <!-- Filters (collapsible) -->
      <div class="border-b border-neutral-100">
        <button
          type="button"
          class="w-full flex items-center justify-between px-5 py-3 text-left text-sm font-semibold text-neutral-800"
          @click="filtersOpen = !filtersOpen"
        >
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
              />
            </svg>
            {{ t("common.filters") }}
          </span>
          <svg
            class="w-5 h-5 text-neutral-400 transition-transform"
            :class="filtersOpen ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="filtersOpen" class="px-5 pb-5 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <PayrollFilterField :label="t('admin.payroll.filter.fromDate')">
              <input v-model="filters.fromDate" type="date" class="input-base text-sm" />
            </PayrollFilterField>
            <PayrollFilterField :label="t('admin.payroll.filter.toDate')">
              <input v-model="filters.toDate" type="date" class="input-base text-sm" />
            </PayrollFilterField>
            <PayrollFilterField :label="t('admin.payroll.filter.employee')">
              <select v-model="filters.employeeId" class="input-base text-sm">
                <option value="">{{ t("admin.payroll.filter.allEmployees") }}</option>
                <option v-for="e in employeeOptions" :key="e.id" :value="String(e.id)">
                  {{ e.name }}
                </option>
              </select>
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
              @click="applyFilters"
            >
              <span
                v-if="loading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              {{ t("common.applyFilters") }}
            </button>
            <button
              type="button"
              class="btn-outline inline-flex items-center gap-2"
              :disabled="loading"
              @click="resetFilters"
            >
              {{ t("common.reset") }}
            </button>
          </div>
        </div>
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
          <span>{{ t("common.search") }}</span>
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
        <table class="w-full text-sm min-w-[1000px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="pl-5 pr-2 py-3 font-medium uppercase text-xs tracking-wide w-12">#</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.employee") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.period") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.grossSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.taxable") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.tax") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.netPay") }}</th>
              <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right w-16">
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
                  filters.employeeId ||
                  filters.department ||
                  filters.cycle ||
                  filters.fromDate ||
                  filters.toDate
                    ? t("admin.payroll.reports.tax.emptyFiltered")
                    : t("admin.payroll.reports.tax.empty")
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-neutral-100">
            <tr
              v-for="(row, index) in paginatedRows"
              :key="row.id"
              class="transition-colors"
              :class="index % 2 === 1 ? 'bg-neutral-50/70' : 'bg-white'"
            >
              <td class="pl-5 pr-2 py-3 text-neutral-600 tabular-nums">
                {{ rangeStart + index }}
              </td>
              <td class="px-3 py-3">
                <div class="flex items-center gap-3">
                  <span
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    :style="{ backgroundColor: avatarColor(row.employeeName) }"
                  >
                    {{ initials(row.employeeName) }}
                  </span>
                  <span class="min-w-0">
                    <span class="block font-semibold text-neutral-900">{{ row.employeeName }}</span>
                    <span class="block text-xs text-neutral-500">{{ row.empCode }}</span>
                  </span>
                </div>
              </td>
              <td class="px-3 py-3 text-neutral-700">{{ row.period }}</td>
              <td class="px-3 py-3 font-medium text-neutral-900 tabular-nums">
                {{ formatMoney(row.grossSalary, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-primary-600 tabular-nums">
                {{ formatMoney(row.taxableIncome, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-error-600 tabular-nums">
                {{ formatMoney(row.taxAmount, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-success-600 tabular-nums">
                {{ formatMoney(row.netPay, row.currency) }}
              </td>
              <td class="pr-5 pl-3 py-3 text-right" @click.stop>
                <TableRowMenu
                  :open="openMenuId === row.id"
                  :aria-label="t('common.actions')"
                  width-class="w-44"
                  @toggle="toggleRowMenu(row.id)"
                  @close="openMenuId = null"
                >
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    @click="viewPayroll(row)"
                  >
                    {{ t("admin.payroll.viewDetails") }}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    @click="openMenuId = null"
                  >
                    {{ t("admin.payroll.exportLine") }}
                  </button>
                </TableRowMenu>
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
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "../../../i18n/index.js";
import PayrollKpiCard from "../../../components/payroll/PayrollKpiCard.vue";
import PayrollFilterField from "../../../components/payroll/PayrollFilterField.vue";
import PayrollLineChart from "../../../components/payroll/PayrollLineChart.vue";
import TableRowMenu from "../../../components/common/TableRowMenu.vue";
import { useTaxSummary } from "../composables/useTaxSummary.js";
import { avatarColor, initialsFromName } from "../utils/payroll-http.js";

const { t, bcp47 } = useI18n();
const router = useRouter();
const pageSizeOptions = [10, 25, 50, 100];

const {
  filteredRows,
  employeeOptions,
  departmentOptions,
  cycleOptions,
  kpi,
  trend,
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
} = useTaxSummary();

const filtersOpen = ref(true);
const openMenuId = ref(null);

function formatMoney(n, currency = "EUR") {
  return new Intl.NumberFormat(bcp47.value, {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function initials(name) {
  return initialsFromName(name);
}

function toggleRowMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function viewPayroll(row) {
  openMenuId.value = null;
  if (!row?.id) return;
  router.push({
    path: `/payroll/show/${row.id}`,
    query: { from: "tax-summary" },
  });
}

function exportPdf() {
  window.print();
}

function onDocumentClick() {
  openMenuId.value = null;
}

watch([searchQuery, filteredRows, itemsPerPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

onMounted(async () => {
  document.addEventListener("click", onDocumentClick);
  await bootstrap();
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>
