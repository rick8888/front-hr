<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-neutral-800">Barèmes progressifs</h2>
          <p class="text-xs text-neutral-500">Tranches d'imposition (IR / IRPP / ITS)</p>
        </div>
        <span class="inline-flex rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-600/15">
          {{ scales.length }} barème{{ scales.length > 1 ? "s" : "" }}
        </span>
      </div>
    </header>

    <div v-if="!scales.length" class="px-6 py-12 text-center text-sm text-neutral-500">
      Aucun barème configuré pour ce pays.
    </div>

    <div v-for="scale in scales" :key="scale.id" class="border-b border-neutral-100 last:border-b-0">
      <div class="flex flex-wrap items-start justify-between gap-3 bg-violet-50/30 px-5 py-4 md:px-6">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-sm font-semibold text-neutral-900">{{ scale.name }}</h3>
            <span class="font-mono text-xs text-neutral-500">{{ scale.code }}</span>
            <span
              class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium"
              :class="scale.is_active ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'"
            >
              {{ scale.is_active ? "Actif" : "Inactif" }}
            </span>
          </div>
          <p v-if="scale.description" class="mt-1 text-xs text-neutral-600">{{ scale.description }}</p>
          <p class="mt-1 text-xs text-neutral-400">
            Période : <strong>{{ periodLabel(scale.period) }}</strong>
            <span v-if="scale.linked_rule_code"> · Règle liée : <strong>{{ scale.linked_rule_code }}</strong></span>
            <span v-if="scale.effective_from"> · Depuis {{ scale.effective_from }}</span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium"
            :class="scale.is_active ? 'bg-green-50 text-green-800' : 'bg-neutral-100 text-neutral-600'"
          >
            {{ scale.is_active ? "Actif" : "Inactif" }}
          </span>
          <button
            type="button"
            class="btn-outline text-xs px-2 py-1"
            :disabled="disabled"
            @click="openAddBracket(scale)"
          >
            + Tranche
          </button>
          <button
            type="button"
            class="btn-outline text-xs px-2 py-1"
            :disabled="disabled"
            @click="emit('toggle-scale', scale.id, !scale.is_active)"
          >
            {{ scale.is_active ? "Désactiver" : "Activer" }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="border-b border-neutral-100 bg-neutral-50/60">
              <th class="px-4 py-2 text-xs font-semibold uppercase text-neutral-500">#</th>
              <th class="px-4 py-2 text-xs font-semibold uppercase text-neutral-500">De ({{ currency }})</th>
              <th class="px-4 py-2 text-xs font-semibold uppercase text-neutral-500">À ({{ currency }})</th>
              <th class="px-4 py-2 text-xs font-semibold uppercase text-neutral-500">Taux (%)</th>
              <th class="px-4 py-2 text-xs font-semibold uppercase text-neutral-500">Déduction ({{ currency }})</th>
              <th class="px-4 py-2 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-50">
            <tr
              v-for="bracket in paginatedBrackets(scale)"
              :key="`${scale.id}-${bracket.order ?? bracket._index}`"
              class="hover:bg-neutral-50/50"
            >
              <td class="px-4 py-2 text-neutral-500">{{ bracket.order ?? bracket._index + 1 }}</td>
              <td class="px-4 py-2 text-neutral-800">{{ formatAmount(bracket.min) }}</td>
              <td class="px-4 py-2 text-neutral-800">{{ formatMax(bracket.max) }}</td>
              <td class="px-4 py-2 text-neutral-800">{{ bracket.rate }} %</td>
              <td class="px-4 py-2 text-neutral-800">{{ formatAmount(bracket.deduction) }}</td>
              <td class="px-4 py-2 text-right whitespace-nowrap">
                <button
                  type="button"
                  class="text-sm font-medium text-primary-600 hover:text-primary-800 mr-2"
                  :disabled="disabled"
                  @click="openEditBracket(scale, bracket._index)"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  class="text-xs text-red-600 hover:text-red-700"
                  :disabled="disabled || scale.brackets.length <= 1"
                  @click="emit('delete-bracket', scale.id, bracket._index)"
                >
                  Suppr.
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="scale.brackets.length > PAGE_SIZE"
        class="flex flex-col gap-3 border-t border-neutral-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6"
      >
        <p class="text-xs text-neutral-600">
          {{ bracketRangeFrom(scale) }} à {{ bracketRangeTo(scale) }} sur {{ scale.brackets.length }} tranches
        </p>
        <nav class="flex flex-wrap items-center justify-end gap-1" aria-label="Pagination tranches">
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="getPage(scale.id) <= 1"
            @click="setPage(scale.id, getPage(scale.id) - 1)"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <template v-for="(item, idx) in visiblePages(scale)" :key="idx">
            <span v-if="item === 'ellipsis'" class="px-1 text-xs text-neutral-400">…</span>
            <button
              v-else
              type="button"
              class="flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border text-xs font-medium"
              :class="item === getPage(scale.id) ? 'border-primary-600 bg-primary-600 text-white' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'"
              @click="setPage(scale.id, item)"
            >
              {{ item }}
            </button>
          </template>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
            :disabled="getPage(scale.id) >= bracketPageCount(scale)"
            @click="setPage(scale.id, getPage(scale.id) + 1)"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>

      <div class="border-t border-neutral-50 bg-neutral-50/40 px-5 py-2 md:px-6">
        <p class="text-[11px] text-neutral-500">
          Formule : <code class="rounded bg-white px-1">Impôt = (Revenu × Taux%) − Déduction</code>
          — La dernière tranche sans plafond supérieur s'applique au-delà du seuil « De ».
        </p>
      </div>
    </div>

    <TaxScaleBracketFormModal
      v-model:open="modalOpen"
      :bracket="editingBracket"
      :currency="currency"
      :disabled="disabled"
      @save="onBracketSave"
    />
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import TaxScaleBracketFormModal from "./TaxScaleBracketFormModal.vue";
import { PERIOD_LABELS } from "../../../../data/fiscal/index.js";
import { getVisiblePages } from "../../../../composables/useLeaveRequestsTable.js";

const PAGE_SIZE = 10;

defineProps({
  scales: { type: Array, default: () => [] },
  currency: { type: String, default: "EUR" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update-bracket", "add-bracket", "delete-bracket", "toggle-scale"]);

const modalOpen = ref(false);
const editingScaleId = ref(null);
const editingBracketIndex = ref(null);
const editingBracket = ref(null);
const pageByScale = reactive({});

function periodLabel(period) {
  return PERIOD_LABELS[period] ?? period ?? "—";
}
function formatAmount(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(v);
}
function formatMax(v) {
  return v == null ? "∞" : formatAmount(v);
}
function getPage(scaleId) {
  return pageByScale[scaleId] ?? 1;
}
function setPage(scaleId, page) {
  pageByScale[scaleId] = page;
}
function bracketPageCount(scale) {
  return Math.max(1, Math.ceil(scale.brackets.length / PAGE_SIZE));
}
function paginatedBrackets(scale) {
  const page = Math.min(getPage(scale.id), bracketPageCount(scale));
  const start = (page - 1) * PAGE_SIZE;
  return scale.brackets
    .map((bracket, index) => ({ ...bracket, _index: index }))
    .slice(start, start + PAGE_SIZE);
}
function bracketRangeFrom(scale) {
  if (!scale.brackets.length) return 0;
  const page = Math.min(getPage(scale.id), bracketPageCount(scale));
  return (page - 1) * PAGE_SIZE + 1;
}
function bracketRangeTo(scale) {
  const page = Math.min(getPage(scale.id), bracketPageCount(scale));
  return Math.min(page * PAGE_SIZE, scale.brackets.length);
}
function visiblePages(scale) {
  return getVisiblePages(getPage(scale.id), bracketPageCount(scale));
}
function openAddBracket(scale) {
  editingScaleId.value = scale.id;
  editingBracketIndex.value = null;
  editingBracket.value = null;
  modalOpen.value = true;
}
function openEditBracket(scale, bracketIndex) {
  editingScaleId.value = scale.id;
  editingBracketIndex.value = bracketIndex;
  editingBracket.value = scale.brackets[bracketIndex];
  modalOpen.value = true;
}
function onBracketSave(payload) {
  if (editingBracketIndex.value != null) {
    emit("update-bracket", editingScaleId.value, editingBracketIndex.value, payload);
  } else {
    emit("add-bracket", editingScaleId.value, payload);
  }
}
</script>
