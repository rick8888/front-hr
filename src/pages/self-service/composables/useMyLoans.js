import { computed, onMounted, ref } from "vue";
import { loansApiService } from "../services/loans.api.service.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { catalogStatusLabel } from "../../../stores/entityStatusCatalog.store.js";

export const MY_LOAN_TYPES = [
  { value: "personal", label: "Personal Loan", interestRate: 12 },
  { value: "home", label: "Home Loan", interestRate: 7.5 },
  { value: "education", label: "Education Loan", interestRate: 9 },
  { value: "vehicle", label: "Vehicle Loan", interestRate: 10 },
  { value: "medical", label: "Medical Loan", interestRate: 8 },
  { value: "emergency", label: "Emergency Loan", interestRate: 6 },
];

const TYPE_LABEL = Object.fromEntries(
  MY_LOAN_TYPES.map((t) => [t.value, t.label])
);

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  closed: "Closed",
};

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function formatAmount(value, currency = "USD") {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export function calculateEmi(principal, annualRate, months) {
  const p = Number(principal) || 0;
  const r = (Number(annualRate) || 0) / 100 / 12;
  const n = Number(months) || 0;
  if (p <= 0 || n <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }
  const emi =
    r === 0
      ? p / n
      : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;
  return {
    emi: round2(emi),
    totalInterest: round2(totalInterest),
    totalPayment: round2(totalPayment),
  };
}

export function computeMyLoansKpis(rows = []) {
  let activeLoans = 0;
  let totalOutstanding = 0;
  let nextEmi = 0;
  let pendingRequests = 0;

  rows.forEach((r) => {
    if (r.statusValue === "active" || r.status === "Active") {
      activeLoans += 1;
      totalOutstanding += Number(r.outstanding) || 0;
      nextEmi += Number(r.emi) || 0;
    } else if (r.statusValue === "pending" || r.status === "Pending") {
      pendingRequests += 1;
    }
  });

  return {
    activeLoans,
    totalOutstanding: round2(totalOutstanding),
    nextEmi: round2(nextEmi),
    pendingRequests,
  };
}

function resolveDocUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function normalizeLoan(raw = {}) {
  const typeValue = String(raw.type || "").toLowerCase();
  const statusValue = String(raw.status || "pending").toLowerCase();
  const documents = Array.isArray(raw.documents)
    ? raw.documents.map((d) => ({
        path: d.path ?? d,
        url: resolveDocUrl(d.url ?? d),
      }))
    : [];

  return {
    id: raw.id,
    code: raw.code || `LN-${raw.id}`,
    typeValue,
    type: typeValue,
    typeLabel: TYPE_LABEL[typeValue] || raw.type || "—",
    amount: Number(raw.amount ?? 0),
    currency: raw.currency || "USD",
    interestRate: Number(raw.interest_rate ?? raw.interestRate ?? 0),
    tenure: Number(raw.tenure_months ?? raw.tenureMonths ?? raw.tenure ?? 0),
    emi: Number(raw.emi ?? 0),
    outstanding:
      raw.outstanding != null ? Number(raw.outstanding) : null,
    statusValue,
    status: catalogStatusLabel(
      "loans",
      statusValue,
      STATUS_LABEL[statusValue] || statusValue
    ),
    purpose: raw.purpose ?? "",
    notes: raw.notes ?? "",
    disbursementDate:
      raw.disbursement_date ?? raw.disbursementDate ?? "",
    repaymentStartDate:
      raw.repayment_start_date ?? raw.repaymentStartDate ?? "",
    appliedOn: raw.applied_on ?? raw.appliedOn ?? "",
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
    documents,
  };
}

export function useMyLoans() {
  const records = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const cancelBusy = ref(false);
  const error = ref("");

  const {
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  } = usePaginatedSearch(records, {
    pageSize: 10,
    searchFields: ["code", "type", "typeLabel", "status"],
  });

  const kpis = computed(() => computeMyLoansKpis(records.value));

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await loansApiService.fetchAll({ mine: 1 });
      records.value = list.map(normalizeLoan);
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger vos demandes de prêt.";
      records.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createLoan(payload) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await loansApiService.create(payload);
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de soumettre la demande de prêt.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function cancelLoan(row) {
    if (!row?.id || cancelBusy.value) return false;
    cancelBusy.value = true;
    error.value = "";
    try {
      await loansApiService.remove(row.id);
      records.value = records.value.filter((r) => r.id !== row.id);
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d’annuler cette demande de prêt.";
      return false;
    } finally {
      cancelBusy.value = false;
    }
  }

  onMounted(loadData);

  return {
    loading,
    saving,
    cancelBusy,
    error,
    kpis,
    loanTypes: MY_LOAN_TYPES,
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    formatAmount,
    createLoan,
    cancelLoan,
    loadData,
  };
}
