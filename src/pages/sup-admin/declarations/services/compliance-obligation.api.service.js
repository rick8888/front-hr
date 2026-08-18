import apiClient from "../../../../services/api.js";

/**
 * API HR — /api/v1/compliance-obligations
 */
export const complianceObligationApiService = {
  async fetchObligations(params = {}) {
    const { data } = await apiClient.get("/compliance-obligations", {
      params: { per_page: 200, ...params },
    });
    return data.data ?? data;
  },

  async fetchObligation(id) {
    const { data } = await apiClient.get(`/compliance-obligations/${id}`);
    return data.data ?? data;
  },

  async createObligation(payload) {
    const { data } = await apiClient.post("/compliance-obligations", payload);
    return data.data ?? data;
  },

  async updateObligation(id, payload) {
    const { data } = await apiClient.put(`/compliance-obligations/${id}`, payload);
    return data.data ?? data;
  },

  async deleteObligation(id) {
    await apiClient.delete(`/compliance-obligations/${id}`);
    return true;
  },
};
