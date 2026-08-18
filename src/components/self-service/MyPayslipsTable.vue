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
    <tr
      v-for="(row, index) in rows"
      v-show="!loading"
      :key="row.id"
      class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
    >
      <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-500">
        {{ rowIndex(index) }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle text-sm font-medium text-neutral-800">
        {{ row.code }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
        {{ row.periodLabel }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
        {{ formatAmount(row.basicSalary) }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
        {{ formatAmount(row.totalEarnings) }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">
        {{ formatAmount(row.deductions) }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle text-sm font-semibold text-emerald-600">
        {{ formatAmount(row.netSalary) }}
      </td>
      <td class="px-5 py-4 md:px-6 align-middle">
        <span
          :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row.status)]"
        >
          {{ tStatus(row.status) }}
        </span>
      </td>
      <td class="px-5 py-4 md:px-6 align-middle relative">
        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          :aria-label="`Actions for ${row.code}`"
          :aria-expanded="openMenuId === row.id"
          @click.stop="toggleMenu(row.id)"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            />
          </svg>
        </button>
        <div
          v-if="openMenuId === row.id"
          class="absolute right-2 top-12 z-20 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
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
            {{ t("common.view") }} Details
          </button>
          <button
            type="button"
            role="menuitem"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            @click="onDownload(row)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            {{ t("payslips.action.downloadPdf") }}
          </button>
        </div>
      </td>
    </tr>
    <tr v-if="loading">
      <td :colspan="columns.length" class="px-5 py-12 text-center text-sm text-neutral-500">
        <span
          class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500 align-middle"
          aria-hidden="true"
        />
        <span class="ml-2">{{ t("payslips.loading") }}</span>
      </td>
    </tr>
    <tr v-else-if="!rows.length">
      <td :colspan="columns.length" class="px-5 py-12 text-center text-sm text-neutral-500">
        {{ t("payslips.empty") }}
      </td>
    </tr>
  </tbody>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  rows: { type: Array, required: true },
  /** Index du premier élément de la page courante (1-based). */
  startIndex: { type: Number, default: 1 },
  currency: { type: String, default: "USD" },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["view", "download"]);
const { t, locale } = useI18n();

const openMenuId = ref(null);

function tStatus(status) {
  const key = `payslips.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
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

function onDownload(row) {
  closeMenu();
  emit("download", row);
}

function rowIndex(idx) {
  return props.startIndex + idx;
}

function formatAmount(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: props.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function statusClass(status) {
  if (status === "Approved") return "bg-secondary-50 text-secondary-700";
  if (status === "Paid") return "bg-emerald-50 text-emerald-700";
  if (status === "Pending") return "bg-amber-50 text-amber-700";
  if (status === "Rejected") return "bg-rose-50 text-rose-700";
  return "bg-neutral-100 text-neutral-700";
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

const columns = computed(() => {
  void locale.value;
  return [
    { key: "index", label: "#" },
    { key: "code", label: t("payslips.col.code") },
    { key: "period", label: t("payslips.col.period") },
    { key: "basicSalary", label: t("payslips.col.basicSalary") },
    { key: "totalEarnings", label: t("payslips.col.totalEarnings") },
    { key: "deductions", label: t("payslips.col.deductions") },
    { key: "netSalary", label: t("payslips.col.netSalary") },
    { key: "status", label: t("common.status") },
    { key: "actions", label: t("common.actions") },
  ];
});
</script>
