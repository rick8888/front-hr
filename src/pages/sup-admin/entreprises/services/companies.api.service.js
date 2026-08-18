import apiClient from "../../../../services/api.js";

/**
 * Service API — aligné sur le backend HR
 * GET/POST/PUT/DELETE /api/v1/companies
 * GET /api/v1/countries
 */
export const companiesApiService = {
  async fetchCountries() {
    const { data } = await apiClient.get("/countries");
    return data.data ?? data;
  },

  async fetchCompanies(params = {}) {
    const { data } = await apiClient.get("/companies", {
      params: { per_page: 200, ...params },
    });
    return data.data ?? data;
  },

  async createCompany(payload) {
    const { data } = await apiClient.post("/companies", payload);
    return data.data ?? data;
  },

  async updateCompany(id, payload) {
    const { data } = await apiClient.put(`/companies/${id}`, payload);
    return data.data ?? data;
  },

  async toggleCompanyStatus(id, isActive) {
    const { data } = await apiClient.patch(`/companies/${id}/status`, {
      is_active: isActive,
    });
    return data.data ?? data;
  },

  async deleteCompany(id) {
    await apiClient.delete(`/companies/${id}`);
    return true;
  },
};
