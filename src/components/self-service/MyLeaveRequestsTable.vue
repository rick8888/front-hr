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
        <td class="px-5 py-3.5 md:px-6 text-neutral-700">{{ row.requestDate }}</td>
        <td class="px-5 py-3.5 md:px-6 text-neutral-700">{{ row.leaveType }}</td>
        <td class="px-5 py-3.5 md:px-6 text-neutral-600">{{ row.fromDate }}</td>
        <td class="px-5 py-3.5 md:px-6 text-neutral-600">{{ row.toDate }}</td>
        <td class="px-5 py-3.5 md:px-6 font-medium text-neutral-700">
          {{ formatDays(row.days) }}
        </td>
        <td class="px-5 py-3.5 md:px-6">
          <span
            :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row.statusValue || row.status)]"
          >
            {{ tStatus(row.statusValue || row.status) }}
          </span>
        </td>
        <td class="px-5 py-3.5 md:px-6">
          <TableRowMenu
            :open="openMenuId === row.id"
            :aria-label="`${t('common.actions')} — ${row.leaveType}`"
            width-class="w-36"
            @toggle="toggleMenu(row.id)"
            @close="closeMenu"
          >
            <button
              type="button"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              role="menuitem"
              @click="onView(row)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ t("common.view") }}
            </button>
            <button
              v-if="row.statusValue === 'pending'"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              role="menuitem"
              @click="onEdit(row)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ t("common.edit") }}
            </button>
            <button
              v-if="row.statusValue === 'pending'"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              role="menuitem"
              @click="onCancel(row)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ t("common.cancel") }}
            </button>
          </TableRowMenu>
        </td>
      </tr>
      <tr v-if="!rows.length">
        <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-neutral-500">
          {{ t("ss.leave.empty") }}
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "../../i18n/index.js";
import TableRowMenu from "../common/TableRowMenu.vue";
import {
  catalogStatusClass,
  catalogStatusLabel,
} from "../../stores/entityStatusCatalog.store.js";

const emit = defineEmits(["view", "edit", "cancel"]);

defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

const { t, locale } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "requestDate", label: t("ss.leave.col.requestDate") },
    { key: "leaveType", label: t("ss.leave.col.leaveType") },
    { key: "fromDate", label: t("ss.leave.col.fromDate") },
    { key: "toDate", label: t("ss.leave.col.toDate") },
    { key: "days", label: t("ss.leave.col.days") },
    { key: "status", label: t("common.status") },
    { key: "actions", label: t("common.actions") },
  ];
});

const openMenuId = ref(null);

function tStatus(status) {
  return catalogStatusLabel("leave_requests", status, status);
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function onView(row) { closeMenu(); emit("view", row); }
function onEdit(row) { closeMenu(); emit("edit", row); }
function onCancel(row) { closeMenu(); emit("cancel", row); }

function onDocClick() { closeMenu(); }
function onKey(e) { if (e.key === "Escape") closeMenu(); }

onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKey);
});

function statusClass(status) {
  return catalogStatusClass("leave_requests", status);
}

function formatDays(value) {
  const n = Number(value) || 0;
  return n.toFixed(2);
}
</script>
