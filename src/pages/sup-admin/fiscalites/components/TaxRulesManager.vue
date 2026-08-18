<template>
  <TableCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-neutral-800">Règles de cotisation</h2>
          <p class="text-xs text-neutral-500">Référentiel fiscal par pays (données bravo-api-K)</p>
        </div>
        <button type="button" class="btn-primary text-sm px-3 py-2" :disabled="disabled" @click="openCreate">
          + Ajouter
        </button>
      </div>
    </template>
    <thead>
      <tr class="border-b border-neutral-200 bg-neutral-50/80">
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Code</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Libellé</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Catégorie</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Part</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Taux / Montant</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Base</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
        <th class="px-3 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-neutral-100">
      <tr v-if="!rules.length">
        <td colspan="8" class="px-6 py-12 text-center text-sm text-neutral-500">Aucune règle pour ce pays.</td>
      </tr>

      <tr
        v-for="rule in rules"
        :key="rule.id"
        class="hover:bg-neutral-50/60"
        :class="!rule.is_active ? 'opacity-75' : ''"
      >
        <td class="px-3 py-3">
          <span class="font-mono text-xs font-medium text-neutral-700">{{ rule.code }}</span>
          <span
            v-if="rule.is_mandatory"
            class="ml-1 inline-flex rounded bg-orange-100 px-1 py-0.5 text-[10px] font-medium text-orange-800"
            title="Obligatoire"
          >Oblig.</span>
        </td>
        <td class="px-3 py-3">
          <p class="text-sm font-medium text-neutral-800">{{ rule.name }}</p>
          <p v-if="rule.description" class="mt-0.5 text-[11px] text-neutral-400 line-clamp-2">{{ rule.description }}</p>
        </td>
        <td class="px-3 py-3 text-sm text-neutral-700">{{ categoryLabel(rule.category) }}</td>
        <td class="px-3 py-3 text-sm text-neutral-700">{{ appliesToLabel(rule.applies_to) }}</td>
        <td class="px-3 py-3">
          <template v-if="rule.type === 'scale'">
            <span class="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-600/15">
              Barème
            </span>
            <span v-if="rule.scale_id" class="ml-1 text-[10px] text-neutral-400">{{ scaleLabel(rule.scale_id) }}</span>
          </template>
          <span v-else class="text-sm text-neutral-800">
            {{ formatValue(rule) }}
            <span v-if="rule.ceiling" class="text-xs text-neutral-500"> (plaf. {{ formatCeiling(rule.ceiling) }})</span>
          </span>
        </td>
        <td class="px-3 py-3 text-xs text-neutral-600">{{ baseLabel(rule.base) }}</td>
        <td class="px-3 py-3">
          <span
            class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium"
            :class="rule.is_active ? 'bg-green-50 text-green-800' : 'bg-neutral-100 text-neutral-600'"
          >
            {{ rule.is_active ? "Active" : "Inactive" }}
          </span>
        </td>
        <td class="px-3 py-3 text-right whitespace-nowrap">
          <span v-if="rule.effective_from" class="text-[10px] text-neutral-400 block mb-1">depuis {{ rule.effective_from }}</span>
          <button
            type="button"
            class="text-sm font-medium text-primary-600 hover:text-primary-800 mr-2"
            :disabled="disabled"
            @click="openEdit(rule)"
          >
            Modifier
          </button>
          <button type="button" class="text-sm text-red-600" :disabled="disabled" @click="emit('delete', rule.id)">
            Suppr.
          </button>
        </td>
      </tr>
    </tbody>
  </TableCard>

  <TaxRuleFormModal
    v-model:open="modalOpen"
    :rule="editingRule"
    :categories="activeCategories"
    :calculation-bases="activeCalculationBases"
    :scales="scales"
    :currency="currency"
    :disabled="disabled"
    @save="onSave"
  />
</template>

<script setup>
import { ref } from "vue";
import TableCard from "../../../../components/common/TableCard.vue";
import TaxRuleFormModal from "./TaxRuleFormModal.vue";
import { FISCAL_BASE_LABELS, APPLIES_TO_LABELS } from "../../../../data/fiscal/index.js";

const props = defineProps({
  rules: { type: Array, default: () => [] },
  activeCategories: { type: Array, default: () => [] },
  calculationBases: { type: Array, default: () => [] },
  activeCalculationBases: { type: Array, default: () => [] },
  scales: { type: Array, default: () => [] },
  currency: { type: String, default: "EUR" },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["add", "update", "delete"]);

const modalOpen = ref(false);
const editingRule = ref(null);

const categoryMap = () => Object.fromEntries(props.activeCategories.map((c) => [c.id, c.label]));
const scaleMap = () => Object.fromEntries(props.scales.map((s) => [s.id, s.name]));

function appliesToLabel(v) {
  return APPLIES_TO_LABELS[v] ?? v;
}
function baseLabel(key) {
  const fromBases = props.calculationBases.find((b) => b.id === key)?.label;
  return fromBases ?? FISCAL_BASE_LABELS[key] ?? key ?? "—";
}
function categoryLabel(id) {
  return categoryMap()[id] ?? id ?? "—";
}
function scaleLabel(id) {
  return scaleMap()[id] ?? id;
}
function formatCeiling(v) {
  return new Intl.NumberFormat("fr-FR").format(v);
}
function formatValue(rule) {
  if (rule.type === "fixed") {
    return `${new Intl.NumberFormat("fr-FR").format(rule.value ?? 0)} ${props.currency}`;
  }
  return `${rule.value ?? 0} %`;
}
function openCreate() {
  editingRule.value = null;
  modalOpen.value = true;
}
function openEdit(rule) {
  editingRule.value = rule;
  modalOpen.value = true;
}
function onSave(payload) {
  if (editingRule.value?.id) {
    emit("update", editingRule.value.id, payload);
  } else {
    emit("add", payload);
  }
}
</script>
