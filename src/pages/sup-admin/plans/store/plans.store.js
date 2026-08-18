import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { plansApiService } from "../services/plans.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

export const usePlansStore = defineStore("subscriptionPlans", () => {
  const plans = ref([]);
  const services = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const error = ref(null);

  const activePlans = computed(() => plans.value.filter((p) => p.is_active));
  const highlightedPlan = computed(() => plans.value.find((p) => p.is_highlighted));

  async function fetchServices() {
    services.value = await plansApiService.fetchServices();
  }

  async function fetchPlans() {
    loading.value = true;
    error.value = null;
    try {
      plans.value = await plansApiService.fetchPlans();
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function init() {
    loading.value = true;
    error.value = null;
    try {
      await Promise.all([fetchServices(), fetchPlans()]);
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function createPlan(payload) {
    saving.value = true;
    error.value = null;
    try {
      const created = await plansApiService.createPlan(payload);
      plans.value.push(created);
      plans.value.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      if (payload.is_highlighted) {
        plans.value.forEach((p) => {
          p.is_highlighted = p.id === created.id;
        });
      }
      return created;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function updatePlan(planId, updates) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await plansApiService.updatePlan(planId, updates);
      const index = plans.value.findIndex((p) => p.id === planId);
      if (index !== -1) plans.value[index] = updated;
      if (updates.is_highlighted) {
        plans.value.forEach((p) => {
          p.is_highlighted = p.id === planId;
        });
      }
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function togglePlanActive(planId, isActive) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await plansApiService.togglePlanActive(planId, isActive);
      const index = plans.value.findIndex((p) => p.id === planId);
      if (index !== -1) plans.value[index] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    plans,
    services,
    loading,
    saving,
    error,
    activePlans,
    highlightedPlan,
    fetchServices,
    fetchPlans,
    init,
    createPlan,
    updatePlan,
    togglePlanActive,
  };
});
