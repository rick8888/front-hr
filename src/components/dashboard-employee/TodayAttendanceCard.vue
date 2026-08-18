<template>
  <section
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6"
  >
    <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.dashboard2.attendance.title") }}</h2>

    <div
      v-if="loading"
      class="mt-6 flex min-h-[220px] flex-col items-center justify-center gap-2 text-sm text-neutral-500"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-amber-500"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>

    <div v-else class="mt-6 flex flex-col items-center text-center">
      <span
        class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100"
        aria-hidden="true"
      >
        <svg
          class="h-7 w-7 text-amber-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      </span>

      <p class="mt-4 text-sm font-medium text-neutral-700">{{ t("ss.dashboard2.attendance.checkInTime") }}</p>
      <p class="mt-1 text-base font-semibold text-primary-600">
        {{ attendance.checkInTime || "-" }}
      </p>

      <p class="mt-4 text-sm text-neutral-700">{{ t("ss.dashboard2.attendance.currentlyWorking") }}</p>
      <p class="mt-1 text-base font-semibold text-amber-500">
        {{ attendance.workingDuration || "-" }}
      </p>

      <span
        v-if="attendance.statusKey"
        :class="[
          'mt-4 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold text-white',
          statusClass,
        ]"
      >
        {{ statusLabel }}
      </span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  attendance: { type: Object, required: true },
  loading: { type: Boolean, default: false },
});

const { t, locale } = useI18n();

const statusLabel = computed(() => {
  void locale.value;
  const key = props.attendance.statusKey || "notCheckedIn";
  return t(`ss.dashboard2.attendance.${key}`);
});

const statusClass = computed(() => {
  const key = props.attendance.statusKey || "notCheckedIn";
  if (key === "inProgress") return "bg-amber-500";
  if (key === "checkedOut") return "bg-emerald-500";
  if (key === "onLeave") return "bg-rose-500";
  return "bg-neutral-500";
});
</script>
