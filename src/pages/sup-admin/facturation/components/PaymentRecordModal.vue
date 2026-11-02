<template>
  <Modal
    :model-value="open"
    :title="`Enregistrer un paiement — ${invoice?.invoice_number ?? ''}`"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open && invoice" class="space-y-4" @submit.prevent="submit">
      <div class="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm">
        <div class="flex justify-between gap-4">
          <span class="text-neutral-600">Montant facture</span>
          <span class="font-medium text-neutral-900">
            {{ formatInvoiceAmount(invoice.amount, invoice.currency) }}
          </span>
        </div>
        <div class="mt-1 flex justify-between gap-4">
          <span class="text-neutral-600">Déjà payé</span>
          <span class="font-medium text-emerald-700">
            {{ formatInvoiceAmount(invoice.amount_paid ?? 0, invoice.currency) }}
          </span>
        </div>
        <div class="mt-1 flex justify-between gap-4 border-t border-neutral-200 pt-2">
          <span class="font-medium text-neutral-800">Solde restant</span>
          <span class="font-semibold text-primary-700">
            {{ formatInvoiceAmount(balance, invoice.currency) }}
          </span>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Montant du paiement <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-2">
          <input
            v-model.number="form.amount"
            type="number"
            min="0.01"
            :max="balance"
            step="0.01"
            class="input-base flex-1 text-sm"
          />
          <button
            type="button"
            class="btn-outline whitespace-nowrap text-sm"
            :disabled="disabled"
            @click="form.amount = balance"
          >
            Solde complet
          </button>
        </div>
        <p v-if="errors.amount" class="mt-1 text-xs text-red-600">{{ errors.amount }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date du paiement</label>
          <input v-model="form.paid_at" type="date" class="input-base w-full text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Mode de paiement</label>
          <select v-model="form.method" class="input-base w-full text-sm">
            <option v-for="(label, key) in methodLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Référence</label>
        <input
          v-model="form.reference"
          type="text"
          class="input-base w-full text-sm"
          placeholder="N° virement, référence CB…"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Notes</label>
        <textarea v-model="form.notes" rows="2" class="input-base w-full resize-y text-sm" />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="button" class="btn-primary" :disabled="disabled" @click="submit">
          Enregistrer le paiement
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import {
  PAYMENT_METHOD_LABELS,
  formatInvoiceAmount,
  invoiceBalance,
} from "../../../../data/billing/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  invoice: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const methodLabels = PAYMENT_METHOD_LABELS;
const errors = ref({});

const today = () => new Date().toISOString().slice(0, 10);

const form = reactive({
  amount: 0,
  paid_at: today(),
  method: "bank_transfer",
  reference: "",
  notes: "",
});

const balance = computed(() => (props.invoice ? invoiceBalance(props.invoice) : 0));

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    form.amount = balance.value;
    form.paid_at = today();
    form.method = props.invoice?.payment_method || "bank_transfer";
    form.reference = "";
    form.notes = "";
  }
);

function validate() {
  const e = {};
  if (!form.amount || form.amount <= 0) {
    e.amount = "Indiquez un montant supérieur à 0.";
  } else if (form.amount > balance.value + 0.001) {
    e.amount = `Le montant ne peut pas dépasser ${formatInvoiceAmount(balance.value, props.invoice?.currency)}.`;
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

function submit() {
  if (!validate()) return;
  emit("save", {
    amount: form.amount,
    paid_at: form.paid_at,
    method: form.method,
    reference: form.reference.trim(),
    notes: form.notes.trim(),
  });
  emit("update:open", false);
}
</script>
