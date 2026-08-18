<template>
  <article
    class="relative flex flex-col rounded-xl border border-emerald-100/80 bg-emerald-50/95 shadow-sm ring-1 ring-emerald-100/60"
  >
    <div class="flex border-l-[3px] border-l-amber-400 pl-4 pr-4 pt-4 pb-3">
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-base font-bold text-neutral-900">
            {{ note.title }}
          </h3>
          <button
            type="button"
            class="flex-shrink-0 rounded-md p-0.5 text-amber-500 hover:bg-white/60"
            :aria-label="t('ss.notes.card.pinned')"
            @click="$emit('pin', note)"
          >
            <span class="text-lg leading-none" aria-hidden="true">{{ "\u{1F4CC}" }}</span>
          </button>
        </div>
        <p class="mt-1 text-xs text-neutral-500">
          {{ t("ss.notes.card.updated", { when: updatedLabel }) }}
        </p>
        <p v-if="note.body" class="mt-3 text-sm text-neutral-800">
          {{ note.body }}
        </p>
        <ul v-if="note.checklist?.length" class="mt-3 space-y-2">
          <li
            v-for="item in note.checklist"
            :key="item.id"
            class="flex items-start gap-2 text-sm text-neutral-800"
          >
            <span
              class="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 rounded border border-neutral-300 bg-white"
              aria-hidden="true"
            />
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-emerald-200/70 px-4 py-2">
      <div class="flex justify-end gap-1">
        <button
          type="button"
          class="rounded-md p-2 text-sky-600 hover:bg-white/70"
          :aria-label="t('common.edit')"
          @click="$emit('edit', note)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="rounded-md p-2 text-amber-500 hover:bg-white/70"
          :aria-label="t('ss.notes.card.pin')"
          @click="$emit('pin', note)"
        >
          <span class="text-base leading-none" aria-hidden="true">{{ "\u{1F4CC}" }}</span>
        </button>
        <button
          type="button"
          class="rounded-md p-2 text-neutral-500 hover:bg-white/70"
          :aria-label="t('ss.notes.card.archive')"
          @click="$emit('archive', note)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </button>
        <button
          type="button"
          class="rounded-md p-2 text-rose-600 hover:bg-white/70"
          :aria-label="t('common.delete')"
          @click="$emit('delete', note)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { formatUpdatedRelative, MY_NOTES_REFERENCE_TODAY } from "../../data/myNotesDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  note: { type: Object, required: true },
});

defineEmits(["edit", "pin", "archive", "delete"]);

const { t, locale } = useI18n();

const updatedLabel = computed(() => {
  void locale.value;
  return formatUpdatedRelative(props.note.updatedAt, MY_NOTES_REFERENCE_TODAY, t);
});
</script>
