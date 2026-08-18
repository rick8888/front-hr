import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

/**
 * API HR — configuration WhatsApp Business (par entreprise).
 */
export const whatsappSettingsApiService = {
  async fetch() {
    const { data } = await apiClient.get("/whatsapp-settings");
    return unwrap(data) ?? {};
  },

  async update(payload) {
    const { data } = await apiClient.put("/whatsapp-settings", payload);
    return unwrap(data) ?? data;
  },
};
