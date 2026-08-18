<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FilterField id="my-documents-category" :label="t('common.category')">
        <template #default="{ id }">
          <select :id="id" :value="modelValue.category" :disabled="loading" :class="inputClass" @change="patch('category', $event.target.value)">
            <option value="">{{ t("common.selectOption") }}</option>
            <option v-for="c in categoryOptions" :key="c.value || c" :value="c.value || c">{{ c.label || c }}</option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-documents-status" :label="t('ss.filters.verificationStatus')">
        <template #default="{ id }">
          <select :id="id" :value="modelValue.status" :disabled="loading" :class="inputClass" @change="patch('status', $event.target.value)">
            <option value="">{{ t("ss.filters.allStatuses") }}</option>
            <option v-for="s in statusOptions" :key="s.value || s" :value="s.value || s">{{ s.label || s }}</option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-documents-expiry" :label="t('ss.filters.expiryStatus')">
        <template #default="{ id }">
          <select :id="id" :value="modelValue.expiry" :disabled="loading" :class="inputClass" @change="patch('expiry', $event.target.value)">
            <option value="">{{ t("ss.filters.allDocuments") }}</option>
            <option v-for="opt in expiryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </template>
      </FilterField>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:opacity-50" :disabled="loading" @click="$emit('apply')">
        {{ loading ? t("common.loading") : t("ss.filters.apply") }}
      </button>
      <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-50" :disabled="loading" @click="$emit('reset')">
        {{ t("ss.filters.reset") }}
      </button>
    </div>
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Object, default: () => ({ category: "", status: "", expiry: "" }) },
  categoryOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  expiryOptions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "apply", "reset"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-60";

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
