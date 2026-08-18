<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 flex justify-between items-center gap-3">
      <div>
        <h2 class="text-base font-semibold text-neutral-800">Bases de calcul</h2>
        <p class="text-xs text-neutral-500">Référentiel des montants de référence</p>
      </div>
      <button type="button" class="btn-outline text-sm px-3 py-2" :disabled="disabled" @click="openCreate">
        + Ajouter
      </button>
    </header>

    <p v-if="disableError" class="mx-5 mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
      {{ disableError }}
    </p>

    <ul class="divide-y divide-neutral-100">
      <li v-if="!bases.length" class="px-5 py-8 text-center text-sm text-neutral-500">
        Aucune base de calcul pour ce pays.
      </li>
      <li
        v-for="base in bases"
        :key="base.id"
        class="flex items-start justify-between gap-3 px-5 py-3"
        :class="!base.is_active ? 'opacity-75' : ''"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium text-neutral-800">{{ base.label }}</p>
          <p class="font-mono text-xs text-neutral-400">{{ base.id }}</p>
          <p v-if="base.description" class="mt-0.5 text-xs text-neutral-500 line-clamp-2">{{ base.description }}</p>
          <p class="mt-1 text-[10px] text-neutral-400">
            {{ sourceLabel(base.source) }}
            <span v-if="usageCount(base.id)"> · {{ usageCount(base.id) }} règle(s)</span>
          </p>
        </div>
        <div class="flex shrink-0 flex-col items-end gap-1">
          <span
            class="text-xs px-2 py-0.5 rounded-md"
            :class="base.is_active ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'"
          >
            {{ base.is_active ? "Active" : "Désactivée" }}
          </span>
          <div class="flex gap-2">
            <button
              type="button"
              class="text-xs font-medium text-primary-600"
              :disabled="disabled"
              @click="openEdit(base)"
            >
              Modifier
            </button>
            <button
              v-if="base.is_active"
              type="button"
              class="text-xs text-orange-600"
              :disabled="disabled"
              @click="requestDisable(base)"
            >
              Désactiver
            </button>
          </div>
        </div>
      </li>
    </ul>

    <TaxCalculationBaseFormModal
      v-model:open="modalOpen"
      :base="editingBase"
      :disabled="disabled"
      @save="onSave"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import TaxCalculationBaseFormModal from "./TaxCalculationBaseFormModal.vue";
import { CALCULATION_BASE_SOURCE_LABELS } from "../../../../data/fiscal/index.js";

const props = defineProps({
  bases: { type: Array, default: () => [] },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["add", "update", "disable"]);

const modalOpen = ref(false);
const editingBase = ref(null);
const disableError = ref("");

function sourceLabel(source) {
  return CALCULATION_BASE_SOURCE_LABELS[source] ?? source ?? "—";
}
function usageCount(baseId) {
  return props.rules.filter((r) => r.base === baseId).length;
}
function openCreate() {
  disableError.value = "";
  editingBase.value = null;
  modalOpen.value = true;
}
function openEdit(base) {
  disableError.value = "";
  editingBase.value = base;
  modalOpen.value = true;
}
function onSave(payload) {
  disableError.value = "";
  if (editingBase.value?.id) {
    emit("update", editingBase.value.id, {
      label: payload.label,
      description: payload.description,
      source: payload.source,
    });
  } else {
    emit("add", payload);
  }
}
async function requestDisable(base) {
  disableError.value = "";
  const count = usageCount(base.id);
  if (count > 0) {
    disableError.value = `« ${base.label} » est utilisée par ${count} règle(s) et ne peut pas être désactivée.`;
    return;
  }
  emit("disable", base.id);
}
</script>
