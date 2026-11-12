import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export function normalizeLandingService(raw = {}) {
  return {
    id: raw.id ?? raw.code,
    code: raw.code,
    label: raw.label || raw.code,
    description: raw.description || "",
    category: raw.category || "core",
    sortOrder: raw.sort_order ?? 0,
  };
}

export function normalizeLandingPlan(raw = {}) {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    tagline: raw.tagline || "",
    priceMonthly: Number(raw.price_monthly ?? 0),
    currency: raw.currency || "EUR",
    maxUsers: raw.max_users ?? null,
    maxEmployees: raw.max_employees ?? null,
    storageGb: raw.storage_gb ?? null,
    isActive: raw.is_active !== false,
    isHighlighted: !!raw.is_highlighted,
    isFree: !!raw.is_free || Number(raw.price_monthly ?? 0) === 0,
    sortOrder: raw.sort_order ?? 0,
    includedServices: Array.isArray(raw.included_services) ? raw.included_services : [],
  };
}

export function normalizeCountry(raw = {}) {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    currency: raw.currency || "EUR",
  };
}

export const landingApiService = {
  async fetchPlans() {
    const { data } = await apiClient.get("/subscription-plans", {
      skipAuthRedirect: true,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeLandingPlan) : [];
  },

  async fetchServices() {
    const { data } = await apiClient.get("/subscription-services", {
      skipAuthRedirect: true,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeLandingService) : [];
  },

  async fetchCountries() {
    const { data } = await apiClient.get("/countries", {
      params: { active_only: 1 },
      skipAuthRedirect: true,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeCountry) : [];
  },

  async sendContactMessage(payload) {
    const { data } = await apiClient.post("/contact", payload, {
      skipAuthRedirect: true,
    });
    return data;
  },
};
