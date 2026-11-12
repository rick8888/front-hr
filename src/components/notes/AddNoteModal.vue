<template>
  <Modal
    :model-value="modelValue"
    :title="initialNote ? t('ss.notes.modal.editTitle') : t('ss.notes.modal.newTitle')"
    size="md"
    hide-footer
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("ss.notes.modal.title") }}</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          :placeholder="t('ss.notes.modal.titlePlaceholder')"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("ss.notes.modal.content") }}</label>
        <textarea
          v-model="form.body"
          rows="4"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          :placeholder="t('ss.notes.modal.contentPlaceholder')"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("ss.notes.modal.tag") }}</label>
        <select
          v-model="form.tag"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option v-for="tag in assignableTags" :key="tag.value" :value="tag.value">
            {{ t(tag.labelKey) }}
          </option>
        </select>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          :disabled="saving"
          class="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          @click="close"
        >
          {{ t("common.cancel") }}
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ t("ss.notes.modal.save") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { reactive, watch } from "vue";
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  initialNote: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  assignableTags: {
    type: Array,
    default: () => [
      { value: "work", labelKey: "ss.notes.tags.work" },
      { value: "personal", labelKey: "ss.notes.tags.personal" },
      { value: "ideas", labelKey: "ss.notes.tags.ideas" },
    ],
  },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const { t } = useI18n();

const form = reactive({
  title: "",
  body: "",
  tag: "work",
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.title = props.initialNote?.title || "";
      form.body = props.initialNote?.body || "";
      form.tag = props.initialNote?.tags?.[0] || props.assignableTags[0]?.value || "work";
    }
  },
);

function close() {
  emit("update:modelValue", false);
}

function onSubmit() {
  if (props.saving) return;
  emit("submit", { ...form });
}
</script>
