<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.reports.overtime.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/" class="inline-flex items-center gap-1 hover:text-secondary-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z" />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span><RouterLink to="/attendance" class="hover:text-secondary-600">{{ t("admin.attendance.breadcrumb") }}</RouterLink>
        <span>/</span><span class="text-neutral-800 font-medium">{{ t("admin.attendance.reports.overtime.crumb") }}</span>
      </nav>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <!-- KPI cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-secondary-100 text-secondary-600">
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
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.totalHours }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.overtime.kpi.total") }}</p>
        </div>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-success-50 text-success-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.employeesWithOvertime }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.overtime.kpi.employees") }}</p>
        </div>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-info-50 text-info-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.avgHoursPerEmployee }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.overtime.kpi.avg") }}</p>
        </div>
      </div>
      <div class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
        <span class="w-9 h-9 rounded-md flex items-center justify-center bg-warning-50 text-warning-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpis.weekendHours }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.attendance.reports.overtime.kpi.weekend") }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 mb-5">
      <h2 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("common.filters") }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.startDate") }}
          <input v-model="startDate" type="date" class="input-base text-sm w-full min-w-0 mt-1" />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.endDate") }}
          <input v-model="endDate" type="date" class="input-base text-sm w-full min-w-0 mt-1" />
        </label>
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
          {{ t("admin.attendance.reports.overtime.minHours") }}
          <input
            v-model="minOvertimeHours"
            type="number"
            min="0"
            step="0.5"
            placeholder="0.00"
            class="input-base text-sm w-full mt-1"
          />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.overtime.dayType") }}
          <select v-model="dayTypeFilter" class="input-base text-sm w-full mt-1">
            <option v-for="type in dayTypeOptions" :key="type.value || 'all'" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.overtime.approvalStatus") }}
          <select v-model="approvalStatusFilter" class="input-base text-sm w-full mt-1">
            <option value="">{{ t("admin.attendance.regularizations.allStatus") }}</option>
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
        <div class="flex items-end gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-secondary-500 hover:bg-secondary-600 shadow-sm disabled:opacity-50"
            :disabled="loading"
            @click="applyFilters"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
            {{ t("admin.attendance.reports.overtime.apply") }}
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
    </div>

    <!-- Charts row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.overtime.chart.byDept") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <template v-else>
          <HorizontalBarChart :items="byDepartment" />
          <p class="text-center text-xs font-semibold text-neutral-600 mt-2">{{ t("admin.attendance.reports.overtime.chart.hours") }}</p>
        </template>
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.overtime.chart.breakdown") }}</h3>
        <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
          {{ t("common.loading") }}
        </div>
        <DonutChart
          v-else
          :segments="breakdown"
          :center-label="t('admin.attendance.reports.overtime.centerLabel')"
          :center-value="t('admin.attendance.reports.overtime.hrs', { value: kpis.totalHours })"
        />
      </div>
    </div>

    <!-- Monthly trend -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 mb-5">
      <h3 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("admin.attendance.reports.overtime.chart.monthly") }}</h3>
      <div v-if="loading" class="flex h-56 flex-col items-center justify-center gap-3 text-sm text-neutral-500">
        <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500" />
        {{ t("common.loading") }}
      </div>
      <template v-else>
        <ComboChart
          :items="monthlyTrend"
          :bar-label="t('admin.attendance.reports.overtime.barLabel')"
          :line-label="t('admin.attendance.reports.overtime.lineLabel')"
        />
        <p class="text-center text-xs font-semibold text-neutral-600 mt-2">{{ t("admin.attendance.reports.overtime.chart.month") }}</p>
      </template>
    </div>

    <!-- Table -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-neutral-100">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.reports.overtime.tableTitle") }}</h2>
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
              <th class="px-4 py-3">{{ t("admin.attendance.reports.overtime.dayType") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.overtime.col.shiftDetails") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.overtime.col.checkTimes") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.overtime.col.workingHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.overtime.col.overtimeHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.overtime.approvalStatus") }}</th>
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
              <td colspan="10" class="px-6 py-10 text-center text-neutral-500">{{ t("admin.attendance.reports.overtime.empty") }}</td>
            </tr>
            <template v-else>
              <tr v-for="record in paginated" :key="record.id" class="hover:bg-neutral-50">
                <td class="px-6 py-3">
                  <p class="font-semibold text-neutral-900">{{ record.employee }}</p>
                  <p class="text-xs text-neutral-500">{{ record.employeeCode }}</p>
                </td>
                <td class="px-4 py-3 text-neutral-700">{{ record.department }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ record.date }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize"
                    :class="dayTypeClass(record.dayType)"
                  >
                    {{ dayTypeLabel(record.dayType) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-neutral-700">
                  <p>{{ record.shift }}</p>
                  <p v-if="record.shiftStart" class="text-xs text-neutral-500">
                    {{ record.shiftStart }} - {{ record.shiftEnd }}
                  </p>
                </td>
                <td class="px-4 py-3 text-neutral-700">
                  {{ record.checkIn || "—" }} - {{ record.checkOut || "—" }}
                </td>
                <td class="px-4 py-3 text-neutral-700">{{ formatMinutes(record.workingMinutes) }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-700">
                    {{ formatMinutes(record.overtimeMinutes) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    v-if="record.approvalStatus"
                    :class="[
                      'inline-flex px-2 py-0.5 rounded text-xs font-medium',
                      approvalStatusClass(record.approvalStatus),
                    ]"
                  >
                    {{ approvalStatusLabel(record.approvalStatus) }}
                  </span>
                  <span v-else class="text-neutral-500">—</span>
                </td>
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
import { onMounted } from "vue";
import { formatMinutes } from "../composables/useAttendanceRecords.js";
import { useOvertimeReport } from "../composables/useOvertimeReport.js";
import { ComboChart, DonutChart, HorizontalBarChart } from "./charts.js";
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

const {
  employees,
  loading,
  error,
  startDate,
  endDate,
  departmentFilter,
  employeeFilter,
  minOvertimeHours,
  dayTypeFilter,
  dayTypeOptions,
  dayTypeName,
  approvalStatusFilter,
  statusOptions,
  approvalStatusLabel,
  approvalStatusClass,
  departments,
  search,
  page,
  pageSize,
  kpis,
  byDepartment,
  breakdown,
  monthlyTrend,
  filtered,
  totalPages,
  start,
  end,
  paginated,
  loadData,
  applyFilters,
  resetFilters,
} = useOvertimeReport();

function dayTypeClass(type) {
  if (type === "weekend") return "bg-info-50 text-info-700";
  if (type === "holiday") return "bg-warning-50 text-warning-700";
  return "bg-neutral-100 text-neutral-600";
}

function dayTypeLabel(dayType) {
  return dayTypeName(dayType);
}

onMounted(() => {
  loadData();
});
</script>
