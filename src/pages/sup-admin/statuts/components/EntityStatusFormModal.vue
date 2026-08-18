<template>
  <Modal
    :model-value="open"
    :title="isEdit ? `Modifier — ${status?.name}` : 'Nouveau statut'"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-4" @submit.prevent="$emit('save')">
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Entité applicative</label>
        <input
          :value="entityLabel ? `${entityLabel} (${entityType})` : entityType"
          type="text"
          class="input-base w-full bg-neutral-50 text-sm"
          disabled
        />
        <p class="mt-1 text-xs text-neutral-500">
          Ce statut s’applique uniquement à ce module de l’application.
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Libellé <span class="text-red-500">*</span>
        </label>
        <input
          :value="form.name"
          type="text"
          class="input-base w-full text-sm"
          placeholder="Ex. En attente"
          @input="onNameInput"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Libellé EN</label>
        <input
          :value="form.nameEn"
          type="text"
          class="input-base w-full text-sm"
          placeholder="Ex. Pending"
          @input="$emit('update:form', { ...form, nameEn: $event.target.value })"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Code <span class="text-red-500">*</span>
        </label>
        <input
          :value="form.code"
          type="text"
          class="input-base w-full font-mono text-sm"
          :disabled="isEdit && status?.isSystem"
          placeholder="ex. pending"
          @input="$emit('update:form', { ...form, code: $event.target.value })"
        />
        <p v-if="isEdit && status?.isSystem" class="mt-1 text-xs text-neutral-500">
          Le code d’un statut système n’est pas modifiable.
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">Description</label>
        <textarea
          :value="form.description"
          rows="2"
          class="input-base w-full resize-y text-sm"
          @input="$emit('update:form', { ...form, description: $event.target.value })"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Couleur</label>
          <select
            :value="form.tone"
            class="input-base w-full text-sm"
            @change="$emit('update:form', { ...form, tone: $event.target.value })"
          >
            <option v-for="tone in STATUS_TONES" :key="tone.value" :value="tone.value">
              {{ tone.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Ordre</label>
          <input
            :value="form.sortOrder"
            type="number"
            min="0"
            class="input-base w-full text-sm"
            @input="$emit('update:form', { ...form, sortOrder: Number($event.target.value) })"
          />
        </div>
      </div>

      <label class="flex items-center gap-2 text-sm text-neutral-800">
        <input
          :checked="form.isActive"
          type="checkbox"
          class="rounded border-neutral-300"
          :disabled="status?.isSystem"
          @change="$emit('update:form', { ...form, isActive: $event.target.checked })"
        />
        Statut actif
      </label>

      <div class="flex justify-end gap-3 border-t border-neutral-100 pt-4">
        <button type="button" class="btn-outline text-sm" :disabled="busy" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="submit" class="btn-primary text-sm" :disabled="busy">
          {{ busy ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer" }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { STATUS_TONES } from "../composables/useEntityStatuses.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  status: { type: Object, default: null },
  form: { type: Object, required: true },
  busy: { type: Boolean, default: false },
  entityLabel: { type: String, default: "" },
  entityType: { type: String, default: "" },
});

const emit = defineEmits(["update:open", "update:form", "save"]);

const isEdit = computed(() => !!props.status?.id);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function onNameInput(event) {
  const name = event.target.value;
  const next = { ...props.form, name };
  if (!props.status) {
    next.code = slugify(name);
  }
  emit("update:form", next);
}
</script>
