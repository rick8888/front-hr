<template>
  <section
    class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs"
  >
    <h2 class="mb-4 text-base font-semibold text-neutral-800">{{ t("common.filters") }}</h2>
    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5"
    >
      <FilterField id="comp-off-employee" :label="t('admin.leave.filterEmployee')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.employeeCode"
            class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            @change="patch('employeeCode', $event.target.value)"
          >
            <option value="">{{ t("common.selectOption") }}</option>
            <option v-for="opt in employeeOptions" :key="opt.code" :value="opt.code">
              {{ opt.name }} ({{ opt.code }})
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="comp-off-status" :label="t('admin.leave.filterStatus')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.status"
            class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            @change="patch('status', $event.target.value)"
          >
            <option value="">{{ t("common.selectOption") }}</option>
            <option v-for="s in statusOptions" :key="optionValue(s)" :value="optionValue(s)">
              {{ optionLabel(s) }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="comp-off-usage" :label="t('admin.leave.compOff.filterUsage')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.usageStatus"
            class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            @change="patch('usageStatus', $event.target.value)"
          >
            <option value="">{{ t("common.selectOption") }}</option>
            <option v-for="s in usageStatusOptions" :key="optionValue(s)" :value="optionValue(s)">
              {{ optionLabel(s) }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="comp-off-date-range" :label="t('admin.leave.compOff.filterDateRange')">
        <template #default="{ id }">
          <div class="grid grid-cols-2 gap-2">
            <input
              :id="id + '-from'"
              :value="modelValue.workedFrom"
              type="date"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              :max="modelValue.workedTo || undefined"
              :placeholder="$attrs['from-placeholder'] || 'From'"
              @input="patch('workedFrom', $event.target.value)"
            />
            <input
              :id="id + '-to'"
              :value="modelValue.workedTo"
              type="date"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              :min="modelValue.workedFrom || undefined"
              @input="patch('workedTo', $event.target.value)"
            />
          </div>
        </template>
      </FilterField>
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
  statusOptions: {
    type: Array,
    default: () => [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
  },
  usageStatusOptions: {
    type: Array,
    default: () => [
      { value: "available", label: "Available" },
      { value: "used", label: "Used" },
      { value: "expired", label: "Expired" },
    ],
  },
});

const emit = defineEmits(["update:modelValue"]);

function optionValue(opt) {
  return typeof opt === "object" && opt !== null ? opt.value : opt;
}

function optionLabel(opt) {
  return typeof opt === "object" && opt !== null ? opt.label : opt;
}

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
