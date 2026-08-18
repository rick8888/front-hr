import { ref, onMounted } from "vue";
import { whatsappSettingsApiService } from "../services/whatsapp-settings.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";

function emptyForm() {
  return {
    enabled: false,
    attendance_enabled: false,
    provider: "meta_cloud",
    api_version: "v21.0",
    phone_number_id: "",
    business_account_id: "",
    display_phone: "",
    verify_token: "",
    access_token: "",
    app_secret: "",
    welcome_message: "",
    access_token_set: false,
    app_secret_set: false,
    webhook_url: "",
    commands: {},
  };
}

/**
 * Composable configuration WhatsApp Business + pointage.
 */
export function useWhatsAppSettings() {
  const form = ref(emptyForm());
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const success = ref(null);
  const meta = ref({ webhook_url: "", commands: {} });

  async function load() {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      const data = await whatsappSettingsApiService.fetch();
      form.value = {
        ...emptyForm(),
        ...data,
        access_token: "",
        app_secret: "",
      };
      meta.value = {
        webhook_url: data.webhook_url || "",
        commands: data.commands || {},
      };
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de charger la configuration WhatsApp.";
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    saving.value = true;
    error.value = null;
    success.value = null;
    try {
      const payload = {
        enabled: !!form.value.enabled,
        attendance_enabled: !!form.value.attendance_enabled,
        provider: form.value.provider || "meta_cloud",
        api_version: form.value.api_version || "v21.0",
        phone_number_id: form.value.phone_number_id || null,
        business_account_id: form.value.business_account_id || null,
        display_phone: form.value.display_phone || null,
        verify_token: form.value.verify_token || null,
        welcome_message: form.value.welcome_message || null,
      };
      // ne renvoyer les secrets que s’ils sont saisis
      if (form.value.access_token?.trim()) {
        payload.access_token = form.value.access_token.trim();
      }
      if (form.value.app_secret?.trim()) {
        payload.app_secret = form.value.app_secret.trim();
      }

      const data = await whatsappSettingsApiService.update(payload);
      form.value = {
        ...emptyForm(),
        ...data,
        access_token: "",
        app_secret: "",
      };
      meta.value = {
        webhook_url: data.webhook_url || "",
        commands: data.commands || {},
      };
      success.value = "Configuration WhatsApp enregistrée.";
    } catch (e) {
      error.value = parseApiError(e) || "Impossible d’enregistrer.";
    } finally {
      saving.value = false;
    }
  }

  function regenerateVerifyToken() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "bravo_wa_";
    for (let i = 0; i < 28; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    form.value.verify_token = token;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      success.value = "Copié dans le presse-papiers.";
      setTimeout(() => {
        if (success.value === "Copié dans le presse-papiers.") success.value = null;
      }, 2000);
    } catch {
      error.value = "Copie impossible.";
    }
  }

  onMounted(load);

  return {
    form,
    meta,
    loading,
    saving,
    error,
    success,
    load,
    save,
    regenerateVerifyToken,
    copyText,
  };
}
