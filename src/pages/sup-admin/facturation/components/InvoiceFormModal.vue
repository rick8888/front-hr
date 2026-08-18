<template>
  <Modal
    :model-value="open"
    :title="isEdit ? `Facture ${invoice?.invoice_number}` : 'Nouvelle facture'"
    size="lg"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Entreprise <span class="text-red-500">*</span>
          </label>
          <select v-model.number="form.company_id" class="input-base w-full text-sm" @change="onCompanyChange">
            <option value="">— Sélectionner —</option>
            <option v-for="c in companies" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.code }})
            </option>
          </select>
          <p v-if="errors.company_id" class="mt-1 text-xs text-red-600">{{ errors.company_id }}</p>
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Description</label>
          <input v-model="form.description" type="text" class="input-base w-full text-sm" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Plan lié</label>
          <select v-model="form.plan_code" class="input-base w-full text-sm" @change="onPlanChange">
            <option value="">— Aucun —</option>
            <option v-for="p in plans" :key="p.code" :value="p.code">
              {{ p.name }} — {{ formatPlanPrice(p) }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Statut</label>
          <select v-model="form.status" class="input-base w-full text-sm">
            <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Montant <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <input v-model.number="form.amount" type="number" min="0" step="0.01" class="input-base flex-1 text-sm" />
            <input v-model="form.currency" type="text" class="input-base w-20 text-sm font-mono uppercase" />
          </div>
          <p v-if="errors.amount" class="mt-1 text-xs text-red-600">{{ errors.amount }}</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date d'émission</label>
          <input v-model="form.issue_date" type="date" class="input-base w-full text-sm" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date d'échéance</label>
          <input v-model="form.due_date" type="date" class="input-base w-full text-sm" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Début de période</label>
          <input v-model="form.period_start" type="date" class="input-base w-full text-sm" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Fin de période</label>
          <input v-model="form.period_end" type="date" class="input-base w-full text-sm" />
        </div>

        <div v-if="form.status === 'paid'" class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date de paiement</label>
          <input v-model="form.paid_at" type="date" class="input-base w-full text-sm" />
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Notes internes</label>
          <textarea v-model="form.notes" rows="2" class="input-base w-full text-sm resize-y" />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex gap-3 border-t border-neutral-200 px-6 py-4 justify-end">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="button" class="btn-primary" :disabled="disabled" @click="submit">
          {{ isEdit ? "Enregistrer" : "Créer la facture" }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { INVOICE_STATUS_LABELS } from "../../../../data/billing/index.js";
import { formatPlanPrice } from "../../../../data/subscription/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  invoice: { type: Object, default: null },
  companies: { type: Array, default: () => [] },
  plans: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const statusLabels = INVOICE_STATUS_LABELS;
const isEdit = computed(() => !!props.invoice?.id);
const errors = ref({});

const today = () => new Date().toISOString().slice(0, 10);

const form = reactive({
  company_id: "",
  description: "",
  plan_code: "",
  amount: 0,
  currency: "EUR",
  status: "draft",
  issue_date: today(),
  due_date: today(),
  period_start: "",
  period_end: "",
  paid_at: "",
  notes: "",
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    if (props.invoice) {
      Object.assign(form, {
        company_id: props.invoice.company_id ?? "",
        description: props.invoice.description ?? "",
        plan_code: props.invoice.plan_code ?? "",
        amount: props.invoice.amount ?? 0,
        currency: props.invoice.currency ?? "EUR",
        status: props.invoice.status ?? "draft",
        issue_date: props.invoice.issue_date ?? today(),
        due_date: props.invoice.due_date ?? today(),
        period_start: props.invoice.period_start ?? "",
        period_end: props.invoice.period_end ?? "",
        paid_at: props.invoice.paid_at ?? "",
        notes: props.invoice.notes ?? "",
      });
    } else {
      Object.assign(form, {
        company_id: "",
        description: "",
        plan_code: "",
        amount: 0,
        currency: "EUR",
        status: "draft",
        issue_date: today(),
        due_date: today(),
        period_start: "",
        period_end: "",
        paid_at: "",
        notes: "",
      });
    }
  }
);

function onCompanyChange() {
  const company = props.companies.find((c) => c.id === form.company_id);
  if (company) {
    form.currency = company.currency || "EUR";
    if (!form.description) {
      form.description = `Abonnement — ${company.name}`;
    }
  }
}

function onPlanChange() {
  const plan = props.plans.find((p) => p.code === form.plan_code);
  if (plan) {
    form.amount = plan.price_monthly ?? 0;
    if (!form.description || form.description.startsWith("Abonnement")) {
      form.description = `Abonnement ${plan.name}`;
    }
  }
}

function validate() {
  const e = {};
  if (!form.company_id) e.company_id = "Sélectionnez une entreprise.";
  if (form.amount == null || form.amount < 0) e.amount = "Montant invalide.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

function submit() {
  if (!validate()) return;
  emit("save", {
    company_id: form.company_id,
    description: form.description.trim(),
    plan_code: form.plan_code || null,
    amount: form.amount,
    currency: form.currency.trim().toUpperCase(),
    status: form.status,
    issue_date: form.issue_date,
    due_date: form.due_date,
    period_start: form.period_start || null,
    period_end: form.period_end || null,
    paid_at: form.status === "paid" ? form.paid_at || today() : null,
    notes: form.notes.trim(),
  });
  emit("update:open", false);
}
</script>
