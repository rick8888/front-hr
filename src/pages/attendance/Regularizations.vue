<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.regularizations.title") }}</h1>
      <nav
        class="text-sm text-neutral-500 flex items-center flex-wrap gap-1.5"
        aria-label="Breadcrumb"
      >
        <span class="text-neutral-500">HR</span>
        <span class="text-neutral-400">/</span>
        <RouterLink to="/attendance" class="hover:text-secondary-600">{{ t("admin.attendance.breadcrumb") }}</RouterLink>
        <span class="text-neutral-400">/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.attendance.regularizations.title") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
      <div
        v-for="kpi in kpiDisplay"
        :key="kpi.key"
        class="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-xl shadow-sm"
      >
        <div
          :class="['w-10 h-10 rounded-full flex items-center justify-center', kpi.iconBg]"
        >
          <component :is="kpi.icon" :class="['w-5 h-5', kpi.iconText]" />
        </div>
        <div>
          <p v-if="loading" class="flex h-8 items-center">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </p>
          <p v-else class="text-2xl font-semibold text-neutral-900 leading-tight">
            {{ kpi.value }}
          </p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ kpi.label }}</p>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 mb-6">
      <h2 class="text-sm font-semibold text-neutral-900 mb-4">{{ t("common.filters") }}</h2>
      <div class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">{{ t("admin.attendance.regularizations.fromDate") }}</label>
            <input
              v-model="filters.from"
              type="date"
              class="input-base text-sm w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">{{ t("admin.attendance.regularizations.toDate") }}</label>
            <input
              v-model="filters.to"
              type="date"
              class="input-base text-sm w-full"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">{{ t("common.status") }}</label>
            <select v-model="filters.status" class="input-base text-sm w-full">
              <option value="">{{ t("admin.attendance.regularizations.allStatus") }}</option>
              <option value="pending">{{ t("admin.attendance.regularizations.status.pending") }}</option>
              <option value="approved">{{ t("admin.attendance.regularizations.status.approved") }}</option>
              <option value="rejected">{{ t("admin.attendance.regularizations.status.rejected") }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">{{ t("common.type") }}</label>
            <select v-model="filters.type" class="input-base text-sm w-full">
              <option value="">{{ t("admin.attendance.regularizations.allTypes") }}</option>
              <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-600 mb-1">{{ t("common.employee") }}</label>
          <select v-model="filters.employeeId" class="input-base text-sm w-full max-w-2xl">
            <option value="">{{ t("admin.attendance.reports.allEmployees") }}</option>
            <option v-for="e in employeesList" :key="e.id" :value="String(e.id)">
              {{ e.name }}
            </option>
          </select>
        </div>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
            :disabled="loading"
            @click="applyFilters"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {{ t("common.applyFilters") }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-700 border border-neutral-200 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
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
            {{ t("common.resetFilters") }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-neutral-100"
      >
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.regularizations.listTitle") }}</h2>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          :disabled="loading"
          @click="openCreateModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ t("admin.attendance.regularizations.create") }}
        </button>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3"
      >
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.show") }}</span>
          <select
            v-model.number="pageSize"
            class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
          >
            <option v-for="n in [10, 25, 50, 100]" :key="n" :value="n">{{ n }}</option>
          </select>
          <span>{{ t("common.entries") }}</span>
        </label>
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.search") }}</span>
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('common.search')"
            class="w-48 sm:w-56 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm"
          />
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[960px]">
          <thead>
            <tr
              class="text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase border-t border-b border-neutral-100"
            >
              <th class="px-4 py-3">{{ t("admin.attendance.col.id") }}</th>
              <th class="px-4 py-3">{{ t("common.employee") }}</th>
              <th class="px-4 py-3">{{ t("common.department") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.regularizations.col.requestDate") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.regularizations.col.attendanceDate") }}</th>
              <th class="px-4 py-3">{{ t("common.type") }}</th>
              <th class="px-4 py-3">{{ t("common.status") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.regularizations.col.manager") }}</th>
              <th class="px-4 py-3 w-20 text-right">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-12 text-center text-sm text-neutral-500">
                <span class="inline-flex items-center gap-2">
                  <span
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
                    aria-hidden="true"
                  />
                  {{ t("common.loading") }}
                </span>
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="row in paginatedRows"
                :key="row.id"
                class="hover:bg-neutral-50/60"
              >
                <td class="px-4 py-3 text-neutral-700 font-mono text-xs">{{ row.id }}</td>
                <td class="px-4 py-3 text-neutral-900">{{ row.employeeName }}</td>
                <td class="px-4 py-3 text-neutral-600">{{ row.department }}</td>
                <td class="px-4 py-3 text-neutral-700 font-mono text-xs">{{ row.requestDate }}</td>
                <td class="px-4 py-3 text-neutral-700 font-mono text-xs">{{ row.attendanceDate }}</td>
                <td class="px-4 py-3">
                  <span class="text-xs text-neutral-800">{{ typeLabel(row.type) }}</span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                    :class="statusClass(row.status)"
                  >
                    {{ statusLabel(row.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-neutral-600">{{ row.manager }}</td>
                <td class="px-4 py-3 text-right" @click.stop>
                  <div class="relative inline-block text-left">
                    <button
                      type="button"
                      class="p-1 text-neutral-400 hover:text-neutral-600"
                      :aria-label="t('common.actions')"
                      @click="toggleMenu(row.id)"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                        />
                      </svg>
                    </button>
                    <div
                      v-if="openMenuId === row.id"
                      class="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
                    >
                      <button
                        v-if="row.status === 'pending'"
                        type="button"
                        class="block w-full px-3 py-1.5 text-sm text-success-700 hover:bg-success-50 text-left"
                        @click="requestApprove(row)"
                      >
                        {{ t("common.approve") }}
                      </button>
                      <button
                        v-if="row.status === 'pending'"
                        type="button"
                        class="block w-full px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-50 text-left"
                        @click="requestReject(row)"
                      >
                        {{ t("common.reject") }}
                      </button>
                      <button
                        type="button"
                        class="block w-full px-3 py-1.5 text-sm text-error-600 hover:bg-error-50 text-left"
                        @click="requestDelete(row)"
                      >
                        {{ t("common.delete") }}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="!paginatedRows.length">
                <td colspan="9" class="px-4 py-12 text-center text-sm text-neutral-500">
                  {{ t("admin.attendance.regularizations.empty") }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3 border-t border-neutral-100"
      >
        <p class="text-sm text-neutral-500">
          {{ t("common.showingEntries", { from: filteredRows.length === 0 ? 0 : start + 1, to: end, total: filteredRows.length }) }}
        </p>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="p-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="currentPage <= 1"
            @click="currentPage--"
            :aria-label="t('common.previous')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            class="p-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            :aria-label="t('common.next')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="createModalOpen"
        class="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-neutral-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
        @click.self="closeCreateModal"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-regularization-title"
          class="my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]"
          @click.stop
        >
          <div class="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 px-5 py-4 sm:px-7">
            <h3 id="create-regularization-title" class="text-xl font-bold tracking-tight text-slate-900">
              {{ t("admin.attendance.regularizations.modalAdd") }}
            </h3>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
              :aria-label="t('common.close')"
              :disabled="saving"
              @click="closeCreateModal"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form id="create-regularization-form" class="min-h-0 space-y-5 overflow-y-auto px-5 py-6 sm:px-7" @submit.prevent="submitCreateRequest">
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                  {{ t("common.employee") }} <span class="text-error-600">*</span>
                </label>
                <select
                  v-model="createForm.employeeId"
                  class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  :class="{ 'ring-1 ring-error-500': createErrors.employeeId }"
                >
                  <option value="">{{ t("admin.attendance.regularizations.selectEmployee") }}</option>
                  <option v-for="e in employeesList" :key="e.id" :value="String(e.id)">
                    {{ e.name }}
                  </option>
                </select>
                <p v-if="createErrors.employeeId" class="mt-1 text-xs text-error-600">{{ createErrors.employeeId }}</p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                  {{ t("common.date") }} <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="createForm.date"
                  type="date"
                  class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  :class="{ 'ring-1 ring-error-500': createErrors.date }"
                />
                <p v-if="createErrors.date" class="mt-1 text-xs text-error-600">{{ createErrors.date }}</p>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                {{ t("common.type") }} <span class="text-error-600">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="createForm.type"
                  class="input-base w-full appearance-none rounded-lg border-slate-200 bg-white py-2.5 pr-9 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  :class="{ 'ring-1 ring-error-500': createErrors.type }"
                >
                  <option value="">{{ t("admin.attendance.regularizations.selectType") }}</option>
                  <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <p v-if="createErrors.type" class="text-xs text-error-600 mt-0.5">{{ createErrors.type }}</p>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                  {{ t("admin.attendance.regularizations.checkIn") }}
                </label>
                <div class="relative">
                  <input
                    v-model="createForm.checkIn"
                    type="time"
                    step="60"
                    class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 pr-9 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                  <svg
                    class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                  {{ t("admin.attendance.regularizations.checkOut") }}
                </label>
                <div class="relative">
                  <input
                    v-model="createForm.checkOut"
                    type="time"
                    step="60"
                    class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 pr-9 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                  <svg
                    class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                {{ t("common.reason") }} <span class="text-error-600">*</span>
              </label>
              <textarea
                v-model="createForm.reason"
                maxlength="1000"
                rows="4"
                class="input-base w-full resize-y rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                :class="{ 'ring-1 ring-error-500': createErrors.reason }"
                :placeholder="t('admin.attendance.regularizations.reasonPlaceholder')"
              />
              <div class="mt-1 flex items-center justify-between gap-3">
                <p v-if="createErrors.reason" class="text-xs text-error-600">{{ createErrors.reason }}</p>
                <p v-else class="text-xs text-slate-500">{{ t("admin.attendance.regularizations.maxChars") }}</p>
                <span class="shrink-0 text-xs tabular-nums text-slate-400">{{ createForm.reason.length }}/1000</span>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("admin.attendance.regularizations.attachments") }}</label>
              <div
                class="flex min-h-12 items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-2"
              >
                <label
                  class="shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
                >
                  {{ t("admin.attendance.regularizations.chooseFiles") }}
                  <input
                    :key="fileInputKey"
                    type="file"
                    class="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                    multiple
                    @change="onAttachmentChange"
                  />
                </label>
                <span class="min-w-0 truncate px-2 text-sm text-slate-500">
                  {{ attachmentLabel }}
                </span>
              </div>
              <p v-if="createErrors.files" class="text-xs text-error-600 mt-0.5">{{ createErrors.files }}</p>
              <p class="mt-2 text-xs leading-relaxed text-slate-500">
                {{ t("admin.attendance.regularizations.filesHint") }}
              </p>
            </div>
          </form>

          <div class="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-7">
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              form="create-regularization-form"
              :disabled="saving"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
              {{ saving ? t("common.submitting") : t("admin.attendance.regularizations.submit") }}
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50"
              :disabled="saving"
              @click="closeCreateModal"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ t("common.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmDialog
      v-model="confirmOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :cancel-text="t('common.cancel')"
      :loading-text="confirmState.loadingText"
      :variant="confirmState.variant"
      :busy="confirmBusy"
      :close-on-backdrop="!confirmBusy"
      @confirm="confirmAction"
      @cancel="cancelConfirm"
    />
  </div>
</template>

<script setup>
import { h, computed, onMounted, onUnmounted } from "vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import { useI18n } from "../../i18n/index.js";
import { useRegularizations } from "./composables/useRegularizations.js";

const { t } = useI18n();

const IconDoc = () =>
  h(
    "svg",
    { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      }),
    ]
  );
const IconClock = () =>
  h(
    "svg",
    { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ]
  );
const IconCheck = () =>
  h(
    "svg",
    { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M5 13l4 4L19 7",
      }),
    ]
  );
const IconX = () =>
  h(
    "svg",
    { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M6 18L18 6M6 6l12 12",
      }),
    ]
  );

const {
  employeesList,
  typeOptions,
  typeLabel,
  loading,
  saving,
  confirmBusy,
  error,
  filters,
  searchQuery,
  pageSize,
  currentPage,
  openMenuId,
  createModalOpen,
  createForm,
  createErrors,
  fileInputKey,
  attachmentLabel,
  confirmOpen,
  confirmState,
  filteredRows,
  totalPages,
  start,
  end,
  paginatedRows,
  kpiCards,
  loadData,
  loadEmployees,
  loadTypes,
  applyFilters,
  resetFilters,
  toggleMenu,
  closeMenus,
  onAttachmentChange,
  openCreateModal,
  closeCreateModal,
  submitCreateRequest,
  requestApprove,
  requestReject,
  requestDelete,
  confirmAction,
  cancelConfirm,
} = useRegularizations();

const kpiDisplay = computed(() => [
  {
    key: "total",
    label: t("admin.attendance.regularizations.kpi.total"),
    value: kpiCards.value.total,
    icon: IconDoc,
    iconBg: "bg-secondary-50",
    iconText: "text-secondary-600",
  },
  {
    key: "pending",
    label: t("admin.attendance.regularizations.kpi.pending"),
    value: kpiCards.value.pending,
    icon: IconClock,
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    key: "approved",
    label: t("admin.attendance.regularizations.kpi.approved"),
    value: kpiCards.value.approvedToday,
    icon: IconCheck,
    iconBg: "bg-success-100",
    iconText: "text-success-600",
  },
  {
    key: "rejected",
    label: t("admin.attendance.regularizations.kpi.rejected"),
    value: kpiCards.value.rejectedToday,
    icon: IconX,
    iconBg: "bg-error-50",
    iconText: "text-error-500",
  },
]);

function statusLabel(s) {
  return {
    pending: t("admin.attendance.regularizations.status.pending"),
    approved: t("admin.attendance.regularizations.status.approved"),
    rejected: t("admin.attendance.regularizations.status.rejected"),
  }[s] || s;
}
function statusClass(s) {
  if (s === "pending") return "bg-amber-100 text-amber-800";
  if (s === "approved") return "bg-success-100 text-success-800";
  if (s === "rejected") return "bg-error-100 text-error-800";
  return "bg-neutral-100 text-neutral-600";
}

onMounted(() => {
  loadEmployees();
  loadTypes();
  loadData();
  document.addEventListener("click", closeMenus);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenus);
});
</script>
