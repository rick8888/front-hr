import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { companiesApiService } from "../services/companies.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

export const useCompaniesStore = defineStore("companies", () => {
  const companies = ref([]);
  const countries = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const activeCount = computed(() => companies.value.filter((c) => c.is_active).length);
  const inactiveCount = computed(() => companies.value.filter((c) => !c.is_active).length);

  async function fetchCountries() {
    try {
      countries.value = await companiesApiService.fetchCountries();
    } catch (e) {
      error.value = parseApiError(e);
    }
  }

  async function fetchCompanies() {
    loading.value = true;
    error.value = null;
    try {
      companies.value = await companiesApiService.fetchCompanies();
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function init() {
    await Promise.all([fetchCountries(), fetchCompanies()]);
  }

  async function createCompany(payload) {
    saving.value = true;
    error.value = null;
    try {
      const created = await companiesApiService.createCompany(payload);
      companies.value.unshift(created);
      return created;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function updateCompany(id, updates) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await companiesApiService.updateCompany(id, updates);
      const index = companies.value.findIndex((c) => c.id === id);
      if (index !== -1) companies.value[index] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function toggleCompanyStatus(id, isActive) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await companiesApiService.toggleCompanyStatus(id, isActive);
      const index = companies.value.findIndex((c) => c.id === id);
      if (index !== -1) companies.value[index] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function deleteCompany(id) {
    saving.value = true;
    error.value = null;
    try {
      await companiesApiService.deleteCompany(id);
      companies.value = companies.value.filter((c) => c.id !== id);
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    companies,
    countries,
    loading,
    saving,
    error,
    activeCount,
    inactiveCount,
    fetchCountries,
    fetchCompanies,
    init,
    createCompany,
    updateCompany,
    toggleCompanyStatus,
    deleteCompany,
  };
});
