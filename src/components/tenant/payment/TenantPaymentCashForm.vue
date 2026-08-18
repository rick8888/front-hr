<template>
  <div class="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4">
    <h3 class="text-sm font-semibold text-neutral-900">Paiement en espèces</h3>
    <p class="mt-1 text-xs text-neutral-500">
      Votre paiement sera enregistré manuellement par notre équipe après réception des fonds.
    </p>

    <div class="mt-4">
      <label class="mb-1.5 block text-sm font-semibold text-neutral-800">
        Référence (optionnel)
      </label>
      <input
        :value="modelReference"
        type="text"
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        placeholder="ex: Reçu caisse #1234"
        @input="$emit('update:modelReference', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelReference: { type: String, default: "" },
});

defineEmits(["update:modelReference"]);
</script>
