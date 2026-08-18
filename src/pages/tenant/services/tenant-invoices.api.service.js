import apiClient from "../../../services/api.js";

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
    throw new Error(
      await messageFromBlob(blob, "Unable to download invoice PDF."),
    );
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

export const tenantInvoicesApiService = {
  async fetchInvoices() {
    const { data } = await apiClient.get("/tenant/invoices");
    return data?.data ?? data ?? [];
  },

  async fetchInvoice(id) {
    const { data } = await apiClient.get(`/tenant/invoices/${id}`);
    return data?.data ?? data;
  },

  async downloadInvoicePdf(id, fallbackName = `invoice-${id}.pdf`) {
    try {
      const response = await apiClient.get(`/tenant/invoices/${id}/download`, {
        responseType: "blob",
      });
      await savePdfBlob(response, fallbackName);
    } catch (e) {
      if (e.response?.data instanceof Blob) {
        throw new Error(
          await messageFromBlob(
            e.response.data,
            "Unable to download invoice PDF.",
          ),
        );
      }
      throw e instanceof Error
        ? e
        : new Error("Unable to download invoice PDF.");
    }
  },
};
