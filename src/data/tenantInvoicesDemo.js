/**
 * Données démo — page « Invoices » du portail tenant.
 * Conservé pour référence / tests locaux hors API.
 */
export const tenantInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-202602-00001",
    date: "2026-02-19",
    description: "Payment for Professional plan",
    amount: "SAR1,499.00",
    amountValue: 1499,
    currency: "SAR",
    status: "Paid",
    pdfUrl: "#",
  },
];

export { formatInvoiceDate } from "../composables/useTenantInvoices.js";
