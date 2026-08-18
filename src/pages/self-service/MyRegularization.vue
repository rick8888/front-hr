<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero
      :title="t('ss.regularization.title')"
      :breadcrumbs="breadcrumbs"
    />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <SimpleListingCard
      :title="t('ss.regularization.listTitle')"
      :action-label="t('ss.requestNew')"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      @action="onNewRequest"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
    >
      <RegularizationTable
        :rows="paginatedRows"
        :loading="loading"
        @edit="onEditRow"
        @delete="onDeleteRow"
      />
    </SimpleListingCard>

    <RegularizationRequestModal
      v-model="modalOpen"
      :initial="editingRecord"
      :saving="saving"
      :save-error="modalError"
      :type-options="typeOptions"
      @submit="onSubmitRequest"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('ss.deleteConfirm')"
      :message="deleteMessage"
      variant="danger"
      :confirm-text="t('common.delete')"
      :loading-text="t('common.deleting')"
      :busy="deleteBusy"
      @confirm="confirmDelete"
    />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import RegularizationTable from "../../components/self-service/RegularizationTable.vue";
import RegularizationRequestModal from "../../components/self-service/RegularizationRequestModal.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import { useMyRegularization } from "./composables/useMyRegularization.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.regularization.breadcrumb") },
  ];
});

const {
  loading,
  saving,
  deleteBusy,
  error,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  typeOptions,
  save,
  remove,
} = useMyRegularization();

const modalOpen = ref(false);
const editingRecord = ref(null);
const modalError = ref("");

const deleteOpen = ref(false);
const recordToDelete = ref(null);
const deleteMessage = computed(() => {
  const r = recordToDelete.value;
  if (!r) return "This action cannot be undone.";
  return `${r.type} on ${r.date} will be removed. This action cannot be undone.`;
});

function onNewRequest() {
  editingRecord.value = null;
  modalError.value = "";
  modalOpen.value = true;
}

function onEditRow(row) {
  editingRecord.value = { ...row };
  modalError.value = "";
  modalOpen.value = true;
}

function onDeleteRow(row) {
  recordToDelete.value = row;
  deleteOpen.value = true;
}

async function confirmDelete() {
  if (!recordToDelete.value || deleteBusy.value) return;
  const ok = await remove(recordToDelete.value);
  if (ok) {
    recordToDelete.value = null;
    deleteOpen.value = false;
  }
}

async function onSubmitRequest(payload) {
  modalError.value = "";
  const ok = await save(payload);
  if (ok) {
    modalOpen.value = false;
    editingRecord.value = null;
  } else {
    modalError.value = error.value;
  }
}
</script>
