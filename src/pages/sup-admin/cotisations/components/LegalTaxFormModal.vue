<template>
  <Modal
    :model-value="open"
    :title="isEdit ? `Modifier — ${tax?.code}` : 'Nouvelle cotisation légale'"
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
          <label class="mb-1 block text-sm font-medium text-neutral-800">Nature</label>
          <select v-model="form.category" class="input-base w-full text-sm">
            <option v-for="(label, key) in categoryLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Mode de calcul</label>
          <select v-model="form.type" class="input-base w-full text-sm">
            <option v-for="(label, key) in typeLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Base de calcul</label>
          <select v-model="form.base_target" class="input-base w-full text-sm">
            <option v-for="(label, key) in baseLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Séquence</label>
          <input v-model.number="form.sequence" type="number" min="0" class="input-base w-full text-sm" />
        </div>
        <div class="flex items-end gap-4">
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input v-model="form.is_active" type="checkbox" class="rounded border-neutral-300" />
            Active
          </label>
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input v-model="form.reduces_taxable" type="checkbox" class="rounded border-neutral-300" />
            Réduit l'imposable
          </label>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date d'effet</label>
          <input v-model="form.effective_from" type="date" class="input-base w-full text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date de fin</label>
          <input v-model="form.effective_to" type="date" class="input-base w-full text-sm" />
        </div>
      </div>

      <template v-if="form.type === 'percent'">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Taux employeur (%)</label>
            <input v-model.number="form.employer_rate_pct" type="number" min="0" max="100" step="0.0001" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Taux salarié (%)</label>
            <input v-model.number="form.employee_rate_pct" type="number" min="0" max="100" step="0.0001" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Plafond ({{ currency }})</label>
            <input v-model.number="form.ceiling" type="number" min="0" class="input-base w-full text-sm" placeholder="Sans plafond" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Plancher ({{ currency }})</label>
            <input v-model.number="form.floor" type="number" min="0" class="input-base w-full text-sm" placeholder="—" />
          </div>
        </div>
      </template>

      <template v-else-if="form.type === 'fixed'">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Montant employeur ({{ currency }})</label>
            <input v-model.number="form.employer_rate" type="number" min="0" step="0.01" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Montant salarié ({{ currency }})</label>
            <input v-model.number="form.employee_rate" type="number" min="0" step="0.01" class="input-base w-full text-sm" />
          </div>
        </div>
      </template>

      <template v-else-if="form.type === 'formula'">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Formule</label>
          <textarea
            v-model="form.formula"
            rows="3"
            class="input-base w-full resize-y font-mono text-sm"
            placeholder="Ex. : BASE * 0.05"
          />
          <p v-if="errors.formula" class="mt-1 text-xs text-red-600">{{ errors.formula }}</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Taux employeur (fallback)</label>
            <input v-model.number="form.employer_rate_pct" type="number" min="0" step="0.0001" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Taux salarié (fallback)</label>
            <input v-model.number="form.employee_rate_pct" type="number" min="0" step="0.0001" class="input-base w-full text-sm" />
          </div>
        </div>
      </template>

      <div v-if="form.type === 'progressive'">
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Ajustement facultatif du montant calculé
        </label>
        <textarea
          v-model="form.formula"
          rows="2"
          class="input-base w-full resize-y font-mono text-sm"
          placeholder="Ex. : MIN(TAX_AMOUNT, BASE * 0.3)"
        />
        <p class="mt-1 text-xs text-neutral-500">
          Variables disponibles : BASE (assiette plafonnée) et TAX_AMOUNT (impôt progressif calculé).
        </p>
        <p v-if="errors.formula" class="mt-1 text-xs text-red-600">{{ errors.formula }}</p>
      </div>

      <TaxBracketsEditor
        v-if="form.type === 'progressive'"
        v-model="form.brackets"
        :currency="currency"
      />
      <p v-if="errors.brackets" class="text-xs text-red-600">{{ errors.brackets }}</p>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="button" class="btn-primary" :disabled="disabled" @click="submit">
          {{ isEdit ? "Enregistrer" : "Créer" }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import TaxBracketsEditor from "./TaxBracketsEditor.vue";
import {
  LEGAL_TAX_TYPE_LABELS,
  LEGAL_TAX_CATEGORY_LABELS,
  BASE_TARGET_LABELS,
  countryById,
  resolveLegalTaxCategory,
} from "../../../../data/legal-tax/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  tax: { type: Object, default: null },
  countries: { type: Array, default: () => [] },
  defaultCountryId: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const typeLabels = LEGAL_TAX_TYPE_LABELS;
const categoryLabels = LEGAL_TAX_CATEGORY_LABELS;
const baseLabels = BASE_TARGET_LABELS;
const isEdit = computed(() => !!props.tax?.id);
const errors = ref({});

const currency = computed(() => {
  const country = countryById(props.countries, form.country_id);
  return country?.currency ?? "EUR";
});

const form = reactive({
  country_id: null,
  code: "",
  name: "",
  description: "",
  category: "social",
  type: "percent",
  base_target: "GROSS",
  employer_rate_pct: 0,
  employee_rate_pct: 0,
  employer_rate: 0,
  employee_rate: 0,
  ceiling: null,
  floor: null,
  formula: "",
  reduces_taxable: false,
  is_active: true,
  sequence: 100,
  effective_from: "",
  effective_to: "",
  brackets: [],
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    if (props.tax) {
      Object.assign(form, {
        country_id: props.tax.country_id,
        code: props.tax.code ?? "",
        name: props.tax.name ?? "",
        description: props.tax.description ?? "",
        category: resolveLegalTaxCategory(props.tax),
        type: props.tax.type ?? "percent",
        base_target: props.tax.base_target ?? "GROSS",
        employer_rate_pct: (props.tax.employer_rate ?? 0) * 100,
        employee_rate_pct: (props.tax.employee_rate ?? 0) * 100,
        employer_rate: props.tax.employer_rate ?? 0,
        employee_rate: props.tax.employee_rate ?? 0,
        ceiling: props.tax.ceiling,
        floor: props.tax.floor,
        formula: props.tax.formula ?? "",
        reduces_taxable: !!props.tax.reduces_taxable,
        is_active: props.tax.is_active !== false,
        sequence: props.tax.sequence ?? 100,
        effective_from: props.tax.effective_from ?? "",
        effective_to: props.tax.effective_to ?? "",
        brackets: props.tax.brackets?.length
          ? JSON.parse(JSON.stringify(props.tax.brackets))
          : [],
      });
    } else {
      Object.assign(form, {
        country_id: props.defaultCountryId ?? props.countries[0]?.id ?? null,
        code: "",
        name: "",
        description: "",
        category: "social",
        type: "percent",
        base_target: "GROSS",
        employer_rate_pct: 0,
        employee_rate_pct: 0,
        employer_rate: 0,
        employee_rate: 0,
        ceiling: null,
        floor: null,
        formula: "",
        reduces_taxable: false,
        is_active: true,
        sequence: 100,
        effective_from: "",
        effective_to: "",
        brackets: [],
      });
    }
  }
);

function validate() {
  const e = {};
  if (!form.code?.trim()) e.code = "Le code est requis.";
  if (!form.name?.trim()) e.name = "Le libellé est requis.";
  if (form.type === "formula" && !form.formula?.trim()) e.formula = "La formule est requise.";
  if (form.type === "progressive" && !form.brackets.length) {
    e.brackets = "Ajoutez au moins une tranche pour un barème progressif.";
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

function buildPayload() {
  const employerRate =
    form.type === "percent" || form.type === "formula"
      ? (form.employer_rate_pct ?? 0) / 100
      : form.employer_rate ?? 0;
  const employeeRate =
    form.type === "percent" || form.type === "formula"
      ? (form.employee_rate_pct ?? 0) / 100
      : form.employee_rate ?? 0;

  return {
    country_id: form.country_id,
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    type: form.type,
    base_target: form.base_target,
    employer_rate: employerRate,
    employee_rate: employeeRate,
    ceiling: form.ceiling || null,
    floor: form.floor || null,
    formula:
      form.type === "formula"
        ? form.formula.trim()
        : form.type === "progressive"
          ? form.formula.trim() || null
          : null,
    reduces_taxable: form.reduces_taxable,
    is_active: form.is_active,
    sequence: form.sequence,
    effective_from: form.effective_from || null,
    effective_to: form.effective_to || null,
    brackets: form.type === "progressive" ? form.brackets : [],
  };
}

function submit() {
  if (!validate()) return;
  emit("save", buildPayload());
  emit("update:open", false);
}
</script>
