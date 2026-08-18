<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Billing &amp; Payments
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          View your payment history and manage pending transactions
        </p>
        <div class="mt-4 flex justify-center">
          <RouterLink
            to="/tenant/invoices"
            class="inline-flex items-center gap-2 rounded-md bg-secondary-100/80 px-4 py-2 text-sm font-semibold text-[#7c7cf8] transition-colors hover:bg-secondary-200/70"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Invoices
          </RouterLink>
        </div>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TenantBillingsKpiCard
          label="Total Paid"
          :value="kpis.paid"
          :loading="loading"
          tone="success"
          icon="check"
        />
        <TenantBillingsKpiCard
          label="Pending Payments"
          :value="kpis.pending"
          :loading="loading"
          tone="warning"
          icon="clock"
        />
        <TenantBillingsKpiCard
          label="Total Payments"
          :value="String(kpis.count)"
          :loading="loading"
          tone="info"
          icon="receipt"
        />
      </section>

      <TenantPaymentHistoryCard
        v-model:search-query="searchQuery"
        :rows="filteredRows"
        :loading="loading"
        @action="onRowAction"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TenantBillingsKpiCard from "../../components/tenant/TenantBillingsKpiCard.vue";
import TenantPaymentHistoryCard from "../../components/tenant/TenantPaymentHistoryCard.vue";
import { useTenantBillings } from "../../composables/useTenantBillings.js";

const router = useRouter();
const { loading, error, kpis, rows, load } = useTenantBillings();
const searchQuery = ref("");

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) => {
    const haystack = [
      r.paymentId,
      r.description,
      r.amount,
      r.status,
      r.date,
      r.invoiceNumber,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

function onRowAction(row) {
  if (!row?.invoiceId) return;
  router.push({
    name: "TenantInvoiceView",
    params: { id: row.invoiceId },
  });
}

onMounted(() => {
  load();
});
</script>
