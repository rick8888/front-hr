<template>
  <div v-if="loading" class="px-4 py-16 sm:px-8 max-w-lg mx-auto text-center">
    <span
      class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
      aria-hidden="true"
    />
    <p class="mt-4 text-sm text-neutral-600">{{ t("admin.payroll.show.loading") }}</p>
  </div>

  <div v-else-if="error" class="px-4 py-10 sm:px-8 max-w-3xl mx-auto">
    <p class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700" role="alert">
      {{ error }}
    </p>
    <RouterLink to="/payroll/records" class="btn-secondary inline-flex mt-6">
      {{ t("admin.payroll.show.backToList") }}
    </RouterLink>
  </div>

  <div v-else-if="detail" class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6">
    <header class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">
          {{ t("admin.payroll.adjustments.title") }}
        </h1>
        <p class="mt-1 text-sm text-neutral-600">
          {{ detail.employeeName }} · {{ detail.periodLabel }}
        </p>
      </div>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center gap-1"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.dashboard") }}
        </RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/records" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.payroll") }}
        </RouterLink>
        <span>/</span>
        <RouterLink :to="`/payroll/show/${detail.id}`" class="hover:text-secondary-600">
          {{ detail.payrollNumber }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">
          {{ t("admin.payroll.adjustments.breadcrumb") }}
        </span>
      </nav>
    </header>

    <section class="rounded-xl border border-amber-200 bg-amber-50 p-5" role="status">
      <h2 class="font-semibold text-amber-950">
        {{ t("admin.payroll.adjustments.unavailableTitle") }}
      </h2>
      <p class="mt-2 text-sm text-amber-900">
        {{ t("admin.payroll.adjustments.unavailableDescription") }}
      </p>
    </section>

    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-neutral-200">
        <h2 class="text-base font-semibold text-neutral-900">
          {{ t("admin.payroll.adjustments.info") }}
        </h2>
        <p class="mt-1 text-sm text-neutral-500">
          {{ detail.payrollNumber }} · {{ statusLabel }}
        </p>
      </div>
      <dl class="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt class="text-sm text-neutral-500">{{ t("admin.payroll.adjustments.basicSalary") }}</dt>
          <dd class="mt-1 font-semibold text-neutral-900">{{ formatMoney(detail.basicSalary) }}</dd>
        </div>
        <div>
          <dt class="text-sm text-neutral-500">{{ t("admin.payroll.col.grossSalary") }}</dt>
          <dd class="mt-1 font-semibold text-neutral-900">{{ formatMoney(detail.grossSalary) }}</dd>
        </div>
        <div>
          <dt class="text-sm text-neutral-500">{{ t("admin.payroll.adjustments.totalDeductions") }}</dt>
          <dd class="mt-1 font-semibold text-error-700">{{ formatMoney(detail.totalDeductions) }}</dd>
        </div>
        <div>
          <dt class="text-sm text-neutral-500">{{ t("admin.payroll.col.netSalary") }}</dt>
          <dd class="mt-1 font-semibold text-success-700">{{ formatMoney(detail.netSalary) }}</dd>
        </div>
      </dl>
    </section>

    <RouterLink
      :to="`/payroll/show/${detail.id}`"
      class="btn-outline inline-flex items-center justify-center gap-2 text-sm"
    >
      {{ t("admin.payroll.adjustments.back") }}
    </RouterLink>
  </div>

  <div v-else class="px-4 py-10 sm:px-8 max-w-lg mx-auto text-center">
    <p class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.show.notFound") }}</p>
    <p class="text-sm text-neutral-600 mt-2">{{ t("admin.payroll.show.notFoundHint") }}</p>
    <RouterLink to="/payroll/records" class="btn-secondary inline-flex mt-6">
      {{ t("admin.payroll.show.backToList") }}
    </RouterLink>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../../i18n/index.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { payrollApiService } from "./services/payroll.api.service.js";
import { mapPayrollShowFromApi } from "./mappers/payroll-show.mapper.js";

const route = useRoute();
const { t, bcp47 } = useI18n();
const detail = ref(null);
const loading = ref(false);
const error = ref("");

const statusLabel = computed(() => {
  const key = detail.value?.status;
  return key ? t(`admin.payroll.status.${key}`) : "";
});

function formatMoney(amount) {
  return new Intl.NumberFormat(bcp47.value, {
    style: "currency",
    currency: detail.value?.currency || "USD",
  }).format(Number(amount) || 0);
}

async function loadPayroll() {
  detail.value = null;
  error.value = "";
  loading.value = true;
  try {
    const raw = await payrollApiService.fetchById(route.params.id);
    detail.value = mapPayrollShowFromApi(raw, bcp47.value);
  } catch (requestError) {
    error.value = parseApiError(requestError) || t("admin.payroll.show.notFoundHint");
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.id,
  () => {
    loadPayroll();
  },
  { immediate: true },
);

watch(
  () => detail.value?.payrollNumber,
  (number) => {
    document.title = number
      ? t("admin.payroll.adjustments.docTitle", { number })
      : t("admin.payroll.adjustments.title");
  },
  { immediate: true },
);
</script>
