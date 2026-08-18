/**
 * Données démo — page Support Center tenant.
 */
export const tenantSupportDemo = {
  email: "support@example.com",
  responseTime: "Response time: 24-48 hours",
};

/** Sujets accordéon : le premier est ouvert par défaut sur la maquette. */
export const tenantSupportTopics = [
  {
    id: "billing",
    label: "Billing & Payments",
    icon: "card",
    defaultOpen: true,
    links: [
      { label: "View payment history", to: "/tenant/billings" },
      { label: "Manage subscription", to: "/tenant/subscription" },
      { label: "Download invoices", to: "/tenant/invoices" },
    ],
  },
  {
    id: "account",
    label: "Account Management",
    icon: "user",
    defaultOpen: false,
    links: [],
  },
  {
    id: "technical",
    label: "Technical Support",
    icon: "code",
    defaultOpen: false,
    links: [],
  },
  {
    id: "faq",
    label: "Frequently Asked Questions",
    icon: "help",
    defaultOpen: false,
    links: [],
  },
];
