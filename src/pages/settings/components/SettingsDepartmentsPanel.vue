<template>
  <div class="space-y-6" @click="closeMenus">
    <div class="flex justify-end">
      <button
        type="button"
        class="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50"
        :disabled="loading"
        @click="openAddDepartment"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('settings.departments.add') }}
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
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">{{ t('settings.departments.kpi.active') }}</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ loading ? "…" : activeCount }}
        </p>
      </div>
      <div class="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">{{ t('settings.departments.kpi.total') }}</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ loading ? "…" : departments.length }}
        </p>
      </div>
      <div class="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">
          {{ t('settings.departments.kpi.searchResults') }}
        </p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ filteredDepartments.length }}
        </p>
      </div>
    </div>

    <div class="relative max-w-md">
      <input
        v-model="searchQuery"
        type="search"
        :placeholder="t('settings.departments.searchPlaceholder')"
        class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
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

    <div class="overflow-x-auto border border-neutral-200 rounded-xl bg-white">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200 text-left">
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.departments.col.name') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.departments.col.code') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.departments.col.parent') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.departments.col.description') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase">{{ t('settings.departments.col.status') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-neutral-600 uppercase text-right">
              {{ t('settings.departments.col.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="6" class="px-5 py-10 text-center text-neutral-500">{{ t('common.loading') }}</td>
          </tr>
          <template v-else>
            <tr
              v-for="dept in paginatedDepartments"
              :key="dept.id"
              class="hover:bg-neutral-50/80"
            >
              <td class="px-5 py-3.5 font-medium text-neutral-900">{{ dept.name }}</td>
              <td class="px-5 py-3.5 font-mono text-xs text-neutral-600">{{ dept.code || "—" }}</td>
              <td class="px-5 py-3.5 text-neutral-600">
                {{ parentLabel(dept) }}
              </td>
              <td class="px-5 py-3.5 text-neutral-500 max-w-[220px] truncate">
                {{ dept.description || "—" }}
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    dept.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-neutral-100 text-neutral-600'
                  "
                >
                  {{ dept.active ? t('settings.departments.status.active') : t('settings.departments.status.inactive') }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right" @click.stop>
                <div class="inline-flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :title="t('settings.departments.edit')"
                    :aria-label="t('settings.departments.edit')"
                    @click="editDepartment(dept)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    :title="dept.active ? t('settings.departments.deactivate') : t('settings.departments.activate')"
                    :aria-label="dept.active ? t('settings.departments.deactivate') : t('settings.departments.activate')"
                    @click="toggleActive(dept)"
                  >
                    <svg v-if="dept.active" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-error-600 transition-colors hover:bg-error-50 hover:text-error-700 focus:outline-none focus:ring-2 focus:ring-error-500"
                    :title="t('settings.departments.delete')"
                    :aria-label="t('settings.departments.delete')"
                    @click="requestDelete(dept)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paginatedDepartments.length">
              <td colspan="6" class="px-5 py-10 text-center text-neutral-500">
                {{ t('settings.departments.emptySearch') }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="filteredDepartments.length > pageSize"
      class="flex items-center justify-between text-sm text-neutral-600"
    >
      <span>
        {{ t('settings.departments.paginationRange', { start: startIndex + 1, end: endIndex, total: filteredDepartments.length }) }}
      </span>
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

    <!-- Modal formulaire -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-md rounded-xl bg-white shadow-xl" @click.stop>
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-900">
            {{ editingId ? t('settings.departments.modal.edit') : t('settings.departments.modal.add') }}
          </h3>
          <button type="button" class="text-neutral-400 hover:text-neutral-700 text-2xl" @click="closeModal">
            ×
          </button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              {{ t('settings.departments.form.name') }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.name" type="text" class="input-base text-sm w-full" :placeholder="t('settings.departments.form.namePlaceholder')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t('settings.departments.form.code') }}</label>
            <input v-model="form.code" type="text" class="input-base text-sm w-full font-mono uppercase" placeholder="DEPT-001" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t('settings.departments.form.parent') }}</label>
            <select v-model="form.parentId" class="input-base text-sm w-full">
              <option :value="null">{{ t('settings.departments.form.parentNone') }}</option>
              <option
                v-for="d in parentOptions"
                :key="d.id"
                :value="d.id"
                :disabled="editingId && d.id === editingId"
              >
                {{ d.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t('settings.departments.form.description') }}</label>
            <textarea v-model="form.description" rows="3" class="input-base text-sm w-full" :placeholder="t('settings.departments.form.descriptionPlaceholder')" />
          </div>
          <label class="flex items-center gap-2 text-sm text-neutral-700">
            <input v-model="form.active" type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-primary-600" />
            {{ t('settings.departments.form.active') }}
          </label>
        </div>
        <div class="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50 rounded-b-xl">
          <button type="button" class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg" :disabled="saving" @click="closeModal">
            {{ t('common.cancel') }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            :disabled="saving || !form.name.trim()"
            @click="submitForm"
          >
            {{ saving ? "…" : editingId ? t('common.save') : t('settings.departments.modal.addButton') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal suppression -->
    <div
      v-if="deleteOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="cancelDelete"
    >
      <div class="w-full max-w-md rounded-xl bg-white shadow-xl p-6" @click.stop>
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ t('settings.departments.confirmDeleteTitle') }}</h3>
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
import { useDepartments } from "../../organization/composables/useDepartments.js";

const { t } = useI18n();

const {
  departments,
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
  deleteOpen,
  deleteMessage,
  parentOptions,
  filteredDepartments,
  totalPages,
  startIndex,
  endIndex,
  paginatedDepartments,
  parentNameFor,
  loadDepartments,
  closeMenus,
  openAddDepartment,
  editDepartment,
  closeModal,
  submitForm,
  toggleActive,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useDepartments();

pageSize.value = 10;

const activeCount = computed(
  () => departments.value.filter((d) => d.active).length
);

function parentLabel(dept) {
  const name = parentNameFor(dept);
  return name === "No Parent" ? "—" : name;
}

onMounted(() => {
  loadDepartments();
});
</script>
