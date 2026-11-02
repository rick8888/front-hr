import invoicesSeed from "./invoices.json";
import paymentsSeed from "./payments.json";

export const BILLING_INVOICES_SEED = invoicesSeed;
export const BILLING_PAYMENTS_SEED = paymentsSeed;

export const INVOICE_STATUS_LABELS = {
  draft: "Brouillon",
  pending: "En attente",
  partial: "Partiellement payée",
  paid: "Payée",
  overdue: "En retard",
  cancelled: "Annulée",
};

export const INVOICE_STATUS_TONES = {
  draft: "bg-neutral-100 text-neutral-600",
  pending: "bg-amber-50 text-amber-800",
  partial: "bg-sky-50 text-sky-800",
  paid: "bg-emerald-50 text-emerald-800",
  overdue: "bg-red-50 text-red-800",
  cancelled: "bg-neutral-100 text-neutral-500 line-through",
};

export const PAYMENT_METHOD_LABELS = {
  bank_transfer: "Virement bancaire",
  mobile_money: "Mobile money",
  card: "Carte bancaire",
  check: "Chèque",
  cash: "Espèces",
  other: "Autre",
};

export function formatInvoiceAmount(amount, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "XOF" ? 0 : 2,
  }).format(amount ?? 0);
}

export function formatInvoiceDate(iso) {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function invoiceStatusLabel(status) {
  return INVOICE_STATUS_LABELS[status] ?? status ?? "—";
}

export function paymentMethodLabel(method) {
  return PAYMENT_METHOD_LABELS[method] ?? method ?? "—";
}

export function invoiceBalance(invoice) {
  return Math.max(0, (invoice?.amount ?? 0) - (invoice?.amount_paid ?? 0));
}

export function isInvoicePayable(invoice) {
  return invoice && !["draft", "cancelled", "paid"].includes(invoice.status);
}
