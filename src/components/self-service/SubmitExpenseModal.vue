<template>
  <Modal
    :model-value="modelValue"
    :title="t('ss.form.expense.title')"
    size="md"
    hide-footer
    @update:model-value="onModelValue"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="expense-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.expense.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <select id="expense-type" v-model="form.type" required :class="inputClass">
          <option value="" disabled>{{ t("ss.form.expense.selectType") }}</option>
          <option v-for="typeOpt in typeOptions" :key="typeOpt.value || typeOpt" :value="typeOpt.value || typeOpt">
            {{ typeOpt.label || typeOpt }}
          </option>
        </select>
      </div>

      <div>
        <label for="expense-date" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.expense.date") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input id="expense-date" v-model="form.expenseDate" type="date" required :max="today" :class="inputClass" />
      </div>

      <div>
        <label for="expense-amount" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.amount") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-neutral-400">$</span>
          <input
            id="expense-amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            :class="[inputClass, 'pl-7']"
          />
        </div>
      </div>

      <div>
        <label for="expense-description" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.description") }}
        </label>
        <textarea
          id="expense-description"
          v-model="form.description"
          rows="3"
          :placeholder="t('ss.form.expense.descPlaceholder')"
          :class="[inputClass, 'resize-y']"
        />
      </div>

      <div>
        <label for="expense-receipt" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.expense.receipt") }}
        </label>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-xs hover:bg-neutral-50"
            @click="$refs.fileInput.click()"
          >
            {{ t("common.chooseFile") }}
          </button>
          <span class="truncate text-sm text-neutral-500">{{ fileLabel }}</span>
        </div>
        <input ref="fileInput" id="expense-receipt" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden" @change="onFile" />
        <p class="mt-1.5 text-xs text-neutral-500">{{ t("ss.form.expense.receiptHint") }}</p>
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
          {{ busy ? t("common.submitting") : t("ss.form.expense.submit") }}
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
  typeOptions: { type: Array, default: () => [] },
  today: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const fileInput = ref(null);
const file = ref(null);
const form = reactive(emptyForm());

function emptyForm() {
  return { type: "", expenseDate: "", amount: "", description: "" };
}

const isValid = computed(() => !!form.type && !!form.expenseDate && Number(form.amount) > 0);
const fileLabel = computed(() => (file.value ? file.value.name : t("common.noFileChosen")));

function onFile(event) {
  file.value = event.target.files?.[0] ?? null;
}

function reset() {
  Object.assign(form, emptyForm());
  file.value = null;
  if (fileInput.value) fileInput.value.value = "";
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
    type: form.type,
    expenseDate: form.expenseDate,
    amount: Number(form.amount),
    description: form.description.trim(),
    receipt: file.value,
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
