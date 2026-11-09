<template>
  <Modal
    :model-value="open"
    :title="`Enregistrer un paiement — ${invoice?.invoice_number ?? ''}`"
    size="lg"
    panel-class="max-h-[calc(100vh-2rem)] flex flex-col"
    body-class="min-h-0 max-h-[calc(100vh-10rem)] flex-1"
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

      <section
        class="space-y-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4"
        aria-label="Informations de la demande de paiement"
      >
        <h3 class="text-sm font-semibold text-neutral-900">Demande de paiement du tenant</h3>

        <dl v-if="requestDetails.length" class="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
          <div v-for="detail in requestDetails" :key="detail.label" class="min-w-0">
            <dt class="text-xs font-medium text-neutral-500">{{ detail.label }}</dt>
            <dd class="break-words text-neutral-800">{{ detail.value }}</dd>
          </div>
        </dl>

        <div v-if="invoice.payment_proof_url" class="rounded-lg border border-neutral-200 bg-white p-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 3.75h7.5L19.25 8.5v11.75A1.75 1.75 0 0 1 17.5 22h-10A1.75 1.75 0 0 1 5.75 20.25V5.5A1.75 1.75 0 0 1 7.5 3.75Zm7.25.5V9h4.75M8.5 13h7m-7 3.5h7" />
                </svg>
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-neutral-900">{{ proofFileName }}</p>
                <p class="text-xs text-neutral-500">Justificatif fourni avec la demande</p>
              </div>
            </div>
            <a
              v-if="proofPreviewUrl"
              :href="proofPreviewUrl"
              :download="proofFileName"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3.75v11.5m0 0 4-4m-4 4-4-4M4.75 15.5v3.75A1.75 1.75 0 0 0 6.5 21h11a1.75 1.75 0 0 0 1.75-1.75V15.5" />
              </svg>
              Voir / télécharger
            </a>
            <span v-else-if="proofLoading" class="text-xs text-neutral-500">Chargement du fichier…</span>
          </div>

          <div v-if="proofPreviewUrl && proofMimeType.startsWith('image/')" class="mt-3 rounded-lg bg-neutral-50 p-2">
            <img
              :src="proofPreviewUrl"
              :alt="`Justificatif de paiement ${invoice.invoice_number}`"
              class="mx-auto max-h-72 max-w-full rounded object-contain"
            />
          </div>
          <iframe
            v-else-if="proofPreviewUrl && proofMimeType === 'application/pdf'"
            :src="proofPreviewUrl"
            :title="`Justificatif de paiement ${invoice.invoice_number}`"
            class="mt-3 h-72 w-full rounded-lg border border-neutral-200"
          />
          <div v-if="proofError" class="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p class="text-xs text-red-600">{{ proofError }}</p>
            <button
              type="button"
              class="shrink-0 text-xs font-semibold text-primary-700 underline underline-offset-2"
              :disabled="proofLoading"
              @click="loadProof"
            >
              Réessayer
            </button>
          </div>
        </div>

        <div v-if="invoice.notes && !requestDetails.length" class="text-sm text-neutral-700">
          {{ invoice.notes }}
        </div>
        <p
          v-if="!invoice.payment_proof_url && !requestDetails.length && !invoice.notes"
          class="text-sm text-neutral-600"
        >
          Aucun justificatif ni détail de demande n’est associé à cette facture.
        </p>
      </section>

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
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { billingApiService } from "../services/billing.api.service.js";
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
const proofPreviewUrl = ref("");
const proofMimeType = ref("");
const proofLoading = ref(false);
const proofError = ref("");
let proofRequestId = 0;

const today = () => new Date().toISOString().slice(0, 10);

const form = reactive({
  amount: 0,
  paid_at: today(),
  method: "bank_transfer",
  reference: "",
  notes: "",
});

const balance = computed(() => (props.invoice ? invoiceBalance(props.invoice) : 0));
const proofFileName = computed(() => {
  const extension = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[proofMimeType.value] ?? "file";

  return `${props.invoice?.invoice_number ?? "paiement"}-justificatif.${extension}`;
});
const requestDetails = computed(() => {
  if (!props.invoice?.notes) return [];

  const labels = {
    "transfer reference": "Référence déclarée",
    reference: "Référence déclarée",
    operator: "Opérateur mobile",
    phone: "Téléphone de paiement",
  };

  return String(props.invoice.notes)
    .split(" | ")
    .map((part) => {
      const separatorIndex = part.indexOf(":");
      if (separatorIndex < 0) return null;

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      if (!value || key.toLowerCase() === "payment method") return null;

      return {
        label: labels[key.toLowerCase()] ?? key,
        value,
      };
    })
    .filter(Boolean);
});

watch(
  () => [props.open, props.invoice?.id, props.invoice?.payment_proof_url],
  async ([isOpen]) => {
    proofRequestId += 1;
    if (proofPreviewUrl.value) URL.revokeObjectURL(proofPreviewUrl.value);
    proofPreviewUrl.value = "";
    proofMimeType.value = "";
    proofError.value = "";

    if (!isOpen || !props.invoice?.payment_proof_url) {
      proofLoading.value = false;
      return;
    }

    await loadProof();
  },
  { immediate: true },
);

async function loadProof() {
  const requestId = ++proofRequestId;
  proofError.value = "";
  proofLoading.value = true;

  try {
    const { data } = await billingApiService.downloadPaymentProof(props.invoice.id);
    if (requestId !== proofRequestId) return;
    proofMimeType.value = data.type ?? "";
    proofPreviewUrl.value = URL.createObjectURL(data);
  } catch (error) {
    if (requestId === proofRequestId) {
      const status = error.response?.status;
      proofError.value = status === 404
        ? "Le fichier justificatif est introuvable sur le serveur."
        : status === 401 || status === 403
          ? "Vous n’êtes pas autorisé à consulter ce justificatif."
          : status
            ? `Le serveur n’a pas pu charger le justificatif (erreur ${status}).`
            : "Le serveur est injoignable. Vérifiez votre connexion puis réessayez.";
    }
  } finally {
    if (requestId === proofRequestId) proofLoading.value = false;
  }
}

onBeforeUnmount(() => {
  proofRequestId += 1;
  if (proofPreviewUrl.value) URL.revokeObjectURL(proofPreviewUrl.value);
});

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
