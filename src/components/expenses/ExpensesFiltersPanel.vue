<template>
  <section
    class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs space-y-4"
  >
    <h2 class="text-base font-semibold text-neutral-800">{{ t("common.filters") }}</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
      <FilterField id="expense-employee" :label="t('admin.leave.filterEmployee')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.employeeCode"
            :disabled="loading"
            :class="inputClass"
            @change="patch('employeeCode', $event.target.value)"
          >
            <option value="">{{ t("admin.leave.allEmployees") }}</option>
            <option
              v-for="opt in employeeOptions"
              :key="opt.code"
              :value="opt.code"
            >
              {{ opt.name }} ({{ opt.code }})
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="expense-type" :label="t('admin.leave.expenses.filterType')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.type"
            :disabled="loading"
            :class="inputClass"
            @change="patch('type', $event.target.value)"
          >
            <option value="">{{ t("admin.leave.expenses.allTypes") }}</option>
            <option
              v-for="opt in typeOptions"
              :key="opt.value || opt"
              :value="opt.value || opt"
            >
              {{ opt.label || opt }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="expense-status" :label="t('admin.leave.filterStatus')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.status"
            :disabled="loading"
            :class="inputClass"
            @change="patch('status', $event.target.value)"
          >
            <option value="">{{ t("admin.leave.allStatuses") }}</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </template>
      </FilterField>

      <FilterField id="expense-date" :label="t('admin.leave.filterDate')">
        <template #default="{ id }">
          <input
            :id="id"
            :value="modelValue.date"
            type="date"
            :disabled="loading"
            :class="inputClass"
            @input="patch('date', $event.target.value)"
          />
        </template>
      </FilterField>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:opacity-50"
        :disabled="loading"
        @click="$emit('apply')"
      >
        <span
          v-if="loading"
          class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {{ loading ? t("common.loading") : t("common.applyFilters") }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-50"
        :disabled="loading"
        @click="$emit('reset')"
      >
        {{ t("common.reset") }}
      </button>
    </div>
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: Object, required: true },
  employeeOptions: { type: Array, default: () => [] },
  typeOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400";

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
