<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <PageHero
      :title="t('admin.leave.calendar.title')"
      :breadcrumbs="breadcrumbs"
    />

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <TeamCalendarFiltersPanel
      :draft="draftFilters"
      :designation-options="designationOptions"
      :leave-type-options="leaveTypeOptions"
      :status-options="statusOptions"
      @update:draft="draftFilters = $event"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <div class="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div class="min-w-0 flex-1">
        <TeamLeaveCalendar
          :subtitle="monthSubtitle"
          :weeks="weeks"
          :segments-by-week="segmentsByWeek"
          :loading="loading"
          @today="goThisMonth"
          @prev-month="prevMonth"
          @next-month="nextMonth"
        />
      </div>

      <aside class="flex w-full shrink-0 flex-col gap-6 xl:w-80">
        <OnLeaveTodayCard
          :date-label="onLeaveDateLabel"
          :members="onLeaveMembers"
          :loading="loading"
        />
        <TeamStatisticsCard :stats="teamStats" :loading="loading" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import TeamCalendarFiltersPanel from "../../components/leave-management/TeamCalendarFiltersPanel.vue";
import TeamLeaveCalendar from "../../components/leave-management/TeamLeaveCalendar.vue";
import OnLeaveTodayCard from "../../components/leave-management/OnLeaveTodayCard.vue";
import TeamStatisticsCard from "../../components/leave-management/TeamStatisticsCard.vue";
import { useTeamCalendar } from "../leave/composables/useTeamCalendar.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("admin.leave.management"), to: "/leave-requests" },
    { label: t("admin.leave.calendar.breadcrumb") },
  ];
});

const {
  loading,
  error,
  draftFilters,
  designationOptions,
  leaveTypeOptions,
  statusOptions,
  monthSubtitle,
  weeks,
  segmentsByWeek,
  onLeaveDateLabel,
  onLeaveMembers,
  teamStats,
  loadData,
  applyFilters,
  resetFilters,
  goThisMonth,
  prevMonth,
  nextMonth,
} = useTeamCalendar();

onMounted(() => {
  loadData();
});
</script>
