<template>
  <div class="mx-auto max-w-7xl px-4 py-5 sm:px-8 sm:py-7">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.performance.title") }}</h1>
        <p class="mt-1 text-sm text-neutral-600">{{ t("admin.performance.description") }}</p>
      </div>
      <button
        v-if="canManage"
        type="button"
        class="btn-primary"
        @click="openCreate"
      >
        + {{ t("admin.performance.create") }}
      </button>
    </header>

    <div
      v-if="error"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      {{ error }}
    </div>

    <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <input
        v-model="search"
        type="search"
        class="input-base"
        :placeholder="t('admin.performance.search')"
      />
      <select v-model="statusFilter" class="input-base">
        <option value="">{{ t("admin.performance.status.all") }}</option>
        <option value="draft">{{ t("admin.performance.status.draft") }}</option>
        <option value="submitted">{{ t("admin.performance.status.submitted") }}</option>
      </select>
    </div>

    <section
      v-if="dueObjectiveSummary.total > 0"
      class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
      :aria-label="t('admin.performance.deadlines.title')"
    >
      <article class="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <p class="text-sm font-medium text-red-800">{{ t("admin.performance.deadlines.overdue") }}</p>
        <p class="mt-1 text-2xl font-bold text-red-900">{{ dueObjectiveSummary.overdue }}</p>
      </article>
      <article class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p class="text-sm font-medium text-amber-800">{{ t("admin.performance.deadlines.today") }}</p>
        <p class="mt-1 text-2xl font-bold text-amber-900">{{ dueObjectiveSummary.today }}</p>
      </article>
      <article class="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <p class="text-sm font-medium text-blue-800">{{ t("admin.performance.deadlines.soon") }}</p>
        <p class="mt-1 text-2xl font-bold text-blue-900">{{ dueObjectiveSummary.soon }}</p>
      </article>
    </section>

    <div
      v-if="loading"
      class="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500"
    >
      {{ t("admin.performance.loading") }}
    </div>
    <div
      v-else-if="filteredReviews.length === 0"
      class="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500"
    >
      {{ t("admin.performance.empty") }}
    </div>
    <div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <article
        v-for="review in filteredReviews"
        :key="review.id"
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <EmployeeAvatar
              :name="review.employee?.name || ''"
              :avatar-url="review.employee?.avatar_url"
              size-class="h-12 w-12 font-bold"
              fallback-class="bg-primary-100 text-primary-700"
            />
            <div class="min-w-0">
              <p class="truncate font-semibold text-neutral-900">
                {{ review.employee?.name }}
              </p>
              <p class="truncate text-sm text-neutral-600">
                {{ review.employee?.job_title || review.employee?.department || "—" }}
              </p>
            </div>
          </div>
          <span
            :class="[
              'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
              review.status === 'submitted'
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800',
            ]"
          >
            {{ t(`admin.performance.status.${review.status}`) }}
          </span>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-neutral-500">{{ t("admin.performance.period") }}</p>
            <p class="mt-1 font-medium text-neutral-900">
              {{ review.period_start }} – {{ review.period_end }}
            </p>
          </div>
          <div>
            <p class="text-neutral-500">{{ t("admin.performance.reviewDate") }}</p>
            <p class="mt-1 font-medium text-neutral-900">{{ review.review_date }}</p>
          </div>
        </div>

        <div class="mb-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <span class="text-sm font-medium text-neutral-700">
            {{ t("admin.performance.rating") }}
          </span>
          <span class="font-semibold text-neutral-900">
            {{ review.rating }} / 5
            <span class="ml-1 text-amber-400" aria-hidden="true">★</span>
          </span>
        </div>

        <div class="mb-4">
          <p class="mb-2 text-sm font-medium text-neutral-700">
            {{ t("admin.performance.objectives") }}
          </p>
          <ul v-if="review.objectives?.length" class="space-y-2">
            <li
              v-for="objective in review.objectives"
              :key="objective.id"
              class="rounded-lg bg-neutral-50 px-3 py-2"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-neutral-800">{{ objective.title }}</span>
                <span class="shrink-0 text-xs text-neutral-500">
                  {{ t(`admin.performance.objectiveStatus.${objective.status}`) }} · {{ objective.progress }}%
                </span>
              </div>
              <p
                v-if="objective.due_date"
                class="mt-1 text-xs"
                :class="objectiveDeadlineClass(objective)"
              >
                {{ t("admin.performance.objectiveDueDate") }}:
                {{ formatObjectiveDate(objective.due_date) }}
                <span v-if="objectiveDeadlineLabel(objective)">
                  · {{ objectiveDeadlineLabel(objective) }}
                </span>
              </p>
              <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                <div
                  class="h-full rounded-full bg-primary-600"
                  :style="{ width: `${objective.progress}%` }"
                />
              </div>
              <div
                v-if="objective.training_enrollment?.training"
                class="mt-2 rounded-md border border-primary-100 bg-primary-50 px-2.5 py-2 text-xs text-primary-900"
              >
                <p class="font-semibold">
                  {{ t("admin.performance.linkedTraining") }}:
                  {{ objective.training_enrollment.training.name }}
                </p>
                <p class="mt-1">
                  {{ t(`admin.performance.trainingStatus.${objective.training_enrollment.status}`) }}
                  · {{ objective.training_enrollment.progress }}%
                </p>
              </div>
              <div v-if="canManage && review.status === 'submitted'" class="mt-3 border-t border-neutral-200 pt-2">
                <button
                  v-if="editingObjectiveId !== objective.id"
                  type="button"
                  class="text-xs font-semibold text-primary-700 hover:text-primary-800"
                  @click="editObjectiveProgress(objective)"
                >
                  {{ t("admin.performance.updateObjectiveProgress") }}
                </button>
                <div v-else class="space-y-2">
                  <label class="block text-xs font-medium text-neutral-700">
                    {{ t("admin.performance.objectiveStatus.label") }}
                    <select v-model="objectiveProgress.status" class="input-base mt-1 py-1.5">
                      <option value="pending">{{ t("admin.performance.objectiveStatus.pending") }}</option>
                      <option value="in_progress">{{ t("admin.performance.objectiveStatus.in_progress") }}</option>
                      <option value="completed">{{ t("admin.performance.objectiveStatus.completed") }}</option>
                    </select>
                  </label>
                  <label class="block text-xs font-medium text-neutral-700">
                    {{ t("admin.performance.objectiveProgress", { progress: objectiveProgress.progress }) }}
                    <input
                      v-model.number="objectiveProgress.progress"
                      type="range"
                      min="0"
                      max="100"
                      class="mt-1 w-full accent-primary-600"
                    >
                  </label>
                  <label class="block text-xs font-medium text-neutral-700">
                    {{ t("admin.performance.progressComment") }}
                    <textarea
                      v-model="objectiveProgress.comment"
                      class="input-base mt-1"
                      rows="2"
                      maxlength="2000"
                    />
                  </label>
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      class="btn-outline px-3 py-1 text-xs"
                      :disabled="savingProgress"
                      @click="editingObjectiveId = null"
                    >
                      {{ t("admin.performance.cancel") }}
                    </button>
                    <button
                      type="button"
                      class="btn-primary px-3 py-1 text-xs"
                      :disabled="savingProgress"
                      @click="saveObjectiveProgress(review, objective)"
                    >
                      {{ savingProgress ? t("common.submitting") : t("admin.performance.saveProgress") }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="objective.progress_history?.length" class="mt-3 border-t border-neutral-200 pt-2">
                <button
                  type="button"
                  class="text-xs font-semibold text-neutral-700 hover:text-neutral-900"
                  :aria-expanded="expandedObjectiveHistoryId === objective.id"
                  @click="toggleObjectiveHistory(objective.id)"
                >
                  {{ expandedObjectiveHistoryId === objective.id
                    ? t("admin.performance.hideProgressHistory")
                    : t("admin.performance.showProgressHistory") }}
                  ({{ objective.progress_history.length }})
                </button>
                <ol v-if="expandedObjectiveHistoryId === objective.id" class="mt-2 space-y-3">
                  <li
                    v-for="entry in objective.progress_history"
                    :key="entry.id"
                    class="border-l-2 border-neutral-300 pl-3"
                  >
                    <p class="text-xs font-semibold text-neutral-800">
                      {{ t(`admin.performance.objectiveStatus.${entry.previous_status}`) }}
                      · {{ entry.previous_progress }}%
                      →
                      {{ t(`admin.performance.objectiveStatus.${entry.status}`) }}
                      · {{ entry.progress }}%
                    </p>
                    <p class="mt-1 text-xs text-neutral-500">
                      {{ formatHistoryDate(entry.updated_at) }}
                      <span v-if="entry.updated_by?.name">
                        · {{ t("admin.performance.progressUpdatedBy", { name: entry.updated_by.name }) }}
                      </span>
                    </p>
                    <p v-if="entry.comment" class="mt-1 whitespace-pre-wrap text-xs text-neutral-700">
                      {{ entry.comment }}
                    </p>
                  </li>
                </ol>
              </div>
            </li>
          </ul>
          <p v-else class="text-sm text-neutral-500">
            {{ t("admin.performance.noObjectives") }}
          </p>
        </div>

        <p v-if="review.comments" class="mb-4 line-clamp-3 text-sm text-neutral-600">
          {{ review.comments }}
        </p>
        <div v-if="review.strengths || review.improvement_areas" class="mb-4 space-y-2 text-sm">
          <p v-if="review.strengths" class="text-neutral-700">
            <span class="font-medium">{{ t("admin.performance.strengths") }}:</span>
            {{ review.strengths }}
          </p>
          <p v-if="review.improvement_areas" class="text-neutral-700">
            <span class="font-medium">{{ t("admin.performance.improvements") }}:</span>
            {{ review.improvement_areas }}
          </p>
        </div>
        <p v-if="review.status === 'submitted'" class="mb-4 text-xs text-neutral-500">
          {{ t("admin.performance.submittedReadOnly") }}
        </p>

        <div v-if="canManage && review.status === 'draft'" class="flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
          <button type="button" class="btn-outline flex-1" @click="openEdit(review)">
            {{ t("admin.performance.edit") }}
          </button>
          <button type="button" class="btn-primary flex-1" @click="submitReview(review)">
            {{ t("admin.performance.submit") }}
          </button>
        </div>
      </article>
    </div>

    <Modal
      v-model="isModalOpen"
      :title="editingReview ? t('admin.performance.modal.edit') : t('admin.performance.modal.create')"
      size="xl"
      :hide-footer="true"
    >
      <div
        v-if="error"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {{ error }}
      </div>
      <div
        v-if="trainingError"
        class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        role="status"
      >
        {{ trainingError }}
      </div>
      <form ref="reviewFormElement" class="space-y-5" @submit.prevent="saveReview">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-neutral-700 sm:col-span-2">
            {{ t("admin.performance.employee") }}
            <select
              v-model.number="form.employee_id"
              class="input-base mt-1"
              required
              :disabled="Boolean(editingReview)"
            >
              <option :value="null" disabled>{{ t("admin.performance.selectEmployee") }}</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.full_name || employee.name }}
              </option>
            </select>
          </label>
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.performance.periodStart") }}
            <input v-model="form.period_start" class="input-base mt-1" type="date" required />
          </label>
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.performance.periodEnd") }}
            <input v-model="form.period_end" class="input-base mt-1" type="date" required />
          </label>
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.performance.reviewDate") }}
            <input v-model="form.review_date" class="input-base mt-1" type="date" required />
          </label>
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.performance.rating") }}
            <select v-model.number="form.rating" class="input-base mt-1" required>
              <option v-for="rating in 5" :key="rating" :value="rating">
                {{ t("admin.performance.ratingOption", { rating }) }}
              </option>
            </select>
          </label>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.performance.strengths") }}
            <textarea v-model="form.strengths" class="input-base mt-1" rows="3" />
          </label>
          <label class="block text-sm font-medium text-neutral-700">
            {{ t("admin.performance.improvements") }}
            <textarea v-model="form.improvement_areas" class="input-base mt-1" rows="3" />
          </label>
        </div>
        <label class="block text-sm font-medium text-neutral-700">
          {{ t("admin.performance.comments") }}
          <textarea v-model="form.comments" class="input-base mt-1" rows="3" />
        </label>

        <section class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold text-neutral-800">
              {{ t("admin.performance.objectives") }}
            </h3>
            <button
              type="button"
              class="text-sm font-semibold text-primary-700 hover:text-primary-800"
              :disabled="form.objectives.length >= 10"
              @click="addObjective"
            >
              + {{ t("admin.performance.addObjective") }}
            </button>
          </div>
          <div
            v-for="(objective, index) in form.objectives"
            :key="index"
            class="grid grid-cols-1 gap-3 rounded-lg border border-neutral-200 p-3 sm:grid-cols-2"
          >
            <input
              v-model="objective.title"
              class="input-base"
              :placeholder="t('admin.performance.objectiveTitle')"
              maxlength="180"
              required
            />
            <input
              v-model="objective.due_date"
              class="input-base"
              type="date"
              :aria-label="t('admin.performance.objectiveDueDate')"
            />
            <select v-model="objective.status" class="input-base">
              <option value="pending">{{ t("admin.performance.objectiveStatus.pending") }}</option>
              <option value="in_progress">{{ t("admin.performance.objectiveStatus.in_progress") }}</option>
              <option value="completed">{{ t("admin.performance.objectiveStatus.completed") }}</option>
            </select>
            <textarea
              v-model="objective.description"
              class="input-base sm:col-span-2"
              rows="2"
              :placeholder="t('admin.performance.objectiveDescription')"
            />
            <label class="block text-sm font-medium text-neutral-700 sm:col-span-2">
              {{ t("admin.performance.developmentTraining") }}
              <select v-model.number="objective.training_id" class="input-base mt-1">
                <option :value="null">{{ t("admin.performance.noTraining") }}</option>
                <option
                  v-for="training in trainings"
                  :key="training.id"
                  :value="training.id"
                  :disabled="training.status !== 'published' || !training.active"
                >
                  {{ training.name }}{{ training.status !== "published" || !training.active
                    ? ` (${t("admin.performance.trainingUnavailable")})`
                    : "" }}
                </option>
              </select>
            </label>
            <div class="flex items-center gap-3 sm:col-span-2">
              <label class="flex-1 text-xs font-medium text-neutral-600">
                {{ objective.progress }}%
                <input
                  v-model.number="objective.progress"
                  type="range"
                  min="0"
                  max="100"
                  class="mt-1 w-full accent-primary-600"
                />
              </label>
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-700"
                @click="removeObjective(index)"
              >
                {{ t("admin.performance.removeObjective") }}
              </button>
            </div>
          </div>
        </section>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
          <button type="button" class="btn-outline" :disabled="saving" @click="isModalOpen = false">
            {{ t("admin.performance.cancel") }}
          </button>
          <button type="button" class="btn-primary" :disabled="saving" @click="saveReview">
            {{ t("admin.performance.save") }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import { useI18n } from "../i18n/index.js";
import EmployeeAvatar from "../components/common/EmployeeAvatar.vue";
import Modal from "../components/common/Modal.vue";
import { employeesApiService } from "./employees/services/employees.api.service.js";
import { performanceReviewsApiService } from "./employees/services/performanceReviews.api.service.js";
import { trainingsApiService } from "./training/services/trainings.api.service.js";

const auth = useAuthStore();
const { t } = useI18n();
const canManage = computed(() => auth.can("employees.manage"));
const reviews = ref([]);
const employees = ref([]);
const trainings = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const trainingError = ref("");
const editingObjectiveId = ref(null);
const savingProgress = ref(false);
const expandedObjectiveHistoryId = ref(null);
const objectiveProgress = ref({ status: "pending", progress: 0, comment: "" });
const search = ref("");
const statusFilter = ref("");
const isModalOpen = ref(false);
const editingReview = ref(null);
const reviewFormElement = ref(null);

const emptyForm = () => ({
  employee_id: null,
  period_start: "",
  period_end: "",
  review_date: todayAsLocalDate(),
  rating: 3,
  strengths: "",
  improvement_areas: "",
  comments: "",
  objectives: [],
});
const form = ref(emptyForm());

function todayAsLocalDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

const filteredReviews = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  return reviews.value.filter((review) => {
    const matchesStatus = !statusFilter.value || review.status === statusFilter.value;
    const matchesName = !query || (review.employee?.name || "").toLocaleLowerCase().includes(query);
    return matchesStatus && matchesName;
  });
});

const dueObjectiveSummary = computed(() => {
  const summary = { overdue: 0, today: 0, soon: 0, total: 0 };
  for (const review of reviews.value) {
    if (review.status !== "submitted") continue;
    for (const objective of review.objectives || []) {
      if (!objective.due_date || objective.status === "completed") continue;
      const days = daysUntilObjective(objective.due_date);
      if (days === null || days > 7) continue;
      summary.total += 1;
      if (days < 0) summary.overdue += 1;
      else if (days === 0) summary.today += 1;
      else summary.soon += 1;
    }
  }
  return summary;
});

function daysUntilObjective(dueDate) {
  const match = String(dueDate || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const due = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due - todayUtc) / 86400000);
}

function formatObjectiveDate(dueDate) {
  const match = String(dueDate || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dueDate;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function objectiveDeadlineLabel(objective) {
  if (objective.status === "completed") return "";
  const days = daysUntilObjective(objective.due_date);
  if (days === null) return "";
  if (days < 0) return t("admin.performance.deadlines.overdueDays", { days: Math.abs(days) });
  if (days === 0) return t("admin.performance.deadlines.today");
  if (days <= 7) return t("admin.performance.deadlines.daysRemaining", { days });
  return "";
}

function objectiveDeadlineClass(objective) {
  if (objective.status === "completed") return "text-neutral-500";
  const days = daysUntilObjective(objective.due_date);
  if (days !== null && days < 0) return "font-semibold text-red-700";
  if (days === 0) return "font-semibold text-amber-700";
  if (days !== null && days <= 7) return "font-medium text-blue-700";
  return "text-neutral-500";
}

function getErrorMessage(exception, fallbackKey) {
  const response = exception?.response?.data;
  const validationMessage = response?.errors
    ? Object.values(response.errors).flat().find((message) => typeof message === "string")
    : null;
  return validationMessage || response?.message || t(fallbackKey);
}

async function loadData() {
  loading.value = true;
  error.value = "";
  trainingError.value = "";
  try {
    const [reviewResult, employeeResult, trainingResult] = await Promise.allSettled([
      performanceReviewsApiService.fetchAll(),
      employeesApiService.fetchAll(),
      trainingsApiService.fetchAll(),
    ]);
    if (reviewResult.status === "rejected") throw reviewResult.reason;
    if (employeeResult.status === "rejected") throw employeeResult.reason;
    reviews.value = reviewResult.value;
    employees.value = employeeResult.value;
    if (trainingResult.status === "fulfilled") {
      trainings.value = trainingResult.value;
    } else {
      trainings.value = [];
      trainingError.value = getErrorMessage(
        trainingResult.reason,
        "admin.performance.error.loadTrainings",
      );
    }
  } catch (exception) {
    error.value = getErrorMessage(exception, "admin.performance.error.load");
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingReview.value = null;
  const today = todayAsLocalDate();
  form.value = {
    ...emptyForm(),
    period_start: `${today.slice(0, 4)}-01-01`,
    period_end: today,
    review_date: today,
  };
  error.value = "";
  isModalOpen.value = true;
}

function openEdit(review) {
  editingReview.value = review;
  form.value = {
    employee_id: review.employee_id,
    period_start: review.period_start,
    period_end: review.period_end,
    review_date: review.review_date,
    rating: review.rating,
    strengths: review.strengths || "",
    improvement_areas: review.improvement_areas || "",
    comments: review.comments || "",
    objectives: (review.objectives || []).map((objective) => ({
      title: objective.title,
      description: objective.description || "",
      due_date: objective.due_date || "",
      status: objective.status || "pending",
      progress: objective.progress || 0,
      training_id: objective.training_enrollment?.training?.id ?? null,
    })),
  };
  error.value = "";
  isModalOpen.value = true;
}

function addObjective() {
  if (form.value.objectives.length < 10) {
    form.value.objectives.push({
      title: "",
      description: "",
      due_date: "",
      status: "pending",
      progress: 0,
      training_id: null,
    });
  }
}

function removeObjective(index) {
  form.value.objectives.splice(index, 1);
}

async function saveReview() {
  if (saving.value) return;
  if (!reviewFormElement.value?.reportValidity()) return;
  saving.value = true;
  error.value = "";
  const payload = {
    ...form.value,
    objectives: form.value.objectives.filter((objective) => objective.title.trim()),
  };
  try {
    if (editingReview.value) {
      await performanceReviewsApiService.update(editingReview.value.id, payload);
    } else {
      await performanceReviewsApiService.create(payload);
    }
    isModalOpen.value = false;
    await loadData();
  } catch (exception) {
    error.value = getErrorMessage(exception, "admin.performance.error.save");
  } finally {
    saving.value = false;
  }
}

async function submitReview(review) {
  if (!window.confirm(t("admin.performance.confirmSubmit"))) return;
  error.value = "";
  try {
    await performanceReviewsApiService.submit(review.id);
    await loadData();
  } catch (exception) {
    error.value = getErrorMessage(exception, "admin.performance.error.submit");
  }
}

function editObjectiveProgress(objective) {
  error.value = "";
  editingObjectiveId.value = objective.id;
  objectiveProgress.value = {
    status: objective.status,
    progress: Number(objective.progress) || 0,
    comment: "",
  };
}

function toggleObjectiveHistory(objectiveId) {
  expandedObjectiveHistoryId.value = expandedObjectiveHistoryId.value === objectiveId
    ? null
    : objectiveId;
}

function formatHistoryDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function saveObjectiveProgress(review, objective) {
  if (savingProgress.value) return;
  savingProgress.value = true;
  error.value = "";
  try {
    await performanceReviewsApiService.updateObjectiveProgress(
      review.id,
      objective.id,
      objectiveProgress.value,
    );
    editingObjectiveId.value = null;
    await loadData();
  } catch (exception) {
    error.value = getErrorMessage(exception, "admin.performance.error.updateObjectiveProgress");
  } finally {
    savingProgress.value = false;
  }
}

onMounted(loadData);
</script>
