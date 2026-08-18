<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('payslips.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SelfServiceKpiCard
        :title="t('payslips.kpi.total')"
        :value="kpis.total"
        :note="t('payslips.kpi.allTime')"
        icon="doc"
        tone="secondary"
        :colorize-value="false"
        :loading="loading"
      />
      <SelfServiceKpiCard
        :title="t('payslips.kpi.paid')"
        :value="kpis.paid"
        :note="t('payslips.kpi.completed')"
        icon="check"
        tone="success"
        :colorize-value="false"
        :loading="loading"
      />
      <SelfServiceKpiCard
        :title="t('payslips.kpi.pending')"
        :value="kpis.pending"
        :note="t('payslips.kpi.awaiting')"
        icon="clock"
        tone="warning"
        :colorize-value="false"
        :loading="loading"
      />
      <SelfServiceKpiCard
        :title="t('payslips.kpi.lastPayment')"
        :value="kpis.lastPaymentLabel"
        :note="t('payslips.kpi.mostRecent')"
        icon="calendar"
        tone="info"
        :colorize-value="false"
        :loading="loading"
      />
    </section>

    <MyPayslipsFiltersCard
      v-model="filtersModel"
      :period-options="periodOptions"
      :status-options="statusOptionsTranslated"
    />

    <SimpleListingCard
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
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <MyPayslipsTable
        :rows="paginatedRows"
        :start-index="rangeLabel.from || 1"
        :loading="loading"
        @view="onViewRow"
        @download="onDownloadRow"
      />
    </SimpleListingCard>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SelfServiceKpiCard from "../../components/self-service/SelfServiceKpiCard.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import MyPayslipsFiltersCard from "../../components/self-service/MyPayslipsFiltersCard.vue";
import MyPayslipsTable from "../../components/self-service/MyPayslipsTable.vue";
import { useMyPayslips } from "./composables/useMyPayslips.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();
const breadcrumbs = computed(() => {
  void locale.value;
  return [{ label: t("payslips.title") }];
});

const {
  loading,
  error,
  kpis,
  filtersModel,
  periodOptions,
  statusOptions,
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  onViewRow,
  onDownloadRow,
} = useMyPayslips();

/** value = code API UI (Approved…), label = traduit */
const statusOptionsTranslated = computed(() => {
  void locale.value;
  return statusOptions.map((s) => ({
    value: s,
    label: t(`payslips.status.${s}`),
  }));
});
</script>
