import apiClient from "./api.js";

export const authApiService = {
  async login(credentials) {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  async logout() {
    await apiClient.post(
      "/auth/logout",
      {},
      { skipAuthRedirect: true }
    );
  },

  async me() {
    const { data } = await apiClient.get("/auth/me");
    return data.data ?? data;
  },
};
