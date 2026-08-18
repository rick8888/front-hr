<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Déclarations par pays"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Déclarations' }]"
    />

    <p class="mb-4 text-sm text-neutral-500">
      Référentiel des obligations de déclaration fiscale et sociale — synchronisé avec l'API HR
      <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">/api/v1/compliance-obligations</code>.
    </p>

    <div
      v-if="store.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ store.error }}
    </div>

    <div class="mb-6 flex flex-wrap items-end gap-4">
      <div class="min-w-[14rem]">
        <label class="mb-1 block text-sm font-medium text-neutral-800">Pays</label>
        <select
          :value="store.selectedCountryId"
          class="input-base w-full text-sm"
          :disabled="store.loading"
          @change="store.selectCountry(Number($event.target.value))"
        >
          <option v-for="c in store.countries" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.code }})
          </option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Type</label>
        <div class="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
          <button
            v-for="tab in typeTabs"
            :key="tab.id"
            type="button"
            class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
            :class="store.typeFilter === tab.id ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'"
            :disabled="store.loading"
            @click="store.typeFilter = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <KpiCard
        title="Obligations actives"
        :value="store.activeCount"
        unit-label="Déclarations"
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
        title="Fiscales"
        :value="store.fiscalCount"
        unit-label="IR, ITS…"
        tone="violet"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Sociales"
        :value="store.socialCount"
        unit-label="CNSS, CNPS…"
        tone="blue"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <ListingTableShell
      search-id="compliance-obligations-search"
      search-placeholder="Rechercher une obligation…"
      add-button-label="+ Nouvelle obligation"
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
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Code</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Libellé</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Type</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Organisme</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Fréquence</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Échéance</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Cotisations</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="store.loading">
          <td colspan="9" class="px-6 py-16 text-center text-sm text-neutral-600">
            <span class="inline-flex items-center gap-2">
              <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
                aria-hidden="true"
              />
              Chargement…
            </span>
          </td>
        </tr>
        <tr v-else-if="!paginatedRows.length">
          <td colspan="9" class="px-6 py-12 text-center text-sm text-neutral-500">
            Aucune obligation pour ce pays.
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="row in paginatedRows"
            :key="row.id"
            class="hover:bg-neutral-50/60"
            :class="{ 'opacity-60': !row.is_active }"
          >
            <td class="px-4 py-3 font-mono text-xs font-semibold text-neutral-800">{{ row.code }}</td>
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-neutral-800">{{ row.name }}</p>
              <p v-if="row.description" class="mt-0.5 max-w-xs truncate text-xs text-neutral-500" :title="row.description">
                {{ row.description }}
              </p>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="row.type === 'fiscal' ? 'bg-violet-50 text-violet-800' : 'bg-sky-50 text-sky-800'"
              >
                {{ typeLabel(row.type) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ row.authority || "—" }}</td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ frequencyLabel(row.frequency) }}</td>
            <td class="px-4 py-3 text-sm text-neutral-800">
              {{ row.due_rule_label }}
              <p v-if="row.grace_days" class="text-xs text-neutral-500">+{{ row.grace_days }}j de grâce</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="code in (row.linked_rule_codes ?? []).slice(0, 3)"
                  :key="code"
                  class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600"
                >
                  {{ code }}
                </span>
                <span
                  v-if="(row.linked_rule_codes ?? []).length > 3"
                  class="text-xs text-neutral-400"
                >
                  +{{ row.linked_rule_codes.length - 3 }}
                </span>
                <span v-if="!(row.linked_rule_codes ?? []).length" class="text-sm text-neutral-400">—</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="row.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-500'"
              >
                {{ row.is_active ? "Active" : "Inactive" }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <button
                type="button"
                class="mr-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                :disabled="store.saving"
                @click="openEdit(row)"
              >
                Modifier
              </button>
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-800"
                :disabled="store.saving"
                @click="requestDelete(row)"
              >
                Suppr.
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <ComplianceObligationFormModal
      v-model:open="modalOpen"
      :obligation="editingObligation"
      :countries="store.countries"
      :legal-taxes="store.legalTaxes"
      :default-country-id="store.selectedCountryId"
      :disabled="store.saving"
      @save="onSave"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer cette obligation ?"
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
import ConfirmDialog from "../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../components/leave-management/ListingTableShell.vue";
import ComplianceObligationFormModal from "./components/ComplianceObligationFormModal.vue";
import { typeLabel, frequencyLabel } from "../../../data/compliance-obligation/index.js";
import { useComplianceObligationStore } from "./store/compliance-obligation.store.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";

const store = useComplianceObligationStore();
const { filteredObligations } = storeToRefs(store);

const typeTabs = [
  { id: "all", label: "Toutes" },
  { id: "fiscal", label: "Fiscales" },
  { id: "social", label: "Sociales" },
];

const modalOpen = ref(false);
const editingObligation = ref(null);
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
} = usePaginatedSearch(filteredObligations, {
  pageSize: 10,
  searchFields: ["code", "name", "description", "authority", "type"],
});

function openCreate() {
  editingObligation.value = null;
  modalOpen.value = true;
}

function openEdit(row) {
  editingObligation.value = row;
  modalOpen.value = true;
}

async function onSave(payload) {
  if (editingObligation.value?.id) {
    await store.updateObligation(editingObligation.value.id, payload);
  } else {
    await store.createObligation(payload);
  }
}

function requestDelete(row) {
  pendingDeleteId.value = row.id;
  deleteMessage.value = `Supprimer l'obligation ${row.code} — ${row.name} ?`;
  deleteOpen.value = true;
}

async function confirmDelete() {
  if (pendingDeleteId.value) {
    await store.deleteObligation(pendingDeleteId.value);
    pendingDeleteId.value = null;
  }
  deleteOpen.value = false;
}

onMounted(() => store.init());
</script>
