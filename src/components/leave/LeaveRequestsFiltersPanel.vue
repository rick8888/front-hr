<template>
  <section
    class="bg-white rounded-lg border border-neutral-200 shadow-sm p-5 md:p-6 mb-6"
  >
    <h2 class="text-base font-semibold text-neutral-800 mb-4">{{ t("admin.leave.filters") }}</h2>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5"
    >
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-neutral-500">{{
          t("admin.leave.filterEmployee")
        }}</label>
        <select
          :value="modelValue.employeeCode"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
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
      </div>
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-neutral-500">{{
          t("admin.leave.filterDate")
        }}</label>
        <input
          :value="modelValue.date"
          type="date"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
          @input="patch('date', $event.target.value)"
        />
      </div>
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-neutral-500">{{
          t("admin.leave.filterType")
        }}</label>
        <select
          :value="modelValue.leaveType"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
          @change="patch('leaveType', $event.target.value)"
        >
          <option value="">{{ t("common.selectOption") }}</option>
          <option v-for="opt in leaveTypeOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-neutral-500">{{
          t("admin.leave.filterStatus")
        }}</label>
        <select
          :value="modelValue.status"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
          @change="patch('status', $event.target.value)"
        >
          <option value="">{{ t("common.selectOption") }}</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  employeeOptions: { type: Array, default: () => [] },
  leaveTypeOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
