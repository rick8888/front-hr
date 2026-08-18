import apiClient from "../../../services/api.js";

export const tenantDashboardApiService = {
  async fetchDashboard() {
    const { data } = await apiClient.get("/tenant/dashboard");
    return data?.data ?? data;
  },
};
