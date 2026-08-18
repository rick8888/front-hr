<template>
  <Modal
    :model-value="open"
    :title="isEdit ? 'Modifier la base de calcul' : 'Ajouter une base de calcul'"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Identifiant technique
        </label>
        <input
          v-model="form.id"
          type="text"
          class="input-base w-full font-mono text-sm"
          placeholder="gross_salary"
          :disabled="isEdit"
        />
        <p v-if="!isEdit" class="mt-1 text-xs text-neutral-500">Généré automatiquement si vide (ex. salaire_brut).</p>
        <p v-if="errors.id" class="mt-1 text-xs text-red-600">{{ errors.id }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Libellé <span class="text-red-500">*</span>
        </label>
        <input v-model="form.label" type="text" class="input-base w-full text-sm" />
        <p v-if="errors.label" class="mt-1 text-xs text-red-600">{{ errors.label }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Description</label>
        <textarea v-model="form.description" rows="2" class="input-base w-full text-sm resize-y" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Origine de la valeur</label>
        <select v-model="form.source" class="input-base w-full text-sm">
          <option v-for="(label, key) in sourceLabels" :key="key" :value="key">{{ label }}</option>
        </select>
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
import { CALCULATION_BASE_SOURCE_LABELS } from "../../../../data/fiscal/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  base: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const sourceLabels = CALCULATION_BASE_SOURCE_LABELS;
const isEdit = computed(() => !!props.base?.id);

const form = reactive({
  id: "",
  label: "",
  description: "",
  source: "payroll",
});
const errors = ref({});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    if (props.base) {
      form.id = props.base.id ?? "";
      form.label = props.base.label ?? "";
      form.description = props.base.description ?? "";
      form.source = props.base.source ?? "payroll";
    } else {
      form.id = "";
      form.label = "";
      form.description = "";
      form.source = "payroll";
    }
  }
);

function slugify(label) {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function validate() {
  const e = {};
  if (!form.label?.trim()) e.label = "Le libellé est requis.";
  if (!isEdit.value && form.id?.trim() && !/^[a-z][a-z0-9_]*$/.test(form.id.trim())) {
    e.id = "Identifiant invalide (lettres minuscules, chiffres, _).";
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

function submit() {
  if (!validate()) return;
  emit("save", {
    id: form.id.trim() || slugify(form.label),
    label: form.label.trim(),
    description: form.description.trim(),
    source: form.source,
  });
  emit("update:open", false);
}
</script>
