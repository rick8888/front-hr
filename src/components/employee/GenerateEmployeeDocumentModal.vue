<template>
  <Modal
    :model-value="modelValue"
    :title="t('admin.employees.documentTemplates.generateTitle')"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-5">
      <!-- Contexte employé -->
      <div
        class="flex items-start gap-3 rounded-xl border border-secondary-100 bg-secondary-50/70 px-4 py-3"
      >
        <div
          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-500 text-white"
          aria-hidden="true"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-neutral-900 truncate">
            {{ employeeDisplayName }}
          </p>
          <p class="mt-0.5 text-sm text-neutral-600 leading-relaxed">
            {{ t("admin.employees.documentTemplates.generateHintShort") }}
          </p>
        </div>
      </div>

      <div
        v-if="loadError"
        class="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700"
      >
        {{ loadError }}
      </div>
      <div
        v-if="actionError"
        class="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700"
      >
        {{ actionError }}
      </div>

      <!-- Sélection modèle -->
      <div>
        <label
          for="generate-doc-template"
          class="mb-1.5 block text-sm font-medium text-neutral-800"
        >
          {{ t("admin.employees.documentTemplates.generateSelect") }}
          <span class="text-error-500">*</span>
        </label>
        <select
          id="generate-doc-template"
          v-model="selectedId"
          class="input-base w-full"
          :disabled="loadingCatalog || catalog.length === 0"
        >
          <option value="">
            {{
              loadingCatalog
                ? t("common.loading")
                : t("admin.employees.documentTemplates.generateSelectPlaceholder")
            }}
          </option>
          <option v-for="tpl in catalog" :key="tpl.id" :value="tpl.id">
            {{ tpl.name }}
          </option>
        </select>
        <p
          v-if="!loadingCatalog && catalog.length === 0 && !loadError"
          class="mt-2 text-xs text-neutral-500"
        >
          {{ t("admin.employees.documentTemplates.generateEmpty") }}
        </p>
      </div>

      <!-- Aperçu du modèle sélectionné -->
      <div
        v-if="selectedTemplate"
        class="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            PDF
          </span>
          <span
            v-if="selectedTemplate.family"
            class="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200"
          >
            {{ familyLabel(selectedTemplate.family) }}
          </span>
        </div>
        <p class="mt-2 text-sm font-medium text-neutral-900">
          {{ selectedTemplate.name }}
        </p>
        <p class="mt-1 text-xs text-neutral-500">
          {{ t("admin.employees.documentTemplates.generateArchiveHint") }}
        </p>
      </div>
    </div>

    <template #footer>
      <div
        class="flex flex-col-reverse gap-2 border-t border-neutral-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <button
          type="button"
          class="btn-outline"
          :disabled="busy"
          @click="$emit('update:modelValue', false)"
        >
          {{ t("common.cancel") }}
        </button>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            class="btn-outline inline-flex items-center justify-center gap-2"
            :disabled="!canAct"
            @click="preview"
          >
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {{
              busyAction === "preview"
                ? t("common.loading")
                : t("admin.employees.documentTemplates.previewPdf")
            }}
          </button>
          <button
            type="button"
            class="btn-primary inline-flex items-center justify-center gap-2"
            :disabled="!canGenerate"
            @click="generate"
          >
            <svg
              v-if="busyAction !== 'generate'"
              class="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            {{
              busyAction === "generate"
                ? t("common.loading")
                : t("admin.employees.documentTemplates.generateArchive")
            }}
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import Modal from "../common/Modal.vue";
import { documentTemplatesApiService } from "../../pages/employees/services/documentTemplates.api.service.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employee: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "generated"]);

const { t } = useI18n();
const catalog = ref([]);
const loadingCatalog = ref(false);
const loadError = ref("");
const actionError = ref("");
const busyAction = ref("");
const selectedId = ref("");

const selectedTemplate = computed(() =>
  catalog.value.find((x) => String(x.id) === String(selectedId.value)),
);

const employeeDisplayName = computed(() => {
  const e = props.employee;
  if (!e) return "";
  return (
    e.name ||
    e.full_name ||
    [e.first_name, e.last_name].filter(Boolean).join(" ").trim() ||
    e.email ||
    ""
  );
});

const busy = computed(() => Boolean(busyAction.value));
const canAct = computed(
  () => Boolean(selectedId.value) && !busy.value && !loadingCatalog.value,
);
const canGenerate = computed(
  () => canAct.value && selectedTemplate.value?.channel === "pdf",
);

function familyLabel(family) {
  const key = `admin.employees.documentTemplates.family.${family}`;
  const label = t(key);
  return label === key ? family : label;
}

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return;
    selectedId.value = "";
    actionError.value = "";
    busyAction.value = "";
    loadingCatalog.value = true;
    loadError.value = "";
    try {
      catalog.value = await documentTemplatesApiService.fetchCatalog({ channel: "pdf" });
      if (catalog.value.length === 1) {
        selectedId.value = String(catalog.value[0].id);
      }
    } catch (e) {
      loadError.value = parseApiError(e) || t("admin.employees.documentTemplates.loadError");
      catalog.value = [];
    } finally {
      loadingCatalog.value = false;
    }
  },
);

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "apercu.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

async function preview() {
  if (!props.employee?.id || !selectedId.value) return;
  busyAction.value = "preview";
  actionError.value = "";
  try {
    const tpl = selectedTemplate.value;
    const response = await documentTemplatesApiService.previewForEmployee(props.employee.id, {
      document_template_id: Number(selectedId.value),
    });
    if (response.data instanceof Blob) {
      downloadBlob(response.data, `${tpl?.code || "document"}-apercu.pdf`);
      return;
    }
    actionError.value = t("admin.employees.documentTemplates.previewEmailOnly");
  } catch (e) {
    actionError.value = parseApiError(e) || t("admin.employees.documentTemplates.previewError");
  } finally {
    busyAction.value = "";
  }
}

async function generate() {
  if (!props.employee?.id || !selectedId.value) return;
  busyAction.value = "generate";
  actionError.value = "";
  try {
    const result = await documentTemplatesApiService.generateForEmployee(props.employee.id, {
      document_template_id: Number(selectedId.value),
    });
    emit("generated", result);
    emit("update:modelValue", false);
  } catch (e) {
    actionError.value = parseApiError(e) || t("admin.employees.documentTemplates.generateError");
  } finally {
    busyAction.value = "";
  }
}
</script>
