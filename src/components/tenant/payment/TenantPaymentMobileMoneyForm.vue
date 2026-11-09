<template>
  <div class="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4 space-y-4">
    <div>
      <h3 class="text-sm font-semibold text-neutral-900">Opérateur mobile money</h3>
      <p class="mt-1 text-xs text-neutral-500">
        Sélectionnez l'opérateur et indiquez le numéro utilisé pour le paiement. L'équipe vérifiera le règlement avant d'activer le forfait.
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-3">
      <button
        v-for="operator in operators"
        :key="operator.id"
        type="button"
        :class="[
          'rounded-lg border-2 p-3 text-left transition-colors',
          modelOperator === operator.id
            ? 'border-[#7c7cf8] bg-secondary-50/40'
            : 'border-neutral-200 bg-white hover:border-neutral-300',
        ]"
        @click="$emit('update:modelOperator', operator.id)"
      >
        <p class="text-sm font-semibold text-neutral-900">{{ operator.label }}</p>
        <p class="mt-0.5 text-xs text-neutral-500">{{ operator.description }}</p>
      </button>
    </div>
    <p v-if="operatorError" class="text-xs text-red-600">{{ operatorError }}</p>

    <div v-if="modelOperator">
      <label class="mb-1.5 block text-sm font-semibold text-neutral-800">
        Numéro de téléphone
        <span class="text-red-500">*</span>
      </label>
      <input
        :value="modelPhone"
        type="tel"
        maxlength="40"
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        :placeholder="selectedOperator?.phonePlaceholder || '+212 6 00 00 00 00'"
        @input="$emit('update:modelPhone', $event.target.value)"
      />
      <p v-if="phoneError" class="mt-1 text-xs text-red-600">{{ phoneError }}</p>
      <p v-else class="mt-1 text-xs text-neutral-500">
        Aucun débit automatique n'est effectué depuis cette demande.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  operators: { type: Array, required: true },
  modelOperator: { type: String, default: "" },
  modelPhone: { type: String, default: "" },
  operatorError: { type: String, default: "" },
  phoneError: { type: String, default: "" },
});

defineEmits(["update:modelOperator", "update:modelPhone"]);

const selectedOperator = computed(
  () => props.operators.find((op) => op.id === props.modelOperator) ?? null
);
</script>
