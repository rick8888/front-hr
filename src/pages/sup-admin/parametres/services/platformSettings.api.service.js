import apiClient from "../../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const platformSettingsApiService = {
  async fetchAll(group = null) {
    const { data } = await apiClient.get("/platform-settings", {
      params: group ? { group } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async updateMany(settings) {
    const { data } = await apiClient.put("/platform-settings", { settings });
    return unwrap(data) ?? [];
  },
};
