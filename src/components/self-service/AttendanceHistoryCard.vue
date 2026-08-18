<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <!-- Title row + date range -->
    <header
      class="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6"
    >
      <h2 class="text-base font-semibold text-neutral-900">{{ title }}</h2>
      <div class="w-56">
        <DateRangePicker
          :model-value="dateRange"
          :placeholder="t('ss.filters.selectDateRange')"
          @update:model-value="$emit('update:dateRange', $event)"
          @change="$emit('change-range', $event)"
        />
      </div>
    </header>

    <!-- Toolbar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-6"
    >
      <label class="flex items-center gap-2 text-sm text-neutral-600">
        {{ t("ss.filters.show") }}
        <select
          :value="pageSize"
          class="h-8 w-16 rounded-md border border-neutral-300 bg-white px-2 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @change="$emit('update:pageSize', Number($event.target.value))"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
        {{ t("ss.filters.entries") }}
      </label>

      <label class="flex items-center gap-2 text-sm text-neutral-600">
        {{ t("common.search") }}
        <input
          :value="searchQuery"
          type="search"
          class="h-8 w-56 rounded-md border border-neutral-300 px-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
      </label>
    </div>

    <!-- Table -->
    <div class="relative overflow-x-auto min-h-[220px]">
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white/80"
        role="status"
        aria-live="polite"
      >
        <span class="inline-flex items-center gap-2 text-sm text-neutral-500">
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
            aria-hidden="true"
          />
          {{ t("common.loading") }}
        </span>
      </div>

      <table class="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-y border-neutral-100 bg-neutral-50/40 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              :class="['px-5 py-3 md:px-6', col.align === 'right' ? 'text-right' : 'text-left']"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-5 py-16" aria-hidden="true" />
          </tr>
          <template v-else>
            <tr
              v-for="row in rows"
              :key="row.id"
              class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
            >
              <td class="px-5 py-3.5 md:px-6 text-neutral-700">{{ row.date }}</td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-600">{{ row.day }}</td>
              <td class="px-5 py-3.5 md:px-6">
                <span
                  v-if="row.checkIn"
                  class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                >
                  {{ row.checkIn }}
                </span>
                <span v-else class="text-neutral-400">--:--</span>
              </td>
              <td class="px-5 py-3.5 md:px-6">
                <span
                  v-if="row.checkOut"
                  class="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700"
                >
                  {{ row.checkOut }}
                </span>
                <span v-else class="text-neutral-400">--:--</span>
              </td>
              <td class="px-5 py-3.5 md:px-6 font-medium text-neutral-800">
                {{ formatDuration(row.totalMinutes) }}
              </td>
              <td class="px-5 py-3.5 md:px-6 text-neutral-500">
                {{ row.overtime ?? "--" }}
              </td>
              <td class="px-5 py-3.5 md:px-6">
                <span
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                    statusClass(row.status),
                  ]"
                >
                  {{ tAttendanceStatus(row.status) }}
                </span>
              </td>
              <td class="px-5 py-3.5 md:px-6">
                <button
                  type="button"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-colors hover:bg-sky-100"
                  :aria-label="`View ${row.date}`"
                  @click="$emit('view', row)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </button>
              </td>
            </tr>
            <tr v-if="!rows.length">
              <td
                :colspan="columns.length"
                class="px-5 py-10 text-center text-sm text-neutral-500"
              >
                {{ t("ss.attendance.empty") }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
    >
      <p class="text-sm text-neutral-500">
        {{ t("common.showingEntries", { from: rangeFrom, to: rangeTo, total }) }}
      </p>
      <nav class="flex flex-wrap items-center justify-end gap-2" aria-label="Pagination">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          {{ t("common.previous") }}
        </button>
        <template v-for="(item, idx) in visiblePages" :key="idx">
          <span
            v-if="item === 'ellipsis'"
            class="px-1 text-sm text-neutral-400"
          >...</span>
          <button
            v-else
            type="button"
            class="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md text-sm font-medium transition-colors"
            :class="
              item === currentPage
                ? 'bg-secondary-500 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100'
            "
            @click="$emit('update:currentPage', item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage >= pageCount"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          {{ t("common.next") }}
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { getVisiblePages } from "../../composables/useLeaveRequestsTable.js";
import DateRangePicker from "../common/DateRangePicker.vue";
import { useI18n } from "../../i18n/index.js";

defineEmits([
  "view",
  "update:currentPage",
  "update:pageSize",
  "update:searchQuery",
  "update:dateRange",
  "change-range",
]);

const props = defineProps({
  title: { type: String, default: "Attendance History" },
  rows: { type: Array, required: true },
  total: { type: Number, required: true },
  rangeFrom: { type: Number, default: 0 },
  rangeTo: { type: Number, default: 0 },
  currentPage: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  searchQuery: { type: String, default: "" },
  dateRange: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  pageSizeOptions: { type: Array, default: () => [10, 25, 50, 100] },
});

const { t, locale } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "date", label: t("common.date") },
    { key: "day", label: t("ss.attendance.col.day") },
    { key: "checkIn", label: t("ss.attendance.col.checkIn") },
    { key: "checkOut", label: t("ss.attendance.col.checkOut") },
    { key: "totalHours", label: t("common.totalHours") },
    { key: "overtime", label: t("ss.attendance.col.overtime") },
    { key: "status", label: t("common.status") },
    { key: "actions", label: t("common.actions") },
  ];
});

function tAttendanceStatus(status) {
  const key = `ss.attendance.status.${String(status || "").replace(/\s+/g, "_")}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

const STATUS_CLASSES = {
  "Checked in": "bg-secondary-50 text-secondary-700",
  Present: "bg-emerald-50 text-emerald-700",
  Absent: "bg-rose-50 text-rose-700",
  Late: "bg-amber-50 text-amber-700",
  "Half Day": "bg-sky-50 text-sky-700",
};

function statusClass(status) {
  return STATUS_CLASSES[status] || "bg-neutral-100 text-neutral-700";
}

function formatDuration(minutes) {
  if (minutes == null) return "--";
  const m = Number(minutes) || 0;
  if (m === 0) return "0m";
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r}m`;
  if (r === 0) return `${h}h`;
  return `${h}h ${r}m`;
}

const visiblePages = computed(() =>
  getVisiblePages(props.currentPage, props.pageCount),
);
</script>
