<template>
  <aside
    class="relative min-h-[280px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs"
    :aria-busy="loading"
  >
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ t("ss.leave.policiesTitle") }}</h2>
    </header>

    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 text-sm text-neutral-500"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>

    <ul class="divide-y divide-neutral-100">
      <li v-for="policy in policies" :key="policy.id">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-neutral-50 md:px-6"
          :aria-expanded="openId === policy.id"
          @click="toggle(policy.id)"
        >
          <span class="text-sm font-medium text-neutral-800">{{ policy.name }}</span>
          <svg class="h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform" :class="openId === policy.id ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="openId === policy.id" class="px-5 pb-5 md:px-6">
          <p class="mb-3 text-xs text-neutral-500">{{ policy.description || t("ss.leave.noDescription") }}</p>
          <dl class="space-y-1.5 text-sm">
            <div class="flex items-center justify-between">
              <dt class="text-neutral-600">{{ t("ss.leave.annualEntitlement") }}:</dt>
              <dd class="font-semibold text-neutral-800">{{ formatDays(policy.annualEntitlement) }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-neutral-600">{{ t("ss.leave.additional") }}:</dt>
              <dd class="font-semibold text-neutral-800">{{ formatDays(policy.additional, 2) }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-neutral-600">{{ t("ss.leave.col.used") }}:</dt>
              <dd class="font-semibold text-amber-600">{{ formatDays(policy.used, decimalsForUsed(policy.used)) }}</dd>
            </div>
          </dl>
          <div class="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
            <span class="text-sm font-medium text-neutral-700">{{ t("ss.leave.col.available") }}:</span>
            <span class="text-sm font-semibold text-emerald-600">
              {{ formatDays(getPolicyAvailable(policy), decimalsForUsed(policy.used)) }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import { getPolicyAvailable } from "../../data/leavePoliciesDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  policies: { type: Array, required: true },
  defaultOpenId: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});

const { t } = useI18n();
const openId = ref(props.defaultOpenId || (props.policies[0]?.id ?? ""));

watch(
  () => props.policies,
  (list) => {
    if (!openId.value && list?.[0]?.id) openId.value = list[0].id;
  },
  { immediate: true },
);

function toggle(id) {
  openId.value = openId.value === id ? "" : id;
}

function formatDays(n, decimals = 0) {
  const value = Number(n) || 0;
  return t("ss.leave.daysFormat", { n: value.toFixed(decimals) });
}

function decimalsForUsed(value) {
  return Number.isInteger(Number(value)) ? 0 : 1;
}
</script>
