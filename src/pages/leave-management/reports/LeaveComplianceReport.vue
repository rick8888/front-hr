<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.leave.reports.compliance.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/leave-requests" class="hover:text-secondary-600">
          {{ t("admin.leave.management") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.leave.reportsCrumb") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
      <div class="rounded-xl border border-neutral-200 border-t-4 border-t-red-500 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-red-700">{{ t("admin.leave.reports.compliance.kpi.expiring") }}</p>
            <p v-if="loading" class="mt-2 flex h-9 items-center">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-red-500" />
            </p>
            <p v-else class="mt-2 text-3xl font-bold text-neutral-900">{{ kpis.expiringSoon }}</p>
            <p class="mt-1 text-xs text-neutral-500">
              {{ t("admin.leave.reports.compliance.kpi.expiringHint") }}
            </p>
          </div>
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="rounded-xl border border-neutral-200 border-t-4 border-t-amber-400 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-amber-700">{{ t("admin.leave.reports.compliance.kpi.encashment") }}</p>
            <p v-if="loading" class="mt-2 flex h-9 items-center">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-amber-500" />
            </p>
            <p v-else class="mt-2 text-3xl font-bold text-neutral-900">{{ kpis.encashmentEligible }}</p>
            <p class="mt-1 text-xs text-neutral-500">
              {{ t("admin.leave.reports.compliance.kpi.encashmentHint") }}
            </p>
          </div>
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="rounded-xl border border-neutral-200 border-t-4 border-t-sky-500 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-sky-700">{{ t("admin.leave.reports.compliance.kpi.alerts") }}</p>
            <p v-if="loading" class="mt-2 flex h-9 items-center">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-sky-500" />
            </p>
            <p v-else class="mt-2 text-3xl font-bold text-neutral-900">{{ kpis.policyAlerts }}</p>
            <p class="mt-1 text-xs text-neutral-500">{{ t("admin.leave.reports.compliance.kpi.alertsHint") }}</p>
          </div>
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Expiring Carry Forward -->
    <section class="mb-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <header
        class="flex items-center justify-between gap-3 border-b border-red-100 bg-red-50 px-5 py-3 md:px-6"
      >
        <h2 class="text-sm font-semibold text-red-800">⏱ {{ t("admin.leave.reports.compliance.section.expiring") }}</h2>
        <span
          class="inline-flex min-w-[1.75rem] items-center justify-center rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white"
        >
          {{ kpis.expiringSoon }}
        </span>
      </header>
      <p class="border-b border-neutral-100 px-5 py-3 text-sm text-neutral-600 md:px-6">
        {{ t("admin.leave.reports.compliance.expiringHint") }}
      </p>
      <ComplianceTableShell
        v-model:page="expiringTable.page"
        v-model:page-size="expiringTable.pageSize"
        v-model:search-query="expiringTable.searchQuery"
        :total="expiringTable.total"
        :range="expiringTable.range"
        :page-count="expiringTable.pageCount"
      >
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.col.employee") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.col.leaveType") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.cfLeaves") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.expiry") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.urgency") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-neutral-500">
              <span class="inline-flex items-center gap-2">
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-red-500" />
                {{ t("common.loading") }}
              </span>
            </td>
          </tr>
          <tr v-else-if="!expiringTable.paginated.length">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-neutral-500">
              {{ t("admin.leave.reports.empty") }}
            </td>
          </tr>
          <tr
            v-for="(row, index) in expiringTable.paginated"
            :key="row.id"
            class="hover:bg-neutral-50/60"
          >
            <td class="px-4 py-3 text-sm text-neutral-600">
              {{ expiringTable.range.from + index }}
            </td>
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-neutral-900">{{ row.employee }}</p>
              <p class="text-xs text-neutral-500">{{ row.employeeCode }}</p>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.leaveType }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.cfLeaves }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.expiryLabel }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="urgencyClass(row.urgencyTone)"
              >
                {{ row.urgencyLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </ComplianceTableShell>
    </section>

    <!-- Encashment Eligible -->
    <section class="mb-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <header
        class="flex items-center justify-between gap-3 border-b border-amber-100 bg-amber-50 px-5 py-3 md:px-6"
      >
        <h2 class="text-sm font-semibold text-amber-800">💵 {{ t("admin.leave.reports.compliance.section.encashment") }}</h2>
        <span
          class="inline-flex min-w-[1.75rem] items-center justify-center rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white"
        >
          {{ kpis.encashmentEligible }}
        </span>
      </header>
      <p class="border-b border-neutral-100 px-5 py-3 text-sm text-neutral-600 md:px-6">
        {{ t("admin.leave.reports.compliance.encashmentHint") }}
      </p>
      <ComplianceTableShell
        v-model:page="encashmentTable.page"
        v-model:page-size="encashmentTable.pageSize"
        v-model:search-query="encashmentTable.searchQuery"
        :total="encashmentTable.total"
        :range="encashmentTable.range"
        :page-count="encashmentTable.pageCount"
      >
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.col.employee") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.col.leaveType") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.available") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.maxEncashment") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.eligible") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("common.status") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
              <span class="inline-flex items-center gap-2">
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-amber-500" />
                {{ t("common.loading") }}
              </span>
            </td>
          </tr>
          <tr v-else-if="!encashmentTable.paginated.length">
            <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
              {{ t("admin.leave.reports.empty") }}
            </td>
          </tr>
          <tr
            v-for="(row, index) in encashmentTable.paginated"
            :key="row.id"
            class="hover:bg-neutral-50/60"
          >
            <td class="px-4 py-3 text-sm text-neutral-600">
              {{ encashmentTable.range.from + index }}
            </td>
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-neutral-900">{{ row.employee }}</p>
              <p class="text-xs text-neutral-500">{{ row.employeeCode }}</p>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.leaveType }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.availableLabel }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.maxEncashmentLabel }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.eligibleLabel }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/15"
              >
                {{ row.statusLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </ComplianceTableShell>
    </section>

    <!-- Policy Alerts -->
    <section class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <header
        class="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50 px-5 py-3 md:px-6"
      >
        <h2 class="text-sm font-semibold text-sky-800">ⓘ {{ t("admin.leave.reports.compliance.section.alerts") }}</h2>
        <span
          class="inline-flex min-w-[1.75rem] items-center justify-center rounded bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white"
        >
          {{ kpis.policyAlerts }}
        </span>
      </header>
      <p class="border-b border-neutral-100 px-5 py-3 text-sm text-neutral-600 md:px-6">
        {{ t("admin.leave.reports.compliance.alertsHint") }}
      </p>
      <ComplianceTableShell
        v-model:page="alertsTable.page"
        v-model:page-size="alertsTable.pageSize"
        v-model:search-query="alertsTable.searchQuery"
        :total="alertsTable.total"
        :range="alertsTable.range"
        :page-count="alertsTable.pageCount"
      >
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.col.employee") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.col.leaveType") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.dateRange") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.days") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.leave.reports.compliance.col.alerts") }}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("common.status") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
              <span class="inline-flex items-center gap-2">
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-sky-500" />
                {{ t("common.loading") }}
              </span>
            </td>
          </tr>
          <tr v-else-if="!alertsTable.paginated.length">
            <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
              {{ t("admin.leave.reports.empty") }}
            </td>
          </tr>
          <tr
            v-for="(row, index) in alertsTable.paginated"
            :key="row.id"
            class="hover:bg-neutral-50/60"
          >
            <td class="px-4 py-3 text-sm text-neutral-600">
              {{ alertsTable.range.from + index }}
            </td>
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-neutral-900">{{ row.employee }}</p>
              <p class="text-xs text-neutral-500">{{ row.employeeCode }}</p>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.leaveType }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.dateRange }}</td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.days }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="alert in row.alerts"
                  :key="alert"
                  class="inline-flex rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/15"
                >
                  {{ alert }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.statusLabel }}</td>
          </tr>
        </tbody>
      </ComplianceTableShell>
    </section>
  </div>
</template>

<script setup>
import { h, onMounted } from "vue";
import { useLeaveComplianceReport } from "../../leave/composables/useLeaveComplianceReport.js";
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

const {
  loading,
  error,
  kpis,
  loadData,
  expiringTable,
  encashmentTable,
  alertsTable,
} = useLeaveComplianceReport();

function urgencyClass(tone) {
  if (tone === "red") return "bg-red-50 text-red-700 ring-red-600/15";
  if (tone === "amber") return "bg-amber-50 text-amber-700 ring-amber-600/15";
  if (tone === "blue") return "bg-sky-50 text-sky-700 ring-sky-600/15";
  return "bg-neutral-100 text-neutral-600 ring-neutral-300/60";
}

const ComplianceTableShell = {
  name: "ComplianceTableShell",
  props: {
    page: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    searchQuery: { type: String, default: "" },
    total: { type: Number, required: true },
    range: { type: Object, required: true },
    pageCount: { type: Number, required: true },
  },
  emits: ["update:page", "update:pageSize", "update:searchQuery"],
  setup(props, { emit, slots }) {
    return () =>
      h("div", [
        h(
          "div",
          {
            class:
              "flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6",
          },
          [
            h("label", { class: "inline-flex items-center gap-2 text-sm text-neutral-600" }, [
              t("common.show"),
              h(
                "select",
                {
                  class: "rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm",
                  value: props.pageSize,
                  onChange: (e) => emit("update:pageSize", Number(e.target.value)),
                },
                [10, 25, 50, 100].map((size) =>
                  h("option", { value: size, key: size }, String(size)),
                ),
              ),
              t("common.entries"),
            ]),
            h("label", { class: "inline-flex items-center gap-2 text-sm text-neutral-600" }, [
              `${t("common.search")}:`,
              h("input", {
                type: "search",
                value: props.searchQuery,
                class:
                  "rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
                onInput: (e) => emit("update:searchQuery", e.target.value),
              }),
            ]),
          ],
        ),
        h("div", { class: "overflow-x-auto" }, [
          h("table", { class: "min-w-full border-collapse text-left" }, slots.default?.()),
        ]),
        h(
          "div",
          {
            class:
              "flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6",
          },
          [
            h(
              "p",
              { class: "text-sm text-neutral-600" },
              t("common.showingEntries", {
                from: props.range.from,
                to: props.range.to,
                total: props.total,
              }),
            ),
            h("nav", { class: "flex items-center gap-1", "aria-label": "Pagination" }, [
              h(
                "button",
                {
                  type: "button",
                  class:
                    "rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45",
                  disabled: props.page <= 1,
                  onClick: () => emit("update:page", props.page - 1),
                },
                t("common.previous"),
              ),
              h(
                "button",
                {
                  type: "button",
                  class:
                    "rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45",
                  disabled: props.page >= props.pageCount,
                  onClick: () => emit("update:page", props.page + 1),
                },
                t("common.next"),
              ),
            ]),
          ],
        ),
      ]);
  },
};

onMounted(loadData);
</script>
