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
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600" aria-hidden="true" />
          {{ t("common.loading") }}
        </div>
      </td>
    </tr>
    <template v-else>
      <tr v-for="row in rows" :key="row.id" class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40">
        <td class="px-5 py-4 md:px-6 align-middle">
          <p class="text-sm font-semibold text-neutral-900">{{ row.name }}</p>
          <p class="mt-0.5 text-xs text-neutral-500">{{ row.reference }}</p>
        </td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm text-neutral-700">{{ row.category }}</td>
        <td class="px-5 py-4 md:px-6 align-middle text-sm">
          <p class="inline-flex items-center gap-1.5 text-neutral-500">
            <svg class="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(row.issueDate) }}
          </p>
          <p v-if="row.expiryDate" :class="['mt-1 inline-flex items-center gap-1.5 text-xs', expiryColorClass(row.expiryDate)]">
            {{ expiryLabel(row.expiryDate) }}
          </p>
        </td>
        <td class="px-5 py-4 md:px-6 align-middle">
          <span :class="['inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row.statusValue || row.status)]">
            {{ tStatus(row.statusValue || row.status) }}
          </span>
          <p v-if="row.verifiedBy" class="mt-1.5 text-xs text-neutral-500">{{ row.verifiedBy }}</p>
          <p v-if="row.verifiedOn" class="text-xs text-neutral-500">{{ formatDate(row.verifiedOn) }}</p>
        </td>
        <td class="px-5 py-4 md:px-6 align-middle relative">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            :aria-label="`${t('common.actions')} — ${row.name}`"
            :aria-expanded="openMenuId === row.id"
            @click.stop="toggleMenu(row.id)"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          </button>
          <div v-if="openMenuId === row.id" class="absolute right-2 top-12 z-20 w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg" role="menu" @click.stop>
            <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" @click="onView(row)">
              {{ t("common.view") }}
            </button>
            <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" @click="onDownload(row)">
              {{ t("common.download") }}
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="!rows.length">
        <td :colspan="columns.length" class="px-5 py-12 text-center text-sm text-neutral-500">
          {{ t("ss.documents.empty") }}
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

const props = defineProps({
  rows: { type: Array, required: true },
  today: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["view", "download"]);
const { t, locale } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "document", label: t("ss.documents.col.document") },
    { key: "category", label: t("ss.documents.col.category") },
    { key: "expiry", label: t("ss.documents.col.dates") },
    { key: "status", label: t("common.status") },
    { key: "actions", label: t("common.actions") },
  ];
});

const openMenuId = ref(null);

function tStatus(status) {
  return catalogStatusLabel("employee_documents", status, status);
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

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function statusClass(status) {
  return catalogStatusClass("employee_documents", status);
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

function daysBetween(fromIso, toIso) {
  const a = new Date(fromIso + "T00:00:00");
  const b = new Date(toIso + "T00:00:00");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function isExpired(expiryDate) {
  return daysBetween(props.today, expiryDate) < 0;
}

function expiryLabel(expiryDate) {
  const formatted = formatDate(expiryDate);
  const diff = daysBetween(props.today, expiryDate);
  if (diff < 0) return t("ss.documents.expiredOn", { date: formatted });
  return t("ss.documents.expiresOn", { date: formatted, n: diff });
}

function expiryColorClass(expiryDate) {
  return isExpired(expiryDate) ? "text-rose-600" : "text-amber-600";
}
</script>
