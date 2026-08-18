<template>
  <Modal
    :model-value="open"
    :title="isEdit ? 'Modifier la tranche' : 'Ajouter une tranche'"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            De ({{ currency }}) <span class="text-red-500">*</span>
          </label>
          <input v-model.number="form.min" type="number" min="0" step="0.01" class="input-base w-full text-sm" />
          <p v-if="errors.min" class="mt-1 text-xs text-red-600">{{ errors.min }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            À ({{ currency }})
          </label>
          <input
            v-model="maxInput"
            type="number"
            min="0"
            step="0.01"
            class="input-base w-full text-sm"
            placeholder="∞ (sans plafond)"
          />
          <p class="mt-1 text-xs text-neutral-500">Laissez vide pour la tranche sans plafond supérieur.</p>
          <p v-if="errors.max" class="mt-1 text-xs text-red-600">{{ errors.max }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Taux (%) <span class="text-red-500">*</span>
          </label>
          <input v-model.number="form.rate" type="number" min="0" max="100" step="0.01" class="input-base w-full text-sm" />
          <p v-if="errors.rate" class="mt-1 text-xs text-red-600">{{ errors.rate }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Déduction ({{ currency }}) <span class="text-red-500">*</span>
          </label>
          <input v-model.number="form.deduction" type="number" min="0" step="0.01" class="input-base w-full text-sm" />
          <p v-if="errors.deduction" class="mt-1 text-xs text-red-600">{{ errors.deduction }}</p>
        </div>
      </div>

      <p class="rounded-lg border border-neutral-100 bg-neutral-50/80 px-3 py-2 text-xs text-neutral-600">
        Formule : <code class="rounded bg-white px-1">Impôt = (Revenu × Taux%) − Déduction</code>
      </p>
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

const props = defineProps({
  open: { type: Boolean, default: false },
  bracket: { type: Object, default: null },
  currency: { type: String, default: "EUR" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const isEdit = computed(() => props.bracket != null);
const maxInput = ref("");
const form = reactive({ min: 0, max: null, rate: 0, deduction: 0 });
const errors = ref({});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    if (props.bracket) {
      form.min = props.bracket.min ?? 0;
      form.max = props.bracket.max ?? null;
      form.rate = props.bracket.rate ?? 0;
      form.deduction = props.bracket.deduction ?? 0;
      maxInput.value = props.bracket.max != null ? String(props.bracket.max) : "";
    } else {
      form.min = 0;
      form.max = null;
      form.rate = 0;
      form.deduction = 0;
      maxInput.value = "";
    }
  }
);

function validate() {
  const e = {};
  if (form.min == null || form.min < 0) e.min = "Seuil minimum invalide.";
  const maxVal = maxInput.value.trim() === "" ? null : Number(maxInput.value);
  if (maxVal != null && (Number.isNaN(maxVal) || maxVal <= form.min)) {
    e.max = "Le plafond doit être supérieur au seuil « De ».";
  }
  if (form.rate == null || form.rate < 0 || form.rate > 100) e.rate = "Taux entre 0 et 100 %.";
  if (form.deduction == null || form.deduction < 0) e.deduction = "Déduction invalide.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

function submit() {
  if (!validate()) return;
  const maxVal = maxInput.value.trim() === "" ? null : Number(maxInput.value);
  emit("save", {
    min: form.min,
    max: maxVal,
    rate: form.rate,
    deduction: form.deduction,
  });
  emit("update:open", false);
}
</script>
