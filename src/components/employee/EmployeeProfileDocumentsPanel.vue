<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-6">
    <header class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-base font-semibold text-neutral-900">
          {{ t("admin.employees.view.documentsTitle") }}
        </h3>
        <p class="mt-0.5 text-sm text-neutral-500">
          {{ t("admin.employees.view.documentsHint") }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="btn-outline inline-flex items-center gap-1.5 text-sm"
          :disabled="loading"
          @click="load"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ t("common.refresh") }}
        </button>
        <button
          v-if="canGenerate"
          type="button"
          class="btn-secondary inline-flex items-center gap-1.5 text-sm"
          @click="$emit('generate')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ t("admin.employees.view.action.generateDocument") }}
        </button>
      </div>
    </header>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700"
    >
      {{ error }}
    </div>

    <div v-if="loading" class="space-y-3" aria-busy="true">
      <div v-for="i in 4" :key="'doc-sk-' + i" class="flex items-center gap-3">
        <Skeleton box-class="h-10 w-10 rounded-lg" />
        <div class="flex-1 space-y-2">
          <Skeleton box-class="h-4 w-48" />
          <Skeleton box-class="h-3 w-32" />
        </div>
      </div>
    </div>

    <div
      v-else-if="rows.length === 0"
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 py-12 text-center"
    >
      <div
        class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-neutral-800">
        {{ t("admin.employees.view.emptyDocuments") }}
      </p>
      <p class="mt-1 max-w-sm text-sm text-neutral-500">
        {{ t("admin.employees.view.emptyDocumentsHint") }}
      </p>
      <button
        v-if="canGenerate"
        type="button"
        class="btn-secondary mt-4 text-sm"
        @click="$emit('generate')"
      >
        {{ t("admin.employees.view.action.generateDocument") }}
      </button>
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-neutral-200">
      <table class="min-w-full divide-y divide-neutral-100 text-left">
        <thead class="bg-neutral-50/80">
          <tr>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {{ t("admin.leave.documents.col.document") }}
            </th>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {{ t("common.category") }}
            </th>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {{ t("admin.leave.documents.col.dates") }}
            </th>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {{ t("common.status") }}
            </th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {{ t("common.actions") }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100 bg-white">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="transition-colors hover:bg-neutral-50/60"
          >
            <td class="px-4 py-3">
              <div class="flex items-start gap-3">
                <div
                  class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600"
                  aria-hidden="true"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-neutral-900">{{ row.name }}</p>
                  <p class="text-xs text-neutral-500">
                    {{
                      row.reference && row.reference !== "—"
                        ? t("admin.leave.documents.ref", { ref: row.reference })
                        : "—"
                    }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-700">{{ row.category }}</td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-neutral-700">
              <p>{{ formatDate(row.issueDate) }}</p>
              <p class="text-xs text-neutral-500">
                {{
                  row.expiryDate
                    ? t("admin.leave.documents.expiryShort", { date: formatDate(row.expiryDate) })
                    : t("admin.leave.documents.noExpiry")
                }}
              </p>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                :class="statusClass(row)"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <div class="inline-flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  @click="openDetails(row)"
                >
                  {{ t("common.view") }}
                </button>
                <a
                  v-if="row.fileUrl"
                  :href="row.fileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center rounded-md bg-secondary-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-secondary-600"
                >
                  {{ t("common.download") }}
                </a>
                <span
                  v-else
                  class="text-xs text-neutral-400"
                >—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmployeeDocumentDetailsModal
      v-model="detailsOpen"
      :record="detailsRow"
      :title="t('admin.leave.documents.details')"
      :show-employee="false"
    />
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import Skeleton from "../common/Skeleton.vue";
import EmployeeDocumentDetailsModal from "../employee-documents/EmployeeDocumentDetailsModal.vue";
import { employeeDocumentsApiService } from "../../pages/self-service/services/employeeDocuments.api.service.js";
import { normalizeEmployeeDocument } from "../../pages/self-service/composables/useMyDocuments.js";
import {
  documentCategoriesApiService,
  fallbackDocumentCategories,
} from "../../pages/employee-documents/services/documentCategories.api.service.js";
import { parseApiError } from "../../utils/apiErrors.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  employeeId: { type: [Number, String], default: null },
  canGenerate: { type: Boolean, default: false },
  reloadKey: { type: [Number, String], default: 0 },
});

defineEmits(["generate"]);

const { t, bcp47 } = useI18n();
const rows = ref([]);
const loading = ref(false);
const error = ref("");
const catalog = ref(fallbackDocumentCategories());
const detailsOpen = ref(false);
const detailsRow = ref(null);

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString(bcp47.value || "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(row) {
  const s = String(row?.statusValue || "").toLowerCase();
  if (s === "verified") return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (s === "rejected") return "bg-rose-50 text-rose-700 ring-rose-600/20";
  if (s === "pending") return "bg-amber-50 text-amber-800 ring-amber-600/20";
  return "bg-neutral-50 text-neutral-700 ring-neutral-500/20";
}

function openDetails(row) {
  detailsRow.value = row;
  detailsOpen.value = true;
}

async function load() {
  if (!props.employeeId) {
    rows.value = [];
    return;
  }
  loading.value = true;
  error.value = "";
  try {
    const [list, categories] = await Promise.all([
      employeeDocumentsApiService.fetchAll({ employee_id: props.employeeId }),
      documentCategoriesApiService.fetchAll().catch(() => fallbackDocumentCategories()),
    ]);
    catalog.value = Array.isArray(categories) && categories.length
      ? categories
      : fallbackDocumentCategories();
    rows.value = (Array.isArray(list) ? list : []).map((raw) =>
      normalizeEmployeeDocument(raw, catalog.value),
    );
  } catch (e) {
    error.value = parseApiError(e) || t("admin.employees.view.documentsLoadError");
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.employeeId, props.reloadKey],
  () => {
    load();
  },
  { immediate: true },
);

defineExpose({ load });
</script>
