import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

function appendIfPresent(form, key, value) {
  if (value === undefined || value === null || value === "") return;
  form.append(key, String(value));
}

/**
 * Crée une demande de prêt (toujours multipart pour gérer documents[]).
 */
async function postLoan(payload) {
  const form = new FormData();
  form.append("type", String(payload.type));
  form.append("amount", String(payload.amount));
  form.append(
    "tenure_months",
    String(payload.tenureMonths ?? payload.tenure)
  );
  form.append("purpose", String(payload.purpose));
  appendIfPresent(form, "currency", payload.currency || "USD");
  appendIfPresent(
    form,
    "interest_rate",
    payload.interestRate ?? payload.interest_rate
  );
  appendIfPresent(form, "notes", payload.notes);
  appendIfPresent(
    form,
    "disbursement_date",
    payload.disbursementDate ?? payload.disbursement_date
  );
  appendIfPresent(
    form,
    "repayment_start_date",
    payload.repaymentStartDate ?? payload.repayment_start_date
  );
  if (payload.employeeId) {
    form.append("employee_id", String(payload.employeeId));
  }

  const docs = Array.isArray(payload.documents)
    ? payload.documents.filter((f) => f instanceof File)
    : [];
  docs.slice(0, 5).forEach((file, index) => {
    form.append(`documents[${index}]`, file);
  });

  const { data } = await apiClient.post("/loans", form, {
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
}

export const loansApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/loans", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/loans/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    return postLoan(payload);
  },

  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(`/loans/${id}/status`, {
      status,
      ...extra,
    });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/loans/${id}`);
  },
};
