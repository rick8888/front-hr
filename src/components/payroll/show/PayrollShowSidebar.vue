<template>
  <aside class="space-y-6">
    <!-- Actions haut de colonne (maquette) -->
    <div class="flex flex-col sm:flex-row lg:flex-col gap-2">
      <button
        type="button"
        class="btn-secondary inline-flex items-center justify-center gap-2 w-full"
        :disabled="downloading"
        @click="$emit('download-pdf')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
          />
        </svg>
        {{ downloading ? t("admin.payroll.show.downloading") : t("admin.payroll.show.downloadPdf") }}
      </button>
      <RouterLink
        :to="backTo"
        class="btn-outline inline-flex items-center justify-center gap-2 w-full text-sm"
        @click="$emit('back')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to List
      </RouterLink>
    </div>

    <!-- Pay Period -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-sm font-semibold text-neutral-900">Pay Period</h2>
      </div>
      <dl class="p-5 space-y-3 text-sm">
        <div>
          <dt class="text-neutral-500">Start Date</dt>
          <dd class="mt-0.5 font-medium text-neutral-900">{{ detail.periodStart }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">End Date</dt>
          <dd class="mt-0.5 font-medium text-neutral-900">{{ detail.periodEnd }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">Pay Date</dt>
          <dd class="mt-0.5 font-medium text-primary-600">{{ detail.payDate }}</dd>
        </div>
      </dl>
    </section>

    <!-- Summary -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-sm font-semibold text-neutral-900">Summary</h2>
      </div>
      <div class="p-5 space-y-3 text-sm">
        <div class="flex justify-between gap-2">
          <span class="text-neutral-600">Gross Salary</span>
          <span class="font-semibold text-neutral-900 tabular-nums">{{ formatMoney(summary.gross) }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span class="text-neutral-600">Total Deductions</span>
          <span class="font-semibold text-red-600 tabular-nums">{{ formatMoney(summary.totalDeductions) }}</span>
        </div>
        <div class="pt-3 border-t border-neutral-100 flex justify-between items-baseline gap-2">
          <span class="font-medium text-neutral-800">Net Salary</span>
          <span class="text-lg font-bold text-primary-600 tabular-nums">{{ formatMoney(summary.net) }}</span>
        </div>
      </div>
    </section>

    <!-- Approval -->
    <section
      v-if="detail.approval"
      class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-sm font-semibold text-neutral-900">Approval Status</h2>
      </div>
      <div class="p-5 space-y-3">
        <div
          class="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm font-semibold text-green-800 text-center"
        >
          Approved
        </div>
        <p class="text-sm text-neutral-600">
          By <span class="font-medium text-neutral-900">{{ detail.approval.by }}</span>
        </p>
        <p class="text-xs text-neutral-500">{{ detail.approval.at }}</p>
      </div>
    </section>

    <!-- Record -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-neutral-200">
        <h2 class="text-sm font-semibold text-neutral-900">Record Information</h2>
      </div>
      <dl class="p-5 space-y-3 text-sm">
        <div>
          <dt class="text-neutral-500">Payroll ID</dt>
          <dd class="mt-0.5 font-mono font-medium text-neutral-900">#{{ detail.id }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">Created</dt>
          <dd class="mt-0.5 text-neutral-800">{{ detail.createdAt }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">Last Updated</dt>
          <dd class="mt-0.5 text-neutral-800">{{ detail.updatedAt }}</dd>
        </div>
      </dl>
    </section>

    <!-- Actions métier (slot) -->
    <slot name="actions" />

    <!-- Bas : payslip + retour -->
    <div class="space-y-2">
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-secondary-600 text-white hover:bg-secondary-700 transition-colors shadow-sm disabled:opacity-60"
        :disabled="downloading"
        @click="$emit('download-payslip')"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {{ downloading ? t("admin.payroll.show.downloading") : t("admin.payroll.show.downloadPayslip") }}
      </button>
      <RouterLink
        :to="backTo"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-neutral-200 text-neutral-800 hover:bg-neutral-300 transition-colors"
        @click="$emit('back')"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to List
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  detail: { type: Object, required: true },
  summary: {
    type: Object,
    required: true,
  },
  currency: { type: String, default: "EUR" },
  backTo: { type: String, default: "/payroll/records" },
  downloading: { type: Boolean, default: false },
});

defineEmits(["download-pdf", "download-payslip", "back"]);

function formatMoney(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: props.currency || "EUR",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}
</script>
