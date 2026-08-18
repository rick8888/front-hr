<template>
  <Modal
    :model-value="open"
    :title="isEdit ? `Modifier — ${obligation?.code}` : 'Nouvelle obligation de déclaration'"
    size="xl"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-5" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Pays <span class="text-red-500">*</span>
          </label>
          <select v-model.number="form.country_id" class="input-base w-full text-sm" :disabled="isEdit">
            <option v-for="c in countries" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.code }})
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Code <span class="text-red-500">*</span>
          </label>
          <input v-model="form.code" type="text" class="input-base w-full font-mono text-sm uppercase" />
          <p v-if="errors.code" class="mt-1 text-xs text-red-600">{{ errors.code }}</p>
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Libellé <span class="text-red-500">*</span>
          </label>
          <input v-model="form.name" type="text" class="input-base w-full text-sm" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Description</label>
          <textarea v-model="form.description" rows="2" class="input-base w-full resize-y text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Type</label>
          <select v-model="form.type" class="input-base w-full text-sm">
            <option v-for="(label, key) in TYPE_LABELS" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Organisme</label>
          <input v-model="form.authority" type="text" class="input-base w-full text-sm" placeholder="CNSS, DGI…" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Fréquence</label>
          <select v-model="form.frequency" class="input-base w-full text-sm">
            <option v-for="(label, key) in FREQUENCY_LABELS" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Période de référence</label>
          <select v-model="form.reference_period" class="input-base w-full text-sm">
            <option v-for="(label, key) in REFERENCE_PERIOD_LABELS" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
      </div>

      <div class="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4">
        <h3 class="mb-3 text-sm font-semibold text-neutral-800">Règle d'échéance</h3>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="sm:col-span-3">
            <label class="mb-1 block text-sm font-medium text-neutral-800">Type de règle</label>
            <select v-model="form.due_rule.type" class="input-base w-full text-sm">
              <option v-for="(label, key) in DUE_RULE_TYPE_LABELS" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>
          <div v-if="form.due_rule.type === 'fixed_day_next_month'">
            <label class="mb-1 block text-sm font-medium text-neutral-800">Jour du mois suivant</label>
            <input v-model.number="form.due_rule.day" type="number" min="1" max="31" class="input-base w-full text-sm" />
          </div>
          <template v-if="form.due_rule.type === 'fixed_day'">
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Mois</label>
              <input v-model.number="form.due_rule.month" type="number" min="1" max="12" class="input-base w-full text-sm" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Jour</label>
              <input v-model.number="form.due_rule.day" type="number" min="1" max="31" class="input-base w-full text-sm" />
            </div>
          </template>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Jours de grâce</label>
            <input v-model.number="form.grace_days" type="number" min="0" max="90" class="input-base w-full text-sm" />
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Canal de dépôt</label>
          <select v-model="form.settings.filing_channel" class="input-base w-full text-sm">
            <option v-for="(label, key) in FILING_CHANNEL_LABELS" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date d'effet</label>
          <input v-model="form.effective_from" type="date" class="input-base w-full text-sm" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-medium text-neutral-800">Cotisations liées</label>
          <div v-if="!legalTaxes.length" class="text-xs text-neutral-500">
            Aucune cotisation légale pour ce pays.
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <label
              v-for="tax in legalTaxes"
              :key="tax.id"
              class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs"
              :class="isLinked(tax.code) ? 'border-primary-300 bg-primary-50 text-primary-800' : 'text-neutral-700'"
            >
              <input
                type="checkbox"
                class="rounded border-neutral-300"
                :checked="isLinked(tax.code)"
                @change="toggleLinkedCode(tax.code)"
              />
              {{ tax.code }}
            </label>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input v-model="form.is_active" type="checkbox" class="rounded border-neutral-300" />
            Active
          </label>
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input v-model="form.settings.is_mandatory" type="checkbox" class="rounded border-neutral-300" />
            Obligatoire
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-neutral-100 pt-4">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="submit" class="btn-primary" :disabled="disabled">
          {{ isEdit ? "Enregistrer" : "Créer" }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import {
  TYPE_LABELS,
  FREQUENCY_LABELS,
  REFERENCE_PERIOD_LABELS,
  DUE_RULE_TYPE_LABELS,
  FILING_CHANNEL_LABELS,
  defaultForm,
  obligationToForm,
  formToPayload,
} from "../../../../data/compliance-obligation/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  obligation: { type: Object, default: null },
  countries: { type: Array, default: () => [] },
  legalTaxes: { type: Array, default: () => [] },
  defaultCountryId: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const isEdit = computed(() => Boolean(props.obligation?.id));
const form = reactive(defaultForm(props.defaultCountryId));
const errors = ref({});

watch(
  () => [props.open, props.obligation, props.defaultCountryId],
  () => {
    if (!props.open) return;
    errors.value = {};
    const base = props.obligation
      ? obligationToForm(props.obligation)
      : defaultForm(props.defaultCountryId ?? props.countries[0]?.id);
    Object.assign(form, base);
  },
  { immediate: true }
);

function isLinked(code) {
  return form.settings.linked_rule_codes.includes(code);
}

function toggleLinkedCode(code) {
  const codes = form.settings.linked_rule_codes;
  if (codes.includes(code)) {
    form.settings.linked_rule_codes = codes.filter((c) => c !== code);
  } else {
    form.settings.linked_rule_codes = [...codes, code];
  }
}

function validate() {
  const next = {};
  if (!form.code?.trim()) next.code = "Le code est requis.";
  if (!form.name?.trim()) next.name = "Le libellé est requis.";
  errors.value = next;
  return Object.keys(next).length === 0;
}

function submit() {
  if (!validate()) return;
  emit("save", formToPayload(form));
  emit("update:open", false);
}
</script>
