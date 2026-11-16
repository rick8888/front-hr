import apiClient from "../../../services/api.js";

function messageFromBlob(blob, fallback) {
  return blob.text().then((text) => {
    try {
      return JSON.parse(text).message || fallback;
    } catch {
      return fallback;
    }
  });
}

export const complianceDeclarationReportApiService = {
  async fetchReport(period) {
    const { data } = await apiClient.get("/compliance-declarations/report", {
      params: { period },
    });
    return data?.data ?? data;
  },

  async updatePayment({ period, obligationId, isPaid }) {
    const { data } = await apiClient.post("/compliance-declarations/payment", {
      period,
      obligation_id: obligationId,
      is_paid: isPaid,
    });
    return data?.data ?? data;
  },

  async downloadPdf(period) {
    try {
      const response = await apiClient.get("/compliance-declarations/report/pdf", {
        params: { period },
        responseType: "blob",
      });
      const blob = response.data;
      if (blob?.type?.includes("application/json")) {
        throw new Error(await messageFromBlob(blob, "Le téléchargement du PDF a échoué."));
      }

      const disposition = response.headers?.["content-disposition"] ?? "";
      const filename = /filename="?([^";]+)"?/i.exec(disposition)?.[1]
        ?? `rapport-declarations-${period}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        throw new Error(await messageFromBlob(error.response.data, "Le téléchargement du PDF a échoué."));
      }
      throw error instanceof Error ? error : new Error("Le téléchargement du PDF a échoué.");
    }
  },
};
