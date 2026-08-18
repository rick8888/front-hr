import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { complianceObligationApiService } from "../services/compliance-obligation.api.service.js";
import { companiesApiService } from "../../entreprises/services/companies.api.service.js";
import { legalTaxApiService } from "../../cotisations/services/legal-tax.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

export const useComplianceObligationStore = defineStore("complianceObligation", () => {
  const countries = ref([]);
  const obligations = ref([]);
  const legalTaxes = ref([]);
  const selectedCountryId = ref(null);
  const typeFilter = ref("all");
  const loading = ref(true);
  const saving = ref(false);
  const error = ref(null);

  const filteredObligations = computed(() => {
    if (typeFilter.value === "all") return obligations.value;
    return obligations.value.filter((o) => o.type === typeFilter.value);
  });

  const activeCount = computed(
    () => filteredObligations.value.filter((o) => o.is_active).length
  );

  const fiscalCount = computed(
    () => filteredObligations.value.filter((o) => o.type === "fiscal").length
  );

  const socialCount = computed(
    () => filteredObligations.value.filter((o) => o.type === "social").length
  );

  async function fetchCountries() {
    countries.value = await companiesApiService.fetchCountries();
    if (!selectedCountryId.value && countries.value.length) {
      selectedCountryId.value = countries.value[0].id;
    }
  }

  async function fetchLegalTaxes(countryId = selectedCountryId.value) {
    try {
      legalTaxes.value = await legalTaxApiService.fetchLegalTaxes({
        country_id: countryId || undefined,
      });
    } catch {
      legalTaxes.value = [];
    }
  }

  async function fetchObligations(countryId = selectedCountryId.value) {
    loading.value = true;
    error.value = null;
    try {
      obligations.value = await complianceObligationApiService.fetchObligations({
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
    await Promise.all([fetchObligations(countryId), fetchLegalTaxes(countryId)]);
  }

  async function createObligation(payload) {
    saving.value = true;
    error.value = null;
    try {
      const created = await complianceObligationApiService.createObligation(payload);
      if (created.country_id === selectedCountryId.value) {
        obligations.value.push(created);
      }
      return created;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function updateObligation(id, payload) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await complianceObligationApiService.updateObligation(id, payload);
      const index = obligations.value.findIndex((o) => o.id === id);
      if (index !== -1) obligations.value[index] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function deleteObligation(id) {
    saving.value = true;
    error.value = null;
    try {
      await complianceObligationApiService.deleteObligation(id);
      obligations.value = obligations.value.filter((o) => o.id !== id);
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
      await Promise.all([
        fetchObligations(selectedCountryId.value),
        fetchLegalTaxes(selectedCountryId.value),
      ]);
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  return {
    countries,
    obligations,
    legalTaxes,
    selectedCountryId,
    typeFilter,
    filteredObligations,
    activeCount,
    fiscalCount,
    socialCount,
    loading,
    saving,
    error,
    fetchCountries,
    fetchObligations,
    fetchLegalTaxes,
    selectCountry,
    createObligation,
    updateObligation,
    deleteObligation,
    init,
  };
});
