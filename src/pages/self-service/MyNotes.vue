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
            :disabled="loading || saving"
            class="inline-flex items-center justify-center gap-1.5 self-end rounded-lg bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary-600"
            @click="openNewNote"
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

      <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
        <button type="button" class="ml-2 font-semibold underline" :disabled="loading" @click="loadNotes">
          {{ t("common.retry") }}
        </button>
      </p>

      <div v-if="loading" class="rounded-xl border border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">
        {{ t("common.loading") }}
      </div>
      <div
        v-else-if="!error && !filteredNotes.length"
        class="rounded-xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500"
      >
        {{ notes.length ? t("ss.notes.emptyFiltered") : t("ss.notes.empty") }}
      </div>
      <div
        v-else-if="filteredNotes.length"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <NoteStickyCard
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          :disabled="saving"
          @edit="onEdit"
          @pin="onPin"
          @archive="onArchive"
          @delete="onDelete"
        />
      </div>
    </div>

    <AddNoteModal
      :model-value="addOpen"
      :initial-note="editingNote"
      :saving="saving"
      :assignable-tags="assignableTags"
      @submit="onSaveNote"
      @update:model-value="onNoteModalVisibilityChange"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('ss.notes.deleteTitle')"
      variant="danger"
      :message="deleteMessage"
      :confirm-text="t('common.delete')"
      :busy="saving"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import MyNotesFiltersBar from "../../components/notes/MyNotesFiltersBar.vue";
import NoteStickyCard from "../../components/notes/NoteStickyCard.vue";
import AddNoteModal from "../../components/notes/AddNoteModal.vue";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import {
  MY_NOTES_TAG_ALL,
  MY_NOTES_TAG_OPTIONS,
  MY_NOTES_VIEW_OPTIONS,
} from "../../data/myNotesDemo.js";
import { useI18n } from "../../i18n/index.js";
import { notesApiService } from "./services/notes.api.service.js";
import { parseApiError } from "../../utils/apiErrors.js";

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

const notes = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

const filters = ref({
  search: "",
  tag: MY_NOTES_TAG_ALL,
  view: "active",
});

const addOpen = ref(false);
const deleteOpen = ref(false);
const noteToDelete = ref(null);
const editingNote = ref(null);

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

async function loadNotes() {
  loading.value = true;
  error.value = "";
  try {
    notes.value = await notesApiService.fetchAll();
  } catch (requestError) {
    error.value = parseApiError(requestError);
  } finally {
    loading.value = false;
  }
}

function onClearFilters() {
  filters.value = {
    search: "",
    tag: MY_NOTES_TAG_ALL,
    view: "active",
  };
}

async function onSaveNote(payload) {
  saving.value = true;
  error.value = "";
  try {
    if (editingNote.value) {
      const updated = await notesApiService.update(editingNote.value.id, {
        title: payload.title,
        body: payload.body,
        tags: [payload.tag],
      });
      replaceNote(updated);
      editingNote.value = null;
    } else {
      const created = await notesApiService.create({
        title: payload.title,
        body: payload.body,
        tags: [payload.tag],
        checklist: [],
        pinned: false,
        status: "active",
      });
      notes.value.unshift(created);
    }
    addOpen.value = false;
  } catch (requestError) {
    error.value = parseApiError(requestError);
  } finally {
    saving.value = false;
  }
}

function replaceNote(updated) {
  const index = notes.value.findIndex((note) => note.id === updated.id);
  if (index !== -1) notes.value[index] = updated;
}

function onEdit(note) {
  editingNote.value = note;
  addOpen.value = true;
}

function openNewNote() {
  editingNote.value = null;
  addOpen.value = true;
}

function onNoteModalVisibilityChange(isOpen) {
  addOpen.value = isOpen;
  if (!isOpen) editingNote.value = null;
}

async function onPin(note) {
  await updateNote(note, { pinned: !note.pinned });
}

async function onArchive(note) {
  const status = note.status === "archived" ? "active" : "archived";
  await updateNote(note, { status });
}

async function updateNote(note, payload) {
  if (saving.value) return;
  saving.value = true;
  error.value = "";
  try {
    replaceNote(await notesApiService.update(note.id, payload));
  } catch (requestError) {
    error.value = parseApiError(requestError);
  } finally {
    saving.value = false;
  }
}

function onDelete(note) {
  noteToDelete.value = note;
  deleteOpen.value = true;
}

async function confirmDelete() {
  if (!noteToDelete.value) return;
  saving.value = true;
  error.value = "";
  try {
    await notesApiService.remove(noteToDelete.value.id);
    notes.value = notes.value.filter((note) => note.id !== noteToDelete.value.id);
    noteToDelete.value = null;
    deleteOpen.value = false;
  } catch (requestError) {
    error.value = parseApiError(requestError);
  } finally {
    saving.value = false;
  }
}

onMounted(loadNotes);
</script>
