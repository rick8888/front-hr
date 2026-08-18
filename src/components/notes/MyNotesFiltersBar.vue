<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs md:p-5"
  >
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end"
    >
      <div>
        <label
          for="my-notes-search"
          class="mb-1.5 block text-xs font-medium text-neutral-500"
        >
          {{ t("ss.notes.filters.search") }}
        </label>
        <input
          id="my-notes-search"
          type="search"
          :value="model.search"
          :placeholder="t('ss.notes.filters.searchPlaceholder')"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @input="patch({ search: $event.target.value })"
        />
      </div>

      <div>
        <label
          for="my-notes-tag"
          class="mb-1.5 block text-xs font-medium text-neutral-500"
        >
          {{ t("ss.notes.filters.tag") }}
        </label>
        <select
          id="my-notes-tag"
          :value="model.tag"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @change="patch({ tag: $event.target.value })"
        >
          <option v-for="opt in tagOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div>
        <label
          for="my-notes-view"
          class="mb-1.5 block text-xs font-medium text-neutral-500"
        >
          {{ t("ss.notes.filters.view") }}
        </label>
        <select
          id="my-notes-view"
          :value="model.view"
          class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @change="patch({ view: $event.target.value })"
        >
          <option
            v-for="opt in viewOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="flex md:justify-end xl:pb-0">
        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 md:w-auto"
          @click="$emit('clear')"
        >
          <svg
            class="h-4 w-4 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {{ t("ss.notes.filters.clear") }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  model: { type: Object, required: true },
  tagOptions: { type: Array, required: true },
  viewOptions: { type: Array, required: true },
});

const emit = defineEmits(["update:model", "clear"]);

const { t } = useI18n();

function patch(partial) {
  emit("update:model", { ...props.model, ...partial });
}
</script>
