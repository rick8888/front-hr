/**
 * Données démo — page « Usage Overview » du portail tenant.
 * Conservé pour référence / tests locaux hors API.
 */
export const tenantUsage = {
  plan: {
    name: "Starter",
    tagline: "Perfect for small businesses and startups",
    price: "$499.00",
    cadence: "per monthly",
  },
  metrics: [
    {
      id: "users",
      label: "Users",
      icon: "user",
      used: 1,
      limit: 10,
      unit: "",
      display: "1 / 10",
    },
    {
      id: "storage",
      label: "Storage",
      icon: "storage",
      used: 0,
      limit: 5,
      unit: "GB",
      display: "0.00 GB / 5 GB",
    },
  ],
};

export { usagePercent } from "../composables/useTenantUsage.js";
