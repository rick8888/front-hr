<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <LeaveRequestsPageHero />

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <LeaveRequestsFiltersPanel
      v-model="filters"
      :employee-options="employeeOptions"
      :leave-type-options="leaveTypeFilterLabels"
      :status-options="leaveStatusFilterOptions"
    />

    <LeaveRequestsTablePanel
      :rows="paginatedRows"
      :loading="loading || filtering"
      :total="totalFiltered"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      @add="isNewRequestModalOpen = true"
      @approve="approveRequest"
      @reject="openRejectModal"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    />

    <LeaveRequestNewModal
      v-model:open="isNewRequestModalOpen"
      :employee-options="employeeOptions"
      :leave-type-options="leaveTypeOptions"
      :saving="saving"
      @created="onRequestCreated"
    />

    <LeaveRequestRejectModal
      v-model:open="isRejectModalOpen"
      :request="selectedRequest"
      @confirm="rejectRequest"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import LeaveRequestsPageHero from "../components/leave/LeaveRequestsPageHero.vue";
import LeaveRequestsFiltersPanel from "../components/leave/LeaveRequestsFiltersPanel.vue";
import LeaveRequestsTablePanel from "../components/leave/LeaveRequestsTablePanel.vue";
import LeaveRequestNewModal from "../components/leave/LeaveRequestNewModal.vue";
import LeaveRequestRejectModal from "../components/leave/LeaveRequestRejectModal.vue";
import {
  useLeaveRequests,
} from "./leave/composables/useLeaveRequests.js";

const {
  loading,
  filtering,
  saving,
  error,
  filters,
  searchQuery,
  page,
  pageSize,
  isNewRequestModalOpen,
  isRejectModalOpen,
  selectedRequest,
  employeeOptions,
  leaveTypeOptions,
  leaveTypeFilterLabels,
  leaveStatusFilterOptions,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  loadData,
  loadEmployees,
  loadLeaveTypes,
  createRequest,
  approveRequest,
  openRejectModal,
  rejectRequest,
} = useLeaveRequests();

async function onRequestCreated(payload) {
  try {
    await createRequest(payload);
  } catch {
    // error already set on the composable
  }
}

onMounted(async () => {
  await Promise.all([loadEmployees(), loadLeaveTypes()]);
  await loadData();
});
</script>
