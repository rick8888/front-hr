<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-neutral-800">Tranches du barème</p>
      <button type="button" class="text-sm font-medium text-primary-600 hover:text-primary-800" @click="addBracket">
        + Ajouter une tranche
      </button>
    </div>

    <div v-if="!modelValue.length" class="rounded-lg border border-dashed border-neutral-200 py-6 text-center text-sm text-neutral-500">
      Aucune tranche — ajoutez au moins une tranche pour un barème progressif.
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-neutral-200">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-3 py-2 text-left text-xs font-semibold uppercase text-neutral-500">Min</th>
            <th class="px-3 py-2 text-left text-xs font-semibold uppercase text-neutral-500">Max</th>
            <th class="px-3 py-2 text-left text-xs font-semibold uppercase text-neutral-500">Taux</th>
            <th class="px-3 py-2 text-left text-xs font-semibold uppercase text-neutral-500">Déduction fixe</th>
            <th class="px-3 py-2 text-right text-xs font-semibold uppercase text-neutral-500"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="(bracket, index) in modelValue" :key="index">
            <td class="px-3 py-2">
              <input
                :value="bracket.min_amount"
                type="number"
                min="0"
                step="0.01"
                class="input-base w-28 text-sm"
                @input="updateBracket(index, 'min_amount', parseNum($event.target.value))"
              />
            </td>
            <td class="px-3 py-2">
              <input
                :value="bracket.max_amount ?? ''"
                type="number"
                min="0"
                step="0.01"
                class="input-base w-28 text-sm"
                placeholder="∞"
                @input="updateBracket(index, 'max_amount', $event.target.value === '' ? null : parseNum($event.target.value))"
              />
            </td>
            <td class="px-3 py-2">
              <input
                :value="percentDisplay(bracket.rate)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                class="input-base w-24 text-sm"
                @input="updateBracket(index, 'rate', parsePercent($event.target.value))"
              />
              <span class="ml-1 text-xs text-neutral-500">%</span>
            </td>
            <td class="px-3 py-2">
              <input
                :value="bracket.fixed_deduction"
                type="number"
                min="0"
                step="0.01"
                class="input-base w-28 text-sm"
                @input="updateBracket(index, 'fixed_deduction', parseNum($event.target.value))"
              />
            </td>
            <td class="px-3 py-2 text-right">
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-800"
                :disabled="modelValue.length <= 1"
                @click="removeBracket(index)"
              >
                Suppr.
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  currency: { type: String, default: "EUR" },
});

const emit = defineEmits(["update:modelValue"]);

function parseNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function parsePercent(v) {
  return parseNum(v) / 100;
}

function percentDisplay(rate) {
  if (rate == null) return 0;
  return Math.round(rate * 10000) / 100;
}

function updateBracket(index, field, value) {
  const next = props.modelValue.map((b, i) =>
    i === index ? { ...b, [field]: value, sequence: i } : b
  );
  emit("update:modelValue", next);
}

function addBracket() {
  const last = props.modelValue[props.modelValue.length - 1];
  const min = last ? (last.max_amount ?? last.min_amount) + 0.01 : 0;
  emit("update:modelValue", [
    ...props.modelValue,
    {
      min_amount: min,
      max_amount: null,
      rate: 0,
      fixed_deduction: 0,
      sequence: props.modelValue.length,
    },
  ]);
}

function removeBracket(index) {
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index).map((b, i) => ({ ...b, sequence: i }))
  );
}
</script>
