<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <div
      class="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700"
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
          d="M5 13l4 4L19 7"
        />
      </svg>
      <p>
        Invoices are automatically generated for approved payments. You can
        view and download them anytime.
      </p>
    </div>

    <div class="mt-5 flex justify-end">
      <label class="inline-flex items-center gap-2 text-sm text-neutral-500">
        Search invoices:
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
              {{ col.label }}
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
              <span class="ml-2 align-middle">Loading invoices…</span>
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td
              :colspan="COLUMNS.length"
              class="px-4 py-6 text-center text-sm text-neutral-400"
            >
              No invoices yet.
            </td>
          </tr>
          <tr
            v-for="row in rows"
            v-else
            :key="row.id"
            class="border-b border-neutral-100 last:border-0"
          >
            <td class="px-4 py-4 text-sm text-neutral-700">
              {{ formatInvoiceDate(row.date) }}
            </td>
            <td class="px-4 py-4 text-sm text-neutral-700">
              {{ row.invoiceNumber }}
            </td>
            <td class="px-4 py-4 text-sm text-neutral-700">
              {{ row.description }}
            </td>
            <td class="px-4 py-4 text-sm text-neutral-700">
              {{ row.amount }}
            </td>
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                  statusClass(row.status),
                ]"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-md border border-secondary-200 bg-secondary-50 px-3 py-1.5 text-xs font-semibold text-[#7c7cf8] transition-colors hover:bg-secondary-100"
                  @click="$emit('view', row)"
                >
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-md bg-[#7c7cf8] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="downloadingId === row.id"
                  @click="$emit('download', row)"
                >
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                  {{ downloadingId === row.id ? "…" : "Download" }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { formatInvoiceDate } from "../../composables/useTenantInvoices.js";

defineProps({
  rows: { type: Array, required: true },
  searchQuery: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  downloadingId: { type: [Number, String], default: null },
});

defineEmits(["update:searchQuery", "view", "download"]);

const COLUMNS = [
  { key: "date", label: "Invoice Date" },
  { key: "number", label: "Invoice Number" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "paid") return "bg-emerald-50 text-emerald-700";
  if (key === "pending") return "bg-amber-50 text-amber-700";
  if (key === "partial") return "bg-amber-50 text-amber-700";
  if (key === "overdue") return "bg-rose-50 text-rose-700";
  if (key === "failed") return "bg-rose-50 text-rose-700";
  if (key === "cancelled") return "bg-neutral-100 text-neutral-600";
  if (key === "refunded") return "bg-sky-50 text-sky-700";
  if (key === "draft") return "bg-neutral-100 text-neutral-600";
  return "bg-neutral-100 text-neutral-600";
}
</script>
