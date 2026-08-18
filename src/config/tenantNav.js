/**
 * Menu latéral « tenant » (portail client SaaS).
 * labelKey → i18n (nav.tenant.*)
 */
export const TENANT_NAV = [
  {
    id: "dashboard",
    labelKey: "nav.tenant.dashboard",
    path: "/tenant/dashboard",
    icon: "\u{1F3E2}",
  },
  {
    id: "subscription",
    labelKey: "nav.tenant.subscription",
    path: "/tenant/subscription",
    icon: "\u{1F4E6}",
  },
  {
    id: "billings",
    labelKey: "nav.tenant.billings",
    path: "/tenant/billings",
    icon: "\u{1F4B3}",
  },
  {
    id: "invoices",
    labelKey: "nav.tenant.invoices",
    path: "/tenant/invoices",
    icon: "\u{1F4C4}",
  },
  {
    id: "usage",
    labelKey: "nav.tenant.usage",
    path: "/tenant/usage",
    icon: "\u{1F4C8}",
  },
  {
    id: "deadlines",
    labelKey: "nav.tenant.deadlines",
    path: "/tenant/echeances",
    icon: "\u{1F4C5}",
  },
  {
    id: "users",
    labelKey: "nav.tenant.users",
    path: "/tenant/utilisateurs",
    icon: "\u{1F465}",
  },
  {
    id: "company",
    labelKey: "nav.tenant.company",
    path: "/tenant/profile",
    icon: "\u{1F3DB}\u{FE0F}",
  },
  {
    id: "support",
    labelKey: "nav.tenant.support",
    path: "/tenant/support",
    icon: "\u{1F4AC}",
  },
];

export function pathMatchesTenantNav(path) {
  return TENANT_NAV.some(
    (item) => path === item.path || path.startsWith(`${item.path}/`)
  );
}
