import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { legalTaxApiService } from "../services/legal-tax.api.service.js";
import { companiesApiService } from "../../entreprises/services/companies.api.service.js";
import { countryById, resolveLegalTaxCategory } from "../../../../data/legal-tax/index.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

export const useLegalTaxStore = defineStore("legalTax", () => {
  const countries = ref([]);
  const legalTaxes = ref([]);
  const selectedCountryId = ref(null);
  const loading = ref(true);
  const saving = ref(false);
  const error = ref(null);

  const selectedCountry = computed(() =>
    countryById(countries.value, selectedCountryId.value)
  );

  const filteredTaxes = computed(() => legalTaxes.value);

  const activeTaxesCount = computed(
    () => filteredTaxes.value.filter((t) => t.is_active).length
  );

  const socialCount = computed(
    () => filteredTaxes.value.filter((t) => resolveLegalTaxCategory(t) === "social").length
  );

  const fiscalCount = computed(
    () => filteredTaxes.value.filter((t) => resolveLegalTaxCategory(t) === "fiscal").length
  );

  async function fetchCountries() {
    countries.value = await companiesApiService.fetchCountries();
    if (!selectedCountryId.value && countries.value.length) {
      selectedCountryId.value = countries.value[0].id;
    }
  }

  async function fetchLegalTaxes(countryId = selectedCountryId.value) {
    loading.value = true;
    error.value = null;
    try {
      legalTaxes.value = await legalTaxApiService.fetchLegalTaxes({
        country_id: countryId || undefined,
      });
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function selectCountry(countryId) {
    selectedCountryId.value = countryId;
    await fetchLegalTaxes(countryId);
  }

  async function createLegalTax(payload) {
    saving.value = true;
    error.value = null;
    try {
      const created = await legalTaxApiService.createLegalTax(payload);
      if (created.country_id === selectedCountryId.value) {
        legalTaxes.value.push(created);
      }
      return created;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function updateLegalTax(id, payload) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await legalTaxApiService.updateLegalTax(id, payload);
      const index = legalTaxes.value.findIndex((t) => t.id === id);
      if (index !== -1) legalTaxes.value[index] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function deleteLegalTax(id) {
    saving.value = true;
    error.value = null;
    try {
      await legalTaxApiService.deleteLegalTax(id);
      legalTaxes.value = legalTaxes.value.filter((t) => t.id !== id);
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function init() {
    loading.value = true;
    error.value = null;
    try {
      await fetchCountries();
      await fetchLegalTaxes(selectedCountryId.value);
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  return {
    countries,
    legalTaxes,
    selectedCountryId,
    selectedCountry,
    filteredTaxes,
    activeTaxesCount,
    socialCount,
    fiscalCount,
    loading,
    saving,
    error,
    fetchCountries,
    fetchLegalTaxes,
    selectCountry,
    createLegalTax,
    updateLegalTax,
    deleteLegalTax,
    init,
  };
});
