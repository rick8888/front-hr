<template>
  <div class="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
    <header class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-primary-700">
        {{ t("admin.employees.probation.eyebrow") }}
      </p>
      <h1 class="mt-1 text-2xl font-bold text-neutral-900">
        {{ t("admin.employees.probation.title") }}
      </h1>
      <p class="mt-1 text-sm text-neutral-600">
        {{ t("admin.employees.probation.description") }}
      </p>
    </header>

    <div
      v-if="error"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ error }}
    </div>
    <div
      v-if="notice"
      class="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
      role="status"
    >
      {{ notice }}
    </div>

    <div
      v-if="loading"
      class="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500"
    >
      {{ t("admin.employees.probation.loading") }}
    </div>
    <div
      v-else-if="employees.length === 0"
      class="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500"
    >
      {{ t("admin.employees.probation.empty") }}
    </div>
    <div v-else class="space-y-4">
      <article
        v-for="employee in employees"
        :key="employee.id"
        class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
      >
        <div class="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
          <div class="min-w-0">
            <h2 class="font-semibold text-neutral-900">
              {{ employee.full_name || employee.name }}
            </h2>
            <p class="mt-1 text-sm text-neutral-600">
              {{ employee.job_title || employee.matricule }}
              <span v-if="employee.department"> · {{ employee.department }}</span>
            </p>
            <p class="mt-2 text-sm text-neutral-700">
              {{ t("admin.employees.probation.endsOn") }}:
              <strong>{{ formatDate(probationEnd(employee)) }}</strong>
              <span
                class="ml-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="daysUntil(employee) < 0
                  ? 'bg-red-100 text-red-800'
                  : daysUntil(employee) <= 14
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-100 text-neutral-700'"
              >
                {{ deadlineLabel(employee) }}
              </span>
            </p>
          </div>
          <div class="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              @click="toggleHistory(employee.id)"
            >
              {{ expandedEmployeeId === employee.id
                ? t("admin.employees.probation.hideHistory")
                : t("admin.employees.probation.showHistory") }}
              <span v-if="reviewsFor(employee.id).length">({{ reviewsFor(employee.id).length }})</span>
            </button>
            <button
              type="button"
              class="rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-800"
              @click="openReview(employee)"
            >
              {{ t("admin.employees.probation.evaluate") }}
            </button>
          </div>
        </div>

        <div v-if="expandedEmployeeId === employee.id" class="border-t border-neutral-100 bg-neutral-50 px-5 py-4">
          <p v-if="reviewsFor(employee.id).length === 0" class="text-sm text-neutral-500">
            {{ t("admin.employees.probation.noHistory") }}
          </p>
          <ol v-else class="space-y-3">
            <li
              v-for="review in reviewsFor(employee.id)"
              :key="review.id"
              class="border-l-2 border-primary-300 pl-3"
            >
              <p class="text-sm font-semibold text-neutral-800">
                {{ decisionLabel(review.decision) }} · {{ formatDate(review.review_date) }}
              </p>
              <p v-if="review.decision === 'extended'" class="mt-1 text-xs text-neutral-600">
                {{ t("admin.employees.probation.extendedFrom") }}:
                {{ formatDate(review.period_end_before) }}
                → {{ formatDate(review.extended_until) }}
              </p>
              <p v-if="review.notes" class="mt-1 whitespace-pre-wrap text-sm text-neutral-600">
                {{ review.notes }}
              </p>
              <p v-if="review.reviewer?.name" class="mt-1 text-xs text-neutral-500">
                {{ t("admin.employees.probation.reviewedBy", { name: review.reviewer.name }) }}
              </p>
            </li>
          </ol>
        </div>
      </article>
    </div>

    <div
      v-if="selectedEmployee"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      @click.self="closeReview"
    >
      <form
        class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
        @submit.prevent="saveReview"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-neutral-900">
              {{ t("admin.employees.probation.evaluateTitle") }}
            </h2>
            <p class="mt-1 text-sm text-neutral-600">
              {{ selectedEmployee.full_name || selectedEmployee.name }}
            </p>
          </div>
          <button type="button" class="text-neutral-500 hover:text-neutral-800" @click="closeReview">
            {{ t("common.cancel") }}
          </button>
        </div>

        <div class="space-y-4">
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.employees.probation.reviewDate") }}
            <input
              v-model="form.reviewDate"
              type="date"
              required
              class="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
          </label>

          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.employees.probation.decision") }}
            <select
              v-model="form.decision"
              class="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
              <option value="check_in">{{ t("admin.employees.probation.decision.checkIn") }}</option>
              <option value="confirmed">{{ t("admin.employees.probation.decision.confirmed") }}</option>
              <option value="extended">{{ t("admin.employees.probation.decision.extended") }}</option>
              <option value="terminated">{{ t("admin.employees.probation.decision.terminated") }}</option>
            </select>
          </label>

          <label v-if="form.decision === 'extended'" class="block text-sm font-medium text-neutral-700">
            {{ t("admin.employees.probation.newEndDate") }}
            <input
              v-model="form.extendedUntil"
              type="date"
              required
              :min="minimumExtensionDate"
              class="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
          </label>

          <div v-if="form.decision === 'terminated'" class="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p class="text-sm text-amber-900">{{ t("admin.employees.probation.terminationInfo") }}</p>
            <label class="block text-sm font-medium text-neutral-700">
              {{ t("admin.employees.probation.terminationType") }}
              <select
                v-model="form.termination.type"
                required
                class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2"
              >
                <option v-for="type in terminationTypes" :key="type.code" :value="type.code">
                  {{ type.label }}
                </option>
              </select>
            </label>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-sm font-medium text-neutral-700">
                {{ t("admin.employees.probation.exitDate") }}
                <input v-model="form.termination.exitDate" required type="date" class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2">
              </label>
              <label class="block text-sm font-medium text-neutral-700">
                {{ t("admin.employees.probation.lastWorkingDay") }}
                <input v-model="form.termination.lastWorkingDay" required type="date" class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2">
              </label>
            </div>
            <label class="block text-sm font-medium text-neutral-700">
              {{ t("admin.employees.probation.terminationReason") }}
              <textarea v-model="form.termination.reason" required rows="2" class="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2" />
            </label>
          </div>

          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.employees.probation.notes") }}
            <textarea v-model="form.notes" rows="4" class="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2" />
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700" @click="closeReview">
            {{ t("common.cancel") }}
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? t("common.submitting") : t("common.save") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "../i18n/index.js";
import { employeesApiService } from "./employees/services/employees.api.service.js";
import { employeeProbationApiService } from "./employees/services/employeeProbation.api.service.js";
import {
  fallbackTerminationTypes,
  terminationTypesApiService,
} from "./employees/services/terminationTypes.api.service.js";

const { t } = useI18n();
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const notice = ref("");
const employees = ref([]);
const reviews = ref([]);
const terminationTypes = ref(fallbackTerminationTypes());
const selectedEmployee = ref(null);
const expandedEmployeeId = ref(null);
const today = localDateIso(new Date());
const form = reactive({
  reviewDate: today,
  decision: "check_in",
  extendedUntil: "",
  notes: "",
  termination: {
    type: "termination",
    exitDate: today,
    lastWorkingDay: today,
    reason: "",
  },
});

const minimumExtensionDate = computed(() => {
  if (!selectedEmployee.value) return today;
  const currentEnd = probationEnd(selectedEmployee.value);
  if (!currentEnd) return today;
  const [year, month, day] = currentEnd.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return next.toISOString().slice(0, 10);
});

function localDateIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function probationEnd(employee) {
  return employee.probation_end_date || employee.probationEndDate || employee.metadata?.probation_end_date || "";
}

function dateOnly(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function daysUntil(employee) {
  const end = dateOnly(probationEnd(employee));
  const now = dateOnly(today);
  return end === null || now === null ? 0 : Math.round((end - now) / 86400000);
}

function deadlineLabel(employee) {
  const days = daysUntil(employee);
  if (days < 0) return t("admin.employees.probation.overdue", { days: Math.abs(days) });
  if (days === 0) return t("admin.employees.probation.dueToday");
  return t("admin.employees.probation.daysRemaining", { days });
}

function formatDate(value) {
  if (!value) return "—";
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function reviewsFor(employeeId) {
  return reviews.value.filter((review) => Number(review.employee_id) === Number(employeeId));
}

function decisionLabel(decision) {
  const translationKey = decision === "check_in" ? "checkIn" : decision;
  return t(`admin.employees.probation.decision.${translationKey}`);
}

function toggleHistory(employeeId) {
  expandedEmployeeId.value = expandedEmployeeId.value === employeeId ? null : employeeId;
}

function resetForm() {
  Object.assign(form, {
    reviewDate: localDateIso(new Date()),
    decision: "check_in",
    extendedUntil: "",
    notes: "",
    termination: {
      type: terminationTypes.value[0]?.code || "termination",
      exitDate: localDateIso(new Date()),
      lastWorkingDay: localDateIso(new Date()),
      reason: "",
    },
  });
}

function openReview(employee) {
  notice.value = "";
  resetForm();
  selectedEmployee.value = employee;
}

function closeReview() {
  selectedEmployee.value = null;
}

function messageFrom(exception, fallback) {
  const response = exception?.response?.data;
  const firstValidationError = response?.errors
    ? Object.values(response.errors).flat().find((message) => typeof message === "string")
    : null;
  return firstValidationError || response?.message || fallback;
}

async function loadData() {
  loading.value = true;
  error.value = "";
  try {
    const [employeeList, reviewList] = await Promise.all([
      employeesApiService.fetchAll(),
      employeeProbationApiService.fetchReviews(),
    ]);
    reviews.value = reviewList;
    employees.value = employeeList
      .filter((employee) => employee.status === "active" && !employee.metadata?.probation_decision)
      .filter((employee) => probationEnd(employee))
      .sort((a, b) => daysUntil(a) - daysUntil(b));
    try {
      const types = await terminationTypesApiService.fetchAll({ activeOnly: true });
      if (types.length) terminationTypes.value = types;
    } catch {
      terminationTypes.value = fallbackTerminationTypes();
    }
  } catch (exception) {
    error.value = messageFrom(exception, t("admin.employees.probation.error.load"));
  } finally {
    loading.value = false;
  }
}

async function saveReview() {
  if (!selectedEmployee.value) return;
  saving.value = true;
  error.value = "";
  try {
    await employeeProbationApiService.recordReview(selectedEmployee.value.id, form);
    notice.value = t("admin.employees.probation.success");
    closeReview();
    await loadData();
  } catch (exception) {
    error.value = messageFrom(exception, t("admin.employees.probation.error.save"));
  } finally {
    saving.value = false;
  }
}

onMounted(loadData);
</script>
