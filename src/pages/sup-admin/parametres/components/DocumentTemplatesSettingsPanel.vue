<template>
  <div class="space-y-6">
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <p class="text-sm text-neutral-500">
      {{ platformOnly ? t("admin.employees.documentTemplates.hintPlatform") : t("admin.employees.documentTemplates.hintTenant") }}
    </p>

    <div class="grid gap-4 sm:grid-cols-3">
      <KpiCard
        :title="t('admin.employees.documentTemplates.kpiTotal')"
        :value="stats.total"
        :unit-label="t('admin.employees.documentTemplates.kpiModels')"
        tone="violet"
        :loading="loading"
      />
      <KpiCard
        :title="t('admin.employees.documentTemplates.kpiPublished')"
        :value="stats.published"
        :unit-label="t('admin.employees.documentTemplates.kpiLive')"
        tone="green"
        :loading="loading"
      />
      <KpiCard
        :title="t('admin.employees.documentTemplates.kpiSystem')"
        :value="stats.system"
        :unit-label="t('admin.employees.documentTemplates.kpiProtected')"
        tone="blue"
        :loading="loading"
      />
    </div>

    <div class="flex flex-wrap gap-3">
      <select v-model="familyFilter" class="input-base text-sm">
        <option value="all">{{ t("admin.employees.documentTemplates.filterAllFamilies") }}</option>
        <option v-for="f in families" :key="f.value" :value="f.value">{{ t(f.labelKey) }}</option>
      </select>
      <select v-model="channelFilter" class="input-base text-sm">
        <option value="all">{{ t("admin.employees.documentTemplates.filterAllChannels") }}</option>
        <option v-for="c in channels" :key="c.value" :value="c.value">{{ t(c.labelKey) }}</option>
      </select>
    </div>

    <ListingTableShell
      search-id="document-templates-search"
      :search-placeholder="t('admin.employees.documentTemplates.searchPlaceholder')"
      :add-button-label="t('admin.employees.documentTemplates.add')"
      :total="filteredTemplates.length"
      :range-from="rangeLabel.from"
      :range-to="rangeLabel.to"
      :current-page="currentPage"
      :page-count="pageCount"
      :page-size="pageSize"
      :search-query="searchQuery"
      @add="openCreate"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @update:search-query="searchQuery = $event"
    >
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50/80">
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.employees.documentTemplates.col.name") }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("common.code") }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.employees.documentTemplates.col.family") }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">{{ t("admin.employees.documentTemplates.col.status") }}</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">{{ t("common.actions") }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr v-if="loading">
          <td colspan="5" class="px-6 py-12 text-center text-sm text-neutral-500">{{ t("common.loading") }}</td>
        </tr>
        <tr v-else-if="!paginatedTemplates.length">
          <td colspan="5" class="px-6 py-12 text-center text-sm text-neutral-500">
            {{ t("admin.employees.documentTemplates.empty") }}
          </td>
        </tr>
        <tr v-for="row in paginatedTemplates" :key="row.id" class="hover:bg-neutral-50/60">
          <td class="px-4 py-3">
            <div class="font-medium text-neutral-900">{{ row.name }}</div>
            <div class="text-xs text-neutral-500 line-clamp-1">{{ row.bodyHtmlPreview || "—" }}</div>
            <span
              v-if="row.scope === 'platform' && !platformOnly"
              class="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {{ t("admin.employees.documentTemplates.scopePlatform") }}
            </span>
          </td>
          <td class="px-4 py-3 font-mono text-sm text-neutral-700">{{ row.code }}</td>
          <td class="px-4 py-3 text-sm text-neutral-600">
            {{ familyLabel(row.family) }} · {{ channelLabel(row.channel) }} · v{{ row.version }}
          </td>
          <td class="px-4 py-3">
            <span
              :class="[
                'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                row.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800',
              ]"
            >
              {{ row.status === "published" ? t("admin.employees.documentTemplates.statusPublished") : t("admin.employees.documentTemplates.statusDraft") }}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            <div class="inline-flex flex-wrap items-center justify-end gap-1">
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                :title="t('admin.employees.documentTemplates.preview')"
                :aria-label="t('admin.employees.documentTemplates.preview')"
                @click="openPreview(row)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                v-if="canEditRow(row)"
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                :title="t('common.edit')"
                :aria-label="t('common.edit')"
                @click="openEdit(row)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                v-if="canEditRow(row) && row.status !== 'published'"
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-green-700 transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                :title="t('admin.employees.documentTemplates.publish')"
                :aria-label="t('admin.employees.documentTemplates.publish')"
                @click="publishTemplate(row)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l5 5L20 7" />
                </svg>
              </button>
              <button
                v-if="allowDuplicate && row.scope === 'platform'"
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                :title="t('admin.employees.documentTemplates.duplicate')"
                :aria-label="t('admin.employees.documentTemplates.duplicate')"
                @click="duplicateTemplate(row)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-3M5 8h9a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2z" />
                </svg>
              </button>
              <button
                v-if="canEditRow(row) && !row.isSystem"
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-error-600 transition-colors hover:bg-error-50 focus:outline-none focus:ring-2 focus:ring-error-500"
                :title="t('common.delete')"
                :aria-label="t('common.delete')"
                @click="askDelete(row)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </ListingTableShell>

    <DocumentTemplateFormModal
      v-model:open="formOpen"
      :template="editingTemplate"
      :variables="variables"
      :busy="saving"
      @save="saveForm"
    />

    <DocumentTemplatePreviewModal
      v-model:open="previewOpen"
      :template="previewTemplate"
    />

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('admin.employees.documentTemplates.deleteTitle')"
      :message="t('admin.employees.documentTemplates.deleteMessage', { name: deleteTarget?.name || '' })"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      variant="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import KpiCard from "../../../../components/common/KpiCard.vue";
import ConfirmDialog from "../../../../components/common/ConfirmDialog.vue";
import ListingTableShell from "../../../../components/leave-management/ListingTableShell.vue";
import DocumentTemplateFormModal from "./DocumentTemplateFormModal.vue";
import DocumentTemplatePreviewModal from "./DocumentTemplatePreviewModal.vue";
import {
  DOCUMENT_TEMPLATE_CHANNELS,
  DOCUMENT_TEMPLATE_FAMILIES,
} from "../../../employees/services/documentTemplates.api.service.js";
import { useDocumentTemplatesSettings } from "../composables/useDocumentTemplatesSettings.js";
import { useI18n } from "../../../../i18n/index.js";

const props = defineProps({
  platformOnly: { type: Boolean, default: false },
  initialFamilyFilter: { type: String, default: "all" },
  initialChannelFilter: { type: String, default: "all" },
});

const { t } = useI18n();
const families = DOCUMENT_TEMPLATE_FAMILIES;
const channels = DOCUMENT_TEMPLATE_CHANNELS;

const previewOpen = ref(false);
const previewTemplate = ref(null);

function openPreview(row) {
  previewTemplate.value = row;
  previewOpen.value = true;
}

const {
  loading,
  error,
  searchQuery,
  familyFilter,
  channelFilter,
  currentPage,
  pageSize,
  formOpen,
  editingTemplate,
  saving,
  deleteTarget,
  deleteOpen,
  stats,
  filteredTemplates,
  pageCount,
  paginatedTemplates,
  rangeLabel,
  allowDuplicate,
  variables,
  openCreate,
  openEdit,
  saveForm,
  publishTemplate,
  duplicateTemplate,
  askDelete,
  confirmDelete,
} = useDocumentTemplatesSettings({
  platformOnly: props.platformOnly,
  initialFamilyFilter: props.initialFamilyFilter,
  initialChannelFilter: props.initialChannelFilter,
});

function familyLabel(value) {
  const f = families.find((x) => x.value === value);
  return f ? t(f.labelKey) : value;
}

function channelLabel(value) {
  const c = channels.find((x) => x.value === value);
  return c ? t(c.labelKey) : value;
}

function canEditRow(row) {
  if (props.platformOnly) return true;
  return row.scope === "company";
}
</script>
