<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.leave.reports.history.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/leave-requests" class="hover:text-secondary-600">
          {{ t("admin.leave.management") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.leave.reportsCrumb") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- KPI cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <div
        class="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
      >
        <div>
          <p class="text-sm text-neutral-500">{{ t("admin.leave.reports.history.kpi.total") }}</p>
          <p v-if="loading" class="mt-1 flex h-8 items-center">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
              aria-hidden="true"
            />
          </p>
          <p v-else class="mt-1 text-2xl font-semibold text-neutral-900">
            {{ kpis.total }}
          </p>
        </div>
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </span>
      </div>

      <div
        class="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
      >
        <div>
          <p class="text-sm text-neutral-500">{{ t("admin.leave.reports.history.kpi.approved") }}</p>
          <p v-if="loading" class="mt-1 flex h-8 items-center">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-green-600"
              aria-hidden="true"
            />
          </p>
          <p v-else class="mt-1 text-2xl font-semibold text-neutral-900">
            {{ kpis.approved }}
          </p>
        </div>
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </div>

      <div
        class="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
      >
        <div>
          <p class="text-sm text-neutral-500">{{ t("admin.leave.reports.history.kpi.pending") }}</p>
          <p v-if="loading" class="mt-1 flex h-8 items-center">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-amber-600"
              aria-hidden="true"
            />
          </p>
          <p v-else class="mt-1 text-2xl font-semibold text-neutral-900">
            {{ kpis.pending }}
          </p>
        </div>
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </div>

      <div
        class="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
      >
        <div>
          <p class="text-sm text-neutral-500">{{ t("admin.leave.reports.history.kpi.rejected") }}</p>
          <p v-if="loading" class="mt-1 flex h-8 items-center">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-red-600"
              aria-hidden="true"
            />
          </p>
          <p v-else class="mt-1 text-2xl font-semibold text-neutral-900">
            {{ kpis.rejected }}
          </p>
        </div>
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- Filters -->
    <section class="mb-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 class="mb-4 text-sm font-semibold text-neutral-900">{{ t("common.filters") }}</h2>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.leave.modal.fromDate") }}
          <input
            v-model="draftFilters.from"
            type="date"
            class="input-base mt-1 w-full text-sm"
          />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.leave.modal.toDate") }}
          <input
            v-model="draftFilters.to"
            type="date"
            class="input-base mt-1 w-full text-sm"
          />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("common.employee") }}
          <select v-model="draftFilters.employeeCode" class="input-base mt-1 w-full text-sm">
            <option value="">{{ t("admin.leave.allEmployees") }}</option>
            <option
              v-for="opt in employeeOptions"
              :key="opt.code"
              :value="opt.code"
            >
              {{ opt.name }} ({{ opt.code }})
            </option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("common.department") }}
          <select v-model="draftFilters.department" class="input-base mt-1 w-full text-sm">
            <option value="">{{ t("admin.attendance.reports.selectDepartment") }}</option>
            <option v-for="dept in departmentOptions" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.leave.col.leaveType") }}
          <select v-model="draftFilters.leaveType" class="input-base mt-1 w-full text-sm">
            <option value="">{{ t("admin.leave.reports.selectLeaveType") }}</option>
            <option
              v-for="type in leaveTypeOptions"
              :key="type.code"
              :value="type.code"
            >
              {{ type.name }}
            </option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("common.status") }}
          <select v-model="draftFilters.status" class="input-base mt-1 w-full text-sm">
            <option value="">{{ t("admin.leave.reports.selectStatus") }}</option>
            <option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
          :disabled="loading"
          @click="applyFilters"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {{ t("common.applyFilters") }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          :disabled="loading"
          @click="resetFilters"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0A8.003 8.003 0 014.582 15m15.836 0H15"
            />
          </svg>
          {{ t("common.reset") }}
        </button>
      </div>
    </section>

    <!-- Details table -->
    <section class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="border-b border-neutral-100 px-5 py-4 md:px-6">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.leave.reports.history.tableTitle") }}</h2>
      </div>

      <div
        class="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
      >
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("common.show") }}
          <select
            v-model.number="pageSize"
            class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
          >
            <option v-for="size in [10, 25, 50, 100]" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          {{ t("common.entries") }}
        </label>
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('common.search')"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:max-w-xs"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-neutral-200 bg-neutral-50/80">
              <th
                v-for="col in columns"
                :key="col.key"
                scope="col"
                class="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-5"
                :class="col.thClass"
              >
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td :colspan="columns.length" class="px-6 py-16 text-center text-sm text-neutral-500">
                <span class="inline-flex items-center gap-2">
                  <span
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600"
                  />
                  {{ t("common.loading") }}
                </span>
              </td>
            </tr>
            <tr v-else-if="paginatedRows.length === 0">
              <td :colspan="columns.length" class="px-6 py-16 text-center text-sm text-neutral-500">
                {{ t("admin.leave.reports.history.empty") }}
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="(row, index) in paginatedRows"
                :key="row.id"
                class="transition-colors hover:bg-neutral-50/60"
              >
                <td class="px-4 py-3 text-sm text-neutral-600 md:px-5">
                  {{ rangeLabel.from + index }}
                </td>
                <td class="px-4 py-3 md:px-5">
                  <p class="text-sm font-medium text-neutral-900">{{ row.employee }}</p>
                  <p class="text-xs text-neutral-500">{{ row.employeeCode }}</p>
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700 md:px-5">
                  {{ row.leaveType }}
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700 md:px-5">
                  {{ row.dateRangeLabel }}
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700 md:px-5">
                  {{ row.days }}
                </td>
                <td class="px-4 py-3 md:px-5">
                  <span
                    class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="row.statusClass"
                  >
                    {{ row.statusLabel }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700 md:px-5">
                  {{ row.requestedOnLabel }}
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700 md:px-5">
                  {{ row.actionBy }}
                </td>
                <td class="px-4 py-3 text-right md:px-5">
                  <RouterLink
                    :to="{
                      name: 'LeaveManagementBalanceDetail',
                      params: { employeeCode: row.employeeCode },
                    }"
                    class="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/15 hover:bg-primary-100"
                  >
                    {{ t("common.view") }}
                  </RouterLink>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
      >
        <p class="text-sm text-neutral-600">
          {{ t("common.showingEntries", { from: rangeLabel.from, to: rangeLabel.to, total: totalFiltered }) }}
        </p>
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45"
            :disabled="page <= 1"
            @click="page -= 1"
          >
            {{ t("common.previous") }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45"
            :disabled="page >= pageCount"
            @click="page += 1"
          >
            {{ t("common.next") }}
          </button>
        </nav>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useLeaveHistoryReport } from "../../leave/composables/useLeaveHistoryReport.js";
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

const columns = computed(() => [
  { key: "index", label: "#" },
  { key: "employee", label: t("admin.leave.col.employee") },
  { key: "leaveType", label: t("admin.leave.col.leaveType") },
  { key: "dateRange", label: t("admin.leave.reports.dateRange") },
  { key: "totalDays", label: t("admin.leave.reports.history.col.totalDays") },
  { key: "status", label: t("common.status") },
  { key: "requestedOn", label: t("admin.leave.reports.history.col.requestedOn") },
  { key: "actionBy", label: t("admin.leave.reports.history.col.actionBy") },
  { key: "actions", label: t("common.actions"), thClass: "text-right" },
]);

const {
  loading,
  error,
  draftFilters,
  searchQuery,
  page,
  pageSize,
  employeeOptions,
  departmentOptions,
  leaveTypeOptions,
  statusOptions,
  kpis,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  loadData,
  applyFilters,
  resetFilters,
} = useLeaveHistoryReport();

onMounted(loadData);
</script>
