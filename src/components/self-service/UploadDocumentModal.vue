<template>
  <Modal
    :model-value="modelValue"
    :title="t('ss.form.document.uploadTitle')"
    size="md"
    hide-footer
    @update:model-value="onModelValue"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="doc-name" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.document.name") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input id="doc-name" v-model="form.name" type="text" required :placeholder="t('ss.form.document.namePlaceholder')" :class="inputClass" />
      </div>

      <div>
        <label for="doc-category" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.category") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <select id="doc-category" v-model="form.category" required :class="inputClass">
          <option value="" disabled>{{ t("ss.form.document.selectCategory") }}</option>
          <option v-for="c in categoryOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>

      <div>
        <label for="doc-reference" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.document.reference") }}
        </label>
        <input id="doc-reference" v-model="form.reference" type="text" :placeholder="t('ss.form.document.referencePlaceholder')" :class="inputClass" />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="doc-issue" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.document.issueDate") }}
          </label>
          <input id="doc-issue" v-model="form.issueDate" type="date" :max="today" :class="inputClass" />
        </div>
        <div>
          <label for="doc-expiry" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.document.expiryDate") }}
          </label>
          <input id="doc-expiry" v-model="form.expiryDate" type="date" :min="form.issueDate || undefined" :class="inputClass" />
        </div>
      </div>

      <div>
        <label for="doc-file" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.file") }}
        </label>
        <div class="flex items-stretch overflow-hidden rounded-lg border border-neutral-300">
          <button
            type="button"
            class="border-r border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            @click="$refs.fileInput.click()"
          >
            {{ t("common.chooseFile") }}
          </button>
          <span class="flex flex-1 items-center truncate px-3 text-sm text-neutral-500">{{ fileLabel }}</span>
        </div>
        <input ref="fileInput" id="doc-file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="hidden" @change="onFile" />
        <p class="mt-1.5 text-xs text-neutral-500">{{ t("ss.form.document.fileHint") }}</p>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50" :disabled="busy" @click="cancel">
          {{ t("common.cancel") }}
        </button>
        <button type="submit" class="inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-600 disabled:opacity-50" :disabled="!isValid || busy">
          <span v-if="busy" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          {{ busy ? t("common.uploading") : t("common.upload") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  categoryOptions: { type: Array, default: () => [] },
  today: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const form = reactive(emptyForm());
const file = ref(null);
const fileInput = ref(null);

const fileLabel = computed(() => (file.value ? file.value.name : t("common.noFileChosen")));
const isValid = computed(() => !!form.name.trim() && !!form.category);

watch(() => props.modelValue, (open) => {
  if (open) reset();
});

function emptyForm() {
  return { name: "", category: "", reference: "", issueDate: "", expiryDate: "" };
}

function onFile(event) {
  file.value = event.target.files?.[0] ?? null;
}

function reset() {
  Object.assign(form, emptyForm());
  file.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

function onModelValue(v) {
  if (!v && props.busy) return;
  emit("update:modelValue", v);
}

function cancel() {
  if (props.busy) return;
  emit("update:modelValue", false);
}

function onSubmit() {
  if (!isValid.value || props.busy) return;
  emit("submit", {
    name: form.name.trim(),
    category: form.category,
    reference: form.reference.trim() || null,
    issueDate: form.issueDate || null,
    expiryDate: form.expiryDate || null,
    file: file.value,
  });
}
</script>
