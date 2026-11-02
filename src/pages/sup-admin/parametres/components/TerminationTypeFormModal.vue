<template>
  <Modal
    :model-value="open"
    :title="isEdit ? t('admin.employees.terminationTypes.modalEdit', { name: type?.name || '' }) : t('admin.employees.terminationTypes.modalAdd')"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-4" @submit.prevent="$emit('save')">
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          {{ t("admin.employees.terminationTypes.col.label") }} <span class="text-red-500">*</span>
        </label>
        <input
          :value="form.name"
          type="text"
          class="input-base w-full text-sm"
          :placeholder="t('admin.employees.terminationTypes.namePlaceholder')"
          @input="onNameInput"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          {{ t("common.code") }} <span class="text-red-500">*</span>
        </label>
        <input
          :value="form.code"
          type="text"
          class="input-base w-full font-mono text-sm"
          :disabled="isEdit && type?.isSystem"
          :placeholder="t('admin.employees.terminationTypes.codePlaceholder')"
          @input="$emit('update:form', { ...form, code: $event.target.value })"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">{{ t("common.description") }}</label>
        <textarea
          :value="form.description"
          rows="2"
          class="input-base w-full resize-y text-sm"
          @input="$emit('update:form', { ...form, description: $event.target.value })"
        />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">{{ t("admin.employees.terminationTypes.col.order") }}</label>
          <input
            :value="form.sortOrder"
            type="number"
            min="0"
            class="input-base w-full text-sm"
            @input="$emit('update:form', { ...form, sortOrder: Number($event.target.value) })"
          />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 text-sm text-neutral-800">
            <input
              :checked="form.isActive"
              type="checkbox"
              class="rounded border-neutral-300"
              @change="$emit('update:form', { ...form, isActive: $event.target.checked })"
            />
            {{ t("admin.employees.terminationTypes.active") }}
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-neutral-100 pt-4">
        <button type="button" class="btn-outline text-sm" :disabled="busy" @click="$emit('update:open', false)">
          {{ t("common.cancel") }}
        </button>
        <button type="submit" class="btn-primary text-sm" :disabled="busy">
          {{ busy ? t("common.saving") : isEdit ? t("common.update") : t("common.create") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { useI18n } from "../../../../i18n/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  type: { type: Object, default: null },
  form: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "update:form", "save"]);

const { t } = useI18n();

const isEdit = computed(() => !!props.type?.id);

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
  if (!props.type) {
    next.code = slugify(name);
  }
  emit("update:form", next);
}
</script>
