<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <PageHero
      :title="t('admin.leave.balances.title')"
      :breadcrumbs="breadcrumbs"
    />

    <BalanceFiltersPanel
      v-model="filtersModel"
      :employee-options="employeeOptions"
      :team-options="teamOptions"
      @reset="resetFilters"
    />

    <div
      v-if="error"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <ListingTableShell
      :title="t('admin.leave.balances.listTitle')"
      search-id="leave-balances-search"
      :search-placeholder="t('common.search')"
      :add-button-label="''"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      :page-size-options="[10, 25, 50, 100]"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th
            scope="col"
            class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.employee") }}
          </th>
          <th
            scope="col"
            class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.code") }}
          </th>
          <th
            scope="col"
            class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("admin.leave.balances.col.designation") }}
          </th>
          <th
            scope="col"
            class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("admin.leave.balances.col.team") }}
          </th>
          <th
            v-for="code in leaveCodes"
            :key="code"
            scope="col"
            class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500"
          >
            {{ code }}
          </th>
          <th
            scope="col"
            class="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
          >
            {{ t("common.actions") }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td
            :colspan="4 + leaveCodes.length + 1"
            class="px-6 py-16 text-center text-sm text-neutral-600"
          >
            {{ t("admin.leave.balances.loading") }}
          </td>
        </tr>
        <tr v-else-if="paginatedRows.length === 0">
          <td
            :colspan="4 + leaveCodes.length + 1"
            class="px-6 py-16 text-center text-sm text-neutral-600"
          >
            {{
              rows.length === 0
                ? t("admin.leave.balances.emptyNone")
                : t("admin.leave.balances.empty")
            }}
          </td>
        </tr>
        <tr
          v-for="row in paginatedRows"
          :key="row.id"
          class="transition-colors hover:bg-neutral-50/60"
        >
          <td class="px-5 py-4 text-sm font-medium text-neutral-900 md:px-6">
            {{ row.employee }}
          </td>
          <td class="whitespace-nowrap px-5 py-4 text-sm text-neutral-700 md:px-6">
            {{ row.employeeCode }}
          </td>
          <td class="px-5 py-4 text-sm text-neutral-700 md:px-6">
            {{ row.designation }}
          </td>
          <td class="px-5 py-4 text-sm text-neutral-700 md:px-6">
            {{ row.team }}
          </td>
          <td
            v-for="code in leaveCodes"
            :key="code"
            class="px-3 py-4 text-center"
          >
            <span
              class="inline-flex min-w-[2rem] justify-center rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-600/15"
            >
              {{ formatBalance(row.balances?.[code]?.available) }}
            </span>
          </td>
          <td class="whitespace-nowrap px-5 py-4 text-right md:px-6">
            <RouterLink
              :to="{
                name: 'LeaveManagementBalanceDetail',
                params: { employeeCode: row.employeeCode },
              }"
              class="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/15 transition-colors hover:bg-primary-100"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {{ t("admin.leave.balances.viewDetails") }}
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </ListingTableShell>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import ListingTableShell from "../../components/leave-management/ListingTableShell.vue";
import BalanceFiltersPanel from "../../components/leave-management/BalanceFiltersPanel.vue";
import { useLeaveBalances } from "../leave/composables/useLeaveBalances.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("admin.leave.management"), to: "/leave-requests" },
    { label: t("admin.leave.balances.breadcrumb") },
  ];
});

const {
  leaveCodes,
  rows,
  loading,
  error,
  filters,
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  employeeOptions,
  teamOptions,
  loadData,
  resetFilters,
} = useLeaveBalances();

const filtersModel = computed({
  get: () => ({ ...filters.value }),
  set: (next) => {
    filters.value = next;
  },
});

function formatBalance(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

onMounted(loadData);
</script>
