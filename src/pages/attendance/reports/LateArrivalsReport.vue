<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.reports.late.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/" class="inline-flex items-center gap-1 hover:text-secondary-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z" />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span><RouterLink to="/attendance" class="hover:text-secondary-600">{{ t("admin.attendance.breadcrumb") }}</RouterLink>
        <span>/</span><span class="text-neutral-800 font-medium">{{ t("admin.attendance.reports.late.title") }}</span>
      </nav>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <!-- Filters -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 mb-5">
      <h2 class="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 mb-4">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
        </svg>
        {{ t("common.filters") }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div class="md:col-span-2 min-w-0">
          <label class="block text-xs font-medium text-neutral-600 mb-1">
            {{ t("admin.attendance.reports.dateRange") }} <span class="text-error-600">*</span>
          </label>
          <div class="flex items-center gap-2 min-w-0">
            <input v-model="fromDate" type="date" class="input-base text-sm w-full min-w-0" />
            <span class="text-neutral-400 text-xs shrink-0">{{ t("admin.attendance.reports.to") }}</span>
            <input v-model="toDate" type="date" class="input-base text-sm w-full min-w-0" />
          </div>
        </div>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("common.department") }}
          <select v-model="departmentFilter" class="input-base text-sm w-full mt-1">
            <option value="">{{ t("admin.attendance.reports.allDepartments") }}</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("common.employee") }}
          <select v-model="employeeFilter" class="input-base text-sm w-full mt-1">
            <option value="">{{ t("admin.attendance.reports.allEmployees") }}</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.name || employee.full_name }}
            </option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.late.minLate") }}
          <input v-model.number="minLateMinutes" type="number" min="0" class="input-base text-sm w-full mt-1" />
        </label>
      </div>
      <div class="flex items-center gap-2 mt-4">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-secondary-500 hover:bg-secondary-600 shadow-sm disabled:opacity-50"
          :disabled="loading"
          @click="applyFilters"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          {{ t("common.applyFilters") }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 disabled:opacity-50"
          :disabled="loading"
          @click="resetFilters"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t("common.reset") }}
        </button>
      </div>
    </div>

    <!-- KPI cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-warning-50 text-warning-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.total }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.late.kpi.total") }}</p>
        </div>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-info-50 text-info-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.avgLateMinutes }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.late.kpi.avg") }}</p>
        </div>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-error-50 text-error-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-base font-semibold text-neutral-900 leading-tight">
            {{ kpis.mostLateEmployee || t("admin.attendance.reports.noData") }}
          </p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.late.kpi.mostLate") }}</p>
        </div>
      </div>
    </div>

    <!-- Charts row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.late.chart.byDay") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <BarChart v-else :items="dayOfWeekChart" />
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.late.chart.trend") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <LineChart v-else :points="trend" />
      </div>
    </div>

    <!-- Charts row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.late.chart.top10") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <HorizontalBarChart v-else :items="topEmployeesChart" />
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.late.chart.byDept") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <HorizontalBarChart v-else-if="byDepartment.length" :items="departmentChart" />
        <p v-else class="py-16 text-center text-sm text-neutral-400">{{ t("admin.attendance.reports.noData") }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-neutral-100">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.reports.late.tableTitle") }}</h2>
      </div>

      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("common.show") }}
          <select v-model.number="pageSize" class="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm">
            <option v-for="size in [10, 25, 50, 100]" :key="size" :value="size">{{ size }}</option>
          </select>
          {{ t("common.entries") }}
        </label>
        <label class="inline-flex items-center gap-3 text-sm text-neutral-600">
          {{ t("common.search") }}
          <input v-model="search" type="search" class="w-40 sm:w-52 rounded border border-neutral-300 px-3 py-1.5" />
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1100px] text-sm">
          <thead>
            <tr class="border-y border-neutral-200 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
              <th class="px-6 py-3">{{ t("common.employee") }}</th>
              <th class="px-4 py-3">{{ t("common.department") }}</th>
              <th class="px-4 py-3">{{ t("common.date") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.late.col.day") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.shift") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.late.col.scheduled") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.late.col.actual") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.late.col.duration") }}</th>
              <th class="px-4 py-3">{{ t("common.reason") }}</th>
              <th class="px-4 py-3">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="10" class="px-6 py-10 text-center text-neutral-500">
                <span class="inline-flex items-center gap-2">
                  <span
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
                    aria-hidden="true"
                  />
                  {{ t("common.loading") }}
                </span>
              </td>
            </tr>
            <tr v-else-if="!paginated.length">
              <td colspan="10" class="px-6 py-10 text-center text-neutral-500">{{ t("admin.attendance.reports.late.empty") }}</td>
            </tr>
            <template v-else>
              <tr v-for="record in paginated" :key="record.id" class="hover:bg-neutral-50">
                <td class="px-6 py-3">
                  <p class="font-semibold text-neutral-900">{{ record.employee }}</p>
                  <p class="text-xs text-neutral-500">{{ record.employeeCode }}</p>
                </td>
                <td class="px-4 py-3 text-neutral-700">{{ record.department }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ record.date }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ record.day }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ record.shift }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ formatTime(record.scheduledTime) }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ formatTime(record.checkIn) }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-warning-50 text-warning-700">
                    {{ formatMinutes(record.lateMinutes) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-neutral-500">—</td>
                <td class="px-4 py-3">
                  <RouterLink to="/attendance" class="text-secondary-600 hover:underline">{{ t("common.view") }}</RouterLink>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-sm">
        <span class="text-neutral-500">
          {{ t("common.showingEntries", { from: filtered.length ? start + 1 : 0, to: end, total: filtered.length }) }}
        </span>
        <div class="flex gap-1">
          <button
            class="px-3 py-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="page <= 1"
            @click="page--"
          >
            {{ t("common.previous") }}
          </button>
          <button
            class="px-3 py-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="page >= totalPages"
            @click="page++"
          >
            {{ t("common.next") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { formatMinutes } from "../composables/useAttendanceRecords.js";
import { useLateArrivalsReport } from "../composables/useLateArrivalsReport.js";
import { BarChart, HorizontalBarChart, LineChart } from "./charts.js";
import { useI18n } from "../../../i18n/index.js";

const { t, bcp47, locale } = useI18n();

const {
  employees,
  loading,
  error,
  fromDate,
  toDate,
  departmentFilter,
  employeeFilter,
  minLateMinutes,
  departments,
  search,
  page,
  pageSize,
  kpis,
  byDayOfWeek,
  trend,
  topEmployees,
  byDepartment,
  filtered,
  totalPages,
  start,
  end,
  paginated,
  loadData,
  applyFilters,
  resetFilters,
} = useLateArrivalsReport();

const dayOfWeekChart = computed(() => {
  void locale.value;
  return byDayOfWeek.value.map((entry) => ({
    label: t(`admin.attendance.weekday.${entry.day}`),
    value: entry.count,
  }));
});
const topEmployeesChart = computed(() =>
  topEmployees.value.map((entry) => ({ label: entry.name, value: entry.count }))
);
const departmentChart = computed(() =>
  byDepartment.value.map((entry) => ({ label: entry.name, value: entry.count }))
);

function formatTime(value) {
  if (!value) return "—";
  const [hours, minutes] = String(value).split(":");
  return new Date(2000, 0, 1, Number(hours), Number(minutes))
    .toLocaleTimeString(bcp47.value, { hour: "numeric", minute: "2-digit" });
}

onMounted(() => {
  loadData();
});
</script>
