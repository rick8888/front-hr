<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <!-- Title + action -->
    <header
      v-if="title || $slots.action || actionLabel"
      class="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6"
    >
      <h2 v-if="title" class="text-base font-semibold text-neutral-900">
        {{ title }}
      </h2>
      <div class="flex flex-wrap items-center gap-2">
        <slot name="action">
          <button
            v-if="actionLabel"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600"
            @click="$emit('action')"
          >
            {{ actionLabel }}
          </button>
        </slot>
      </div>
    </header>

    <!-- Filters -->
    <div
      v-if="$slots.filters"
      class="px-5 pt-5 md:px-6"
    >
      <slot name="filters" />
    </div>

    <!-- Toolbar -->
    <div
      v-if="!hideToolbar"
      class="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-6"
    >
      <div v-if="searchable" class="flex flex-1 items-center">
        <input
          :value="searchQuery"
          type="search"
          :placeholder="searchPlaceholder"
          class="h-8 w-56 rounded-md border border-neutral-300 px-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
      </div>

      <label class="flex items-center gap-2 text-sm text-neutral-600">
        Show
        <select
          :value="pageSize"
          class="h-8 w-16 rounded-md border border-neutral-300 bg-white px-2 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @change="$emit('update:pageSize', Number($event.target.value))"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
        entries
      </label>

      <slot name="toolbar" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-left text-sm">
        <slot />
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pageCount > 0"
      class="flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
    >
      <p class="text-sm text-neutral-500">
        Showing
        <span class="font-medium text-neutral-700">{{ rangeFrom }}</span>
        to
        <span class="font-medium text-neutral-700">{{ rangeTo }}</span>
        of
        <span class="font-medium text-neutral-700">{{ total }}</span>
        entries
      </p>
      <nav class="flex flex-wrap items-center justify-end gap-2" aria-label="Pagination">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          Previous
        </button>
        <template v-for="(item, idx) in visiblePages" :key="idx">
          <span v-if="item === 'ellipsis'" class="px-1 text-sm text-neutral-400">...</span>
          <button
            v-else
            type="button"
            class="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md text-sm font-medium transition-colors"
            :class="
              item === currentPage
                ? 'bg-secondary-500 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100'
            "
            @click="$emit('update:currentPage', item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage >= pageCount"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          Next
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { getVisiblePages } from "../../composables/useLeaveRequestsTable.js";

defineEmits([
  "action",
  "update:currentPage",
  "update:pageSize",
  "update:searchQuery",
]);

const props = defineProps({
  title: { type: String, default: "" },
  actionLabel: { type: String, default: "" },
  total: { type: Number, default: 0 },
  rangeFrom: { type: Number, default: 0 },
  rangeTo: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageCount: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  pageSizeOptions: { type: Array, default: () => [10, 25, 50, 100] },
  hideToolbar: { type: Boolean, default: false },
  /** Affiche un champ de recherche à gauche du toolbar. */
  searchable: { type: Boolean, default: false },
  searchQuery: { type: String, default: "" },
  searchPlaceholder: { type: String, default: "Search..." },
});

const visiblePages = computed(() =>
  getVisiblePages(props.currentPage, props.pageCount),
);
</script>
