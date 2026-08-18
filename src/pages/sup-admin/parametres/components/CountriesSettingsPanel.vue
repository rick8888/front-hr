<template>
  <div class="space-y-6">
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <KpiCard
        title="Pays"
        :value="stats.total"
        unit-label="Total"
        tone="violet"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Actifs"
        :value="stats.active"
        unit-label="Pays"
        tone="green"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Inactifs"
        :value="stats.inactive"
        unit-label="Pays"
        tone="red"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </template>
      </KpiCard>
    </div>

    <ListingTableShell
      search-id="countries-search"
      search-placeholder="Rechercher un pays…"
      add-button-label="+ Nouveau pays"
      :total="filteredCountries.length"
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
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
            Pays
          </th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
            Code
          </th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
            Devise
          </th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
            Locale
          </th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
            Statut
          </th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td colspan="6" class="px-6 py-12 text-center text-sm text-neutral-500">
            <span class="inline-flex items-center gap-2">
              <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
              />
              Chargement…
            </span>
          </td>
        </tr>
        <tr v-else-if="!paginatedCountries.length">
          <td colspan="6" class="px-6 py-12 text-center text-sm text-neutral-500">
            Aucun pays trouvé.
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="country in paginatedCountries"
            :key="country.id"
            class="hover:bg-neutral-50/60"
          >
            <td class="px-4 py-3 font-medium text-neutral-900">
              {{ country.name }}
            </td>
            <td class="px-4 py-3 font-mono text-sm text-neutral-700">
              {{ country.code }}
            </td>
            <td class="px-4 py-3 font-mono text-sm text-neutral-700">
              {{ country.currency }}
            </td>
            <td class="px-4 py-3 text-sm text-neutral-600">
              {{ country.locale || "—" }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                  country.isActive
                    ? 'bg-green-50 text-green-700'
                    : 'bg-neutral-100 text-neutral-600',
                ]"
              >
                {{ country.isActive ? "Actif" : "Inactif" }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-1">
                <button
                  type="button"
                  class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                  title="Modifier"
                  @click="openEdit(country)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                  :title="country.isActive ? 'Désactiver' : 'Activer'"
                  @click="toggleActive(country)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="rounded p-1.5 text-red-500 hover:bg-red-50"
                  title="Supprimer"
                  @click="requestDelete(country)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <CountryFormModal
      v-model:open="modalOpen"
      :country="editingCountry"
      :form="form"
      :busy="saving"
      @update:form="form = $event"
      @save="save"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer ce pays ?"
      :message="`Le pays « ${deleteTarget?.name} » sera supprimé définitivement.`"
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
import CountryFormModal from "./CountryFormModal.vue";
import { useCountriesSettings } from "../composables/useCountriesSettings.js";

const {
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  pageSize,
  currentPage,
  filteredCountries,
  paginatedCountries,
  pageCount,
  rangeLabel,
  stats,
  modalOpen,
  editingCountry,
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
} = useCountriesSettings();

onMounted(load);
</script>
