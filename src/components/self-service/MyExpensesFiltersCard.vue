<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FilterField id="my-expenses-date" :label="t('ss.filters.byDate')">
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

      <FilterField id="my-expenses-type" :label="t('ss.filters.byExpenseType')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.type"
            :disabled="loading"
            :class="inputClass"
            @change="patch('type', $event.target.value)"
          >
            <option value="">{{ t("ss.filters.allExpenseTypes") }}</option>
            <option
              v-for="typeOpt in typeOptions"
              :key="typeOpt.value || typeOpt"
              :value="typeOpt.value || typeOpt"
            >
              {{ typeOpt.label || typeOpt }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-expenses-status" :label="t('ss.filters.byStatus')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.status"
            :disabled="loading"
            :class="inputClass"
            @change="patch('status', $event.target.value)"
          >
            <option value="">{{ t("ss.filters.allStatuses") }}</option>
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
        {{ loading ? t("common.loading") : t("ss.filters.apply") }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-50"
        :disabled="loading"
        @click="$emit('reset')"
      >
        {{ t("ss.filters.reset") }}
      </button>
    </div>
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ date: "", type: "", status: "" }),
  },
  typeOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400";

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
