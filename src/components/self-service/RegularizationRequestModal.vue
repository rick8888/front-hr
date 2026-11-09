<template>
  <Modal
    :model-value="modelValue"
    :title="modalTitle"
    size="lg"
    backdrop-class="bg-neutral-950/60 backdrop-blur-sm"
    panel-class="overflow-hidden rounded-2xl border border-white/60 shadow-2xl"
    header-class="border-neutral-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 px-7 py-5"
    title-class="text-xl tracking-tight"
    close-button-class="rounded-lg p-2 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
    :close-label="t('common.close')"
    body-class="px-7 py-6"
    hide-footer
    @update:model-value="onModelValue"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <div v-if="saveError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ saveError }}
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="reg-date" class="mb-1.5 block text-sm font-semibold text-slate-700">
            {{ t("common.date") }}<span class="text-rose-500" aria-hidden="true"> *</span>
          </label>
          <input id="reg-date" v-model="form.date" type="date" required :class="inputClass" :disabled="saving" />
        </div>

        <div>
          <label for="reg-type" class="mb-1.5 block text-sm font-semibold text-slate-700">
            {{ t("common.type") }}<span class="text-rose-500" aria-hidden="true"> *</span>
          </label>
          <select id="reg-type" v-model="form.type" required :class="inputClass" :disabled="saving">
            <option value="" disabled>{{ t("ss.form.regularization.selectType") }}</option>
            <option v-for="typeOpt in typeOptions" :key="typeOpt.value" :value="typeOpt.value">
              {{ typeOpt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="reg-checkin" class="mb-1.5 block text-sm font-semibold text-slate-700">
            {{ t("ss.form.regularization.checkIn") }}<span class="text-rose-500" aria-hidden="true"> *</span>
          </label>
          <input id="reg-checkin" v-model="form.checkInTime" type="time" required :class="inputClass" :disabled="saving" />
        </div>

        <div>
          <label for="reg-checkout" class="mb-1.5 block text-sm font-semibold text-slate-700">
            {{ t("ss.form.regularization.checkOut") }}<span class="text-rose-500" aria-hidden="true"> *</span>
          </label>
          <input id="reg-checkout" v-model="form.checkOutTime" type="time" required :class="inputClass" :disabled="saving" />
        </div>
      </div>

      <div>
        <label for="reg-reason" class="mb-1.5 block text-sm font-semibold text-slate-700">
          {{ t("common.reason") }}<span class="text-rose-500" aria-hidden="true"> *</span>
        </label>
        <textarea id="reg-reason" v-model="form.reason" rows="4" required :class="[inputClass, 'resize-y']" :disabled="saving" />
      </div>

      <div>
        <label for="reg-files" class="mb-1.5 block text-sm font-semibold text-slate-700">
          {{ t("common.attachments") }}
        </label>
        <div class="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2">
          <button
            type="button"
            class="inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
            :disabled="saving"
            @click="$refs.fileInput.click()"
          >
            {{ t("common.chooseFiles") }}
          </button>
          <span class="truncate text-sm text-slate-500">{{ filesLabel }}</span>
        </div>
        <input ref="fileInput" id="reg-files" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple class="hidden" :disabled="saving" @change="onFiles" />
        <p class="mt-2 text-xs leading-relaxed text-slate-500">{{ t("ss.form.regularization.filesHint") }}</p>
        <p class="text-xs leading-relaxed text-slate-500">{{ t("ss.form.regularization.replaceHint") }}</p>
      </div>

      <div class="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end sm:gap-3">
        <button type="button" class="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50" :disabled="saving" @click="cancel">
          {{ t("common.cancel") }}
        </button>
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :disabled="!isValid || saving">
          <svg v-if="!saving" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
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
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50 disabled:opacity-70";

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
