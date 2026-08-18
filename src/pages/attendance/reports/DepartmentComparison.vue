<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.reports.dept.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/" class="inline-flex items-center gap-1 hover:text-secondary-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z" />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span><RouterLink to="/attendance" class="hover:text-secondary-600">{{ t("admin.attendance.reports.dept.crumbAttendance") }}</RouterLink>
        <span>/</span><span class="text-neutral-800 font-medium">{{ t("admin.attendance.reports.dept.crumb") }}</span>
      </nav>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <!-- KPI cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div class="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <div class="flex items-start justify-between">
          <span class="w-9 h-9 rounded-md flex items-center justify-center bg-success-50 text-success-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          <div class="text-right">
            <p v-if="loading" class="flex h-8 items-center justify-end">
              <span
                class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
                aria-hidden="true"
              />
            </p>
            <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">
              {{ kpis.best ? `${kpis.best.attendanceRate}%` : "0%" }}
            </p>
            <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.dept.kpi.best") }}</p>
          </div>
        </div>
        <p class="text-xs font-semibold text-neutral-700 mt-2">
          {{ loading ? "…" : kpis.best?.name || "—" }}
        </p>
      </div>
      <div class="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <div class="flex items-start justify-between">
          <span class="w-9 h-9 rounded-md flex items-center justify-center bg-error-50 text-error-500">
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
            <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">
              {{ kpis.worst ? `${kpis.worst.attendanceRate}%` : "0%" }}
            </p>
            <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.dept.kpi.needs") }}</p>
          </div>
        </div>
        <p class="text-xs font-semibold text-neutral-700 mt-2">
          {{ loading ? "…" : kpis.worst?.name || "—" }}
        </p>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-secondary-100 text-secondary-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.averageAttendance }}%</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.dept.kpi.avg") }}</p>
        </div>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-info-50 text-info-600">
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
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">
            {{ formatWorkingHours(kpis.totalWorkingMinutes) }}
          </p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.dept.kpi.workingHours") }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 mb-5">
      <h2 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("common.filters") }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.startDate") }}
          <input v-model="startDate" type="date" class="input-base text-sm w-full min-w-0 mt-1" />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.endDate") }}
          <input v-model="endDate" type="date" class="input-base text-sm w-full min-w-0 mt-1" />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.dept.selectDepartments") }}
          <select v-model="departmentFilter" class="input-base text-sm w-full mt-1">
            <option value="">{{ t("admin.attendance.reports.allDepartments") }}</option>
            <option v-for="dept in departmentsList" :key="dept.id" :value="dept.name">
              {{ dept.name }}
            </option>
          </select>
        </label>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-secondary-500 hover:bg-secondary-600 shadow-sm disabled:opacity-50"
          :disabled="loading"
          @click="applyFilters"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          {{ t("admin.attendance.reports.dept.apply") }}
        </button>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.dept.chart.rate") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <BarChart v-else :items="attendanceRateChart" />
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.dept.chart.hours") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <HorizontalBarChart v-else-if="workingHoursChart.length" :items="workingHoursChart" />
        <div v-else class="h-56 flex flex-col items-center justify-center gap-2 text-sm text-neutral-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t("admin.attendance.reports.dept.noPeriodData") }}
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.reports.dept.tableTitle") }}</h2>
        <span class="text-xs text-neutral-500">{{ rangeLabel }}</span>
      </div>

      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("common.show") }}
          <select v-model.number="pageSize" class="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm">
            <option v-for="size in [10, 25, 50]" :key="size" :value="size">{{ size }}</option>
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
              <th class="px-6 py-3">{{ t("admin.attendance.reports.dept.col.rank") }}</th>
              <th class="px-4 py-3">{{ t("common.department") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.employees") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.rate") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.present") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.workingHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.late") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.overtime") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.dept.col.punctuality") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-10 text-center text-neutral-500">
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
              <td colspan="9" class="px-6 py-10 text-center text-neutral-500">{{ t("admin.attendance.reports.dept.empty") }}</td>
            </tr>
            <template v-else>
              <tr v-for="row in paginated" :key="row.name" class="hover:bg-neutral-50">
                <td class="px-6 py-4">
                  <span v-if="row.rank === 1" :title="t('admin.attendance.reports.dept.bestTitle')">
                    <svg class="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3h14v2h3v3c0 2.21-1.79 4-4 4h-.35A6.995 6.995 0 0113 16.92V19h4v2H7v-2h4v-2.08A6.995 6.995 0 016.35 12H6c-2.21 0-4-1.79-4-4V5h3V3zm0 4H4v1c0 1.1.9 2 2 2h.06A7.02 7.02 0 016 8.5V7zm14 0v1.5c0 .52-.06 1.02-.17 1.5H19c1.1 0 2-.9 2-2V7h-2z" />
                    </svg>
                  </span>
                  <span v-else class="text-neutral-500 font-medium">#{{ row.rank }}</span>
                </td>
                <td class="px-4 py-4">
                  <p class="font-semibold text-neutral-900">{{ row.name }}</p>
                  <p class="text-xs text-neutral-500">{{ row.code }}</p>
                </td>
                <td class="px-4 py-4">
                  <span class="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold bg-secondary-100 text-secondary-700">
                    {{ row.employees }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex px-2 py-0.5 rounded text-xs font-semibold"
                      :class="rateClass(row.attendanceRate)"
                    >
                      {{ row.attendanceRate }}%
                    </span>
                    <div class="w-20 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :class="rateBarClass(row.attendanceRate)"
                        :style="{ width: `${row.attendanceRate}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-info-600 font-semibold">{{ row.presentDays }}</td>
                <td class="px-4 py-4">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-info-50 text-info-700">
                    {{ formatWorkingHours(row.workingMinutes) }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-warning-50 text-warning-700">
                    {{ t("admin.attendance.reports.dept.instances", { count: row.lateInstances }) }}
                  </span>
                  <p class="text-xs text-neutral-500 mt-1">{{ t("admin.attendance.reports.dept.avgMinutes", { value: row.avgLateMinutes }) }}</p>
                </td>
                <td class="px-4 py-4">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-success-50 text-success-700">
                    {{ formatWorkingHours(row.overtimeMinutes) }}
                  </span>
                  <p class="text-xs text-neutral-500 mt-1">{{ t("admin.attendance.reports.dept.avgMinutes", { value: row.avgOvertimeMinutes }) }}</p>
                </td>
                <td class="px-4 py-4">
                  <span
                    class="inline-flex px-2.5 py-1 rounded text-xs font-bold text-white"
                    :class="punctualityClass(row.punctualityScore)"
                  >
                    {{ row.punctualityScore }}%
                  </span>
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
        <div class="flex items-center gap-1">
          <button
            class="px-3 py-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="page <= 1"
            @click="page--"
          >
            {{ t("common.previous") }}
          </button>
          <span class="px-3 py-1.5 rounded bg-secondary-500 text-white text-xs font-semibold">{{ page }}</span>
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
import {
  formatWorkingHours,
  useDepartmentComparison,
} from "../composables/useDepartmentComparison.js";
import { BarChart, HorizontalBarChart } from "./charts.js";
import { useI18n } from "../../../i18n/index.js";

const { t, bcp47 } = useI18n();

const {
  departmentsList,
  loading,
  error,
  startDate,
  endDate,
  departmentFilter,
  appliedRange,
  search,
  page,
  pageSize,
  kpis,
  attendanceRateChart,
  workingHoursChart,
  filtered,
  totalPages,
  start,
  end,
  paginated,
  loadData,
  applyFilters,
} = useDepartmentComparison();

const rangeLabel = computed(() => {
  const format = (value) =>
    new Date(`${value}T12:00:00`).toLocaleDateString(bcp47.value, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return `${format(appliedRange.value.from)} - ${format(appliedRange.value.to)}`;
});

function rateClass(rate) {
  if (rate >= 75) return "bg-success-50 text-success-700";
  if (rate >= 50) return "bg-warning-50 text-warning-700";
  return "bg-error-50 text-error-600";
}

function rateBarClass(rate) {
  if (rate >= 75) return "bg-success-500";
  if (rate >= 50) return "bg-warning-500";
  return "bg-error-500";
}

function punctualityClass(score) {
  if (score >= 80) return "bg-success-500";
  if (score >= 50) return "bg-warning-500";
  return "bg-error-500";
}

onMounted(() => {
  loadData();
});
</script>
