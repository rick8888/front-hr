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
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const { data } = await apiClient.post("/tenant/subscription/change", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },
};
