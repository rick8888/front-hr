<template>
  <div class="p-8 space-y-6" @click="closeMenus">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">{{ t('settings.holidays.title') }}</h2>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t('settings.holidays.subtitle') }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold disabled:opacity-50 shrink-0"
        :disabled="loading"
        @click="openAddHoliday"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('settings.holidays.add') }}
      </button>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">{{ t('settings.holidays.kpi.active') }}</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ loading ? "…" : activeCount }}
        </p>
      </div>
      <div class="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">{{ t('settings.holidays.kpi.total') }}</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ loading ? "…" : holidays.length }}
        </p>
      </div>
      <div class="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">{{ t('settings.holidays.kpi.thisYear') }}</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ loading ? "…" : thisYearCount }}
        </p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
        <span>{{ t('settings.holidays.show') }}</span>
        <select
          v-model.number="pageSize"
          class="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          <option v-for="n in [10, 25, 50]" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
      <div class="relative w-full sm:w-72">
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('settings.holidays.searchPlaceholder')"
          class="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <svg
          class="absolute left-3 top-2.5 w-4 h-4 text-neutral-400"
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

    <div class="overflow-x-auto border border-neutral-200 rounded-xl bg-white">
      <table class="w-full text-sm min-w-[720px]">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200 text-left">
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.holidays.col.name') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.holidays.col.date') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.holidays.col.type') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.holidays.col.scope') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.holidays.col.status') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase text-right">
              {{ t('settings.holidays.col.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="6" class="px-5 py-10 text-center text-neutral-500">{{ t('common.loading') }}</td>
          </tr>
          <template v-else>
            <tr
              v-for="row in paginatedHolidays"
              :key="row.id"
              class="hover:bg-neutral-50/80"
            >
              <td class="px-5 py-3.5">
                <p class="font-medium text-neutral-900">{{ row.name }}</p>
                <p v-if="row.code" class="text-xs font-mono text-neutral-400 mt-0.5">
                  {{ row.code }}
                </p>
              </td>
              <td class="px-5 py-3.5">
                <p class="font-mono text-xs text-neutral-800">{{ formatDate(row.date) }}</p>
                <p class="text-xs text-neutral-500 mt-0.5">{{ dayName(row.date) }}</p>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex px-2.5 py-0.5 rounded text-xs font-medium bg-secondary-50 text-secondary-700">
                  {{ typeLabel(row.type) }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-neutral-600 text-xs">
                {{ scopeLabel(row.applicableTo) }}
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    row.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-neutral-100 text-neutral-600'
                  "
                >
                  {{ row.status === "active" ? t('settings.holidays.status.active') : t('settings.holidays.status.inactive') }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right" @click.stop>
                <button
                  type="button"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3"
                  @click="editHoliday(row)"
                >
                  {{ t('settings.holidays.edit') }}
                </button>
                <button
                  type="button"
                  class="text-error-600 hover:text-error-700 text-sm font-medium"
                  @click="requestDelete(row)"
                >
                  {{ t('settings.holidays.delete') }}
                </button>
              </td>
            </tr>
            <tr v-if="!paginatedHolidays.length">
              <td colspan="6" class="px-5 py-10 text-center text-neutral-500">
                {{ t('settings.holidays.emptySearch') }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="filteredHolidays.length > pageSize"
      class="flex items-center justify-between text-sm text-neutral-600"
    >
      <span>{{ t('settings.holidays.paginationRange', { start: startIndex + 1, end: endIndex, total: filteredHolidays.length }) }}</span>
      <div class="flex gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded-md border border-neutral-200 disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        >
          {{ t('common.previous') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-md border border-neutral-200 disabled:opacity-40"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>

    <!-- Modal form -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-lg rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white">
          <h3 class="text-lg font-semibold text-neutral-900">
            {{ editingId ? t('settings.holidays.modal.edit') : t('settings.holidays.modal.add') }}
          </h3>
          <button type="button" class="text-neutral-400 hover:text-neutral-700 text-2xl" :disabled="saving" @click="closeModal">
            ×
          </button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">
                {{ t('settings.holidays.col.name') }} <span class="text-error-600">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                class="input-base text-sm w-full"
                :class="{ 'ring-1 ring-error-500': formErrors.name }"
                placeholder="Ex. Fête du travail"
              />
              <p v-if="formErrors.name" class="text-xs text-error-600 mt-1">{{ formErrors.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">
                {{ t('settings.holidays.form.code') }} <span class="text-error-600">*</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                class="input-base text-sm w-full font-mono uppercase"
                :class="{ 'ring-1 ring-error-500': formErrors.code }"
                placeholder="FETE_TRAVAIL"
              />
              <p v-if="formErrors.code" class="text-xs text-error-600 mt-1">{{ formErrors.code }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">
                {{ t('settings.holidays.form.date') }} <span class="text-error-600">*</span>
              </label>
              <input
                v-model="form.date"
                type="date"
                class="input-base text-sm w-full"
                :class="{ 'ring-1 ring-error-500': formErrors.date }"
              />
              <p v-if="formErrors.date" class="text-xs text-error-600 mt-1">{{ formErrors.date }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">
                {{ t('settings.holidays.form.type') }} <span class="text-error-600">*</span>
              </label>
              <select
                v-model="form.type"
                class="input-base text-sm w-full"
                :class="{ 'ring-1 ring-error-500': formErrors.type }"
              >
                <option value="">{{ t('settings.holidays.form.typeSelect') }}</option>
                <option value="public">{{ t('settings.holidays.type.public') }}</option>
                <option value="religious">{{ t('settings.holidays.type.religious') }}</option>
                <option value="company">{{ t('settings.holidays.type.company') }}</option>
                <option value="regional">{{ t('settings.holidays.type.regional') }}</option>
              </select>
              <p v-if="formErrors.type" class="text-xs text-error-600 mt-1">{{ formErrors.type }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              {{ t('settings.holidays.form.applicableTo') }} <span class="text-error-600">*</span>
            </label>
            <select v-model="form.applicableTo" class="input-base text-sm w-full">
              <option value="all">{{ t('settings.holidays.scope.all') }}</option>
              <option value="department">{{ t('settings.holidays.scope.department') }}</option>
              <option value="location">{{ t('settings.holidays.scope.location') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t('settings.holidays.form.description') }}</label>
            <textarea v-model="form.description" rows="2" class="input-base text-sm w-full" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center gap-2 text-sm text-neutral-700">
              <input v-model="form.recurring" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-primary-600" />
              {{ t('settings.holidays.form.recurring') }}
            </label>
            <label class="flex items-center gap-2 text-sm text-neutral-700">
              <input v-model="form.halfDay" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-primary-600" />
              {{ t('settings.holidays.form.halfDay') }}
            </label>
            <label class="flex items-center gap-2 text-sm text-neutral-700">
              <input v-model="form.optionalHoliday" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-primary-600" />
              {{ t('settings.holidays.form.optional') }}
            </label>
            <label class="flex items-center gap-2 text-sm text-neutral-700">
              <input v-model="form.visibleToEmployees" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-primary-600" />
              {{ t('settings.holidays.form.visible') }}
            </label>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50 sticky bottom-0">
          <button type="button" class="px-4 py-2 text-sm font-medium text-neutral-700 rounded-lg border border-neutral-200" :disabled="saving" @click="closeModal">
            {{ t('common.cancel') }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            :disabled="saving"
            @click="submitForm"
          >
            {{ saving ? "…" : editingId ? t('common.save') : t('settings.holidays.add') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete -->
    <div
      v-if="deleteOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="cancelDelete"
    >
      <div class="w-full max-w-md rounded-xl bg-white shadow-xl p-6" @click.stop>
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ t('settings.holidays.confirmDeleteTitle') }}</h3>
        <p class="text-sm text-neutral-600 mb-6">{{ deleteMessage }}</p>
        <div class="flex justify-end gap-3">
          <button type="button" class="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200" :disabled="deleting" @click="cancelDelete">
            {{ t('common.cancel') }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-lg bg-error-600 text-white hover:bg-error-700 disabled:opacity-50"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{ deleting ? "…" : t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "../../../i18n/index.js";
import { useHolidays } from "../../holidays/composables/useHolidays.js";

const { t, locale } = useI18n();

const {
  holidays,
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  pageSize,
  currentPage,
  modalOpen,
  editingId,
  form,
  formErrors,
  deleteOpen,
  deleteMessage,
  filteredHolidays,
  totalPages,
  startIndex,
  endIndex,
  paginatedHolidays,
  loadData,
  closeMenus,
  openAddHoliday,
  editHoliday,
  closeModal,
  submitForm,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useHolidays();

const activeCount = computed(
  () => holidays.value.filter((h) => h.status === "active").length
);

const thisYearCount = computed(() => {
  const y = new Date().getFullYear();
  return holidays.value.filter((h) => String(h.date || "").startsWith(String(y))).length;
});

function dateLocale() {
  return locale.value === "en" ? "en-US" : "fr-FR";
}

function formatDate(iso) {
  void locale.value;
  if (!iso) return "—";
  try {
    return new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString(dateLocale());
  } catch {
    return iso;
  }
}

function dayName(iso) {
  void locale.value;
  if (!iso) return "";
  try {
    return new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString(dateLocale(), {
      weekday: "long",
    });
  } catch {
    return "";
  }
}

function typeLabel(type) {
  void locale.value;
  const keys = {
    public: "settings.holidays.type.public",
    religious: "settings.holidays.type.religious",
    company: "settings.holidays.type.company",
    regional: "settings.holidays.type.regional",
  };
  return keys[type] ? t(keys[type]) : type || "—";
}

function scopeLabel(scope) {
  void locale.value;
  if (scope === "all") return t("settings.holidays.scope.all");
  if (scope === "department") return t("settings.holidays.scope.departmentShort");
  if (scope === "location") return t("settings.holidays.scope.locationShort");
  return scope || "—";
}

onMounted(() => {
  loadData();
});
</script>
