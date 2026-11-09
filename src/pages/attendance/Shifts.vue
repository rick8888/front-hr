<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.attendance.shifts.title") }}</h1>
      <nav
        class="text-sm text-neutral-500 flex items-center flex-wrap gap-1.5"
        aria-label="Breadcrumb"
      >
        <RouterLink
          to="/"
          class="hover:text-secondary-600 inline-flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10.5L12 4l9 6.5M5 10v9a1 1 0 001 1h3m10-10v9a1 1 0 01-1 1h-3m-6 0h6m-6 0v-5a1 1 0 011-1h4a1 1 0 011 1v5"
            />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span class="text-neutral-400">/</span>
        <RouterLink to="/attendance" class="hover:text-secondary-600 text-neutral-500">
          {{ t("admin.attendance.breadcrumb") }}
        </RouterLink>
        <span class="text-neutral-400">/</span>
        <span class="text-neutral-800 font-medium">{{ t("nav.attendance.shifts") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-neutral-100"
      >
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.shifts.listTitle") }}</h2>
        <button
          v-if="canConfigureShifts"
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          :disabled="loading"
          @click="openAdd"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ t("admin.attendance.shifts.add") }}
        </button>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4"
      >
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.show") }}</span>
          <select
            v-model.number="pageSize"
            class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 focus:outline-none focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
          >
            <option v-for="n in [10, 25, 50, 100]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <span>{{ t("common.entries") }}</span>
        </label>
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.search") }}</span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('common.search')"
            class="w-48 sm:w-56 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
          />
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase border-t border-b border-neutral-100"
            >
              <th class="px-6 py-3 w-14">ID</th>
              <th class="px-6 py-3">{{ t("admin.attendance.shifts.col.name") }}</th>
              <th class="px-6 py-3 w-24">{{ t("common.code") }}</th>
              <th class="px-6 py-3 min-w-[120px]">{{ t("admin.attendance.shifts.col.timing") }}</th>
              <th class="px-6 py-3">{{ t("admin.attendance.shifts.col.days") }}</th>
              <th class="px-6 py-3 min-w-[100px] max-w-[200px]">{{ t("admin.attendance.shifts.col.note") }}</th>
              <th class="px-6 py-3 w-24">{{ t("common.status") }}</th>
              <th v-if="canConfigureShifts" class="px-6 py-3 w-20 text-right pr-8">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-10 text-center text-sm text-neutral-500">
                {{ t("common.loading") }}
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="row in paginatedShifts"
                :key="row.id"
                class="hover:bg-neutral-50/60 transition-colors"
              >
                <td class="px-6 py-4 text-neutral-700">{{ row.id }}</td>
                <td class="px-6 py-4">
                  <span class="font-semibold text-neutral-900">{{ row.name }}</span>
                </td>
                <td class="px-6 py-4 text-neutral-700 font-mono text-xs">{{ row.code }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1.5 text-neutral-800">
                    <div class="flex items-center gap-1.5 text-xs sm:text-sm">
                      <svg
                        class="w-3.5 h-3.5 text-neutral-400 flex-shrink-0"
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
                      {{ formatTime12(row.start) }}
                    </div>
                    <div class="flex items-center gap-1.5 text-xs sm:text-sm">
                      <svg
                        class="w-3.5 h-3.5 text-neutral-400 flex-shrink-0"
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
                      {{ formatTime12(row.end) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="d in row.days"
                      :key="d"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-success-50 text-success-600 border border-success-200/50"
                    >
                      {{ t(`admin.attendance.day.${d}`) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 max-w-[220px]">
                  <p
                    v-if="row.note"
                    class="text-xs text-neutral-600 line-clamp-2"
                    :title="row.note"
                  >
                    {{ row.note }}
                  </p>
                  <span v-else class="text-xs text-neutral-400">—</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                    :class="
                      row.active
                        ? 'bg-success-100 text-success-700'
                        : 'bg-neutral-100 text-neutral-600'
                    "
                  >
                    {{ row.active ? t("common.active") : t("common.inactive") }}
                  </span>
                </td>
                <td v-if="canConfigureShifts" class="px-6 py-4 text-right pr-6" @click.stop>
                  <div class="relative inline-block">
                    <button
                      type="button"
                      class="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                      :aria-label="t('admin.org.actionsAria')"
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
                      class="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-left"
                    >
                      <button
                        type="button"
                        class="block w-full px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left"
                        @click="editRow(row)"
                      >
                        {{ t("common.edit") }}
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
              <tr v-if="!paginatedShifts.length">
                <td colspan="8" class="px-6 py-10 text-center text-sm text-neutral-500">
                  {{ t("admin.attendance.shifts.empty") }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-neutral-100"
      >
        <p class="text-sm text-neutral-500">
          {{ t("common.showingEntries", { from: filteredShifts.length === 0 ? 0 : startIndex + 1, to: endIndex, total: filteredShifts.length }) }}
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage <= 1"
            @click="currentPage -= 1"
          >
            {{ t("common.previous") }}
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="min-w-[32px] h-8 px-2 text-sm font-medium rounded-md transition-colors"
            :class="
              p === currentPage
                ? 'bg-secondary-500 text-white shadow-sm'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            "
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage >= totalPages"
            @click="currentPage += 1"
          >
            {{ t("common.next") }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      @click.self="closeModal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shift-modal-title"
        class="my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]"
      >
        <div class="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 px-5 py-4 sm:px-7">
          <h3 id="shift-modal-title" class="text-xl font-bold tracking-tight text-slate-900">
            {{ editingId ? t("admin.attendance.shifts.modalEdit") : t("admin.attendance.shifts.modalAdd") }}
          </h3>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            :aria-label="t('common.close')"
            :disabled="saving"
            @click="closeModal"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="min-h-0 space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("admin.attendance.shifts.col.name") }}</label>
            <input
              v-model="form.name"
              type="text"
              class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              :placeholder="t('admin.attendance.shifts.namePlaceholder')"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("common.code") }}</label>
            <input
              v-model="form.code"
              type="text"
              class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 font-mono text-sm uppercase shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              placeholder="SH-001"
            />
          </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("admin.attendance.shifts.start") }}</label>
              <input v-model="form.start" type="time" class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" step="60" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("admin.attendance.shifts.end") }}</label>
              <input v-model="form.end" type="time" class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" step="60" />
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-violet-50/40 p-4">
            <p class="mb-3 text-sm font-semibold text-slate-700">{{ t("admin.attendance.shifts.col.days") }}</p>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="d in ALL_DAYS"
                :key="d"
                class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  :checked="isDaySelected(d)"
                  @change="toggleDay(d, $event.target.checked)"
                />
                {{ t(`admin.attendance.day.${d}`) }}
              </label>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
              {{ t("admin.attendance.shifts.noteOptional") }} <span class="text-neutral-400 font-normal">({{ t("common.optional") }})</span>
            </label>
            <textarea
              v-model="form.note"
              rows="3"
              class="input-base min-h-[4rem] w-full resize-y rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              :placeholder="t('admin.attendance.shifts.notePlaceholder')"
            />
          </div>
          <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200">
            <input v-model="form.active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
            {{ t("common.active") }}
          </label>
        </div>
        <div class="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-7">
          <button type="button" class="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50" :disabled="saving" @click="closeModal">
            {{ t("common.cancel") }}
          </button>
          <button type="button" class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" :disabled="saving" @click="submitForm">
            {{ saving ? t("common.saving") : editingId ? t("common.update") : t("common.create") }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('admin.attendance.shifts.deleteTitle')"
      :message="deleteMessage"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      :loading-text="t('common.deleting')"
      variant="danger"
      :busy="deleting"
      :close-on-backdrop="!deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import { ALL_DAYS, useShifts } from "./composables/useShifts.js";
import { useI18n } from "../../i18n/index.js";
import { useAuthStore } from "../../stores/authStore.js";

const { t } = useI18n();
const authStore = useAuthStore();
const canConfigureShifts = computed(() =>
  authStore.can("organization.manage", "settings.manage"),
);

const {
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  pageSize,
  currentPage,
  openMenuId,
  modalOpen,
  editingId,
  form,
  deleteOpen,
  deleteMessage,
  filteredShifts,
  totalPages,
  startIndex,
  endIndex,
  paginatedShifts,
  loadShifts,
  isDaySelected,
  toggleDay,
  toggleMenu,
  closeMenus,
  openAdd,
  editRow,
  closeModal,
  submitForm,
  requestDelete,
  confirmDelete,
  cancelDelete,
  formatTime12,
} = useShifts();

onMounted(() => {
  loadShifts();
  document.addEventListener("click", closeMenus);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenus);
});
</script>
