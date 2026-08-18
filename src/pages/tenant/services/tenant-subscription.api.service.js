import apiClient from "../../../services/api.js";

export const tenantSubscriptionApiService = {
  async fetchSubscription() {
    const { data } = await apiClient.get("/tenant/subscription");
    return data;
  },

  async cancelSubscription() {
    const { data } = await apiClient.post("/tenant/subscription/cancel");
    return data;
  },

  async changePlan(payload) {
    const { data } = await apiClient.post("/tenant/subscription/change", payload);
    return data?.data ?? data;
  },
};
