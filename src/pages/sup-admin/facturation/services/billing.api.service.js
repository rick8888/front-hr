import apiClient from "../../../../services/api.js";

/**
 * API HR — facturation
 */
export const billingApiService = {
  async fetchInvoices(params = {}) {
    const { data } = await apiClient.get("/invoices", {
      params: { per_page: 200, ...params },
    });
    return data.data ?? data;
  },

  async createInvoice(payload) {
    const { data } = await apiClient.post("/invoices", payload);
    return data.data ?? data;
  },

  async updateInvoice(id, payload) {
    const { data } = await apiClient.put(`/invoices/${id}`, payload);
    return data.data ?? data;
  },

  async deleteInvoice(id) {
    await apiClient.delete(`/invoices/${id}`);
    return true;
  },

  async fetchPayments(params = {}) {
    const { data } = await apiClient.get("/invoice-payments", { params });
    return data.data ?? data;
  },

  async recordPayment(invoiceId, payload) {
    const { data } = await apiClient.post(`/invoices/${invoiceId}/payments`, payload);
    const result = data.data ?? data;
    return {
      payment: result.payment ?? result,
      invoice: result.invoice,
    };
  },

  async settleInvoice(invoiceId) {
    const { data } = await apiClient.post(`/invoices/${invoiceId}/settle`);
    return data.data ?? data;
  },

  async deletePayment(paymentId) {
    await apiClient.delete(`/invoice-payments/${paymentId}`);
    return true;
  },
};
