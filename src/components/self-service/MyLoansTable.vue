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
      <tr v-if="!rows.length">
        <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-neutral-500">
          {{ t("ss.table.noData") }}
        </td>
      </tr>
      <tr
        v-for="row in rows"
        :key="row.id"
        class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
      >
        <td class="px-5 py-4 md:px-6 align-middle text-sm font-medium text-neutral-800">
          {{ row.code }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ row.typeLabel || row.type }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ formatAmount(row.amount) }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle">
          <span
            :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row.statusValue || row.status)]"
          >
            {{ tStatus(row.statusValue || row.status) }}
          </span>
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ formatDate(row.appliedOn) }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ row.tenure ? t("ss.loans.col.tenureMo", { n: row.tenure }) : "—" }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ row.emi ? formatAmount(row.emi) : "—" }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
          {{ row.outstanding != null ? formatAmount(row.outstanding) : "—" }}
        </td>
        <td class="px-5 py-4 md:px-6 align-middle relative">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            :aria-label="`${t('common.actions')} — ${row.code}`"
            :aria-expanded="openMenuId === row.id"
            @click.stop="toggleMenu(row.id)"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          </button>
          <div
            v-if="openMenuId === row.id"
            class="absolute right-2 top-12 z-20 w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
            role="menu"
            @click.stop
          >
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              @click="onView(row)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ t("common.view") }}
            </button>
            <button
              v-if="row.status === 'Pending'"
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              @click="onCancel(row)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ t("common.cancel") }}
            </button>
          </div>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "../../i18n/index.js";
import {
  catalogStatusClass,
  catalogStatusLabel,
} from "../../stores/entityStatusCatalog.store.js";

defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["view", "cancel"]);
const { t, locale } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "code", label: t("ss.loans.col.code") },
    { key: "type", label: t("ss.loans.col.type") },
    { key: "amount", label: t("ss.loans.col.amount") },
    { key: "status", label: t("common.status") },
    { key: "appliedOn", label: t("ss.loans.col.appliedOn") },
    { key: "tenure", label: t("ss.loans.col.tenure") },
    { key: "emi", label: t("ss.loans.col.emi") },
    { key: "outstanding", label: t("ss.loans.col.outstanding") },
    { key: "actions", label: t("common.actions") },
  ];
});

const openMenuId = ref(null);

function tStatus(status) {
  return catalogStatusLabel("loans", status, status);
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function onView(row) {
  closeMenu();
  emit("view", row);
}

function onCancel(row) {
  closeMenu();
  emit("cancel", row);
}

function formatAmount(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  return catalogStatusClass("loans", status);
}

function onDocClick() {
  closeMenu();
}

function onKey(e) {
  if (e.key === "Escape") closeMenu();
}

onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKey);
});
</script>
