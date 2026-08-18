<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <FilterField id="my-payslips-period" :label="t('payslips.filter.period')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.period"
            :class="inputClass"
            @change="patch('period', $event.target.value)"
          >
            <option value="">{{ t("payslips.filter.allPeriods") }}</option>
            <option v-for="p in periodOptions" :key="p.value" :value="p.value">
              {{ p.label }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-payslips-status" :label="t('payslips.filter.status')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.status"
            :class="inputClass"
            @change="patch('status', $event.target.value)"
          >
            <option value="">{{ t("payslips.filter.allStatuses") }}</option>
            <option
              v-for="s in statusOptions"
              :key="s.value || s"
              :value="s.value || s"
            >
              {{ s.label || s }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-payslips-from" :label="t('payslips.filter.from')">
        <template #default="{ id }">
          <input
            :id="id"
            :value="modelValue.dateFrom"
            type="date"
            :max="modelValue.dateTo || undefined"
            :class="inputClass"
            @input="patch('dateFrom', $event.target.value)"
          />
        </template>
      </FilterField>

      <FilterField id="my-payslips-to" :label="t('payslips.filter.to')">
        <template #default="{ id }">
          <input
            :id="id"
            :value="modelValue.dateTo"
            type="date"
            :min="modelValue.dateFrom || undefined"
            :class="inputClass"
            @input="patch('dateTo', $event.target.value)"
          />
        </template>
      </FilterField>
    </div>
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ period: "", status: "", dateFrom: "", dateTo: "" }),
  },
  periodOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
