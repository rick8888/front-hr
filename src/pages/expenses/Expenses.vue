<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto w-full min-w-0">
    <LeaveRequestsPageHero
      :title="t('admin.leave.expenses.title')"
      :breadcrumb-current="t('admin.leave.expenses.breadcrumb')"
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
        :title="t('admin.leave.expenses.kpi.total')"
        :subtitle="t('admin.leave.expenses.kpi.totalSub')"
        :value="kpis.total"
        :loading="loading"
      />
      <KpiCard
        tone="red"
        :title="t('admin.leave.expenses.kpi.pending')"
        :subtitle="t('admin.leave.expenses.kpi.pendingSub')"
        :value="kpis.pending"
        :loading="loading"
      />
      <KpiCard
        tone="green"
        :title="t('admin.leave.expenses.kpi.approved')"
        :subtitle="t('admin.leave.expenses.kpi.approvedSub')"
        :value="kpis.approved"
        :loading="loading"
      />
      <KpiCard
        tone="blue"
        :title="t('admin.leave.expenses.kpi.reimbursed')"
        :subtitle="t('admin.leave.expenses.kpi.reimbursedSub')"
        :value="kpis.reimbursed"
        :loading="loading"
      />
    </div>

    <ExpensesFiltersPanel
      v-model="filtersModel"
      :employee-options="employeeOptions"
      :type-options="typeOptions"
      :status-options="statusOptions"
      :loading="loading"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <ListingTableShell
      search-id="expenses-search"
      :search-placeholder="t('admin.leave.expenses.searchPlaceholder')"
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
            {{ t("admin.leave.expenses.empty") }}
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
                <EmployeeAvatar
                  :name="row.employee"
                  :avatar-url="row.employeeAvatarUrl"
                  size-class="h-9 w-9 text-xs"
                />
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-neutral-900">
                    {{ row.employee }}
                  </p>
                  <p class="text-xs text-neutral-500">{{ row.employeeCode || "—" }}</p>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-700 md:px-6">
              #{{ row.id }}
            </td>
            <td class="px-5 py-4 text-sm text-neutral-800 md:px-6">{{ row.type }}</td>
            <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-700 md:px-6">
              {{ formatDate(row.expenseDate) }}
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-neutral-900 md:px-6">
              {{ formatAmount(row.amount, row.currency) }}
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
                v-if="row.receiptUrl"
                :href="row.receiptUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-sm font-medium text-secondary-600 hover:text-secondary-700"
              >
                {{ t("common.view") }}
              </a>
              <span v-else class="text-sm text-neutral-400">—</span>
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-right md:px-6" @click.stop>
              <div class="inline-flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  :title="t('common.view')"
                  :aria-label="t('common.view')"
                  @click="onView(row)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <template v-if="row.statusValue === 'pending'">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="actionBusy"
                    :title="t('common.approve')"
                    :aria-label="t('common.approve')"
                    @click="askConfirm(row, 'approve')"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="actionBusy"
                    :title="t('common.reject')"
                    :aria-label="t('common.reject')"
                    @click="askConfirm(row, 'reject')"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </template>
                <button
                  v-else-if="row.statusValue === 'approved'"
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="actionBusy"
                  :title="t('admin.leave.expenses.reimburse')"
                  :aria-label="t('admin.leave.expenses.reimburse')"
                  @click="askConfirm(row, 'reimburse')"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m8-4a8 8 0 11-16 0 8 8 0 0116 0z" />
                  </svg>
                </button>
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

    <ExpenseDetailsModal
      v-model="viewOpen"
      :record="viewRow"
      :title="t('admin.leave.expenses.details')"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import LeaveRequestsPageHero from "../../components/leave/LeaveRequestsPageHero.vue";
import ListingTableShell from "../../components/leave-management/ListingTableShell.vue";
import KpiCard from "../../components/common/KpiCard.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import ExpenseDetailsModal from "../../components/expenses/ExpenseDetailsModal.vue";
import ExpensesFiltersPanel from "../../components/expenses/ExpensesFiltersPanel.vue";
import { useExpenses } from "./composables/useExpenses.js";
import { useI18n } from "../../i18n/index.js";
import EmployeeAvatar from "../../components/common/EmployeeAvatar.vue";

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
  typeOptions,
  statusOptions,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  kpis,
  onFiltersChange,
  applyFilters,
  resetFilters,
  approveRequest,
  rejectRequest,
  reimburseRequest,
} = useExpenses();

const filtersModel = computed({
  get: () => ({ ...filters }),
  set: (next) => onFiltersChange(next),
});

const columns = computed(() => {
  void locale.value;
  return [
    { key: "employee", label: t("common.employee") },
    { key: "id", label: t("admin.leave.expenses.col.id") },
    { key: "type", label: t("common.type") },
    { key: "date", label: t("common.date") },
    { key: "amount", label: t("common.amount") },
    { key: "status", label: t("common.status") },
    { key: "receipt", label: t("admin.leave.expenses.col.receipt") },
    { key: "actions", label: t("common.actions"), thClass: "text-right" },
  ];
});

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

function formatAmount(amount, currency = "USD") {
  const n = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n}`;
  }
}

function statusClass(status) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";
  if (status === "Pending") return "bg-amber-50 text-amber-700 ring-amber-600/15";
  if (status === "Rejected") return "bg-rose-50 text-rose-700 ring-rose-600/15";
  if (status === "Reimbursed") return "bg-sky-50 text-sky-700 ring-sky-600/15";
  return "bg-neutral-100 text-neutral-700 ring-neutral-500/15";
}

function onView(row) {
  viewRow.value = row;
  viewOpen.value = true;
}

function askConfirm(row, action) {
  const amount = formatAmount(row.amount, row.currency);
  const configs = {
    approve: {
      title: t("admin.leave.expenses.approveTitle"),
      message: t("admin.leave.expenses.approveMessage", {
        id: row.id,
        name: row.employee,
        amount,
      }),
      confirmText: t("common.approve"),
      loadingText: t("admin.leave.expenses.approving"),
      variant: "success",
    },
    reject: {
      title: t("admin.leave.expenses.rejectTitle"),
      message: t("admin.leave.expenses.rejectMessage", {
        id: row.id,
        name: row.employee,
        amount,
      }),
      confirmText: t("common.reject"),
      loadingText: t("admin.leave.expenses.rejecting"),
      variant: "danger",
    },
    reimburse: {
      title: t("admin.leave.expenses.reimburseTitle"),
      message: t("admin.leave.expenses.reimburseMessage", {
        id: row.id,
        name: row.employee,
      }),
      confirmText: t("admin.leave.expenses.markReimbursed"),
      loadingText: t("common.updating"),
      variant: "info",
    },
  };
  confirmState.value = { ...configs[action], action, row };
  confirmOpen.value = true;
}

async function confirmAction() {
  const { action, row } = confirmState.value;
  if (!action || !row || actionBusy.value) return;
  let ok = false;
  if (action === "approve") ok = await approveRequest(row);
  if (action === "reject") ok = await rejectRequest(row);
  if (action === "reimburse") ok = await reimburseRequest(row);
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
