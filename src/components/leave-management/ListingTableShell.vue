<template>
  <section
    class="rounded-lg border border-neutral-200 bg-white shadow-sm"
    @click="$emit('dismiss')"
  >
    <header
      v-if="title"
      class="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 pt-5 md:px-6 md:pt-6"
    >
      <h2 class="text-base font-semibold text-neutral-800">{{ title }}</h2>
    </header>

    <!-- Toolbar -->
    <div
      class="flex w-full flex-col gap-4 border-b border-neutral-100 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-5"
    >
      <div class="flex items-center gap-4">
        <select
          :value="pageSize"
          class="h-9 w-[3.75rem] rounded-md border border-neutral-300 bg-white text-center text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          :aria-label="t('common.rowsPerPage')"
          @change="$emit('update:pageSize', Number($event.target.value))"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <div class="flex min-w-0 flex-1 justify-center px-0 md:px-4">
        <input
          :id="searchId"
          :value="searchQuery"
          type="search"
          class="w-full max-w-xl rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          :placeholder="searchPlaceholder"
          @input="$emit('update:searchQuery', $event.target.value)"
          @click.stop
        />
      </div>

      <div v-if="addButtonLabel" class="flex shrink-0 justify-start md:justify-end">
        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 shadow-xs transition-colors hover:bg-indigo-100 md:w-auto"
          @click.stop="$emit('add')"
        >
          {{ addButtonLabel }}
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-left">
        <slot />
      </table>
    </div>

    <div
      class="flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
    >
      <p class="text-sm text-neutral-600">
        {{ t("common.showingEntries", { from: rangeFrom, to: rangeTo, total }) }}
      </p>
      <nav class="flex flex-wrap items-center justify-end gap-1" aria-label="Pagination">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage <= 1"
          :aria-label="t('common.previousPage')"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <template v-for="(item, idx) in visiblePages" :key="idx">
          <span
            v-if="item === 'ellipsis'"
            class="flex h-9 min-w-[2.25rem] items-center justify-center px-1 text-sm text-neutral-400"
            >...</span
          >
          <button
            v-else
            type="button"
            class="flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border text-sm font-medium transition-colors"
            :class="
              item === currentPage
                ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
            "
            @click="$emit('update:currentPage', item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage >= pageCount"
          :aria-label="t('common.nextPage')"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { getVisiblePages } from "../../composables/useLeaveRequestsTable.js";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

defineEmits([
  "add",
  "dismiss",
  "update:currentPage",
  "update:pageSize",
  "update:searchQuery",
]);

const props = defineProps({
  searchPlaceholder: { type: String, default: "Search" },
  addButtonLabel: { type: String, default: "+ Add" },
  total: { type: Number, required: true },
  rangeFrom: { type: Number, default: 0 },
  rangeTo: { type: Number, default: 0 },
  currentPage: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  searchQuery: { type: String, default: "" },
  pageSizeOptions: {
    type: Array,
    default: () => [7, 10, 25, 50],
  },
  searchId: { type: String, default: "listing-search" },
  title: { type: String, default: "" },
});

const visiblePages = computed(() =>
  getVisiblePages(props.currentPage, props.pageCount),
);
</script>
