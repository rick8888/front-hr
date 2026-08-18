<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <!-- Header (hors carte) -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.builder.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.builder.subtitle") }}
        </p>
      </div>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/salary-structures" class="hover:text-secondary-600">
          {{ t("admin.payroll.structures.breadcrumb.structures") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.payroll.builder.breadcrumb") }}</span>
      </nav>
    </div>

    <!-- Carte unique : stepper + étapes + navigation -->
    <div
      class="rounded-xl border border-neutral-200 bg-white shadow-sm flex flex-col"
    >
      <!-- Stepper -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/40"
      >
      <button
        v-for="s in steps"
        :key="s.id"
        type="button"
        class="flex items-center gap-3 flex-1 min-w-0 text-left sm:justify-center rounded-lg px-3 py-2 transition-colors"
        :class="
          step === s.id
            ? 'bg-secondary-50 text-secondary-800 ring-2 ring-secondary-200'
            : step > s.id
              ? 'text-neutral-500'
              : 'text-neutral-400'
        "
        @click="goToStep(s.id)"
      >
        <span
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5"
          :class="
            step === s.id
              ? 'bg-secondary-600 text-white'
              : step > s.id
                ? 'bg-neutral-200 text-neutral-600'
                : 'bg-neutral-100 text-neutral-400'
          "
          v-html="s.icon"
        ></span>
        <span class="min-w-0">
          <span class="block font-semibold text-sm">{{ s.title }}</span>
          <span class="block text-xs opacity-80 truncate">{{ s.sub }}</span>
        </span>
      </button>
      </div>

      <!-- Corps du wizard -->
      <div class="p-5 sm:p-6 flex-1 min-h-0">
    <div
      v-if="error"
      class="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <!-- Step 1 -->
    <div v-show="step === 1" class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-4">
        <div>
          <h2 class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.builder.selectEmployee") }}</h2>
          <p class="text-sm text-neutral-600 mt-1">
            {{ t("admin.payroll.builder.step1.sub") }}
          </p>
        </div>
        <div ref="employeePickerRef" class="relative">
          <label class="block text-sm font-medium text-neutral-700 mb-1">
            {{ t("admin.payroll.filter.employee") }}
          </label>
          <div class="relative">
            <input
              v-model="employeeSearch"
              type="text"
              class="input-base pr-14"
              :class="{ 'bg-neutral-50 cursor-wait': employeesLoading }"
              :placeholder="t('admin.payroll.builder.searchPlaceholder')"
              autocomplete="off"
              :disabled="employeesLoading"
              :aria-busy="employeesLoading"
              @focus="openEmployeeDropdown"
              @input="dropdownOpen = true"
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <!-- Loader : chargement de la liste employés en cours -->
              <span
                v-if="employeesLoading"
                class="inline-flex items-center justify-center w-8 h-8"
                role="status"
                aria-live="polite"
                :title="t('admin.payroll.builder.loadingEmployees')"
              >
                <span
                  class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ t("admin.payroll.builder.loadingEmployees") }}</span>
              </span>
              <template v-else>
                <button
                  v-if="selectedEmployee"
                  type="button"
                  class="p-1 rounded text-neutral-400 hover:bg-neutral-100"
                  :aria-label="t('admin.payroll.builder.clearSelection')"
                  @click="clearSelection"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <svg
                  class="w-4 h-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </template>
            </div>
          </div>
          <p
            v-if="employeesLoading"
            class="mt-1.5 text-xs text-neutral-500 flex items-center gap-1.5"
          >
            <span
              class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
              aria-hidden="true"
            />
            {{ t("admin.payroll.builder.loadingEmployees") }}
          </p>
          <div
            v-if="dropdownOpen"
            class="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-xl"
            @click.stop
          >
            <div
              v-if="employeesLoading"
              class="flex items-center gap-3 px-4 py-4 text-sm text-neutral-600"
            >
              <span
                class="inline-block h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
                aria-hidden="true"
              />
              {{ t("admin.payroll.builder.loadingEmployees") }}
            </div>
            <template v-else-if="filteredPickerEmployees.length">
              <button
                v-for="e in filteredPickerEmployees"
                :key="e.id"
                type="button"
                class="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 border-b border-neutral-50 last:border-0"
                :class="{
                  'bg-secondary-50 text-secondary-900': selectedId === e.id,
                }"
                @click="selectEmployee(e)"
              >
                <span class="font-medium">{{ e.name }}</span>
                <span class="text-neutral-500"> — {{ e.empCode }}</span>
                <span
                  v-if="e.departmentName && e.departmentName !== '—'"
                  class="block text-xs text-neutral-400 mt-0.5"
                >
                  {{ e.departmentName }}
                </span>
              </button>
            </template>
            <div v-else class="px-4 py-4 text-sm text-neutral-500">
              {{ t("admin.payroll.structures.emptySearch") }}
            </div>
          </div>
        </div>

        <div
          v-if="selectedEmployee"
          class="rounded-xl border border-secondary-200 bg-white p-5 shadow-sm relative"
        >
          <span
            class="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary-100 text-secondary-800"
          >
            {{ selectedEmployee.empCode }}
          </span>
          <div class="flex items-start gap-4 pr-24">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
              :style="{ backgroundColor: avatarColor(selectedEmployee.name) }"
            >
              {{ selectedEmployee.initials }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-neutral-900">{{ selectedEmployee.name }}</h3>
              <p class="text-sm text-neutral-600">{{ selectedEmployee.email || "—" }}</p>
              <p class="text-sm text-neutral-500 mt-1">
                {{ salaryStore.departmentNameForRow(selectedEmployee) }}
              </p>
            </div>
          </div>
          <div
            class="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm"
          >
            <div class="flex items-center gap-2 text-neutral-700">
              <svg class="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>{{ t("admin.payroll.structures.col.components") }} {{ selectedEmployee.assignedCount }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span
                :class="
                  selectedEmployee.structureStatus === 'complete'
                    ? 'text-green-700 font-medium'
                    : 'text-neutral-500'
                "
              >
                {{
                  selectedEmployee.structureStatus === "complete"
                    ? t("admin.payroll.builder.baseConfigured")
                    : t("admin.payroll.builder.baseMissing")
                }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-neutral-700">
              <span class="text-primary-600 font-bold">$</span>
              <span>
                {{ t("admin.payroll.builder.total") }}
                {{
                  selectedEmployee.totalFixed != null
                    ? formatUsd(selectedEmployee.totalFixed)
                    : "—"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="rounded-xl border border-info-200 bg-info-50 p-4 h-fit text-sm text-neutral-700"
      >
        <div class="flex gap-2 font-semibold text-neutral-900 mb-2">
          <svg class="w-5 h-5 text-info-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t("admin.payroll.builder.importantTitle") }}
        </div>
        <p>
          {{
            t("admin.payroll.builder.importantText", {
              base: t("admin.payroll.builder.baseSalaryName"),
            })
          }}
        </p>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-show="step === 2" class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.builder.addTitle") }}</h2>
        <p class="text-sm text-neutral-600 mt-1">{{ t("admin.payroll.builder.addSubtitle") }}</p>
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Component -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.builder.component") }}</label>
            <select v-model="addForm.componentCode" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.builder.selectComponent") }}</option>
              <option
                v-for="c in sortedAvailableComponents"
                :key="c.code"
                :value="c.code"
                :disabled="isComponentAlreadyAdded(c.code)"
              >
                {{ c.name }}
                <template v-if="c.source_type !== 'manual'">{{ t("admin.payroll.builder.autoSuffix") }}</template>
                <template v-if="isComponentAlreadyAdded(c.code)">{{ t("admin.payroll.builder.alreadyAdded") }}</template>
              </option>
            </select>
          </div>

          <!-- Value + Type toggle (groupés) -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.builder.value") }}</label>
            <div class="flex gap-2">
              <div
                class="flex rounded-lg border border-neutral-200 overflow-hidden p-0.5 bg-neutral-50 flex-shrink-0"
                :class="{ 'opacity-50 pointer-events-none': !isManualSource }"
              >
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="
                    addForm.valueKind === 'fixed'
                      ? 'bg-secondary-600 text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-white'
                  "
                  :disabled="!isManualSource"
                  @click="isManualSource && (addForm.valueKind = 'fixed')"
                >
                  $
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="
                    addForm.valueKind === 'percent'
                      ? 'bg-secondary-600 text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-white'
                  "
                  :disabled="!isManualSource"
                  @click="isManualSource && (addForm.valueKind = 'percent')"
                >
                  %
                </button>
              </div>
              <div class="relative flex-1">
                <span
                  v-if="isManualSource && addForm.valueKind === 'fixed'"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"
                >
                  $
                </span>
                <input
                  v-model.number="addForm.value"
                  type="number"
                  min="0"
                  step="0.01"
                  class="input-base text-sm"
                  :class="[
                    isManualSource && addForm.valueKind === 'fixed' ? 'pl-7' : '',
                    !isManualSource ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : '',
                  ]"
                  :placeholder="isManualSource ? '0.00' : t('admin.payroll.builder.autoCalculated')"
                  :disabled="!isManualSource"
                />
              </div>
            </div>
          </div>

          <!-- Effective From -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.builder.effectiveFrom") }}</label>
            <input v-model="addForm.effectiveFrom" type="date" class="input-base text-sm" />
          </div>

          <!-- Effective To -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.builder.effectiveTo") }}</label>
            <input v-model="addForm.effectiveTo" type="date" class="input-base text-sm" />
          </div>
        </div>

        <!-- Actions bar -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
          <label class="inline-flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input v-model="addForm.active" type="checkbox" class="rounded border-neutral-300" />
            {{ t("common.active") }}
          </label>
          <button type="button" class="btn-secondary" @click="submitAddOrUpdateLine">
            {{ editingLineId ? t("common.update") : t("admin.payroll.builder.addLine") }}
          </button>
        </div>

        <p v-if="addFormError" class="text-sm text-error-600 mt-3">{{ addFormError }}</p>
      </div>

      <div class="rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div
          class="flex items-center gap-2 px-4 py-3 bg-info-50 border-b border-info-100 text-sm font-medium text-neutral-800"
        >
          <svg class="w-5 h-5 text-info-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t("admin.payroll.builder.currentComponents") }}
          <span
            class="ml-2 px-2 py-0.5 rounded-full bg-white text-xs font-semibold text-info-800 border border-info-200"
          >
            {{ draftLines.length }}
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-neutral-50 text-neutral-600 text-left border-b border-neutral-200">
                <th class="px-4 py-3 font-medium">{{ t("admin.payroll.builder.component") }}</th>
                <th class="px-4 py-3 font-medium">{{ t("common.type") }}</th>
                <th class="px-4 py-3 font-medium">{{ t("admin.payroll.builder.value") }}</th>
                <th class="px-4 py-3 font-medium">{{ t("admin.payroll.col.period") }}</th>
                <th class="px-4 py-3 font-medium">{{ t("common.status") }}</th>
                <th class="px-4 py-3 font-medium w-24 text-right">{{ t("common.actions") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="line in sortedDraftLines" :key="line.id" class="hover:bg-neutral-50/80">
                <td class="px-4 py-3">
                  <span class="font-medium text-neutral-900">{{ line.name || catalogLabel(line.componentCode) }}</span>
                  <span
                    class="ml-2 text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
                  >
                    {{ shortCode(line.componentCode) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium uppercase"
                    :class="
                      isGainLine(line)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ isGainLine(line) ? t("admin.payroll.earning") : t("admin.payroll.deduction") }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium">
                  <span v-if="!isManualLine(line)" class="text-neutral-500 italic">
                    {{ t("admin.payroll.builder.autoCalculated") }}
                  </span>
                  <span v-else>{{ formatLineValue(line) }}</span>
                </td>
                <td class="px-4 py-3 text-neutral-600">{{ formatPeriod(line) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      line.active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'
                    "
                  >
                    {{ line.active ? t("common.active") : t("common.inactive") }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    type="button"
                    class="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 mr-1"
                    :aria-label="t('common.edit')"
                    @click="startEditLine(line)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="p-1.5 rounded-lg text-error-600 hover:bg-error-50"
                    :aria-label="t('common.delete')"
                    @click="removeLine(line.id)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!draftLines.length" class="px-4 py-8 text-center text-neutral-500 text-sm">
          {{
            t("admin.payroll.builder.emptyComponents", {
              base: t("admin.payroll.builder.baseSalaryName"),
            })
          }}
        </div>
      </div>
    </div>

    <!-- Step 3 -->
    <div v-show="step === 3" class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.builder.reviewTitle") }}</h2>
        <p class="text-sm text-neutral-600 mt-1">{{ t("admin.payroll.builder.reviewSubtitle") }}</p>
      </div>
      <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
            :style="{ backgroundColor: avatarColor(selectedEmployee?.name) }"
          >
            {{ selectedEmployee?.initials }}
          </div>
          <div>
            <p class="font-bold text-neutral-900">{{ selectedEmployee?.name }}</p>
            <p class="text-sm text-neutral-500">{{ selectedEmployee?.empCode }}</p>
          </div>
        </div>
        <div class="border-t border-neutral-100 pt-4">
          <p class="text-sm font-medium text-neutral-700 mb-2">
            {{ t("admin.payroll.builder.componentCount", { n: draftLines.length }) }}
          </p>
          <ul class="space-y-2 text-sm">
            <li
              v-for="line in draftLines"
              :key="line.id"
              class="flex justify-between gap-4 py-2 border-b border-neutral-50 last:border-0"
            >
              <span>{{ catalogLabel(line.componentCode) }}</span>
              <span class="font-medium">{{ formatLineValue(line) }}</span>
            </li>
          </ul>
        </div>
        <p v-if="!hasFullCatalogLines" class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {{
            t("admin.payroll.builder.incomplete", {
              n: missingCatalogCount,
              save: t("common.save"),
            })
          }}
        </p>
        <p v-else-if="!hasBaseSalaryLine" class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {{
            t("admin.payroll.builder.baseWarning", {
              base: t("admin.payroll.builder.baseSalaryName"),
            })
          }}
        </p>
      </div>
    </div>
      </div>

      <!-- Navigation (même conteneur que le wizard) -->
      <div
        class="flex flex-row justify-between items-center gap-4 px-5 sm:px-6 py-4 border-t border-neutral-200 bg-white"
      >
        <button
          v-if="step === 1"
          type="button"
          class="btn-outline inline-flex items-center gap-2"
          @click="backToList"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t("admin.payroll.builder.backToList") }}
        </button>
        <button
          v-else
          type="button"
          class="btn-outline inline-flex items-center gap-2"
          @click="prevStep"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t("common.back") }}
        </button>
        <div class="flex gap-2">
          <button
            v-if="step < 3"
            type="button"
            class="btn-secondary inline-flex items-center gap-2"
            :disabled="
              employeesLoading || (step === 1 && !selectedEmployee)
            "
            @click="nextStep"
          >
            {{ t("common.next") }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            v-else
            type="button"
            class="btn-secondary inline-flex items-center gap-2"
            :disabled="!canSaveStructure || saving"
            @click="saveAndLeave"
          >
            {{ saving ? t("common.saving") : t("common.save") }}
          </button>
        </div>
        <p v-if="saveError" class="px-5 pb-3 text-sm text-error-600">{{ saveError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  useSalaryStructureStore,
  catalogLabel,
  metaForCode,
  newLineId,
} from "./stores/salary-structure.store.js";
import { useSalaryComponentStore } from "./stores/salary-component.store.js";
import { avatarColor } from "./utils/payroll-http.js";
import { useI18n } from "../../i18n/index.js";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const salaryStore = useSalaryStructureStore();
const componentsStore = useSalaryComponentStore();
const { employees, loading: employeesLoading, error } = storeToRefs(salaryStore);
const { catalog } = storeToRefs(componentsStore);

const step = ref(1);
const employeeSearch = ref("");
const dropdownOpen = ref(false);
const employeePickerRef = ref(null);
const selectedId = ref(null);
const draftLines = ref([]);
const editingLineId = ref(null);
const addFormError = ref("");
const saveError = ref("");
const saving = ref(false);

function openEmployeeDropdown() {
  dropdownOpen.value = true;
}

const availableComponents = catalog;

function emptyAddForm() {
  return {
    componentCode: "",
    valueKind: "fixed",
    value: 0,
    effectiveFrom: new Date().toISOString().slice(0, 10),
    effectiveTo: "",
    active: true,
  };
}

const addForm = ref(emptyAddForm());

const steps = computed(() => [
  {
    id: 1,
    title: t("admin.payroll.builder.step1.title"),
    sub: t("admin.payroll.builder.step1.sub"),
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
  },
  {
    id: 2,
    title: t("admin.payroll.builder.step2.title"),
    sub: t("admin.payroll.builder.step2.sub"),
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>`,
  },
  {
    id: 3,
    title: t("admin.payroll.builder.step3.title"),
    sub: t("admin.payroll.builder.step3.sub"),
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  },
]);

const selectedEmployee = computed(() =>
  selectedId.value ? salaryStore.getEmployee(selectedId.value) : null
);

const filteredPickerEmployees = computed(() => {
  const q = employeeSearch.value.trim().toLowerCase();
  return employees.value.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.empCode.toLowerCase().includes(q) ||
      (e.email && e.email.toLowerCase().includes(q))
  );
});

const hasBaseSalaryLine = computed(() =>
  draftLines.value.some((l) => l.active && (l.componentCode === "BASE_SALARY" || l.base))
);

const expectedCatalogCodes = computed(() =>
  availableComponents.value.map((c) => c.code).filter(Boolean)
);

const hasFullCatalogLines = computed(() => {
  const expected = expectedCatalogCodes.value;
  if (!expected.length) return false;
  const present = new Set(
    draftLines.value.filter((l) => l.active).map((l) => l.componentCode)
  );
  return expected.every((code) => present.has(code));
});

const missingCatalogCount = computed(() => {
  const present = new Set(
    draftLines.value.filter((l) => l.active).map((l) => l.componentCode)
  );
  return expectedCatalogCodes.value.filter((code) => !present.has(code)).length;
});

/** Enregistrement autorisé même si catalogue incomplet — au moins 1 composant actif. */
const canSaveStructure = computed(() =>
  draftLines.value.some((l) => l.active && l.componentCode)
);

const sortedAvailableComponents = computed(() => {
  return [...availableComponents.value].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
  );
});

const sortedDraftLines = computed(() => {
  return [...draftLines.value].sort(
    (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
  );
});

const selectedComponent = computed(() => {
  if (!addForm.value.componentCode) return null;
  return (
    availableComponents.value.find((c) => c.code === addForm.value.componentCode) ?? null
  );
});

const isManualSource = computed(() => {
  if (!selectedComponent.value) return true;
  return selectedComponent.value.source_type === "manual";
});

function isComponentAlreadyAdded(code) {
  if (editingLineId.value) {
    const editing = draftLines.value.find((l) => l.id === editingLineId.value);
    if (editing && editing.componentCode === code) return false;
  }
  return draftLines.value.some((l) => l.componentCode === code);
}

function isGainLine(line) {
  return line.type === "gain" || line.type === "earning";
}

function isManualLine(line) {
  if (line.sourceType) return line.sourceType === "manual";
  const meta = availableComponents.value.find((c) => c.code === line.componentCode);
  return !meta || meta.source_type === "manual";
}

watch(
  () => addForm.value.componentCode,
  () => {
    if (!isManualSource.value) {
      addForm.value.value = 0;
    }
    addFormError.value = "";
  }
);

function formatUsd(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

function shortCode(code) {
  return (metaForCode(code)?.code || code).replace("_", "").slice(0, 4);
}

function formatLineValue(line) {
  if (line.value == null) return t("admin.payroll.builder.autoCalculated");
  if (!isManualLine(line)) return t("admin.payroll.builder.autoCalculated");
  if (line.valueKind === "percent") {
    return `${Number(line.value).toLocaleString("fr-FR", { maximumFractionDigits: 2 })}%`;
  }
  return formatUsd(line.value);
}

function formatPeriod(line) {
  const from = line.effectiveFrom
    ? new Date(line.effectiveFrom + "T12:00:00").toLocaleDateString("fr-FR")
    : "-";
  if (!line.effectiveTo) return `${from} - Ongoing`;
  const to = new Date(line.effectiveTo + "T12:00:00").toLocaleDateString("fr-FR");
  return `${from} - ${to}`;
}

function selectEmployee(e) {
  selectedId.value = e.id;
  employeeSearch.value = e.name;
  dropdownOpen.value = false;
}

function clearSelection() {
  selectedId.value = null;
  employeeSearch.value = "";
}

function enrichLine(line) {
  const meta = availableComponents.value.find((c) => c.code === line.componentCode);
  const sourceType = line.sourceType ?? meta?.source_type ?? "manual";
  return {
    ...line,
    name: line.name ?? meta?.name ?? catalogLabel(line.componentCode),
    type: meta?.type ?? (line.type === "earning" ? "gain" : line.type),
    sourceType,
    displayOrder: line.displayOrder ?? meta?.display_order ?? 999,
    base: line.base ?? !!meta?.base,
    value: sourceType === "manual" ? line.value : null,
    salary_component_id: line.salary_component_id ?? meta?.id,
  };
}

function initDraftLines() {
  const emp = selectedEmployee.value;
  if (!emp) return;
  if (emp.structureLines?.length) {
    draftLines.value = JSON.parse(JSON.stringify(emp.structureLines)).map(enrichLine);
    return;
  }
  draftLines.value = [];
}

function nextStep() {
  if (step.value === 1) {
    if (!selectedEmployee.value) return;
    initDraftLines();
  }
  if (step.value < 3) step.value += 1;
}

function prevStep() {
  if (step.value > 1) step.value -= 1;
}

function goToStep(target) {
  if (target >= step.value) return;
  if (target === 1) step.value = 1;
  else if (target === 2 && selectedEmployee.value) step.value = 2;
}

function backToList() {
  router.push({ name: "PayrollSalaryStructures" });
}

function addComponent() {
  addFormError.value = "";

  const code = addForm.value.componentCode;
  if (!code) {
    addFormError.value = t("admin.payroll.builder.error.selectComponent");
    return;
  }

  const comp = availableComponents.value.find((c) => c.code === code);
  if (!comp) {
    addFormError.value = t("admin.payroll.builder.error.invalidComponent");
    return;
  }

  const duplicateIdx = draftLines.value.findIndex((l) => l.componentCode === code);
  const isEditingSame =
    editingLineId.value &&
    draftLines.value.find((l) => l.id === editingLineId.value)?.componentCode === code;

  if (duplicateIdx !== -1 && !isEditingSame) {
    addFormError.value = `${comp.name ?? code}${t("admin.payroll.builder.alreadyAdded")}`;
    return;
  }

  if (comp.base && !isEditingSame) {
    const baseAlready = draftLines.value.some(
      (l) => l.base || l.componentCode === "BASE_SALARY"
    );
    if (baseAlready) {
      addFormError.value = t("admin.payroll.builder.error.oneBase");
      return;
    }
  }

  const sourceType = comp.source_type ?? "manual";
  const isManual = sourceType === "manual";

  const payload = {
    id: editingLineId.value || newLineId(),
    salary_component_id: comp.id,
    componentCode: comp.code,
    name: comp.name ?? catalogLabel(comp.code),
    type: comp.type === "earning" ? "gain" : comp.type,
    sourceType,
    valueKind: addForm.value.valueKind,
    value: isManual ? Number(addForm.value.value) || 0 : null,
    effectiveFrom: addForm.value.effectiveFrom,
    effectiveTo: addForm.value.effectiveTo || null,
    active: addForm.value.active,
    displayOrder: comp.display_order ?? 999,
    base: !!comp.base,
  };

  if (editingLineId.value) {
    const idx = draftLines.value.findIndex((l) => l.id === editingLineId.value);
    if (idx !== -1) draftLines.value[idx] = payload;
    editingLineId.value = null;
  } else {
    draftLines.value.push(payload);
  }

  resetAddForm();
}

function resetAddForm() {
  addForm.value = emptyAddForm();
  editingLineId.value = null;
  addFormError.value = "";
}

const submitAddOrUpdateLine = addComponent;

function startEditLine(line) {
  editingLineId.value = line.id;
  addFormError.value = "";
  addForm.value = {
    componentCode: line.componentCode,
    valueKind: line.valueKind || "fixed",
    value: line.value ?? 0,
    effectiveFrom: line.effectiveFrom || "",
    effectiveTo: line.effectiveTo || "",
    active: line.active,
  };
}

function removeLine(id) {
  draftLines.value = draftLines.value.filter((l) => l.id !== id);
  if (editingLineId.value === id) {
    resetAddForm();
  }
}

async function saveAndLeave() {
  if (!selectedEmployee.value) return;
  saveError.value = "";
  saving.value = true;
  try {
    await salaryStore.saveStructureFromBuilder(selectedId.value, draftLines.value);
    router.push({ name: "PayrollSalaryStructures" });
  } catch {
    saveError.value = salaryStore.error || t("admin.payroll.builder.error.save");
  } finally {
    saving.value = false;
  }
}

function onDocClick(event) {
  const root = employeePickerRef.value;
  if (root && event?.target instanceof Node && root.contains(event.target)) {
    return;
  }
  dropdownOpen.value = false;
}

function applyEmployeeFromQuery() {
  const q = route.query.employee;
  if (!q) return;
  const id = Number(q);
  if (Number.isNaN(id)) return;
  const emp = salaryStore.getEmployee(id);
  if (emp) {
    selectedId.value = id;
    employeeSearch.value = emp.name;
  }
}

async function bootstrap() {
  // Toujours recharger depuis l’API pour une page dynamique
  await Promise.all([
    salaryStore.fetchAll({ refreshDepartments: true }),
    componentsStore.fetchAll(),
  ]);
  applyEmployeeFromQuery();
}

onMounted(async () => {
  document.addEventListener("click", onDocClick);
  await bootstrap();
});

onUnmounted(() => document.removeEventListener("click", onDocClick));

watch(
  () => route.query.employee,
  () => {
    applyEmployeeFromQuery();
  }
);

// Quand le chargement des employés se termine, re-présélectionner via query
watch(employeesLoading, (busy, wasBusy) => {
  if (wasBusy && !busy) {
    applyEmployeeFromQuery();
  }
});
</script>
