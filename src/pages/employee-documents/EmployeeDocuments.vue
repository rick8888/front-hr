<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <LeaveRequestsPageHero
      :title="t('admin.leave.documents.title')"
      :breadcrumb-current="t('admin.leave.documents.breadcrumb')"
    />

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        tone="violet"
        :title="t('admin.leave.documents.kpi.total')"
        :subtitle="t('admin.leave.documents.kpi.totalSub')"
        :value="kpis.total"
        :loading="loading"
      />
      <KpiCard
        tone="red"
        :title="t('admin.leave.documents.kpi.pending')"
        :subtitle="t('admin.leave.documents.kpi.pendingSub')"
        :value="kpis.pending"
        :loading="loading"
      />
      <KpiCard
        tone="green"
        :title="t('admin.leave.documents.kpi.verified')"
        :subtitle="t('admin.leave.documents.kpi.verifiedSub')"
        :value="kpis.verified"
        :loading="loading"
      />
      <KpiCard
        tone="blue"
        :title="t('admin.leave.documents.kpi.rejected')"
        :subtitle="t('admin.leave.documents.kpi.rejectedSub')"
        :value="kpis.rejected"
        :loading="loading"
      />
    </div>

    <EmployeeDocumentsFiltersPanel
      v-model="filtersModel"
      :employee-options="employeeOptions"
      :category-options="categoryOptions"
      :status-options="statusOptions"
      :expiry-options="expiryOptions"
      :loading="loading"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <ListingTableShell
      search-id="employee-documents-search"
      :search-placeholder="t('admin.leave.documents.searchPlaceholder')"
      :add-button-label="''"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
            :class="col.thClass || 'text-left'"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-6 py-16 text-center text-sm text-neutral-600">
            <span class="inline-flex items-center gap-2">
              <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
              />
              {{ t("common.loading") }}
            </span>
          </td>
        </tr>
        <tr v-else-if="paginatedRows.length === 0">
          <td :colspan="columns.length" class="px-6 py-16 text-center text-sm text-neutral-600">
            {{ t("admin.leave.documents.empty") }}
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="row in paginatedRows"
            :key="row.id"
            class="transition-colors hover:bg-neutral-50/60"
          >
            <td class="px-5 py-4 md:px-6">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700"
                  aria-hidden="true"
                >
                  {{ initials(row.employee) }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-neutral-900">
                    {{ row.employee }}
                  </p>
                  <p class="text-xs text-neutral-500">{{ row.employeeCode || "—" }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 md:px-6">
              <p class="text-sm font-medium text-neutral-900">{{ row.name }}</p>
              <p class="text-xs text-neutral-500">{{ row.reference }}</p>
            </td>
            <td class="px-5 py-4 text-sm text-neutral-800 md:px-6">
              {{ row.category }}
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-700 md:px-6">
              <p>{{ formatDate(row.issueDate) }}</p>
              <p class="text-xs text-neutral-500">
                {{ row.expiryDate ? t("admin.leave.documents.expiryShort", { date: formatDate(row.expiryDate) }) : t("admin.leave.documents.noExpiry") }}
              </p>
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                :class="statusClass(row.status)"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-5 py-4 md:px-6">
              <a
                v-if="row.fileUrl"
                :href="row.fileUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-sm font-medium text-secondary-600 hover:text-secondary-700"
              >
                {{ t("common.file") }}
              </a>
              <span v-else class="text-sm text-neutral-400">—</span>
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-right md:px-6" @click.stop>
              <div class="inline-flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  @click="onView(row)"
                >
                  {{ t("common.view") }}
                </button>
                <template v-if="row.statusValue === 'pending'">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    :disabled="actionBusy"
                    @click="askConfirm(row, 'verify')"
                  >
                    {{ t("admin.leave.documents.verify") }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                    :disabled="actionBusy"
                    @click="askConfirm(row, 'reject')"
                  >
                    {{ t("common.reject") }}
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <ConfirmDialog
      v-model="confirmOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :cancel-text="t('common.cancel')"
      :loading-text="confirmState.loadingText"
      :variant="confirmState.variant"
      :busy="actionBusy"
      :close-on-backdrop="!actionBusy"
      @confirm="confirmAction"
      @cancel="cancelConfirm"
    />

    <EmployeeDocumentDetailsModal
      v-model="viewOpen"
      :record="viewRow"
      :title="t('admin.leave.documents.details')"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import LeaveRequestsPageHero from "../../components/leave/LeaveRequestsPageHero.vue";
import ListingTableShell from "../../components/leave-management/ListingTableShell.vue";
import KpiCard from "../../components/common/KpiCard.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import EmployeeDocumentDetailsModal from "../../components/employee-documents/EmployeeDocumentDetailsModal.vue";
import EmployeeDocumentsFiltersPanel from "../../components/employee-documents/EmployeeDocumentsFiltersPanel.vue";
import { useEmployeeDocumentsAdmin } from "./composables/useEmployeeDocumentsAdmin.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const confirmOpen = ref(false);
const viewOpen = ref(false);
const viewRow = ref(null);
const confirmState = ref({
  title: "",
  message: "",
  confirmText: "",
  loadingText: "",
  variant: "warning",
  action: null,
  row: null,
});

const {
  loading,
  actionBusy,
  error,
  filters,
  searchQuery,
  page,
  pageSize,
  employeeOptions,
  categoryOptions,
  statusOptions,
  expiryOptions,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  kpis,
  onFiltersChange,
  applyFilters,
  resetFilters,
  verifyDocument,
  rejectDocument,
} = useEmployeeDocumentsAdmin();

const filtersModel = computed({
  get: () => ({ ...filters }),
  set: (next) => onFiltersChange(next),
});

const columns = computed(() => {
  void locale.value;
  return [
    { key: "employee", label: t("common.employee") },
    { key: "document", label: t("admin.leave.documents.col.document") },
    { key: "category", label: t("common.category") },
    { key: "dates", label: t("admin.leave.documents.col.dates") },
    { key: "status", label: t("common.status") },
    { key: "file", label: t("common.file") },
    { key: "actions", label: t("common.actions"), thClass: "text-right" },
  ];
});

function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  if (status === "Verified") return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";
  if (status === "Pending") return "bg-amber-50 text-amber-700 ring-amber-600/15";
  if (status === "Rejected") return "bg-rose-50 text-rose-700 ring-rose-600/15";
  return "bg-neutral-100 text-neutral-700 ring-neutral-500/15";
}

function onView(row) {
  viewRow.value = row;
  viewOpen.value = true;
}

function askConfirm(row, action) {
  const configs = {
    verify: {
      title: t("admin.leave.documents.verifyTitle"),
      message: t("admin.leave.documents.verifyMessage", {
        name: row.name,
        employee: row.employee,
      }),
      confirmText: t("admin.leave.documents.verify"),
      loadingText: t("admin.leave.documents.verifying"),
      variant: "success",
    },
    reject: {
      title: t("admin.leave.documents.rejectTitle"),
      message: t("admin.leave.documents.rejectMessage", {
        name: row.name,
        employee: row.employee,
      }),
      confirmText: t("common.reject"),
      loadingText: t("admin.leave.documents.rejecting"),
      variant: "danger",
    },
  };
  confirmState.value = { ...configs[action], action, row };
  confirmOpen.value = true;
}

async function confirmAction() {
  const { action, row } = confirmState.value;
  if (!action || !row || actionBusy.value) return;
  let ok = false;
  if (action === "verify") ok = await verifyDocument(row);
  if (action === "reject") ok = await rejectDocument(row);
  if (ok) {
    confirmOpen.value = false;
    confirmState.value = { ...confirmState.value, row: null, action: null };
  }
}

function cancelConfirm() {
  if (actionBusy.value) return;
  confirmOpen.value = false;
}
</script>
