<template>
  <section
    class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs space-y-4"
  >
    <h2 class="text-base font-semibold text-neutral-800">{{ t("common.filters") }}</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
      <FilterField id="emp-doc-employee" :label="t('admin.leave.filterEmployee')">
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

      <FilterField id="emp-doc-category" :label="t('admin.leave.documents.filterCategory')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.category"
            :disabled="loading"
            :class="inputClass"
            @change="patch('category', $event.target.value)"
          >
            <option value="">{{ t("admin.leave.documents.allCategories") }}</option>
            <option
              v-for="c in categoryOptions"
              :key="c.value || c"
              :value="c.value || c"
            >
              {{ c.label || c }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="emp-doc-status" :label="t('admin.leave.filterStatus')">
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

      <FilterField id="emp-doc-expiry" :label="t('admin.leave.documents.filterExpiry')">
        <template #default="{ id }">
          <select
            :id="id"
            :value="modelValue.expiry"
            :disabled="loading"
            :class="inputClass"
            @change="patch('expiry', $event.target.value)"
          >
            <option value="">{{ t("admin.leave.documents.allDocuments") }}</option>
            <option
              v-for="opt in expiryOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
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
  categoryOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  expiryOptions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-400";

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
