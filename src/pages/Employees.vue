<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.employees.title") }}</h1>
        <p class="text-sm text-neutral-600">{{ t("admin.employees.subtitle") }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="canViewEmployees"
          type="button"
          @click="exportEmployees"
          class="flex items-center gap-2 btn-outline"
          :disabled="exporting || loading"
        >
          <svg
            class="w-4 h-4"
            :class="{ 'animate-spin': exporting }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          {{ exporting ? t("admin.employees.exporting") : t("admin.employees.export") }}
        </button>
        <button
          v-if="canManageEmployees"
          type="button"
          @click="importEmployees"
          class="flex items-center gap-2 btn-outline"
          :disabled="importing || loading"
        >
          <svg
            class="w-4 h-4"
            :class="{ 'animate-spin': importing }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          {{ importing ? t("admin.employees.importing") : t("admin.employees.import") }}
        </button>
        <router-link
          v-if="canManageEmployees"
          to="/employees/new"
          class="flex items-center gap-2 btn-primary"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          {{ t("admin.employees.add") }}
        </router-link>
      </div>
    </div>

    <div
      v-if="displayError"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ displayError }}
    </div>
    <div
      v-else-if="statusSuccess || ioSuccess"
      class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ statusSuccess || ioSuccess }}
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
      <KpiCard
        v-for="kpi in kpiCards"
        :key="kpi.key"
        :title="kpi.label"
        :value="kpi.value"
        :subtitle="kpi.hint"
        :unit-label="t('admin.employees.unit')"
        :tone="kpi.tone"
        :loading="loading"
      >
        <template #icon>
          <component :is="kpi.icon" class="w-5 h-5" />
        </template>
      </KpiCard>
    </div>

    <!-- Bulk Actions Bar (shown when items selected) -->
    <div
      v-if="selectedEmployees.length > 0"
      class="flex items-center justify-between p-4 mb-6 border rounded-lg bg-primary-50 border-primary-200"
    >
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-primary-700"
          >{{ t("admin.employees.selected", { n: selectedEmployees.length }) }}</span
        >
        <button
          @click="clearSelection"
          class="text-sm underline text-primary-600 hover:text-primary-700"
        >
          {{ t("admin.employees.clearSelection") }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="canManageEmployees"
          @click="bulkSendEmail"
          class="text-sm btn-outline"
        >
          {{ t("admin.employees.sendEmail") }}
        </button>
        <button
          v-if="canManageEmployees"
          type="button"
          @click="bulkChangeStatus"
          class="text-sm btn-outline"
          :disabled="statusUpdating"
        >
          {{ t("admin.employees.changeStatus") }}
        </button>
        <button
          v-if="canViewEmployees"
          type="button"
          @click="bulkExport"
          class="text-sm btn-outline"
          :disabled="exporting"
        >
          {{ exporting ? t("admin.employees.exporting") : t("admin.employees.exportSelected") }}
        </button>
        <button
          v-if="canManageEmployees"
          @click="bulkDelete"
          class="text-sm btn-error"
          :disabled="deleting"
        >
          {{ t("admin.employees.deleteSelected") }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 card">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('admin.employees.searchPlaceholder')"
            class="pl-10 input-base"
          />
          <svg
            class="absolute w-4 h-4 left-3 top-3 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <select v-model="selectedDepartment" class="input-base">
          <option value="">{{ t("admin.employees.allDepartments") }}</option>
          <option v-for="dept in departmentOptions" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>
        <select v-model="selectedStatus" class="input-base">
          <option value="">{{ t("admin.employees.allStatus") }}</option>
          <option
            v-for="opt in employeeStatusOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <select v-model="selectedRole" class="input-base">
          <option value="">{{ t("admin.employees.allRoles") }}</option>
          <option
            v-for="role in roleFilterOptions"
            :key="role.value"
            :value="role.value"
          >
            {{ role.label }}
          </option>
        </select>
        <button @click="clearFilters" class="btn-outline">{{ t("admin.employees.clearFilters") }}</button>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  @change="selectAllEmployees"
                  :checked="
                    selectedEmployees.length === filteredEmployees.length &&
                    filteredEmployees.length > 0
                  "
                  class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                {{ t("admin.employees.col.employee") }}
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                {{ t("admin.employees.col.contact") }}
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                {{ t("admin.employees.col.department") }}
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                {{ t("admin.employees.col.role") }}
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                {{ t("admin.employees.col.status") }}
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                {{ t("admin.employees.col.joinDate") }}
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-right text-neutral-600"
              >
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-12 text-center text-sm text-neutral-500">
                {{ t("common.loading") }}
              </td>
            </tr>
            <tr v-else-if="!paginatedEmployees.length">
              <td colspan="8" class="px-6 py-12 text-center text-sm text-neutral-500">
                {{ t("admin.employees.noResults") }}
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="employee in paginatedEmployees"
                :key="employee.id"
                class="transition-colors border-b border-neutral-100 hover:bg-neutral-50"
              >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :checked="selectedEmployees.includes(employee.id)"
                  @change="toggleEmployeeSelection(employee.id)"
                  class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-primary-200 text-primary-700"
                  >
                    {{ getInitials(employee.name) }}
                  </div>
                  <div>
                    <div class="font-medium text-neutral-900">
                      {{ employee.name }}
                    </div>
                    <div class="text-sm text-neutral-500">
                      ID: {{ employee.id.toString().padStart(3, "0") }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <div class="text-neutral-900">{{ employee.email }}</div>
                  <div class="text-neutral-500">
                    {{ employee.phone || t("admin.employees.noPhone") }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ employee.department }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ employeeRoleLabel(employee) }}
              </td>
              <td class="px-6 py-4">
                <span :class="['badge', getStatusBadgeClass(employee.status)]">
                  {{ getStatusLabel(employee.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ employee.joinDate || t("common.notApplicable") }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="viewEmployee(employee)"
                    class="p-1 transition-colors text-neutral-400 hover:text-neutral-600"
                    :title="t('admin.employees.viewDetails')"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-neutral-600">{{ t("admin.employees.rowsPerPage") }}</span>
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="px-2 py-1 text-sm border rounded border-neutral-300"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <p class="text-sm text-neutral-600">
            {{ t("admin.employees.showingRange", {
              from: (currentPage - 1) * itemsPerPage + 1,
              to: Math.min(currentPage * itemsPerPage, filteredEmployees.length),
              total: filteredEmployees.length,
            }) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t("common.previous") }}
          </button>
          <span class="px-3 py-1 text-sm text-neutral-600">
            {{ t("admin.employees.pageOf", { page: currentPage, total: totalPages }) }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t("common.next") }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('admin.employees.deleteTitle')"
      :message="deleteMessage"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      :loading-text="t('common.deleting')"
      variant="danger"
      :busy="deleting"
      :close-on-backdrop="!deleting"
      @confirm="confirmBulkDelete"
      @cancel="cancelBulkDelete"
    />

    <EmployeeBulkStatusModal
      v-model="statusModalOpen"
      :selected-count="selectedEmployees.length"
      :busy="statusUpdating"
      :initial-status="bulkStatusTarget"
      @confirm="confirmBulkStatus"
    />
  </div>
</template>

<script setup>
import { computed, h, onMounted } from "vue";
import ConfirmDialog from "../components/common/ConfirmDialog.vue";
import KpiCard from "../components/common/KpiCard.vue";
import EmployeeBulkStatusModal from "./employees/components/EmployeeBulkStatusModal.vue";
import { useEmployees } from "./employees/composables/useEmployees.js";
import { useI18n } from "../i18n/index.js";
import { useAuthStore } from "../stores/authStore.js";

const { t, locale } = useI18n();
const authStore = useAuthStore();
const canViewEmployees = computed(() =>
  authStore.can("employees.view", "employees.manage")
);
const canManageEmployees = computed(() => authStore.can("employees.manage"));

const {
  departmentOptions,
  roleFilterOptions,
  employeeRoleLabel,
  loading,
  deleting,
  exporting,
  importing,
  error,
  ioError,
  ioSuccess,
  statusSuccess,
  searchQuery,
  selectedDepartment,
  selectedStatus,
  selectedRole,
  selectedEmployees,
  currentPage,
  itemsPerPage,
  deleteOpen,
  deleteMessage,
  statusModalOpen,
  statusUpdating,
  bulkStatusTarget,
  employeeStats,
  filteredEmployees,
  totalPages,
  paginatedEmployees,
  loadEmployees,
  getInitials,
  getStatusBadgeClass,
  getStatusLabel,
  employeeStatusOptions,
  selectAllEmployees,
  toggleEmployeeSelection,
  clearSelection,
  clearFilters,
  viewEmployee,
  bulkSendEmail,
  bulkChangeStatus,
  confirmBulkStatus,
  bulkExport,
  exportEmployees,
  importEmployees,
  requestBulkDelete,
  confirmBulkDelete,
  cancelBulkDelete,
} = useEmployees();

const displayError = computed(() => error.value || ioError.value || "");

const bulkDelete = requestBulkDelete;

onMounted(loadEmployees);

// === KPI Cards (en-tête) ====================================================
const IconUser = () =>
  h(
    "svg",
    { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      }),
    ]
  );
const IconUserCheck = () =>
  h(
    "svg",
    { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M9 12l2 2 4-4m5.5 2a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z",
      }),
    ]
  );
const IconUserMinus = () =>
  h(
    "svg",
    { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ]
  );
const IconUserX = () =>
  h(
    "svg",
    { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M15 9l-6 6m0-6l6 6m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ]
  );

const employeeStatsComputed = employeeStats;

const kpiCards = computed(() => {
  void locale.value;
  return [
  {
    key: "total",
    label: t("admin.employees.kpi.total"),
    value: employeeStatsComputed.value.total,
    hint: t("admin.employees.kpi.all"),
    icon: IconUser,
    tone: "violet",
  },
  {
    key: "active",
    label: t("admin.employees.kpi.active"),
    value: employeeStatsComputed.value.active,
    hint: t("admin.employees.kpi.activeHint"),
    icon: IconUserCheck,
    tone: "green",
  },
  {
    key: "inactive",
    label: t("admin.employees.kpi.inactive"),
    value: employeeStatsComputed.value.inactive,
    hint: t("admin.employees.kpi.inactiveHint"),
    icon: IconUserMinus,
    tone: "neutral",
  },
  {
    key: "exited",
    label: t("admin.employees.kpi.exited"),
    value: employeeStatsComputed.value.exited,
    hint: t("admin.employees.kpi.exitedHint"),
    icon: IconUserX,
    tone: "red",
  },
];
});

</script>

<style scoped>
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-success-50 text-success-700;
}

.badge-warning {
  @apply bg-warning-50 text-warning-700;
}

.badge-info {
  @apply bg-info-50 text-info-700;
}

.badge-neutral {
  @apply bg-neutral-100 text-neutral-800;
}

.btn-error {
  @apply bg-error-600 hover:bg-error-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}
</style>
