<template>
  <Modal
    :model-value="open"
    :title="isEdit ? 'Modifier la règle' : 'Ajouter une règle'"
    size="lg"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Code</label>
          <input v-model="form.code" type="text" class="input-base w-full font-mono text-sm uppercase" placeholder="CNSS_EE" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Date d'effet</label>
          <input v-model="form.effective_from" type="date" class="input-base w-full text-sm" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Libellé <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" class="input-base w-full text-sm" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Description</label>
          <textarea v-model="form.description" rows="2" class="input-base w-full text-sm resize-y" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Catégorie</label>
          <select v-model="form.category" class="input-base w-full text-sm">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Part</label>
          <select v-model="form.applies_to" class="input-base w-full text-sm">
            <option value="employee">Salarié</option>
            <option value="employer">Employeur</option>
            <option value="both">Les deux</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Type de calcul</label>
          <select v-model="form.type" class="input-base w-full text-sm">
            <option value="percentage">Pourcentage (%)</option>
            <option value="fixed">Montant fixe</option>
            <option value="scale">Barème progressif</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Base de calcul</label>
          <select v-model="form.base" class="input-base w-full text-sm">
            <option v-for="b in calculationBases" :key="b.id" :value="b.id">{{ b.label }}</option>
          </select>
        </div>

        <template v-if="form.type === 'scale'">
          <div class="sm:col-span-2">
            <label class="mb-1 block text-sm font-medium text-neutral-800">Barème lié</label>
            <select v-model="form.scale_id" class="input-base w-full text-sm">
              <option value="">— Sélectionner un barème —</option>
              <option v-for="scale in scales" :key="scale.id" :value="scale.id">
                {{ scale.name }} ({{ scale.code }})
              </option>
            </select>
            <p v-if="errors.scale_id" class="mt-1 text-xs text-red-600">{{ errors.scale_id }}</p>
          </div>
        </template>

        <template v-else>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">
              {{ form.type === 'fixed' ? `Montant (${currency})` : 'Taux (%)' }}
            </label>
            <input v-model.number="form.value" type="number" min="0" step="0.01" class="input-base w-full text-sm" />
            <p v-if="errors.value" class="mt-1 text-xs text-red-600">{{ errors.value }}</p>
          </div>
          <div v-if="form.type === 'percentage'">
            <label class="mb-1 block text-sm font-medium text-neutral-800">Plafond (optionnel)</label>
            <input v-model.number="form.ceiling" type="number" min="0" class="input-base w-full text-sm" placeholder="Sans plafond" />
          </div>
        </template>
      </div>

      <div class="space-y-3 rounded-lg border border-neutral-100 bg-neutral-50/50 px-4 py-3">
        <SwitchField v-model="form.is_mandatory" label="Obligatoire" hint="Cotisation imposée par la réglementation" />
        <SwitchField v-model="form.is_active" label="Active" hint="Règle prise en compte dans les calculs" />
      </div>
    </form>

    <template #footer>
      <div class="flex gap-3 border-t border-neutral-200 px-6 py-4 justify-end">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="button" class="btn-primary" :disabled="disabled" @click="submit">
          {{ isEdit ? 'Enregistrer' : 'Ajouter' }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import SwitchField from "../../../../components/common/SwitchField.vue";
const props = defineProps({
  open: { type: Boolean, default: false },
  rule: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
  calculationBases: { type: Array, default: () => [] },
  scales: { type: Array, default: () => [] },
  currency: { type: String, default: "EUR" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);
const isEdit = computed(() => !!props.rule?.id);

const defaultForm = () => ({
  code: "",
  name: "",
  description: "",
  category: props.categories[0]?.id ?? "",
  applies_to: "employee",
  type: "percentage",
  value: 0,
  base: props.calculationBases[0]?.id ?? "gross_salary",
  ceiling: null,
  scale_id: "",
  is_mandatory: false,
  is_active: true,
  effective_from: new Date().toISOString().slice(0, 10),
});

const form = reactive(defaultForm());
const errors = ref({});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    if (props.rule) {
      Object.assign(form, {
        code: props.rule.code ?? "",
        name: props.rule.name ?? "",
        description: props.rule.description ?? "",
        category: props.rule.category ?? props.categories[0]?.id ?? "",
        applies_to: props.rule.applies_to ?? "employee",
        type: props.rule.type ?? "percentage",
        value: props.rule.value ?? 0,
        base: props.rule.base ?? "gross_salary",
        ceiling: props.rule.ceiling ?? null,
        scale_id: props.rule.scale_id ?? "",
        is_mandatory: props.rule.is_mandatory ?? false,
        is_active: props.rule.is_active ?? true,
        effective_from: props.rule.effective_from ?? new Date().toISOString().slice(0, 10),
      });
    } else {
      Object.assign(form, defaultForm());
    }
  }
);

watch(
  () => form.type,
  (type) => {
    if (type === "scale") {
      form.value = null;
      form.ceiling = null;
    } else if (form.value == null) {
      form.value = 0;
    }
  }
);

function validate() {
  const e = {};
  if (!form.name?.trim()) e.name = "Le libellé est requis.";
  if (form.type === "scale") {
    if (!form.scale_id) e.scale_id = "Sélectionnez un barème.";
  } else if (form.value == null || form.value < 0) {
    e.value = "Valeur invalide.";
  } else if (form.type === "percentage" && form.value > 100) {
    e.value = "Le taux ne peut pas dépasser 100 %.";
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

function submit() {
  if (!validate()) return;
  const payload = {
    code: form.code.trim().toUpperCase() || `CUSTOM_${Date.now()}`,
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    applies_to: form.applies_to,
    type: form.type,
    base: form.base,
    is_mandatory: form.is_mandatory,
    is_active: form.is_active,
    effective_from: form.effective_from,
    currency: form.type === "fixed" ? props.currency : null,
  };
  if (form.type === "scale") {
    payload.value = null;
    payload.ceiling = null;
    payload.scale_id = form.scale_id;
  } else {
    payload.value = form.value;
    payload.ceiling = form.type === "percentage" && form.ceiling ? form.ceiling : null;
    payload.scale_id = null;
  }
  emit("save", payload);
  emit("update:open", false);
}
</script>
