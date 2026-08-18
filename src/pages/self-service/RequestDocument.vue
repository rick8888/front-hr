<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('ss.requestDocument.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
      <!-- Form card (left, 2/3) -->
      <section class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6 xl:col-span-2">
        <header class="mb-5 space-y-1">
          <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.form.docRequestPage.formTitle") }}</h2>
          <p class="text-sm text-neutral-500">
            {{ t("ss.form.docRequestPage.formSubtitle") }}
          </p>
        </header>

        <form class="space-y-5" @submit.prevent="onSubmit">
          <div>
            <label for="rd-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.documentRequests.col.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
            </label>
            <select
              id="rd-type"
              v-model="form.type"
              required
              :class="inputClass"
            >
              <option value="" disabled>{{ t("common.selectOption") }}</option>
              <option
                v-for="opt in typeOptions"
                :key="optionValue(opt)"
                :value="optionValue(opt)"
              >
                {{ optionLabel(opt) }}
              </option>
            </select>
            <p class="mt-1.5 text-xs text-neutral-500">
              {{ t("ss.form.docRequestPage.typeHint") }}
            </p>
          </div>

          <div>
            <label for="rd-remarks" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("common.remarks") }}
            </label>
            <textarea
              id="rd-remarks"
              v-model="form.remarks"
              rows="5"
              :placeholder="t('ss.form.docRequestPage.remarksPlaceholder')"
              :class="[inputClass, 'resize-y']"
            />
            <p class="mt-1.5 text-xs text-neutral-500">
              {{ t("ss.form.docRequestPage.remarksHint") }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-50"
              :disabled="!isValid || submitting"
            >
              <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.94 14.83l8.54 5.95a1 1 0 0 0 1.49-1.13L9.74 12l3.23-7.65a1 1 0 0 0-1.49-1.13L2.94 9.17a1 1 0 0 0 0 1.66z" />
              </svg>
              {{ submitting ? t("common.submitting") : t("common.submitRequest") }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50"
              @click="onCancel"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ t("common.cancel") }}
            </button>
          </div>
        </form>
      </section>

      <!-- Important information card (right, 1/3) -->
      <aside class="rounded-xl border border-sky-100 bg-sky-50/70 p-5 shadow-xs md:p-6">
        <h3 class="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ t("common.importantInfo") }}
        </h3>
        <ul class="space-y-2.5 text-sm text-sky-700">
          <li
            v-for="(tip, idx) in tips"
            :key="idx"
            class="flex items-start gap-2"
          >
            <span class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500" aria-hidden="true" />
            <span>{{ tip }}</span>
          </li>
        </ul>
      </aside>
    </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import PageHero from "../../components/common/PageHero.vue";
import { documentRequestsApiService } from "./services/documentRequests.api.service.js";
import { DOC_REQUEST_TYPE_OPTIONS } from "./composables/useMyDocumentRequests.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { useI18n } from "../../i18n/index.js";

const router = useRouter();
const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [{ label: t("ss.requestDocument.title") }];
});

const typeOptions = DOC_REQUEST_TYPE_OPTIONS;

const tips = computed(() => {
  void locale.value;
  return [
    t("ss.form.docRequestPage.tip1"),
    t("ss.form.docRequestPage.tip2"),
    t("ss.form.docRequestPage.tip3"),
    t("ss.form.docRequestPage.tip4"),
  ];
});

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const form = reactive({
  type: "",
  remarks: "",
});

const submitting = ref(false);
const error = ref("");

const isValid = computed(() => !!form.type);

function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

async function onSubmit() {
  if (!isValid.value || submitting.value) return;
  submitting.value = true;
  error.value = "";
  try {
    await documentRequestsApiService.create({
      type: form.type,
      purpose: form.remarks.trim() || null,
    });
    router.push({ name: "SelfServiceDocumentRequests" });
  } catch (e) {
    error.value = parseApiError(e) || t("ss.form.docRequestPage.submitError");
  } finally {
    submitting.value = false;
  }
}

function onCancel() {
  router.push({ name: "SelfServiceDocumentRequests" });
}
</script>
