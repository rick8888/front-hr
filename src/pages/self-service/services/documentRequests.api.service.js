import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const documentRequestsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/document-requests", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/document-requests/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    const { data } = await apiClient.post("/document-requests", {
      type: payload.type,
      purpose: payload.purpose || payload.remarks || null,
      needed_by: payload.neededBy || payload.needed_by || null,
      employee_id: payload.employeeId || undefined,
    });
    return unwrap(data);
  },

  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(`/document-requests/${id}/status`, {
      status,
      ...extra,
    });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/document-requests/${id}`);
  },
};
