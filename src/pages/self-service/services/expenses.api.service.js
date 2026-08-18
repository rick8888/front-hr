import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const expensesApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/expenses", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/expenses/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    const hasFile = payload.receipt instanceof File;
    if (hasFile) {
      const form = new FormData();
      form.append("type", payload.type);
      form.append("expense_date", payload.expenseDate || payload.expense_date);
      form.append("amount", String(payload.amount));
      if (payload.currency) form.append("currency", payload.currency);
      if (payload.description || payload.remarks) {
        form.append("description", payload.description || payload.remarks);
      }
      if (payload.employeeId) form.append("employee_id", String(payload.employeeId));
      form.append("receipt", payload.receipt);
      const { data } = await apiClient.post("/expenses", form, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [
          (body, headers) => {
            // Laisse le navigateur poser le boundary multipart.
            if (headers && typeof headers === "object") {
              delete headers["Content-Type"];
            }
            return body;
          },
        ],
      });
      return unwrap(data);
    }

    const { data } = await apiClient.post("/expenses", {
      type: payload.type,
      expense_date: payload.expenseDate || payload.expense_date,
      amount: payload.amount,
      currency: payload.currency,
      description: payload.description || payload.remarks || null,
      employee_id: payload.employeeId || undefined,
    });
    return unwrap(data);
  },

  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(`/expenses/${id}/status`, {
      status,
      ...extra,
    });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/expenses/${id}`);
  },
};
