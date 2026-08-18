<template>
  <div class="px-4 py-6 sm:px-8 max-w-7xl mx-auto">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.leave.reports.dashboard.title") }}</h1>
      <nav class="flex items-center gap-1.5 text-sm text-neutral-500" aria-label="Breadcrumb">
        <RouterLink to="/leave-requests" class="hover:text-secondary-600">
          {{ t("admin.leave.management") }}
        </RouterLink>
        <span>/</span>
        <span class="font-medium text-neutral-800">{{ t("admin.leave.reportsCrumb") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section class="mb-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-[1.35fr_1fr_1fr_auto]">
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.leave.reports.dateRange") }}
          <input
            v-model="draftFilters.from"
            type="date"
            class="input-base mt-1 w-full text-sm"
          />
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("common.department") }}
          <select v-model="draftFilters.department" class="input-base mt-1 w-full text-sm">
            <option value="">{{ t("admin.attendance.reports.allDepartments") }}</option>
            <option v-for="department in departmentOptions" :key="department" :value="department">
              {{ department }}
            </option>
          </select>
        </label>
        <label class="block text-xs font-medium text-neutral-600">
          {{ t("admin.leave.col.leaveType") }}
          <select v-model="draftFilters.leaveType" class="input-base mt-1 w-full text-sm">
            <option value="">{{ t("admin.leave.reports.allLeaveTypes") }}</option>
            <option v-for="type in leaveTypeOptions" :key="type.code" :value="type.code">
              {{ type.name }}
            </option>
          </select>
        </label>
        <div class="flex items-end gap-2">
          <button
            type="button"
            class="inline-flex h-[42px] items-center gap-1.5 rounded-lg bg-secondary-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-secondary-600 disabled:opacity-50"
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
            {{ t("admin.attendance.reports.dept.apply") }}
          </button>
          <button
            type="button"
            class="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-50"
            :disabled="loading"
            :title="t('common.reset')"
            @click="resetFilters"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0A8.003 8.003 0 014.582 15m15.836 0H15"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <section class="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        :title="t('admin.leave.reports.dashboard.kpi.taken')"
        :value="kpis.totalLeavesTaken"
        :suffix="t('admin.leave.reports.dashboard.kpi.takenSuffix')"
        icon-color="text-violet-600"
        icon-bg="bg-violet-100"
        icon="calendar"
        :loading="loading"
      />
      <KpiCard
        :title="t('admin.leave.reports.dashboard.kpi.pending')"
        :value="kpis.pendingApprovals"
        :subtitle="t('admin.leave.reports.dashboard.kpi.pendingSub')"
        icon-color="text-amber-500"
        icon-bg="bg-amber-100"
        icon="clock"
        :loading="loading"
      />
      <KpiCard
        :title="t('admin.leave.reports.dashboard.kpi.avgBalance')"
        :value="kpis.averageBalance"
        :value-suffix="t('admin.leave.reports.dashboard.days')"
        :subtitle="t('admin.leave.reports.dashboard.kpi.avgBalanceSub')"
        icon-color="text-lime-500"
        icon-bg="bg-lime-100"
        icon="briefcase"
        :loading="loading"
      />
      <KpiCard
        :title="t('admin.leave.reports.dashboard.kpi.onLeave')"
        :value="kpis.onLeaveToday"
        :value-suffix="t('admin.leave.reports.dashboard.employees')"
        icon-color="text-sky-500"
        icon-bg="bg-sky-100"
        icon="users"
        :loading="loading"
      />
    </section>

    <section class="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <ChartCard
        class="xl:col-span-2"
        :title="t('admin.leave.reports.dashboard.chart.trend')"
        :subtitle="t('admin.leave.reports.dashboard.chart.trendSub')"
        accent="text-violet-500"
        :loading="loading"
      >
        <LineChart :items="monthlyTrend" />
      </ChartCard>
      <ChartCard
        :title="t('admin.leave.reports.dashboard.chart.types')"
        :subtitle="t('admin.leave.reports.dashboard.chart.typesSub')"
        accent="text-lime-500"
        :loading="loading"
      >
        <DonutChart :items="leaveTypeDistribution" />
      </ChartCard>
    </section>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard
        :title="t('admin.leave.reports.dashboard.chart.dept')"
        :subtitle="t('admin.leave.reports.dashboard.chart.deptSub')"
        accent="text-amber-500"
        :loading="loading"
      >
        <BarChart :items="departmentUtilization" />
      </ChartCard>
      <ChartCard
        :title="t('admin.leave.reports.dashboard.chart.status')"
        :subtitle="t('admin.leave.reports.dashboard.chart.statusSub')"
        accent="text-sky-500"
        :loading="loading"
      >
        <DonutChart :items="statusDistribution" :show-empty-legend="true" />
      </ChartCard>
    </section>
  </div>
</template>

<script setup>
import { h, onMounted } from "vue";
import { useLeaveAnalyticsDashboard } from "../../leave/composables/useLeaveAnalyticsDashboard.js";
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

const {
  loading,
  error,
  draftFilters,
  departmentOptions,
  leaveTypeOptions,
  kpis,
  monthlyTrend,
  leaveTypeDistribution,
  departmentUtilization,
  statusDistribution,
  loadData,
  applyFilters,
  resetFilters,
} = useLeaveAnalyticsDashboard();

const iconPaths = {
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  briefcase: "M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2m4 0H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2zM3 11h18",
  users: "M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H2v-2a4 4 0 014-4h3a4 4 0 014 4v2zm-2-13a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 10-3-3",
};

function spinner(size = "h-6 w-6") {
  return h("span", {
    class: `inline-block ${size} animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500`,
  });
}

const KpiCard = {
  props: {
    title: String,
    value: [String, Number],
    suffix: String,
    subtitle: String,
    valueSuffix: String,
    iconColor: String,
    iconBg: String,
    icon: String,
    loading: Boolean,
  },
  setup(props) {
    return () =>
      h("article", { class: "min-h-[112px] rounded-xl border border-neutral-200 bg-white p-5 shadow-sm" }, [
        h("div", { class: "flex items-start justify-between gap-3" }, [
          h("div", null, [
            h("p", { class: "text-sm text-neutral-500" }, props.title),
            props.loading
              ? h("p", { class: "mt-2 flex h-8 items-center" }, [spinner("h-5 w-5")])
              : h("p", { class: "mt-2 flex items-baseline gap-2 text-2xl font-semibold text-neutral-800" }, [
                  String(props.value),
                  props.valueSuffix
                    ? h("span", { class: "text-xs font-normal text-neutral-400" }, props.valueSuffix)
                    : null,
                  props.suffix
                    ? h("span", { class: "text-xs font-normal text-lime-500" }, props.suffix)
                    : null,
                ]),
            props.subtitle
              ? h("p", { class: "mt-2 text-xs text-neutral-400" }, props.subtitle)
              : null,
          ]),
          h("span", { class: `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${props.iconBg} ${props.iconColor}` }, [
            h("svg", { class: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
              h("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: iconPaths[props.icon],
              }),
            ]),
          ]),
        ]),
      ]);
  },
};

const ChartCard = {
  props: { title: String, subtitle: String, accent: String, loading: Boolean },
  setup(props, { slots }) {
    return () =>
      h("article", { class: "min-h-[330px] rounded-xl border border-neutral-200 bg-white p-5 shadow-sm" }, [
        h("div", { class: "mb-5 flex items-start justify-between" }, [
          h("div", null, [
            h("h2", { class: "text-base font-semibold text-neutral-800" }, props.title),
            h("p", { class: "mt-1 text-xs text-neutral-400" }, props.subtitle),
          ]),
          h("span", { class: `text-lg ${props.accent}` }, "⌁"),
        ]),
        props.loading
          ? h("div", { class: "flex h-[250px] flex-col items-center justify-center gap-3" }, [
              spinner(),
              h("p", { class: "text-sm text-neutral-500" }, t("common.loading")),
            ])
          : slots.default?.(),
      ]);
  },
};

const LineChart = {
  props: { items: { type: Array, default: () => [] } },
  setup(props) {
    return () => {
      const width = 720;
      const height = 270;
      const pad = { top: 18, right: 18, bottom: 35, left: 40 };
      const innerWidth = width - pad.left - pad.right;
      const innerHeight = height - pad.top - pad.bottom;
      const max = Math.max(5, ...props.items.map((item) => item.value));
      const stepX = props.items.length > 1 ? innerWidth / (props.items.length - 1) : 0;
      const points = props.items.map((item, index) => ({
        ...item,
        x: pad.left + index * stepX,
        y: pad.top + innerHeight - (item.value / max) * innerHeight,
      }));
      const path = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
      const ticks = Array.from({ length: 6 }, (_, index) => ({
        value: (max / 5) * index,
        y: pad.top + innerHeight - (index / 5) * innerHeight,
      }));

      return h("svg", { viewBox: `0 0 ${width} ${height}`, class: "h-[270px] w-full" }, [
        ...ticks.map((tick) =>
          h("line", { x1: pad.left, x2: width - pad.right, y1: tick.y, y2: tick.y, stroke: "#e5e7eb" }),
        ),
        ...ticks.map((tick) =>
          h("text", { x: pad.left - 10, y: tick.y + 4, "text-anchor": "end", fill: "#94a3b8", "font-size": "10" }, Math.round(tick.value)),
        ),
        h("text", { x: 12, y: height / 2, transform: `rotate(-90 12 ${height / 2})`, "text-anchor": "middle", fill: "#64748b", "font-size": "10" }, t("admin.leave.reports.dashboard.requests")),
        h("path", { d: path, fill: "none", stroke: "#7c6df2", "stroke-width": "2" }),
        ...points.map((point) =>
          h("circle", { cx: point.x, cy: point.y, r: 2.5, fill: "#7c6df2" }),
        ),
        ...points.map((point) =>
          h("text", { x: point.x, y: height - 10, "text-anchor": "middle", fill: "#94a3b8", "font-size": "10" }, point.label),
        ),
      ]);
    };
  },
};

const BarChart = {
  props: { items: { type: Array, default: () => [] } },
  setup(props) {
    return () => {
      if (!props.items.length) {
        return h("div", { class: "flex h-[250px] items-center justify-center text-sm text-neutral-500" }, t("admin.leave.reports.noData"));
      }
      const max = Math.max(1, ...props.items.map((item) => item.value));
      return h("div", { class: "flex h-[250px] items-end gap-4 border-b border-l border-neutral-200 px-4 pt-4" },
        props.items.map((item) =>
          h("div", { class: "flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" }, [
            h("span", { class: "text-xs text-neutral-500" }, item.value.toFixed(1)),
            h("div", {
              class: "w-full max-w-[48px] rounded-t bg-amber-400",
              style: { height: `${Math.max(3, (item.value / max) * 190)}px` },
            }),
            h("span", { class: "w-full truncate pb-2 text-center text-[10px] text-neutral-500" }, item.label),
          ]),
        ),
      );
    };
  },
};

const DONUT_COLORS = ["#84cc16", "#7c6df2", "#38bdf8", "#f59e0b", "#ef6b5b", "#14b8a6"];

const DonutChart = {
  props: {
    items: { type: Array, default: () => [] },
    showEmptyLegend: { type: Boolean, default: false },
  },
  setup(props) {
    return () => {
      const total = props.items.reduce((sum, item) => sum + item.value, 0);
      const legend = props.items.map((item, index) =>
        h("span", { class: "inline-flex items-center gap-1 text-[10px] text-neutral-500" }, [
          h("span", {
            class: "h-2 w-2 rounded-full",
            style: { background: item.color || DONUT_COLORS[index % DONUT_COLORS.length] },
          }),
          item.label,
        ]),
      );
      if (!total) {
        return h("div", { class: "flex h-[250px] flex-col items-center justify-center gap-6" }, [
          h("p", { class: "text-sm text-neutral-500" }, t("admin.leave.reports.noData")),
          props.showEmptyLegend ? h("div", { class: "flex flex-wrap justify-center gap-3" }, legend) : null,
        ]);
      }

      const radius = 64;
      const circumference = 2 * Math.PI * radius;
      let offset = 0;
      const circles = props.items.map((item, index) => {
        const length = (item.value / total) * circumference;
        const circle = h("circle", {
          cx: 90,
          cy: 90,
          r: radius,
          fill: "none",
          stroke: item.color || DONUT_COLORS[index % DONUT_COLORS.length],
          "stroke-width": 22,
          "stroke-dasharray": `${length} ${circumference - length}`,
          "stroke-dashoffset": -offset,
          transform: "rotate(-90 90 90)",
        });
        offset += length;
        return circle;
      });

      return h("div", { class: "flex h-[250px] flex-col items-center justify-center gap-4" }, [
        h("svg", { viewBox: "0 0 180 180", class: "h-40 w-40" }, [
          ...circles,
          h("text", { x: 90, y: 86, "text-anchor": "middle", fill: "#334155", "font-size": "24", "font-weight": "600" }, total),
          h("text", { x: 90, y: 105, "text-anchor": "middle", fill: "#94a3b8", "font-size": "10" }, t("admin.leave.reports.dashboard.requests")),
        ]),
        h("div", { class: "flex flex-wrap justify-center gap-3" }, legend),
      ]);
    };
  },
};

onMounted(loadData);
</script>
