import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

function appendIfPresent(form, key, value) {
  if (value === undefined || value === null || value === "") return;
  form.append(key, String(value));
}

export const employeeDocumentsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/employee-documents", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/employee-documents/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("category", payload.category);
    appendIfPresent(form, "reference", payload.reference);
    appendIfPresent(form, "issue_date", payload.issueDate ?? payload.issue_date);
    appendIfPresent(
      form,
      "expiry_date",
      payload.expiryDate ?? payload.expiry_date
    );
    if (payload.employeeId) {
      form.append("employee_id", String(payload.employeeId));
    }
    if (payload.file instanceof File) {
      form.append("file", payload.file);
    }

    const { data } = await apiClient.post("/employee-documents", form, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [
        (body, headers) => {
          if (headers && typeof headers === "object") {
            delete headers["Content-Type"];
          }
          return body;
        },
      ],
    });
    return unwrap(data);
  },

  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(
      `/employee-documents/${id}/status`,
      { status, ...extra }
    );
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/employee-documents/${id}`);
  },
};
