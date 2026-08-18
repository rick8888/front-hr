import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const equipmentsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/equipments", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/equipments", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/equipments/${id}`, payload);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/equipments/${id}`);
  },
};

export const equipmentRequestsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/equipment-requests", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/equipment-requests", {
      equipment_id: payload.equipmentId ?? payload.equipment_id,
      quantity: payload.quantity ?? 1,
      priority: payload.priority || "medium",
      reason: payload.reason || null,
      expected_date: payload.expectedDate || payload.expected_date || null,
    });
    return unwrap(data);
  },

  async cancel(id) {
    await apiClient.delete(`/equipment-requests/${id}`);
  },
};

export const equipmentAssignmentsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/equipment-assignments", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async reportIssue(id, note) {
    const { data } = await apiClient.post(
      `/equipment-assignments/${id}/report-issue`,
      { note }
    );
    return unwrap(data);
  },
};
