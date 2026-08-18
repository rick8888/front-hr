import { SUBSCRIPTION_PLANS_SEED } from "../../../../data/subscription/index.js";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const deepClone = (value) => JSON.parse(JSON.stringify(value));

let plans = deepClone(SUBSCRIPTION_PLANS_SEED);
let planIdCounter = 100;

function sortPlans(list) {
  return [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function slugifyCode(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export const plansMockService = {
  async fetchPlans() {
    await delay();
    return sortPlans(deepClone(plans));
  },

  async addPlan(payload) {
    await delay();
    const code = slugifyCode(payload.code || payload.name || "");
    if (!code) throw new Error("Le code du plan est requis.");
    if (plans.some((p) => p.code === code)) throw new Error("Ce code de plan existe déjà.");
    planIdCounter += 1;
    const maxOrder = plans.reduce((max, p) => Math.max(max, p.sort_order ?? 0), 0);
    const newPlan = {
      id: `plan-${planIdCounter}`,
      code,
      name: payload.name?.trim() || code,
      tagline: payload.tagline?.trim() || "",
      price_monthly: payload.price_monthly ?? 0,
      currency: payload.currency || "EUR",
      max_users: payload.max_users ?? 5,
      max_employees: payload.max_employees ?? 25,
      storage_gb: payload.storage_gb ?? 5,
      is_active: payload.is_active ?? true,
      is_highlighted: payload.is_highlighted ?? false,
      sort_order: maxOrder + 1,
      included_services: payload.included_services ?? [],
    };
    plans.push(newPlan);
    return deepClone(newPlan);
  },

  async updatePlan(planId, updates) {
    await delay();
    const index = plans.findIndex((p) => p.id === planId);
    if (index === -1) throw new Error("Plan introuvable");
    plans[index] = { ...plans[index], ...updates };
    return deepClone(plans[index]);
  },

  async togglePlanActive(planId, isActive) {
    await delay(250);
    const index = plans.findIndex((p) => p.id === planId);
    if (index === -1) throw new Error("Plan introuvable");
    plans[index].is_active = isActive;
    return deepClone(plans[index]);
  },
};
