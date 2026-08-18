<template>
  <section class="mb-6 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      @click="filtersOpen = !filtersOpen"
    >
      <span class="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800">
        <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        {{ t("common.filters") }}
      </span>
      <svg
        class="w-4 h-4 text-neutral-500 transition-transform duration-200"
        :class="filtersOpen ? 'rotate-180' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-show="filtersOpen" class="px-5 pb-5 border-t border-neutral-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
        <FilterSelect
          :label="t('common.status')"
          :model-value="selectedStatus"
          :placeholder="t('admin.employees.allStatus')"
          :options="statusOptions"
          @update:model-value="$emit('update:selectedStatus', $event)"
        />
        <FilterSelect
          :label="t('admin.employees.col.role')"
          :model-value="selectedRole"
          :placeholder="t('admin.employees.allRoles')"
          :options="roleOptions"
          @update:model-value="$emit('update:selectedRole', $event)"
        />
        <FilterSelect
          :label="t('admin.employees.cat.col.team')"
          :model-value="selectedTeam"
          :placeholder="t('admin.employees.cat.allTeams')"
          :options="teamOptions"
          @update:model-value="$emit('update:selectedTeam', $event)"
        />
        <FilterSelect
          :label="t('admin.employees.cat.designation')"
          :model-value="selectedDesignation"
          :placeholder="t('admin.employees.cat.allDesignations')"
          :options="designationOptions"
          @update:model-value="$emit('update:selectedDesignation', $event)"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        <FilterSelect
          :label="t('admin.employees.cat.col.attendanceType')"
          :model-value="selectedAttendanceType"
          :placeholder="t('admin.employees.cat.allTypes')"
          :options="attendanceTypeOptions"
          @update:model-value="$emit('update:selectedAttendanceType', $event)"
        />
        <div class="flex items-end">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            @click="$emit('reset')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ t("common.resetFilters") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import FilterSelect from "./EmployeeCategoryFilterSelect.vue";
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

defineProps({
  selectedStatus: { type: String, default: "" },
  selectedRole: { type: String, default: "" },
  selectedTeam: { type: String, default: "" },
  selectedDesignation: { type: String, default: "" },
  selectedAttendanceType: { type: String, default: "" },
  statusOptions: { type: Array, default: () => [] },
  roleOptions: { type: Array, default: () => [] },
  teamOptions: { type: Array, default: () => [] },
  designationOptions: { type: Array, default: () => [] },
  attendanceTypeOptions: { type: Array, default: () => [] },
});

defineEmits([
  "update:selectedStatus",
  "update:selectedRole",
  "update:selectedTeam",
  "update:selectedDesignation",
  "update:selectedAttendanceType",
  "reset",
]);

const filtersOpen = defineModel("filtersOpen", { type: Boolean, default: true });
</script>
