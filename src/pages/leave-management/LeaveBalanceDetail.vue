<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <PageHero
      :title="heroTitle"
      :breadcrumbs="breadcrumbs"
    />

    <div
      v-if="error"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section
      v-if="loading"
      class="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-600 shadow-xs"
    >
      {{ t("admin.leave.balances.detailLoading") }}
    </section>

    <template v-else-if="employee">
      <EmployeeSummaryCard :employee="employee" />

      <TableCard :title="t('admin.leave.balances.yearTitle', { year: currentYear })" class="mb-6">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th
              v-for="col in balanceColumns"
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
          <tr
            v-for="row in balanceRows"
            :key="row.code"
            class="transition-colors hover:bg-neutral-50/60"
          >
            <td class="px-5 py-4 md:px-6">
              <p class="text-sm font-semibold text-neutral-900">{{ row.name }}</p>
              <p class="text-xs text-neutral-500">{{ row.code }}</p>
            </td>
            <td class="px-5 py-4 text-sm text-neutral-700 md:px-6">
              {{ formatNumber(row.entitled) }}
            </td>
            <td class="px-5 py-4 text-sm text-neutral-700 md:px-6">
              {{ formatNumber(row.carriedForward) }}
            </td>
            <td class="px-5 py-4 text-sm text-neutral-700 md:px-6">
              {{ formatNumber(row.additional) }}
            </td>
            <td class="px-5 py-4 text-sm text-neutral-700 md:px-6">
              {{ formatNumber(row.used) }}
            </td>
            <td class="px-5 py-4 md:px-6">
              <span
                class="inline-flex min-w-[2rem] justify-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/15"
              >
                {{ formatNumber(row.available) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-5 py-4 text-right md:px-6">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-primary-700"
                @click="onSetInitial(row)"
              >
                <span aria-hidden="true">+</span>
                {{ t("admin.leave.balances.setInitialShort") }}
              </button>
            </td>
          </tr>
        </tbody>
      </TableCard>

      <SetInitialBalanceModal
        v-model:open="isSetInitialOpen"
        :leave-row="selectedRow"
        :saving="saving"
        @submit="onSetInitialSubmit"
      />

      <TableCard :title="t('admin.leave.balances.history')">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th
              v-for="col in adjustmentColumns"
              :key="col.key"
              scope="col"
              class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 md:px-6"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="adjustmentHistory.length === 0">
            <td
              :colspan="adjustmentColumns.length"
              class="px-6 py-10 text-center text-sm text-neutral-500"
            >
              {{ t("admin.leave.balances.historyEmpty") }}
            </td>
          </tr>
          <tr
            v-else
            v-for="(entry, idx) in adjustmentHistory"
            :key="idx"
            class="transition-colors hover:bg-neutral-50/60"
          >
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.date }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.leaveType }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.type }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.days }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.balanceBefore }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.balanceAfter }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.reason }}</td>
            <td class="px-5 py-3 text-sm text-neutral-700 md:px-6">{{ entry.adjustedBy }}</td>
          </tr>
        </tbody>
      </TableCard>
    </template>

    <section
      v-else-if="!error"
      class="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-600 shadow-xs"
    >
      <p class="font-medium text-neutral-800">{{ t("admin.leave.balances.notFound") }}</p>
      <p class="mt-1 text-neutral-500">
        {{ t("admin.leave.balances.notFoundHint", { code: employeeCode }) }}
      </p>
      <RouterLink
        to="/leave-management/balance"
        class="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        {{ t("admin.leave.balances.back") }}
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PageHero from "../../components/common/PageHero.vue";
import TableCard from "../../components/common/TableCard.vue";
import EmployeeSummaryCard from "../../components/leave-management/EmployeeSummaryCard.vue";
import SetInitialBalanceModal from "../../components/leave-management/SetInitialBalanceModal.vue";
import { useEmployeeLeaveBalance } from "../leave/composables/useLeaveBalances.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();
const route = useRoute();

const employeeCode = computed(() => String(route.params.employeeCode ?? ""));

const {
  year: currentYear,
  employee,
  balanceRows,
  adjustmentHistory,
  loading,
  saving,
  error,
  loadData,
  setInitial,
} = useEmployeeLeaveBalance(employeeCode);

const heroTitle = computed(() => {
  void locale.value;
  return employee.value
    ? t("admin.leave.balances.detailTitleNamed", { name: employee.value.employee })
    : t("admin.leave.balances.detailTitle");
});

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("admin.leave.balances.title"), to: "/leave-management/balance" },
    { label: employee.value?.employee || employeeCode.value || t("admin.leave.balances.detailTitle") },
  ];
});

const balanceColumns = computed(() => {
  void locale.value;
  return [
    { key: "leaveType", label: t("admin.leave.col.leaveType") },
    { key: "entitled", label: t("admin.leave.balances.col.entitled") },
    { key: "carriedForward", label: t("admin.leave.balances.col.carriedForward") },
    { key: "additional", label: t("admin.leave.balances.col.additional") },
    { key: "used", label: t("admin.leave.balances.col.used") },
    { key: "available", label: t("admin.leave.balances.col.available") },
    { key: "actions", label: t("common.actions"), thClass: "text-right" },
  ];
});

const adjustmentColumns = computed(() => {
  void locale.value;
  return [
    { key: "date", label: t("common.date") },
    { key: "leaveType", label: t("admin.leave.col.leaveType") },
    { key: "type", label: t("common.type") },
    { key: "days", label: t("admin.leave.balances.col.days") },
    { key: "balanceBefore", label: t("admin.leave.balances.col.before") },
    { key: "balanceAfter", label: t("admin.leave.balances.col.after") },
    { key: "reason", label: t("common.reason") },
    { key: "adjustedBy", label: t("admin.leave.balances.col.adjustedBy") },
  ];
});

function formatNumber(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

const isSetInitialOpen = ref(false);
const selectedRow = ref(null);

function onSetInitial(row) {
  selectedRow.value = row;
  isSetInitialOpen.value = true;
}

async function onSetInitialSubmit(payload) {
  if (!payload.leaveTypeId) return;
  const saved = await setInitial(payload);
  if (saved) {
    isSetInitialOpen.value = false;
    selectedRow.value = null;
  }
}

onMounted(loadData);
</script>
