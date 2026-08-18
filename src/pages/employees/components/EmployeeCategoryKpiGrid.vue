<template>
  <div class="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
    <KpiCard
      v-for="card in cards"
      :key="card.key"
      :title="card.label"
      :value="card.value"
      :subtitle="card.hint"
      :unit-label="t('admin.employees.unit')"
      :tone="card.tone"
      :loading="loading"
    >
      <template #icon>
        <component :is="card.icon" class="w-5 h-5" />
      </template>
    </KpiCard>
  </div>
</template>

<script setup>
import { computed, h } from "vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import { useI18n } from "../../../i18n/index.js";

const { t, locale } = useI18n();

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const IconUser = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    }),
  ]);

const IconUserCheck = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9 12l2 2 4-4m5.5 2a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z",
    }),
  ]);

const IconUserMinus = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
    }),
  ]);

const IconUserX = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M15 9l-6 6m0-6l6 6m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    }),
  ]);

const cards = computed(() => {
  void locale.value;
  return [
    {
      key: "total",
      label: t("admin.employees.kpi.total"),
      value: props.stats.total,
      hint: t("admin.employees.kpi.all"),
      icon: IconUser,
      tone: "violet",
    },
    {
      key: "active",
      label: t("admin.employees.kpi.active"),
      value: props.stats.active,
      hint: t("admin.employees.kpi.activeHint"),
      icon: IconUserCheck,
      tone: "green",
    },
    {
      key: "inactive",
      label: t("admin.employees.kpi.inactive"),
      value: props.stats.inactive,
      hint: t("admin.employees.kpi.inactiveHint"),
      icon: IconUserMinus,
      tone: "neutral",
    },
    {
      key: "exited",
      label: t("admin.employees.kpi.exited"),
      value: props.stats.exited,
      hint: t("admin.employees.kpi.exitedHint"),
      icon: IconUserX,
      tone: "red",
    },
  ];
});
</script>
