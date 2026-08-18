<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 space-y-6">
    <PageHero
      :title="payslip?.code || t('payslips.detail.info')"
      :breadcrumbs="breadcrumbs"
    />

    <div
      v-if="error && !loading"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500 align-middle"
        aria-hidden="true"
      />
      <span class="ml-2">{{ t("payslips.detail.loading") }}</span>
    </div>

    <div
      v-else-if="!payslip"
      class="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500"
    >
      {{ t("payslips.detail.notFound") }}
      <RouterLink
        to="/self-service/payslips"
        class="ml-2 font-medium text-secondary-600 hover:text-secondary-700"
      >
        {{ t("payslips.detail.back") }}
      </RouterLink>
    </div>

    <template v-else>
      <div class="flex items-center justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600 disabled:opacity-60"
          :disabled="downloading"
          @click="onDownload"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
            />
          </svg>
          {{ downloading ? t("payslips.detail.downloading") : t("payslips.detail.download") }}
        </button>
      </div>

      <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
        <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
          <h2 class="text-base font-semibold text-neutral-900">{{ t("payslips.detail.info") }}</h2>
        </header>
        <div class="grid grid-cols-1 gap-x-8 gap-y-5 px-5 py-5 md:grid-cols-2 md:px-6 md:py-6">
          <InfoField :label="t('payslips.detail.code')" :value="payslip.code" />
          <InfoField :label="t('payslips.detail.period')" :value="payslip.periodLabel" />
          <InfoField :label="t('payslips.detail.employee')" :value="employee.name" />
          <InfoField :label="t('payslips.detail.department')" :value="employee.department" />
          <InfoField :label="t('payslips.detail.designation')" :value="employee.designation" />
          <InfoField :label="t('payslips.detail.status')">
            <span
              :class="[
                'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium',
                statusClass(payslip.status),
              ]"
            >
              {{ tStatus(payslip.status) }}
            </span>
          </InfoField>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
          <header class="border-b border-emerald-100 bg-emerald-50/70 px-5 py-4 md:px-6">
            <h3 class="text-base font-semibold text-neutral-900">{{ t("payslips.detail.earnings") }}</h3>
          </header>
          <div class="divide-y divide-neutral-100 px-5 md:px-6">
            <template v-if="payslip.earnings?.length">
              <div
                v-for="(line, idx) in payslip.earnings"
                :key="`earn-${idx}`"
                class="flex items-center justify-between py-4 text-sm"
              >
                <span class="text-neutral-600">{{ line.label }}</span>
                <span class="font-semibold text-neutral-900">{{ formatAmount(line.amount) }}</span>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center justify-between py-4 text-sm">
                <span class="text-neutral-600">{{ t("payslips.detail.basic") }}</span>
                <span class="font-semibold text-neutral-900">{{
                  formatAmount(payslip.basicSalary)
                }}</span>
              </div>
              <div class="flex items-center justify-between py-4 text-sm">
                <span class="text-neutral-600">{{ t("payslips.detail.allowances") }}</span>
                <span class="font-semibold text-neutral-900">{{
                  formatAmount(payslip.allowances)
                }}</span>
              </div>
            </template>
            <div class="flex items-center justify-between py-4 text-sm">
              <span class="font-semibold text-neutral-900">{{ t("payslips.detail.totalEarnings") }}</span>
              <span class="font-bold text-emerald-600">{{
                formatAmount(payslip.totalEarnings)
              }}</span>
            </div>
          </div>
        </article>

        <article class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
          <header class="border-b border-rose-100 bg-rose-50/70 px-5 py-4 md:px-6">
            <h3 class="text-base font-semibold text-neutral-900">{{ t("payslips.detail.deductions") }}</h3>
          </header>
          <div class="divide-y divide-neutral-100 px-5 md:px-6">
            <div class="flex items-center justify-between py-4 text-sm">
              <span class="font-semibold text-neutral-900">{{ t("payslips.detail.totalDeductions") }}</span>
              <span class="font-bold text-rose-600">{{ formatAmount(payslip.deductions) }}</span>
            </div>
            <div class="py-4 text-sm">
              <p class="text-neutral-500">{{ t("payslips.detail.deductionDetails") }}</p>
              <ul v-if="payslip.deductionDetails?.length" class="mt-2 space-y-1.5">
                <li
                  v-for="(d, idx) in payslip.deductionDetails"
                  :key="idx"
                  class="flex items-center justify-between text-neutral-700"
                >
                  <span>{{ d.label }}</span>
                  <span class="font-medium">{{ formatAmount(d.amount) }}</span>
                </li>
              </ul>
              <p v-else class="mt-2 text-neutral-400">{{ t("payslips.detail.noDeductions") }}</p>
            </div>
          </div>
        </article>
      </section>

      <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
        <div
          class="flex flex-col items-start justify-between gap-2 px-5 py-5 md:flex-row md:items-center md:px-6"
        >
          <h2 class="text-lg font-semibold text-neutral-900">{{ t("payslips.detail.net") }}</h2>
          <p class="text-2xl font-bold text-emerald-500 md:text-3xl">
            {{ formatAmount(payslip.netSalary) }}
          </p>
        </div>
      </section>

      <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
        <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
          <h2 class="text-base font-semibold text-neutral-900">{{ t("payslips.detail.attendance") }}</h2>
        </header>
        <div class="grid grid-cols-2 gap-x-6 gap-y-5 px-5 py-5 md:grid-cols-4 md:px-6 md:py-6">
          <InfoField label="Working Days" :value="payslip.attendance?.workingDays ?? 0" />
          <InfoField label="Worked Days" :value="payslip.attendance?.workedDays ?? 0" />
          <InfoField label="Leave Days" :value="payslip.attendance?.leaveDays ?? 0" />
          <InfoField label="Absent Days" :value="payslip.attendance?.absentDays ?? 0" />
          <InfoField label="Late Days" :value="payslip.attendance?.lateDays ?? 0" />
          <InfoField
            label="Early Checkout Days"
            :value="payslip.attendance?.earlyCheckoutDays ?? 0"
          />
          <InfoField label="Overtime Days" :value="payslip.attendance?.overtimeDays ?? 0" />
          <InfoField label="Holidays" :value="payslip.attendance?.holidays ?? 0" />
        </div>
      </section>

      <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
        <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
          <h2 class="text-base font-semibold text-neutral-900">{{ t("payslips.detail.notes") }}</h2>
        </header>
        <p class="px-5 py-5 text-sm text-neutral-700 md:px-6">
          {{ payslip.notes || "—" }}
        </p>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import InfoField from "../../components/self-service/PayslipInfoField.vue";
import { useMyPayslipShow } from "./composables/useMyPayslipShow.js";
import { useI18n } from "../../i18n/index.js";

const {
  payslip,
  employee,
  loading,
  downloading,
  error,
  onDownload,
  formatAmount,
  statusClass,
} = useMyPayslipShow();

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("payslips.title"), to: "/self-service/payslips" },
    { label: payslip.value?.code || t("ss.details") },
  ];
});

function tStatus(status) {
  const key = `payslips.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
}
</script>
