/**
 * Données démo — page « Billing & Payments » du portail tenant.
 * Conservé pour référence / tests locaux hors API.
 */

export const TENANT_BILLING_STATUSES = ["Paid", "Pending", "Failed", "Refunded"];

export const tenantPaymentHistory = [
  {
    id: 5,
    paymentId: "#000005",
    date: "2026-03-19",
    description: "Change to Unlimited plan (Prorated)",
    amount: "$7,973.79",
    amountValue: 7973.79,
    status: "Pending",
  },
];

export { formatBillingDate } from "../composables/useTenantBillings.js";

export function computeBillingKpis(rows = [], { currency = "USD" } = {}) {
  const totals = { paid: 0, pending: 0, count: rows.length };
  for (const r of rows) {
    if (r.currency && r.currency !== currency) continue;
    if (r.status === "Paid") totals.paid += r.amountValue || 0;
    if (r.status === "Pending") totals.pending += r.amountValue || 0;
  }
  return totals;
}

export function formatCurrency(amount) {
  if (typeof amount !== "number") return "$0.00";
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
