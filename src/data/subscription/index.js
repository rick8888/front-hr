import services from "./services.json";
import plansSeed from "./plans.json";

export const SUBSCRIPTION_SERVICES = services;
export const SUBSCRIPTION_PLANS_SEED = plansSeed;

export const SERVICE_CATEGORY_LABELS = {
  core: "Modules essentiels",
  hr: "RH & administratif",
  advanced: "Modules avancés",
  enterprise: "Entreprise",
};

export function formatLimit(value, unit = "") {
  if (value == null) return "Illimité";
  return unit ? `${value} ${unit}` : String(value);
}

export function formatPlanPrice(plan) {
  if (!plan.price_monthly) return "Gratuit";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: plan.currency || "EUR",
    maximumFractionDigits: 0,
  }).format(plan.price_monthly);
}

export function planIncludesService(plan, serviceId) {
  return (plan.included_services ?? []).includes(serviceId);
}

export function getServiceById(serviceId) {
  return SUBSCRIPTION_SERVICES.find((s) => s.id === serviceId);
}

export function groupServicesByCategory(serviceList = SUBSCRIPTION_SERVICES) {
  return serviceList.reduce((groups, service) => {
    const cat = service.category || "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(service);
    return groups;
  }, {});
}

export function buildPlanHighlights(plan) {
  return [
    plan.max_users == null ? "Utilisateurs illimités" : `Jusqu'à ${plan.max_users} utilisateurs`,
    plan.max_employees == null ? "Employés illimités" : `Jusqu'à ${plan.max_employees} employés`,
    plan.storage_gb == null ? "Stockage illimité" : `${plan.storage_gb} Go de stockage`,
    `${(plan.included_services ?? []).length} module(s) inclus`,
  ];
}
