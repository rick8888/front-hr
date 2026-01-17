import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export const usePagination = (items, itemsPerPage = 10) => {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.ceil(items.value.length / itemsPerPage)
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.value.slice(start, end);
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    goToPage(currentPage.value + 1);
  };

  const prevPage = () => {
    goToPage(currentPage.value - 1);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  };
};

export const useSearch = (items, searchKeys = []) => {
  const searchQuery = ref("");

  const searchResults = computed(() => {
    if (!searchQuery.value) return items.value;

    return items.value.filter((item) =>
      searchKeys.some((key) =>
        String(item[key])
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    );
  });

  return {
    searchQuery,
    searchResults,
  };
};

export const useFilter = (items, filterFn) => {
  const filteredItems = computed(() => {
    return items.value.filter(filterFn);
  });

  return {
    filteredItems,
  };
};
