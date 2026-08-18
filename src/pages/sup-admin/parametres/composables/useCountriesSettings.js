import { ref, computed } from "vue";
import { countriesAdminApiService } from "../services/countries.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

function emptyForm() {
  return {
    name: "",
    code: "",
    currency: "",
    locale: "fr_FR",
    isActive: true,
  };
}

export function useCountriesSettings() {
  const countries = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(10);
  const currentPage = ref(1);

  const modalOpen = ref(false);
  const editingCountry = ref(null);
  const form = ref(emptyForm());

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);

  const filteredCountries = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return countries.value;
    return countries.value.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.locale.toLowerCase().includes(q),
    );
  });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredCountries.value.length / pageSize.value)),
  );

  const paginatedCountries = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredCountries.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    const total = filteredCountries.value.length;
    if (!total) return { from: 0, to: 0 };
    return {
      from: (currentPage.value - 1) * pageSize.value + 1,
      to: Math.min(currentPage.value * pageSize.value, total),
    };
  });

  const stats = computed(() => ({
    total: countries.value.length,
    active: countries.value.filter((c) => c.isActive).length,
    inactive: countries.value.filter((c) => !c.isActive).length,
  }));

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      countries.value = await countriesAdminApiService.fetchAll({
        activeOnly: false,
      });
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de charger les pays.";
    } finally {
      loading.value = false;
    }
  }

  function openCreate() {
    editingCountry.value = null;
    form.value = emptyForm();
    modalOpen.value = true;
  }

  function openEdit(country) {
    editingCountry.value = country;
    form.value = {
      name: country.name,
      code: country.code,
      currency: country.currency,
      locale: country.locale || "fr_FR",
      isActive: country.isActive,
    };
    modalOpen.value = true;
  }

  async function save() {
    saving.value = true;
    error.value = "";
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim().toUpperCase(),
      currency: form.value.currency.trim().toUpperCase(),
      locale: form.value.locale.trim() || "fr_FR",
      is_active: form.value.isActive,
    };

    try {
      if (editingCountry.value?.id) {
        const updated = await countriesAdminApiService.update(
          editingCountry.value.id,
          payload,
        );
        const idx = countries.value.findIndex((c) => c.id === updated.id);
        if (idx !== -1) countries.value[idx] = updated;
        countries.value = [...countries.value].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      } else {
        const created = await countriesAdminApiService.create(payload);
        countries.value = [...countries.value, created].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      }
      modalOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible d'enregistrer le pays.";
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(country) {
    saving.value = true;
    error.value = "";
    try {
      const updated = await countriesAdminApiService.toggleStatus(
        country.id,
        !country.isActive,
      );
      const idx = countries.value.findIndex((c) => c.id === country.id);
      if (idx !== -1) countries.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de modifier le statut.";
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(country) {
    deleteTarget.value = country;
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;
    deleting.value = true;
    error.value = "";
    try {
      await countriesAdminApiService.remove(deleteTarget.value.id);
      countries.value = countries.value.filter(
        (c) => c.id !== deleteTarget.value.id,
      );
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de supprimer le pays.";
    } finally {
      deleting.value = false;
    }
  }

  function cancelDelete() {
    if (deleting.value) return;
    deleteOpen.value = false;
    deleteTarget.value = null;
  }

  return {
    countries,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    pageSize,
    currentPage,
    filteredCountries,
    paginatedCountries,
    pageCount,
    rangeLabel,
    stats,
    modalOpen,
    editingCountry,
    form,
    deleteOpen,
    deleteTarget,
    load,
    openCreate,
    openEdit,
    save,
    toggleActive,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
