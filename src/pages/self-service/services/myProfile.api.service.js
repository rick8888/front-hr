import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const myProfileApiService = {
  async fetch() {
    const { data } = await apiClient.get("/self-service/profile");
    return unwrap(data);
  },

  async update(payload) {
    const { data } = await apiClient.put("/self-service/profile", payload);
    return unwrap(data);
  },

  async updatePassword(payload) {
    await apiClient.put("/self-service/profile/password", payload);
  },
};
