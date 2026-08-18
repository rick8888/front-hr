<template>
  <section
    class="mb-6 rounded-xl border border-neutral-200 bg-white px-5 py-4 md:px-6 md:py-5 shadow-xs"
  >
    <dl class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="item in items" :key="item.label">
        <dt class="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {{ item.label }}
        </dt>
        <dd class="mt-1 text-sm font-medium text-neutral-900">
          {{ item.value || "-" }}
        </dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  employee: {
    type: Object,
    required: true,
  },
});

const { t, locale } = useI18n();

const items = computed(() => {
  void locale.value;
  return [
    { label: t("common.employee"), value: props.employee?.employee },
    { label: t("common.code"), value: props.employee?.employeeCode },
    { label: t("admin.leave.balances.col.designation"), value: props.employee?.designation },
    { label: t("admin.leave.balances.col.team"), value: props.employee?.team },
  ];
});
</script>
