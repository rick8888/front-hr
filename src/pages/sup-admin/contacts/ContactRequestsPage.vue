<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Demandes de contact"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Demandes de contact' }]"
    />

    <p class="mb-4 text-sm text-neutral-500">
      Messages envoyés depuis le formulaire de contact de la page d'accueil.
    </p>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <KpiCard title="Nouvelles" :value="countBy('new')" unit-label="Non lues" tone="violet" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard title="Traitées" :value="countBy('processed')" unit-label="Demandes" tone="green" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard title="Total" :value="items.length" unit-label="Demandes" tone="blue" :loading="loading">
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <div class="mb-4 inline-flex flex-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
      <button
        v-for="tab in statusTabs"
        :key="tab.id"
        type="button"
        class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
        :class="statusFilter === tab.id ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'"
        @click="statusFilter = tab.id"
      >
        {{ tab.label }}
        <span v-if="tab.id !== 'all'" class="ml-1 text-neutral-400">{{ countBy(tab.id) }}</span>
      </button>
    </div>

    <ListingTableShell
      search-id="contact-requests-search"
      search-placeholder="Rechercher (nom, e-mail, entreprise, objet)…"
      add-button-label=""
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Date</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Contact</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Entreprise</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Objet</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td colspan="6" class="px-6 py-16 text-center text-sm text-neutral-600">
            <span class="inline-flex items-center gap-2">
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" aria-hidden="true" />
              Chargement…
            </span>
          </td>
        </tr>
        <tr v-else-if="!paginatedRows.length">
          <td colspan="6" class="px-6 py-12 text-center text-sm text-neutral-500">
            Aucune demande de contact.
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="row in paginatedRows"
            :key="row.id"
            class="cursor-pointer hover:bg-neutral-50/60"
            :class="{ 'bg-primary-50/40': row.status === 'new' }"
            @click="openDetail(row)"
          >
            <td class="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">{{ formatDate(row.created_at) }}</td>
            <td class="px-4 py-3">
              <p class="text-sm text-neutral-800" :class="{ 'font-semibold': row.status === 'new' }">{{ row.name }}</p>
              <p class="text-xs text-neutral-500">{{ row.email }}</p>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ row.company || "—" }}</td>
            <td class="px-4 py-3">
              <p class="text-sm text-neutral-800" :class="{ 'font-semibold': row.status === 'new' }">{{ row.subject }}</p>
              <p class="mt-0.5 max-w-xs truncate text-xs text-neutral-500">{{ row.message }}</p>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold" :class="statusMeta(row.status).cls">
                {{ statusMeta(row.status).label }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right" @click.stop>
              <button
                type="button"
                class="mr-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                @click="openDetail(row)"
              >
                Voir
              </button>
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-800"
                :disabled="saving"
                @click="requestDelete(row)"
              >
                Suppr.
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <!-- Détail -->
    <div
      v-if="selected"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      @click.self="selected = null"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div class="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-neutral-900">{{ selected.subject }}</h2>
            <p class="mt-0.5 text-xs text-neutral-500">Reçue le {{ formatDate(selected.created_at) }}</p>
          </div>
          <button type="button" class="text-neutral-400 hover:text-neutral-600" aria-label="Fermer" @click="selected = null">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4 px-6 py-5">
          <dl class="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt class="text-xs font-medium uppercase text-neutral-500">Nom</dt>
              <dd class="text-neutral-800">{{ selected.name }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase text-neutral-500">E-mail</dt>
              <dd class="break-all text-neutral-800">{{ selected.email }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase text-neutral-500">Entreprise</dt>
              <dd class="text-neutral-800">{{ selected.company || "—" }}</dd>
            </div>
          </dl>
          <div>
            <p class="mb-1 text-xs font-medium uppercase text-neutral-500">Message</p>
            <p class="whitespace-pre-line rounded-lg bg-neutral-50 p-4 text-sm text-neutral-800">{{ selected.message }}</p>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium uppercase text-neutral-500">Statut</label>
            <select
              :value="selected.status"
              class="input-base w-full text-sm sm:w-56"
              :disabled="saving"
              @change="changeStatus(selected, $event.target.value)"
            >
              <option v-for="s in STATUSES" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </div>
        </div>
        <div class="flex flex-wrap justify-end gap-2 border-t border-neutral-200 px-6 py-4">
          <a
            :href="replyLink(selected)"
            class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Répondre par e-mail
          </a>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer cette demande ?"
      :message="deleteMessage"
      confirm-text="Supprimer"
      variant="danger"
      :busy="saving"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import PageHero from "../../../components/common/PageHero.vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import ConfirmDialog from "../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../components/leave-management/ListingTableShell.vue";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { contactRequestsApiService } from "./contact-requests.api.service.js";

const STATUSES = [
  { id: "new", label: "Nouvelle", cls: "bg-violet-50 text-violet-800" },
  { id: "read", label: "Lue", cls: "bg-sky-50 text-sky-800" },
  { id: "processed", label: "Traitée", cls: "bg-emerald-50 text-emerald-800" },
  { id: "archived", label: "Archivée", cls: "bg-neutral-100 text-neutral-500" },
];

const statusTabs = [{ id: "all", label: "Toutes" }, ...STATUSES];

const items = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const statusFilter = ref("all");
const selected = ref(null);
const deleteOpen = ref(false);
const deleteMessage = ref("");
const pendingDelete = ref(null);

const filteredItems = computed(() =>
  statusFilter.value === "all" ? items.value : items.value.filter((i) => i.status === statusFilter.value),
);

const { searchQuery, page, pageSize, totalFiltered, pageCount, paginatedRows, rangeLabel } =
  usePaginatedSearch(filteredItems, {
    pageSize: 10,
    searchFields: ["name", "email", "company", "subject", "message"],
  });

function countBy(status) {
  return items.value.filter((i) => i.status === status).length;
}

function statusMeta(status) {
  return STATUSES.find((s) => s.id === status) ?? STATUSES[0];
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function replyLink(row) {
  return `mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject}`)}`;
}

function errorMessage(e, fallback) {
  return e?.response?.data?.message || fallback;
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const { items: list } = await contactRequestsApiService.fetchAll();
    items.value = list;
  } catch (e) {
    error.value = errorMessage(e, "Impossible de charger les demandes de contact.");
  } finally {
    loading.value = false;
  }
}

function replaceItem(updated) {
  items.value = items.value.map((i) => (i.id === updated.id ? updated : i));
  if (selected.value?.id === updated.id) selected.value = updated;
}

async function changeStatus(row, status) {
  if (row.status === status) return;
  saving.value = true;
  error.value = "";
  try {
    replaceItem(await contactRequestsApiService.updateStatus(row.id, status));
  } catch (e) {
    error.value = errorMessage(e, "Impossible de mettre à jour le statut.");
  } finally {
    saving.value = false;
  }
}

function openDetail(row) {
  selected.value = row;
  if (row.status === "new") changeStatus(row, "read");
}

function requestDelete(row) {
  pendingDelete.value = row;
  deleteMessage.value = `Supprimer la demande de ${row.name} — « ${row.subject} » ?`;
  deleteOpen.value = true;
}

async function confirmDelete() {
  const row = pendingDelete.value;
  if (!row) return;
  saving.value = true;
  try {
    await contactRequestsApiService.remove(row.id);
    items.value = items.value.filter((i) => i.id !== row.id);
    if (selected.value?.id === row.id) selected.value = null;
  } catch (e) {
    error.value = errorMessage(e, "Impossible de supprimer la demande.");
  } finally {
    saving.value = false;
    pendingDelete.value = null;
    deleteOpen.value = false;
  }
}

onMounted(load);
</script>
