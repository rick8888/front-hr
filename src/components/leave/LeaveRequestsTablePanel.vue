<template>
  <section
    class="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-visible"
    @click="handleRootClick"
  >
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-neutral-100"
    >
      <h2 class="text-base font-semibold text-neutral-800">
        {{ t("admin.leave.listTitle") }}
      </h2>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-secondary-700 transition-colors w-full sm:w-auto"
        @click="$emit('add')"
      >
        + {{ t("admin.leave.add") }}
      </button>
    </div>

    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 md:px-6 py-4 border-b border-neutral-100"
    >
      <div class="flex items-center gap-2 text-sm text-neutral-600">
        <span>{{ t("admin.attendance.showEntries") }}</span>
        <select
          :value="pageSize"
          class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
          @change="$emit('update:pageSize', Number($event.target.value))"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
        <span>{{ t("admin.attendance.entries") }}</span>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
        <label class="sr-only" for="leave-requests-search">{{ t("common.search") }}</label>
        <input
          id="leave-requests-search"
          :value="searchQuery"
          type="search"
          :placeholder="t('common.search')"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="px-5 md:px-6 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500 whitespace-nowrap"
              :class="col.thClass"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-16 text-center">
              <div class="inline-flex items-center justify-center gap-2 text-sm text-neutral-500">
                <span
                  class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
                  aria-hidden="true"
                />
                {{ t("common.loading") }}
              </div>
            </td>
          </tr>
          <tr v-else-if="rows.length === 0">
            <td :colspan="columns.length" class="px-6 py-16 text-center">
              <p class="text-sm font-medium text-neutral-700">
                {{ t("admin.leave.emptyTitle") }}
              </p>
              <p class="text-sm text-neutral-500 mt-1">
                {{ t("admin.leave.emptyHint") }}
              </p>
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="row in rows"
              :key="row.id"
              class="hover:bg-neutral-50/60 transition-colors"
            >
            <td class="px-5 md:px-6 py-4">
              <div class="flex items-center gap-3">
                <EmployeeAvatar
                  :name="row.employee"
                  :avatar-url="row.employeeAvatarUrl"
                  size-class="h-9 w-9 text-xs"
                />
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-neutral-900 truncate">
                    {{ row.employee }}
                  </p>
                  <p class="text-xs text-neutral-500">{{ row.employeeCode }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 md:px-6 py-4 text-sm text-neutral-800">
              {{ row.leaveType }}
            </td>
            <td class="px-5 md:px-6 py-4 text-neutral-800">
              <div class="flex flex-col gap-0.5 leading-tight">
                <span class="text-sm">{{ formatDay(row.from) }}</span>
                <span class="text-xs text-neutral-400 font-normal">{{ t("admin.leave.dateTo") }}</span>
                <span class="text-sm">{{ formatDay(row.to) }}</span>
              </div>
            </td>
            <td class="px-5 md:px-6 py-4">
              <span
                class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium"
                :class="statusClass(row.statusValue)"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-5 md:px-6 py-4 text-sm text-neutral-500">
              {{ row.document ? t("common.view") : t("common.notApplicable") }}
            </td>
            <td class="px-5 md:px-6 py-4 text-right relative">
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
                :aria-expanded="menuOpenFor === row.id"
                aria-haspopup="true"
                :aria-label="t('admin.leave.actionsFor', { name: row.employee })"
                @click.stop="toggleMenu(row.id)"
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                  />
                </svg>
              </button>
              <div
                v-if="menuOpenFor === row.id"
                class="absolute right-4 md:right-6 top-full mt-0.5 z-20 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-md"
                role="menu"
                @click.stop
              >
                <button
                  v-if="row.statusValue === 'pending'"
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                  role="menuitem"
                  @click="onApprove(row)"
                >
                  {{ t("admin.leave.approve") }}
                </button>
                <button
                  v-if="row.statusValue === 'pending'"
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                  role="menuitem"
                  @click="onReject(row)"
                >
                  {{ t("admin.leave.reject") }}
                </button>
                <button
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                  role="menuitem"
                  @click="menuOpenFor = null"
                >
                  {{ t("admin.leave.close") }}
                </button>
              </div>
            </td>
          </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 md:px-6 py-4 border-t border-neutral-100"
    >
      <p class="text-sm text-neutral-600">
        {{ t("common.showingEntries", { from: rangeFrom, to: rangeTo, total }) }}
      </p>
      <nav class="flex flex-wrap items-center justify-end gap-1" aria-label="Pagination">
        <button
          type="button"
          class="min-w-[2.25rem] rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-45 disabled:pointer-events-none transition-colors"
          :disabled="currentPage <= 1"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          {{ t("common.previous") }}
        </button>
        <template v-for="(item, idx) in visiblePages" :key="idx">
          <span
            v-if="item === 'ellipsis'"
            class="px-2 py-1.5 text-sm text-neutral-400 select-none"
            >...</span
          >
          <button
            v-else
            type="button"
            class="min-w-[2.25rem] rounded-lg border px-3 py-1.5 text-sm transition-colors"
            :class="
              item === currentPage
                ? 'border-secondary-600 bg-secondary-600 text-white shadow-sm'
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            "
            @click="$emit('update:currentPage', item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="min-w-[2.25rem] rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-45 disabled:pointer-events-none transition-colors"
          :disabled="currentPage >= pageCount"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          {{ t("common.next") }}
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { getVisiblePages } from "../../composables/useLeaveRequestsTable.js";
import { useI18n } from "../../i18n/index.js";
import EmployeeAvatar from "../common/EmployeeAvatar.vue";
import { catalogStatusClass } from "../../stores/entityStatusCatalog.store.js";

const { t, locale, bcp47 } = useI18n();

const emit = defineEmits([
  "add",
  "approve",
  "reject",
  "update:currentPage",
  "update:pageSize",
  "update:searchQuery",
]);

const props = defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  total: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  searchQuery: { type: String, default: "" },
  rangeFrom: { type: Number, default: 0 },
  rangeTo: { type: Number, default: 0 },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100],
  },
});

const menuOpenFor = ref(null);

const columns = computed(() => {
  void locale.value;
  return [
    { key: "employee", label: t("admin.leave.col.employee") },
    { key: "leaveType", label: t("admin.leave.col.leaveType") },
    { key: "dates", label: t("admin.leave.col.dates") },
    { key: "status", label: t("admin.leave.col.status") },
    { key: "document", label: t("admin.leave.col.document") },
    { key: "actions", label: t("common.actions"), thClass: "text-right" },
  ];
});

const visiblePages = computed(() =>
  getVisiblePages(props.currentPage, props.pageCount),
);

function formatDay(iso) {
  try {
    const dateLocale = bcp47.value.startsWith("fr") ? fr : enUS;
    return format(new Date(iso + "T12:00:00"), "dd MMM yyyy", { locale: dateLocale });
  } catch {
    return iso;
  }
}

function statusClass(statusValue) {
  return catalogStatusClass("leave_requests", statusValue);
}

function toggleMenu(id) {
  menuOpenFor.value = menuOpenFor.value === id ? null : id;
}

function handleRootClick() {
  menuOpenFor.value = null;
}

function onApprove(row) {
  menuOpenFor.value = null;
  emit("approve", row);
}

function onReject(row) {
  menuOpenFor.value = null;
  emit("reject", row);
}
</script>
