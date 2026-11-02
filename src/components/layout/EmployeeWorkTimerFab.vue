<template>
  <button
    type="button"
    :class="[
      'group fixed right-0 top-1/2 z-[45] flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl px-2.5 py-4 text-white shadow-[0_4px_14px_rgba(5,150,105,0.45)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      fabClass,
    ]"
    :aria-label="ariaLabel"
    @click="open = true"
  >
    <span
      class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30"
      aria-hidden="true"
    >
      <svg
        class="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          :d="fabIconPath"
        />
      </svg>
    </span>
    <span
      class="max-w-[4rem] text-center text-[11px] font-bold leading-tight tracking-tight"
    >
      {{ durationLabel }}
    </span>
  </button>

  <EmployeeAttendanceModal
    v-model="open"
    :today-iso="todayIso"
    :title="modalTitle"
    :phase="phase"
    :loading="loading"
    :acting="acting"
    :error="error"
    :summary="summary"
    @check-in="checkIn"
    @check-out="checkOut"
    @start-break="startBreak"
    @end-break="endBreak"
    @open="load"
  />
</template>

<script setup>
import { computed } from "vue";
import EmployeeAttendanceModal from "./EmployeeAttendanceModal.vue";
import { useEmployeeWorkTimer } from "../../composables/useEmployeeWorkTimer.js";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const {
  open,
  loading,
  acting,
  error,
  summary,
  durationLabel,
  modalTitle,
  todayIso,
  phase,
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  load,
} = useEmployeeWorkTimer();

const ariaLabel = computed(() => {
  if (phase.value === "break") return t("ss.attendance.modal.ariaBreak");
  if (phase.value === "in") return t("ss.attendance.modal.ariaIn");
  if (phase.value === "done") return t("ss.attendance.modal.ariaOut");
  return t("ss.attendance.modal.ariaReady");
});

const fabClass = computed(() => {
  if (phase.value === "break") {
    return "bg-amber-500 hover:bg-amber-600 focus-visible:outline-amber-500 shadow-[0_4px_14px_rgba(245,158,11,0.45)]";
  }
  if (phase.value === "in") {
    return "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600";
  }
  if (phase.value === "done") {
    return "bg-sky-600 hover:bg-sky-700 focus-visible:outline-sky-600 shadow-[0_4px_14px_rgba(2,132,199,0.45)]";
  }
  return "bg-amber-500 hover:bg-amber-600 focus-visible:outline-amber-500 shadow-[0_4px_14px_rgba(245,158,11,0.45)]";
});

const fabIconPath = computed(() => {
  if (phase.value === "break") return "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z";
  if (phase.value === "in") return "M5 13l4 4L19 7";
  if (phase.value === "done") return "M9 12h12m0 0l-4-4m4 4l-4 4M3 4v16";
  return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
});
</script>
