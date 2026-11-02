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
                class="rounded px-2 py-1 text-xs font-medium text-secondary-700 hover:bg-secondary-50"
                @click="openPreview(row)"
              >
                {{ t("admin.employees.documentTemplates.preview") }}
              </button>
              <button
                v-if="canEditRow(row)"
                type="button"
                class="rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                @click="openEdit(row)"
              >
                {{ t("common.edit") }}
              </button>
              <button
                v-if="canEditRow(row) && row.status !== 'published'"
                type="button"
                class="rounded px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                @click="publishTemplate(row)"
              >
                {{ t("admin.employees.documentTemplates.publish") }}
              </button>
              <button
                v-if="allowDuplicate && row.scope === 'platform'"
                type="button"
                class="rounded px-2 py-1 text-xs font-medium text-secondary-700 hover:bg-secondary-50"
                @click="duplicateTemplate(row)"
              >
                {{ t("admin.employees.documentTemplates.duplicate") }}
              </button>
              <button
                v-if="canEditRow(row) && !row.isSystem"
                type="button"
                class="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                @click="askDelete(row)"
              >
                {{ t("common.delete") }}
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
} = useDocumentTemplatesSettings({ platformOnly: props.platformOnly });

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
