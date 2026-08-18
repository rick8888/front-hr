<template>
  <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
      <div>
        <h2 class="text-base font-semibold text-neutral-900">Historique des paiements</h2>
        <p class="mt-0.5 text-sm text-neutral-500">
          {{ invoiceFilter ? `Paiements pour ${invoiceFilter}` : "Tous les encaissements enregistrés" }}
        </p>
      </div>
      <select
        v-if="showInvoiceFilter"
        :value="invoiceIdFilter"
        class="input-base min-w-[14rem] text-sm"
        @change="$emit('update:invoiceIdFilter', $event.target.value)"
      >
        <option value="">Toutes les factures</option>
        <option v-for="inv in invoices" :key="inv.id" :value="inv.id">
          {{ inv.invoice_number }} — {{ inv.company_name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="flex items-center justify-center gap-2 px-5 py-10 text-sm text-neutral-500">
      <span
        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
        aria-hidden="true"
      />
      Chargement…
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Facture</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Entreprise</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Montant</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Mode</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Référence</th>
            <th v-if="showActions" class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="!payments.length">
            <td :colspan="showActions ? 7 : 6" class="px-6 py-10 text-center text-neutral-500">
              Aucun paiement enregistré.
            </td>
          </tr>
          <tr v-for="payment in payments" :key="payment.id" class="hover:bg-neutral-50/60">
            <td class="px-4 py-3 text-neutral-700">{{ formatInvoiceDate(payment.paid_at) }}</td>
            <td class="px-4 py-3 font-mono text-xs font-medium text-neutral-800">
              {{ payment.invoice_number }}
            </td>
            <td class="px-4 py-3 text-neutral-800">{{ payment.company_name }}</td>
            <td class="px-4 py-3 font-medium text-emerald-700">
              {{ formatInvoiceAmount(payment.amount, payment.currency) }}
            </td>
            <td class="px-4 py-3 text-neutral-600">{{ paymentMethodLabel(payment.method) }}</td>
            <td class="px-4 py-3 text-neutral-600">
              <span v-if="payment.reference">{{ payment.reference }}</span>
              <span v-else class="text-neutral-400">—</span>
              <p v-if="payment.notes" class="mt-0.5 text-xs text-neutral-400">{{ payment.notes }}</p>
            </td>
            <td v-if="showActions" class="px-4 py-3 text-right">
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-800"
                :disabled="disabled"
                @click="$emit('delete', payment)"
              >
                Suppr.
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  formatInvoiceAmount,
  formatInvoiceDate,
  paymentMethodLabel,
} from "../../../../data/billing/index.js";

const props = defineProps({
  payments: { type: Array, default: () => [] },
  invoices: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  invoiceIdFilter: { type: String, default: "" },
  showInvoiceFilter: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
});

defineEmits(["update:invoiceIdFilter", "delete"]);

const invoiceFilter = computed(() => {
  if (!props.invoiceIdFilter) return "";
  const inv = props.invoices.find((i) => i.id === props.invoiceIdFilter);
  return inv?.invoice_number ?? "";
});
</script>

