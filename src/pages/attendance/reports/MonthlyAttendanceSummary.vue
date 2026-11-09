<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.reports.monthly.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/" class="inline-flex items-center gap-1 hover:text-secondary-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z" />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span><RouterLink to="/attendance" class="hover:text-secondary-600">{{ t("admin.attendance.breadcrumb") }}</RouterLink>
        <span>/</span><span class="text-neutral-800 font-medium">{{ t("admin.attendance.reports.monthly.crumb") }}</span>
      </nav>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <!-- KPI cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.label"
        class="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm"
      >
        <span :class="['w-9 h-9 rounded-md flex items-center justify-center', kpi.iconBg, kpi.iconText]">
          <component :is="kpi.icon" />
        </span>
        <div class="text-right">
          <p v-if="loading" class="flex h-8 items-center justify-end">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">{{ kpi.value }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ kpi.label }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 mb-5">
      <h2 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("common.filters") }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <label class="text-xs font-medium text-neutral-600">
          {{ t("admin.attendance.reports.month") }}
          <input v-model="month" type="month" class="input-base text-sm w-full mt-1" />
        </label>
        <label class="text-xs font-medium text-neutral-600">
          {{ t("common.department") }}
          <select v-model="departmentFilter" class="input-base text-sm w-full mt-1">
            <option value="">{{ t("admin.attendance.reports.selectDepartment") }}</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </label>
        <label class="text-xs font-medium text-neutral-600">
          {{ t("common.employee") }}
          <select v-model="employeeFilter" class="input-base text-sm w-full mt-1">
            <option value="">{{ t("admin.attendance.reports.selectEmployee") }}</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.name || employee.full_name }}
            </option>
          </select>
        </label>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-secondary-500 hover:bg-secondary-600 shadow-sm disabled:opacity-50"
            :disabled="loading"
            @click="applyFilters"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
            {{ t("admin.attendance.reports.monthly.apply") }}
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

    <!-- Table card -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-neutral-100">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.reports.monthly.tableTitle") }}</h2>
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
        <table class="w-full min-w-[1120px] text-sm">
          <thead>
            <tr class="border-y border-neutral-200 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
              <th class="px-6 py-3">{{ t("common.employee") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.present") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.absent") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.late") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.half") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.workingHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.lateHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.earlyHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.overtimeHours") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.monthly.col.pct") }}</th>
              <th class="px-4 py-3">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="11" class="px-6 py-10 text-center text-neutral-500">
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
              <td colspan="11" class="px-6 py-10 text-center text-neutral-500">{{ t("admin.attendance.reports.monthly.empty") }}</td>
            </tr>
            <template v-else>
              <tr v-for="row in paginated" :key="row.employeeId" class="hover:bg-neutral-50">
                <td class="px-6 py-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <EmployeeAvatar
                      :name="row.name"
                      :avatar-url="row.avatarUrl"
                      size-class="h-9 w-9 text-xs font-semibold"
                      fallback-class="text-secondary-800 bg-secondary-100"
                    />
                    <div class="min-w-0">
                      <p class="font-semibold text-neutral-900 truncate">{{ row.name }}</p>
                      <p class="text-xs text-neutral-500">{{ row.code }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">{{ row.presentDays }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error-700">{{ row.absentDays }}</span>
                </td>
                <td class="px-4 py-3 text-neutral-700">{{ row.lateDays }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ row.halfDays }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ formatDuration(row.workingMinutes) }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ formatDuration(row.lateMinutes) }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ formatDuration(row.earlyOutMinutes) }}</td>
                <td class="px-4 py-3 text-neutral-700">{{ formatDuration(row.overtimeMinutes) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                    :class="row.attendancePct >= 75 ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'"
                  >
                    {{ row.attendancePct }}%
                  </span>
                </td>
                <td class="px-4 py-3" @click.stop>
                  <div class="relative inline-block text-left">
                    <button
                      type="button"
                      class="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100"
                      :aria-label="t('common.actions')"
                      @click="openMenuId = openMenuId === row.employeeId ? null : row.employeeId"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                      </svg>
                    </button>
                    <div
                      v-if="openMenuId === row.employeeId"
                      class="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
                    >
                      <RouterLink
                        to="/attendance/reports/daily"
                        class="block w-full px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left"
                      >
                        {{ t("admin.attendance.reports.monthly.viewDaily") }}
                      </RouterLink>
                      <RouterLink
                        to="/attendance"
                        class="block w-full px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left"
                      >
                        {{ t("admin.attendance.reports.monthly.viewRecords") }}
                      </RouterLink>
                    </div>
                  </div>
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
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="min-w-[32px] h-8 px-2 rounded text-sm font-medium"
            :class="p === page ? 'bg-secondary-500 text-white' : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'"
            @click="page = p"
          >
            {{ p }}
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
import { computed, h, onMounted, onUnmounted, ref } from "vue";
import {
  formatDuration,
  useMonthlyAttendanceSummary,
} from "../composables/useMonthlyAttendanceSummary.js";
import { useI18n } from "../../../i18n/index.js";
import EmployeeAvatar from "../../../components/common/EmployeeAvatar.vue";

const { t, locale } = useI18n();

const openMenuId = ref(null);

const {
  employees,
  loading,
  error,
  month,
  departmentFilter,
  employeeFilter,
  departments,
  search,
  page,
  pageSize,
  kpis,
  filtered,
  totalPages,
  start,
  end,
  paginated,
  loadData,
  applyFilters,
  resetFilters,
} = useMonthlyAttendanceSummary();

const svg = (d) => () =>
  h("svg", { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d }),
  ]);

const kpiCards = computed(() => {
  void locale.value;
  return [
    {
      label: t("admin.attendance.reports.monthly.kpi.employees"),
      value: kpis.value.totalEmployees,
      icon: svg("M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a3 3 0 11-3-3"),
      iconBg: "bg-secondary-100",
      iconText: "text-secondary-600",
    },
    {
      label: t("admin.attendance.reports.monthly.kpi.avgAttendance"),
      value: `${kpis.value.averageAttendance}%`,
      icon: svg("M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"),
      iconBg: "bg-success-100",
      iconText: "text-success-600",
    },
    {
      label: t("admin.attendance.reports.monthly.kpi.workingHours"),
      value: formatDuration(kpis.value.totalWorkingMinutes, { long: true }),
      icon: svg("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"),
      iconBg: "bg-info-100",
      iconText: "text-info-600",
    },
    {
      label: t("admin.attendance.reports.monthly.kpi.overtime"),
      value: formatDuration(kpis.value.totalOvertimeMinutes, { long: true }),
      icon: svg("M12 9v3m0 3h.01M12 3a9 9 0 100 18 9 9 0 000-18z"),
      iconBg: "bg-warning-100",
      iconText: "text-warning-600",
    },
  ];
});

function closeMenus() {
  openMenuId.value = null;
}

onMounted(() => {
  loadData();
  document.addEventListener("click", closeMenus);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenus);
});
</script>
