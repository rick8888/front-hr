<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.components.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.components.subtitle") }}
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
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.components.breadcrumb.components") }}</span>
        </nav>
        <button type="button" class="btn-secondary inline-flex items-center gap-2" @click="openAddModal">
          <span class="text-lg leading-none">+</span>
          {{ t("admin.payroll.components.add") }}
        </button>
      </div>
    </div>

    <div
      v-if="storeError"
      class="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ storeError }}
    </div>

    <div
      class="mb-6 flex gap-3 rounded-xl border border-info-500/20 bg-info-50 px-4 py-3 text-sm text-neutral-700"
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
      <p>
        <strong class="text-neutral-900">{{ t("admin.payroll.components.helpTitle") }}</strong>
        {{ t("admin.payroll.components.helpText") }}
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.components.kpi.total") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.total }}</p>
        </div>
      </div>
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-success-50 text-success-600 flex items-center justify-center text-xl font-bold"
        >
          +
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.components.kpi.gains") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-success-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.gains }}</p>
        </div>
      </div>
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-error-50 text-error-600 flex items-center justify-center text-xl font-bold"
        >
          −
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.components.kpi.deductions") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-error-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.deductions }}</p>
        </div>
      </div>
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.components.kpi.baseSalary") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.baseCount }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
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
            v-model="searchQuery"
            type="search"
            :placeholder="t('admin.payroll.components.searchPlaceholder')"
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

      <div class="overflow-x-auto relative min-h-[200px]">
        <table class="w-full text-sm min-w-[1100px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="px-4 py-3 font-medium w-12">{{ t("admin.payroll.col.id") }}</th>
              <th class="px-4 py-3 font-medium min-w-[160px]">{{ t("admin.payroll.components.col.name") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.components.col.code") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.components.col.type") }}</th>
              <th class="px-4 py-3 font-medium min-w-[140px]">{{ t("admin.payroll.components.col.calculation") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.components.col.assiette") }}</th>
              <th class="px-4 py-3 font-medium min-w-[120px]">{{ t("admin.payroll.components.col.dependsOn") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.components.col.impact") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.components.col.step") }}</th>
              <th class="px-4 py-3 font-medium w-20 text-right">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody v-if="loading" class="divide-y divide-neutral-100" aria-busy="true">
            <tr v-for="n in 6" :key="`sk-${n}`">
              <td class="px-4 py-4">
                <div class="h-4 w-6 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-36 animate-pulse rounded bg-neutral-100" />
                <div class="mt-2 h-3 w-24 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-16 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-24 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-14 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="flex gap-1">
                  <div class="h-5 w-12 animate-pulse rounded-full bg-neutral-100" />
                  <div class="h-5 w-12 animate-pulse rounded-full bg-neutral-100" />
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-16 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-20 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4 text-right">
                <div class="ml-auto h-5 w-5 animate-pulse rounded bg-neutral-100" />
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-neutral-100">
            <tr
              v-for="row in paginatedRows"
              :key="row.id"
              :title="row.flowHint"
              class="hover:bg-neutral-50/80 transition-colors"
            >
              <td class="px-4 py-3 text-neutral-700">{{ row.id }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-neutral-900">{{ row.name }}</span>
                  <span
                    v-if="row.base"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200"
                    :title="t('admin.payroll.components.baseTitleAttr')"
                  >
                    {{ t("admin.payroll.components.baseBadge") }}
                  </span>
                  <span
                    v-if="row.is_system"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-700"
                  >
                    {{ t("admin.payroll.components.systemBadge") }}
                  </span>
                  <span
                    v-if="row.is_taxable"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800"
                  >
                    {{ t("admin.payroll.components.taxableBadge") }}
                  </span>
                </div>
                <p
                  v-if="row.calculation_type === 'fixed' && row.default_value != null"
                  class="text-[11px] text-neutral-500 mt-1 font-mono"
                >
                  {{ t("admin.payroll.components.defaultValuePrefix", { value: row.default_value }) }}
                </p>
              </td>
              <td class="px-4 py-3 font-mono text-neutral-700">{{ row.code }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    row.type === 'earning'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ row.type === "earning" ? t("admin.payroll.earning") : t("admin.payroll.deduction") }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800 max-w-[220px] truncate font-mono"
                  :title="row.calculationLabel"
                >
                  {{ row.calculationLabel }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 cursor-help"
                  :title="assietteTitle(row.base_target)"
                >
                  {{ row.base_target }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="dep in row.dependencies"
                    :key="dep"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {{ dep }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in row.impact"
                    :key="tag"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    :class="impactBadgeClass(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-900"
                >
                  {{ row.stepLabel }}
                </span>
              </td>
              <td class="px-4 py-3 text-right relative">
                <button
                  type="button"
                  class="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  :aria-expanded="openMenuId === row.id"
                  :aria-label="t('common.actions')"
                  @click.stop="toggleMenu(row.id)"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                <div
                  v-if="openMenuId === row.id"
                  class="absolute right-4 top-full z-10 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-left"
                  @click.stop
                >
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    @click="openEdit(row)"
                  >
                    {{ t("common.edit") }}
                  </button>
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 disabled:opacity-40"
                    :disabled="row.is_system"
                    @click="removeRow(row)"
                  >
                    {{ t("common.delete") }}
                  </button>
                </div>
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
        v-if="!loading && filteredRows.length === 0"
        class="px-6 py-12 text-center text-neutral-500 text-sm"
      >
        {{ t("admin.payroll.components.emptySearch") }}
      </div>

      <div
        v-if="!loading && filteredRows.length > 0"
        class="px-6 py-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600"
      >
        <span>
          {{ t("common.rangeOf", { start: rangeStart, end: rangeEnd, total: filteredRows.length }) }}
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            {{ t("common.previous") }}
          </button>
          <span class="text-neutral-500">{{ t("common.pageOf", { current: currentPage, total: totalPages }) }}</span>
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

    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'component-modal-title'"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 id="component-modal-title" class="text-lg font-bold text-neutral-900">
              {{ editingId ? t("admin.payroll.components.modal.edit") : t("admin.payroll.components.modal.add") }}
            </h2>
            <button
              type="button"
              class="text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
              :aria-label="t('common.close')"
              @click="closeModal"
            >
              ×
            </button>
          </div>
          <form class="px-6 py-4 space-y-3" @submit.prevent="submitForm">
            <!-- Salaire de base (convention moteur / structure) -->
            <div
              class="rounded-lg border px-3 py-3 space-y-2"
              :class="
                form.base
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-neutral-200 bg-neutral-50'
              "
            >
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="form.base"
                  type="checkbox"
                  class="mt-0.5 rounded border-neutral-300"
                  @change="onBaseFlagChange"
                />
                <span class="min-w-0">
                  <span class="block text-sm font-semibold text-neutral-900">
                    {{ t("admin.payroll.components.form.baseTitle") }}
                  </span>
                  <span class="block text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {{ t("admin.payroll.components.form.baseHelp") }}
                  </span>
                </span>
              </label>
              <p
                v-if="form.base"
                class="text-xs text-primary-800 pl-7"
              >
                {{ t("admin.payroll.components.form.baseLocked") }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.name") }}</label>
                <input v-model.trim="form.name" required class="input-base text-sm" type="text" />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.code") }}</label>
                <input
                  v-model.trim="form.code"
                  required
                  class="input-base text-sm font-mono uppercase"
                  type="text"
                  :placeholder="t('admin.payroll.components.form.codePlaceholder')"
                  :readonly="form.base"
                  :class="form.base ? 'bg-neutral-100 text-neutral-700 cursor-not-allowed' : ''"
                  @input="onCodeInput"
                />
                <p v-if="form.base" class="text-[11px] text-neutral-500 mt-1">
                  {{ t("admin.payroll.components.form.codeLocked") }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.type") }}</label>
                <select
                  v-model="form.type"
                  required
                  class="input-base text-sm"
                  :disabled="form.base"
                >
                  <option value="earning">{{ t("admin.payroll.earning") }}</option>
                  <option value="deduction">{{ t("admin.payroll.deduction") }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.components.form.calcMode") }}</label>
                <select
                  v-model="form.calculation_type"
                  required
                  class="input-base text-sm"
                  :disabled="form.base"
                  @change="onCalculationTypeChange"
                >
                  <option value="fixed">{{ t("admin.payroll.components.calc.fixed") }}</option>
                  <option value="percent">{{ t("admin.payroll.components.calc.percent") }}</option>
                  <option value="formula">{{ t("admin.payroll.components.calc.formula") }}</option>
                  <option value="tax">{{ t("admin.payroll.components.calc.tax") }}</option>
                </select>
              </div>

              <div v-if="form.calculation_type === 'formula'" class="md:col-span-2">
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.components.form.expression") }}</label>
                <p class="text-xs text-neutral-500 mb-1">
                  {{ t("admin.payroll.components.form.expressionHint") }}
                </p>
                <FormulaEditor ref="formulaEditorRef" v-model="form.formula" />
              </div>

              <div v-if="form.calculation_type === 'fixed' || form.calculation_type === 'percent'">
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  {{ t("admin.payroll.components.form.defaultValue") }}
                  <span class="text-neutral-400 font-normal">{{ t("admin.payroll.components.form.optional") }}</span>
                </label>
                <input
                  v-model.number="form.default_value"
                  class="input-base text-sm"
                  type="number"
                  step="any"
                  :placeholder="t('admin.payroll.components.form.valuePlaceholder')"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.components.form.assiette") }}</label>
                <select
                  v-model="form.base_target"
                  required
                  class="input-base text-sm"
                  :disabled="form.base"
                >
                  <option value="BASE">BASE</option>
                  <option value="GROSS">GROSS</option>
                  <option value="TAXABLE">TAXABLE</option>
                </select>
                <p class="text-[11px] text-neutral-500 mt-1">
                  {{ t("admin.payroll.components.form.assietteHint") }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.components.form.displayOrder") }}</label>
                <input
                  v-model.number="form.display_order"
                  required
                  class="input-base text-sm"
                  type="number"
                  min="0"
                  step="10"
                />
              </div>

              <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label class="inline-flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                  <input v-model="form.affects_gross" type="checkbox" class="rounded border-neutral-300" />
                  {{ t("admin.payroll.components.form.affectsGross") }}
                </label>
                <label class="inline-flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                  <input v-model="form.affects_net" type="checkbox" class="rounded border-neutral-300" />
                  {{ t("admin.payroll.components.form.affectsNet") }}
                </label>
                <label class="inline-flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                  <input v-model="form.is_taxable" type="checkbox" class="rounded border-neutral-300" />
                  {{ t("admin.payroll.components.form.taxable") }}
                </label>
              </div>

              <label
                class="inline-flex items-center gap-2 text-sm text-neutral-700 md:col-span-2"
                :class="systemLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'"
              >
                <input
                  v-model="form.is_system"
                  type="checkbox"
                  class="rounded border-neutral-300"
                  :disabled="systemLocked"
                />
                {{ t("admin.payroll.components.form.system") }}
              </label>
            </div>

            <p v-if="formError" class="text-sm text-error-600">{{ formError }}</p>
            <div class="flex justify-end gap-3 pt-3 border-t border-neutral-200">
              <button type="button" class="btn-outline" @click="closeModal">{{ t("common.cancel") }}</button>
              <button type="submit" class="btn-secondary" :disabled="saving">
                {{ saving ? t("common.saving") : t("common.save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "../../i18n/index.js";
import FormulaEditor from "../../components/payroll/FormulaEditor.vue";
import { useSalaryComponentStore } from "./stores/salary-component.store.js";

const { t } = useI18n();

const store = useSalaryComponentStore();
const {
  managementItems: components,
  loading,
  saving,
  error: storeError,
  stats,
} = storeToRefs(store);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const openMenuId = ref(null);
const modalOpen = ref(false);
const editingId = ref(null);
const formError = ref("");
const formulaEditorRef = ref(null);

const form = ref(emptyForm());

function emptyForm() {
  return {
    name: "",
    code: "",
    type: "earning",
    calculation_type: "fixed",
    base_target: "BASE",
    formula: "",
    default_value: null,
    affects_gross: true,
    affects_net: true,
    is_taxable: true,
    display_order: 0,
    base: false,
    is_system: false,
  };
}

function extractDependencies(formula) {
  if (!formula) return [];
  const matches = String(formula).match(/\b(BASE|GROSS|TAXABLE|NET)\b/g);
  return matches ? [...new Set(matches)] : [];
}

function getDependencies(component) {
  const raw = [component.base_target, ...extractDependencies(component.formula)].filter(Boolean);
  return [...new Set(raw)];
}

function getCalculationLabel(component) {
  switch (component.calculation_type) {
    case "fixed":
      return t("admin.payroll.components.calc.fixed");
    case "percent":
      return t("admin.payroll.components.calc.percent");
    case "formula":
      return component.formula || "-";
    case "tax":
      return t("admin.payroll.components.calc.tax");
    default:
      return String(component.calculation_type ?? "-");
  }
}

function getImpact(component) {
  const isDed = component.type === "deduction";
  const grossSign = isDed ? "-" : "+";
  const netSign = isDed ? "-" : "+";
  const parts = [];
  if (component.affects_gross) parts.push(`${grossSign}GROSS`);
  if (component.affects_net) parts.push(`${netSign}NET`);
  return parts;
}

function getStepLabel(component) {
  if (component.is_statutory) return t("admin.payroll.components.step.statutory");
  if (component.type === "earning") return t("admin.payroll.earning");
  if (component.type === "deduction" && component.base_target === "GROSS") {
    return t("admin.payroll.components.step.social");
  }
  if (component.type === "deduction" && component.base_target === "TAXABLE") {
    return t("admin.payroll.components.step.tax");
  }
  if (component.type === "deduction") return t("admin.payroll.components.step.withholding");
  return "-";
}

function enrichRow(c) {
  return {
    ...c,
    dependencies: getDependencies(c),
    calculationLabel: getCalculationLabel(c),
    impact: getImpact(c),
    stepLabel: getStepLabel(c),
    flowHint: t("admin.payroll.components.flowHint"),
  };
}

function assietteTitle(target) {
  if (target === "TAXABLE") return t("admin.payroll.components.assiette.taxable");
  if (target === "GROSS") return t("admin.payroll.components.assiette.gross");
  if (target === "BASE") return t("admin.payroll.components.assiette.base");
  return "";
}

function impactBadgeClass(tag) {
  if (tag.startsWith("+")) return "bg-emerald-50 text-emerald-800 border border-emerald-200";
  if (tag.startsWith("-")) return "bg-rose-50 text-rose-800 border border-rose-200";
  return "bg-neutral-100 text-neutral-800 border border-neutral-200";
}

const sortedComponents = computed(() =>
  [...components.value].sort((a, b) => a.display_order - b.display_order)
);

watch(searchQuery, () => {
  currentPage.value = 1;
});

function rowMatchesQuery(c, q) {
  const enriched = enrichRow(c);
  return (
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    (c.formula && String(c.formula).toLowerCase().includes(q)) ||
    c.base_target.toLowerCase().includes(q) ||
    c.calculation_type.toLowerCase().includes(q) ||
    enriched.calculationLabel.toLowerCase().includes(q) ||
    enriched.dependencies.some((d) => d.toLowerCase().includes(q)) ||
    enriched.impact.some((i) => i.toLowerCase().includes(q)) ||
    enriched.stepLabel.toLowerCase().includes(q)
  );
}

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const base = sortedComponents.value;
  if (!q) return base;
  return base.filter((c) => rowMatchesQuery(c, q));
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value))
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRows.value.slice(start, start + itemsPerPage.value).map(enrichRow);
});

const rangeStart = computed(() => {
  if (!filteredRows.value.length) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const rangeEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, filteredRows.value.length);
});

const systemLocked = computed(() => {
  if (!editingId.value) return false;
  return components.value.find((c) => c.id === editingId.value)?.is_statutory ?? false;
});

const BASE_SALARY_CODE = "BASE_SALARY";

function onBaseFlagChange() {
  if (form.value.base) {
    form.value.code = BASE_SALARY_CODE;
    form.value.type = "earning";
    form.value.calculation_type = "fixed";
    form.value.base_target = "BASE";
    form.value.affects_gross = true;
    form.value.affects_net = true;
    form.value.is_taxable = true;
    form.value.formula = "";
    if (!form.value.name?.trim()) {
      form.value.name = t("admin.payroll.builder.baseSalaryName");
    }
  }
}

function onCodeInput() {
  const code = String(form.value.code || "")
    .replace(/\s+/g, "_")
    .toUpperCase();
  form.value.base = code === BASE_SALARY_CODE;
  if (form.value.base) onBaseFlagChange();
}

function onCalculationTypeChange() {
  if (form.value.base) {
    form.value.calculation_type = "fixed";
    form.value.formula = "";
    return;
  }
  if (form.value.calculation_type !== "formula") form.value.formula = "";
  if (form.value.calculation_type === "tax") {
    form.value.formula = null;
    form.value.default_value = null;
  }
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenus() {
  openMenuId.value = null;
}

function openAddModal() {
  editingId.value = null;
  formError.value = "";
  const maxOrder = sortedComponents.value.length
    ? Math.max(...sortedComponents.value.map((c) => c.display_order))
    : 0;
  form.value = { ...emptyForm(), display_order: maxOrder + 10 };
  modalOpen.value = true;
}

function openEdit(row) {
  closeMenus();
  const raw = components.value.find((c) => c.id === row.id);
  if (!raw) return;
  editingId.value = raw.id;
  formError.value = "";
  form.value = {
    name: raw.name,
    code: raw.code,
    type: raw.type,
    calculation_type: raw.calculation_type ?? "fixed",
    base_target: raw.base_target ?? "BASE",
    formula: raw.formula ?? "",
    default_value: raw.default_value ?? null,
    affects_gross: raw.affects_gross ?? true,
    affects_net: raw.affects_net ?? true,
    is_taxable: raw.is_taxable ?? true,
    display_order: raw.display_order,
    base: raw.base ?? false,
    is_system: raw.is_system ?? false,
  };
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingId.value = null;
  formError.value = "";
}

async function submitForm() {
  formError.value = "";
  if (form.value.base) {
    form.value.code = BASE_SALARY_CODE;
    form.value.type = "earning";
    form.value.calculation_type = "fixed";
  }
  const code = form.value.code.replace(/\s+/g, "_").toUpperCase();
  const duplicate = components.value.some(
    (c) => c.code === code && c.id !== editingId.value
  );
  if (duplicate) {
    formError.value =
      code === BASE_SALARY_CODE
        ? t("admin.payroll.components.error.duplicateBase")
        : t("admin.payroll.components.error.codeUsed");
    return;
  }
  if (form.value.base) {
    const otherBase = components.value.some(
      (c) => c.base && c.id !== editingId.value
    );
    if (otherBase) {
      formError.value = t("admin.payroll.components.error.oneBase");
      return;
    }
  }
  if (form.value.calculation_type === "formula" && !(form.value.formula || "").trim()) {
    formError.value = t("admin.payroll.components.error.formulaRequired");
    return;
  }
  if (
    form.value.calculation_type === "formula" &&
    formulaEditorRef.value &&
    !formulaEditorRef.value.isFormulaValid()
  ) {
    formError.value = t("admin.payroll.components.error.formulaInvalid");
    return;
  }
  if (systemLocked.value && form.value.calculation_type === "tax") {
    // allow save of non-calc fields blocked - statutory mostly locked
  }

  try {
    if (systemLocked.value) {
      formError.value = t("admin.payroll.components.error.statutoryLocked");
      return;
    }
    if (editingId.value) {
      await store.update(editingId.value, form.value);
    } else {
      if (form.value.calculation_type === "tax") {
        formError.value = t("admin.payroll.components.error.taxReserved");
        return;
      }
      await store.create(form.value);
    }
    closeModal();
  } catch {
    formError.value = storeError.value || t("admin.payroll.components.error.save");
  }
}

async function removeRow(row) {
  closeMenus();
  if (row.is_statutory || row.is_system) {
    formError.value = t("admin.payroll.components.error.statutoryNoDelete");
    return;
  }
  if (!confirm(t("admin.payroll.components.deleteConfirm", { name: row.name }))) return;
  try {
    await store.remove(row.id);
  } catch {
    alert(storeError.value || t("admin.payroll.components.error.delete"));
  }
}

function onDocClick() {
  closeMenus();
}

onMounted(async () => {
  document.addEventListener("click", onDocClick);
  await store.fetchAll();
});
onUnmounted(() => document.removeEventListener("click", onDocClick));
</script>
