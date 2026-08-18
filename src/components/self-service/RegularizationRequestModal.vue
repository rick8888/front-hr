<template>
  <Modal
    :model-value="modelValue"
    :title="modalTitle"
    size="md"
    hide-footer
    @update:model-value="onModelValue"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ saveError }}
      </div>

      <div>
        <label for="reg-date" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.date") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input id="reg-date" v-model="form.date" type="date" required :class="inputClass" :disabled="saving" />
      </div>

      <div>
        <label for="reg-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <select id="reg-type" v-model="form.type" required :class="inputClass" :disabled="saving">
          <option value="" disabled>{{ t("ss.form.regularization.selectType") }}</option>
          <option v-for="typeOpt in typeOptions" :key="typeOpt.value" :value="typeOpt.value">
            {{ typeOpt.label }}
          </option>
        </select>
      </div>

      <div>
        <label for="reg-checkin" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.regularization.checkIn") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input id="reg-checkin" v-model="form.checkInTime" type="time" required :class="inputClass" :disabled="saving" />
      </div>

      <div>
        <label for="reg-checkout" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.regularization.checkOut") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input id="reg-checkout" v-model="form.checkOutTime" type="time" required :class="inputClass" :disabled="saving" />
      </div>

      <div>
        <label for="reg-reason" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.reason") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <textarea id="reg-reason" v-model="form.reason" rows="4" required :class="[inputClass, 'resize-y']" :disabled="saving" />
      </div>

      <div>
        <label for="reg-files" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("common.attachments") }}
        </label>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-xs hover:bg-neutral-50"
            @click="$refs.fileInput.click()"
          >
            {{ t("common.chooseFiles") }}
          </button>
          <span class="truncate text-sm text-neutral-500">{{ filesLabel }}</span>
        </div>
        <input ref="fileInput" id="reg-files" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple class="hidden" @change="onFiles" />
        <p class="mt-1.5 text-xs text-neutral-500">{{ t("ss.form.regularization.filesHint") }}</p>
        <p class="text-xs text-neutral-500">{{ t("ss.form.regularization.replaceHint") }}</p>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button type="button" class="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-200 disabled:opacity-50" :disabled="saving" @click="cancel">
          {{ t("common.cancel") }}
        </button>
        <button type="submit" class="rounded-lg bg-secondary-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-50" :disabled="!isValid || saving">
          {{ submitLabel }}
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
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  saveError: { type: String, default: "" },
  typeOptions: {
    type: Array,
    default: () => [
      { value: "missed_punch", label: "Missed punch" },
      { value: "overtime", label: "Overtime" },
      { value: "correction", label: "Correction" },
    ],
  },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const { t, locale } = useI18n();

const isEditMode = computed(() => !!props.initial?.id);

const modalTitle = computed(() => {
  void locale.value;
  return isEditMode.value ? t("ss.form.regularization.editTitle") : t("ss.form.regularization.newTitle");
});

const submitLabel = computed(() => {
  void locale.value;
  if (props.saving) return isEditMode.value ? t("common.updating") : t("common.submitting");
  return isEditMode.value ? t("common.updateRequest") : t("common.submitRequest");
});

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 disabled:bg-neutral-50 disabled:opacity-70";

const fileInput = ref(null);
const files = ref([]);
const form = reactive(emptyForm());

function emptyForm() {
  return { date: "", type: "", checkInTime: "", checkOutTime: "", reason: "" };
}

function toIsoDate(value) {
  if (!value) return "";
  const direct = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  if (direct) return direct[1];
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function extractTime(value) {
  if (!value) return "";
  const m = String(value).match(/(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "";
}

function fillFromInitial(record) {
  if (!record) {
    Object.assign(form, emptyForm());
    return;
  }
  form.date = toIsoDate(record.dateIso || record.date);
  form.type = record.typeValue || record.type || "";
  form.checkInTime = record.checkIn || extractTime(record.requestedIn);
  form.checkOutTime = record.checkOut || extractTime(record.requestedOut);
  form.reason = record.reason || "";
}

const isValid = computed(
  () =>
    !!form.date &&
    !!form.type &&
    !!form.checkInTime &&
    !!form.checkOutTime &&
    form.reason.trim().length > 0,
);

const filesLabel = computed(() => {
  if (!files.value.length) return t("common.noFileChosen");
  if (files.value.length === 1) return files.value[0].name;
  return t("common.filesChosen", { n: files.value.length });
});

function onFiles(event) {
  files.value = Array.from(event.target.files || []);
}

function reset() {
  Object.assign(form, emptyForm());
  files.value = [];
  if (fileInput.value) fileInput.value.value = "";
}

function close() {
  emit("update:modelValue", false);
}

function cancel() {
  close();
}

function onSubmit() {
  if (!isValid.value || props.saving) return;
  emit("submit", {
    id: props.initial?.id ?? null,
    ...form,
    files: files.value,
  });
}

function onModelValue(value) {
  emit("update:modelValue", value);
}

watch(() => props.modelValue, (open) => {
  if (open) fillFromInitial(props.initial);
  else reset();
});

watch(() => props.initial, (initial) => {
  if (props.modelValue) fillFromInitial(initial);
});
</script>
