<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.reports.daily.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/" class="inline-flex items-center gap-1 hover:text-secondary-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z" />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span><RouterLink to="/attendance" class="hover:text-secondary-600">{{ t("admin.attendance.breadcrumb") }}</RouterLink>
        <span>/</span><span class="text-neutral-800 font-medium">{{ t("admin.attendance.reports.daily.crumb") }}</span>
      </nav>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <div class="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-5 flex items-center justify-between">
        <h2 class="flex items-center gap-2 text-base font-medium text-neutral-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3h7l5 5v13H7V3zm7 0v5h5" />
          </svg>
          {{ t("admin.attendance.reports.daily.title") }}
        </h2>
        <button type="button" class="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow"
          @click="filtersOpen = !filtersOpen">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          {{ t("common.filters") }}
        </button>
      </div>

      <div v-show="filtersOpen" class="mx-5 mb-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <label class="text-sm text-neutral-700">{{ t("common.date") }}
            <input v-model="dateFilter" type="date" class="input-base w-full mt-1" />
          </label>
          <label class="text-sm text-neutral-700">{{ t("common.employee") }}
            <select v-model="employeeFilter" class="input-base w-full mt-1">
              <option value="">{{ t("admin.attendance.reports.allEmployees") }}</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">{{ employee.name || employee.full_name }}</option>
            </select>
          </label>
          <button type="button" class="btn-secondary h-10" @click="loadData()">{{ t("common.applyFilters") }}</button>
        </div>
      </div>

      <div class="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("common.show") }}
          <select v-model.number="pageSize" class="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm">
            <option v-for="size in [10, 25, 50, 100]" :key="size" :value="size">{{ size }}</option>
          </select>
          {{ t("common.entries") }}
        </label>
        <label class="inline-flex items-center gap-3 text-sm text-neutral-600">
          {{ t("common.search") }}
          <input v-model="search" type="search" class="w-36 sm:w-48 rounded border border-neutral-300 px-3 py-1.5" />
        </label>
      </div>

      <div class="mx-5 overflow-x-auto">
        <table class="w-full min-w-[1120px] text-sm">
          <thead>
            <tr class="border-y border-neutral-200 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
              <th class="px-4 py-3">{{ t("admin.attendance.col.employee") }}</th><th class="px-4 py-3">{{ t("common.date") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.checkIn") }}</th><th class="px-4 py-3">{{ t("admin.attendance.col.checkOut") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.shift") }}</th><th class="px-4 py-3">{{ t("admin.attendance.reports.workingHrs") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.late") }}</th><th class="px-4 py-3">{{ t("admin.attendance.col.earlyOut") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.overtime") }}</th><th class="px-4 py-3">{{ t("common.status") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.reports.location") }}</th><th class="px-4 py-3">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading"><td colspan="12" class="py-5 text-center text-neutral-500">{{ t("common.loading") }}</td></tr>
            <tr v-else-if="!paginated.length"><td colspan="12" class="py-5 text-center text-neutral-500">{{ t("admin.attendance.reports.daily.empty") }}</td></tr>
            <template v-else>
              <tr v-for="record in paginated" :key="record.id" class="hover:bg-neutral-50">
                <td class="px-4 py-3 font-medium">{{ record.employee }}</td>
                <td class="px-4 py-3">{{ record.date }}</td>
                <td class="px-4 py-3">{{ formatTime(record.checkIn) }}</td>
                <td class="px-4 py-3">{{ formatTime(record.checkOut) }}</td>
                <td class="px-4 py-3">{{ record.shift }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.workingMinutes) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.lateMinutes) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.earlyOutMinutes) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.overtimeMinutes) }}</td>
                <td class="px-4 py-3"><span :class="statusClass(record.status)" class="rounded px-2 py-1 text-xs font-medium">{{ statusLabel(record.status) }}</span></td>
                <td class="px-4 py-3">{{ record.location }}</td>
                <td class="px-4 py-3"><RouterLink to="/attendance" class="text-secondary-600 hover:underline">{{ t("common.view") }}</RouterLink></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="mx-5 px-0 py-4 border-t border-neutral-100 flex items-center justify-between text-sm">
        <span class="text-neutral-500">{{ t("common.showingEntries", { from: filtered.length ? start + 1 : 0, to: end, total: filtered.length }) }}</span>
        <div class="flex gap-1">
          <button class="px-3 py-1.5 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40" :disabled="page <= 1" @click="page--">{{ t("common.previous") }}</button>
          <button class="px-3 py-1.5 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40" :disabled="page >= totalPages" @click="page++">{{ t("common.next") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { formatMinutes, useAttendanceRecords } from "../composables/useAttendanceRecords.js";
import { useI18n } from "../../../i18n/index.js";

const { t, bcp47 } = useI18n();

const filtersOpen = ref(false);
const {
  employees, loading, error, dateFilter, employeeFilter, search, page, pageSize,
  filtered, totalPages, start, end, paginated, loadData, loadReferenceData,
} = useAttendanceRecords();

function formatTime(value) {
  if (!value) return "—";
  const [hours, minutes] = value.split(":");
  return new Date(2000, 0, 1, Number(hours), Number(minutes))
    .toLocaleTimeString(bcp47.value, { hour: "numeric", minute: "2-digit" });
}

function statusLabel(status) {
  return {
    on_time: t("admin.attendance.status.onTime"),
    late: t("admin.attendance.status.late"),
    half_day: t("admin.attendance.status.halfDay"),
    leave: t("admin.attendance.status.leave"),
    absent: t("admin.attendance.status.absent"),
  }[status] || status;
}

function statusClass(status) {
  if (status === "on_time") return "bg-success-100 text-success-700";
  if (status === "late") return "bg-warning-100 text-warning-700";
  if (status === "half_day") return "bg-violet-100 text-violet-700";
  if (status === "leave") return "bg-info-100 text-info-700";
  return "bg-error-100 text-error-700";
}

onMounted(() => {
  loadData();
  loadReferenceData();
});
</script>
