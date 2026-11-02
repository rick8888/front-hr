<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHero :title="t('ss.expenses.title')" :breadcrumbs="breadcrumbs" />

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600"
          @click="onSubmitExpense"
        >
          {{ t("ss.expenses.submitButton") }}
        </button>
      </div>

      <MyExpensesFiltersCard
        v-model="filtersModel"
        :type-options="typeOptions"
        :status-options="statusOptions"
        :loading="loading"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <SimpleListingCard
        searchable
        :search-query="searchQuery"
        :search-placeholder="t('ss.expenses.searchPlaceholder')"
        :total="totalFiltered"
        :range-from="rangeLabel.from"
        :range-to="rangeLabel.to"
        :current-page="page"
        :page-count="pageCount"
        :page-size="pageSize"
        :page-size-options="[7, 10, 25, 50]"
        @update:current-page="page = $event"
        @update:page-size="pageSize = $event"
        @update:search-query="searchQuery = $event"
      >
        <MyExpensesTable
          :rows="paginatedRows"
          :loading="loading"
          @view="onViewRow"
        />
      </SimpleListingCard>

      <SubmitExpenseModal
        v-model="modalOpen"
        :type-options="typeOptions"
        :today="today"
        :busy="saving"
        @submit="onSubmitNewExpense"
      />

      <ExpenseDetailsModal
        v-model="viewOpen"
        :record="recordToView"
        :title="t('ss.expenses.details')"
        :show-employee="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SimpleListingCard from "../../components/common/SimpleListingCard.vue";
import ExpenseDetailsModal from "../../components/expenses/ExpenseDetailsModal.vue";
import MyExpensesFiltersCard from "../../components/self-service/MyExpensesFiltersCard.vue";
import MyExpensesTable from "../../components/self-service/MyExpensesTable.vue";
import SubmitExpenseModal from "../../components/self-service/SubmitExpenseModal.vue";
import { useMyExpenses } from "./composables/useMyExpenses.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.expenses.title") },
  ];
});

const {
  today,
  loading,
  saving,
  error,
  filters,
  typeOptions,
  statusOptions,
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
  createExpense,
} = useMyExpenses();

const filtersModel = computed({
  get: () => ({ ...filters }),
  set: (next) => onFiltersChange(next),
});

const modalOpen = ref(false);
const viewOpen = ref(false);
const recordToView = ref(null);

function onSubmitExpense() {
  modalOpen.value = true;
}

async function onSubmitNewExpense(payload) {
  const ok = await createExpense(payload);
  if (ok) modalOpen.value = false;
}

function onViewRow(row) {
  recordToView.value = row;
  viewOpen.value = true;
}
</script>
