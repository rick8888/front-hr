<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-semibold text-neutral-900">{{ pageTitle }}</h1>
      <nav
        class="text-sm text-neutral-500 flex items-center flex-wrap gap-1.5"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink
          to="/"
          class="hover:text-secondary-600 inline-flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10.5L12 4l9 6.5M5 10v9a1 1 0 001 1h3m10-10v9a1 1 0 01-1 1h-3m-6 0h6m-6 0v-5a1 1 0 011-1h4a1 1 0 011 1v5"
            />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span class="text-neutral-400">/</span>
        <span class="text-neutral-800 font-medium">{{ breadcrumb }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <EmployeeCategoryKpiGrid :stats="stats" :loading="loading" />

    <EmployeeCategoryFilters
      v-model:filters-open="filtersOpen"
      v-model:selected-status="selectedStatus"
      v-model:selected-role="selectedRole"
      v-model:selected-team="selectedTeam"
      v-model:selected-designation="selectedDesignation"
      v-model:selected-attendance-type="selectedAttendanceType"
      :status-options="statusFilterOptions"
      :role-options="roleOptions"
      :team-options="teamOptions"
      :designation-options="designationOptions"
      :attendance-type-options="attendanceTypeOptions"
      @reset="clearFilters"
    />

    <EmployeeCategoryTable
      :title="pageTitle"
      :employees="paginatedEmployees"
      :loading="loading"
      :status-label="statusLabel"
      :status-badge-class="statusBadgeClass"
      v-model:search-query="searchQuery"
      v-model:items-per-page="itemsPerPage"
      :current-page="currentPage"
      :total-pages="totalPages"
      :pagination-from="paginationFrom"
      :pagination-to="paginationTo"
      :total-entries="filteredEmployees.length"
      :page-numbers="pageNumbers"
      @page="goToPage"
      @view="viewEmployee"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch, toRef } from "vue";
import { useRouter } from "vue-router";
import EmployeeCategoryKpiGrid from "./components/EmployeeCategoryKpiGrid.vue";
import EmployeeCategoryFilters from "./components/EmployeeCategoryFilters.vue";
import EmployeeCategoryTable from "./components/EmployeeCategoryTable.vue";
import { useEmployeeCategoryPage } from "./composables/useEmployeeCategoryPage.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const {
  category: categoryConfig,
  teamOptions,
  designationOptions,
  roleOptions,
  attendanceTypeOptions,
  loading,
  error,
  filtersOpen,
  searchQuery,
  selectedStatus,
  selectedRole,
  selectedTeam,
  selectedDesignation,
  selectedAttendanceType,
  currentPage,
  itemsPerPage,
  stats,
  filteredEmployees,
  paginatedEmployees,
  totalPages,
  paginationFrom,
  paginationTo,
  pageNumbers,
  loadPageData,
  clearFilters,
  goToPage,
  viewEmployee,
} = useEmployeeCategoryPage(toRef(props, "category"));

const statusFilterOptions = ["active", "inactive", "terminated", "on-leave"];

const pageTitle = computed(() => {
  void locale.value;
  return categoryConfig.value?.titleKey
    ? t(categoryConfig.value.titleKey)
    : t("admin.employees.title");
});
const breadcrumb = computed(() => {
  void locale.value;
  return categoryConfig.value?.breadcrumbKey
    ? t(categoryConfig.value.breadcrumbKey)
    : pageTitle.value;
});
const statusLabel = computed(() => {
  void locale.value;
  return categoryConfig.value?.statusLabelKey
    ? t(categoryConfig.value.statusLabelKey)
    : t("admin.employees.status.active");
});
const statusBadgeClass = computed(
  () => categoryConfig.value?.statusBadgeClass ?? "badge-info"
);

watch(
  () => categoryConfig.value,
  (config) => {
    if (!config) {
      router.replace("/employees");
    }
  },
  { immediate: true }
);

onMounted(loadPageData);
</script>
