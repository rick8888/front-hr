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
      <h2 class="text-lg font-semibold text-neutral-900">Attendance Summary</h2>
    </div>
    <div class="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="item in items"
        :key="item.label"
        class="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4 text-center"
      >
        <div
          class="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2"
          :class="item.iconClass"
        >
          <component :is="item.icon" class="w-6 h-6" />
        </div>
        <p class="text-xs text-neutral-500 uppercase tracking-wide">{{ item.label }}</p>
        <p class="text-lg font-bold text-neutral-900 mt-1 tabular-nums">{{ item.value }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, h } from "vue";

const props = defineProps({
  attendance: { type: Object, required: true },
});

function iconPath(d) {
  return {
    render() {
      return h(
        "svg",
        { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        [h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d })]
      );
    },
  };
}

const items = computed(() => {
  const a = props.attendance || {};
  return [
    {
      label: "Days Worked",
      value: Number(a.daysWorked ?? 0).toFixed(1),
      iconClass: "bg-green-100 text-green-700",
      icon: iconPath("M5 13l4 4L19 7"),
    },
    {
      label: "Absent Days",
      value: a.absentDays ?? 0,
      iconClass: "bg-red-100 text-red-600",
      icon: iconPath("M6 18L18 6M6 6l12 12"),
    },
    {
      label: "Leave Days",
      value: a.leaveDays ?? 0,
      iconClass: "bg-amber-100 text-amber-700",
      icon: iconPath("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"),
    },
    {
      label: "Overtime Hours",
      value: Number(a.overtimeHours ?? 0).toFixed(1),
      iconClass: "bg-sky-100 text-sky-700",
      icon: iconPath("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"),
    },
  ];
});
</script>
