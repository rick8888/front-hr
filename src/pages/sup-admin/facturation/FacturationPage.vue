<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Facturation"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Facturation' }]"
    />

    <p class="mb-4 text-sm text-neutral-500">
      Suivi et émission des factures d'abonnement — synchronisé avec l'API HR
      <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">/api/v1/invoices</code>.
    </p>

    <div
      v-if="billingStore.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ billingStore.error }}
    </div>

    <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Factures payées"
        :value="billingStore.paidCount"
        unit-label="Factures"
        tone="green"
        :loading="billingStore.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Partiellement payées"
        :value="billingStore.partialCount"
        unit-label="Factures"
        tone="blue"
        :loading="billingStore.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="En attente / retard"
        :value="billingStore.pendingCount"
        unit-label="Factures"
        tone="red"
        :loading="billingStore.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Encaissé (toutes devises)"
        :value="billingStore.totalPaidAmount"
        unit-label="Somme des paiements reçus"
        tone="blue"
        :loading="billingStore.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <select v-model="filters.status" class="input-base text-sm" :disabled="billingStore.loading">
        <option value="">Tous les statuts</option>
        <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
      </select>
      <select v-model="filters.company_id" class="input-base min-w-[12rem] text-sm" :disabled="billingStore.loading">
        <option value="">Toutes les entreprises</option>
        <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <ListingTableShell
      search-id="invoices-search"
      search-placeholder="Rechercher une facture…"
      add-button-label="+ Nouvelle facture"
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
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">N° facture</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Entreprise</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Description</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Montant</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Payé</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Reste</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Échéance</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="billingStore.loading">
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
            Aucune facture trouvée.
          </td>
        </tr>
        <template v-else>
          <tr v-for="inv in paginatedRows" :key="inv.id" class="hover:bg-neutral-50/60">
            <td class="px-4 py-3 font-mono text-xs font-medium text-neutral-800">{{ inv.invoice_number }}</td>
            <td class="px-4 py-3 text-sm text-neutral-800">{{ inv.company_name }}</td>
            <td class="max-w-[12rem] truncate px-4 py-3 text-sm text-neutral-600" :title="inv.description">
              {{ inv.description }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-neutral-800">
              {{ formatInvoiceAmount(inv.amount, inv.currency) }}
            </td>
            <td class="px-4 py-3 text-sm text-emerald-700">
              {{ formatInvoiceAmount(inv.amount_paid ?? 0, inv.currency) }}
            </td>
            <td
              class="px-4 py-3 text-sm"
              :class="invoiceBalance(inv) > 0 ? 'font-medium text-amber-700' : 'text-neutral-400'"
            >
              {{ formatInvoiceAmount(invoiceBalance(inv), inv.currency) }}
            </td>
            <td class="px-4 py-3 text-sm text-neutral-600">{{ formatInvoiceDate(inv.due_date) }}</td>
            <td class="px-4 py-3">
              <InvoiceStatusBadge :status="inv.status" />
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <button
                v-if="isInvoicePayable(inv)"
                type="button"
                class="mr-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                :disabled="billingStore.saving"
                @click="openPayment(inv)"
              >
                Paiement
              </button>
              <button
                type="button"
                class="mr-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                :disabled="billingStore.saving"
                @click="openEdit(inv)"
              >
                Modifier
              </button>
              <button
                v-if="isInvoicePayable(inv)"
                type="button"
                class="mr-2 text-sm text-emerald-600 hover:text-emerald-800"
                :disabled="billingStore.saving"
                @click="billingStore.markAsPaid(inv.id)"
              >
                Solde
              </button>
              <button
                type="button"
                class="text-sm text-red-600"
                :disabled="billingStore.saving"
                @click="requestDelete(inv)"
              >
                Suppr.
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <div class="mt-8">
      <PaymentsHistoryTable
        :payments="filteredPayments"
        :invoices="invoices"
        :loading="billingStore.paymentsLoading || billingStore.loading"
        :disabled="billingStore.saving"
        :invoice-id-filter="paymentInvoiceFilter"
        @update:invoice-id-filter="paymentInvoiceFilter = $event"
        @delete="requestDeletePayment"
      />
    </div>

    <InvoiceFormModal
      v-model:open="modalOpen"
      :invoice="editingInvoice"
      :companies="companies"
      :plans="plans"
      :disabled="billingStore.saving"
      @save="onSave"
    />

    <PaymentRecordModal
      v-model:open="paymentModalOpen"
      :invoice="payingInvoice"
      :disabled="billingStore.saving"
      @save="onRecordPayment"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      title="Supprimer cette facture ?"
      :message="deleteMessage"
      confirm-text="Supprimer"
      variant="danger"
      :busy="billingStore.saving"
      @confirm="confirmDelete"
    />

    <ConfirmDialog
      v-model="deletePaymentOpen"
      title="Supprimer ce paiement ?"
      :message="deletePaymentMessage"
      confirm-text="Supprimer"
      variant="danger"
      :busy="billingStore.saving"
      @confirm="confirmDeletePayment"
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
import InvoiceFormModal from "./components/InvoiceFormModal.vue";
import InvoiceStatusBadge from "./components/InvoiceStatusBadge.vue";
import PaymentRecordModal from "./components/PaymentRecordModal.vue";
import PaymentsHistoryTable from "./components/PaymentsHistoryTable.vue";
import {
  INVOICE_STATUS_LABELS,
  formatInvoiceAmount,
  formatInvoiceDate,
  invoiceBalance,
  isInvoicePayable,
} from "../../../data/billing/index.js";
import { useBillingStore } from "./store/billing.store.js";
import { useCompaniesStore } from "../entreprises/store/companies.store.js";
import { usePlansStore } from "../plans/store/plans.store.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";

const billingStore = useBillingStore();
const companiesStore = useCompaniesStore();
const plansStore = usePlansStore();

const { invoices, payments } = storeToRefs(billingStore);
const { companies } = storeToRefs(companiesStore);
const { plans } = storeToRefs(plansStore);

const statusLabels = INVOICE_STATUS_LABELS;

const modalOpen = ref(false);
const paymentModalOpen = ref(false);
const editingInvoice = ref(null);
const payingInvoice = ref(null);
const deleteOpen = ref(false);
const deletePaymentOpen = ref(false);
const deleteMessage = ref("");
const deletePaymentMessage = ref("");
const pendingDeleteId = ref(null);
const pendingDeletePaymentId = ref(null);
const paymentInvoiceFilter = ref("");

const filteredPayments = computed(() => {
  if (!paymentInvoiceFilter.value) return payments.value;
  return payments.value.filter(
    (p) => Number(p.invoice_id) === Number(paymentInvoiceFilter.value)
  );
});

const {
  searchQuery,
  page,
  pageSize,
  filters,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
} = usePaginatedSearch(invoices, {
  pageSize: 10,
  searchFields: ["invoice_number", "company_name", "description", "status", "plan_code"],
  initialFilters: { status: "", company_id: "" },
  customFilter: (row, f) => {
    if (f.status && row.status !== f.status) return false;
    if (f.company_id && Number(row.company_id) !== Number(f.company_id)) return false;
    return true;
  },
});

function openCreate() {
  editingInvoice.value = null;
  modalOpen.value = true;
}

function openEdit(invoice) {
  editingInvoice.value = invoice;
  modalOpen.value = true;
}

function openPayment(invoice) {
  payingInvoice.value = invoice;
  paymentModalOpen.value = true;
}

async function onSave(payload) {
  if (editingInvoice.value?.id) {
    await billingStore.updateInvoice(editingInvoice.value.id, payload);
  } else {
    await billingStore.createInvoice(payload);
  }
}

async function onRecordPayment(payload) {
  if (!payingInvoice.value?.id) return;
  await billingStore.recordPayment(payingInvoice.value.id, payload);
  payingInvoice.value =
    invoices.value.find((i) => i.id === payingInvoice.value.id) ?? null;
}

function requestDelete(invoice) {
  pendingDeleteId.value = invoice.id;
  deleteMessage.value = `Supprimer la facture ${invoice.invoice_number} pour ${invoice.company_name} ?`;
  deleteOpen.value = true;
}

function requestDeletePayment(payment) {
  pendingDeletePaymentId.value = payment.id;
  deletePaymentMessage.value = `Supprimer le paiement de ${formatInvoiceAmount(payment.amount, payment.currency)} pour ${payment.invoice_number} ? Le solde de la facture sera recalculé.`;
  deletePaymentOpen.value = true;
}

async function confirmDelete() {
  if (pendingDeleteId.value) {
    await billingStore.deleteInvoice(pendingDeleteId.value);
    pendingDeleteId.value = null;
  }
  deleteOpen.value = false;
}

async function confirmDeletePayment() {
  if (pendingDeletePaymentId.value) {
    await billingStore.deletePayment(pendingDeletePaymentId.value);
    pendingDeletePaymentId.value = null;
  }
  deletePaymentOpen.value = false;
}

onMounted(async () => {
  await Promise.all([
    billingStore.fetchInvoices(),
    billingStore.fetchPayments(),
    companiesStore.fetchCompanies(),
    plansStore.fetchPlans(),
  ]);
});
</script>
