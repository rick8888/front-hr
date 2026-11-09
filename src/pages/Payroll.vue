<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">{{ t("admin.payroll.subtitle") }}</p>
      </div>
      <div class="flex flex-col items-stretch sm:items-end gap-3">
        <nav
          class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
          aria-label="Breadcrumb"
        >
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.breadcrumb.records") }}</span>
        </nav>
        <button
          type="button"
          class="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          @click="openGenerateModal"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t("admin.payroll.process") }}
        </button>
      </div>
    </div>

    <!-- KPI -->
    <div
      v-if="autoGenerationEnabled"
      class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
    >
      {{ t("admin.payroll.generate.autoBanner") }}
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <PayrollKpiCard
        :label="t('admin.payroll.kpi.totalRecords')"
        :value="loading ? '…' : String(kpi.total)"
        icon-class="bg-secondary-100 text-secondary-600"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.kpi.pending')"
        :value="loading ? '…' : String(kpi.pending)"
        icon-class="bg-amber-100 text-amber-700"
      >
        <template #icon>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </PayrollKpiCard>
      <PayrollKpiCard
        :label="t('admin.payroll.kpi.approved')"
        :value="loading ? '…' : String(kpi.approved)"
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
      <PayrollKpiCard
        :label="t('admin.payroll.kpi.totalPayout')"
        :value="loading ? '…' : formatCurrencyGroups(kpi.totalPayoutByCurrency)"
        icon-class="bg-primary-100 text-primary-700"
      >
        <template #icon>
          <span class="text-lg font-bold">¤</span>
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
        <span class="flex items-center gap-2">
          {{ t("admin.payroll.filters") }}
          <svg
            class="w-5 h-5 text-neutral-400 transition-transform"
            :class="filtersOpen ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div v-show="filtersOpen" class="px-5 pb-5 border-t border-neutral-100 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          <PayrollFilterField :label="t('admin.payroll.filter.dateRange')">
            <select v-model="filters.dateRange" class="input-base text-sm">
              <option value="all">{{ t("admin.payroll.filter.allTime") }}</option>
              <option value="month">{{ t("admin.payroll.filter.thisMonth") }}</option>
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
          <PayrollFilterField :label="t('admin.payroll.filter.status')">
            <select v-model="filters.status" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.filter.allStatuses") }}</option>
              <option value="paid">{{ t("admin.payroll.status.paid") }}</option>
              <option value="pending">{{ t("admin.payroll.status.pending") }}</option>
              <option value="approved">{{ t("admin.payroll.status.approved") }}</option>
            </select>
          </PayrollFilterField>
          <PayrollFilterField :label="t('admin.payroll.filter.cycle')">
            <select v-model="filters.cycle" class="input-base text-sm">
              <option value="all">{{ t("admin.payroll.filter.allCycles") }}</option>
              <option
                v-for="opt in cycleOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </PayrollFilterField>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <PayrollFilterField :label="t('admin.payroll.filter.period')" class="min-w-[200px]">
            <input v-model="filters.period" type="month" class="input-base text-sm" />
          </PayrollFilterField>
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
            {{ t("admin.payroll.filter.apply") }}
          </button>
          <button
            type="button"
            class="p-2.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            :title="t('admin.payroll.filter.reset')"
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
        <div>
          <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">{{ t("admin.payroll.filter.quick") }}</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="qf in quickFilters"
              :key="qf.key"
              type="button"
              class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
              :class="qf.classes"
              @click="applyQuickFilter(qf.key)"
            >
              {{ qf.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div
      id="payroll-records-table"
      ref="payrollRecordsSection"
      class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden scroll-mt-24"
    >
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.recordsTitle") }}</h2>
      </div>
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 py-3 border-b border-neutral-100"
      >
        <div class="flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("admin.attendance.showEntries") }}</span>
          <select
            v-model.number="itemsPerPage"
            class="input-base py-1.5 w-auto text-sm"
            @change="currentPage = 1"
          >
            <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
          </select>
          <span>{{ t("admin.attendance.entries") }}</span>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select v-model="bulkAction" class="input-base text-sm py-2 min-w-[140px]">
            <option value="">{{ t("admin.payroll.bulkActions") }}</option>
            <option value="export">{{ t("admin.payroll.bulk.export") }}</option>
            <option value="approve">{{ t("admin.payroll.bulk.approve") }}</option>
          </select>
          <div class="relative flex-1 sm:max-w-xs">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('admin.payroll.searchPlaceholder')"
              class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
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
        <table class="w-full text-sm min-w-[900px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="pl-5 pr-2 py-3 w-10">
                <input
                  type="checkbox"
                  class="rounded border-neutral-300"
                  :checked="allPageSelected"
                  @change="toggleSelectAllPage($event.target.checked)"
                />
              </th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.id") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.employee") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.period") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.basicSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.grossSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.netSalary") }}</th>
              <th class="px-3 py-3 font-medium uppercase text-xs tracking-wide">{{ t("admin.payroll.col.status") }}</th>
              <th class="pr-5 pl-3 py-3 font-medium uppercase text-xs tracking-wide text-right w-16">
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="!loading && records.length === 0">
              <td colspan="9" class="px-5 py-6 text-center text-neutral-500 text-sm">
                {{ t("admin.payroll.empty") }}
              </td>
            </tr>
            <tr
              v-for="row in paginatedRows"
              :key="row.id"
              class="hover:bg-neutral-50/80 transition-colors"
            >
              <td class="pl-5 pr-2 py-3 align-middle" @click.stop>
                <input
                  v-model="selectedIds"
                  type="checkbox"
                  class="rounded border-neutral-300"
                  :value="row.id"
                />
              </td>
              <td class="px-3 py-3 text-neutral-700 font-mono text-xs">{{ row.id }}</td>
              <td class="px-3 py-3">
                <button
                  type="button"
                  class="flex items-center gap-3 text-left w-full group"
                  @click="$router.push(`/employees/${row.employeeId}`)"
                >
                  <EmployeeAvatar
                    :name="row.employeeName"
                    :avatar-url="row.avatarUrl"
                    size-class="h-10 w-10 text-xs font-semibold"
                    fallback-class="text-white"
                    :style="{ backgroundColor: avatarColor(row.employeeName) }"
                  />
                  <span class="min-w-0">
                    <span class="block font-semibold text-neutral-900 group-hover:text-secondary-700">
                      {{ row.employeeName }}
                    </span>
                    <span class="block text-xs text-neutral-500">{{ row.empCode }}</span>
                  </span>
                </button>
              </td>
              <td class="px-3 py-3 text-neutral-700">{{ row.period }}</td>
              <td class="px-3 py-3 font-medium text-neutral-900">
                {{ formatMoney(row.basicSalary, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-primary-600">
                {{ formatMoney(row.grossSalary, row.currency) }}
              </td>
              <td class="px-3 py-3 font-medium text-green-700">
                {{ formatMoney(row.netSalary, row.currency) }}
              </td>
              <td class="px-3 py-3">
                <span :class="['inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', statusBadgeClass(row.status)]">
                  {{ statusLabel(row.status) }}
                </span>
              </td>
              <td class="pr-5 pl-3 py-3 text-right" @click.stop>
                <TableRowMenu
                  :open="openMenuId === row.id"
                  :aria-label="t('admin.payroll.rowActions')"
                  @toggle="toggleRowMenu(row.id)"
                  @close="openMenuId = null"
                >
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 font-medium"
                    @click="openDeleteConfirm(row)"
                  >
                    {{ t("admin.payroll.delete") }}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    @click="openMenuId = null; $router.push(`/payroll/show/${row.id}`)"
                  >
                    {{ t("admin.payroll.viewSlip") }}
                  </button>
                </TableRowMenu>
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

  <!-- Confirmation suppression -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deleteConfirmOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-records-delete-title"
        @click.self="closeDeleteConfirm"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden"
          @click.stop
        >
          <div class="px-6 pt-8 pb-2 flex flex-col items-center text-center">
            <div
              class="w-16 h-16 rounded-full bg-error-100 text-error-600 flex items-center justify-center mb-4 ring-4 ring-error-50"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h2 id="payroll-records-delete-title" class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.deleteTitle") }}</h2>
            <p v-if="rowToDelete" class="mt-3 text-sm text-neutral-600 leading-relaxed">
              {{ t("admin.payroll.deleteMessage", { id: rowToDelete.id, name: rowToDelete.employeeName }) }}
            </p>
          </div>
          <div class="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center border-t border-neutral-100 bg-neutral-50/80">
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              :disabled="deleteLoading"
              @click="closeDeleteConfirm"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-error-600 hover:bg-error-700 shadow-sm transition-colors disabled:opacity-60"
              :disabled="deleteLoading"
              @click="confirmDeleteRecord"
            >
              {{ t("admin.payroll.delete") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Génération manuelle employé par employé -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="generateOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-records-generate-title"
        @click.self="closeGenerateModal"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden"
          @click.stop
        >
          <div class="px-6 pt-6 pb-2">
            <h2 id="payroll-records-generate-title" class="text-xl font-bold text-neutral-900">
              {{ t("admin.payroll.generate.title") }}
            </h2>
            <p class="mt-2 text-sm text-neutral-600 leading-relaxed">
              {{ t("admin.payroll.generate.subtitle") }}
            </p>
            <p
              v-if="autoGenerationEnabled"
              class="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800"
            >
              {{ t("admin.payroll.generate.autoBanner") }}
            </p>
          </div>
          <form class="px-6 py-4 space-y-4" @submit.prevent="confirmGenerate">
            <div>
              <label class="block text-sm font-medium text-neutral-800 mb-1" for="payroll-generate-employee">
                {{ t("admin.payroll.generate.employee") }}
              </label>
              <select
                id="payroll-generate-employee"
                v-model="generateForm.employeeId"
                class="input-base text-sm"
                :disabled="generating"
              >
                <option value="">{{ t("admin.payroll.generate.chooseEmployee") }}</option>
                <option v-for="e in employeeOptions" :key="e.id" :value="String(e.id)">
                  {{ e.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-800 mb-1" for="payroll-generate-period">
                {{ t("admin.payroll.generate.period") }}
              </label>
              <input
                id="payroll-generate-period"
                v-model="generateForm.period"
                type="month"
                class="input-base text-sm"
                :disabled="generating"
              />
            </div>
            <p
              v-if="hasLockedSlip"
              class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
            >
              {{ t("admin.payroll.generate.lockedWarning") }}
            </p>
            <p v-if="generateError" class="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {{ generateError }}
            </p>
            <p v-if="generateSuccess" class="rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-sm text-success-700">
              {{ generateSuccess }}
            </p>
          </form>
          <div class="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t border-neutral-100 bg-neutral-50/80">
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              :disabled="generating"
              @click="closeGenerateModal"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-700 shadow-sm transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
              :disabled="generating"
              @click="confirmGenerate"
            >
              <span
                v-if="generating"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              {{ generating ? t("admin.payroll.generate.generating") : t("admin.payroll.generate.submit") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Loader pendant suppression -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deleteLoading"
        class="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-neutral-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 px-10 py-9 max-w-sm w-full flex flex-col items-center text-center"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-error-100 border-t-error-600 animate-spin mb-5"
            aria-hidden="true"
          />
          <p class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.deleting") }}</p>
          <p class="text-sm text-neutral-500 mt-2">{{ t("admin.payroll.deletingMessage") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "../i18n/index.js";
import PayrollKpiCard from "../components/payroll/PayrollKpiCard.vue";
import PayrollFilterField from "../components/payroll/PayrollFilterField.vue";
import TableRowMenu from "../components/common/TableRowMenu.vue";
import EmployeeAvatar from "../components/common/EmployeeAvatar.vue";
import { usePayrollRecords } from "./payroll/composables/usePayrollRecords.js";
import { avatarColor } from "./payroll/utils/payroll-http.js";

const { t, bcp47 } = useI18n();

const pageSizeOptions = [10, 25, 50, 100];
const quickFilters = computed(() => [
  { key: "pending", label: t("admin.payroll.status.pending"), classes: "border-amber-300 text-amber-800 hover:bg-amber-50" },
  { key: "approved", label: t("admin.payroll.status.approved"), classes: "border-green-300 text-green-800 hover:bg-green-50" },
  { key: "thisMonth", label: t("admin.payroll.filter.thisMonth"), classes: "border-sky-300 text-sky-800 hover:bg-sky-50" },
  { key: "lastMonth", label: t("admin.payroll.filter.lastMonth"), classes: "border-secondary-300 text-secondary-800 hover:bg-secondary-50" },
]);

const {
  records,
  employeeOptions,
  cycleOptions,
  kpi,
  loading,
  deleting: deleteLoading,
  generating,
  generateError,
  generateSuccess,
  autoGenerationEnabled,
  generateForm,
  hasLockedSlip,
  error,
  filters,
  searchQuery,
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedRows,
  rangeStart,
  rangeEnd,
  bootstrap,
  applyFilters,
  resetFilters,
  applyQuickFilter,
  setSearchAndReload,
  deleteRecord,
  resetGenerateForm,
  generateOne,
  statusLabel,
  statusBadgeClass,
} = usePayrollRecords();

const filtersOpen = ref(true);
const bulkAction = ref("");
const selectedIds = ref([]);
const openMenuId = ref(null);

const deleteConfirmOpen = ref(false);
const rowToDelete = ref(null);
const generateOpen = ref(false);

const payrollRecordsSection = ref(null);

let searchDebounce = null;

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

function openGenerateModal() {
  resetGenerateForm();
  generateOpen.value = true;
}

function closeGenerateModal() {
  if (generating.value) return;
  generateOpen.value = false;
}

async function confirmGenerate() {
  const ok = await generateOne();
  if (ok) {
    generateForm.value = { ...generateForm.value, employeeId: "" };
  }
}

function openDeleteConfirm(row) {
  rowToDelete.value = row;
  openMenuId.value = null;
  deleteConfirmOpen.value = true;
}

function closeDeleteConfirm() {
  if (deleteLoading.value) return;
  deleteConfirmOpen.value = false;
  rowToDelete.value = null;
}

async function confirmDeleteRecord() {
  const row = rowToDelete.value;
  if (!row) return;
  try {
    await deleteRecord(row.id);
    selectedIds.value = selectedIds.value.filter((x) => x !== row.id);
    deleteConfirmOpen.value = false;
    rowToDelete.value = null;
    const tp = Math.max(1, Math.ceil(records.value.length / itemsPerPage.value));
    if (currentPage.value > tp) currentPage.value = tp;
  } catch {
    // error exposé via composable
  }
}

const visiblePages = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  const max = 4;
  let start = Math.max(1, cur - Math.floor(max / 2));
  let end = Math.min(total, start + max - 1);
  if (end - start < max - 1) start = Math.max(1, end - max + 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const allPageSelected = computed(() => {
  const ids = paginatedRows.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id));
});

function toggleSelectAllPage(checked) {
  const ids = paginatedRows.value.map((r) => r.id);
  if (checked) {
    selectedIds.value = [...new Set([...selectedIds.value, ...ids])];
  } else {
    const set = new Set(ids);
    selectedIds.value = selectedIds.value.filter((id) => !set.has(id));
  }
}

function toggleRowMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
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

onMounted(async () => {
  document.addEventListener("click", onDocumentClick);
  await bootstrap();
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
  if (searchDebounce) clearTimeout(searchDebounce);
});
</script>
