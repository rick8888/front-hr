<template>
  <Modal
    :model-value="modelValue"
    :title="t('ss.form.compOff.title')"
    size="md"
    hide-footer
    @update:model-value="onModelValue"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="comp-off-worked" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.compOff.workedDate") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input id="comp-off-worked" v-model="form.workedDate" type="date" required :max="today" :class="inputClass" />
      </div>

      <div>
        <label for="comp-off-hours" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.compOff.hoursWorked") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input
          id="comp-off-hours"
          v-model.number="form.hoursWorked"
          type="number"
          step="0.25"
          min="0"
          max="24"
          required
          placeholder="8"
          :class="inputClass"
        />
        <p class="mt-1.5 text-xs text-neutral-500">
          {{ t("ss.form.compOff.hoursHint", { days: derivedDays }) }}
        </p>
      </div>

      <div>
        <label for="comp-off-reason" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.reason") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <textarea
          id="comp-off-reason"
          v-model="form.reason"
          rows="4"
          required
          :placeholder="t('ss.form.compOff.reasonPlaceholder')"
          :class="[inputClass, 'resize-y']"
        />
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button type="button" class="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-200" @click="cancel">
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
  today: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const form = reactive(emptyForm());

function emptyForm() {
  return { workedDate: "", hoursWorked: "", reason: "" };
}

const derivedDays = computed(() => {
  const h = Number(form.hoursWorked) || 0;
  return Math.round((h / 8) * 100) / 100;
});

const isValid = computed(
  () => !!form.workedDate && Number(form.hoursWorked) > 0 && form.reason.trim().length > 0,
);

function reset() {
  Object.assign(form, emptyForm());
}

function close() {
  if (props.busy) return;
  emit("update:modelValue", false);
}

function cancel() {
  close();
}

function onSubmit() {
  if (!isValid.value || props.busy) return;
  emit("submit", {
    workedDate: form.workedDate,
    hoursWorked: Number(form.hoursWorked),
    compOffDays: derivedDays.value,
    reason: form.reason.trim(),
  });
}

function onModelValue(value) {
  if (!value && props.busy) return;
  emit("update:modelValue", value);
}

watch(() => props.modelValue, (open) => {
  if (!open) reset();
});
</script>
