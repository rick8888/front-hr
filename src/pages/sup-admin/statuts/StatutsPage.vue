<template>
  <div class="mx-auto max-w-[1600px] px-4 py-5 sm:px-8 sm:py-7">
    <PageHero
      title="Statuts"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Statuts' }]"
      home-to="/sup-admin/entreprises"
    />

    <div class="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-4 sm:px-5">
      <p class="max-w-4xl text-[15px] leading-6 text-neutral-700">
        Gérez les statuts utilisés dans les différents modules. Ils alimentent les libellés,
        filtres et validations de l’application.
        <span class="font-semibold text-neutral-900">
          Les statuts système ne peuvent pas être supprimés ni désactivés.
        </span>
      </p>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section class="mb-6" aria-label="Catalogues de statuts">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-base font-semibold text-neutral-900">Catalogue à gérer</h2>
        <p class="text-sm text-neutral-500">Sélectionnez un module pour afficher ses statuts.</p>
      </div>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <button
          v-for="catalog in catalogs"
          :key="catalog.type"
          type="button"
          :class="[
            'flex min-h-12 items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            activeType === catalog.type
              ? 'border-primary-200 bg-primary-50 text-primary-800 shadow-xs'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50',
          ]"
          @click="activeType = catalog.type"
        >
          <span class="min-w-0">{{ catalog.label }}</span>
          <span
            :class="[
              'inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
              activeType === catalog.type
                ? 'bg-primary-100 text-primary-800'
                : 'bg-neutral-100 text-neutral-600',
            ]"
          >
            {{ catalog.total }}
          </span>
        </button>
      </div>
    </section>

    <div
      v-if="currentCatalog"
      class="mb-6 rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-sm sm:px-5"
    >
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p class="text-sm font-medium text-neutral-600">Module sélectionné</p>
        <p class="text-base font-semibold text-neutral-900">{{ currentCatalog.label }}</p>
        <code class="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">{{ currentCatalog.type }}</code>
      </div>
      <p class="mt-3 text-sm font-medium text-neutral-700">
        Écrans concernés
      </p>
      <ul v-if="currentScreens.length" class="mt-2 flex flex-wrap gap-2">
        <li
          v-for="screen in currentScreens"
          :key="screen.path"
          class="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-800 ring-1 ring-neutral-200"
        >
          <span class="font-medium">{{ screen.name }}</span>
          <span class="font-mono text-xs text-neutral-500">{{ screen.path }}</span>
        </li>
      </ul>
      <p v-else class="mt-2 text-sm text-neutral-500">Aucun écran associé à ce module.</p>
    </div>

    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <KpiCard title="Statuts" :value="stats.total" unit-label="Total" tone="violet" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard title="Actifs" :value="stats.active" unit-label="Statuts" tone="green" :loading="loading">
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
    </div>

    <ListingTableShell
      search-id="entity-statuses-search"
      search-placeholder="Rechercher un statut…"
      add-button-label="+ Nouveau statut"
      :total="filteredStatuses.length"
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
          <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">Libellé</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">Code</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">Couleur</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">Ordre</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600">État</th>
          <th class="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-600">Actions</th>
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
        <tr v-else-if="!paginatedStatuses.length">
          <td colspan="6" class="px-6 py-12 text-center text-sm text-neutral-500">
            Aucun statut trouvé.
          </td>
        </tr>
        <template v-else>
          <tr v-for="row in paginatedStatuses" :key="row.id" class="hover:bg-neutral-50/60">
            <td class="px-4 py-4">
              <div class="text-[15px] font-semibold text-neutral-900">{{ row.name }}</div>
              <div class="mt-0.5 text-sm text-neutral-600 line-clamp-1">
                {{ row.nameEn || row.description || "—" }}
              </div>
            </td>
            <td class="px-4 py-4 font-mono text-sm font-medium text-neutral-700">{{ row.code }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-3 py-1 text-sm font-medium',
                  TONE_CLASSES[row.tone] || TONE_CLASSES.neutral,
                ]"
              >
                {{ toneLabel(row.tone) }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm font-medium text-neutral-700">{{ row.sortOrder }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                  row.isActive ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-600',
                ]"
              >
                {{ row.isActive ? "Actif" : "Inactif" }}
              </span>
              <span
                v-if="row.isSystem"
                class="ml-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
              >
                Système
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-1">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  title="Modifier"
                  :aria-label="`Modifier le statut ${row.name}`"
                  @click="openEdit(row)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="row.isSystem && row.isActive"
                  :title="row.isSystem ? 'Un statut système ne peut pas être désactivé' : (row.isActive ? 'Désactiver' : 'Activer')"
                  :aria-label="row.isSystem && row.isActive ? 'Un statut système ne peut pas être désactivé' : (row.isActive ? `Désactiver ${row.name}` : `Activer ${row.name}`)"
                  @click="toggleActive(row)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  v-if="!row.isSystem"
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  title="Supprimer"
                  :aria-label="`Supprimer le statut ${row.name}`"
                  @click="requestDelete(row)"
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

    <EntityStatusFormModal
      v-model:open="modalOpen"
      :status="editingStatus"
      :form="form"
      :busy="saving"
      :entity-label="currentCatalog?.label"
      :entity-type="activeType"
      @update:form="form = $event"
      @save="onSave"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer ce statut ?"
      :message="`Le statut « ${deleteTarget?.name} » sera supprimé définitivement.`"
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
import { computed, onMounted } from "vue";
import PageHero from "../../../components/common/PageHero.vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import ConfirmDialog from "../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../components/leave-management/ListingTableShell.vue";
import EntityStatusFormModal from "./components/EntityStatusFormModal.vue";
import {
  TONE_CLASSES,
  STATUS_TONES,
  useEntityStatuses,
} from "./composables/useEntityStatuses.js";

const {
  catalogs,
  loading,
  saving,
  deleting,
  error,
  activeType,
  currentCatalog,
  searchQuery,
  pageSize,
  currentPage,
  filteredStatuses,
  paginatedStatuses,
  pageCount,
  rangeLabel,
  stats,
  modalOpen,
  editingStatus,
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
} = useEntityStatuses();

const currentScreens = computed(() => currentCatalog.value?.screens || []);

function toneLabel(tone) {
  return STATUS_TONES.find((item) => item.value === tone)?.label ?? tone;
}

async function onSave() {
  try {
    await save();
  } catch {
    /* Le message d’erreur est déjà affiché. */
  }
}

onMounted(load);
</script>
