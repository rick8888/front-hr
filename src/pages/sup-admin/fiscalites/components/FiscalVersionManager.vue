<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4">
      <h2 class="text-base font-semibold text-neutral-800">Historique des versions</h2>
      <p class="text-xs text-neutral-500">Snapshots des modifications</p>
    </header>

    <ul v-if="paginatedVersions.length" class="divide-y divide-neutral-100">
      <li
        v-for="version in paginatedVersions"
        :key="version.id"
        class="flex items-center justify-between px-5 py-4"
        :class="version.is_latest ? 'bg-orange-50/40' : ''"
      >
        <div>
          <p class="text-sm font-medium">{{ formatDate(version.timestamp) }}</p>
          <p class="text-sm text-neutral-600">{{ version.summary }}</p>
        </div>
        <button
          v-if="!version.is_latest"
          type="button"
          class="btn-outline text-xs px-2 py-1 text-orange-700 border-orange-200"
          :disabled="disabled"
          @click="requestRestore(version)"
        >
          Restaurer
        </button>
        <span v-else class="text-xs text-green-700 font-medium">Actuelle</span>
      </li>
    </ul>

    <p v-else class="px-5 py-8 text-center text-sm text-neutral-500">
      Aucune version enregistrée.
    </p>

    <div
      v-if="total > PAGE_SIZE"
      class="flex flex-col gap-3 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-neutral-600">
        {{ rangeFrom }} à {{ rangeTo }} sur {{ total }} versions
      </p>
      <nav class="flex flex-wrap items-center justify-end gap-1" aria-label="Pagination">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage <= 1"
          aria-label="Page précédente"
          @click="currentPage -= 1"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <template v-for="(item, idx) in visiblePages" :key="idx">
          <span
            v-if="item === 'ellipsis'"
            class="flex h-8 min-w-[2rem] items-center justify-center px-1 text-sm text-neutral-400"
          >…</span>
          <button
            v-else
            type="button"
            class="flex h-8 min-w-[2rem] items-center justify-center rounded-md border text-sm font-medium transition-colors"
            :class="
              item === currentPage
                ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
            "
            @click="currentPage = item"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage >= pageCount"
          aria-label="Page suivante"
          @click="currentPage += 1"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>

    <ConfirmDialog v-model="confirmOpen" title="Restaurer cette version ?" :message="confirmMessage" confirm-text="Restaurer" variant="warning" @confirm="confirmRestore" />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import ConfirmDialog from "../../../../components/common/ConfirmDialog.vue";
import { getVisiblePages } from "../../../../composables/useLeaveRequestsTable.js";

const PAGE_SIZE = 10;

const props = defineProps({ versions: { type: Array, default: () => [] }, disabled: { type: Boolean, default: false } });
const emit = defineEmits(["restore"]);

const confirmOpen = ref(false);
const confirmMessage = ref("");
const pendingId = ref(null);
const currentPage = ref(1);

const total = computed(() => props.versions.length);
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)));
const paginatedVersions = computed(() => {
  const page = Math.min(currentPage.value, pageCount.value);
  const start = (page - 1) * PAGE_SIZE;
  return props.versions.slice(start, start + PAGE_SIZE);
});
const rangeFrom = computed(() => (total.value === 0 ? 0 : (Math.min(currentPage.value, pageCount.value) - 1) * PAGE_SIZE + 1));
const rangeTo = computed(() => Math.min(currentPage.value * PAGE_SIZE, total.value));
const visiblePages = computed(() => getVisiblePages(currentPage.value, pageCount.value));

watch(() => props.versions, () => {
  currentPage.value = 1;
});

watch(total, () => {
  if (currentPage.value > pageCount.value) currentPage.value = pageCount.value;
});

function formatDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}
function requestRestore(version) {
  pendingId.value = version.id;
  confirmMessage.value = `Restaurer la configuration du ${formatDate(version.timestamp)} ?`;
  confirmOpen.value = true;
}
function confirmRestore() {
  if (pendingId.value) emit("restore", pendingId.value);
  confirmOpen.value = false;
  pendingId.value = null;
}
</script>
