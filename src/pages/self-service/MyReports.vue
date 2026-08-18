<template>
  <div class="min-h-full bg-[#f5f6fb] px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-neutral-700">{{ t("ss.reports.title") }}</h1>
      <nav class="text-xs text-neutral-500" aria-label="Breadcrumb">
        {{ t("nav.attendance") }} <span class="mx-2">/</span>
        <span class="text-neutral-700">{{ t("ss.reports.breadcrumb") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section class="report-card mb-4 p-5">
      <h2 class="mb-5 text-sm font-semibold text-neutral-700">{{ t("ss.reports.filters") }}</h2>
      <div class="flex flex-wrap items-end gap-4">
        <label class="block w-full max-w-[275px] text-xs text-neutral-600">
          {{ t("ss.reports.period") }}
          <select
            v-model.number="selectedPeriod"
            class="mt-2 w-full rounded border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option :value="1">{{ t("ss.reports.thisMonth") }}</option>
            <option :value="3">{{ t("ss.reports.last3Months") }}</option>
            <option :value="6">{{ t("ss.reports.last6Months") }}</option>
            <option :value="12">{{ t("ss.reports.last12Months") }}</option>
          </select>
        </label>
        <button
          type="button"
          class="inline-flex h-[42px] items-center gap-2 rounded bg-violet-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600 disabled:opacity-50"
          :disabled="loading"
          @click="applyFilter"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          {{ t("ss.reports.applyFilter") }}
        </button>
        <button
          type="button"
          class="inline-flex h-[42px] items-center gap-2 rounded bg-neutral-100 px-5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-200 disabled:opacity-50"
          :disabled="loading"
          @click="resetFilter"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5M5.6 15A7 7 0 0018 17m.4-8A7 7 0 006 7" />
          </svg>
          {{ t("ss.reports.resetFilter") }}
        </button>
      </div>
    </section>

    <div class="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in metricCards" :key="card.label" class="report-card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-neutral-400">{{ card.label }}</p>
            <p v-if="loading" class="mt-4 h-6 w-14 animate-pulse rounded bg-neutral-100" />
            <p v-else class="mt-3 text-2xl font-medium text-neutral-700">
              {{ card.value }}
              <span v-if="card.unit" class="text-[10px] font-normal text-neutral-400">
                {{ card.unit }}
              </span>
            </p>
          </div>
          <span :class="['flex h-7 w-7 items-center justify-center rounded', card.iconBg]">
            <component :is="card.icon" :class="['h-4 w-4', card.iconColor]" />
          </span>
        </div>
        <p :class="['mt-3 text-xs', card.noteColor]">{{ card.note }}</p>
      </article>
    </div>

    <div class="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
      <section class="report-card min-w-0 p-5">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-neutral-700">{{ t("ss.reports.trendTitle") }}</h2>
          <svg class="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </div>
        <div class="mb-3 flex gap-4 text-[10px] text-neutral-500">
          <span class="inline-flex items-center gap-1"><i class="h-2 w-2 rounded-full bg-lime-400" />{{ t("ss.attendance.status.Present") }}</span>
          <span class="inline-flex items-center gap-1"><i class="h-2 w-2 rounded-full bg-[#ef765f]" />{{ t("ss.attendance.status.Absent") }}</span>
          <span class="inline-flex items-center gap-1"><i class="h-2 w-2 rounded-full bg-amber-400" />{{ t("ss.attendance.status.Late") }}</span>
        </div>
        <div v-if="loading" class="h-56 animate-pulse rounded bg-neutral-50" />
        <div v-else class="relative h-56 overflow-hidden">
          <svg class="h-full w-full" viewBox="0 0 760 260" preserveAspectRatio="none" role="img" :aria-label="t('ss.reports.chartAria')">
            <g stroke="#e9ebef" stroke-width="1">
              <line v-for="n in 6" :key="`grid-${n}`" x1="42" x2="742" :y1="24 + (n - 1) * 38" :y2="24 + (n - 1) * 38" />
            </g>
            <polyline :points="chartPoints('present')" fill="none" stroke="#8bdc48" stroke-width="3" vector-effect="non-scaling-stroke" />
            <polyline :points="chartPoints('absent')" fill="none" stroke="#ef765f" stroke-width="2" vector-effect="non-scaling-stroke" />
            <polyline :points="chartPoints('late')" fill="none" stroke="#f3ad35" stroke-width="2" vector-effect="non-scaling-stroke" />
            <g v-for="(row, index) in monthlyRows" :key="row.key">
              <circle :cx="chartX(index)" :cy="chartY(row.present)" r="4" fill="white" stroke="#8bdc48" stroke-width="2" vector-effect="non-scaling-stroke" />
              <circle :cx="chartX(index)" :cy="chartY(row.absent)" r="3" fill="white" stroke="#ef765f" stroke-width="2" vector-effect="non-scaling-stroke" />
              <circle :cx="chartX(index)" :cy="chartY(row.late)" r="3" fill="white" stroke="#f3ad35" stroke-width="2" vector-effect="non-scaling-stroke" />
              <text :x="chartX(index)" y="248" text-anchor="middle" class="fill-neutral-500 text-[10px]">
                {{ row.shortLabel }}
              </text>
            </g>
          </svg>
        </div>
      </section>

      <section class="report-card p-5">
        <h2 class="mb-5 text-sm font-semibold text-neutral-700">{{ t("ss.reports.distributionTitle") }}</h2>
        <div v-if="loading" class="mx-auto h-40 w-40 animate-pulse rounded-full bg-neutral-100" />
        <div v-else class="mx-auto flex h-40 w-40 items-center justify-center rounded-full" :style="donutStyle">
          <div class="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center">
            <span class="text-[10px] text-neutral-400">{{ t("ss.reports.total") }}</span>
            <strong class="mt-2 text-sm font-medium text-neutral-700">{{ t("ss.reports.daysCount", { n: totalDays }) }}</strong>
          </div>
        </div>
        <div class="mt-5 space-y-3 text-xs">
          <div v-for="item in distribution" :key="item.label" class="flex items-center justify-between">
            <span class="inline-flex items-center gap-2 text-neutral-500">
              <i class="h-3 w-3 rounded-full border-2" :style="{ borderColor: item.color }" />
              {{ item.label }}
            </span>
            <strong class="font-semibold text-neutral-600">{{ t("ss.reports.daysCount", { n: item.value }) }}</strong>
          </div>
        </div>
      </section>
    </div>

    <section class="report-card overflow-hidden">
      <div class="px-5 pt-5">
        <h2 class="border-b border-neutral-200 pb-5 text-sm font-semibold text-neutral-700">
          {{ t("ss.reports.breakdownTitle") }}
        </h2>
      </div>
      <div class="overflow-x-auto px-5 pb-5">
        <table class="w-full min-w-[800px] text-xs">
          <thead>
            <tr class="border-b border-neutral-200 text-left text-[10px] font-semibold uppercase tracking-wide text-neutral-600">
              <th class="px-3 py-4">{{ t("ss.reports.col.month") }}</th>
              <th class="px-3 py-4 text-center">{{ t("ss.reports.col.workingDays") }}</th>
              <th class="px-3 py-4 text-center">{{ t("ss.attendance.status.Present") }}</th>
              <th class="px-3 py-4 text-center">{{ t("ss.attendance.status.Absent") }}</th>
              <th class="px-3 py-4 text-center">{{ t("ss.attendance.status.Late") }}</th>
              <th class="px-3 py-4 text-center">{{ t("ss.attendance.status.Half_Day") }}</th>
              <th class="px-3 py-4 text-center">{{ t("common.totalHours") }}</th>
              <th class="px-3 py-4">{{ t("ss.reports.col.attendancePct") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 text-neutral-600">
            <tr v-if="loading">
              <td colspan="8" class="px-3 py-10 text-center">{{ t("common.loading") }}</td>
            </tr>
            <tr v-for="row in monthlyRows" v-else :key="row.key">
              <td class="px-3 py-4 font-semibold">{{ row.label }}</td>
              <td class="px-3 py-4 text-center">{{ row.workingDays }}</td>
              <td class="px-3 py-4 text-center"><span class="count-badge bg-lime-100 text-lime-600">{{ row.present }}</span></td>
              <td class="px-3 py-4 text-center"><span class="count-badge bg-red-100 text-[#ef765f]">{{ row.absent }}</span></td>
              <td class="px-3 py-4 text-center"><span class="count-badge bg-amber-100 text-amber-600">{{ row.late }}</span></td>
              <td class="px-3 py-4 text-center"><span class="count-badge bg-sky-100 text-sky-500">{{ row.halfDay }}</span></td>
              <td class="px-3 py-4 text-center">{{ formatHours(row.minutes) }}</td>
              <td class="px-3 py-4">
                <div class="flex items-center gap-2">
                  <span>{{ row.rate }}%</span>
                  <span class="h-1.5 w-14 overflow-hidden rounded-full bg-neutral-200">
                    <i class="block h-full rounded-full bg-[#ef765f]" :style="{ width: `${row.rate}%` }" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="!loading" class="bg-violet-50 text-neutral-600">
            <tr>
              <td class="px-3 py-4 text-[10px] font-semibold uppercase">{{ t("ss.reports.total") }}</td>
              <td class="px-3 py-4 text-center">--</td>
              <td class="px-3 py-4 text-center">{{ totals.present }}</td>
              <td class="px-3 py-4 text-center">{{ totals.absent }}</td>
              <td class="px-3 py-4 text-center">{{ totals.late }}</td>
              <td class="px-3 py-4 text-center">{{ totals.halfDay }}</td>
              <td class="px-3 py-4 text-center">{{ formatHours(totals.minutes) }}</td>
              <td class="px-3 py-4">{{ attendanceRate }}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { computed, h, onMounted, ref } from "vue";
import { attendanceApiService } from "./services/attendance.api.service.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale, bcp47 } = useI18n();

const selectedPeriod = ref(3);
const appliedPeriod = ref(3);
const records = ref([]);
const loading = ref(true);
const error = ref("");

const icon = (path) => ({
  render() {
    return h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: path }),
    ]);
  },
});

const ShieldIcon = icon("M9 12l2 2 4-4m5-4.5A11 11 0 0112 3a11 11 0 01-8 2.5V11c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5.5z");
const CalendarIcon = icon("M8 3v3m8-3v3M5 9h14M6 5h12a2 2 0 012 2v12H4V7a2 2 0 012-2zM9 14l2 2 4-4");
const ClockIcon = icon("M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z");

function recordDate(row) {
  const raw = row.date ?? row.attendance_date;
  if (!raw) return null;
  const date = new Date(`${String(raw).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function workingDays(year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= lastDay; day += 1) {
    const weekday = new Date(year, month, day).getDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count;
}

const monthlyRows = computed(() => {
  void locale.value;
  const formatter = new Intl.DateTimeFormat(bcp47.value, { month: "long", year: "numeric" });
  const shortFormatter = new Intl.DateTimeFormat(bcp47.value, { month: "short", year: "numeric" });
  const now = new Date();
  const months = [];

  for (let offset = appliedPeriod.value - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const rows = records.value.filter((row) => {
      const d = recordDate(row);
      return d && d.getFullYear() === year && d.getMonth() === month;
    });
    const present = rows.filter((row) => ["on_time", "late", "half_day"].includes(row.status)).length;
    const absent = rows.filter((row) => row.status === "absent").length;
    const late = rows.filter((row) => row.status === "late").length;
    const halfDay = rows.filter((row) => row.status === "half_day").length;
    const minutes = rows.reduce(
      (sum, row) => sum + Number(row.working_minutes ?? row.workingMinutes ?? 0),
      0
    );
    const days = workingDays(year, month);

    months.push({
      key: `${year}-${month}`,
      label: formatter.format(date),
      shortLabel: shortFormatter.format(date),
      workingDays: days,
      present,
      absent,
      late,
      halfDay,
      minutes,
      rate: days ? Number(((present / days) * 100).toFixed(1)) : 0,
    });
  }
  return months;
});

const totals = computed(() =>
  monthlyRows.value.reduce(
    (sum, row) => ({
      present: sum.present + row.present,
      absent: sum.absent + row.absent,
      late: sum.late + row.late,
      halfDay: sum.halfDay + row.halfDay,
      minutes: sum.minutes + row.minutes,
      workingDays: sum.workingDays + row.workingDays,
    }),
    { present: 0, absent: 0, late: 0, halfDay: 0, minutes: 0, workingDays: 0 }
  )
);

const attendanceRate = computed(() =>
  totals.value.workingDays
    ? Number(((totals.value.present / totals.value.workingDays) * 100).toFixed(1))
    : 0
);
const totalDays = computed(() => totals.value.present + totals.value.absent);
const averageMonthlyHours = computed(() =>
  monthlyRows.value.length
    ? Math.round(totals.value.minutes / 60 / monthlyRows.value.length)
    : 0
);

const metricCards = computed(() => {
  void locale.value;
  const rate = attendanceRate.value;
  const late = totals.value.late;
  return [
  {
    label: t("ss.reports.kpi.attendanceRate"),
    value: `${rate}%`,
    note: rate >= 75 ? t("ss.reports.note.good") : t("ss.reports.note.needsImprovement"),
    noteColor: rate >= 75 ? "text-lime-500" : "text-amber-500",
    icon: ShieldIcon,
    iconBg: "bg-lime-100",
    iconColor: "text-lime-500",
  },
  {
    label: t("ss.reports.kpi.totalPresent"),
    value: totals.value.present,
    unit: totals.value.present === 1 ? t("ss.reports.dayUnit") : t("ss.reports.daysUnit"),
    note: t("ss.reports.note.outOfDays", { n: totals.value.workingDays }),
    noteColor: "text-neutral-400",
    icon: CalendarIcon,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
  },
  {
    label: t("ss.reports.kpi.lateArrivals"),
    value: late,
    unit: late === 1 ? t("ss.reports.timeUnit") : t("ss.reports.timesUnit"),
    note: late ? t("ss.reports.note.needsImprovement") : t("ss.reports.note.noLate"),
    noteColor: "text-amber-500",
    icon: ClockIcon,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    label: t("ss.reports.kpi.avgWorkHours"),
    value: averageMonthlyHours.value,
    unit: t("ss.reports.hrsPerMonth"),
    note: t("ss.reports.totalHrs", { n: Math.round(totals.value.minutes / 60) }),
    noteColor: "text-neutral-400",
    icon: ClockIcon,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-500",
  },
];
});

const distribution = computed(() => {
  void locale.value;
  return [
  { label: t("ss.attendance.status.Present"), value: totals.value.present, color: "#8bdc48" },
  { label: t("ss.attendance.status.Absent"), value: totals.value.absent, color: "#ef765f" },
  { label: t("ss.attendance.status.Late"), value: totals.value.late, color: "#f3ad35" },
];
});

const donutStyle = computed(() => {
  const total = distribution.value.reduce((sum, item) => sum + item.value, 0);
  if (!total) return { background: "#eceef2" };
  const presentEnd = (totals.value.present / total) * 100;
  const absentEnd = presentEnd + (totals.value.absent / total) * 100;
  return {
    background: `conic-gradient(#8bdc48 0 ${presentEnd}%, #ef765f ${presentEnd}% ${absentEnd}%, #f3ad35 ${absentEnd}% 100%)`,
  };
});

const chartMax = computed(() =>
  Math.max(1, ...monthlyRows.value.flatMap((row) => [row.present, row.absent, row.late]))
);
function chartX(index) {
  const count = monthlyRows.value.length;
  return count <= 1 ? 392 : 42 + (index * 700) / (count - 1);
}
function chartY(value) {
  return 214 - (Number(value || 0) / chartMax.value) * 190;
}
function chartPoints(field) {
  return monthlyRows.value
    .map((row, index) => `${chartX(index)},${chartY(row[field])}`)
    .join(" ");
}
function formatHours(minutes) {
  const value = Number(minutes) || 0;
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  if (mins) return t("ss.attendance.hoursMinutes", { h: hours, m: mins });
  return t("ss.attendance.hoursLabel", { h: hours });
}
function applyFilter() {
  appliedPeriod.value = selectedPeriod.value;
}
function resetFilter() {
  selectedPeriod.value = 3;
  appliedPeriod.value = 3;
}
async function load() {
  loading.value = true;
  error.value = "";
  try {
    const payload = await attendanceApiService.fetchMine();
    records.value = Array.isArray(payload.history) ? payload.history : [];
  } catch (e) {
    records.value = [];
    error.value = parseApiError(e) || t("ss.reports.loadError");
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style scoped>
.report-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 5px rgb(15 23 42 / 6%);
}

.count-badge {
  display: inline-flex;
  min-width: 20px;
  justify-content: center;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
}
</style>
