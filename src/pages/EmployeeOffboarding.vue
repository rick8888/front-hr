<template>
  <div class="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
    <header class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-primary-700">
        {{ t("admin.employees.offboarding.eyebrow") }}
      </p>
      <h1 class="mt-1 text-2xl font-bold text-neutral-900">
        {{ t("admin.employees.offboarding.title") }}
      </h1>
      <p class="mt-1 text-sm text-neutral-600">
        {{ t("admin.employees.offboarding.description") }}
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
      {{ t("admin.employees.offboarding.loading") }}
    </div>
    <div
      v-else-if="employeeGroups.length === 0 && departuresWithoutChecklist.length === 0"
      class="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500"
    >
      {{ t("admin.employees.offboarding.empty") }}
    </div>
    <div v-else class="space-y-5">
      <section
        v-if="departuresWithoutChecklist.length"
        class="rounded-xl border border-blue-200 bg-blue-50 p-5"
      >
        <h2 class="font-semibold text-blue-950">
          {{ t("admin.employees.offboarding.legacyTitle") }}
        </h2>
        <p class="mt-1 text-sm text-blue-900">
          {{ t("admin.employees.offboarding.legacyDescription") }}
        </p>
        <ul class="mt-3 divide-y divide-blue-200">
          <li
            v-for="employee in departuresWithoutChecklist"
            :key="employee.id"
            class="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div>
              <p class="text-sm font-semibold text-blue-950">
                {{ employee.full_name || employee.name }}
              </p>
              <p class="text-xs text-blue-800">
                {{ employee.terminated_at || employee.metadata?.retirement?.date || employee.status }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              :disabled="busyEmployeeId === employee.id"
              @click="startChecklist(employee)"
            >
              {{ t("admin.employees.offboarding.start") }}
            </button>
          </li>
        </ul>
      </section>

      <article
        v-for="group in employeeGroups"
        :key="group.employee.id"
        class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
      >
        <header class="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
          <div>
            <h2 class="font-semibold text-neutral-900">{{ group.employee.name }}</h2>
            <p class="mt-1 text-sm text-neutral-600">
              {{ group.employee.job_title || group.employee.matricule }}
              <span v-if="group.exitDate"> · {{ t("admin.employees.offboarding.exitDate") }}: {{ group.exitDate }}</span>
            </p>
          </div>
          <span
            :class="[
              'rounded-full px-3 py-1 text-xs font-semibold',
              group.complete ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800',
            ]"
          >
            {{ group.complete ? t("admin.employees.offboarding.closed") : t("admin.employees.offboarding.inProgress") }}
          </span>
        </header>

        <div class="px-5 py-4">
          <div class="mb-4 flex items-center justify-between text-xs text-neutral-500">
            <span>{{ t("admin.employees.offboarding.progress", {
              completed: group.completedCount,
              total: group.tasks.length,
            }) }}</span>
            <span>{{ group.progress }}%</span>
          </div>
          <div class="mb-5 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div class="h-full rounded-full bg-primary-600" :style="{ width: `${group.progress}%` }" />
          </div>

          <ul class="divide-y divide-neutral-100">
            <li v-for="task in group.tasks" :key="task.id" class="py-4 first:pt-0 last:pb-0">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs',
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-500',
                      ]"
                      aria-hidden="true"
                    >
                      {{ task.status === "completed" ? "✓" : "•" }}
                    </span>
                    <h3 class="text-sm font-semibold text-neutral-900">
                      {{ offboardingTaskTranslation(task.task_key, "title") }}
                    </h3>
                  </div>
                  <p class="ml-7 mt-1 text-sm text-neutral-600">
                    {{ offboardingTaskTranslation(task.task_key, "description") }}
                  </p>

                  <div
                    v-if="task.task_key === 'return_equipment' && task.equipment_assignments.length"
                    class="ml-7 mt-3 space-y-2"
                  >
                    <div
                      v-for="assignment in task.equipment_assignments"
                      :key="assignment.id"
                      class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2"
                    >
                      <span class="text-sm text-neutral-700">
                        {{ assignment.name }}
                        <span v-if="assignment.serial_number" class="text-neutral-500">
                          · {{ assignment.serial_number }}
                        </span>
                      </span>
                      <button
                        type="button"
                        class="text-xs font-semibold text-primary-700 hover:text-primary-800 disabled:opacity-50"
                        :disabled="busyEquipmentId === assignment.id"
                        @click="returnEquipment(assignment)"
                      >
                        {{ t("admin.employees.offboarding.returnEquipment") }}
                      </button>
                    </div>
                  </div>
                  <p
                    v-else-if="task.task_key === 'return_equipment' && task.status === 'completed'"
                    class="ml-7 mt-2 text-xs text-green-700"
                  >
                    {{ t("admin.employees.offboarding.equipmentReturned") }}
                  </p>
                </div>

                <button
                  v-if="task.task_key !== 'revoke_access' || task.status === 'pending'"
                  type="button"
                  class="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  :class="task.status === 'completed'
                    ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    : 'border-primary-200 text-primary-700 hover:bg-primary-50'"
                  :disabled="busyTaskId === task.id || (task.task_key === 'return_equipment' && task.equipment_assignments.length > 0)"
                  @click="toggleTask(task)"
                >
                  {{ task.status === "completed"
                    ? t("admin.employees.offboarding.reopen")
                    : t("admin.employees.offboarding.complete") }}
                </button>
              </div>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "../i18n/index.js";
import { employeeOffboardingApiService } from "./employees/services/employeeOffboarding.api.service.js";
import { employeesApiService } from "./employees/services/employees.api.service.js";
import { equipmentAssignmentsApiService } from "./equipment/services/equipments.api.service.js";

const { t } = useI18n();
const tasks = ref([]);
const employees = ref([]);
const loading = ref(true);
const busyTaskId = ref(null);
const busyEquipmentId = ref(null);
const busyEmployeeId = ref(null);
const error = ref("");
const notice = ref("");

function offboardingTaskTranslation(taskKey, field) {
  return t(`admin.employees.offboarding.tasks.${taskKey}.${field}`);
}

const employeeGroups = computed(() => {
  const grouped = new Map();
  for (const task of tasks.value) {
    const employeeId = task.employee?.id;
    if (!employeeId) continue;
    if (!grouped.has(employeeId)) {
      grouped.set(employeeId, {
        employee: task.employee,
        tasks: [],
        exitDate: task.employee.termination?.exit_date
          || task.employee.retirement?.date
          || task.employee.terminated_at,
      });
    }
    grouped.get(employeeId).tasks.push(task);
  }
  return [...grouped.values()].map((group) => {
    const completedCount = group.tasks.filter((task) => task.status === "completed").length;
    return {
      ...group,
      completedCount,
      complete: completedCount === group.tasks.length,
      progress: group.tasks.length ? Math.round((completedCount / group.tasks.length) * 100) : 0,
    };
  });
});

const departuresWithoutChecklist = computed(() => {
  const startedIds = new Set(employeeGroups.value.map((group) => group.employee.id));
  return employees.value.filter((employee) => {
    const metadata = employee.metadata || {};
    const isDeparture = employee.status === "terminated"
      || employee.status === "retired"
      || metadata.employment_status === "retired";
    return isDeparture && !startedIds.has(employee.id);
  });
});

function messageFrom(exception, fallbackKey) {
  const response = exception?.response?.data;
  const validationMessage = response?.errors
    ? Object.values(response.errors).flat().find((message) => typeof message === "string")
    : null;
  return validationMessage || response?.message || t(fallbackKey);
}

async function loadTasks() {
  loading.value = true;
  error.value = "";
  try {
    const [taskList, employeeList] = await Promise.all([
      employeeOffboardingApiService.fetchTasks(),
      employeesApiService.fetchAll(),
    ]);
    tasks.value = taskList;
    employees.value = employeeList;
  } catch (exception) {
    error.value = messageFrom(exception, "admin.employees.offboarding.error.load");
  } finally {
    loading.value = false;
  }
}

async function startChecklist(employee) {
  busyEmployeeId.value = employee.id;
  error.value = "";
  try {
    await employeeOffboardingApiService.start(employee.id);
    await loadTasks();
  } catch (exception) {
    error.value = messageFrom(exception, "admin.employees.offboarding.error.start");
  } finally {
    busyEmployeeId.value = null;
  }
}

async function toggleTask(task) {
  busyTaskId.value = task.id;
  error.value = "";
  notice.value = "";
  try {
    tasks.value = await employeeOffboardingApiService.updateTask(
      task.employee_id,
      task.id,
      task.status === "completed" ? "pending" : "completed",
    );
    await loadTasks();
  } catch (exception) {
    error.value = messageFrom(exception, "admin.employees.offboarding.error.update");
  } finally {
    busyTaskId.value = null;
  }
}

async function returnEquipment(assignment) {
  busyEquipmentId.value = assignment.id;
  error.value = "";
  notice.value = "";
  try {
    await equipmentAssignmentsApiService.returnItem(assignment.id);
    notice.value = t("admin.employees.offboarding.returnSuccess");
    await loadTasks();
  } catch (exception) {
    error.value = messageFrom(exception, "admin.employees.offboarding.error.returnEquipment");
  } finally {
    busyEquipmentId.value = null;
  }
}

onMounted(loadTasks);
</script>
