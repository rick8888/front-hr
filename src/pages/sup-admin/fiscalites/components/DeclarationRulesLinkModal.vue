<template>
  <Modal
    :model-value="open"
    :title="modalTitle"
    size="lg"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <div class="space-y-4">
      <p class="text-sm text-neutral-600">
        Sélectionnez les règles de cotisation incluses dans cette déclaration.
        Les catégories liées seront mises à jour automatiquement.
      </p>

      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="search"
          type="search"
          class="input-base flex-1 min-w-[12rem] text-sm"
          placeholder="Rechercher par code ou libellé…"
        />
        <select v-model="categoryFilter" class="input-base text-sm">
          <option value="">Toutes catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
        </select>
        <button type="button" class="btn-outline text-xs px-2 py-1.5" @click="selectAllVisible">Tout cocher</button>
        <button type="button" class="btn-outline text-xs px-2 py-1.5" @click="clearSelection">Tout décocher</button>
      </div>

      <p class="text-xs text-neutral-500">
        {{ selectedCodes.length }} règle(s) sélectionnée(s) sur {{ rules.length }}
      </p>

      <div class="max-h-80 overflow-y-auto rounded-lg border border-neutral-200 divide-y divide-neutral-100">
        <label
          v-for="rule in filteredRules"
          :key="rule.id"
          class="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-neutral-50/80"
          :class="!rule.is_active ? 'opacity-60' : ''"
        >
          <input
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600"
            :checked="selectedCodes.includes(rule.code)"
            :disabled="disabled"
            @change="toggleRule(rule.code, $event.target.checked)"
          />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-xs font-semibold text-neutral-800">{{ rule.code }}</span>
              <span
                v-if="!rule.is_active"
                class="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500"
              >Inactif</span>
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-medium"
                :class="rule.applies_to === 'employer' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'"
              >
                {{ appliesToLabel(rule.applies_to) }}
              </span>
            </div>
            <p class="text-sm text-neutral-800">{{ rule.name }}</p>
            <p class="text-xs text-neutral-500">{{ categoryLabel(rule.category) }}</p>
          </div>
        </label>

        <p v-if="!filteredRules.length" class="px-4 py-8 text-center text-sm text-neutral-500">
          Aucune règle ne correspond à votre recherche.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 px-6 py-4 border-t border-neutral-200 justify-end">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="button" class="btn-primary" :disabled="disabled" @click="save">
          Enregistrer
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { APPLIES_TO_LABELS } from "../../../../data/fiscal/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  periodName: { type: String, default: "" },
  linkedRuleCodes: { type: Array, default: () => [] },
  rules: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const search = ref("");
const categoryFilter = ref("");
const selectedCodes = ref([]);

const modalTitle = computed(() =>
  props.periodName ? `Règles liées — ${props.periodName}` : "Règles liées"
);

const categoryMap = computed(() =>
  Object.fromEntries(props.categories.map((c) => [c.id, c.label]))
);

const filteredRules = computed(() => {
  const q = search.value.trim().toLowerCase();
  return props.rules.filter((rule) => {
    if (categoryFilter.value && rule.category !== categoryFilter.value) return false;
    if (!q) return true;
    return (
      rule.code.toLowerCase().includes(q) ||
      rule.name.toLowerCase().includes(q)
    );
  });
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedCodes.value = [...(props.linkedRuleCodes ?? [])];
      search.value = "";
      categoryFilter.value = "";
    }
  }
);

function appliesToLabel(v) {
  return APPLIES_TO_LABELS[v] ?? v;
}
function categoryLabel(id) {
  return categoryMap.value[id] ?? id ?? "—";
}
function toggleRule(code, checked) {
  if (checked) {
    if (!selectedCodes.value.includes(code)) {
      selectedCodes.value = [...selectedCodes.value, code];
    }
  } else {
    selectedCodes.value = selectedCodes.value.filter((c) => c !== code);
  }
}
function selectAllVisible() {
  const codes = filteredRules.value.map((r) => r.code);
  selectedCodes.value = [...new Set([...selectedCodes.value, ...codes])];
}
function clearSelection() {
  const visible = new Set(filteredRules.value.map((r) => r.code));
  selectedCodes.value = selectedCodes.value.filter((c) => !visible.has(c));
}
function deriveCategories(codes) {
  const cats = new Set();
  props.rules.forEach((rule) => {
    if (codes.includes(rule.code) && rule.category) cats.add(rule.category);
  });
  return [...cats];
}
function save() {
  const linked_rule_codes = [...selectedCodes.value];
  emit("save", {
    linked_rule_codes,
    linked_categories: deriveCategories(linked_rule_codes),
  });
  emit("update:open", false);
}
</script>
