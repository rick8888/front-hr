<template>
  <Modal
    :model-value="open"
    size="2xl"
    hide-footer
    :title="modalTitle"
    @update:model-value="$emit('update:open', $event)"
  >
    <div class="flex flex-col gap-5 lg:flex-row lg:items-stretch">
      <!-- Formulaire -->
      <div class="min-w-0 flex-1 space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("admin.employees.documentTemplates.col.name") }}
              <span class="text-error-600">*</span>
            </label>
            <input
              v-model="localForm.name"
              type="text"
              class="input-base w-full text-sm"
              :placeholder="t('admin.employees.documentTemplates.namePlaceholder')"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("common.code") }} <span class="text-error-600">*</span>
            </label>
            <input
              v-model="localForm.code"
              type="text"
              class="input-base w-full font-mono text-sm"
              :disabled="isEdit && template?.isSystem"
              :placeholder="t('admin.employees.documentTemplates.codePlaceholder')"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("admin.employees.documentTemplates.col.locale") }}
            </label>
            <select v-model="localForm.locale" class="input-base w-full text-sm">
              <option value="fr">Français (fr)</option>
              <option value="en">English (en)</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("admin.employees.documentTemplates.col.family") }}
            </label>
            <select v-model="localForm.family" class="input-base w-full text-sm">
              <option v-for="f in families" :key="f.value" :value="f.value">
                {{ t(f.labelKey) }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-800">
              {{ t("admin.employees.documentTemplates.col.channel") }}
            </label>
            <select v-model="localForm.channel" class="input-base w-full text-sm">
              <option v-for="c in channels" :key="c.value" :value="c.value">
                {{ t(c.labelKey) }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="localForm.channel === 'email'">
          <label class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("admin.employees.documentTemplates.col.subject") }}
          </label>
          <input
            v-model="localForm.subject"
            type="text"
            class="input-base w-full text-sm"
            :placeholder="t('admin.employees.documentTemplates.subjectPlaceholder')"
          />
        </div>

        <div>
          <div class="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label class="text-sm font-medium text-neutral-800">
              {{ t("admin.employees.documentTemplates.col.body") }}
              <span class="text-error-600">*</span>
            </label>
            <div class="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
              <button
                type="button"
                class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                :class="
                  bodyMode === 'edit'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                "
                @click="bodyMode = 'edit'"
              >
                {{ t("admin.employees.documentTemplates.bodyModeEdit") }}
              </button>
              <button
                type="button"
                class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                :class="
                  bodyMode === 'preview'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                "
                @click="bodyMode = 'preview'"
              >
                {{ t("admin.employees.documentTemplates.bodyModePreview") }}
              </button>
            </div>
          </div>

          <div
            v-if="bodyMode === 'edit'"
            class="overflow-hidden rounded-xl border border-neutral-200 focus-within:border-secondary-400 focus-within:ring-2 focus-within:ring-secondary-500/15"
          >
            <div
              class="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5"
            >
              <button
                v-for="snip in htmlSnippets"
                :key="snip.label"
                type="button"
                class="rounded px-2 py-1 text-[11px] font-medium text-neutral-600 hover:bg-white hover:text-neutral-900"
                :title="snip.title"
                @click="insertSnippet(snip.html)"
              >
                {{ snip.label }}
              </button>
            </div>
            <textarea
              ref="bodyRef"
              v-model="localForm.bodyHtml"
              rows="16"
              spellcheck="false"
              class="block w-full resize-y border-0 bg-neutral-950/95 px-3 py-3 font-mono text-[12px] leading-relaxed text-emerald-100 placeholder:text-neutral-500 focus:outline-none focus:ring-0"
              :placeholder="t('admin.employees.documentTemplates.bodyPlaceholder')"
            />
          </div>

          <div
            v-else
            class="template-preview min-h-[280px] rounded-xl border border-neutral-200 bg-white p-5 text-sm leading-relaxed text-neutral-800 shadow-inner"
            v-html="previewHtml"
          />
          <p class="mt-1.5 text-xs text-neutral-500">
            {{ t("admin.employees.documentTemplates.bodyHint") }}
          </p>
        </div>
      </div>

      <!-- Variables -->
      <aside
        class="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 lg:w-64 xl:w-72"
      >
        <div class="border-b border-neutral-200 bg-white px-3 py-2.5">
          <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {{ t("admin.employees.documentTemplates.variablesTitle") }}
          </p>
          <p class="mt-0.5 text-[11px] text-neutral-400">
            {{ t("admin.employees.documentTemplates.variablesHint") }}
          </p>
          <div class="relative mt-2">
            <svg
              class="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="variableQuery"
              type="search"
              class="input-base w-full py-1.5 pl-8 text-xs"
              :placeholder="t('admin.employees.documentTemplates.variablesSearch')"
            />
          </div>
        </div>

        <div class="max-h-[420px] flex-1 space-y-3 overflow-y-auto p-2">
          <div v-if="!groupedVariables.length" class="px-2 py-6 text-center text-xs text-neutral-400">
            {{ t("admin.employees.documentTemplates.variablesEmpty") }}
          </div>
          <div v-for="group in groupedVariables" :key="group.id">
            <p class="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {{ group.label }}
            </p>
            <ul class="space-y-0.5">
              <li v-for="v in group.items" :key="v.key">
                <button
                  type="button"
                  class="group flex w-full flex-col rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-white hover:shadow-sm"
                  @click="insertVariable(v.key)"
                >
                  <span class="text-xs font-medium text-neutral-800 group-hover:text-secondary-700">
                    {{ v.label }}
                  </span>
                  <code
                    class="mt-0.5 truncate font-mono text-[10px] text-secondary-600/90"
                  >{{ variablePlaceholder(v.key) }}</code>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>

    <div
      class="mt-5 -mx-6 -mb-4 flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50/80 px-6 py-4"
    >
      <button
        type="button"
        class="btn-outline text-sm"
        :disabled="busy"
        @click="$emit('update:open', false)"
      >
        {{ t("common.cancel") }}
      </button>
      <button
        type="button"
        class="btn-primary text-sm"
        :disabled="busy || !canSave"
        @click="submit"
      >
        {{ busy ? t("common.saving") : t("common.save") }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import {
  DOCUMENT_TEMPLATE_CHANNELS,
  DOCUMENT_TEMPLATE_FAMILIES,
} from "../../../employees/services/documentTemplates.api.service.js";
import { useI18n } from "../../../../i18n/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  template: { type: Object, default: null },
  variables: { type: Array, default: () => [] },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const { t, locale } = useI18n();
const bodyRef = ref(null);
const bodyMode = ref("edit");
const variableQuery = ref("");
const families = DOCUMENT_TEMPLATE_FAMILIES;
const channels = DOCUMENT_TEMPLATE_CHANNELS;

const isEdit = computed(() => !!props.template?.id);

const modalTitle = computed(() => {
  void locale.value;
  if (isEdit.value) {
    return t("admin.employees.documentTemplates.modalEdit", {
      name: props.template?.name || "",
    });
  }
  return t("admin.employees.documentTemplates.modalAdd");
});

const emptyForm = () => ({
  name: "",
  code: "",
  family: "contracts",
  channel: "pdf",
  locale: "fr",
  subject: "",
  bodyHtml: "<p>Bonjour {{ employee.full_name }},</p>\n",
  documentCategoryCode: "",
  sortOrder: 0,
  isActive: true,
});

const localForm = ref(emptyForm());

const canSave = computed(
  () =>
    !!localForm.value.name?.trim() &&
    !!localForm.value.code?.trim() &&
    !!localForm.value.bodyHtml?.trim(),
);

const htmlSnippets = computed(() => {
  void locale.value;
  return [
    { label: "H1", title: "Titre", html: "<h1></h1>" },
    { label: "H2", title: "Sous-titre", html: "<h2></h2>" },
    { label: "P", title: "Paragraphe", html: "<p></p>" },
    { label: "Bold", title: "Gras", html: "<strong></strong>" },
    { label: "BR", title: "Saut de ligne", html: "<br/>" },
  ];
});

const groupMeta = {
  employee: { order: 1, labelKey: "admin.employees.documentTemplates.varGroup.employee" },
  company: { order: 2, labelKey: "admin.employees.documentTemplates.varGroup.company" },
  termination: { order: 3, labelKey: "admin.employees.documentTemplates.varGroup.termination" },
  suspension: { order: 4, labelKey: "admin.employees.documentTemplates.varGroup.suspension" },
  other: { order: 5, labelKey: "admin.employees.documentTemplates.varGroup.other" },
};

const groupedVariables = computed(() => {
  void locale.value;
  const q = variableQuery.value.trim().toLowerCase();
  const filtered = (props.variables || []).filter((v) => {
    if (!q) return true;
    return (
      String(v.key || "").toLowerCase().includes(q) ||
      String(v.label || "").toLowerCase().includes(q)
    );
  });

  const buckets = {};
  for (const v of filtered) {
    const prefix = String(v.key || "").split(".")[0];
    const id = groupMeta[prefix] ? prefix : "other";
    if (!buckets[id]) buckets[id] = [];
    buckets[id].push(v);
  }

  return Object.entries(buckets)
    .map(([id, items]) => ({
      id,
      order: groupMeta[id]?.order ?? 99,
      label: t(groupMeta[id]?.labelKey || groupMeta.other.labelKey),
      items,
    }))
    .sort((a, b) => a.order - b.order);
});

const previewHtml = computed(() => {
  let html = localForm.value.bodyHtml || "";
  for (const v of props.variables || []) {
    const token = variablePlaceholder(v.key);
    const sample = v.example || v.label || v.key;
    html = html.split(token).join(`<mark class="rounded bg-amber-100 px-0.5 text-amber-900 not-prose">${escapeHtml(sample)}</mark>`);
  }
  return html;
});

watch(
  () => [props.open, props.template],
  () => {
    if (!props.open) return;
    bodyMode.value = "edit";
    variableQuery.value = "";
    if (props.template?.id) {
      localForm.value = {
        name: props.template.name,
        code: props.template.code,
        family: props.template.family,
        channel: props.template.channel,
        locale: props.template.locale || "fr",
        subject: props.template.subject || "",
        bodyHtml: props.template.bodyHtml || "",
        documentCategoryCode: props.template.documentCategoryCode || "",
        sortOrder: props.template.sortOrder ?? 0,
        isActive: props.template.isActive !== false,
      };
    } else {
      localForm.value = emptyForm();
    }
  },
  { immediate: true },
);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function variablePlaceholder(key) {
  return `{{ ${key} }}`;
}

async function insertAtCursor(token) {
  await nextTick();
  const el = bodyRef.value;
  if (el && typeof el.selectionStart === "number") {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = localForm.value.bodyHtml || "";
    localForm.value.bodyHtml = text.slice(0, start) + token + text.slice(end);
    await nextTick();
    el.focus();
    const pos = start + token.length;
    el.setSelectionRange(pos, pos);
  } else {
    localForm.value.bodyHtml = (localForm.value.bodyHtml || "") + token;
  }
}

function insertVariable(key) {
  bodyMode.value = "edit";
  insertAtCursor(variablePlaceholder(key));
}

function insertSnippet(html) {
  bodyMode.value = "edit";
  insertAtCursor(html);
}

function submit() {
  if (!canSave.value || props.busy) return;
  emit("save", { ...localForm.value });
}
</script>

<style scoped>
.template-preview :deep(h1) {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
}
.template-preview :deep(h2) {
  margin: 1rem 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
}
.template-preview :deep(p) {
  margin: 0 0 0.65rem;
}
.template-preview :deep(strong) {
  font-weight: 600;
}
</style>
