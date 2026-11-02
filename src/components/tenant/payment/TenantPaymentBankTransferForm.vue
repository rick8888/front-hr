<template>
  <div class="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4">
    <h3 class="text-sm font-semibold text-neutral-900">Justificatif de virement</h3>
    <p class="mt-1 text-xs text-neutral-500">
      Effectuez le virement avec les coordonnées communiquées par notre équipe, puis joignez le reçu (PDF, JPG ou PNG). Le forfait sera activé après vérification.
    </p>

    <div
      v-if="!file"
      class="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white px-4 py-8"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
        class="hidden"
        @change="onFileChange"
      />
      <svg
        class="h-8 w-8 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <button
        type="button"
        class="mt-3 rounded-lg bg-[#7c7cf8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6b6be8]"
        @click="fileInput?.click()"
      >
        Choisir un fichier
      </button>
      <p class="mt-2 text-xs text-neutral-400">Taille max. 5 Mo</p>
    </div>

    <div
      v-else
      class="mt-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
    >
      <div class="min-w-0">
        <p class="truncate text-sm font-medium text-emerald-900">{{ file.name }}</p>
        <p class="text-xs text-emerald-700">{{ formatSize(file.size) }}</p>
      </div>
      <button
        type="button"
        class="shrink-0 text-xs font-semibold text-rose-600 hover:underline"
        @click="$emit('remove')"
      >
        Supprimer
      </button>
    </div>

    <p v-if="error" class="mt-2 text-xs text-red-600">{{ error }}</p>

    <div class="mt-4">
      <label class="mb-1.5 block text-sm font-semibold text-neutral-800">
        Référence du virement (optionnel)
      </label>
      <input
        :value="modelReference"
        type="text"
        maxlength="120"
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        placeholder="Référence de transaction"
        @input="$emit('update:modelReference', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  file: { type: Object, default: null },
  modelReference: { type: String, default: "" },
  error: { type: String, default: "" },
});

const emit = defineEmits(["select", "remove", "update:modelReference"]);

const fileInput = ref(null);

function onFileChange(event) {
  const file = event.target.files?.[0] ?? null;
  emit("select", file);
  event.target.value = "";
}

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
</script>
