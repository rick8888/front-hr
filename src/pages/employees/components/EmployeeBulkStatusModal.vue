<template>
  <Modal
    :model-value="modelValue"
    :title="t('admin.employees.bulkStatusTitle')"
    size="sm"
    hide-footer
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="text-sm text-neutral-600 mb-4">
      {{ t("admin.employees.bulkStatusHint", { n: selectedCount }) }}
    </p>

    <label class="block text-sm font-medium text-neutral-700 mb-1">
      {{ t("admin.employees.col.status") }}
    </label>
    <select
      v-model="localStatus"
      class="input-base w-full"
      :disabled="busy"
    >
      <option value="active">{{ t("admin.employees.status.active") }}</option>
      <option value="inactive">{{ t("admin.employees.status.inactive") }}</option>
    </select>

    <p class="mt-3 text-xs text-neutral-500">
      {{ t("admin.employees.bulkStatusNote") }}
    </p>

    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200">
      <button
        type="button"
        class="btn-outline"
        :disabled="busy"
        @click="$emit('update:modelValue', false)"
      >
        {{ t("common.cancel") }}
      </button>
      <button
        type="button"
        class="btn-primary"
        :disabled="busy || !localStatus"
        @click="$emit('confirm', localStatus)"
      >
        {{ busy ? t("common.saving") : t("admin.employees.bulkStatusApply") }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from "vue";
import Modal from "../../../components/common/Modal.vue";
import { useI18n } from "../../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  selectedCount: { type: Number, default: 0 },
  busy: { type: Boolean, default: false },
  initialStatus: { type: String, default: "active" },
});

defineEmits(["update:modelValue", "confirm"]);

const { t } = useI18n();
const localStatus = ref(props.initialStatus || "active");

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      localStatus.value = props.initialStatus || "active";
    }
  }
);
</script>
