<template>
  <Modal
    :model-value="open"
    :title="isEdit ? `Modifier — ${country?.name}` : 'Nouveau pays'"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-4" @submit.prevent="$emit('save')">
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Nom <span class="text-red-500">*</span>
        </label>
        <input
          :value="form.name"
          type="text"
          class="input-base w-full text-sm"
          placeholder="Ex. Maroc"
          required
          @input="$emit('update:form', { ...form, name: $event.target.value })"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Code ISO <span class="text-red-500">*</span>
          </label>
          <input
            :value="form.code"
            type="text"
            maxlength="3"
            class="input-base w-full font-mono text-sm uppercase"
            placeholder="MA"
            required
            @input="
              $emit('update:form', {
                ...form,
                code: $event.target.value.toUpperCase(),
              })
            "
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Devise <span class="text-red-500">*</span>
          </label>
          <input
            :value="form.currency"
            type="text"
            maxlength="3"
            class="input-base w-full font-mono text-sm uppercase"
            placeholder="MAD"
            required
            @input="
              $emit('update:form', {
                ...form,
                currency: $event.target.value.toUpperCase(),
              })
            "
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Locale
          </label>
          <input
            :value="form.locale"
            type="text"
            class="input-base w-full font-mono text-sm"
            placeholder="fr_MA"
            @input="$emit('update:form', { ...form, locale: $event.target.value })"
          />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input
              :checked="form.isActive"
              type="checkbox"
              class="rounded border-neutral-300"
              @change="
                $emit('update:form', {
                  ...form,
                  isActive: $event.target.checked,
                })
              "
            />
            Pays actif
          </label>
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
          {{ busy ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer" }}
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
  country: { type: Object, default: null },
  form: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});

defineEmits(["update:open", "update:form", "save"]);

const isEdit = computed(() => !!props.country?.id);
</script>
