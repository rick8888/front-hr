import apiClient from "../../../services/api.js";

export const tenantProfileApiService = {
  async fetchProfile() {
    const { data } = await apiClient.get("/tenant/profile");
    return data;
  },

  async updateProfile(payload) {
    const { data } = await apiClient.put("/tenant/profile", payload);
    return data;
  },
};
