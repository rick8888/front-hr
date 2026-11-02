import apiClient from "../../../services/api.js";
import { unwrapList, unwrapResource } from "../utils/payroll-http.js";

function filenameFromDisposition(header, fallback) {
  if (!header) return fallback;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1]);
    } catch {
      return utfMatch[1];
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1] || fallback;
}

async function messageFromBlob(blob, fallback) {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return parsed.message || fallback;
  } catch {
    return fallback;
  }
}

async function savePdfBlob(response, fallbackName) {
  const blob = response.data;
  if (!(blob instanceof Blob)) {
    throw new Error("Invalid PDF response.");
  }
  if (blob.type && blob.type.includes("application/json")) {
    throw new Error(await messageFromBlob(blob, "Unable to download payslip PDF."));
  }
  const filename = filenameFromDisposition(
    response.headers?.["content-disposition"],
    fallbackName,
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * API HR — /api/v1/payrolls
 * Liste, détail, génération, suppression des bulletins.
 */
export const payrollApiService = {
  /**
   * @param {object} [params]
   * @param {number} [params.per_page]
   * @param {number} [params.page]
   * @param {number} [params.company_id]
     * @param {string} [params.period] YYYY-MM
     * @param {string} [params.period_from] YYYY-MM
     * @param {string} [params.period_to] YYYY-MM
     * @param {string|string[]} [params.status]
     * @param {number} [params.employee_id]
     * @param {string} [params.department]
     * @param {string} [params.search]
   * @returns {Promise<{ items: any[], meta: object|null }>}
   */
  async fetchPage(params = {}) {
    const { data } = await apiClient.get("/payrolls", { params });
    const items = unwrapList(data);
    const meta = data?.meta ?? null;
    return { items, meta };
  },

  /** Liste plate (pagination élargie pour écrans type “All Records”). */
  async fetchAll(params = {}) {
    const { items } = await this.fetchPage({
      per_page: params.per_page ?? 200,
      page: 1,
      ...params,
    });
    return items;
  },

  async fetchById(id) {
    const { data } = await apiClient.get(`/payrolls/${id}`);
    return unwrapResource(data);
  },

  /**
   * @param {{ employee_id: number, period: string }} payload
   */
  async generate(payload) {
    const { data } = await apiClient.post("/payrolls/generate", payload);
    return unwrapResource(data);
  },

  /**
   * @param {{ employee_id: number, period: string }} payload
   */
  async preview(payload) {
    const { data } = await apiClient.post("/payrolls/preview", payload);
    return unwrapResource(data);
  },

  async remove(id) {
    await apiClient.delete(`/payrolls/${id}`);
    return true;
  },

  /**
   * @param {number} id
   * @param {{ status: string, reason?: string }} payload
   */
  async updateStatus(id, payload) {
    const { data } = await apiClient.patch(`/payrolls/${id}/status`, payload);
    return unwrapResource(data);
  },

  /**
   * Télécharge le bulletin PDF (blob) et déclenche un save-as navigateur.
   * @param {number|string} id
   * @param {string} [fallbackName]
   */
  async downloadPdf(id, fallbackName = `fiche-de-paie-${id}.pdf`) {
    try {
      const response = await apiClient.get(`/payrolls/${id}/pdf`, {
        responseType: "blob",
      });
      await savePdfBlob(response, fallbackName);
    } catch (e) {
      if (e.response?.data instanceof Blob) {
        throw new Error(
          await messageFromBlob(e.response.data, "Unable to download payslip PDF."),
        );
      }
      throw e instanceof Error ? e : new Error("Unable to download payslip PDF.");
    }
  },
};
