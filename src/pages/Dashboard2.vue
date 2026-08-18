<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <WelcomeBanner
        :name="user.name"
        :greeting="user.greeting"
        :subtitle="user.subtitle"
      />

      <QuickActionsCard :actions="quickActions" @action="onQuickAction" />

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Dashboard2KpiCard
          :title="t('ss.dashboard2.kpi.weekHours')"
          :value="weekHoursLabel"
          :note="t('ss.dashboard2.kpi.thisWeek')"
          icon="clock"
          note-icon="trendUp"
          tone="secondary"
          :loading="loadingAttendance"
        />
        <Dashboard2KpiCard
          :title="t('ss.dashboard2.kpi.monthHours')"
          :value="monthHoursLabel"
          :note="t('ss.dashboard2.kpi.thisMonth')"
          icon="calendar"
          note-icon="calendar"
          tone="info"
          :loading="loadingAttendance"
        />
        <Dashboard2KpiCard
          :title="t('ss.dashboard2.kpi.totalLeaves')"
          :value="kpis.totalLeaves"
          :note="leavesNote"
          icon="leave"
          tone="warning"
          :loading="loadingLeaves"
        />
        <Dashboard2KpiCard
          :title="t('ss.dashboard2.kpi.myTasks')"
          :value="kpis.myTasks"
          :note="tasksNote"
          icon="task"
          tone="success"
          :loading="loadingTasks"
        />
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
        <div class="xl:col-span-2">
          <RecentActivitiesCard
            :today="today"
            :leaves="recentActivities.leaves"
            :expenses="recentActivities.expenses"
            :tasks="recentActivities.tasks"
            :loading-leaves="loadingLeaves"
            :loading-expenses="loadingExpenses"
            :loading-tasks="loadingTasks"
          />
        </div>
        <TodayAttendanceCard
          :attendance="attendance"
          :loading="loadingAttendance"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import WelcomeBanner from "../components/dashboard-employee/WelcomeBanner.vue";
import QuickActionsCard from "../components/dashboard-employee/QuickActionsCard.vue";
import Dashboard2KpiCard from "../components/dashboard-employee/Dashboard2KpiCard.vue";
import RecentActivitiesCard from "../components/dashboard-employee/RecentActivitiesCard.vue";
import TodayAttendanceCard from "../components/dashboard-employee/TodayAttendanceCard.vue";
import { useDashboard2 } from "./self-service/composables/useDashboard2.js";
import { attendanceApiService } from "./self-service/services/attendance.api.service.js";
import { parseApiError } from "../utils/apiErrors.js";
import { useI18n } from "../i18n/index.js";

const router = useRouter();
const { t } = useI18n();
const punching = ref(false);

const {
  error,
  loadingAttendance,
  loadingLeaves,
  loadingExpenses,
  loadingTasks,
  today,
  user,
  kpis,
  attendance,
  recentActivities,
  weekHoursLabel,
  monthHoursLabel,
  leavesNote,
  tasksNote,
  loadAttendance,
  quickActions,
} = useDashboard2({ punching });

async function punch(kind) {
  if (punching.value) return;
  punching.value = true;
  error.value = "";
  try {
    if (kind === "checkIn") {
      await attendanceApiService.checkIn();
    } else {
      await attendanceApiService.checkOut();
    }
    await loadAttendance();
  } catch (e) {
    error.value =
      parseApiError(e) ||
      (kind === "checkIn" ? t("ss.dashboard2.checkInError") : t("ss.dashboard2.checkOutError"));
  } finally {
    punching.value = false;
  }
}

function onQuickAction(action) {
  switch (action.id) {
    case "checkIn":
      punch("checkIn");
      break;
    case "checkOut":
      if (!action.disabled) punch("checkOut");
      break;
    case "applyLeave":
      router.push("/self-service/leave-requests/new");
      break;
    case "submitExpense":
      router.push("/self-service/expenses");
      break;
    case "myProfile":
      router.push("/profile");
      break;
    default:
      break;
  }
}
</script>
