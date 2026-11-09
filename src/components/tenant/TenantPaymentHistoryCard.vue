<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <h2 class="text-base font-bold text-neutral-900">{{ t("tenant.billings.paymentHistory") }}</h2>

    <div
      class="mt-4 flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-sky-700"
      role="note"
    >
      <svg
        class="mt-0.5 h-4 w-4 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>
        {{ t("tenant.billings.pendingInfo") }}
      </p>
    </div>

    <div class="mt-4 flex justify-end">
      <label class="inline-flex items-center gap-2 text-sm text-neutral-500">
        {{ t("tenant.billings.search") }}
        <input
          type="search"
          :value="searchQuery"
          :disabled="loading"
          class="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-60"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
      </label>
    </div>

    <div class="mt-3 overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-neutral-200 text-left">
            <th
              v-for="col in COLUMNS"
              :key="col.key"
              :class="[
                'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500',
                col.align === 'center' ? 'text-center' : 'text-left',
              ]"
            >
              {{ t(col.label) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td
              :colspan="COLUMNS.length"
              class="px-4 py-16 text-center text-sm text-neutral-500"
            >
              <span
                class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500 align-middle"
                aria-hidden="true"
              />
              <span class="ml-2 align-middle">{{ t("tenant.billings.loadingPayments") }}</span>
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td
              :colspan="COLUMNS.length"
              class="px-4 py-6 text-center text-sm text-neutral-400"
            >
              {{ t("tenant.billings.noPayments") }}
            </td>
          </tr>
          <tr
            v-for="row in rows"
            v-else
            :key="row.id"
            class="border-b border-neutral-100 last:border-0"
          >
            <td class="px-4 py-4 text-sm text-neutral-700">
              {{ formatBillingDate(row.date, locale) }}
            </td>
            <td class="px-4 py-4 text-sm text-neutral-700">{{ row.paymentId }}</td>
            <td class="px-4 py-4 text-sm text-neutral-700">{{ row.description }}</td>
            <td class="px-4 py-4 text-sm text-neutral-700">{{ row.amount }}</td>
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                  statusClass(row.statusCode || row.status),
                ]"
              >
                {{ statusLabel(row.statusCode || row.status) }}
              </span>
            </td>
            <td class="px-4 py-4 text-center">
              <button
                type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                :aria-label="t('tenant.billings.viewInvoice')"
                :title="t('tenant.billings.viewInvoice')"
                @click="$emit('action', row)"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { formatBillingDate } from "../../composables/useTenantBillings.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

defineProps({
  rows: { type: Array, required: true },
  searchQuery: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});

defineEmits(["update:searchQuery", "action"]);

const COLUMNS = [
  { key: "date", label: "tenant.billings.date" },
  { key: "paymentId", label: "tenant.billings.paymentId" },
  { key: "description", label: "tenant.billings.description" },
  { key: "amount", label: "tenant.billings.amount" },
  { key: "status", label: "tenant.billings.status" },
  { key: "actions", label: "tenant.billings.actions", align: "center" },
];

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "paid" || key === "payé" || key === "payée") return "bg-emerald-50 text-emerald-700";
  if (key === "pending" || key === "en attente") return "bg-amber-50 text-amber-700";
  if (key === "overdue" || key === "en retard" || key === "failed" || key === "échoué") return "bg-rose-50 text-rose-700";
  if (key === "refunded" || key === "remboursé") return "bg-sky-50 text-sky-700";
  return "bg-neutral-100 text-neutral-600";
}

function statusLabel(status) {
  const keys = {
    paid: "tenant.billings.status.paid",
    pending: "tenant.billings.status.pending",
    overdue: "tenant.billings.status.overdue",
    failed: "tenant.billings.status.failed",
    refunded: "tenant.billings.status.refunded",
    partial: "tenant.billings.status.partial",
    cancelled: "tenant.billings.status.cancelled",
    canceled: "tenant.billings.status.cancelled",
    draft: "tenant.billings.status.draft",
  };
  const key = keys[String(status || "").toLowerCase()];
  return key ? t(key) : status;
}
</script>
