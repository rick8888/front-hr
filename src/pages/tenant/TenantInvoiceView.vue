<template>
  <div class="invoice-page px-4 py-6 sm:px-6">
    <div class="mx-auto max-w-4xl space-y-4">
      <div class="print:hidden flex flex-wrap items-center justify-between gap-3">
        <RouterLink
          to="/tenant/invoices"
          class="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t("tenant.invoices.backToList") }}
        </RouterLink>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            :disabled="!invoice"
            @click="printInvoice"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            {{ t("tenant.invoices.print") }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md bg-[#7c7cf8] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!invoice || downloading"
            @click="downloadPdf"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            {{ downloading ? t("tenant.invoices.downloading") : t("tenant.invoices.downloadPdf") }}
          </button>
        </div>
      </div>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="loading"
        class="flex min-h-[24rem] items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm"
      >
        <span
          class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
          aria-hidden="true"
        />
        <span class="ml-3 text-sm text-neutral-500">{{ t("tenant.invoices.loadingDetail") }}</span>
      </div>

      <article
        v-else-if="invoice"
        class="invoice-sheet overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
      >
        <div
          class="relative overflow-hidden border-b border-neutral-100 bg-gradient-to-br from-slate-900 via-slate-800 to-[#4f4fb8] px-6 py-8 text-white sm:px-10"
        >
          <div
            class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#7c7cf8]/30 blur-2xl"
            aria-hidden="true"
          />

          <div class="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {{ t("tenant.invoices.invoice") }}
              </p>
              <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {{ invoice.invoiceNumber }}
              </h1>
              <p class="mt-2 text-sm text-white/75">
                {{ invoice.issuer?.name || "OpenCore Business Suite" }}
              </p>
            </div>

            <div class="sm:text-right">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                  statusBadgeClass,
                ]"
              >
                {{ localizedStatus }}
              </span>
              <p class="mt-3 text-sm text-white/80">
                {{ t("tenant.invoices.issuedOn", { date: formatDate(invoice.date) || "—" }) }}
              </p>
              <p v-if="invoice.dueDate" class="mt-1 text-sm text-white/80">
                {{ t("tenant.invoices.dueOn", { date: formatDate(invoice.dueDate) }) }}
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-8 sm:px-10">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <section>
              <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {{ t("tenant.invoices.from") }}
              </h2>
              <p class="mt-2 text-base font-semibold text-neutral-900">
                {{ invoice.issuer?.name || "OpenCore Business Suite" }}
              </p>
              <p v-if="invoice.issuer?.email" class="mt-1 text-sm text-neutral-600">
                {{ invoice.issuer.email }}
              </p>
              <p v-if="invoice.issuer?.website" class="mt-1 text-sm text-neutral-600">
                {{ invoice.issuer.website }}
              </p>
            </section>

            <section>
              <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {{ t("tenant.invoices.billTo") }}
              </h2>
              <p class="mt-2 text-base font-semibold text-neutral-900">
                {{ invoice.billTo?.name || "—" }}
              </p>
              <p
                v-if="invoice.billTo?.legalName && invoice.billTo.legalName !== invoice.billTo.name"
                class="mt-1 text-sm text-neutral-600"
              >
                {{ invoice.billTo.legalName }}
              </p>
              <p v-if="billToAddress" class="mt-1 text-sm text-neutral-600 whitespace-pre-line">
                {{ billToAddress }}
              </p>
              <p v-if="invoice.billTo?.email" class="mt-1 text-sm text-neutral-600">
                {{ invoice.billTo.email }}
              </p>
              <p v-if="invoice.billTo?.phone" class="mt-1 text-sm text-neutral-600">
                {{ invoice.billTo.phone }}
              </p>
              <p v-if="invoice.billTo?.taxId" class="mt-1 text-sm text-neutral-600">
                {{ t("tenant.invoices.taxId") }}: {{ invoice.billTo.taxId }}
              </p>
            </section>
          </div>

          <dl class="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 sm:grid-cols-4">
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-neutral-400">
                {{ t("tenant.invoices.number") }}
              </dt>
              <dd class="mt-1 text-sm font-semibold text-neutral-900">
                {{ invoice.invoiceNumber }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-neutral-400">
                Issue date
              </dt>
              <dd class="mt-1 text-sm font-semibold text-neutral-900">
                {{ formatDate(invoice.date) || "—" }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-neutral-400">
                {{ t("tenant.invoices.period") }}
              </dt>
              <dd class="mt-1 text-sm font-semibold text-neutral-900">
                {{ formatPeriod(invoice.period) || "—" }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-neutral-400">
                {{ t("tenant.invoices.paidOn") }}
              </dt>
              <dd class="mt-1 text-sm font-semibold text-neutral-900">
                {{ formatDate(invoice.paidAt) || "—" }}
              </dd>
            </div>
          </dl>

          <div class="mt-8 overflow-hidden rounded-xl border border-neutral-200">
            <table class="min-w-full">
              <thead class="bg-neutral-50">
                <tr class="text-left">
                  <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {{ t("tenant.invoices.description") }}
                  </th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 text-right">
                    {{ t("tenant.invoices.quantity") }}
                  </th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 text-right">
                    {{ t("tenant.invoices.unitPrice") }}
                  </th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 text-right">
                    {{ t("tenant.invoices.amount") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in invoice.lineItems"
                  :key="index"
                  class="border-t border-neutral-100"
                >
                  <td class="px-4 py-4 text-sm text-neutral-800">
                    <p class="font-medium">{{ localizeDescription(item.description) }}</p>
                    <p v-if="invoice.planName" class="mt-1 text-xs text-neutral-500">
                      {{ t("tenant.invoices.plan") }} : {{ invoice.planName }}
                    </p>
                  </td>
                  <td class="px-4 py-4 text-sm text-neutral-700 text-right">
                    {{ item.quantity }}
                  </td>
                  <td class="px-4 py-4 text-sm text-neutral-700 text-right">
                    {{ item.unitPrice }}
                  </td>
                  <td class="px-4 py-4 text-sm font-medium text-neutral-900 text-right">
                    {{ item.total }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-end">
            <div class="w-full max-w-xs space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">{{ t("tenant.invoices.subtotal") }}</span>
                <span class="font-medium text-neutral-800">{{ invoice.amount }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">{{ t("tenant.invoices.amountPaid") }}</span>
                <span class="font-medium text-neutral-800">
                  {{ invoice.amountPaid || "—" }}
                </span>
              </div>
              <div
                class="flex items-center justify-between border-t border-neutral-200 pt-3"
              >
                <span class="text-sm font-semibold text-neutral-900">{{ t("tenant.invoices.balanceDue") }}</span>
                <span class="text-xl font-bold text-neutral-900">
                  {{ invoice.balance || invoice.amount }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="invoice.notes"
            class="mt-8 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm text-amber-900"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">
              {{ t("tenant.invoices.notes") }}
            </p>
            <p class="mt-1 whitespace-pre-line">{{ invoice.notes }}</p>
          </div>

          <footer class="mt-10 border-t border-neutral-100 pt-6 text-center">
            <p class="text-sm text-neutral-500">
              {{ t("tenant.invoices.thankYou") }}
            </p>
            <p class="mt-1 text-xs text-neutral-400">
              {{ t("tenant.invoices.generatedNotice") }}
            </p>
          </footer>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useTenantInvoiceDetail } from "../../composables/useTenantInvoices.js";
import { useI18n } from "../../i18n/index.js";

const route = useRoute();
const { t, locale } = useI18n();
const { loading, downloading, error, invoice, load, downloadPdf } =
  useTenantInvoiceDetail();

const localizedStatus = computed(() => {
  const keys = {
    paid: "tenant.invoices.status.paid",
    pending: "tenant.invoices.status.pending",
    partial: "tenant.invoices.status.partial",
    overdue: "tenant.invoices.status.overdue",
    failed: "tenant.invoices.status.failed",
    cancelled: "tenant.invoices.status.cancelled",
    canceled: "tenant.invoices.status.cancelled",
    refunded: "tenant.invoices.status.refunded",
    draft: "tenant.invoices.status.draft",
  };
  const key = keys[String(invoice.value?.statusCode || invoice.value?.status || "").toLowerCase()];
  return key ? t(key) : invoice.value?.status;
});

const billToAddress = computed(() => {
  const bill = invoice.value?.billTo;
  if (!bill) return "";

  const cityLine = [bill.postalCode, bill.city, bill.state]
    .filter(Boolean)
    .join(" ");

  return [bill.street, cityLine, bill.country].filter(Boolean).join("\n");
});

const statusBadgeClass = computed(() => {
  const key = String(invoice.value?.statusCode || invoice.value?.status || "").toLowerCase();
  if (key === "paid") return "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/40";
  if (key === "pending" || key === "partial") {
    return "bg-amber-400/20 text-amber-100 ring-1 ring-amber-300/40";
  }
  if (key === "overdue" || key === "failed") {
    return "bg-rose-400/20 text-rose-100 ring-1 ring-rose-300/40";
  }
  return "bg-white/15 text-white ring-1 ring-white/25";
});

function formatDate(value) {
  if (!value || value === "—") return value || "—";
  const raw = String(value);
  const date = /^\d{4}-\d{2}-\d{2}/.test(raw)
    ? new Date(`${raw.slice(0, 10)}T12:00:00`)
    : new Date(raw);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale.value === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatPeriod(value) {
  if (!value || value === "—") return value || "—";
  const dates = value.split(/\s+[–-]\s+/);
  return dates.length === 2
    ? `${formatDate(dates[0])} – ${formatDate(dates[1])}`
    : value;
}

function localizeDescription(value) {
  const description = String(value || "");
  const paymentMatch = description.match(/^Payment for (.+) plan$/i);
  if (paymentMatch) {
    return t("tenant.invoices.paymentForPlan", { plan: paymentMatch[1] });
  }
  return description;
}

function printInvoice() {
  window.print();
}

async function loadCurrent() {
  const id = Number(route.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    error.value = t("tenant.invoices.invalid");
    return;
  }
  await load(id);

  if (route.query.download === "1" && invoice.value) {
    await downloadPdf();
  }
}

onMounted(loadCurrent);
watch(() => route.params.id, loadCurrent);
</script>

<style scoped>
@media print {
  .invoice-page {
    padding: 0 !important;
    background: white !important;
  }

  .invoice-sheet {
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .invoice-sheet :deep(*) {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
