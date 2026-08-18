import { ref, computed } from "vue";
import { platformSettingsApiService } from "../services/platformSettings.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

const SMTP_DEFAULTS = {
  host: "",
  port: 587,
  encryption: "tls",
  username: "",
  password: "",
  from_address: "",
  from_name: "Bravo RH",
};

const SMS_DEFAULTS = {
  provider: "",
  api_key: "",
  sender_id: "",
  enabled: false,
};

function mapSettingsToObject(settings, group, defaults) {
  const result = { ...defaults };
  for (const item of settings) {
    if (item.group === group && item.key in result) {
      result[item.key] = item.value?.value ?? item.value ?? result[item.key];
    }
  }
  return result;
}

function buildPayload(group, form, labels) {
  return Object.entries(form).map(([key, value]) => ({
    group,
    key,
    value: { value },
    label: labels[key] ?? key,
  }));
}

export function usePlatformSettings(group) {
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");
  const success = ref("");

  const smtpForm = ref({ ...SMTP_DEFAULTS });
  const smsForm = ref({ ...SMS_DEFAULTS });

  const form = computed(() => (group === "sms" ? smsForm.value : smtpForm.value));

  async function load() {
    loading.value = true;
    error.value = "";
    success.value = "";
    try {
      const settings = await platformSettingsApiService.fetchAll(group);
      if (group === "smtp") {
        smtpForm.value = mapSettingsToObject(settings, "smtp", SMTP_DEFAULTS);
      } else if (group === "sms") {
        smsForm.value = mapSettingsToObject(settings, "sms", SMS_DEFAULTS);
      }
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de charger les paramètres.";
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    saving.value = true;
    error.value = "";
    success.value = "";
    const labels =
      group === "smtp"
        ? {
            host: "Serveur SMTP",
            port: "Port",
            encryption: "Chiffrement",
            username: "Utilisateur",
            password: "Mot de passe",
            from_address: "Adresse expéditeur",
            from_name: "Nom expéditeur",
          }
        : {
            provider: "Fournisseur SMS",
            api_key: "Clé API",
            sender_id: "Sender ID",
            enabled: "Activé",
          };

    try {
      await platformSettingsApiService.updateMany(buildPayload(group, form.value, labels));
      success.value = "Paramètres enregistrés.";
    } catch (e) {
      error.value = parseApiError(e) || "Impossible d'enregistrer les paramètres.";
    } finally {
      saving.value = false;
    }
  }

  return {
    form,
    smtpForm,
    smsForm,
    loading,
    saving,
    error,
    success,
    load,
    save,
  };
}
