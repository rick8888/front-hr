<template>
  <div class="space-y-6">
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid gap-4 sm:grid-cols-4">
      <KpiCard title="Rôles" :value="stats.total" unit-label="Total" tone="violet" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20V7a2 2 0 012-2h2.5" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard title="Actifs" :value="stats.active" unit-label="Rôles" tone="green" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard title="Système" :value="stats.system" unit-label="Protégés" tone="blue" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard title="Utilisateurs" :value="stats.users" unit-label="Assignés" tone="neutral" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <ListingTableShell
      search-id="roles-search"
      search-placeholder="Rechercher un rôle…"
      add-button-label="+ Nouveau rôle"
      :total="filteredRoles.length"
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
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Rôle</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Slug</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Permissions</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Utilisateurs</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td colspan="6" class="px-6 py-16 text-center text-sm text-neutral-600">
            <span class="inline-flex items-center gap-2">
              <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
                aria-hidden="true"
              />
              Chargement…
            </span>
          </td>
        </tr>
        <tr v-else-if="!paginatedRoles.length">
          <td colspan="6" class="px-6 py-12 text-center text-sm text-neutral-500">
            Aucun rôle trouvé.
          </td>
        </tr>
        <template v-else>
          <tr v-for="role in paginatedRoles" :key="role.id" class="hover:bg-neutral-50/60">
            <td class="px-4 py-3">
              <div class="font-medium text-neutral-900">{{ role.name }}</div>
              <div class="text-xs text-neutral-500 line-clamp-1">{{ role.description || "—" }}</div>
            </td>
            <td class="px-4 py-3 font-mono text-sm text-neutral-700">{{ role.slug }}</td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ role.permissions.length }}</td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ role.usersCount }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                  role.isActive ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-600',
                ]"
              >
                {{ role.isActive ? "Actif" : "Inactif" }}
              </span>
              <span
                v-if="role.isSystem"
                class="ml-2 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
              >
                Système
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-1">
                <button
                  type="button"
                  class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  title="Modifier"
                  @click="openEdit(role)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  :title="role.isActive ? 'Désactiver' : 'Activer'"
                  :disabled="role.isSystem && role.isActive"
                  @click="toggleActive(role)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  v-if="!role.isSystem"
                  type="button"
                  class="rounded p-1.5 text-red-500 hover:bg-red-50"
                  title="Supprimer"
                  @click="requestDelete(role)"
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

    <RoleFormModal
      v-model:open="modalOpen"
      :role="editingRole"
      :form="form"
      :permission-groups="permissionGroups"
      :busy="saving"
      @update:form="form = $event"
      @toggle-permission="togglePermission"
      @save="save"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer ce rôle ?"
      :message="`Le rôle « ${deleteTarget?.name} » sera supprimé définitivement.`"
      confirm-text="Supprimer"
      cancel-text="Annuler"
      loading-text="Suppression…"
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
import RoleFormModal from "./RoleFormModal.vue";
import { useRolesSettings } from "../composables/useRolesSettings.js";

const {
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  pageSize,
  currentPage,
  filteredRoles,
  paginatedRoles,
  pageCount,
  rangeLabel,
  stats,
  modalOpen,
  editingRole,
  form,
  permissionGroups,
  deleteOpen,
  deleteTarget,
  load,
  openCreate,
  openEdit,
  togglePermission,
  save,
  toggleActive,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useRolesSettings();

onMounted(load);
</script>
