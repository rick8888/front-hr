<template>
  <Modal
    :model-value="open"
    :title="isEdit ? `Modifier — ${role?.name}` : 'Nouveau rôle'"
    size="lg"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-5" @submit.prevent="$emit('save')">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Nom <span class="text-red-500">*</span>
          </label>
          <input
            :value="form.name"
            type="text"
            class="input-base w-full text-sm"
            placeholder="Ex. Responsable RH"
            @input="onNameInput"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Identifiant (slug) <span class="text-red-500">*</span>
          </label>
          <input
            :value="form.slug"
            type="text"
            class="input-base w-full font-mono text-sm"
            :disabled="isEdit && role?.isSystem"
            placeholder="ex. rh_manager"
            @input="$emit('update:form', { ...form, slug: $event.target.value })"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Description</label>
          <textarea
            :value="form.description"
            rows="2"
            class="input-base w-full resize-y text-sm"
            placeholder="Description du rôle et de son périmètre"
            @input="$emit('update:form', { ...form, description: $event.target.value })"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input
              :checked="form.isActive"
              type="checkbox"
              class="rounded border-neutral-300"
              @change="$emit('update:form', { ...form, isActive: $event.target.checked })"
            />
            Rôle actif
          </label>
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-semibold text-neutral-800">Permissions</h3>
        <div class="max-h-72 space-y-4 overflow-y-auto rounded-lg border border-neutral-200 p-4">
          <div v-for="group in permissionGroups" :key="group.group">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {{ group.group }}
            </p>
            <div class="grid gap-2 sm:grid-cols-2">
              <label
                v-for="perm in group.items"
                :key="perm.key"
                class="flex items-start gap-2 rounded-md border border-neutral-100 px-3 py-2 text-sm hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  class="mt-0.5 rounded border-neutral-300"
                  :checked="form.permissions.includes(perm.key)"
                  @change="$emit('toggle-permission', perm.key)"
                />
                <span>
                  <span class="block font-medium text-neutral-800">{{ perm.label }}</span>
                  <span class="block font-mono text-xs text-neutral-400">{{ perm.key }}</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-neutral-100 pt-4">
        <button
          type="button"
          class="btn-outline text-sm"
          :disabled="busy"
          @click="$emit('update:open', false)"
        >
          Annuler
        </button>
        <button type="submit" class="btn-primary text-sm" :disabled="busy">
          {{ busy ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le rôle" }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import Modal from "../../../../components/common/Modal.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  role: { type: Object, default: null },
  form: { type: Object, required: true },
  permissionGroups: { type: Array, default: () => [] },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "update:form", "save", "sync-slug", "toggle-permission"]);

const isEdit = computed(() => !!props.role?.id);

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
  if (!props.role) {
    next.slug = slugify(name);
  }
  emit("update:form", next);
}
</script>
