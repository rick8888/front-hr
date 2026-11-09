import { ref } from "vue";
import { tenantBillingsApiService } from "../pages/tenant/services/tenant-billings.api.service.js";
import { t } from "../i18n/index.js";

export function formatBillingDate(iso, locale = "en") {
  if (!iso) return "";
  const raw = String(iso).slice(0, 10);
  const date = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
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
        e.response?.data?.message || t("tenant.billings.loadError");
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
