import apiClient from "../../../../services/api.js";

/**
 * API HR — /api/v1/legal-taxes
 */
export const legalTaxApiService = {
  async fetchLegalTaxes(params = {}) {
    const { data } = await apiClient.get("/legal-taxes", {
      params: { per_page: 200, ...params },
    });
    return data.data ?? data;
  },

  async fetchLegalTax(id) {
    const { data } = await apiClient.get(`/legal-taxes/${id}`);
    return data.data ?? data;
  },

  async createLegalTax(payload) {
    const { data } = await apiClient.post("/legal-taxes", payload);
    return data.data ?? data;
  },

  async updateLegalTax(id, payload) {
    const { data } = await apiClient.put(`/legal-taxes/${id}`, payload);
    return data.data ?? data;
  },

  async deleteLegalTax(id) {
    await apiClient.delete(`/legal-taxes/${id}`);
    return true;
  },
};
