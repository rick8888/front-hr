/**
 * Données démo — page « Manage Your Subscription » du portail tenant.
 * Aligné maquette : plan courant + 3 plans disponibles + historique.
 */

export const tenantCurrentSubscription = {
  planName: "Starter",
  status: "Active",
  price: "$499.00/monthly",
  startedDate: "Feb 19, 2026",
  applicationUrl: "https://acme.opencorebs.com",
  nextBillingDate: "Mar 21, 2026",
  features: [
    "Up to 10 users",
    "Up to 25 employees",
    "5 GB Storage",
    "6 Modules Included",
  ],
};

export const tenantAvailablePlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$499.00",
    cadence: "/monthly",
    tagline: "Perfect for small businesses and startups",
    features: [
      "Up to 10 users",
      "Up to 25 employees",
      "5 GB Storage",
      "6 Modules Included",
    ],
    cta: { label: "Current Plan", disabled: true },
  },
  {
    id: "professional",
    name: "Professional",
    price: "$1,499.00",
    cadence: "/monthly",
    tagline: "Great for growing companies with advanced needs",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Up to 50 users",
      "Up to 100 employees",
      "25 GB Storage",
      "16 Modules Included",
    ],
    cta: { label: "Upgrade", variant: "primary" },
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "$7,999.00",
    cadence: "/lifetime",
    tagline: "No limits, no restrictions - full access to everything",
    features: [
      "Unlimited Users",
      "Unlimited Employees",
      "Unlimited Storage",
      "Core Modules Only",
    ],
    cta: { label: "Upgrade", variant: "primary" },
  },
];

export const tenantSubscriptionHistory = [
  {
    id: 1,
    plan: "Starter",
    status: "Active",
    period: "Feb 19, 2026 - Mar 21, 2026",
    amount: "$499.00",
  },
];
