<template>
  <Modal
    :model-value="open"
    size="xl"
    hide-footer
    :title="t('admin.employees.documentTemplates.previewTitle', { name: template?.name || '' })"
    @update:model-value="$emit('update:open', $event)"
  >
    <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
      {{ t("common.loading") }}
    </div>
    <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>
    <div v-else-if="emailPreview" class="space-y-3">
      <p class="text-sm text-neutral-600">
        <span class="font-medium text-neutral-800">{{ t("admin.employees.documentTemplates.col.subject") }}:</span>
        {{ emailPreview.subject }}
      </p>
      <iframe
        :title="emailPreview.subject"
        class="h-[420px] w-full rounded-lg border border-neutral-200 bg-white"
        sandbox=""
        :srcdoc="emailPreview.bodyHtml"
      />
    </div>
    <p v-else class="text-sm text-neutral-600">
      {{ t("admin.employees.documentTemplates.previewPdfDownloaded") }}
    </p>
    <template #footer>
      <button type="button" class="btn-secondary" @click="$emit('update:open', false)">
        {{ t("common.close") }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { documentTemplatesApiService } from "../../../employees/services/documentTemplates.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";
import { useI18n } from "../../../../i18n/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  template: { type: Object, default: null },
});

defineEmits(["update:open"]);

const { t } = useI18n();
const loading = ref(false);
const error = ref("");
const emailPreview = ref(null);

watch(
  () => [props.open, props.template?.id],
  async () => {
    emailPreview.value = null;
    error.value = "";
    if (!props.open || !props.template?.id) return;

    loading.value = true;
    try {
      const result = await documentTemplatesApiService.previewTemplate(props.template.id);
      if (result.type === "email") {
        emailPreview.value = result;
      }
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.documentTemplates.previewError");
    } finally {
      loading.value = false;
    }
  },
);
</script>
