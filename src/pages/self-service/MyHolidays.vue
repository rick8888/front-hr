<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
    <PageHero :title="t('ss.holidays.title')" :breadcrumbs="breadcrumbs" />

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- KPI cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SelfServiceKpiCard
        :title="t('ss.holidays.kpi.total')"
        :value="loading ? '—' : kpis.total"
        :note="t('ss.holidays.kpi.inYear', { year })"
        icon="calendar"
        tone="secondary"
        :colorize-value="false"
      />
      <SelfServiceKpiCard
        :title="t('ss.holidays.kpi.past')"
        :value="loading ? '—' : kpis.past"
        :note="t('ss.holidays.kpi.enjoyed')"
        icon="calendar"
        tone="neutral"
        :colorize-value="false"
      />
      <SelfServiceKpiCard
        :title="t('ss.holidays.kpi.upcoming')"
        :value="loading ? '—' : kpis.upcoming"
        :note="t('ss.holidays.kpi.remaining')"
        icon="calendar"
        tone="success"
        :colorize-value="false"
      />
    </section>

    <!-- Middle grid -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
      <div class="xl:col-span-2">
        <MyHolidaysCalendarCard
          :holidays="records"
          :year="year"
          :today="today"
        />
      </div>

      <div class="space-y-6">
        <MyHolidaysUpcomingCard :items="upcomingItems" />
        <HolidaysByMonthCard :groups="monthGroups" :today="today" />
      </div>
    </div>

    <!-- Full-width table -->
    <AllHolidaysTable
      :rows="records"
      :title="t('ss.holidays.allTitle', { year })"
      :today="today"
      :loading="loading"
    />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import SelfServiceKpiCard from "../../components/self-service/SelfServiceKpiCard.vue";
import MyHolidaysCalendarCard from "../../components/self-service/MyHolidaysCalendarCard.vue";
import MyHolidaysUpcomingCard from "../../components/self-service/MyHolidaysUpcomingCard.vue";
import HolidaysByMonthCard from "../../components/self-service/HolidaysByMonthCard.vue";
import AllHolidaysTable from "../../components/self-service/AllHolidaysTable.vue";
import { useMyHolidays } from "./composables/useMyHolidays.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("nav.attendance.holidays") },
    { label: t("ss.holidays.title") },
  ];
});

const {
  today,
  year,
  records,
  loading,
  error,
  kpis,
  upcomingItems,
  monthGroups,
} = useMyHolidays();
</script>
