<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('ss.compOff.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- KPI cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SelfServiceKpiCard
        :title="t('ss.kpi.totalEarned')"
        :value="kpis.totalEarned"
        icon="clock"
        tone="secondary"
        :colorize-value="false"
        :loading="kpiLoading"
      />
      <SelfServiceKpiCard
        :title="t('ss.kpi.available')"
        :value="kpis.available"
        icon="check"
        tone="success"
        :loading="kpiLoading"
      />
      <SelfServiceKpiCard
        :title="t('ss.kpi.used')"
        :value="kpis.used"
        icon="calendar"
        tone="info"
        :loading="kpiLoading"
      />
      <SelfServiceKpiCard
        :title="t('ss.kpi.expired')"
        :value="kpis.expired"
        icon="x"
        tone="danger"
        :loading="kpiLoading"
      />
    </section>

    <!-- Listing -->
    <SimpleListingCard
      :title="t('ss.compOff.title')"
      :action-label="t('ss.compOff.requestAction')"
      searchable
      :search-query="searchQuery"
      :search-placeholder="t('common.search')"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      @action="onRequestCompOff"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <template #filters>
        <MyCompensatoryOffsFilters
          v-model="filtersModel"
          :status-options="statuses"
          :loading="loading"
          @apply="applyFilters"
          @reset="resetFilters"
        />
      </template>

      <MyCompensatoryOffsTable
        :rows="paginatedRows"
        :today="today"
        :loading="loading"
        @view="onViewRow"
        @cancel="onCancelRow"
      />
    </SimpleListingCard>

    <RequestCompOffModal
      v-model="modalOpen"
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
      :busy="cancelBusy"
      @confirm="confirmCancel"
    />

    <ConfirmDialog
      v-model="viewOpen"
      :title="t('ss.compOff.details')"
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
import SelfServiceKpiCard from "../../components/self-service/SelfServiceKpiCard.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import MyCompensatoryOffsFilters from "../../components/self-service/MyCompensatoryOffsFilters.vue";
import MyCompensatoryOffsTable from "../../components/self-service/MyCompensatoryOffsTable.vue";
import RequestCompOffModal from "../../components/self-service/RequestCompOffModal.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import { useMyCompensatoryOffs } from "./composables/useMyCompensatoryOffs.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.compOff.title") },
  ];
});

const {
  today,
  loading,
  kpiLoading,
  saving,
  cancelBusy,
  error,
  kpis,
  filters,
  statuses,
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
  createRequest,
  cancelRequest,
} = useMyCompensatoryOffs();

const filtersModel = computed({
  get: () => ({ ...filters }),
  set: (next) => onFiltersChange(next),
});

const modalOpen = ref(false);
const cancelOpen = ref(false);
const viewOpen = ref(false);
const recordToCancel = ref(null);
const recordToView = ref(null);

const cancelMessage = computed(() => {
  const r = recordToCancel.value;
  if (!r) return "This action cannot be undone.";
  return `The compensatory off request for ${formatDate(r.workedDate)} will be cancelled. This action cannot be undone.`;
});

const viewMessage = computed(() => {
  const r = recordToView.value;
  if (!r) return "";
  const parts = [
    `Worked ${formatDate(r.workedDate)}`,
    `${Number(r.hoursWorked).toFixed(2)}h`,
    `${Number(r.compOffDays).toFixed(2)} days`,
    `Expires ${formatDate(r.expiryDate)}`,
    r.status,
    r.usageStatus,
  ];
  if (r.reason) parts.push(r.reason);
  return parts.join(" · ");
});

function onRequestCompOff() {
  modalOpen.value = true;
}

async function onSubmitRequest(payload) {
  const ok = await createRequest(payload);
  if (ok) modalOpen.value = false;
}

function onViewRow(row) {
  recordToView.value = row;
  viewOpen.value = true;
}

function onCancelRow(row) {
  if (row.statusValue !== "pending") return;
  recordToCancel.value = row;
  cancelOpen.value = true;
}

async function confirmCancel() {
  const row = recordToCancel.value;
  if (!row) return;
  const ok = await cancelRequest(row);
  if (ok) {
    cancelOpen.value = false;
    recordToCancel.value = null;
  }
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>
