<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FilterField id="leave-status" :label="t('ss.filters.status')">
        <select
          id="leave-status"
          :value="filters.status"
          :disabled="loading"
          :class="selectClass"
          @change="update('status', $event.target.value)"
        >
          <option value="">{{ t("ss.filters.allStatus") }}</option>
          <option v-for="s in statuses" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
      </FilterField>

      <FilterField id="leave-type" :label="t('ss.filters.leaveType')">
        <select
          id="leave-type"
          :value="filters.leaveType"
          :disabled="loading"
          :class="selectClass"
          @change="update('leaveType', $event.target.value)"
        >
          <option value="">{{ t("ss.filters.allTypes") }}</option>
          <option v-for="typeItem in leaveTypes" :key="typeItem.code" :value="typeItem.code">
            {{ typeItem.name }}
          </option>
        </select>
      </FilterField>

      <FilterField id="leave-from" :label="t('ss.filters.dateFrom')">
        <input
          id="leave-from"
          type="date"
          :value="filters.dateFrom"
          :max="filters.dateTo || undefined"
          :disabled="loading"
          :class="inputClass"
          @input="update('dateFrom', $event.target.value)"
        />
      </FilterField>

      <FilterField id="leave-to" :label="t('ss.filters.dateTo')">
        <input
          id="leave-to"
          type="date"
          :value="filters.dateTo"
          :min="filters.dateFrom || undefined"
          :disabled="loading"
          :class="inputClass"
          @input="update('dateTo', $event.target.value)"
        />
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
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {{ t("ss.filters.reset") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  filters: { type: Object, required: true },
  statuses: { type: Array, default: () => [] },
  leaveTypes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:filters", "apply", "reset"]);
const { t } = useI18n();

const selectClass =
  "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400";
const inputClass =
  "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400";

function update(key, value) {
  emit("update:filters", { ...props.filters, [key]: value });
}
</script>
