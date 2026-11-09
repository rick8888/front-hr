<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Entreprises"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Entreprises' }]"
    />

    <p class="mb-4 text-sm text-neutral-500">
      Données synchronisées avec l'API HR
      (<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">/api/v1/companies</code>).
    </p>

    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <KpiCard
        title="Total"
        :value="store.companies.length"
        unit-label="Entreprises"
        tone="blue"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Actives"
        :value="store.activeCount"
        unit-label="Entreprises"
        tone="green"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Inactives"
        :value="store.inactiveCount"
        unit-label="Entreprises"
        tone="red"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <div
      v-if="store.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ store.error }}
    </div>

    <ListingTableShell
      search-id="companies-search"
      search-placeholder="Rechercher une entreprise…"
      add-button-label="+ Ajouter une entreprise"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @add="openCreate"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Entreprise</th>
          <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Code</th>
          <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Contact principal</th>
          <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Pays</th>
          <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Plan</th>
          <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          <th class="px-5 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="store.loading">
          <td colspan="7" class="px-6 py-16 text-center text-sm text-neutral-500">Chargement…</td>
        </tr>
        <tr v-else-if="paginatedRows.length === 0">
          <td colspan="7" class="px-6 py-16 text-center text-sm text-neutral-500">Aucune entreprise trouvée.</td>
        </tr>
        <tr
          v-for="row in paginatedRows"
          :key="row.id"
          class="hover:bg-neutral-50/60 transition-colors"
          :class="!row.is_active ? 'opacity-80' : ''"
        >
          <td class="px-5 py-4">
            <p class="text-sm font-medium text-neutral-900">{{ row.name }}</p>
            <p class="text-xs text-neutral-500">{{ row.subdomain }}.opencorebs.com</p>
          </td>
          <td class="px-5 py-4 text-sm text-neutral-700">{{ row.code }}</td>
          <td class="px-5 py-4">
            <p class="text-sm text-neutral-800">
              {{ contactName(row) }}
            </p>
            <p class="text-xs text-neutral-500">{{ row.primary_contact?.email ?? row.email }}</p>
          </td>
          <td class="px-5 py-4 text-sm text-neutral-700">{{ row.country }}</td>
          <td class="px-5 py-4">
            <span class="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/15">
              {{ row.plan }}
            </span>
          </td>
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <InlineToggle
                :model-value="row.is_active"
                :label="row.is_active ? 'Active' : 'Inactive'"
                :disabled="store.saving"
                @update:model-value="onToggleStatus(row, $event)"
              />
            </div>
          </td>
          <td class="px-5 py-4 text-right whitespace-nowrap">
            <button
              type="button"
              class="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :aria-label="`Modifier ${row.name}`"
              :title="`Modifier ${row.name}`"
              :disabled="store.saving"
              @click="openEdit(row)"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="m16.862 4.487 2.651 2.651M8 16l8.862-8.862a1.875 1.875 0 0 1 2.652 2.652L10.65 18.65 6 20l1.35-4.65A2 2 0 0 1 8 16Z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :aria-label="`Supprimer ${row.name}`"
              :title="`Supprimer ${row.name}`"
              :disabled="store.saving"
              @click="requestDelete(row)"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M3 6h18m-2 0-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6m4 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-6 4v6m4-6v6"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </ListingTableShell>

    <CompanyFormModal
      v-model:open="formOpen"
      :company="editingCompany"
      :countries="store.countries"
      :saving="store.saving"
      @submit="onFormSubmit"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer cette entreprise ?"
      :message="deleteMessage"
      confirm-text="Supprimer"
      variant="danger"
      :busy="store.saving"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import PageHero from "../../../components/common/PageHero.vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import InlineToggle from "../../../components/common/InlineToggle.vue";
import ConfirmDialog from "../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../components/leave-management/ListingTableShell.vue";
import CompanyFormModal from "./components/CompanyFormModal.vue";
import { useCompaniesStore } from "./store/companies.store.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";

const store = useCompaniesStore();
const { companies } = storeToRefs(store);

const formOpen = ref(false);
const editingCompany = ref(null);
const deleteOpen = ref(false);
const deleteMessage = ref("");
const pendingDeleteId = ref(null);

const {
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
} = usePaginatedSearch(companies, {
    pageSize: 7,
    searchFields: ["name", "code", "email", "country", "country_code", "subdomain", "plan", "industry", "registration_number"],
  }
);

onMounted(() => store.init());

function contactName(row) {
  const pc = row.primary_contact;
  if (!pc?.first_name && !pc?.last_name) return "—";
  return [pc.title, pc.first_name, pc.last_name].filter(Boolean).join(" ");
}

function openCreate() {
  editingCompany.value = null;
  formOpen.value = true;
}

function openEdit(company) {
  editingCompany.value = company;
  formOpen.value = true;
}

async function onFormSubmit(payload) {
  if (editingCompany.value) {
    await store.updateCompany(editingCompany.value.id, payload);
  } else {
    await store.createCompany(payload);
  }
  formOpen.value = false;
  editingCompany.value = null;
}

async function onToggleStatus(company, isActive) {
  await store.toggleCompanyStatus(company.id, isActive);
}

function requestDelete(company) {
  pendingDeleteId.value = company.id;
  deleteMessage.value = `Confirmer la suppression de « ${company.name} » ? Cette action est irréversible.`;
  deleteOpen.value = true;
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return;
  await store.deleteCompany(pendingDeleteId.value);
  deleteOpen.value = false;
  pendingDeleteId.value = null;
}
</script>
