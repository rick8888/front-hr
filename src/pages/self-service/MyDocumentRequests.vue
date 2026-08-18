<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('ss.documentRequests.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Info banner -->
    <div
      class="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-sky-700"
      role="note"
    >
      <svg class="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>{{ t("ss.documentRequests.banner") }}</p>
    </div>

    <!-- Filters -->
    <MyDocumentRequestsFiltersCard
      v-model="filtersModel"
      :type-options="typeOptions"
      :status-options="statusOptions"
    />

    <!-- Listing -->
    <SimpleListingCard
      :action-label="t('ss.requestNew')"
      searchable
      :search-query="searchQuery"
      :search-placeholder="t('ss.documentRequests.searchPlaceholder')"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :page-size-options="[10, 25, 50, 100]"
      @action="onNewRequest"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <MyDocumentRequestsTable
        :rows="paginatedRows"
        :loading="loading"
        @view="onViewRow"
        @cancel="onCancelRow"
      />
    </SimpleListingCard>

    <RequestDocumentModal
      v-model="modalOpen"
      :type-options="typeOptions"
      :today="today"
      :busy="saving"
      @submit="onSubmitRequest"
    />

    <ConfirmDialog
      v-model="cancelOpen"
      :title="t('ss.cancelConfirm')"
      :message="cancelMessage"
      variant="danger"
      :confirm-text="t('ss.cancelRequest')"
      :loading-text="t('ss.cancelling')"
      :busy="saving"
      @confirm="confirmCancel"
    />

    <ConfirmDialog
      v-model="viewOpen"
      :title="t('ss.documentRequests.requestDetails')"
      :message="viewMessage"
      variant="info"
      :confirm-text="t('ss.close')"
      :cancel-text="t('ss.back')"
      @confirm="viewOpen = false"
      @cancel="viewOpen = false"
    />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import MyDocumentRequestsFiltersCard from "../../components/self-service/MyDocumentRequestsFiltersCard.vue";
import MyDocumentRequestsTable from "../../components/self-service/MyDocumentRequestsTable.vue";
import RequestDocumentModal from "../../components/self-service/RequestDocumentModal.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import { useMyDocumentRequests } from "./composables/useMyDocumentRequests.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.documentRequests.title") },
  ];
});

const {
  today,
  loading,
  saving,
  error,
  filters,
  typeOptions,
  statusOptions,
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  onFiltersChange,
  applyFilters,
  createRequest,
  cancelRequest,
} = useMyDocumentRequests();

const filtersModel = computed({
  get: () => ({ ...filters }),
  set: (next) => onFiltersChange(next),
});

watch(
  () => [filters.type, filters.status],
  () => {
    applyFilters();
  }
);

const modalOpen = ref(false);
function onNewRequest() {
  modalOpen.value = true;
}

async function onSubmitRequest(payload) {
  const ok = await createRequest(payload);
  if (ok) modalOpen.value = false;
}

const cancelOpen = ref(false);
const recordToCancel = ref(null);
const cancelMessage = computed(() => {
  const r = recordToCancel.value;
  if (!r) return "This action cannot be undone.";
  return `The request for ${r.type} will be cancelled. This action cannot be undone.`;
});

const viewOpen = ref(false);
const recordToView = ref(null);
const viewMessage = computed(() => {
  const r = recordToView.value;
  if (!r) return "";
  const lines = [
    `Type: ${r.type}`,
    `Requested: ${r.requestedDate || "—"}`,
    `Needed by: ${r.neededBy || "—"}`,
    `Status: ${r.status}`,
    `Purpose: ${r.purpose || "—"}`,
  ];
  if (r.rejectReason) lines.push(`Reject reason: ${r.rejectReason}`);
  if (r.managerName) lines.push(`Reviewed by: ${r.managerName}`);
  return lines.join("\n");
});

function onViewRow(row) {
  recordToView.value = row;
  viewOpen.value = true;
}

function onCancelRow(row) {
  recordToCancel.value = row;
  cancelOpen.value = true;
}

async function confirmCancel() {
  if (!recordToCancel.value || saving.value) return;
  const ok = await cancelRequest(recordToCancel.value.id);
  if (ok) {
    recordToCancel.value = null;
    cancelOpen.value = false;
  }
}
</script>
