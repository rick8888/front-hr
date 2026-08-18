<template>
  <div class="space-y-6">
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <KpiCard :title="t('admin.attendance.types.kpiTypes')" :value="stats.total" :unit-label="t('admin.attendance.types.kpiTotal')" tone="violet" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard :title="t('admin.attendance.types.kpiActive')" :value="stats.active" :unit-label="t('admin.attendance.types.kpiUnitTypes')" tone="green" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard :title="t('admin.attendance.types.kpiSystem')" :value="stats.system" :unit-label="t('admin.attendance.types.kpiProtected')" tone="blue" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <ListingTableShell
      search-id="attendance-types-search"
      :search-placeholder="t('admin.attendance.types.searchPlaceholder')"
      :add-button-label="t('admin.attendance.types.add')"
      :total="filteredTypes.length"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="currentPage"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @add="openCreate"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.attendance.types.col.label") }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("common.code") }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.attendance.types.col.order") }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("common.status") }}</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">{{ t("common.actions") }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td colspan="5" class="px-6 py-12 text-center text-sm text-neutral-500">
            <span class="inline-flex items-center gap-2">
              <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
              />
              {{ t("common.loading") }}
            </span>
          </td>
        </tr>
        <tr v-else-if="!paginatedTypes.length">
          <td colspan="5" class="px-6 py-12 text-center text-sm text-neutral-500">
            {{ t("admin.attendance.types.empty") }}
          </td>
        </tr>
        <template v-else>
        <tr v-for="type in paginatedTypes" :key="type.id" class="hover:bg-neutral-50/60">
          <td class="px-4 py-3">
            <div class="font-medium text-neutral-900">{{ type.name }}</div>
            <div class="text-xs text-neutral-500 line-clamp-1">{{ type.description || "—" }}</div>
          </td>
          <td class="px-4 py-3 font-mono text-sm text-neutral-700">{{ type.code }}</td>
          <td class="px-4 py-3 text-sm text-neutral-600">{{ type.sortOrder }}</td>
          <td class="px-4 py-3">
            <span
              :class="[
                'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                type.isActive ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-600',
              ]"
            >
              {{ type.isActive ? t("common.active") : t("common.inactive") }}
            </span>
            <span
              v-if="type.isSystem"
              class="ml-2 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
            >
              {{ t("admin.attendance.types.system") }}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            <div class="inline-flex items-center gap-1">
              <button
                type="button"
                class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                :title="t('common.edit')"
                @click="openEdit(type)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                :disabled="type.isSystem && type.isActive"
                @click="toggleActive(type)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                v-if="!type.isSystem"
                type="button"
                class="rounded p-1.5 text-red-500 hover:bg-red-50"
                @click="requestDelete(type)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <AttendanceTypeFormModal
      v-model:open="modalOpen"
      :type="editingType"
      :form="form"
      :busy="saving"
      @update:form="form = $event"
      @save="save"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('admin.attendance.types.deleteTitle')"
      :message="t('admin.attendance.types.deleteMessage', { name: deleteTarget?.name || '' })"
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
import { onMounted } from "vue";
import KpiCard from "../../../../components/common/KpiCard.vue";
import ConfirmDialog from "../../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../../components/leave-management/ListingTableShell.vue";
import AttendanceTypeFormModal from "./AttendanceTypeFormModal.vue";
import { useAttendanceTypesSettings } from "../composables/useAttendanceTypesSettings.js";
import { useI18n } from "../../../../i18n/index.js";

const { t } = useI18n();

const {
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  pageSize,
  currentPage,
  filteredTypes,
  paginatedTypes,
  pageCount,
  rangeLabel,
  stats,
  modalOpen,
  editingType,
  form,
  deleteOpen,
  deleteTarget,
  load,
  openCreate,
  openEdit,
  save,
  toggleActive,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useAttendanceTypesSettings();

onMounted(load);
</script>
