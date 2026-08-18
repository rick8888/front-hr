import { ref } from "vue";
import { tenantInvoicesApiService } from "../pages/tenant/services/tenant-invoices.api.service.js";

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatInvoiceDate(iso) {
  if (!iso) return "";
  const raw = String(iso).slice(0, 10);
  const d = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${SHORT_MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

export function mapInvoice(row) {
  if (!row) return null;

  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    date: row.date,
    dueDate: row.due_date ?? null,
    paidAt: row.paid_at ?? null,
    description: row.description ?? "",
    amount: row.amount ?? "—",
    amountValue: Number(row.amount_value ?? 0),
    amountPaid: row.amount_paid ?? null,
    amountPaidValue: Number(row.amount_paid_value ?? 0),
    balance: row.balance ?? null,
    balanceValue: Number(row.balance_value ?? 0),
    currency: row.currency ?? "",
    status: row.status ?? "—",
    statusCode: row.status_code ?? null,
    pdfUrl: row.pdf_url ?? null,
    period: row.period ?? null,
    periodStart: row.period_start ?? null,
    periodEnd: row.period_end ?? null,
    notes: row.notes ?? null,
    planName: row.plan_name ?? null,
    planCode: row.plan_code ?? null,
    lineItems: (row.line_items ?? []).map((item) => ({
      description: item.description ?? "",
      quantity: item.quantity ?? 1,
      unitPrice: item.unit_price ?? "—",
      total: item.total ?? "—",
    })),
    issuer: row.issuer
      ? {
          name: row.issuer.name ?? "",
          email: row.issuer.email ?? "",
          website: row.issuer.website ?? "",
        }
      : null,
    billTo: row.bill_to
      ? {
          name: row.bill_to.name ?? "",
          legalName: row.bill_to.legal_name ?? "",
          email: row.bill_to.email ?? "",
          phone: row.bill_to.phone ?? "",
          taxId: row.bill_to.tax_id ?? "",
          street: row.bill_to.street ?? "",
          city: row.bill_to.city ?? "",
          state: row.bill_to.state ?? "",
          postalCode: row.bill_to.postal_code ?? "",
          country: row.bill_to.country ?? "",
        }
      : null,
  };
}

export function useTenantInvoices() {
  const loading = ref(false);
  const downloadingId = ref(null);
  const error = ref("");
  const rows = ref([]);

  async function load() {
    loading.value = true;
    error.value = "";

    try {
      const data = await tenantInvoicesApiService.fetchInvoices();
      rows.value = (Array.isArray(data) ? data : []).map(mapInvoice);
    } catch (e) {
      error.value =
        e.response?.data?.message || "Unable to load invoices.";
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function downloadPdf(row) {
    if (!row?.id) return;
    downloadingId.value = row.id;
    error.value = "";

    try {
      const fallback = `${row.invoiceNumber || `invoice-${row.id}`}.pdf`;
      await tenantInvoicesApiService.downloadInvoicePdf(row.id, fallback);
    } catch (e) {
      error.value =
        e.message ||
        e.response?.data?.message ||
        "Unable to download invoice PDF.";
    } finally {
      downloadingId.value = null;
    }
  }

  return {
    loading,
    downloadingId,
    error,
    rows,
    load,
    downloadPdf,
  };
}

export function useTenantInvoiceDetail() {
  const loading = ref(false);
  const downloading = ref(false);
  const error = ref("");
  const invoice = ref(null);

  async function load(id) {
    loading.value = true;
    error.value = "";
    invoice.value = null;

    try {
      const data = await tenantInvoicesApiService.fetchInvoice(id);
      invoice.value = mapInvoice(data);
    } catch (e) {
      error.value =
        e.response?.data?.message || "Unable to load this invoice.";
      invoice.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function downloadPdf() {
    if (!invoice.value?.id) return;
    downloading.value = true;

    try {
      const fallback = `${invoice.value.invoiceNumber || `invoice-${invoice.value.id}`}.pdf`;
      await tenantInvoicesApiService.downloadInvoicePdf(
        invoice.value.id,
        fallback,
      );
    } catch (e) {
      error.value =
        e.message ||
        e.response?.data?.message ||
        "Unable to download invoice PDF.";
    } finally {
      downloading.value = false;
    }
  }

  return {
    loading,
    downloading,
    error,
    invoice,
    load,
    downloadPdf,
  };
}
