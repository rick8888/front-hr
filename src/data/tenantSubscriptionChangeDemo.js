/**
 * Flux « Change Subscription Plan » (démo) — aligné maquette Professional.
 * Autres plans : variantes simplifiées.
 */

const STARTER_FEATURES = [
  "Up to 10 users",
  "Up to 25 employees",
  "5 GB Storage",
  "6 Modules Included",
];

const PROFESSIONAL_FEATURES = [
  "Up to 50 users",
  "Up to 100 employees",
  "25 GB Storage",
  "16 Modules Included",
];

const UNLIMITED_FEATURES = [
  "Unlimited Users",
  "Unlimited Employees",
  "Unlimited Storage",
  "Core Modules Only",
];

const CHANGE_NOTICE =
  "You will be upgraded immediately after payment. Your next billing date will remain the same.";

/** Maquette : passage Starter → Professional. */
export const tenantChangePlanProfessional = {
  currentPlan: { name: "Starter", priceLine: "$499.00/monthly" },
  newPlan: { name: "Professional", priceLine: "$1,499.00/monthly" },
  billingLines: [
    { label: "New plan price", amount: "$1,499.00", tone: "neutral" },
    {
      label: "Credit from current plan (-51.472371749259 days remaining)",
      amount: "-$-856.16",
      tone: "muted",
    },
  ],
  amountDueToday: "$2,355.16",
  infoNotice: CHANGE_NOTICE,
  currentFeatures: STARTER_FEATURES,
  newFeatures: PROFESSIONAL_FEATURES,
};

export const tenantChangePlanUnlimited = {
  currentPlan: { name: "Starter", priceLine: "$499.00/monthly" },
  newPlan: { name: "Unlimited", priceLine: "$7,999.00/lifetime" },
  billingLines: [
    { label: "New plan price", amount: "$7,999.00", tone: "neutral" },
    {
      label: "Credit from current plan (prorated)",
      amount: "-$412.00",
      tone: "muted",
    },
  ],
  amountDueToday: "$7,587.00",
  infoNotice: CHANGE_NOTICE,
  currentFeatures: STARTER_FEATURES,
  newFeatures: UNLIMITED_FEATURES,
};

export function getTenantPlanChangeFlow(planId) {
  if (planId === "unlimited") return tenantChangePlanUnlimited;
  return tenantChangePlanProfessional;
}

export const tenantChangePaymentMethods = [
  {
    id: "bank",
    title: "Bank Transfer",
    description: "Pay via bank transfer and upload proof of payment",
    selected: true,
  },
];
