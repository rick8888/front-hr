<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Cotisations légales"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Cotisations légales' }]"
    />

    <p class="mb-4 text-sm text-neutral-500">
      Gestion des cotisations fiscales et sociales par pays — synchronisé avec l'API HR
      <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">/api/v1/legal-taxes</code>.
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
            {{ c.name }} ({{ c.code }}) — {{ c.currency }}
          </option>
        </select>
      </div>
    </div>

    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <KpiCard
        title="Cotisations actives"
        :value="store.activeTaxesCount"
        unit-label="Taxes"
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
        title="Sociales"
        :value="store.socialCount"
        unit-label="CNSS, AMO…"
        tone="blue"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Fiscales"
        :value="store.fiscalCount"
        unit-label="IR, IPR…"
        tone="violet"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <ListingTableShell
      search-id="legal-taxes-search"
      search-placeholder="Rechercher une cotisation…"
      add-button-label="+ Nouvelle cotisation"
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
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Nature</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Calcul</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Base</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Taux ER</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Taux EE</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Plafond</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="store.loading">
          <td colspan="10" class="px-6 py-16 text-center text-sm text-neutral-600">
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
          <td colspan="10" class="px-6 py-12 text-center text-sm text-neutral-500">
            Aucune cotisation pour ce pays.
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="tax in paginatedRows"
            :key="tax.id"
            class="hover:bg-neutral-50/60"
            :class="{ 'opacity-60': !tax.is_active }"
          >
            <td class="px-4 py-3 font-mono text-xs font-semibold text-neutral-800">{{ tax.code }}</td>
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-neutral-800">{{ tax.name }}</p>
              <p v-if="tax.description" class="mt-0.5 max-w-xs truncate text-xs text-neutral-500" :title="tax.description">
                {{ tax.description }}
              </p>
            </td>
            <td class="px-4 py-3">
              <LegalTaxCategoryBadge :tax="tax" />
            </td>
            <td class="px-4 py-3">
              <LegalTaxTypeBadge :type="tax.type" />
              <p v-if="tax.type === 'progressive'" class="mt-1 text-xs text-neutral-500">
                {{ tax.brackets?.length ?? 0 }} tranche(s)
              </p>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ baseTargetLabel(tax.base_target) }}</td>
            <td class="px-4 py-3 text-sm text-neutral-800">
              <template v-if="tax.type === 'percent' || tax.type === 'formula'">
                {{ formatRatePercent(tax.employer_rate) }}
              </template>
              <template v-else-if="tax.type === 'fixed'">
                {{ formatAmount(tax.employer_rate, currency) }}
              </template>
              <span v-else class="text-neutral-400">—</span>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-800">
              <template v-if="tax.type === 'percent' || tax.type === 'formula'">
                {{ formatRatePercent(tax.employee_rate) }}
              </template>
              <template v-else-if="tax.type === 'fixed'">
                {{ formatAmount(tax.employee_rate, currency) }}
              </template>
              <span v-else class="text-neutral-400">—</span>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-600">
              {{ tax.ceiling != null ? formatAmount(tax.ceiling, currency) : "—" }}
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="tax.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-500'"
              >
                {{ tax.is_active ? "Active" : "Inactive" }}
              </span>
              <span
                v-if="tax.reduces_taxable"
                class="ml-1 inline-flex rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700"
                title="Réduit la base imposable"
              >
                ↓ imp.
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <button
                type="button"
                class="mr-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                :disabled="store.saving"
                @click="openEdit(tax)"
              >
                Modifier
              </button>
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-800"
                :disabled="store.saving"
                @click="requestDelete(tax)"
              >
                Suppr.
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <LegalTaxFormModal
      v-model:open="modalOpen"
      :tax="editingTax"
      :countries="store.countries"
      :default-country-id="store.selectedCountryId"
      :disabled="store.saving"
      @save="onSave"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer cette cotisation ?"
      :message="deleteMessage"
      confirm-text="Supprimer"
      variant="danger"
      :busy="store.saving"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import PageHero from "../../../components/common/PageHero.vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import ConfirmDialog from "../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../components/leave-management/ListingTableShell.vue";
import LegalTaxCategoryBadge from "./components/LegalTaxCategoryBadge.vue";
import LegalTaxTypeBadge from "./components/LegalTaxTypeBadge.vue";
import LegalTaxFormModal from "./components/LegalTaxFormModal.vue";
import {
  baseTargetLabel,
  formatRatePercent,
  formatAmount,
} from "../../../data/legal-tax/index.js";
import { useLegalTaxStore } from "./store/legal-tax.store.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";

const store = useLegalTaxStore();
const { filteredTaxes, selectedCountry } = storeToRefs(store);

const modalOpen = ref(false);
const editingTax = ref(null);
const deleteOpen = ref(false);
const deleteMessage = ref("");
const pendingDeleteId = ref(null);

const currency = computed(() => selectedCountry.value?.currency ?? "EUR");

const {
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
} = usePaginatedSearch(filteredTaxes, {
  pageSize: 10,
  searchFields: ["code", "name", "description", "category", "type", "base_target"],
});

function openCreate() {
  editingTax.value = null;
  modalOpen.value = true;
}

function openEdit(tax) {
  editingTax.value = tax;
  modalOpen.value = true;
}

async function onSave(payload) {
  if (editingTax.value?.id) {
    await store.updateLegalTax(editingTax.value.id, payload);
  } else {
    await store.createLegalTax(payload);
  }
}

function requestDelete(tax) {
  pendingDeleteId.value = tax.id;
  deleteMessage.value = `Supprimer la cotisation ${tax.code} — ${tax.name} ?`;
  deleteOpen.value = true;
}

async function confirmDelete() {
  if (pendingDeleteId.value) {
    await store.deleteLegalTax(pendingDeleteId.value);
    pendingDeleteId.value = null;
  }
  deleteOpen.value = false;
}

onMounted(() => store.init());
</script>
