<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.structures.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.structures.subtitle") }}
        </p>
      </div>
      <div class="flex flex-col items-end gap-3">
        <nav
          class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
          :aria-label="t('common.breadcrumb')"
        >
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">
            {{ t("admin.payroll.breadcrumb.dashboard") }}
          </RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.structures.breadcrumb.structures") }}</span>
        </nav>
        <button type="button" class="btn-secondary inline-flex items-center gap-2" @click="goToBuilder()">
          <span class="text-lg leading-none">+</span>
          {{ t("admin.payroll.structures.assign") }}
        </button>
      </div>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <!-- Alerte salaire de base -->
    <div
      class="mb-6 flex gap-3 rounded-xl border border-info-500/25 bg-info-50 px-4 py-3 text-sm text-neutral-700"
    >
      <span class="flex-shrink-0 text-info-600 mt-0.5" aria-hidden="true">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <div>
        <p class="font-semibold text-neutral-900">{{ t("admin.payroll.structures.alertTitle") }}</p>
        <p class="mt-1">
          {{ t("admin.payroll.structures.alertText") }}
        </p>
      </div>
    </div>

    <!-- KPI -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-lg bg-success-50 text-success-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <div v-if="loading" class="flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-success-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ kpi.complete }}</p>
          <p class="text-sm text-neutral-600">{{ t("admin.payroll.structures.kpi.complete") }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">
            {{ t("admin.payroll.structures.kpi.completeHint") }}
          </p>
        </div>
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <div v-if="loading" class="flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-warning-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ kpi.incomplete }}</p>
          <p class="text-sm text-neutral-600">{{ t("admin.payroll.structures.kpi.incomplete") }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">
            {{ t("admin.payroll.structures.kpi.incompleteHint") }}
          </p>
        </div>
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-lg bg-error-50 text-error-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <div v-if="loading" class="flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-error-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ kpi.notConfigured }}</p>
          <p class="text-sm text-neutral-600">{{ t("admin.payroll.structures.kpi.notConfigured") }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.payroll.structures.kpi.notConfiguredHint") }}</p>
        </div>
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg"
        >
          $
        </div>
        <div class="min-w-0">
          <div v-if="loading" class="flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ kpi.avgBaseFormatted }}</p>
          <p class="text-sm text-neutral-600">{{ t("admin.payroll.structures.kpi.avgSalary") }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t("admin.payroll.structures.kpi.avgSalaryHint") }}</p>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">
            {{ t("admin.payroll.structures.filterStatus") }}
          </label>
          <select v-model="filters.status" class="input-base text-sm">
            <option value="all">{{ t("admin.payroll.filter.allEmployees") }}</option>
            <option value="complete">{{ t("admin.payroll.structures.status.complete") }}</option>
            <option value="incomplete">{{ t("admin.payroll.structures.status.incomplete") }}</option>
            <option value="none">{{ t("admin.payroll.structures.status.notConfigured") }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.department") }}</label>
          <select v-model="filters.departmentId" class="input-base text-sm">
            <option value="all">{{ t("admin.payroll.filter.allDepartments") }}</option>
            <option v-for="d in departments" :key="d.id" :value="d.id">
              {{ d.name }}
            </option>
          </select>
        </div>
        <div class="md:col-span-2 lg:col-span-1">
          <label class="block text-sm font-medium text-neutral-700 mb-1">
            {{ t("admin.payroll.structures.searchEmployeeLabel") }}
          </label>
          <input
            v-model="filters.employeeQuery"
            type="search"
            class="input-base text-sm"
            :placeholder="t('admin.payroll.structures.searchEmployee')"
          />
        </div>
        <div class="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            class="btn-secondary inline-flex items-center gap-2 text-sm"
            :disabled="loading"
            @click="applyFilters"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {{ t("common.applyFilters") }}
          </button>
          <button
            type="button"
            class="btn-outline inline-flex items-center gap-2 text-sm"
            :disabled="loading"
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
    </div>

    <!-- Tableau -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-neutral-200">
        <h2 class="text-lg font-semibold text-neutral-900">
          {{ t("admin.payroll.structures.tableTitle") }}
        </h2>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.structures.tableSubtitle") }}
        </p>
      </div>
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-neutral-200"
      >
        <div class="flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.show") }}</span>
          <select
            v-model.number="itemsPerPage"
            class="input-base py-1.5 w-auto text-sm"
            @change="currentPage = 1"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>{{ t("common.entries") }}</span>
        </div>
        <div class="relative w-full sm:max-w-xs">
          <input
            v-model="tableSearch"
            type="search"
            :placeholder="t('admin.payroll.structures.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <svg
            class="absolute left-3 top-3 w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div class="overflow-x-auto relative" :class="{ 'min-h-[200px]': loading }">
        <table class="w-full text-sm min-w-[1000px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="px-4 py-3 font-medium min-w-[200px]">{{ t("admin.payroll.structures.col.employee") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.structures.col.status") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.structures.col.components") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.structures.col.baseSalary") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.structures.col.totalFixed") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.structures.col.lastUpdated") }}</th>
              <th class="px-4 py-3 font-medium w-24 text-right">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody v-if="loading" class="divide-y divide-neutral-100" aria-busy="true">
            <tr v-for="n in 6" :key="`sk-${n}`">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 animate-pulse rounded-full bg-neutral-100" />
                  <div class="space-y-2">
                    <div class="h-4 w-32 animate-pulse rounded bg-neutral-100" />
                    <div class="h-3 w-16 animate-pulse rounded bg-neutral-100" />
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-14 animate-pulse rounded bg-neutral-100" />
                <div class="mt-2 h-3 w-20 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-24 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4 text-right">
                <div class="ml-auto h-5 w-5 animate-pulse rounded bg-neutral-100" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="filteredEmployees.length === 0">
            <tr>
              <td
                colspan="7"
                class="px-6 py-10 text-center text-sm text-neutral-500"
              >
                {{
                  tableSearch.trim() ||
                  filters.status !== "all" ||
                  filters.departmentId !== "all" ||
                  filters.employeeQuery.trim()
                    ? t("admin.payroll.structures.emptySearch")
                    : t("admin.payroll.structures.empty")
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-neutral-100">
            <tr
              v-for="row in paginatedRows"
              :key="row.id"
              class="hover:bg-neutral-50/80 transition-colors"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <EmployeeAvatar
                    :name="row.name"
                    :avatar-url="row.avatarUrl"
                    size-class="h-10 w-10 text-sm font-semibold"
                    fallback-class="text-white"
                    :style="{ backgroundColor: avatarColor(row.name) }"
                  />
                  <div class="min-w-0">
                    <p class="font-medium text-neutral-900 truncate">{{ row.name }}</p>
                    <p class="text-xs text-neutral-500">{{ row.empCode }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  v-if="row.structureStatus === 'complete'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ t("admin.payroll.structures.status.complete") }}
                </span>
                <span
                  v-else-if="row.structureStatus === 'incomplete'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                >
                  {{ t("admin.payroll.structures.status.incomplete") }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ t("admin.payroll.structures.status.notConfigured") }}
                </span>
              </td>
              <td class="px-4 py-4">
                <template v-if="row.expectedCount > 0">
                  <span class="font-medium text-neutral-900">
                    {{ row.assignedCount }} / {{ row.expectedCount }}
                  </span>
                  <p class="text-xs text-neutral-500 mt-0.5">
                    <template v-if="row.structureStatus === 'complete'">
                      {{ t("admin.payroll.structures.catalogComplete") }}
                    </template>
                    <template v-else-if="row.assignedCount > 0">
                      {{ t("admin.payroll.structures.missingCount", { n: row.expectedCount - row.assignedCount }) }}
                    </template>
                    <template v-else>{{ t("admin.payroll.structures.noneAssigned") }}</template>
                  </p>
                </template>
                <span v-else class="text-neutral-400 font-medium">0</span>
              </td>
              <td class="px-4 py-4">
                <span
                  v-if="row.baseSalary != null"
                  class="font-semibold text-green-700 whitespace-nowrap"
                >
                  {{ formatMoney(row.baseSalary, row.currency) }}
                </span>
                <span v-else class="text-neutral-400">—</span>
              </td>
              <td class="px-4 py-4 font-medium text-neutral-900 whitespace-nowrap">
                <template v-if="row.totalFixed != null">
                  {{ formatMoney(row.totalFixed, row.currency) }}
                  <span v-if="row.hasVariablePercent" class="text-neutral-500 font-normal">
                    + %
                  </span>
                </template>
                <span v-else class="text-neutral-400">—</span>
              </td>
              <td class="px-4 py-4 text-neutral-600">{{ row.lastUpdatedLabel }}</td>
              <td class="px-4 py-4 text-right">
                <TableRowMenu
                  :open="openMenuId === row.id"
                  :aria-label="t('common.actions')"
                  width-class="w-56"
                  @toggle="toggleMenu(row.id)"
                  @close="openMenuId = null"
                >
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-neutral-50 transition-colors"
                    @click="openViewDetails(row)"
                  >
                    <svg
                      class="w-5 h-5 text-slate-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    View Details
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-neutral-50 transition-colors"
                    @click="goToBuilder(row.id)"
                  >
                    <svg
                      class="w-5 h-5 text-slate-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Component
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-neutral-50 transition-colors"
                    @click="goToBuilder(row.id)"
                  >
                    <svg
                      class="w-5 h-5 text-slate-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Manage Components
                  </button>
                </TableRowMenu>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="loading"
          class="pointer-events-none absolute inset-x-0 top-12 bottom-0 flex items-center justify-center bg-white/40"
          aria-hidden="true"
        >
          <span
            class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
          />
        </div>
      </div>

      <div
        v-if="!loading && filteredEmployees.length > 0"
        class="px-6 py-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600"
      >
        <span>{{ t("common.rangeOf", { start: rangeStart, end: rangeEnd, total: filteredEmployees.length }) }}</span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            {{ t("common.previous") }}
          </button>
          <span>{{ t("common.pageOf", { current: currentPage, total: totalPages }) }}</span>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            {{ t("common.next") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modale : détails rémunération (View Details) -->
    <EmployeeCompensationDetailsModal
      v-model="detailOpen"
      :profile="detailProfile"
      :lines="detailLines"
      :kpis="detailKpis"
      :format-line-value="formatLineValue"
      :format-effective-period="formatEffectivePeriod"
      :type-label="typeLabel"
      @update:model-value="(v) => !v && closeDetail()"
      @add-component="addComponent"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useI18n } from "../../i18n/index.js";
import TableRowMenu from "../../components/common/TableRowMenu.vue";
import {
  useSalaryStructureStore,
} from "./stores/salary-structure.store.js";
import { avatarColor } from "./utils/payroll-http.js";
import EmployeeAvatar from "../../components/common/EmployeeAvatar.vue";
import { useSalaryStructureDetail } from "./composables/useSalaryStructureDetail.js";
import EmployeeCompensationDetailsModal from "./components/EmployeeCompensationDetailsModal.vue";

const router = useRouter();
const { t } = useI18n();
const salaryStore = useSalaryStructureStore();
const { employees, departmentOptions, loading, error } = storeToRefs(salaryStore);

const departments = departmentOptions;

function formatMoney(n, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

function goToBuilder(employeeId) {
  closeMenus();
  router.push({
    name: "PayrollSalaryStructureBuilder",
    query: employeeId != null ? { employee: String(employeeId) } : {},
  });
}

const {
  open: detailOpen,
  profile: detailProfile,
  lines: detailLines,
  kpis: detailKpis,
  openDetail,
  closeDetail,
  addComponent,
  formatLineValue,
  formatEffectivePeriod,
  typeLabel,
} = useSalaryStructureDetail({
  onAddComponent: (employeeId) => goToBuilder(employeeId),
});

const filters = ref({
  status: "all",
  departmentId: "all",
  employeeQuery: "",
});

const tableSearch = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const openMenuId = ref(null);

function openViewDetails(row) {
  closeMenus();
  openDetail(row);
}

watch(tableSearch, () => {
  currentPage.value = 1;
});

const kpi = computed(() => {
  const list = employees.value;
  const complete = list.filter((e) => e.structureStatus === "complete").length;
  // « Salaire de base manquant » : tout le monde sans rémunération complète
  // (incomplète démarrée + non configuré / aucun composant)
  const incomplete = list.filter(
    (e) =>
      e.structureStatus === "incomplete" || e.structureStatus === "none"
  ).length;
  const notConfigured = list.filter((e) => e.structureStatus === "none").length;
  const withBase = list.filter((e) => e.baseSalary != null && e.baseSalary > 0);
  const averagesByCurrency = [...withBase.reduce((groups, employee) => {
    const currency = employee.currency || "EUR";
    const group = groups.get(currency) || { total: 0, count: 0 };
    group.total += employee.baseSalary;
    group.count += 1;
    groups.set(currency, group);
    return groups;
  }, new Map())];
  return {
    complete,
    incomplete,
    notConfigured,
    avgBaseFormatted: averagesByCurrency.length
      ? averagesByCurrency.map(([currency, group]) => formatMoney(group.total / group.count, currency)).join(" · ")
      : formatMoney(0),
  };
});

// Filtres principaux (statut / département / nom) → GET /employees côté backend.
// Recherche locale du tableau uniquement (affinage sans recharger).
const filteredEmployees = computed(() => {
  const q = tableSearch.value.trim().toLowerCase();
  if (!q) return employees.value;
  return employees.value.filter(
    (e) =>
      e.name.toLowerCase().includes(q) || e.empCode.toLowerCase().includes(q)
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmployees.value.length / itemsPerPage.value))
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredEmployees.value.slice(start, start + itemsPerPage.value);
});

const rangeStart = computed(() =>
  filteredEmployees.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage.value + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredEmployees.value.length)
);

function buildListFilters() {
  const f = filters.value;
  return {
    search: f.employeeQuery.trim() || undefined,
    department: f.departmentId !== "all" ? f.departmentId : undefined,
    structureStatus: f.status !== "all" ? f.status : undefined,
  };
}

async function applyFilters() {
  currentPage.value = 1;
  await salaryStore.fetchAll(buildListFilters());
}

async function resetFilters() {
  filters.value = { status: "all", departmentId: "all", employeeQuery: "" };
  tableSearch.value = "";
  currentPage.value = 1;
  await salaryStore.fetchAll({ refreshDepartments: true });
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenus() {
  openMenuId.value = null;
}

function onDocClick() {
  closeMenus();
}

onMounted(async () => {
  document.addEventListener("click", onDocClick);
  await salaryStore.fetchAll();
});
onUnmounted(() => document.removeEventListener("click", onDocClick));
</script>
