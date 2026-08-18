import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { entityStatusesApiService } from "../services/entityStatuses.api.service.js";
import { getLocale } from "../i18n/index.js";

export const TONE_PILL_CLASSES = {
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/10",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10",
  info: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-600/10",
  secondary: "bg-secondary-50 text-secondary-700 ring-1 ring-inset ring-secondary-600/10",
  neutral: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-300/60",
};

export const TONE_BADGE_UTILS = {
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-error",
  info: "badge-primary",
  secondary: "badge-primary",
  neutral: "badge",
};

function displayName(row) {
  if (getLocale() === "en" && row.nameEn) return row.nameEn;
  return row.name || row.code;
}

export const useEntityStatusCatalogStore = defineStore("entityStatusCatalog", () => {
  const items = ref([]);
  const loaded = ref(false);
  const loading = ref(false);

  const byType = computed(() => {
    const map = {};
    for (const row of items.value) {
      if (!map[row.entityType]) map[row.entityType] = [];
      map[row.entityType].push(row);
    }
    return map;
  });

  function rowsFor(entityType, { activeOnly = true } = {}) {
    const rows = byType.value[entityType] || [];
    return activeOnly ? rows.filter((row) => row.isActive) : rows;
  }

  function find(entityType, code) {
    if (!code) return null;
    const needle = String(code).toLowerCase().replace(/[\s-]+/g, "_");
    return (
      rowsFor(entityType, { activeOnly: false }).find(
        (row) => String(row.code).toLowerCase() === needle
      ) || null
    );
  }

  function options(entityType, fallback = []) {
    const rows = rowsFor(entityType);
    if (!rows.length) return fallback;
    return rows.map((row) => ({
      value: row.code,
      label: displayName(row),
      tone: row.tone,
    }));
  }

  function label(entityType, code, fallback = "") {
    const row = find(entityType, code);
    if (row) return displayName(row);
    if (fallback) return fallback;
    return code ? String(code) : "—";
  }

  function tone(entityType, code) {
    return find(entityType, code)?.tone || "neutral";
  }

  function pillClass(entityType, code) {
    return TONE_PILL_CLASSES[tone(entityType, code)] || TONE_PILL_CLASSES.neutral;
  }

  function badgeClass(entityType, code) {
    return TONE_BADGE_UTILS[tone(entityType, code)] || TONE_BADGE_UTILS.neutral;
  }

  async function load({ force = false } = {}) {
    if (loading.value) return;
    if (loaded.value && !force) return;
    loading.value = true;
    try {
      items.value = await entityStatusesApiService.fetchAll({ activeOnly: false });
      loaded.value = true;
    } catch {
      if (!loaded.value) items.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loaded,
    loading,
    byType,
    rowsFor,
    find,
    options,
    label,
    tone,
    pillClass,
    badgeClass,
    load,
  };
});

export function catalogStatusLabel(entityType, code, fallback = "") {
  return useEntityStatusCatalogStore().label(entityType, code, fallback);
}

export function catalogStatusClass(entityType, code) {
  return useEntityStatusCatalogStore().pillClass(entityType, code);
}

export function catalogStatusBadgeClass(entityType, code) {
  return useEntityStatusCatalogStore().badgeClass(entityType, code);
}

export function catalogStatusOptions(entityType, fallback = []) {
  return useEntityStatusCatalogStore().options(entityType, fallback);
}
