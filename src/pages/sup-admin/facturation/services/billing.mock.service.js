import {
  BILLING_INVOICES_SEED,
  BILLING_PAYMENTS_SEED,
} from "../../../../data/billing/index.js";
import { companiesMockService } from "../../entreprises/services/companies.mock.service.js";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const deepClone = (value) => JSON.parse(JSON.stringify(value));

let invoices = deepClone(BILLING_INVOICES_SEED);
let payments = deepClone(BILLING_PAYMENTS_SEED);
let invoiceIdCounter = 20;
let invoiceSeqCounter = 6;
let paymentIdCounter = 10;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isPastDue(dueDate) {
  if (!dueDate) return false;
  return dueDate < today();
}

function sumPaymentsForInvoice(invoiceId) {
  return payments
    .filter((p) => p.invoice_id === invoiceId)
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);
}

function lastPaymentDate(invoiceId) {
  const list = payments
    .filter((p) => p.invoice_id === invoiceId)
    .sort((a, b) => (b.paid_at ?? "").localeCompare(a.paid_at ?? ""));
  return list[0]?.paid_at ?? null;
}

function syncInvoicePaymentState(invoice) {
  if (invoice.status === "cancelled" || invoice.status === "draft") {
    return invoice;
  }
  const amountPaid = sumPaymentsForInvoice(invoice.id);
  invoice.amount_paid = amountPaid;
  const balance = Math.max(0, (invoice.amount ?? 0) - amountPaid);

  if (balance <= 0 && amountPaid > 0) {
    invoice.status = "paid";
    invoice.paid_at = lastPaymentDate(invoice.id) || today();
  } else if (amountPaid > 0) {
    invoice.status = isPastDue(invoice.due_date) ? "overdue" : "partial";
    invoice.paid_at = null;
  } else {
    invoice.status = isPastDue(invoice.due_date) ? "overdue" : "pending";
    invoice.paid_at = null;
  }
  return invoice;
}

function syncAllInvoices() {
  invoices.forEach((inv) => syncInvoicePaymentState(inv));
}

syncAllInvoices();

function nextInvoiceNumber(issueDate) {
  invoiceSeqCounter += 1;
  const year = (issueDate || today()).slice(0, 4);
  return `INV-${year}-${String(invoiceSeqCounter).padStart(5, "0")}`;
}

function sortInvoices(list) {
  return [...list].sort((a, b) => (b.issue_date ?? "").localeCompare(a.issue_date ?? ""));
}

function sortPayments(list) {
  return [...list].sort((a, b) => (b.paid_at ?? "").localeCompare(a.paid_at ?? ""));
}

async function resolveCompany(companyId) {
  const companies = await companiesMockService.fetchCompanies();
  const company = companies.find((c) => c.id === companyId);
  if (!company) throw new Error("Entreprise introuvable");
  return company;
}

export const billingMockService = {
  async fetchInvoices() {
    await delay();
    syncAllInvoices();
    return sortInvoices(deepClone(invoices));
  },

  async fetchPayments(invoiceId = null) {
    await delay(250);
    let list = payments;
    if (invoiceId) list = list.filter((p) => p.invoice_id === invoiceId);
    return sortPayments(deepClone(list));
  },

  async createInvoice(payload) {
    await delay();
    const company = await resolveCompany(payload.company_id);
    invoiceIdCounter += 1;
    const issueDate = payload.issue_date || today();
    const invoice = {
      id: `inv-${invoiceIdCounter}`,
      invoice_number: payload.invoice_number || nextInvoiceNumber(issueDate),
      company_id: company.id,
      company_name: company.name,
      plan_code: payload.plan_code || null,
      description: payload.description?.trim() || `Facture — ${company.name}`,
      amount: payload.amount ?? 0,
      amount_paid: 0,
      currency: payload.currency || company.currency || "EUR",
      status: payload.status || "draft",
      issue_date: issueDate,
      due_date: payload.due_date || issueDate,
      paid_at: null,
      period_start: payload.period_start || null,
      period_end: payload.period_end || null,
      notes: payload.notes?.trim() || "",
    };
    if (invoice.status === "pending" && isPastDue(invoice.due_date)) {
      invoice.status = "overdue";
    }
    invoices.unshift(invoice);
    return deepClone(invoice);
  },

  async updateInvoice(invoiceId, updates) {
    await delay();
    const index = invoices.findIndex((i) => i.id === invoiceId);
    if (index === -1) throw new Error("Facture introuvable");

    if (updates.company_id && updates.company_id !== invoices[index].company_id) {
      const company = await resolveCompany(updates.company_id);
      updates.company_name = company.name;
      if (!updates.currency) updates.currency = company.currency;
    }

    if (updates.status === "cancelled" || updates.status === "draft") {
      updates.amount_paid = updates.status === "draft" ? 0 : invoices[index].amount_paid;
      updates.paid_at = null;
    }

    delete updates.amount_paid;
    invoices[index] = { ...invoices[index], ...updates };
    syncInvoicePaymentState(invoices[index]);
    return deepClone(invoices[index]);
  },

  async recordPayment(invoiceId, payload) {
    await delay();
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) throw new Error("Facture introuvable");
    if (["draft", "cancelled", "paid"].includes(invoice.status)) {
      throw new Error("Cette facture n'accepte pas de paiement.");
    }

    const balance = Math.max(0, (invoice.amount ?? 0) - sumPaymentsForInvoice(invoiceId));
    const amount = payload.amount ?? 0;
    if (amount <= 0) throw new Error("Le montant doit être supérieur à 0.");
    if (amount > balance + 0.001) {
      throw new Error(`Le montant dépasse le solde restant (${balance}).`);
    }

    paymentIdCounter += 1;
    const payment = {
      id: `pay-${paymentIdCounter}`,
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      company_id: invoice.company_id,
      company_name: invoice.company_name,
      amount,
      currency: invoice.currency,
      paid_at: payload.paid_at || today(),
      method: payload.method || "bank_transfer",
      reference: payload.reference?.trim() || "",
      notes: payload.notes?.trim() || "",
    };
    payments.unshift(payment);
    syncInvoicePaymentState(invoice);
    return { payment: deepClone(payment), invoice: deepClone(invoice) };
  },

  async deletePayment(paymentId) {
    await delay();
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) throw new Error("Paiement introuvable");
    payments = payments.filter((p) => p.id !== paymentId);
    const invoice = invoices.find((i) => i.id === payment.invoice_id);
    if (invoice) syncInvoicePaymentState(invoice);
    return true;
  },

  async markAsPaid(invoiceId) {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) throw new Error("Facture introuvable");
    const balance = Math.max(0, (invoice.amount ?? 0) - sumPaymentsForInvoice(invoiceId));
    if (balance <= 0) return deepClone(invoice);
    const result = await this.recordPayment(invoiceId, {
      amount: balance,
      method: "bank_transfer",
      reference: "SOLDE",
      notes: "Paiement du solde restant",
      paid_at: today(),
    });
    return result.invoice;
  },

  async deleteInvoice(invoiceId) {
    await delay();
    const index = invoices.findIndex((i) => i.id === invoiceId);
    if (index === -1) throw new Error("Facture introuvable");
    payments = payments.filter((p) => p.invoice_id !== invoiceId);
    invoices.splice(index, 1);
    return true;
  },
};
