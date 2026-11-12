import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { taxApiService } from "../services/tax.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

export const useTaxStore = defineStore("tax", () => {
  const countries = ref([]);
  const selectedCountry = ref(null);
  const fiscalProfile = ref(null);
  const taxRules = ref([]);
  const taxScales = ref([]);
  const declarationPeriods = ref([]);
  const categories = ref([]);
  const calculationBases = ref([]);
  const versions = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const activeRulesCount = computed(() => taxRules.value.filter((r) => r.is_active).length);
  const activeScalesCount = computed(() => taxScales.value.filter((s) => s.is_active).length);
  const activeDeclarationPeriodsCount = computed(() => declarationPeriods.value.filter((p) => p.is_active).length);
  const activeCategories = computed(() => categories.value.filter((c) => c.is_active));
  const activeCalculationBases = computed(() => calculationBases.value.filter((b) => b.is_active));

  async function fetchCountries() {
    loading.value = true;
    error.value = null;
    try {
      countries.value = await taxApiService.fetchCountries();
      if (!selectedCountry.value && countries.value.length) {
        selectedCountry.value = countries.value[0].country_code;
      }
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchFiscalProfile(countryCode = selectedCountry.value) {
    if (!countryCode) return;
    loading.value = true;
    error.value = null;
    try {
      const profile = await taxApiService.fetchFiscalProfile(countryCode);
      fiscalProfile.value = profile;
      taxRules.value = profile.rules ?? [];
      taxScales.value = profile.scales ?? [];
      declarationPeriods.value = profile.declaration_periods ?? [];
      selectedCountry.value = countryCode;
      await Promise.all([
        fetchCategories(countryCode),
        fetchCalculationBases(countryCode),
        fetchVersions(countryCode),
      ]);
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories(countryCode = selectedCountry.value) {
    if (!countryCode) return;
    categories.value = await taxApiService.fetchCategories(countryCode);
  }

  async function fetchCalculationBases(countryCode = selectedCountry.value) {
    if (!countryCode) return;
    calculationBases.value = await taxApiService.fetchCalculationBases(countryCode);
  }

  async function updateFiscalProfile(updates) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.updateFiscalProfile(selectedCountry.value, {
        ...fiscalProfile.value,
        ...updates,
        rules: taxRules.value,
      });
      fiscalProfile.value = updated;
      taxRules.value = updated.rules ?? [];
      await fetchVersions(selectedCountry.value);
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function addTaxRule(rule) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const created = await taxApiService.addTaxRule(selectedCountry.value, rule);
      taxRules.value.push(created);
      await fetchVersions(selectedCountry.value);
      return created;
    } finally {
      saving.value = false;
    }
  }

  async function updateTaxRule(ruleId, updates) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.updateTaxRule(selectedCountry.value, ruleId, updates);
      const index = taxRules.value.findIndex((r) => r.id === ruleId);
      if (index !== -1) taxRules.value[index] = updated;
      await fetchVersions(selectedCountry.value);
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function deleteTaxRule(ruleId) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      await taxApiService.deleteTaxRule(selectedCountry.value, ruleId);
      taxRules.value = taxRules.value.filter((r) => r.id !== ruleId);
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function addCategory(category) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const created = await taxApiService.addCategory(selectedCountry.value, category);
      categories.value.push(created);
      await fetchVersions(selectedCountry.value);
      return created;
    } finally {
      saving.value = false;
    }
  }

  async function updateCategory(categoryId, updates) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.updateCategory(selectedCountry.value, categoryId, updates);
      const index = categories.value.findIndex((c) => c.id === categoryId);
      if (index !== -1) categories.value[index] = updated;
      await fetchVersions(selectedCountry.value);
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function disableCategory(categoryId) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.disableCategory(selectedCountry.value, categoryId);
      const index = categories.value.findIndex((c) => c.id === categoryId);
      if (index !== -1) categories.value[index] = updated;
      await fetchVersions(selectedCountry.value);
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function addCalculationBase(base) {
    if (!selectedCountry.value) return;
    saving.value = true;
    error.value = null;
    try {
      const created = await taxApiService.addCalculationBase(selectedCountry.value, base);
      calculationBases.value.push(created);
      await fetchVersions(selectedCountry.value);
      return created;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function updateCalculationBase(baseId, updates) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.updateCalculationBase(selectedCountry.value, baseId, updates);
      const index = calculationBases.value.findIndex((b) => b.id === baseId);
      if (index !== -1) calculationBases.value[index] = updated;
      await fetchVersions(selectedCountry.value);
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function disableCalculationBase(baseId) {
    if (!selectedCountry.value) return;
    saving.value = true;
    error.value = null;
    try {
      const updated = await taxApiService.disableCalculationBase(selectedCountry.value, baseId);
      const index = calculationBases.value.findIndex((b) => b.id === baseId);
      if (index !== -1) calculationBases.value[index] = updated;
      await fetchVersions(selectedCountry.value);
      return updated;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function fetchVersions(countryCode = selectedCountry.value) {
    if (!countryCode) return;
    versions.value = await taxApiService.fetchVersions(countryCode);
  }

  async function updateScaleBracket(scaleId, bracketIndex, updates) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      await taxApiService.updateScaleBracket(selectedCountry.value, scaleId, bracketIndex, updates);
      const scale = taxScales.value.find((s) => s.id === scaleId);
      if (scale) Object.assign(scale.brackets[bracketIndex], updates);
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function addScaleBracket(scaleId, bracketData) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const bracket = await taxApiService.addScaleBracket(selectedCountry.value, scaleId, bracketData);
      const scale = taxScales.value.find((s) => s.id === scaleId);
      if (scale) scale.brackets.push(bracket);
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function deleteScaleBracket(scaleId, bracketIndex) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      await taxApiService.deleteScaleBracket(selectedCountry.value, scaleId, bracketIndex);
      const scale = taxScales.value.find((s) => s.id === scaleId);
      if (scale) scale.brackets.splice(bracketIndex, 1);
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function toggleScale(scaleId, isActive) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.toggleScale(selectedCountry.value, scaleId, isActive);
      const index = taxScales.value.findIndex((s) => s.id === scaleId);
      if (index !== -1) taxScales.value[index] = updated;
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function addDeclarationPeriod(period) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const created = await taxApiService.addDeclarationPeriod(selectedCountry.value, period);
      declarationPeriods.value.push(created);
      await fetchVersions(selectedCountry.value);
      return created;
    } finally {
      saving.value = false;
    }
  }

  async function updateDeclarationPeriod(periodId, updates) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.updateDeclarationPeriod(selectedCountry.value, periodId, updates);
      const index = declarationPeriods.value.findIndex((p) => p.id === periodId);
      if (index !== -1) declarationPeriods.value[index] = updated;
      await fetchVersions(selectedCountry.value);
      return updated;
    } finally {
      saving.value = false;
    }
  }

  async function deleteDeclarationPeriod(periodId) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      await taxApiService.deleteDeclarationPeriod(selectedCountry.value, periodId);
      declarationPeriods.value = declarationPeriods.value.filter((p) => p.id !== periodId);
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function toggleDeclarationPeriod(periodId, isActive) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const updated = await taxApiService.toggleDeclarationPeriod(selectedCountry.value, periodId, isActive);
      const index = declarationPeriods.value.findIndex((p) => p.id === periodId);
      if (index !== -1) declarationPeriods.value[index] = updated;
      await fetchVersions(selectedCountry.value);
    } finally {
      saving.value = false;
    }
  }

  async function restoreVersion(versionId) {
    if (!selectedCountry.value) return;
    saving.value = true;
    try {
      const restored = await taxApiService.restoreVersion(selectedCountry.value, versionId);
      fiscalProfile.value = restored;
      taxRules.value = restored.rules ?? [];
      taxScales.value = restored.scales ?? [];
      declarationPeriods.value = restored.declaration_periods ?? [];
      await fetchCategories(selectedCountry.value);
      await fetchCalculationBases(selectedCountry.value);
      await fetchVersions(selectedCountry.value);
      return restored;
    } finally {
      saving.value = false;
    }
  }

  async function selectCountry(countryCode) {
    selectedCountry.value = countryCode;
    await fetchFiscalProfile(countryCode);
  }

  async function toggleProfileStatus() {
    if (!fiscalProfile.value) return;
    const nextStatus = fiscalProfile.value.status === "active" ? "inactive" : "active";
    await updateFiscalProfile({ status: nextStatus });
  }

  return {
    countries,
    selectedCountry,
    fiscalProfile,
    taxRules,
    taxScales,
    declarationPeriods,
    categories,
    calculationBases,
    versions,
    loading,
    saving,
    error,
    activeRulesCount,
    activeScalesCount,
    activeDeclarationPeriodsCount,
    activeCategories,
    activeCalculationBases,
    fetchCountries,
    fetchFiscalProfile,
    updateFiscalProfile,
    addTaxRule,
    updateTaxRule,
    deleteTaxRule,
    updateScaleBracket,
    addScaleBracket,
    deleteScaleBracket,
    toggleScale,
    addDeclarationPeriod,
    updateDeclarationPeriod,
    deleteDeclarationPeriod,
    toggleDeclarationPeriod,
    addCategory,
    updateCategory,
    disableCategory,
    addCalculationBase,
    updateCalculationBase,
    disableCalculationBase,
    fetchCalculationBases,
    fetchVersions,
    restoreVersion,
    selectCountry,
    toggleProfileStatus,
    fetchCategories,
  };
});
