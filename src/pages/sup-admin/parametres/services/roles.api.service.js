import apiClient from "../../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const rolesApiService = {
  async fetchPermissions() {
    const { data } = await apiClient.get("/role-permissions");
    return unwrap(data) ?? [];
  },

  async fetchAll() {
    const { data } = await apiClient.get("/roles");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/roles", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/roles/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/roles/${id}/status`, {
      is_active: isActive,
    });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/roles/${id}`);
  },
};
