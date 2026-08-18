<template>
  <Modal
    :model-value="modelValue"
    :title="t('ss.form.docRequest.title')"
    size="md"
    hide-footer
    @update:model-value="onModelValue"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="doc-request-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.documentRequests.col.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <select id="doc-request-type" v-model="form.type" required :class="inputClass">
          <option value="" disabled>{{ t("ss.form.docRequest.selectType") }}</option>
          <option v-for="typeOpt in typeOptions" :key="optionValue(typeOpt)" :value="optionValue(typeOpt)">
            {{ optionLabel(typeOpt) }}
          </option>
        </select>
      </div>

      <div>
        <label for="doc-request-purpose" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.purpose") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <textarea
          id="doc-request-purpose"
          v-model="form.purpose"
          rows="4"
          required
          :placeholder="t('ss.form.docRequest.purposePlaceholder')"
          :class="[inputClass, 'resize-y']"
        />
      </div>

      <div>
        <label for="doc-request-needed-by" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.docRequest.neededBy") }}
        </label>
        <input id="doc-request-needed-by" v-model="form.neededBy" type="date" :min="today" :class="inputClass" />
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button type="button" class="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-200" :disabled="busy" @click="cancel">
          {{ t("common.cancel") }}
        </button>
        <button
          type="submit"
          class="rounded-lg bg-secondary-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-50"
          :disabled="!isValid || busy"
        >
          {{ busy ? t("common.submitting") : t("common.submitRequest") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  typeOptions: { type: Array, default: () => [] },
  today: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const form = reactive(emptyForm());

function emptyForm() {
  return { type: "", purpose: "", neededBy: "" };
}

const isValid = computed(() => !!form.type && form.purpose.trim().length > 0);

function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

function reset() {
  Object.assign(form, emptyForm());
}

function close() {
  emit("update:modelValue", false);
}

function cancel() {
  if (props.busy) return;
  close();
}

function onSubmit() {
  if (!isValid.value || props.busy) return;
  emit("submit", {
    type: form.type,
    purpose: form.purpose.trim(),
    neededBy: form.neededBy || null,
  });
}

function onModelValue(value) {
  emit("update:modelValue", value);
}

watch(() => props.modelValue, (open) => {
  if (!open) reset();
});
</script>
