<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xs">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,1fr))_auto] xl:items-end">
      <FilterField id="my-doc-requests-type" :label="t('ss.documentRequests.col.type')">
        <template #default="{ id }">
          <select :id="id" :value="modelValue.type" :class="inputClass" @change="patch('type', $event.target.value)">
            <option value="">{{ t("common.selectOption") }}</option>
            <option v-for="typeOpt in typeOptions" :key="optionValue(typeOpt)" :value="optionValue(typeOpt)">
              {{ optionLabel(typeOpt) }}
            </option>
          </select>
        </template>
      </FilterField>

      <FilterField id="my-doc-requests-status" :label="t('ss.filters.status')">
        <template #default="{ id }">
          <select :id="id" :value="modelValue.status" :class="inputClass" @change="patch('status', $event.target.value)">
            <option value="">{{ t("ss.filters.allStatuses") }}</option>
            <option v-for="s in statusOptions" :key="optionValue(s)" :value="optionValue(s)">{{ optionLabel(s) }}</option>
          </select>
        </template>
      </FilterField>

      <button type="button" class="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50" @click="onReset">
        {{ t("ss.filters.resetFilters") }}
      </button>
    </div>
  </section>
</template>

<script setup>
import FilterField from "../common/FilterField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Object, default: () => ({ type: "", status: "" }) },
  typeOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "reset"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

function patch(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

function onReset() {
  emit("update:modelValue", { type: "", status: "" });
  emit("reset");
}
</script>
