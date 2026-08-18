import { ref } from "vue";
import { tenantProfileApiService } from "../pages/tenant/services/tenant-profile.api.service.js";

export function emptyProfileForm() {
  return {
    companyName: "",
    email: "",
    phone: "",
    website: "",
    taxId: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    accountStatus: "",
    memberSince: "",
    subdomain: "",
  };
}

function mapProfileToForm(apiProfile) {
  if (!apiProfile) return emptyProfileForm();

  return {
    companyName: apiProfile.company_name ?? "",
    email: apiProfile.email ?? "",
    phone: apiProfile.phone ?? "",
    website: apiProfile.website ?? "",
    taxId: apiProfile.tax_id ?? "",
    streetAddress: apiProfile.address?.street ?? "",
    city: apiProfile.address?.city ?? "",
    state: apiProfile.address?.state ?? "",
    country: apiProfile.country ?? "",
    postalCode: apiProfile.address?.postal_code ?? "",
    accountStatus: apiProfile.account_status ?? "",
    memberSince: apiProfile.member_since ?? "",
    subdomain: apiProfile.subdomain ?? "",
  };
}

function mapFormToPayload(form) {
  return {
    name: form.companyName.trim(),
    phone: form.phone.trim() || null,
    website: form.website.trim() || null,
    tax_id: form.taxId.trim() || null,
    address: {
      street: form.streetAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postal_code: form.postalCode.trim(),
    },
  };
}

export function useTenantCompanyProfile() {
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");
  const successMessage = ref("");
  const profile = ref(null);

  function applyProfile(apiProfile) {
    profile.value = mapProfileToForm(apiProfile);
  }

  async function load() {
    loading.value = true;
    error.value = "";
    successMessage.value = "";

    try {
      const data = await tenantProfileApiService.fetchProfile();
      applyProfile(data);
    } catch (e) {
      error.value =
        e.response?.data?.message ||
        "Unable to load company profile.";
      profile.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function save(form) {
    saving.value = true;
    error.value = "";
    successMessage.value = "";

    try {
      const data = await tenantProfileApiService.updateProfile(mapFormToPayload(form));
      applyProfile(data);
      successMessage.value = "Profile updated successfully.";
    } catch (e) {
      error.value =
        e.response?.data?.message ||
        "Unable to save company profile.";
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    profile,
    loading,
    saving,
    error,
    successMessage,
    load,
    save,
    emptyProfileForm,
  };
}
