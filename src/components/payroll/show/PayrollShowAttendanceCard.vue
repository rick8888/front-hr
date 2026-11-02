<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-neutral-200 flex items-center gap-2">
      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h2 class="text-lg font-semibold text-neutral-900">
        {{ t("admin.payroll.show.attendance.title") }}
      </h2>
    </div>
    <div class="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="item in items"
        :key="item.label"
        class="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4"
      >
        <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ item.label }}</p>
        <p class="text-lg font-bold mt-1 tabular-nums" :class="item.valueClass">{{ item.value }}</p>
        <p v-if="item.hint" class="text-[11px] text-neutral-500 mt-0.5">{{ item.hint }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../../i18n/index.js";

const props = defineProps({
  attendance: { type: Object, required: true },
});
const { t } = useI18n();

function days(n) {
  return `${Number(n || 0).toFixed(1)} j`;
}

const items = computed(() => {
  const a = props.attendance || {};
  const result = [
    {
      label: t("admin.payroll.show.attendance.workingDays"),
      value: days(a.workingDays),
      valueClass: "text-neutral-900",
    },
    {
      label: t("admin.payroll.show.attendance.daysWorked"),
      value: days(a.daysWorked),
      valueClass: "text-green-700",
    },
    {
      label: t("admin.payroll.show.attendance.paidLeave"),
      value: days(a.leaveDays),
      valueClass: "text-amber-700",
    },
    {
      label: t("admin.payroll.show.attendance.unpaidLeave"),
      value: days(a.unpaidLeaveDays),
      valueClass: "text-neutral-700",
    },
    {
      label: t("admin.payroll.show.attendance.payableDays"),
      value: days(a.payableDays),
      valueClass: "text-primary-700",
    },
    {
      label: t("admin.payroll.show.attendance.overtime"),
      value: `${Number(a.overtimeHours ?? 0).toFixed(1)} h`,
      valueClass: "text-sky-700",
    },
  ];

  if (a.hasAbsenceBreakdown) {
    result.splice(
      3,
      0,
      {
        label: t("admin.payroll.show.attendance.recordedAbsences"),
        value: days(a.recordedAbsentDays),
        valueClass: "text-red-600",
      },
      {
        label: t("admin.payroll.show.attendance.noShows"),
        value: days(a.noShowDays),
        valueClass: "text-red-600",
      },
      {
        label: t("admin.payroll.show.attendance.pending"),
        value: days(a.pendingAttendanceDays),
        valueClass: "text-amber-700",
      },
    );
  } else {
    result.splice(3, 0, {
      label: t("admin.payroll.show.attendance.totalAbsences"),
      value: days(a.absentDays),
      valueClass: "text-red-600",
    });
  }

  return result;
});
</script>
