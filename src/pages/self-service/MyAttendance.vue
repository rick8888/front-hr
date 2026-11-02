<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero
      :title="t('ss.attendance.title')"
      :breadcrumbs="breadcrumbs"
    />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- KPIs -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AttendanceKpiCard
        :title="t('ss.attendance.kpi.present')"
        :value="summary.presentDays"
        :note="summary.monthLabel"
        icon="check"
        tone="success"
        :loading="loading"
      />
      <AttendanceKpiCard
        :title="t('ss.attendance.kpi.absent')"
        :value="summary.absentDays"
        :note="summary.monthLabel"
        icon="x"
        tone="danger"
        :loading="loading"
      />
      <AttendanceKpiCard
        :title="t('ss.attendance.kpi.late')"
        :value="summary.lateArrivals"
        :note="summary.monthLabel"
        icon="clock"
        tone="warning"
        :loading="loading"
      />
      <AttendanceKpiCard
        :title="t('ss.attendance.kpi.halfDays')"
        :value="summary.halfDays"
        :note="summary.monthLabel"
        icon="hourglass"
        tone="info"
        :loading="loading"
      />
    </section>

    <!-- Today -->
    <AttendanceTodayStatus
      :date="today.date"
      :has-record="today.hasRecord"
      :message="today.message"
      :loading="loading"
    >
      <template v-if="today.record" #record>
        <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-700">
          <span>
            {{ t("ss.attendance.checkIn") }}:
            <strong class="text-emerald-700">{{ today.record.checkIn || "--:--" }}</strong>
          </span>
          <span>
            {{ t("ss.attendance.checkOut") }}:
            <strong class="text-rose-700">{{ today.record.checkOut || "--:--" }}</strong>
          </span>
          <span>
            {{ t("ss.attendance.col.break") }}:
            <strong class="text-amber-700">{{ formatDuration(today.record.breakMinutes) }}</strong>
          </span>
          <span
            class="inline-flex items-center rounded-md bg-secondary-50 px-2 py-1 text-xs font-medium text-secondary-700"
          >
            {{ attendanceStatusLabel(today.record.status) }}
          </span>
        </div>
      </template>
    </AttendanceTodayStatus>

    <!-- History -->
    <AttendanceHistoryCard
      :title="t('ss.attendance.history')"
      :rows="paginatedRows"
      :total="totalFiltered"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      :date-range="dateRange"
      :loading="loading"
      @update:current-page="page = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
      @update:date-range="dateRange = $event"
      @change-range="onChangeRange"
      @view="onViewRow"
    />

    <!-- Detail modal -->
    <AttendanceDetailsModal
      v-model="detailOpen"
      :record="selectedRecord"
    />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import AttendanceKpiCard from "../../components/self-service/AttendanceKpiCard.vue";
import AttendanceTodayStatus from "../../components/self-service/AttendanceTodayStatus.vue";
import AttendanceHistoryCard from "../../components/self-service/AttendanceHistoryCard.vue";
import AttendanceDetailsModal from "../../components/self-service/AttendanceDetailsModal.vue";
import { useMyAttendance } from "./composables/useMyAttendance.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("nav.attendance") },
    { label: t("ss.attendance.title") },
  ];
});

const {
  loading,
  error,
  summary,
  today,
  dateRange,
  searchQuery,
  page,
  pageSize,
  totalFiltered,
  pageCount,
  paginatedRows,
  rangeLabel,
  onChangeRange,
} = useMyAttendance();

const detailOpen = ref(false);
const selectedRecord = ref(null);

function onViewRow(row) {
  selectedRecord.value = row;
  detailOpen.value = true;
}

function formatDuration(minutes) {
  const total = Number(minutes) || 0;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return hours ? `${hours}h ${String(rest).padStart(2, "0")}m` : `${rest}m`;
}

function attendanceStatusLabel(status) {
  const key = `ss.attendance.status.${String(status || "").replace(/\s+/g, "_")}`;
  const translated = t(key);
  return translated === key ? status : translated;
}
</script>
