<template>
  <section class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs">
    <h2 class="mb-4 text-base font-semibold text-neutral-800">{{ t("common.filters") }}</h2>
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <FilterField id="tc-designation" :label="t('admin.leave.calendar.filterDesignation')">
          <template #default="{ id }">
            <select
              :id="id"
              :value="draft.designation"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @change="patch('designation', $event.target.value)"
            >
              <option v-for="opt in designationOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </template>
        </FilterField>

        <FilterField id="tc-leave-type" :label="t('admin.leave.calendar.filterType')">
          <template #default="{ id }">
            <select
              :id="id"
              :value="draft.leaveType"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @change="patch('leaveType', $event.target.value)"
            >
              <option v-for="opt in leaveTypeOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </template>
        </FilterField>

        <FilterField id="tc-status" :label="t('admin.leave.calendar.filterStatus')">
          <template #default="{ id }">
            <select
              :id="id"
              :value="draft.status"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @change="patch('status', $event.target.value)"
            >
              <option v-for="opt in statusOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </template>
        </FilterField>
      </div>

      <div class="flex shrink-0 flex-wrap items-center gap-3 lg:pb-0.5">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          @click="$emit('apply')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {{ t("common.applyFilters") }}
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50"
          @click="$emit('reset')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0A8.003 8.003 0 014.582 15m15.836 0H15"
            />
          </svg>
          {{ t("common.resetFilters") }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  draft: { type: Object, required: true },
  designationOptions: { type: Array, default: () => [] },
  leaveTypeOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["apply", "reset", "update:draft"]);

const { t } = useI18n();

function patch(key, value) {
  emit("update:draft", { ...props.draft, [key]: value });
}
</script>
