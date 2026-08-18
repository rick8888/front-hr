import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const payslipsApiService = {
  /**
   * @returns {Promise<{ kpis: object, items: array, employee: object|null }>}
   */
  async fetchAll() {
    const { data } = await apiClient.get("/self-service/payslips");
    const body = unwrap(data) || {};
    return {
      kpis: body.kpis || body.kpi || {},
      items: Array.isArray(body.items) ? body.items : Array.isArray(body) ? body : [],
      employee: body.employee || null,
    };
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/self-service/payslips/${id}`);
    return unwrap(data);
  },

  /**
   * Télécharge le PDF (blob) et déclenche un save-as navigateur.
   */
  async downloadPdf(id, filenameHint = "payslip.pdf") {
    const response = await apiClient.get(`/self-service/payslips/${id}/pdf`, {
      responseType: "blob",
    });
    const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filenameHint || `payslip-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
