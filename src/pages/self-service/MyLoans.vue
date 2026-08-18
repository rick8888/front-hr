<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('ss.loans.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SelfServiceKpiCard
        :title="t('ss.loans.kpi.active')"
        :value="kpis.activeLoans"
        :note="t('ss.kpi.current')"
        icon="doc"
        tone="secondary"
        :colorize-value="false"
        :loading="loading"
      />
      <SelfServiceKpiCard
        :title="t('ss.loans.kpi.outstanding')"
        :value="formatAmount(kpis.totalOutstanding)"
        icon="hourglass"
        tone="warning"
        :colorize-value="false"
        :loading="loading"
      />
      <SelfServiceKpiCard
        :title="t('ss.loans.kpi.nextEmi')"
        :value="formatAmount(kpis.nextEmi)"
        icon="calendar"
        tone="info"
        :colorize-value="false"
        :loading="loading"
      />
      <SelfServiceKpiCard
        :title="t('ss.loans.kpi.pending')"
        :value="kpis.pendingRequests"
        icon="clock"
        tone="neutral"
        :colorize-value="false"
        :loading="loading"
      />
    </section>

    <SimpleListingCard
      :title="t('ss.loans.listTitle')"
      :action-label="t('ss.requestNewLoan')"
      searchable
      :search-query="searchQuery"
      :search-placeholder="t('common.search')"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :page-size-options="[10, 25, 50, 100]"
      @action="onRequestNewLoan"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <MyLoansTable
        :rows="paginatedRows"
        :loading="loading"
        @view="onViewRow"
        @cancel="onCancelRow"
      />
    </SimpleListingCard>

    <ConfirmDialog
      v-model="viewOpen"
      :title="t('ss.loans.details')"
      :message="viewMessage"
      variant="info"
      :confirm-text="t('ss.close')"
      :cancel-text="t('ss.back')"
      @confirm="viewOpen = false"
      @cancel="viewOpen = false"
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
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import PageHero from "../../components/common/PageHero.vue";
import SelfServiceKpiCard from "../../components/self-service/SelfServiceKpiCard.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import MyLoansTable from "../../components/self-service/MyLoansTable.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import { useMyLoans } from "./composables/useMyLoans.js";
import { useI18n } from "../../i18n/index.js";

const router = useRouter();
const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.loans.title") },
  ];
});

const {
  loading,
  cancelBusy,
  error,
  kpis,
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  formatAmount,
  cancelLoan,
} = useMyLoans();

const viewOpen = ref(false);
const viewMessage = ref("");
const cancelOpen = ref(false);
const cancelMessage = ref("");
const loanToCancel = ref(null);

function onRequestNewLoan() {
  router.push("/self-service/loans/request");
}

function onViewRow(row) {
  viewMessage.value = [
    `Type: ${row.type}`,
    `Amount: ${formatAmount(row.amount)}`,
    `EMI: ${formatAmount(row.emi)}`,
    `Status: ${row.status}`,
    row.purpose ? `Purpose: ${row.purpose}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  viewOpen.value = true;
}

function onCancelRow(row) {
  if (row.statusValue !== "pending" && row.status !== "Pending") return;
  loanToCancel.value = row;
  cancelMessage.value = `Loan request ${row.reference || row.id} will be cancelled.`;
  cancelOpen.value = true;
}

async function confirmCancel() {
  const row = loanToCancel.value;
  if (!row) return;
  const ok = await cancelLoan(row);
  if (ok) {
    cancelOpen.value = false;
    loanToCancel.value = null;
  }
}
</script>
