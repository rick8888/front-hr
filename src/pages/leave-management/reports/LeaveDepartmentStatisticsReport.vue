<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.leave.reports.dept.title") }}</h1>
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

    <!-- Filters -->
    <section class="mb-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-xl">
          <label class="block text-xs font-medium text-neutral-600">
            {{ t("admin.leave.reports.dept.year") }}
            <select v-model.number="year" class="input-base mt-1 w-full text-sm">
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
          </label>
          <label class="block text-xs font-medium text-neutral-600">
            {{ t("common.department") }}
            <select v-model="draftFilters.department" class="input-base mt-1 w-full text-sm">
              <option value="">{{ t("admin.attendance.reports.selectDepartment") }}</option>
              <option v-for="dept in departmentOptions" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </label>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
            :disabled="loading"
            @click="applyFilters"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {{ t("common.applyFilters") }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            :disabled="loading"
            @click="resetFilters"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0A8.003 8.003 0 0114.582 15m15.836 0H15"
              />
            </svg>
            {{ t("common.reset") }}
          </button>
        </div>
      </div>
    </section>

    <!-- Comparison chart -->
    <section class="mb-5 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="border-b border-neutral-100 px-5 py-4 md:px-6">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.leave.reports.dept.chartTitle") }}</h2>
      </div>
      <div class="px-3 py-5 sm:px-5 md:px-6">
        <div
          v-if="loading"
          class="flex h-[300px] flex-col items-center justify-center gap-3 text-sm text-neutral-500"
        >
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" />
          {{ t("common.loading") }}
        </div>
        <GroupedBarChart v-else :items="chartItems" />
      </div>
    </section>

    <!-- Statistics table -->
    <section class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div class="border-b border-neutral-100 px-5 py-4 md:px-6">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.leave.reports.dept.tableTitle") }}</h2>
      </div>

      <div
        class="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
      >
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("common.show") }}
          <select
            v-model.number="pageSize"
            class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          {{ t("common.entries") }}
        </label>
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("common.search") }}:
          <input
            v-model="searchQuery"
            type="search"
            class="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-neutral-200 bg-neutral-50/80">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">#</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
                <button type="button" class="inline-flex items-center gap-1" @click="toggleSort('department')">
                  {{ t("common.department") }}
                  <SortIcon :active="sortKey === 'department'" :dir="sortDir" />
                </button>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
                <button type="button" class="inline-flex items-center gap-1" @click="toggleSort('totalEmployees')">
                  {{ t("admin.leave.reports.balance.kpi.employees") }}
                  <SortIcon :active="sortKey === 'totalEmployees'" :dir="sortDir" />
                </button>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
                <button type="button" class="inline-flex items-center gap-1" @click="toggleSort('totalLeavesTaken')">
                  {{ t("admin.leave.reports.dashboard.kpi.taken") }}
                  <SortIcon :active="sortKey === 'totalLeavesTaken'" :dir="sortDir" />
                </button>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
                <button type="button" class="inline-flex items-center gap-1" @click="toggleSort('averagePerEmployee')">
                  {{ t("admin.leave.reports.dept.col.avgPerEmployee") }}
                  <SortIcon :active="sortKey === 'averagePerEmployee'" :dir="sortDir" />
                </button>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
                <button type="button" class="inline-flex items-center gap-1" @click="toggleSort('utilizationRate')">
                  {{ t("admin.leave.reports.dept.col.utilization") }}
                  <SortIcon :active="sortKey === 'utilizationRate'" :dir="sortDir" />
                </button>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">
                <button type="button" class="inline-flex items-center gap-1" @click="toggleSort('pendingRequests')">
                  {{ t("admin.leave.reports.dept.col.pending") }}
                  <SortIcon :active="sortKey === 'pendingRequests'" :dir="sortDir" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
                <span class="inline-flex items-center gap-2">
                  <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" />
                  {{ t("common.loading") }}
                </span>
              </td>
            </tr>
            <tr v-else-if="!paginatedRows.length">
              <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
                {{ t("admin.leave.reports.empty") }}
              </td>
            </tr>
            <tr
              v-for="(row, index) in paginatedRows"
              :key="row.id"
              class="hover:bg-neutral-50/60"
            >
              <td class="px-4 py-3 text-sm text-neutral-600">
                {{ rangeLabel.from + index }}
              </td>
              <td class="px-4 py-3 text-sm font-medium text-neutral-900">
                {{ row.department }}
              </td>
              <td class="px-4 py-3 text-sm text-neutral-700">{{ row.totalEmployees }}</td>
              <td class="px-4 py-3 text-sm text-neutral-700">{{ row.totalLeavesTakenLabel }}</td>
              <td class="px-4 py-3 text-sm text-neutral-700">{{ row.averagePerEmployeeLabel }}</td>
              <td class="px-4 py-3 text-sm text-neutral-700">{{ row.utilizationRateLabel }}</td>
              <td class="px-4 py-3 text-sm text-neutral-700">{{ row.pendingRequests }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
      >
        <p class="text-sm text-neutral-600">
          {{ t("common.showingEntries", { from: rangeLabel.from, to: rangeLabel.to, total: totalFiltered }) }}
        </p>
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45"
            :disabled="page <= 1"
            @click="page -= 1"
          >
            {{ t("common.previous") }}
          </button>
          <button
            v-for="pageNumber in visiblePages"
            :key="pageNumber"
            type="button"
            class="min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium"
            :class="
              pageNumber === page
                ? 'bg-primary-600 text-white'
                : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            "
            @click="page = pageNumber"
          >
            {{ pageNumber }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45"
            :disabled="page >= pageCount"
            @click="page += 1"
          >
            {{ t("common.next") }}
          </button>
        </nav>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, h, onMounted } from "vue";
import { useLeaveDepartmentStatisticsReport } from "../../leave/composables/useLeaveDepartmentStatisticsReport.js";
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

const {
  year,
  yearOptions,
  loading,
  error,
  draftFilters,
  searchQuery,
  page,
  pageSize,
  sortKey,
  sortDir,
  departmentOptions,
  chartItems,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  toggleSort,
  loadData,
  applyFilters,
  resetFilters,
} = useLeaveDepartmentStatisticsReport();

const visiblePages = computed(() => {
  const total = pageCount.value;
  const current = page.value;
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  for (let n = Math.max(1, end - 4); n <= end; n += 1) pages.push(n);
  return pages;
});

const SortIcon = {
  name: "SortIcon",
  props: {
    active: { type: Boolean, default: false },
    dir: { type: String, default: "asc" },
  },
  setup(props) {
    return () =>
      h(
        "span",
        {
          class: [
            "inline-flex flex-col text-[9px] leading-none",
            props.active ? "text-primary-600" : "text-neutral-400",
          ],
        },
        [
          h("span", { class: props.active && props.dir === "asc" ? "opacity-100" : "opacity-40" }, "▲"),
          h("span", { class: props.active && props.dir === "desc" ? "opacity-100" : "opacity-40" }, "▼"),
        ],
      );
  },
};

/** Grouped bar chart: Total Leaves Taken + Average per Employee */
const GroupedBarChart = {
  name: "GroupedBarChart",
  props: {
    items: { type: Array, default: () => [] },
  },
  setup(props) {
    return () => {
      const width = 760;
      const height = 320;
      const pad = { top: 24, right: 24, bottom: 48, left: 64 };
      const items = props.items || [];

      const legend = h(
        "div",
        { class: "mb-3 flex flex-wrap items-center justify-center gap-5 text-xs text-neutral-600" },
        [
          h("span", { class: "inline-flex items-center gap-1.5" }, [
            h("span", { class: "h-2.5 w-2.5 rounded-sm", style: { background: "#8b5cf6" } }),
            t("admin.leave.reports.dashboard.kpi.taken"),
          ]),
          h("span", { class: "inline-flex items-center gap-1.5" }, [
            h("span", { class: "h-2.5 w-2.5 rounded-sm", style: { background: "#22c55e" } }),
            t("admin.leave.reports.dept.col.avgPerEmployee"),
          ]),
        ],
      );

      if (!items.length) {
        return h("div", null, [
          legend,
          h(
            "div",
            { class: "flex h-56 items-center justify-center text-sm text-neutral-400" },
            t("admin.leave.reports.noData"),
          ),
        ]);
      }

      const innerWidth = width - pad.left - pad.right;
      const innerHeight = height - pad.top - pad.bottom;
      const maxValue = Math.max(
        1,
        ...items.flatMap((item) => [item.totalLeavesTaken || 0, item.averagePerEmployee || 0]),
      );
      // Nice round top for Y axis
      const yMax = Math.ceil(maxValue / 5) * 5 || 5;
      const slot = innerWidth / items.length;
      const groupWidth = Math.min(90, slot * 0.7);
      const barWidth = groupWidth / 2 - 3;
      const tickCount = 5;

      const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
        const value = (yMax / tickCount) * i;
        const y = pad.top + innerHeight - (value / yMax) * innerHeight;
        return { value, y };
      });

      const gridLines = yTicks.map((tick) =>
        h("line", {
          x1: pad.left,
          x2: width - pad.right,
          y1: tick.y,
          y2: tick.y,
          stroke: "#e5e7eb",
          "stroke-width": 1,
        }),
      );

      const yLabels = yTicks.map((tick) =>
        h(
          "text",
          {
            x: pad.left - 10,
            y: tick.y + 4,
            "text-anchor": "end",
            class: "fill-neutral-500",
            "font-size": "11",
          },
          tick.value.toFixed(2),
        ),
      );

      const bars = items.flatMap((item, i) => {
        const groupX = pad.left + i * slot + (slot - groupWidth) / 2;
        const totalH = ((item.totalLeavesTaken || 0) / yMax) * innerHeight;
        const avgH = ((item.averagePerEmployee || 0) / yMax) * innerHeight;
        return [
          h("rect", {
            x: groupX,
            y: pad.top + innerHeight - totalH,
            width: barWidth,
            height: Math.max(totalH, 0),
            rx: 2,
            fill: "#8b5cf6",
          }),
          h("rect", {
            x: groupX + barWidth + 6,
            y: pad.top + innerHeight - avgH,
            width: barWidth,
            height: Math.max(avgH, 0),
            rx: 2,
            fill: "#22c55e",
          }),
        ];
      });

      const xLabels = items.map((item, i) =>
        h(
          "text",
          {
            x: pad.left + i * slot + slot / 2,
            y: height - 14,
            "text-anchor": "middle",
            class: "fill-neutral-600",
            "font-size": "11",
          },
          item.label,
        ),
      );

      const yAxisTitle = h(
        "text",
        {
          x: 16,
          y: pad.top + innerHeight / 2,
          "text-anchor": "middle",
          transform: `rotate(-90 16 ${pad.top + innerHeight / 2})`,
          class: "fill-neutral-500",
          "font-size": "12",
        },
        t("admin.leave.reports.dept.chartDays"),
      );

      return h("div", null, [
        legend,
        h("svg", { viewBox: `0 0 ${width} ${height}`, class: "w-full max-h-[360px]" }, [
          ...gridLines,
          ...yLabels,
          yAxisTitle,
          ...bars,
          ...xLabels,
          h("line", {
            x1: pad.left,
            x2: pad.left,
            y1: pad.top,
            y2: pad.top + innerHeight,
            stroke: "#d1d5db",
            "stroke-width": 1,
          }),
          h("line", {
            x1: pad.left,
            x2: width - pad.right,
            y1: pad.top + innerHeight,
            y2: pad.top + innerHeight,
            stroke: "#d1d5db",
            "stroke-width": 1,
          }),
        ]),
      ]);
    };
  },
};

onMounted(loadData);
</script>
