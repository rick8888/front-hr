import { ref } from "vue";
import { tenantBillingsApiService } from "../pages/tenant/services/tenant-billings.api.service.js";

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

export function formatBillingDate(iso) {
  if (!iso) return "";
  const raw = String(iso).slice(0, 10);
  const d = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${SHORT_MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

function mapKpis(apiKpis) {
  return {
    paid: apiKpis?.paid ?? "—",
    paidValue: Number(apiKpis?.paid_value ?? 0),
    pending: apiKpis?.pending ?? "—",
    pendingValue: Number(apiKpis?.pending_value ?? 0),
    count: Number(apiKpis?.count ?? 0),
    currency: apiKpis?.currency ?? "USD",
  };
}

function mapPayment(row) {
  return {
    id: row.id,
    invoiceId: row.invoice_id ?? row.id,
    paymentId: row.payment_id,
    date: row.date,
    description: row.description ?? "",
    amount: row.amount ?? "—",
    amountValue: Number(row.amount_value ?? 0),
    currency: row.currency ?? "",
    status: row.status ?? "—",
    statusCode: row.status_code ?? null,
    invoiceNumber: row.invoice_number ?? null,
  };
}

export function useTenantBillings() {
  const loading = ref(false);
  const error = ref("");
  const kpis = ref(mapKpis(null));
  const rows = ref([]);

  async function load() {
    loading.value = true;
    error.value = "";

    try {
      const data = await tenantBillingsApiService.fetchBillings();
      kpis.value = mapKpis(data.kpis);
      rows.value = (data.payments ?? []).map(mapPayment);
    } catch (e) {
      error.value =
        e.response?.data?.message || "Unable to load billing data.";
      kpis.value = mapKpis(null);
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    kpis,
    rows,
    load,
  };
}
