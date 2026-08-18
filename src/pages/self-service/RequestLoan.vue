<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('ss.requestLoan.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="formError"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ formError }}
    </div>

    <section class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6">
      <header class="mb-5 space-y-1">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.form.loan.formTitle") }}</h2>
        <p class="text-sm text-neutral-500">{{ t("ss.form.loan.formSubtitle") }}</p>
      </header>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <div>
            <label for="loan-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.form.loan.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
            </label>
            <select
              id="loan-type"
              v-model="form.type"
              required
              :class="inputClass"
              @change="onTypeChange"
            >
              <option value="" disabled>{{ t("ss.form.loan.selectType") }}</option>
              <option v-for="t in loanTypes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>

          <div>
            <label for="loan-amount" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.form.loan.amount") }}<span class="text-red-500" aria-hidden="true"> *</span>
            </label>
            <div class="flex items-stretch overflow-hidden rounded-lg border border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25">
              <span class="flex w-10 items-center justify-center bg-neutral-50 text-sm font-medium text-neutral-500">
                $
              </span>
              <input
                id="loan-amount"
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label for="loan-rate" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.form.loan.interestRate") }}
            </label>
            <input
              id="loan-rate"
              v-model.number="form.interestRate"
              type="number"
              step="0.01"
              min="0"
              readonly
              :class="[inputClass, 'bg-neutral-50']"
            />
            <p class="mt-1.5 text-xs text-neutral-500">
              {{ t("ss.form.loan.interestHint") }}
            </p>
          </div>

          <div>
            <label for="loan-tenure" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.form.loan.tenure") }}<span class="text-red-500" aria-hidden="true"> *</span>
            </label>
            <input
              id="loan-tenure"
              v-model.number="form.tenure"
              type="number"
              min="1"
              max="360"
              required
              placeholder="e.g. 24"
              :class="inputClass"
            />
          </div>

          <div>
            <label for="loan-disbursement" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.form.loan.disbursementDate") }}
            </label>
            <input
              id="loan-disbursement"
              v-model="form.disbursementDate"
              type="date"
              :min="today"
              placeholder="Select date"
              :class="inputClass"
            />
            <p class="mt-1.5 text-xs text-neutral-500">
              {{ t("ss.form.loan.disbursementHint") }}
            </p>
          </div>

          <div>
            <label for="loan-repayment" class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("ss.form.loan.repaymentDate") }}
            </label>
            <input
              id="loan-repayment"
              v-model="form.repaymentStartDate"
              type="date"
              :min="form.disbursementDate || today"
              placeholder="Select date"
              :class="inputClass"
            />
            <p class="mt-1.5 text-xs text-neutral-500">
              {{ t("ss.form.loan.repaymentHint") }}
            </p>
          </div>
        </div>

        <div>
          <label for="loan-purpose" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.loan.purpose") }}<span class="text-red-500" aria-hidden="true"> *</span>
          </label>
          <textarea
            id="loan-purpose"
            v-model="form.purpose"
            rows="4"
            required
            :placeholder="t('ss.form.loan.purposePlaceholder')"
            :class="[inputClass, 'resize-y']"
          />
          <p class="mt-1.5 text-xs text-neutral-500">
            {{ t("ss.form.loan.purposeHint") }}
          </p>
        </div>

        <div>
          <label for="loan-files" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("common.supportingDocuments") }}
          </label>
          <div class="flex items-stretch overflow-hidden rounded-lg border border-neutral-300">
            <button
              type="button"
              class="border-r border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              @click="$refs.fileInput.click()"
            >
              {{ t("common.chooseFiles") }}
            </button>
            <span class="flex flex-1 items-center px-3 text-sm text-neutral-500 truncate">
              {{ filesLabel }}
            </span>
          </div>
          <input
            ref="fileInput"
            id="loan-files"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple
            class="hidden"
            @change="onFiles"
          />
          <p class="mt-1.5 text-xs text-neutral-500">
            {{ t("ss.form.loan.filesHint") }}
          </p>
        </div>

        <div>
          <label for="loan-notes" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("common.additionalNotes") }}
          </label>
          <textarea
            id="loan-notes"
            v-model="form.notes"
            rows="3"
            :placeholder="t('ss.form.loan.notesPlaceholder')"
            :class="[inputClass, 'resize-y']"
          />
        </div>

        <!-- EMI result (shown after Calculate EMI) -->
        <div
          v-if="emiResult"
          class="grid grid-cols-1 gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 sm:grid-cols-3"
        >
          <div>
            <p class="text-xs font-medium text-emerald-700">{{ t("ss.form.loan.monthlyEmi") }}</p>
            <p class="mt-0.5 text-lg font-bold text-emerald-700">
              {{ formatAmount(emiResult.emi) }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium text-emerald-700">{{ t("ss.form.loan.totalInterest") }}</p>
            <p class="mt-0.5 text-lg font-bold text-emerald-700">
              {{ formatAmount(emiResult.totalInterest) }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium text-emerald-700">{{ t("ss.form.loan.totalPayment") }}</p>
            <p class="mt-0.5 text-lg font-bold text-emerald-700">
              {{ formatAmount(emiResult.totalPayment) }}
            </p>
          </div>
        </div>

        <!-- Important information -->
        <div class="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-700">
          <p class="mb-2 inline-flex items-center gap-2 text-sm font-semibold">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t("common.importantInfo") }}
          </p>
          <ul class="space-y-1.5">
            <li v-for="(tip, idx) in tips" :key="idx" class="flex items-start gap-2">
              <span class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-500 disabled:pointer-events-none disabled:opacity-60"
            :disabled="!canCalculateEmi"
            @click="onCalculateEmi"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m-6 4h6m-6 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
              />
            </svg>
            {{ t("common.calculateEmi") }}
          </button>

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
            {{ submitting ? t("common.submitting") : t("common.submitLoanRequest") }}
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
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import PageHero from "../../components/common/PageHero.vue";
import { loansApiService } from "./services/loans.api.service.js";
import {
  MY_LOAN_TYPES,
  calculateEmi,
} from "./composables/useMyLoans.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { useI18n } from "../../i18n/index.js";

const router = useRouter();
const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.loans.title"), to: "/self-service/loans" },
    { label: t("ss.requestLoan.title") },
  ];
});

const today = new Date().toISOString().slice(0, 10);
const loanTypes = MY_LOAN_TYPES;

const tips = computed(() => {
  void locale.value;
  return [
    t("ss.form.loan.tip1"),
    t("ss.form.loan.tip2"),
    t("ss.form.loan.tip3"),
    t("ss.form.loan.tip4"),
  ];
});

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const form = reactive({
  type: "",
  amount: "",
  interestRate: "",
  tenure: "",
  disbursementDate: "",
  repaymentStartDate: "",
  purpose: "",
  notes: "",
});

const files = ref([]);
const fileInput = ref(null);
const submitting = ref(false);
const formError = ref("");
const emiResult = ref(null);

const filesLabel = computed(() => {
  if (!files.value.length) return t("common.noFileChosen");
  if (files.value.length === 1) return files.value[0].name;
  return t("common.filesChosen", { n: files.value.length });
});

const isValid = computed(
  () =>
    !!form.type &&
    Number(form.amount) > 0 &&
    Number(form.tenure) > 0 &&
    form.purpose.trim().length > 0,
);

const canCalculateEmi = computed(
  () =>
    Number(form.amount) > 0 &&
    Number(form.tenure) > 0 &&
    Number(form.interestRate) >= 0,
);

function onTypeChange() {
  const found = loanTypes.find((t) => t.value === form.type);
  form.interestRate = found ? found.interestRate : "";
  emiResult.value = null;
}

function onFiles(event) {
  const list = Array.from(event.target.files || []);
  files.value = list.slice(0, 5);
}

function onCalculateEmi() {
  if (!canCalculateEmi.value) return;
  emiResult.value = calculateEmi(form.amount, form.interestRate, form.tenure);
}

async function onSubmit() {
  if (!isValid.value || submitting.value) return;
  submitting.value = true;
  formError.value = "";

  const typeMeta = loanTypes.find((t) => t.value === form.type);
  const interestRate =
    Number(form.interestRate) || typeMeta?.interestRate || 0;

  try {
    await loansApiService.create({
      type: form.type,
      amount: Number(form.amount),
      interestRate,
      tenureMonths: Number(form.tenure),
      purpose: form.purpose.trim(),
      notes: form.notes.trim() || null,
      disbursementDate: form.disbursementDate || null,
      repaymentStartDate: form.repaymentStartDate || null,
      currency: "USD",
      documents: files.value,
    });
    router.push({ name: "SelfServiceLoans" });
  } catch (e) {
    formError.value = parseApiError(e) || t("ss.form.loan.submitError");
  } finally {
    submitting.value = false;
  }
}

function onCancel() {
  router.push({ name: "SelfServiceLoans" });
}

function formatAmount(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}
</script>
