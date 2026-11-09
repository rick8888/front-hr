<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <LeaveRequestsPageHero
      :title="t('admin.leave.compOff.title')"
      :breadcrumb-current="t('admin.leave.compOff.breadcrumb')"
    />

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- KPI cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        tone="violet"
        :title="t('admin.leave.compOff.kpi.earned')"
        :subtitle="t('admin.leave.compOff.kpi.earnedSub')"
        :value="kpis.totalEarned"
        :chip-value="loading ? null : kpis.totalEarned"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </KpiCard>

      <KpiCard
        tone="green"
        :title="t('admin.leave.compOff.kpi.available')"
        :subtitle="t('admin.leave.compOff.kpi.availableSub')"
        :value="kpis.available"
        :chip-value="loading ? null : kpis.available"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </template>
      </KpiCard>

      <KpiCard
        tone="blue"
        :title="t('admin.leave.compOff.kpi.used')"
        :subtitle="t('admin.leave.compOff.kpi.usedSub')"
        :value="kpis.used"
        :chip-value="loading ? null : kpis.used"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </template>
      </KpiCard>

      <KpiCard
        tone="red"
        :title="t('admin.leave.compOff.kpi.expired')"
        :subtitle="t('admin.leave.compOff.kpi.expiredSub')"
        :value="kpis.expired"
        :chip-value="loading ? null : kpis.expired"
        :loading="loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </KpiCard>
    </div>

    <!-- Monthly bar chart -->
    <div class="mb-6">
      <div
        v-if="loading"
        class="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-500 shadow-xs"
      >
        <span
          class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
        />
        {{ t("common.loading") }}
      </div>
      <MonthlyBarChart
        v-else
        :title="t('admin.leave.compOff.chartTitle')"
        :legend="t('admin.leave.compOff.chartLegend')"
        :y-label="t('admin.leave.compOff.chartYLabel')"
        :months="monthlyEarnings"
      />
    </div>

    <!-- Filters -->
    <CompensatoryOffsFiltersPanel
      v-model="filtersModel"
      :employee-options="employeeOptions"
      :status-options="statusOptions"
      :usage-status-options="usageStatusOptions"
    />

    <!-- Listing -->
    <ListingTableShell
      search-id="compensatory-offs-search"
      :search-placeholder="t('common.search')"
      :add-button-label="''"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @dismiss="actionMenuOpen = null"
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
            {{ t("admin.leave.compOff.empty") }}
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
                  <p class="text-xs text-neutral-500">{{ row.employeeCode }}</p>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-700 md:px-6">
              {{ formatDay(row.workedDate) }}
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="inline-flex rounded-md bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/15"
              >
                {{ t("admin.leave.compOff.hours", { n: row.hoursWorked.toFixed(2) }) }}
              </span>
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="inline-flex rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/15"
              >
                {{ t("admin.leave.compOff.daysCount", { n: row.compOffDays.toFixed(2) }) }}
              </span>
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="text-sm font-medium"
                :class="
                  row.expiryDate && row.expiryDate < todayIso
                    ? 'text-red-600'
                    : 'text-neutral-700'
                "
              >
                {{ formatDay(row.expiryDate) }}
              </span>
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                :class="statusClass(row.statusValue)"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                :class="usageClass(row.usageStatusValue)"
              >
                {{ row.usageStatus }}
              </span>
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-right md:px-6">
              <TableRowMenu
                :open="actionMenuOpen === row.id"
                :aria-label="t('admin.leave.actionsFor', { name: row.employee })"
                width-class="w-36"
                @toggle="toggleMenu(row.id)"
                @close="closeMenu"
              >
                <button
                  v-if="row.statusValue === 'pending'"
                  type="button"
                  role="menuitem"
                  class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                  :disabled="actionBusy"
                  @click="onApprove(row)"
                >
                  {{ t("common.approve") }}
                </button>
                <button
                  v-if="row.statusValue === 'pending'"
                  type="button"
                  role="menuitem"
                  class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                  :disabled="actionBusy"
                  @click="onReject(row)"
                >
                  {{ t("common.reject") }}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                  @click="viewRow(row)"
                >
                  {{ t("common.view") }}
                </button>
              </TableRowMenu>
            </td>
          </tr>
        </template>
      </tbody>
    </ListingTableShell>

    <Modal
      v-model="detailsOpen"
      :title="t('admin.leave.compOff.detailsTitle')"
      size="md"
      backdrop-class="bg-neutral-950/60 backdrop-blur-sm"
      panel-class="overflow-hidden rounded-2xl border border-white/60 shadow-2xl"
      header-class="border-neutral-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 px-6 py-4"
      title-class="text-lg tracking-tight"
      close-button-class="rounded-lg p-2 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
      :close-label="t('common.close')"
      body-class="px-6 py-5"
      hide-footer
    >
      <div v-if="selectedRow" class="space-y-4">
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <EmployeeAvatar
            :name="selectedRow.employee"
            :avatar-url="selectedRow.employeeAvatarUrl"
            size-class="h-11 w-11 text-sm"
          />
          <div class="min-w-0">
            <p class="truncate font-semibold text-slate-900">{{ selectedRow.employee }}</p>
            <p class="text-sm text-slate-500">{{ selectedRow.employeeCode || "—" }}</p>
          </div>
        </div>

        <dl class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-slate-100 p-3">
            <dt class="text-xs font-medium text-slate-500">{{ t("admin.leave.compOff.col.workedDate") }}</dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">{{ formatDay(selectedRow.workedDate) || "—" }}</dd>
          </div>
          <div class="rounded-lg border border-slate-100 p-3">
            <dt class="text-xs font-medium text-slate-500">{{ t("admin.leave.compOff.col.hoursWorked") }}</dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">{{ t("admin.leave.compOff.hours", { n: selectedRow.hoursWorked.toFixed(2) }) }}</dd>
          </div>
          <div class="rounded-lg border border-slate-100 p-3">
            <dt class="text-xs font-medium text-slate-500">{{ t("admin.leave.compOff.col.days") }}</dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">{{ t("admin.leave.compOff.daysCount", { n: selectedRow.compOffDays.toFixed(2) }) }}</dd>
          </div>
          <div class="rounded-lg border border-slate-100 p-3">
            <dt class="text-xs font-medium text-slate-500">{{ t("admin.leave.compOff.col.expiry") }}</dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">{{ formatDay(selectedRow.expiryDate) || "—" }}</dd>
          </div>
          <div class="rounded-lg border border-slate-100 p-3">
            <dt class="text-xs font-medium text-slate-500">{{ t("common.status") }}</dt>
            <dd class="mt-1">
              <span class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset" :class="statusClass(selectedRow.statusValue)">
                {{ selectedRow.status }}
              </span>
            </dd>
          </div>
          <div class="rounded-lg border border-slate-100 p-3">
            <dt class="text-xs font-medium text-slate-500">{{ t("admin.leave.compOff.col.usage") }}</dt>
            <dd class="mt-1">
              <span class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset" :class="usageClass(selectedRow.usageStatusValue)">
                {{ selectedRow.usageStatus }}
              </span>
            </dd>
          </div>
          <div v-if="selectedRow.managerName" class="rounded-lg border border-slate-100 p-3 sm:col-span-2">
            <dt class="text-xs font-medium text-slate-500">{{ t("admin.leave.compOff.manager") }}</dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">{{ selectedRow.managerName }}</dd>
          </div>
        </dl>

        <div class="rounded-lg border border-slate-100 p-3">
          <p class="text-xs font-medium text-slate-500">{{ t("common.reason") }}</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-slate-800">{{ selectedRow.reason || "—" }}</p>
        </div>
        <div v-if="selectedRow.rejectReason" class="rounded-lg border border-rose-100 bg-rose-50/60 p-3">
          <p class="text-xs font-medium text-rose-600">{{ t("admin.leave.compOff.rejectReason") }}</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-rose-800">{{ selectedRow.rejectReason }}</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            class="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
            @click="detailsOpen = false"
          >
            {{ t("common.close") }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import LeaveRequestsPageHero from "../../components/leave/LeaveRequestsPageHero.vue";
import ListingTableShell from "../../components/leave-management/ListingTableShell.vue";
import TableRowMenu from "../../components/common/TableRowMenu.vue";
import KpiCard from "../../components/common/KpiCard.vue";
import MonthlyBarChart from "../../components/common/MonthlyBarChart.vue";
import CompensatoryOffsFiltersPanel from "../../components/leave-management/CompensatoryOffsFiltersPanel.vue";
import { useCompensatoryOffs } from "../leave/composables/useCompensatoryOffs.js";
import { useI18n } from "../../i18n/index.js";
import EmployeeAvatar from "../../components/common/EmployeeAvatar.vue";
import Modal from "../../components/common/Modal.vue";
import { catalogStatusClass } from "../../stores/entityStatusCatalog.store.js";

const { t, locale } = useI18n();

const todayIso = new Date().toISOString().slice(0, 10);
const actionMenuOpen = ref(null);
const detailsOpen = ref(false);
const selectedRow = ref(null);

const {
  loading,
  actionBusy,
  error,
  filters,
  searchQuery,
  page,
  pageSize,
  employeeOptions,
  statusOptions,
  usageStatusOptions,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  kpis,
  monthlyEarnings,
  loadData,
  approveRequest,
  rejectRequest,
} = useCompensatoryOffs();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "employee", label: t("common.employee") },
    { key: "workedDate", label: t("admin.leave.compOff.col.workedDate") },
    { key: "hoursWorked", label: t("admin.leave.compOff.col.hoursWorked") },
    { key: "compOffDays", label: t("admin.leave.compOff.col.days") },
    { key: "expiryDate", label: t("admin.leave.compOff.col.expiry") },
    { key: "status", label: t("common.status") },
    { key: "usageStatus", label: t("admin.leave.compOff.col.usage") },
    { key: "actions", label: t("common.actions"), thClass: "text-right" },
  ];
});

const filtersModel = computed({
  get: () => ({ ...filters.value }),
  set: (next) => {
    filters.value = { ...next };
  },
});

function formatDay(iso) {
  if (!iso) return "";
  try {
    return format(new Date(`${iso}T12:00:00`), "dd MMM yyyy", { locale: enGB });
  } catch {
    return iso;
  }
}

function statusClass(status) {
  return catalogStatusClass("compensatory_offs", status);
}

function usageClass(usage) {
  if (!usage) return "bg-neutral-100 text-neutral-500 ring-neutral-300/40";
  return catalogStatusClass("compensatory_off_usage", usage);
}

function toggleMenu(id) {
  actionMenuOpen.value = actionMenuOpen.value === id ? null : id;
}

function closeMenu() {
  actionMenuOpen.value = null;
}

function viewRow(row) {
  selectedRow.value = row;
  detailsOpen.value = true;
  closeMenu();
}

async function onApprove(row) {
  closeMenu();
  await approveRequest(row);
}

async function onReject(row) {
  closeMenu();
  await rejectRequest(row);
}

function onDocumentClick() {
  closeMenu();
}

onMounted(() => {
  loadData();
  document.addEventListener("click", onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>
