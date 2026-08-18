<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHero
        :title="t('ss.expenses.submitTitle')"
        :breadcrumbs="breadcrumbs"
        home-to="/"
      />

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
        <!-- Form card -->
        <section
          class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6 xl:col-span-2"
        >
          <header class="mb-5 space-y-1">
            <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.form.expensePage.formTitle") }}</h2>
            <p class="text-sm text-neutral-500">{{ t("ss.form.expensePage.formSubtitle") }}</p>
          </header>

          <form class="space-y-5" @submit.prevent="onSubmit">
            <div class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div>
                <label
                  for="expense-type"
                  class="mb-1.5 block text-sm font-medium text-neutral-800"
                >
                  {{ t("ss.form.expense.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
                </label>
                <select
                  id="expense-type"
                  v-model="form.type"
                  required
                  :class="inputClass"
                >
                  <option value="" disabled>{{ t("ss.form.expense.selectType") }}</option>
                  <option
                    v-for="typeOpt in typeOptions"
                    :key="typeOpt.value || typeOpt"
                    :value="typeOpt.value || typeOpt"
                  >
                    {{ typeOpt.label || typeOpt }}
                  </option>
                </select>
              </div>

              <div>
                <label
                  for="expense-date"
                  class="mb-1.5 block text-sm font-medium text-neutral-800"
                >
                  {{ t("ss.form.expense.date") }}<span class="text-red-500" aria-hidden="true"> *</span>
                </label>
                <input
                  id="expense-date"
                  v-model="form.expenseDate"
                  type="date"
                  required
                  :max="today"
                  :class="inputClass"
                />
                <p class="mt-1.5 text-xs text-neutral-500">
                  {{ t("ss.form.expensePage.dateHint") }}
                </p>
              </div>
            </div>

            <div>
              <label
                for="expense-amount"
                class="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                {{ t("common.amount") }}<span class="text-red-500" aria-hidden="true"> *</span>
              </label>
              <div
                class="flex items-stretch overflow-hidden rounded-lg border border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25"
              >
                <span
                  class="flex w-10 items-center justify-center bg-neutral-50 text-sm font-medium text-neutral-500"
                >
                  $
                </span>
                <input
                  id="expense-amount"
                  v-model.number="form.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  class="w-full px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
              <p class="mt-1.5 text-xs text-neutral-500">
                {{ t("ss.form.expensePage.amountHint") }}
              </p>
            </div>

            <div>
              <label
                for="expense-remarks"
                class="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                {{ t("common.remarks") }}
              </label>
              <textarea
                id="expense-remarks"
                v-model="form.remarks"
                rows="4"
                maxlength="500"
                :class="[inputClass, 'resize-y']"
              />
              <p class="mt-1.5 text-xs text-neutral-500">
                {{ t("ss.form.expensePage.remarksHint") }}
              </p>
            </div>

            <div>
              <label
                for="expense-receipt"
                class="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                {{ t("ss.form.expensePage.receipt") }}
              </label>
              <div
                class="flex items-stretch overflow-hidden rounded-lg border border-neutral-300"
              >
                <button
                  type="button"
                  class="border-r border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                  @click="$refs.fileInput.click()"
                >
                  {{ t("common.chooseFile") }}
                </button>
                <span
                  class="flex flex-1 items-center px-3 text-sm text-neutral-500 truncate"
                >
                  {{ fileLabel }}
                </span>
              </div>
              <input
                ref="fileInput"
                id="expense-receipt"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                class="hidden"
                @change="onFile"
              />
              <p class="mt-1.5 text-xs text-neutral-500">
                {{ t("ss.form.expensePage.receiptHint") }}
              </p>
              <p v-if="fileError" class="mt-1 text-xs text-red-500">
                {{ fileError }}
              </p>
            </div>

            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-50"
                :disabled="!isValid || submitting"
              >
                <svg
                  v-if="submitting"
                  class="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ submitting ? t("common.submitting") : t("common.submitRequest") }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50"
                @click="onCancel"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {{ t("common.cancel") }}
              </button>
            </div>
          </form>
        </section>

        <!-- Aside : guidelines + common types -->
        <div class="space-y-6">
          <ExpenseGuidelinesCard :title="t('ss.form.expensePage.guidelinesTitle')" :items="guidelines" />
          <CommonExpenseTypesCard :title="t('ss.form.expensePage.commonTypesTitle')" :types="commonTypes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import PageHero from "../../components/common/PageHero.vue";
import ExpenseGuidelinesCard from "../../components/self-service/ExpenseGuidelinesCard.vue";
import CommonExpenseTypesCard from "../../components/self-service/CommonExpenseTypesCard.vue";
import { expensesApiService } from "./services/expenses.api.service.js";
import {
  expenseTypesApiService,
  fallbackExpenseTypes,
} from "../expenses/services/expenseTypes.api.service.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { useI18n } from "../../i18n/index.js";

const router = useRouter();
const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.expenses.title"), to: "/self-service/expenses" },
    { label: t("ss.expenses.submitBreadcrumb") },
  ];
});

const today = new Date().toISOString().slice(0, 10);
const typeCatalog = ref(fallbackExpenseTypes());
const typeOptions = computed(() =>
  typeCatalog.value
    .filter((item) => item.isActive)
    .map((item) => ({ value: item.code, label: item.name }))
);

const guidelines = computed(() => {
  void locale.value;
  return [
    { title: t("ss.form.expensePage.guideline1Title"), description: t("ss.form.expensePage.guideline1Desc"), tone: "blue" },
    { title: t("ss.form.expensePage.guideline2Title"), description: t("ss.form.expensePage.guideline2Desc"), tone: "amber" },
    { title: t("ss.form.expensePage.guideline3Title"), description: t("ss.form.expensePage.guideline3Desc"), tone: "green" },
    { title: t("ss.form.expensePage.guideline4Title"), description: t("ss.form.expensePage.guideline4Desc"), tone: "sky" },
  ];
});

const commonTypes = computed(() =>
  typeOptions.value.slice(0, 4).map((item) => item.label)
);

onMounted(async () => {
  try {
    const list = await expenseTypesApiService.fetchAll({ activeOnly: true });
    typeCatalog.value = list.length ? list : fallbackExpenseTypes();
  } catch {
    typeCatalog.value = fallbackExpenseTypes();
  }
});

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

const form = reactive({
  type: "",
  expenseDate: today,
  amount: "",
  remarks: "",
});

const file = ref(null);
const fileInput = ref(null);
const fileError = ref("");
const formError = ref("");
const submitting = ref(false);

const fileLabel = computed(() =>
  file.value ? file.value.name : t("common.noFileChosen"),
);

const isValid = computed(
  () =>
    !!form.type &&
    !!form.expenseDate &&
    Number(form.amount) > 0 &&
    !fileError.value,
);

function onFile(event) {
  const f = event.target.files?.[0] ?? null;
  fileError.value = "";
  if (f && f.size > MAX_FILE_BYTES) {
    fileError.value = t("common.fileTooLarge");
    file.value = null;
    if (fileInput.value) fileInput.value.value = "";
    return;
  }
  file.value = f;
}

async function onSubmit() {
  if (!isValid.value || submitting.value) return;
  submitting.value = true;
  formError.value = "";
  try {
    await expensesApiService.create({
      type: form.type,
      expenseDate: form.expenseDate,
      amount: Number(form.amount),
      remarks: form.remarks.trim(),
      receipt: file.value,
    });
    router.push({ name: "SelfServiceExpenses" });
  } catch (e) {
    formError.value = parseApiError(e) || t("ss.form.expensePage.submitError");
  } finally {
    submitting.value = false;
  }
}

function onCancel() {
  router.push({ name: "SelfServiceExpenses" });
}
</script>
