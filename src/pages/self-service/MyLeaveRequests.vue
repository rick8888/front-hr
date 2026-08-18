<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero
      :title="t('ss.leaveRequests.title')"
      :breadcrumbs="breadcrumbs"
    />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- KPIs -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SelfServiceKpiCard
        :title="t('ss.kpi.totalRequests')"
        :value="summary.total"
        icon="calendar"
        tone="secondary"
        :colorize-value="false"
        :loading="kpiLoading"
      />
      <SelfServiceKpiCard
        :title="t('ss.kpi.pending')"
        :value="summary.pending"
        icon="clock"
        tone="warning"
        :loading="kpiLoading"
      />
      <SelfServiceKpiCard
        :title="t('ss.kpi.approved')"
        :value="summary.approved"
        icon="check"
        tone="success"
        :loading="kpiLoading"
      />
      <SelfServiceKpiCard
        :title="t('ss.kpi.rejected')"
        :value="summary.rejected"
        icon="x"
        tone="danger"
        :loading="kpiLoading"
      />
    </section>

    <SimpleListingCard
      :title="t('ss.leaveRequests.title')"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      searchable
      :search-query="searchQuery"
      :search-placeholder="t('common.search')"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <template #action>
        <RouterLink
          :to="applyPath"
          class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-600"
        >
          {{ t("ss.applyLeave") }}
        </RouterLink>
        <RouterLink
          :to="balancePath"
          class="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 14l3-3 4 4 6-6" />
          </svg>
          {{ t("ss.leaveBalance") }}
        </RouterLink>
      </template>

      <template #filters>
        <MyLeaveRequestsFilters
          :filters="filters"
          :statuses="statuses"
          :leave-types="leaveTypes"
          :loading="loading"
          @update:filters="onFiltersChange"
          @apply="applyFilters"
          @reset="resetFilters"
        />
      </template>

      <MyLeaveRequestsTable
        :rows="paginatedRows"
        :loading="loading"
        @view="onViewRow"
        @edit="onEditRow"
        @cancel="onCancelRow"
      />
    </SimpleListingCard>

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
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import SelfServiceKpiCard from "../../components/self-service/SelfServiceKpiCard.vue";
import MyLeaveRequestsFilters from "../../components/self-service/MyLeaveRequestsFilters.vue";
import MyLeaveRequestsTable from "../../components/self-service/MyLeaveRequestsTable.vue";
import { useMyLeaveRequests } from "./composables/useMyLeaveRequests.js";
import { useI18n } from "../../i18n/index.js";

const router = useRouter();
const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.leaveRequests.title") },
  ];
});

const applyPath = "/self-service/leave-requests/new";
const balancePath = "/self-service/my-leave-balance";

const {
  loading,
  kpiLoading,
  error,
  cancelBusy,
  filters,
  statuses,
  leaveTypes,
  summary,
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
  cancelRequest,
} = useMyLeaveRequests();

const cancelOpen = ref(false);
const recordToCancel = ref(null);

const cancelMessage = computed(() => {
  const r = recordToCancel.value;
  if (!r) return "This action cannot be undone.";
  return `Your ${r.leaveType} request (${r.fromDate} → ${r.toDate}) will be cancelled. This action cannot be undone.`;
});

function onViewRow(row) {
  router.push({ path: applyPath, query: { id: row.id, mode: "view" } });
}

function onEditRow(row) {
  if (row.statusValue !== "pending") return;
  router.push({ path: applyPath, query: { id: row.id, mode: "edit" } });
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
</script>
