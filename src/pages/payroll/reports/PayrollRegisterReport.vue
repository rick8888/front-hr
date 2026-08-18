<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.reports.register.title") }}</h1>
      </div>
      <div class="flex flex-col items-stretch sm:items-end gap-3">
        <nav
          class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
          :aria-label="t('common.breadcrumb')"
        >
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/reports/payroll-register" class="hover:text-secondary-600">
            {{ t("admin.payroll.breadcrumb.reports") }}
          </RouterLink>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.reports.register.breadcrumb") }}</span>
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
        :label="t('admin.payroll.reports.register.kpi.records')"
        :value="loading ? '…' : String(kpi.totalRecords)"
        icon-class="bg-sky-100 text-sky-600"
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
        :label="t('admin.payroll.reports.register.kpi.gross')"
        :value="loading ? '…' : formatMoney(kpi.totalGross)"
        icon-class="bg-cyan-100 text-cyan-700"
      >
        <template #icon>
          <span class="text-lg font-bold">$</span>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.reports.register.kpi.deductions')"
        :value="loading ? '…' : formatMoney(kpi.totalDeductions)"
        value-class="text-error-600"
        icon-class="bg-error-100 text-error-600"
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
        :label="t('admin.payroll.reports.register.kpi.net')"
        :value="loading ? '…' : formatMoney(kpi.totalNet)"
        value-class="text-green-700"
        icon-class="bg-green-100 text-green-700"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
    </div>

    <!-- Filtres -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        class="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-neutral-900"
        @click="filtersOpen = !filtersOpen"
      >
        <span>{{ t("common.filters") }}</span>
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
      <div v-show="filtersOpen" class="px-5 pb-5 border-t border-neutral-100 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          <PayrollFilterField :label="t('admin.payroll.filter.dateRange')">
            <select v-model="filters.dateRange" class="input-base text-sm">
              <option value="all">{{ t("admin.payroll.filter.selectDateRange") }}</option>
              <option value="month">{{ t("admin.payroll.filter.thisMonth") }}</option>
              <option value="lastMonth">{{ t("admin.payroll.filter.lastMonth") }}</option>
              <option value="quarter">{{ t("admin.payroll.filter.thisQuarter") }}</option>
            </select>
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
          <PayrollFilterField :label="t('common.status')">
            <select v-model="filters.status" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allStatuses") }}</option>
              <option value="pending">{{ t("admin.payroll.status.pending") }}</option>
              <option value="approved">{{ t("admin.payroll.status.approved") }}</option>
              <option value="paid">{{ t("admin.payroll.status.paid") }}</option>
            </select>
          </PayrollFilterField>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <PayrollFilterField :label="t('admin.payroll.filter.cycle')">
            <select v-model="filters.cycle" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allCycles") }}</option>
              <option v-for="c in cycleOptions" :key="c.value || c" :value="c.value || c">{{ c.label || c }}</option>
            </select>
          </PayrollFilterField>
          <PayrollFilterField :label="t('admin.payroll.filter.period')">
            <select v-model="filters.period" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allPeriods") }}</option>
              <option v-for="p in periodOptions" :key="p.value" :value="p.value">
                {{ p.label }}
              </option>
            </select>
          </PayrollFilterField>
          <div class="flex flex-wrap items-center gap-2 sm:col-span-2">
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
              {{ t("admin.payroll.filter.apply") }}
            </button>
            <button
              type="button"
              class="p-2.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
              :title="t('common.resetFilters')"
              :disabled="loading"
              @click="resetFilters"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
            {{ t("admin.payroll.filter.quick") }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="qf in quickFilters"
              :key="qf.key"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
              :class="[
                qf.classes,
                activeQuick === qf.key ? 'ring-2 ring-offset-1 ring-secondary-400' : '',
              ]"
              @click="applyQuickFilter(qf.key)"
            >
              {{ qf.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.reports.register.recordsTitle") }}</h2>
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

      <div class="overflow-x-auto relative" :class="{ 'min-h-[200px]': loading }">
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
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.cycle") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.grossSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.deductions") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.netPay") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.status") }}</th>
              <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right w-16">
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading && records.length === 0">
            <tr>
              <td
                colspan="9"
                class="px-5 py-10 text-center text-sm text-neutral-500"
              >
                {{
                  searchQuery.trim() ||
                  filters.status ||
                  filters.employeeId ||
                  filters.department ||
                  filters.period ||
                  filters.cycle ||
                  (filters.dateRange && filters.dateRange !== "all")
                    ? t("admin.payroll.reports.register.emptyFiltered")
                    : t("admin.payroll.reports.register.empty")
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
              <td class="px-3 py-3 text-neutral-700">{{ cycleLabel(row.cycle) }}</td>
              <td class="px-3 py-3 font-medium text-primary-600 tabular-nums">
                {{ formatMoney(row.grossSalary, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-error-600 tabular-nums">
                {{ formatMoney(row.deductions, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-green-700 tabular-nums">
                {{ formatMoney(row.netPay, row.currency) }}
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
              <td class="pr-5 pl-3 py-3 text-right relative" @click.stop>
                <button
                  type="button"
                  class="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
                  :aria-label="t('common.actions')"
                  @click="toggleRowMenu(row.id)"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                    />
                  </svg>
                </button>
                <div
                  v-if="openMenuId === row.id"
                  class="absolute right-4 top-full z-10 mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-left"
                  @click.stop
                >
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    @click="viewRow(row)"
                  >
                    {{ t("admin.payroll.viewDetails") }}
                  </button>
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    @click="openMenuId = null"
                  >
                    {{ t("admin.payroll.exportLine") }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="records.length > 0"
        class="px-5 py-4 border-t border-neutral-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-600"
      >
        <span>
          {{ t("common.showingEntries", { from: rangeStart, to: rangeEnd, total: records.length }) }}
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "../../../i18n/index.js";
import PayrollKpiCard from "../../../components/payroll/PayrollKpiCard.vue";
import PayrollFilterField from "../../../components/payroll/PayrollFilterField.vue";
import { usePayrollRegister } from "../composables/usePayrollRegister.js";
import { avatarColor, initialsFromName } from "../utils/payroll-http.js";

const { t, bcp47 } = useI18n();
const router = useRouter();

const pageSizeOptions = [10, 25, 50, 100];
const quickFilters = computed(() => [
  { key: "pending", label: t("admin.payroll.status.pending"), classes: "border-amber-300 text-amber-800 hover:bg-amber-50" },
  {
    key: "approved",
    label: t("admin.payroll.status.approved"),
    classes: "border-green-300 text-green-800 hover:bg-green-50",
  },
  { key: "paid", label: t("admin.payroll.status.paid"), classes: "border-cyan-300 text-cyan-800 hover:bg-cyan-50" },
  {
    key: "thisMonth",
    label: t("admin.payroll.filter.thisMonth"),
    classes: "border-sky-300 text-sky-800 hover:bg-sky-50",
  },
  {
    key: "lastMonth",
    label: t("admin.payroll.filter.lastMonth"),
    classes: "border-neutral-300 text-neutral-700 hover:bg-neutral-50",
  },
]);

const {
  records,
  employeeOptions,
  departmentOptions,
  cycleOptions,
  periodOptions,
  kpi,
  loading,
  error,
  filters,
  searchQuery,
  currentPage,
  itemsPerPage,
  activeQuick,
  totalPages,
  paginatedRows,
  rangeStart,
  rangeEnd,
  visiblePages,
  bootstrap,
  applyFilters,
  resetFilters,
  applyQuickFilter,
  setSearchAndReload,
  statusBadgeClass,
  cycleLabel,
} = usePayrollRegister();

const filtersOpen = ref(true);
const openMenuId = ref(null);

let searchDebounce = null;

function initials(name) {
  return initialsFromName(name);
}

function formatMoney(n, currency = "EUR") {
  return new Intl.NumberFormat(bcp47.value, {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function statusLabel(key) {
  return t(`admin.payroll.status.${key}`);
}

function toggleRowMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function viewRow(row) {
  openMenuId.value = null;
  if (!row?.id) return;
  router.push({
    path: `/payroll/show/${row.id}`,
    query: { from: "register" },
  });
}

function exportPdf() {
  window.print();
}

function onDocumentClick() {
  openMenuId.value = null;
}

watch(searchQuery, (q) => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    setSearchAndReload(q);
  }, 350);
});

watch([totalPages, itemsPerPage], () => {
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
  if (searchDebounce) clearTimeout(searchDebounce);
});
</script>
