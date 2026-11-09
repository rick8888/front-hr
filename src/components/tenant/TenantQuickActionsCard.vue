<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <h3 class="text-base font-bold text-neutral-900">{{ t("tenant.dashboard.quickActions") }}</h3>
    <div class="mt-4 space-y-3">
      <RouterLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        class="flex w-full items-center gap-3 rounded-lg border border-[#7c7cf8]/40 bg-white px-4 py-3 text-left text-sm font-semibold text-[#7c7cf8] transition-colors hover:bg-secondary-50/80"
      >
        <span
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-secondary-50 text-[#7c7cf8]"
          aria-hidden="true"
        >
          <component :is="iconComponent(action.icon)" class="h-4 w-4" />
        </span>
        {{ action.label }}
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { h } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

defineProps({
  actions: { type: Array, required: true },
});

function iconComponent(name) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    class: "h-4 w-4",
  };
  const icons = {
    document: () =>
      h("svg", common, [
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        }),
      ]),
    download: () =>
      h("svg", common, [
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4",
        }),
      ]),
    chart: () =>
      h("svg", common, [
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M3 3v18h18M7 16l4-4 4 4 6-6",
        }),
      ]),
  };
  return icons[name] || icons.document;
}
</script>
