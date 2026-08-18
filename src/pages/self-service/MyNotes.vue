<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="mb-2 flex flex-wrap items-start justify-between gap-4">
        <h1 class="text-2xl font-semibold tracking-tight text-neutral-800">
          {{ t("ss.notes.title") }}
        </h1>
        <div class="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
          <nav
            class="flex flex-wrap items-center justify-end gap-2 text-sm text-neutral-500"
            aria-label="Breadcrumb"
          >
            <RouterLink
              to="/"
              class="inline-flex items-center gap-1.5 transition-colors hover:text-secondary-600"
            >
              <svg
                class="h-4 w-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>{{ t("common.home") }}</span>
            </RouterLink>
            <span class="select-none text-neutral-300" aria-hidden="true">/</span>
            <span class="font-medium text-neutral-700">{{ t("ss.notes.title") }}</span>
          </nav>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 self-end rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600"
            @click="addOpen = true"
          >
            + {{ t("ss.notes.addNew") }}
          </button>
        </div>
      </div>

      <MyNotesFiltersBar
        v-model:model="filters"
        :tag-options="tagOptions"
        :view-options="viewOptions"
        @clear="onClearFilters"
      />

      <div
        v-if="!filteredNotes.length"
        class="rounded-xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500"
      >
        {{ t("ss.notes.emptyFiltered") }}
      </div>
      <div
        v-else
        class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <NoteStickyCard
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          @edit="onEdit"
          @pin="onPin"
          @archive="onArchive"
          @delete="onDelete"
        />
      </div>
    </div>

    <AddNoteModal
      v-model="addOpen"
      :assignable-tags="assignableTags"
      @submit="onAddNote"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('ss.notes.deleteTitle')"
      variant="danger"
      :message="deleteMessage"
      :confirm-text="t('common.delete')"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import MyNotesFiltersBar from "../../components/notes/MyNotesFiltersBar.vue";
import NoteStickyCard from "../../components/notes/NoteStickyCard.vue";
import AddNoteModal from "../../components/notes/AddNoteModal.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import {
  MY_NOTES_REFERENCE_TODAY,
  MY_NOTES_TAG_ALL,
  MY_NOTES_TAG_OPTIONS,
  MY_NOTES_VIEW_OPTIONS,
  myNotesSeed,
} from "../../data/myNotesDemo.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const tagOptions = computed(() => {
  void locale.value;
  return MY_NOTES_TAG_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));
});

const viewOptions = computed(() => {
  void locale.value;
  return MY_NOTES_VIEW_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));
});

const assignableTags = computed(() =>
  MY_NOTES_TAG_OPTIONS.filter((opt) => opt.value !== MY_NOTES_TAG_ALL).map((opt) => ({
    value: opt.value,
    labelKey: opt.labelKey,
  })),
);

const notes = ref(myNotesSeed.map((n) => ({ ...n })));

const filters = ref({
  search: "",
  tag: MY_NOTES_TAG_ALL,
  view: "active",
});

const addOpen = ref(false);
const deleteOpen = ref(false);
const noteToDelete = ref(null);

const deleteMessage = computed(() => {
  void locale.value;
  return noteToDelete.value
    ? t("ss.notes.deleteMessage", { title: noteToDelete.value.title })
    : "";
});

const filteredNotes = computed(() => {
  const q = filters.value.search.trim().toLowerCase();
  const tag = filters.value.tag;
  const view = filters.value.view;

  return notes.value.filter((n) => {
    if (view === "active" && n.status !== "active") return false;
    if (view === "archived" && n.status !== "archived") return false;

    if (tag !== MY_NOTES_TAG_ALL && !(n.tags || []).includes(tag)) return false;

    if (!q) return true;
    const inTitle = (n.title || "").toLowerCase().includes(q);
    const inBody = (n.body || "").toLowerCase().includes(q);
    const inList = (n.checklist || []).some((c) =>
      (c.label || "").toLowerCase().includes(q),
    );
    return inTitle || inBody || inList;
  });
});

function onClearFilters() {
  filters.value = {
    search: "",
    tag: MY_NOTES_TAG_ALL,
    view: "active",
  };
}

function onAddNote(payload) {
  const id =
    notes.value.reduce((m, x) => Math.max(m, x.id), 0) + 1;
  notes.value.unshift({
    id,
    title: payload.title,
    body: payload.body,
    checklist: [],
    updatedAt: MY_NOTES_REFERENCE_TODAY,
    tags: [payload.tag],
    pinned: false,
    status: "active",
  });
}

function onEdit(note) {
  // eslint-disable-next-line no-console
  console.info("Edit note", note);
}

function onPin(note) {
  const i = notes.value.findIndex((x) => x.id === note.id);
  if (i === -1) return;
  notes.value[i] = { ...notes.value[i], pinned: !notes.value[i].pinned };
}

function onArchive(note) {
  const i = notes.value.findIndex((x) => x.id === note.id);
  if (i === -1) return;
  const next =
    notes.value[i].status === "archived" ? "active" : "archived";
  notes.value[i] = {
    ...notes.value[i],
    status: next,
    updatedAt: MY_NOTES_REFERENCE_TODAY,
  };
}

function onDelete(note) {
  noteToDelete.value = note;
  deleteOpen.value = true;
}

function confirmDelete() {
  if (!noteToDelete.value) return;
  notes.value = notes.value.filter((n) => n.id !== noteToDelete.value.id);
  noteToDelete.value = null;
  deleteOpen.value = false;
}
</script>
