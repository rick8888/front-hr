<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <LeaveRequestsPageHero
      :title="t('admin.leave.types.title')"
      :breadcrumb-current="t('admin.leave.types.title')"
    />

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <ListingTableShell
      search-id="leave-types-search"
      :search-placeholder="t('admin.leave.types.searchPlaceholder')"
      :add-button-label="t('admin.leave.types.add')"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @dismiss="closeMenu"
      @add="onAdd"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th
            scope="col"
            class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("admin.leave.types.col.id") }}
          </th>
          <th
            scope="col"
            class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.name") }}
          </th>
          <th
            scope="col"
            class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.code") }}
          </th>
          <th
            scope="col"
            class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.description") }}
          </th>
          <th
            scope="col"
            class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("admin.leave.types.col.proof") }}
          </th>
          <th
            scope="col"
            class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.status") }}
          </th>
          <th
            scope="col"
            class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.actions") }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td colspan="7" class="px-6 py-16 text-center">
            <div class="inline-flex items-center justify-center gap-2 text-sm text-neutral-500">
              <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
                aria-hidden="true"
              />
              {{ t("common.loading") }}
            </div>
          </td>
        </tr>
        <tr v-else-if="paginatedRows.length === 0">
          <td colspan="7" class="px-6 py-16 text-center text-sm text-neutral-600">
            {{ t("admin.leave.types.empty") }}
          </td>
        </tr>
        <tr
          v-for="row in loading ? [] : paginatedRows"
          :key="row.id"
          class="hover:bg-neutral-50/60 transition-colors"
        >
          <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-800 md:px-6">
            {{ row.id }}
          </td>
          <td class="px-5 py-4 text-sm font-medium text-neutral-900 md:px-6">
            {{ row.name }}
          </td>
          <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-700 md:px-6">
            {{ row.code }}
          </td>
          <td class="max-w-xs px-5 py-4 text-sm text-neutral-700 md:px-6">
            {{ row.description }}
          </td>
          <td class="px-5 py-4 md:px-6">
            <span
              class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
              :class="
                row.proofRequired
                  ? 'bg-green-50 text-green-800 ring-green-600/15'
                  : 'bg-neutral-100 text-neutral-600 ring-neutral-400/25'
              "
            >
              {{ row.proofRequired ? t("admin.leave.types.proofRequired") : t("admin.leave.types.proofNotRequired") }}
            </span>
          </td>
          <td class="px-5 py-4 md:px-6">
            <span
              class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
              :class="
                row.status === 'Active'
                  ? 'bg-green-50 text-green-800 ring-green-600/15'
                  : 'bg-neutral-100 text-neutral-600 ring-neutral-400/25'
              "
            >
              {{ statusLabel(row.status) }}
            </span>
          </td>
          <td class="whitespace-nowrap px-5 py-4 text-right md:px-6">
            <TableRowMenu
              :open="actionMenuOpen === row.id"
              :aria-label="t('admin.leave.types.actionsFor', { id: row.id })"
              @toggle="toggleMenu(row.id)"
              @close="closeMenu"
            >
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                @click="onView(row)"
              >
                <svg class="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ t("common.view") }}
              </button>
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                @click="onEdit(row)"
              >
                <svg class="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {{ t("common.edit") }}
              </button>
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                @click="onToggleStatus(row)"
              >
                <svg class="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ row.status === "Active" ? t("common.deactivate") : t("common.activate") }}
              </button>
              <div class="my-1 border-t border-neutral-100"></div>
              <button
                type="button"
                role="menuitem"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                @click="onDelete(row)"
              >
                <svg class="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {{ t("common.delete") }}
              </button>
            </TableRowMenu>
          </td>
        </tr>
      </tbody>
    </ListingTableShell>

    <LeaveTypeFormModal
      v-model:open="isFormOpen"
      :header-title="editingRow ? t('admin.leave.types.modalEdit') : t('admin.leave.types.modalAdd')"
      :submit-label="editingRow ? t('common.save') : t('common.create')"
      :initial="editingRow"
      :saving="saving"
      @submit="onFormSubmit"
    />

    <Teleport to="body">
      <div
        v-if="viewRow"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="viewRow = null"
      >
        <div class="w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-2xl">
          <header class="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h2 class="text-lg font-bold text-neutral-900">{{ viewRow.name }}</h2>
            <button
              type="button"
              class="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              :aria-label="t('common.close')"
              @click="viewRow = null"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <dl class="space-y-3 px-6 py-5 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-neutral-500">{{ t("common.code") }}</dt>
              <dd class="font-medium text-neutral-900">{{ viewRow.code }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-neutral-500">{{ t("common.description") }}</dt>
              <dd class="text-right text-neutral-800">{{ viewRow.description || "—" }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-neutral-500">{{ t("admin.leave.types.col.proof") }}</dt>
              <dd class="font-medium text-neutral-900">
                {{ viewRow.proofRequired ? t("admin.leave.types.proofRequired") : t("admin.leave.types.proofNotRequired") }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-neutral-500">{{ t("common.status") }}</dt>
              <dd>
                <span
                  class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="
                    viewRow.status === 'Active'
                      ? 'bg-green-50 text-green-800 ring-green-600/15'
                      : 'bg-neutral-100 text-neutral-600 ring-neutral-400/25'
                  "
                >
                  {{ statusLabel(viewRow.status) }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="deleteRow"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="cancelDelete"
      >
        <div class="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl">
          <h2 class="text-lg font-bold text-neutral-900">{{ t("admin.leave.types.deleteTitle") }}</h2>
          <p class="mt-2 text-sm text-neutral-600">
            {{ t("admin.leave.types.deleteMessage", { name: deleteRow.name }) }}
          </p>
          <div class="mt-5 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              :disabled="deleting"
              @click="cancelDelete"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              :disabled="deleting"
              @click="confirmDelete"
            >
              {{ deleting ? t("common.deleting") : t("common.delete") }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import LeaveRequestsPageHero from "../../components/leave/LeaveRequestsPageHero.vue";
import ListingTableShell from "../../components/leave-management/ListingTableShell.vue";
import LeaveTypeFormModal from "../../components/leave-management/LeaveTypeFormModal.vue";
import TableRowMenu from "../../components/common/TableRowMenu.vue";
import { useLeaveTypes } from "../leave/composables/useLeaveTypes.js";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const {
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  page,
  pageSize,
  actionMenuOpen,
  isFormOpen,
  editingRow,
  viewRow,
  deleteRow,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  loadData,
  toggleMenu,
  closeMenu,
  onAdd,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  cancelDelete,
  confirmDelete,
  onFormSubmit,
} = useLeaveTypes();

function statusLabel(status) {
  return status === "Active" ? t("common.active") : t("common.inactive");
}

onMounted(() => {
  loadData();
});
</script>
