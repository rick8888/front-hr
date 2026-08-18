<template>
  <section
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6"
  >
    <header class="flex items-start justify-between gap-3">
      <h2 class="text-base font-semibold text-neutral-900">
        {{ t("ss.dashboard2.recentActivities.title") }}
      </h2>
      <button
        type="button"
        class="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        :aria-label="t('ss.dashboard2.recentActivities.options')"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
    </header>

    <div role="tablist" class="mt-4 flex items-center gap-6 border-b border-neutral-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="[
          '-mb-px inline-flex items-center gap-1.5 border-b-2 pb-2.5 text-sm font-medium transition-colors',
          activeTab === tab.id
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-neutral-500 hover:text-neutral-700',
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-if="sectionLoading"
      class="mt-6 flex min-h-[140px] items-center justify-center gap-2 text-sm text-neutral-500"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>
    <ul
      v-else-if="visibleItems.length"
      role="list"
      class="mt-4 divide-y divide-neutral-100"
    >
      <li
        v-for="item in visibleItems"
        :key="item.id"
        class="flex items-start justify-between gap-3 py-3"
      >
        <div class="flex items-start gap-3">
          <span
            :class="[
              'mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md',
              iconWrapperClass,
            ]"
          >
            <component
              :is="iconComponent"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </span>
          <div>
            <p class="text-sm font-semibold text-neutral-900">
              {{ item.label }}
            </p>
            <p class="mt-0.5 text-xs text-neutral-500">{{ item.range }}</p>
            <span
              v-if="item.status"
              :class="[
                'mt-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                statusClass(item.status),
              ]"
            >
              {{ tStatus(item.status) }}
            </span>
          </div>
        </div>
        <span class="flex-shrink-0 text-xs text-neutral-400">
          {{ timeAgoLabel(item.occurredOn, today, t) }}
        </span>
      </li>
    </ul>

    <p v-else class="mt-6 text-center text-sm text-neutral-400">
      {{ t("ss.dashboard2.recentActivities.empty") }}
    </p>
  </section>
</template>

<script setup>
import { computed, h, ref } from "vue";
import { timeAgoLabel } from "../../data/dashboardEmployeeDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  today: { type: String, required: true },
  leaves: { type: Array, default: () => [] },
  expenses: { type: Array, default: () => [] },
  tasks: { type: Array, default: () => [] },
  loadingLeaves: { type: Boolean, default: false },
  loadingExpenses: { type: Boolean, default: false },
  loadingTasks: { type: Boolean, default: false },
  defaultTab: { type: String, default: "leaves" },
});

const { t, locale } = useI18n();

const tabs = computed(() => {
  void locale.value;
  return [
    { id: "leaves", label: t("ss.dashboard2.recentActivities.tab.leaves") },
    { id: "expenses", label: t("ss.dashboard2.recentActivities.tab.expenses") },
    { id: "tasks", label: t("ss.dashboard2.recentActivities.tab.tasks") },
  ];
});

const activeTab = ref(props.defaultTab);

const visibleItems = computed(() => {
  if (activeTab.value === "leaves") return props.leaves;
  if (activeTab.value === "expenses") return props.expenses;
  return props.tasks;
});

const sectionLoading = computed(() => {
  if (activeTab.value === "leaves") return props.loadingLeaves;
  if (activeTab.value === "expenses") return props.loadingExpenses;
  return props.loadingTasks;
});

const iconWrapperClass = computed(() => {
  if (activeTab.value === "expenses") return "bg-amber-50 text-amber-600";
  if (activeTab.value === "tasks") return "bg-emerald-50 text-emerald-600";
  return "bg-rose-50 text-rose-600";
});

const iconComponent = computed(() => {
  if (activeTab.value === "expenses") return ExpenseIcon;
  if (activeTab.value === "tasks") return TaskIcon;
  return LeaveIcon;
});

function tStatus(status) {
  const key = `ss.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

function statusClass(status) {
  const key = String(status || "").toLowerCase().replace(/\s+/g, "_");
  if (key === "approved" || key === "reimbursed" || key === "completed") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (key === "pending" || key === "in_progress") {
    return "bg-amber-50 text-amber-700";
  }
  if (key === "rejected" || key === "cancelled") {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-neutral-100 text-neutral-700";
}

const LeaveIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
      h("path", { d: "M16 3v4M8 3v4M3 11h18" }),
    ]
  );

const ExpenseIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("path", {
        d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z",
      }),
      h("polyline", { points: "14 2 14 8 20 8" }),
      h("path", { d: "M9 13h6M9 17h4" }),
    ]
  );

const TaskIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    [
      h("path", { d: "M9 11l3 3L22 4" }),
      h("path", {
        d: "M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
      }),
    ]
  );
</script>
