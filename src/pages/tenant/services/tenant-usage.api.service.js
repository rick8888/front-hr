import apiClient from "../../../services/api.js";

export const tenantUsageApiService = {
  async fetchUsage() {
    const { data } = await apiClient.get("/tenant/usage");
    return data?.data ?? data;
  },
};
