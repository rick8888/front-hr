<template>
  <TableCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-neutral-800">Périodes de déclaration</h2>
          <p class="text-xs text-neutral-500">Échéances fiscales et sociales par organisme</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
            <button
              v-for="tab in typeTabs"
              :key="tab.id"
              type="button"
              class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              :class="typeFilter === tab.id ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'"
              @click="typeFilter = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          <button type="button" class="btn-primary text-sm px-3 py-2" :disabled="disabled" @click="startAdd">
            + Ajouter
          </button>
        </div>
      </div>
    </template>

    <thead>
      <tr class="border-b border-neutral-200 bg-neutral-50/80">
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Code</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Libellé</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Type</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Organisme</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Fréquence</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Échéance</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Règles liées</th>
        <th class="px-3 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Actif</th>
        <th class="px-3 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-neutral-100">
      <tr v-if="adding" class="bg-blue-50/40">
        <td class="px-3 py-3">
          <input v-model="draft.code" class="input-base w-full text-sm" placeholder="CODE" />
        </td>
        <td class="px-3 py-3">
          <input v-model="draft.name" class="input-base w-full text-sm" placeholder="Libellé" />
        </td>
        <td class="px-3 py-3">
          <select v-model="draft.type" class="input-base w-full text-sm">
            <option value="social">Sociale</option>
            <option value="fiscal">Fiscale</option>
          </select>
        </td>
        <td class="px-3 py-3">
          <input v-model="draft.authority" class="input-base w-full text-sm" placeholder="Organisme" />
        </td>
        <td class="px-3 py-3">
          <select v-model="draft.frequency" class="input-base w-full text-sm">
            <option value="monthly">Mensuelle</option>
            <option value="quarterly">Trimestrielle</option>
            <option value="annual">Annuelle</option>
          </select>
        </td>
        <td class="px-3 py-3">
          <input v-model.number="draft.due_day" type="number" min="1" max="31" class="input-base w-16 text-sm" placeholder="Jour" />
        </td>
        <td class="px-3 py-3">
          <button type="button" class="btn-outline text-xs px-2 py-1" @click="openDraftRulesEditor">
            {{ draft.linked_rule_codes.length }} règle(s)
          </button>
        </td>
        <td class="px-3 py-3">
          <InlineToggle v-model="draft.is_active" label="" />
        </td>
        <td class="px-3 py-3 text-right">
          <button type="button" class="btn-primary text-xs px-2 py-1" @click="saveNew">OK</button>
          <button type="button" class="btn-outline text-xs px-2 py-1 ml-1" @click="cancelAdd">×</button>
        </td>
      </tr>

      <tr v-if="!filteredPeriods.length && !adding">
        <td colspan="9" class="px-6 py-12 text-center text-sm text-neutral-500">
          Aucune période de déclaration pour ce filtre.
        </td>
      </tr>

      <tr
        v-for="period in filteredPeriods"
        :key="period.id"
        class="hover:bg-neutral-50/60"
        :class="!period.is_active ? 'opacity-75' : ''"
      >
        <td class="px-3 py-3">
          <span class="font-mono text-xs font-medium text-neutral-700">{{ period.code }}</span>
          <span
            v-if="period.is_mandatory"
            class="ml-1 inline-flex rounded bg-orange-100 px-1 py-0.5 text-[10px] font-medium text-orange-800"
          >Oblig.</span>
        </td>
        <td class="px-3 py-3">
          <input
            :value="buf(period, 'name')"
            class="input-base w-full text-sm"
            :disabled="disabled"
            @input="setBuf(period.id, 'name', $event.target.value)"
            @blur="commit(period, 'name')"
          />
          <p v-if="period.description" class="mt-0.5 text-[10px] text-neutral-400 line-clamp-1">{{ period.description }}</p>
        </td>
        <td class="px-3 py-3">
          <span
            class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium"
            :class="period.type === 'fiscal' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'"
          >
            {{ typeLabel(period.type) }}
          </span>
        </td>
        <td class="px-3 py-3">
          <input
            :value="buf(period, 'authority')"
            class="input-base w-full text-sm"
            :disabled="disabled"
            @input="setBuf(period.id, 'authority', $event.target.value)"
            @blur="commit(period, 'authority')"
          />
        </td>
        <td class="px-3 py-3 text-sm text-neutral-700">
          {{ frequencyLabel(period.frequency) }}
          <span class="block text-[10px] text-neutral-400">{{ referenceLabel(period.reference_period) }}</span>
        </td>
        <td class="px-3 py-3 text-sm text-neutral-700">
          {{ formatDueRule(period.due_rule) }}
          <span v-if="period.grace_days" class="block text-[10px] text-neutral-400">+ {{ period.grace_days }} j. de grâce</span>
        </td>
        <td class="px-3 py-3">
          <div class="flex flex-wrap gap-1 max-w-[10rem]">
            <span
              v-for="code in (period.linked_rule_codes ?? []).slice(0, 3)"
              :key="code"
              class="inline-flex rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-700"
            >
              {{ code }}
            </span>
            <span
              v-if="(period.linked_rule_codes?.length ?? 0) > 3"
              class="text-[10px] text-neutral-400"
            >
              +{{ period.linked_rule_codes.length - 3 }}
            </span>
          </div>
          <button
            type="button"
            class="mt-1 text-xs font-medium text-primary-600 hover:text-primary-800"
            :disabled="disabled"
            @click="openRulesEditor(period)"
          >
            Modifier ({{ period.linked_rule_codes?.length ?? 0 }})
          </button>
        </td>
        <td class="px-3 py-3">
          <InlineToggle
            :model-value="period.is_active"
            label=""
            :disabled="disabled"
            @update:model-value="emit('toggle', period.id, $event)"
          />
        </td>
        <td class="px-3 py-3 text-right whitespace-nowrap">
          <button type="button" class="text-sm text-red-600" :disabled="disabled" @click="emit('delete', period.id)">
            Suppr.
          </button>
        </td>
      </tr>
    </tbody>
  </TableCard>

  <DeclarationRulesLinkModal
    v-model:open="rulesModalOpen"
    :period-name="editingPeriodName"
    :linked-rule-codes="editingRuleCodes"
    :rules="rules"
    :categories="categories"
    :disabled="disabled"
    @save="onRulesSave"
  />
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import TableCard from "../../../../components/common/TableCard.vue";
import InlineToggle from "../../../../components/common/InlineToggle.vue";
import DeclarationRulesLinkModal from "./DeclarationRulesLinkModal.vue";
import {
  DECLARATION_TYPE_LABELS,
  DECLARATION_FREQUENCY_LABELS,
  REFERENCE_PERIOD_LABELS,
  formatDueRule,
} from "../../../../data/fiscal/index.js";

const props = defineProps({
  periods: { type: Array, default: () => [] },
  rules: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["add", "update", "delete", "toggle"]);

const typeFilter = ref("all");
const typeTabs = [
  { id: "all", label: "Toutes" },
  { id: "social", label: "Sociales" },
  { id: "fiscal", label: "Fiscales" },
];

const filteredPeriods = computed(() => {
  if (typeFilter.value === "all") return props.periods;
  return props.periods.filter((p) => p.type === typeFilter.value);
});

const adding = ref(false);
const rulesModalOpen = ref(false);
const editingPeriodId = ref(null);
const editingPeriodName = ref("");
const editingRuleCodes = ref([]);
const draft = reactive({
  code: "",
  name: "",
  type: "social",
  authority: "",
  frequency: "monthly",
  due_day: 15,
  is_active: true,
  linked_rule_codes: [],
  linked_categories: [],
});
const editBuffer = reactive({});

function typeLabel(v) {
  return DECLARATION_TYPE_LABELS[v] ?? v;
}
function frequencyLabel(v) {
  return DECLARATION_FREQUENCY_LABELS[v] ?? v;
}
function referenceLabel(v) {
  return REFERENCE_PERIOD_LABELS[v] ?? v ?? "—";
}
function buf(period, field) {
  return editBuffer[period.id]?.[field] ?? period[field];
}
function setBuf(id, field, value) {
  if (!editBuffer[id]) editBuffer[id] = {};
  editBuffer[id][field] = value;
}
function buildDueRule(frequency, day) {
  if (frequency === "annual") {
    return { type: "fixed_day", month: 3, day: day || 31 };
  }
  return { type: "fixed_day_next_month", day: day || 15 };
}
function deriveCategories(codes) {
  const cats = new Set();
  props.rules.forEach((rule) => {
    if (codes.includes(rule.code) && rule.category) cats.add(rule.category);
  });
  return [...cats];
}
function openRulesEditor(period) {
  editingPeriodId.value = period.id;
  editingPeriodName.value = period.name;
  editingRuleCodes.value = [...(period.linked_rule_codes ?? [])];
  rulesModalOpen.value = true;
}
function openDraftRulesEditor() {
  editingPeriodId.value = null;
  editingPeriodName.value = draft.name || "Nouvelle déclaration";
  editingRuleCodes.value = [...draft.linked_rule_codes];
  rulesModalOpen.value = true;
}
function onRulesSave(payload) {
  if (editingPeriodId.value) {
    emit("update", editingPeriodId.value, payload);
  } else {
    draft.linked_rule_codes = payload.linked_rule_codes;
    draft.linked_categories = payload.linked_categories;
  }
}
function startAdd() {
  draft.code = "";
  draft.name = "";
  draft.type = "social";
  draft.authority = "";
  draft.frequency = "monthly";
  draft.due_day = 15;
  draft.is_active = true;
  draft.linked_rule_codes = [];
  draft.linked_categories = [];
  adding.value = true;
}
function cancelAdd() {
  adding.value = false;
}
function saveNew() {
  if (!draft.name?.trim()) return;
  emit("add", {
    code: draft.code.trim().toUpperCase() || `DECL_${Date.now()}`,
    name: draft.name.trim(),
    type: draft.type,
    authority: draft.authority.trim(),
    frequency: draft.frequency,
    reference_period: draft.frequency === "annual" ? "previous_year" : "previous_month",
    due_rule: buildDueRule(draft.frequency, draft.due_day),
    grace_days: 0,
    filing_channel: "online",
    linked_categories: draft.linked_categories.length
      ? draft.linked_categories
      : deriveCategories(draft.linked_rule_codes),
    linked_rule_codes: [...draft.linked_rule_codes],
    is_mandatory: false,
    is_active: draft.is_active,
    effective_from: new Date().toISOString().slice(0, 10),
    description: "",
  });
  adding.value = false;
}
function commit(period, field) {
  const value = buf(period, field);
  if (period[field] === value) return;
  if (!value?.toString().trim()) return;
  emit("update", period.id, { [field]: typeof value === "string" ? value.trim() : value });
}
</script>
