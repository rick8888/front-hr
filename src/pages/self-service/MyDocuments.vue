<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHero :title="t('ss.documents.title')" :breadcrumbs="breadcrumbs" />

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
        <p>{{ t("ss.documents.banner") }}</p>
      </div>

      <!-- Filters -->
      <MyDocumentsFiltersCard
        v-model="filtersModel"
        :category-options="categoryOptions"
        :status-options="statusOptions"
        :expiry-options="expiryOptions"
        :loading="loading"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <!-- Listing -->
      <SimpleListingCard
        :title="t('ss.documents.title')"
        :action-label="t('ss.documents.upload')"
        searchable
        :search-query="searchQuery"
        :search-placeholder="t('ss.documents.searchPlaceholder')"
        :total="totalFiltered"
        :range-from="rangeLabel.from"
        :range-to="rangeLabel.to"
        :current-page="page"
        :page-count="pageCount"
        :page-size="pageSize"
        :page-size-options="[10, 25, 50, 100]"
        @action="uploadOpen = true"
        @update:current-page="page = $event"
        @update:page-size="pageSize = $event"
        @update:search-query="searchQuery = $event"
      >
        <MyDocumentsTable
          :rows="paginatedRows"
          :today="today"
          :loading="loading"
          @view="onViewRow"
          @download="onDownloadRow"
        />
      </SimpleListingCard>

      <UploadDocumentModal
        v-model="uploadOpen"
        :category-options="categoryOptions"
        :today="today"
        :busy="saving"
        @submit="onUpload"
      />

      <ConfirmDialog
        v-model="viewOpen"
        :title="t('ss.documents.details')"
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
import { computed, ref } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import MyDocumentsFiltersCard from "../../components/self-service/MyDocumentsFiltersCard.vue";
import MyDocumentsTable from "../../components/self-service/MyDocumentsTable.vue";
import UploadDocumentModal from "../../components/self-service/UploadDocumentModal.vue";
import { useMyDocuments } from "./composables/useMyDocuments.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.documents.title") },
  ];
});

const {
  today,
  loading,
  saving,
  error,
  filters,
  categoryOptions,
  statusOptions,
  expiryOptions,
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  onFiltersChange,
  applyFilters,
  resetFilters,
  createDocument,
} = useMyDocuments();

const filtersModel = computed({
  get: () => ({ ...filters }),
  set: (next) => onFiltersChange(next),
});

const uploadOpen = ref(false);
const viewOpen = ref(false);
const viewedRow = ref(null);

const viewMessage = computed(() => {
  const r = viewedRow.value;
  if (!r) return "";
  const parts = [
    r.name,
    r.category,
    r.reference && r.reference !== "—" ? `Ref ${r.reference}` : null,
    r.status,
    r.issueDate ? `Issued ${r.issueDate}` : null,
    r.expiryDate ? `Expires ${r.expiryDate}` : "No expiry",
    r.verifiedBy ? `By ${r.verifiedBy}` : null,
    r.rejectReason ? `Reject: ${r.rejectReason}` : null,
  ];
  return parts.filter(Boolean).join(" · ");
});

function onViewRow(row) {
  viewedRow.value = row;
  viewOpen.value = true;
}

function onDownloadRow(row) {
  if (!row?.fileUrl) {
    viewedRow.value = row;
    viewOpen.value = true;
    return;
  }
  window.open(row.fileUrl, "_blank", "noopener,noreferrer");
}

async function onUpload(payload) {
  const ok = await createDocument(payload);
  if (ok) uploadOpen.value = false;
}
</script>
