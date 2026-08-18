<template>
  <thead>
    <tr class="border-y border-neutral-100 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
      <th
        v-for="col in columns"
        :key="col.key"
        scope="col"
        :class="['px-5 py-3 md:px-6', col.align === 'right' ? 'text-right' : 'text-left']"
      >
        {{ col.label }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-if="loading">
      <td :colspan="columns.length" class="px-5 py-16 text-center">
        <div class="inline-flex items-center justify-center gap-2 text-sm text-neutral-500">
          <span
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
            aria-hidden="true"
          />
          {{ t("common.loading") }}
        </div>
      </td>
    </tr>
    <template v-else>
      <tr
        v-for="row in rows"
        :key="row.id"
        class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
      >
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">{{ row.id }}</td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-800">{{ row.type }}</td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ formatDate(row.expenseDate) }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm font-medium text-neutral-800">
          {{ formatAmount(row.amount, row.currency) }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle">
          <span
            :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row.statusValue || row.status)]"
          >
            {{ tStatus(row.statusValue || row.status) }}
          </span>
        </td>
        <td class="px-5 py-4 md:px-6 align-middle">
          <a
            v-if="row.receiptUrl"
            :href="row.receiptUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-600 hover:text-secondary-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{ t("common.view") }}
          </a>
          <span v-else class="text-sm text-neutral-400">-</span>
        </td>
        <td class="px-5 py-4 md:px-6 align-middle">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            :aria-label="`${t('common.view')} ${row.id}`"
            @click.stop="emit('view', row)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </td>
      </tr>
      <tr v-if="!rows.length">
        <td :colspan="columns.length" class="px-5 py-12 text-center text-sm text-neutral-500">
          {{ t("ss.expenses.empty") }}
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";
import {
  catalogStatusClass,
  catalogStatusLabel,
} from "../../stores/entityStatusCatalog.store.js";

defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["view"]);
const { t, locale } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "id", label: t("ss.expenses.col.id") },
    { key: "type", label: t("ss.expenses.col.type") },
    { key: "expenseDate", label: t("ss.expenses.col.date") },
    { key: "amount", label: t("ss.expenses.col.amount") },
    { key: "status", label: t("common.status") },
    { key: "receipt", label: t("ss.expenses.col.receipt") },
    { key: "actions", label: t("common.actions") },
  ];
});

function tStatus(status) {
  return catalogStatusLabel("expenses", status, status);
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatAmount(amount, currency = "USD") {
  const n = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n}`;
  }
}

function statusClass(status) {
  return catalogStatusClass("expenses", status);
}
</script>
