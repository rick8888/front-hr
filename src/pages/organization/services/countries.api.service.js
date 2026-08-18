import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const countriesApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/countries");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },
};
