<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">Invoices</h1>
        <p class="mt-2 text-sm text-neutral-500">
          Download invoices for completed payments
        </p>
        <div class="mt-4 flex justify-center">
          <RouterLink
            to="/tenant/billings"
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
            View All Payments
          </RouterLink>
        </div>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <TenantInvoicesTableCard
        v-model:search-query="searchQuery"
        :rows="filteredRows"
        :loading="loading"
        :downloading-id="downloadingId"
        @view="onView"
        @download="onDownload"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TenantInvoicesTableCard from "../../components/tenant/TenantInvoicesTableCard.vue";
import { useTenantInvoices } from "../../composables/useTenantInvoices.js";

const router = useRouter();
const { loading, downloadingId, error, rows, load, downloadPdf } =
  useTenantInvoices();
const searchQuery = ref("");

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) =>
    [r.invoiceNumber, r.description, r.amount, r.status, r.date]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
});

function onView(row) {
  router.push({ name: "TenantInvoiceView", params: { id: row.id } });
}

async function onDownload(row) {
  await downloadPdf(row);
}

onMounted(() => {
  load();
});
</script>
