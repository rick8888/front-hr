<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FilterField id="my-comp-off-status" :label="t('ss.filters.status')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.status"
            :disabled="loading"
            :class="inputClass"
            @change="patch('status', $event.target.value)"
          >
            <option value="">{{ t("ss.filters.allStatus") }}</option>
            <option v-for="s in statusOptions" :key="s.value || s" :value="s.value || s">
              {{ s.label || s }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-comp-off-from" :label="t('ss.filters.dateFrom')">
        <template #default="{ id }">
          <input
            :id="id"
            :value="modelValue.dateFrom"
            type="date"
            :max="modelValue.dateTo || undefined"
            :disabled="loading"
            :class="inputClass"
            @input="patch('dateFrom', $event.target.value)"
          />
        </template>
      </FilterField>

      <FilterField id="my-comp-off-to" :label="t('ss.filters.dateTo')">
        <template #default="{ id }">
          <input
            :id="id"
            :value="modelValue.dateTo"
            type="date"
            :min="modelValue.dateFrom || undefined"
            :disabled="loading"
            :class="inputClass"
            @input="patch('dateTo', $event.target.value)"
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
  </div>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ status: "", dateFrom: "", dateTo: "" }),
  },
  statusOptions: {
    type: Array,
    default: () => [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
  },
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
