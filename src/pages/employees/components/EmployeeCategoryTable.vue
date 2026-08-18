<template>
  <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-neutral-100"
    >
      <h2 class="text-base font-semibold text-neutral-900">{{ title }}</h2>
      <RouterLink
        to="/employees/new"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        {{ t("admin.employees.add") }}
      </RouterLink>
    </div>

    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4"
    >
      <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
        <span>{{ t("common.show") }}</span>
        <select
          :value="itemsPerPage"
          class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 focus:outline-none focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
          @change="$emit('update:itemsPerPage', Number($event.target.value))"
        >
          <option v-for="n in [10, 25, 50, 100]" :key="n" :value="n">{{ n }}</option>
        </select>
        <span>{{ t("common.entries") }}</span>
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
        <span>{{ t("common.search") }}</span>
        <input
          :value="searchQuery"
          type="text"
          :placeholder="t('admin.employees.cat.searchPlaceholder')"
          class="w-48 sm:w-56 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
      </label>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase border-t border-b border-neutral-100"
          >
            <th class="px-6 py-3 w-16">ID</th>
            <th class="px-6 py-3 min-w-[220px]">{{ t("admin.employees.col.employee") }}</th>
            <th class="px-6 py-3">{{ t("admin.employees.cat.col.phone") }}</th>
            <th class="px-6 py-3">{{ t("admin.employees.col.role") }}</th>
            <th class="px-6 py-3">{{ t("admin.employees.cat.col.attendanceType") }}</th>
            <th class="px-6 py-3">{{ t("admin.employees.cat.col.team") }}</th>
            <th class="px-6 py-3">{{ t("common.status") }}</th>
            <th class="px-6 py-3 w-20 text-right pr-8">{{ t("common.actions") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="8" class="px-6 py-10 text-center text-sm text-neutral-500">
              {{ t("common.loading") }}
            </td>
          </tr>
          <tr v-else-if="!employees.length">
            <td colspan="8" class="px-6 py-10 text-center text-sm text-neutral-500">
              {{ t("admin.employees.noResults") }}
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="employee in employees"
              :key="employee.id"
              class="hover:bg-neutral-50/60 transition-colors"
            >
            <td class="px-6 py-4 text-neutral-700">{{ employee.id }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-secondary-100 text-secondary-700"
                >
                  {{ getInitials(employee.name) }}
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ employee.name }}</div>
                  <div class="text-xs text-neutral-500">{{ employee.uid }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-neutral-700">{{ employee.phone || t("common.notApplicable") }}</td>
            <td class="px-6 py-4 text-neutral-700">{{ employee.role || t("common.notApplicable") }}</td>
            <td class="px-6 py-4">
              <span class="badge badge-secondary">{{ employee.attendanceType || t("admin.employees.cat.openAttendance") }}</span>
            </td>
            <td class="px-6 py-4 text-neutral-700">{{ employee.team || t("common.notApplicable") }}</td>
            <td class="px-6 py-4">
              <span :class="['badge', statusBadgeClass]">{{ statusLabel }}</span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                type="button"
                class="p-1.5 text-neutral-400 hover:text-secondary-600 transition-colors"
                :title="t('admin.employees.cat.view')"
                @click="$emit('view', employee)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </button>
            </td>
          </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-neutral-100"
    >
      <p class="text-sm text-neutral-600">
        {{
          t("admin.employees.cat.displaying", {
            from: paginationFrom,
            to: paginationTo,
            total: totalEntries,
          })
        }}
      </p>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="px-3 py-1.5 text-sm border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="$emit('page', currentPage - 1)"
        >
          {{ t("common.previous") }}
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          type="button"
          :class="[
            'min-w-[2rem] px-3 py-1.5 text-sm rounded-md border transition-colors',
            page === currentPage
              ? 'bg-secondary-500 border-secondary-500 text-white'
              : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50',
          ]"
          @click="$emit('page', page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-sm border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="$emit('page', currentPage + 1)"
        >
          {{ t("common.next") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

defineProps({
  title: { type: String, required: true },
  employees: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  statusLabel: { type: String, required: true },
  statusBadgeClass: { type: String, default: "badge-info" },
  searchQuery: { type: String, default: "" },
  itemsPerPage: { type: Number, default: 10 },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  paginationFrom: { type: Number, default: 0 },
  paginationTo: { type: Number, default: 0 },
  totalEntries: { type: Number, default: 0 },
  pageNumbers: { type: Array, default: () => [] },
  getInitials: { type: Function, required: true },
});

defineEmits(["update:searchQuery", "update:itemsPerPage", "page", "view"]);
</script>

<style scoped>
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-info {
  @apply bg-info-50 text-info-700;
}

.badge-warning {
  @apply bg-warning-50 text-warning-700;
}

.badge-neutral {
  @apply bg-neutral-100 text-neutral-700;
}

.badge-secondary {
  @apply bg-secondary-50 text-secondary-700;
}
</style>
