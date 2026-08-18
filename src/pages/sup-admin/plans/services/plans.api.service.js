import apiClient from "../../../../services/api.js";

/**
 * API HR — /api/v1/subscription-plans & subscription-services
 */
export const plansApiService = {
  async fetchServices() {
    const { data } = await apiClient.get("/subscription-services");
    return data.data ?? data;
  },

  async fetchPlans() {
    const { data } = await apiClient.get("/subscription-plans");
    return data.data ?? data;
  },

  async createPlan(payload) {
    const { data } = await apiClient.post("/subscription-plans", payload);
    return data.data ?? data;
  },

  async updatePlan(id, payload) {
    const { data } = await apiClient.put(`/subscription-plans/${id}`, payload);
    return data.data ?? data;
  },

  async togglePlanActive(id, isActive) {
    const { data } = await apiClient.patch(`/subscription-plans/${id}/status`, {
      is_active: isActive,
    });
    return data.data ?? data;
  },

  async deletePlan(id) {
    await apiClient.delete(`/subscription-plans/${id}`);
    return true;
  },
};
