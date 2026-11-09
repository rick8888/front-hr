<template>
  <main class="mx-auto max-w-4xl px-4 py-6 sm:px-8">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-primary-600">
          {{ t("admin.employees.onboarding.eyebrow") }}
        </p>
        <h1 class="mt-1 text-2xl font-bold text-neutral-900">
          {{ t("admin.employees.onboarding.title") }}
        </h1>
        <p class="mt-2 text-sm text-neutral-600">
          {{ employee.name || employee.full_name || t("admin.employees.onboarding.description") }}
        </p>
      </div>
      <router-link to="/recruitment" class="btn-outline">
        {{ t("admin.employees.onboarding.backToRecruitment") }}
      </router-link>
    </header>

    <div
      v-if="error"
      role="alert"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section class="card">
      <div class="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-neutral-900">
            {{ t("admin.employees.onboarding.checklist") }}
          </h2>
          <p class="mt-1 text-sm text-neutral-600">
            {{ t("admin.employees.onboarding.progress", { completed: completedCount, total: tasks.length }) }}
          </p>
        </div>
        <span class="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
          {{ progress }}%
        </span>
      </div>

      <div class="mb-6 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          class="h-full rounded-full bg-primary-500 transition-all"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <p v-if="loading" class="py-8 text-center text-sm text-neutral-500">
        {{ t("common.loading") }}
      </p>
      <p v-else-if="tasks.length === 0" class="py-8 text-center text-sm text-neutral-500">
        {{ t("admin.employees.onboarding.noTasks") }}
      </p>
      <ul v-else class="divide-y divide-neutral-100">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex min-w-0 items-start gap-3">
            <span
              :class="[
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                task.status === 'completed'
                  ? 'bg-success-100 text-success-700'
                  : 'bg-neutral-100 text-neutral-500',
              ]"
              aria-hidden="true"
            >
              {{ task.status === "completed" ? "✓" : "•" }}
            </span>
            <div>
              <h3 class="font-medium text-neutral-900">
                {{ taskTranslation(task.task_key, "title") }}
              </h3>
              <p class="mt-1 text-sm text-neutral-600">
                {{ taskTranslation(task.task_key, "description") }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn-outline shrink-0 text-sm"
            :disabled="savingTaskId === task.id"
            @click="toggleTask(task)"
          >
            {{
              savingTaskId === task.id
                ? t("admin.employees.onboarding.saving")
                : task.status === "completed"
                  ? t("admin.employees.onboarding.markPending")
                  : t("admin.employees.onboarding.markComplete")
            }}
          </button>
        </li>
      </ul>

      <div
        v-if="tasks.length > 0 && completedCount === tasks.length && !loading"
        class="mt-5 rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800"
        role="status"
      >
        {{ t("admin.employees.onboarding.complete") }}
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../i18n/index.js";
import { parseApiError } from "../utils/apiErrors.js";
import { employeeOnboardingApiService } from "./employees/services/employeeOnboarding.api.service.js";
import { employeesApiService } from "./employees/services/employees.api.service.js";

const route = useRoute();
const { t } = useI18n();
const tasks = ref([]);
const employee = ref({});
const loading = ref(true);
const error = ref("");
const savingTaskId = ref(null);

const completedCount = computed(
  () => tasks.value.filter((task) => task.status === "completed").length,
);
const progress = computed(() =>
  tasks.value.length
    ? Math.round((completedCount.value / tasks.value.length) * 100)
    : 0,
);

function taskTranslation(taskKey, field) {
  return t(`admin.employees.onboarding.tasks.${taskKey}.${field}`);
}

async function loadTasks() {
  loading.value = true;
  error.value = "";
  try {
    const [employeeTasks, employeeRecord] = await Promise.all([
      employeeOnboardingApiService.fetchTasks(route.params.id),
      employeesApiService.fetchById(route.params.id),
    ]);
    tasks.value = employeeTasks;
    employee.value = employeeRecord || {};
  } catch (e) {
    error.value = parseApiError(e) || t("admin.employees.onboarding.error.load");
    tasks.value = [];
  } finally {
    loading.value = false;
  }
}

async function toggleTask(task) {
  if (savingTaskId.value !== null) return;
  savingTaskId.value = task.id;
  error.value = "";
  try {
    tasks.value = await employeeOnboardingApiService.updateTask(
      route.params.id,
      task.id,
      task.status === "completed" ? "pending" : "completed",
    );
  } catch (e) {
    error.value = parseApiError(e) || t("admin.employees.onboarding.error.update");
  } finally {
    savingTaskId.value = null;
  }
}

watch(() => route.params.id, loadTasks, { immediate: true });
</script>
