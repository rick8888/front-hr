import { computed, reactive, ref, watch } from "vue";

/**
 * Generic paginated + searched + filtered list state.
 *
 * @param {import('vue').Ref<Array<Record<string, any>>>} itemsRef
 * @param {{
 *   pageSize?: number,
 *   searchFields?: string[],
 *   initialFilters?: Record<string, any>,
 *   customFilter?: (row: any, filters: Record<string, any>) => boolean,
 * }} [options]
 */
export function usePaginatedSearch(itemsRef, options = {}) {
  const searchFields =
    options.searchFields ?? ["name", "code", "description"];

  const filters = reactive({ ...(options.initialFilters ?? {}) });
  const customFilter = options.customFilter ?? null;

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 7);

  const filtered = computed(() => {
    let list = itemsRef.value ?? [];

    if (typeof customFilter === "function") {
      list = list.filter((row) => customFilter(row, filters));
    }

    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      list = list.filter((row) =>
        searchFields.some((field) =>
          String(row[field] ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }

    return list;
  });

  const totalFiltered = computed(() => filtered.value.length);

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)),
  );

  const paginatedRows = computed(() => {
    const current = Math.min(page.value, pageCount.value);
    const start = (current - 1) * pageSize.value;
    return filtered.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    if (totalFiltered.value === 0) return { from: 0, to: 0 };
    const current = Math.min(page.value, pageCount.value);
    const from = (current - 1) * pageSize.value + 1;
    const to = Math.min(current * pageSize.value, totalFiltered.value);
    return { from, to };
  });

  watch(filters, () => {
    page.value = 1;
  });

  watch(searchQuery, () => {
    page.value = 1;
  });

  watch(pageSize, () => {
    page.value = 1;
  });

  watch(totalFiltered, (total) => {
    const max = Math.max(1, Math.ceil(total / pageSize.value));
    if (page.value > max) page.value = max;
  });

  return {
    filters,
    searchQuery,
    page,
    pageSize,
    filtered,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  };
}
