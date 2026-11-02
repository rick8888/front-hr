import apiClient from "../../../services/api.js";

export const companyUsersApiService = {
  async fetchUsers(params = {}) {
    const { data } = await apiClient.get("/company-users", { params });
    return data.data ?? data;
  },

  async createAdmin(payload) {
    const { data } = await apiClient.post("/company-users", payload);
    return data.data ?? data;
  },

  async updateAdmin(id, payload) {
    const { data } = await apiClient.put(`/company-users/${id}`, payload);
    return data.data ?? data;
  },
};
