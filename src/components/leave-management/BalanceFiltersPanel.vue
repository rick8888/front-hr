<template>
  <section
    class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs"
  >
    <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end md:gap-5">
      <FilterField id="balance-employee" :label="t('common.employee')">
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

      <FilterField id="balance-team" :label="t('admin.leave.balances.filterTeam')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.team"
            class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            @change="patch('team', $event.target.value)"
          >
            <option value="">{{ t("common.selectOption") }}</option>
            <option v-for="tOpt in teamOptions" :key="tOpt" :value="tOpt">{{ tOpt }}</option>
          </select>
        </template>
      </FilterField>

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
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Object, required: true },
  employeeOptions: { type: Array, default: () => [] },
  teamOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "reset"]);

const { t } = useI18n();

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
