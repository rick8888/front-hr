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
      <td class="px-5 py-4 md:px-6 align-top text-neutral-700">{{ row.date }}</td>
      <td class="px-5 py-4 md:px-6 align-top">
        <span
          :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', typeClass(row)]"
        >
          {{ row.type }}
        </span>
      </td>
      <td class="px-5 py-4 md:px-6 align-top text-xs text-neutral-500 leading-relaxed whitespace-nowrap">
        <div><span class="text-neutral-400">{{ t("ss.table.in") }}</span> {{ row.requestedIn }}</div>
        <div><span class="text-neutral-400">{{ t("ss.table.out") }}</span> {{ row.requestedOut }}</div>
      </td>
      <td class="px-5 py-4 md:px-6 align-top text-neutral-700 break-words">
        {{ row.reason }}
      </td>
      <td class="px-5 py-4 md:px-6 align-top">
        <span
          :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row.status)]"
        >
          {{ tStatus(row.status) }}
        </span>
      </td>
      <td class="px-5 py-4 md:px-6 align-top">
        <div v-if="row.approvedBy" class="flex items-center gap-2.5">
          <span
            :class="[
              'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0',
              row.approvedBy.avatarBg || 'bg-neutral-100 text-neutral-600',
            ]"
          >
            {{ row.approvedBy.initials }}
          </span>
          <div class="min-w-0">
            <p class="text-sm font-medium text-neutral-800 truncate">
              {{ row.approvedBy.name }}
            </p>
            <p class="text-xs text-neutral-500 truncate">
              {{ row.approvedBy.email }}
            </p>
          </div>
        </div>
        <span v-else class="text-sm text-neutral-400">--</span>
      </td>
      <td class="px-5 py-4 md:px-6 align-top">
        <TableRowMenu
          :open="openMenuId === row.id"
          :aria-label="`Actions for ${row.date}`"
          width-class="w-36"
          @toggle="toggleMenu(row.id)"
          @close="closeMenu"
        >
          <button
            v-if="canEdit(row)"
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
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            role="menuitem"
            @click="onDelete(row)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
            </svg>
            {{ t("common.delete") }}
          </button>
        </TableRowMenu>
      </td>
    </tr>
    <tr v-if="!rows.length">
      <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-neutral-500">
        {{ t("ss.regularization.emptyYet") }}
      </td>
    </tr>
    </template>
  </tbody>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "../../i18n/index.js";
import TableRowMenu from "../common/TableRowMenu.vue";

const emit = defineEmits(["edit", "delete"]);
const { t, locale } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "date", label: t("ss.regularization.col.date") },
    { key: "type", label: t("ss.regularization.col.type") },
    { key: "requested", label: t("ss.regularization.col.requestedTime") },
    { key: "reason", label: t("ss.regularization.col.reason") },
    { key: "status", label: t("common.status") },
    { key: "approvedBy", label: t("ss.regularization.col.approvedBy") },
    { key: "actions", label: t("common.actions") },
  ];
});

function tStatus(status) {
  const key = `ss.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

const props = defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  /** Statuses pour lesquels la modification doit être désactivée. */
  lockedEditStatuses: {
    type: Array,
    default: () => ["Approved", "Rejected"],
  },
});

const openMenuId = ref(null);

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenu() {
  openMenuId.value = null;
}

function canEdit(row) {
  return !props.lockedEditStatuses.includes(row.status);
}

function onEdit(row) {
  closeMenu();
  emit("edit", row);
}

function onDelete(row) {
  closeMenu();
  emit("delete", row);
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

const TYPE_CLASSES = {
  missed_punch: "bg-sky-50 text-sky-700",
  overtime: "bg-amber-50 text-amber-700",
  correction: "bg-violet-50 text-violet-700",
  "Missed punch": "bg-sky-50 text-sky-700",
  "Pointage manqué": "bg-sky-50 text-sky-700",
  Overtime: "bg-amber-50 text-amber-700",
  "Heures supplémentaires": "bg-amber-50 text-amber-700",
  Correction: "bg-violet-50 text-violet-700",
};

const STATUS_CLASSES = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
};

function typeClass(row) {
  const key = row.typeValue || row.type;
  return TYPE_CLASSES[key] || "bg-neutral-100 text-neutral-700";
}

function statusClass(status) {
  return STATUS_CLASSES[status] || "bg-neutral-100 text-neutral-700";
}
</script>
