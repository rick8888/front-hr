import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { payslipsApiService } from "../services/payslips.api.service.js";

export const MY_PAYSLIP_STATUS_OPTIONS = ["Approved", "Pending", "Paid", "Rejected"];

function formatPeriodLabel(period) {
  if (!period) return "—";
  const [y, m] = String(period).split("-").map(Number);
  if (!y || !m) return String(period);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function buildPeriodOptions(rows = []) {
  const years = new Set();
  const quarters = new Set();
  rows.forEach((r) => {
    if (!r.period || r.period.length < 7) return;
    const year = r.period.slice(0, 4);
    const month = Number(r.period.slice(5, 7));
    years.add(year);
    if (month >= 1 && month <= 12) {
      const q = Math.ceil(month / 3);
      quarters.add(`${year}-Q${q}`);
    }
  });

  const yearOpts = [...years]
    .sort((a, b) => b.localeCompare(a))
    .map((y) => ({ value: y, label: `Year ${y}` }));
  const quarterOpts = [...quarters]
    .sort((a, b) => b.localeCompare(a))
    .map((q) => {
      const [y, part] = q.split("-");
      return { value: q, label: `${part} ${y}` };
    });

  return [...yearOpts, ...quarterOpts];
}

export function normalizePayslipListItem(raw = {}) {
  const period = raw.period || "";
  return {
    id: raw.id,
    code: raw.code || `PSLIP-${raw.id}`,
    period,
    periodLabel: raw.period_label || raw.periodLabel || formatPeriodLabel(period),
    basicSalary: Number(raw.basic_salary ?? raw.basicSalary ?? 0),
    allowances: Number(raw.allowances ?? 0),
    totalEarnings: Number(raw.total_earnings ?? raw.totalEarnings ?? 0),
    deductions: Number(raw.deductions ?? raw.total_deductions ?? 0),
    netSalary: Number(raw.net_salary ?? raw.netSalary ?? 0),
    currency: raw.currency || "USD",
    status: raw.status || "Pending",
    statusCode: raw.status_code || raw.statusCode || null,
    paidOn: raw.paid_on ?? raw.paidOn ?? null,
    notes: raw.notes || null,
  };
}

export function normalizePayslipDetail(raw = {}) {
  const base = normalizePayslipListItem(raw);
  const emp = raw.employee || {};

  const attendanceSrc = raw.attendance || {};
  const attendance = {
    workingDays: Number(attendanceSrc.working_days ?? attendanceSrc.workingDays ?? 0),
    workedDays: Number(attendanceSrc.worked_days ?? attendanceSrc.workedDays ?? 0),
    leaveDays: Number(attendanceSrc.leave_days ?? attendanceSrc.leaveDays ?? 0),
    absentDays: Number(attendanceSrc.absent_days ?? attendanceSrc.absentDays ?? 0),
    lateDays: Number(attendanceSrc.late_days ?? attendanceSrc.lateDays ?? 0),
    earlyCheckoutDays: Number(
      attendanceSrc.early_checkout_days ?? attendanceSrc.earlyCheckoutDays ?? 0
    ),
    overtimeDays: Number(attendanceSrc.overtime_days ?? attendanceSrc.overtimeDays ?? 0),
    holidays: Number(attendanceSrc.holidays ?? 0),
  };

  const deductionDetails = (raw.deduction_details || raw.deductionDetails || []).map((d) => ({
    label: d.label || d.code || "—",
    amount: Number(d.amount) || 0,
  }));

  const earnings = (raw.earnings || []).map((e) => ({
    label: e.label || e.code || "—",
    amount: Number(e.amount) || 0,
  }));

  return {
    ...base,
    notes: raw.notes || `Payslip for ${base.periodLabel}`,
    deductionDetails,
    earnings,
    attendance,
    employee: {
      name: emp.name || "—",
      department: emp.department || "—",
      designation: emp.designation || emp.job_title || "—",
      matricule: emp.matricule || "",
    },
  };
}

export function computeMyPayslipsKpis(rows = [], apiKpis = null) {
  if (apiKpis && typeof apiKpis === "object") {
    return {
      total: Number(apiKpis.total) || 0,
      paid: Number(apiKpis.paid) || 0,
      pending: Number(apiKpis.pending) || 0,
      lastPayment: apiKpis.last_payment ?? apiKpis.lastPayment ?? null,
    };
  }

  let total = 0;
  let paid = 0;
  let pending = 0;
  let lastPayment = null;

  rows.forEach((r) => {
    total += 1;
    if (r.status === "Paid") {
      paid += 1;
      if (r.paidOn && (!lastPayment || r.paidOn > lastPayment)) {
        lastPayment = r.paidOn;
      }
    } else if (r.status === "Pending" || r.status === "Approved") {
      pending += 1;
    }
  });

  return { total, paid, pending, lastPayment };
}

function matchesPeriodFilter(rowPeriod, filterValue) {
  if (!filterValue) return true;
  if (/^\d{4}$/.test(filterValue)) {
    return String(rowPeriod).startsWith(filterValue);
  }
  if (/^\d{4}-Q[1-4]$/.test(filterValue)) {
    const [year, q] = filterValue.split("-Q");
    if (!String(rowPeriod).startsWith(year)) return false;
    const month = Number(String(rowPeriod).slice(5, 7));
    const start = (Number(q) - 1) * 3 + 1;
    return month >= start && month <= start + 2;
  }
  return rowPeriod === filterValue;
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(String(iso).slice(0, 10) + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function useMyPayslips() {
  const router = useRouter();
  const records = ref([]);
  const loading = ref(true);
  const downloadingId = ref(null);
  const error = ref("");
  const apiKpis = ref(null);
  const employee = ref(null);

  const {
    filters,
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  } = usePaginatedSearch(records, {
    pageSize: 10,
    searchFields: ["code", "periodLabel", "status"],
    initialFilters: { period: "", status: "", dateFrom: "", dateTo: "" },
    customFilter: (row, f) => {
      if (f.status && row.status !== f.status) return false;
      if (f.period && !matchesPeriodFilter(row.period, f.period)) return false;
      if (f.dateFrom && row.period < String(f.dateFrom).slice(0, 7)) return false;
      if (f.dateTo && row.period > String(f.dateTo).slice(0, 7)) return false;
      return true;
    },
  });

  const filtersModel = computed({
    get: () => ({ ...filters }),
    set: (next) => Object.assign(filters, next),
  });

  const periodOptions = computed(() => buildPeriodOptions(records.value));
  const statusOptions = MY_PAYSLIP_STATUS_OPTIONS;

  const kpis = computed(() => {
    const base = computeMyPayslipsKpis(records.value, apiKpis.value);
    return {
      ...base,
      lastPaymentLabel: base.lastPayment ? formatDate(base.lastPayment) : "-",
    };
  });

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const data = await payslipsApiService.fetchAll();
      apiKpis.value = data.kpis || null;
      employee.value = data.employee || null;
      records.value = (data.items || []).map(normalizePayslipListItem);
    } catch (e) {
      error.value = parseApiError(e) || "Unable to load payslips.";
      records.value = [];
      apiKpis.value = null;
    } finally {
      loading.value = false;
    }
  }

  function onViewRow(row) {
    router.push({ name: "SelfServicePayslipShow", params: { id: row.id } });
  }

  async function onDownloadRow(row) {
    if (!row?.id || downloadingId.value) return;
    downloadingId.value = row.id;
    error.value = "";
    try {
      const name = `${row.code || `payslip-${row.id}`}.pdf`;
      await payslipsApiService.downloadPdf(row.id, name);
    } catch (e) {
      error.value = parseApiError(e) || "Unable to download payslip PDF.";
    } finally {
      downloadingId.value = null;
    }
  }

  onMounted(load);

  return {
    loading,
    error,
    downloadingId,
    employee,
    kpis,
    filtersModel,
    periodOptions,
    statusOptions,
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    load,
    onViewRow,
    onDownloadRow,
  };
}
