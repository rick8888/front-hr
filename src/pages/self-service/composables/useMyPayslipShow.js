import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { parseApiError } from "../../../utils/apiErrors.js";
import { normalizePayslipDetail } from "./useMyPayslips.js";
import { payslipsApiService } from "../services/payslips.api.service.js";

export function useMyPayslipShow() {
  const route = useRoute();
  const payslip = ref(null);
  const employee = ref({ name: "—", department: "—", designation: "—" });
  const loading = ref(true);
  const downloading = ref(false);
  const error = ref("");

  let loadSeq = 0;

  async function load() {
    const id = route.params.id;
    if (id === undefined || id === null || String(id).trim() === "") {
      payslip.value = null;
      error.value = "Payslip not found.";
      loading.value = false;
      return;
    }

    const seq = ++loadSeq;
    loading.value = true;
    error.value = "";
    payslip.value = null;

    try {
      const raw = await payslipsApiService.fetchOne(id);
      if (seq !== loadSeq) return;

      if (!raw || raw.id === undefined || raw.id === null) {
        payslip.value = null;
        error.value = "Payslip not found.";
        return;
      }

      const detail = normalizePayslipDetail(raw);
      payslip.value = detail;
      employee.value = detail.employee || {
        name: "—",
        department: "—",
        designation: "—",
      };
    } catch (e) {
      if (seq !== loadSeq) return;
      const status = e?.response?.status;
      error.value =
        status === 403 || status === 404
          ? "Payslip not found."
          : parseApiError(e) || "Unable to load payslip.";
      payslip.value = null;
    } finally {
      if (seq === loadSeq) {
        loading.value = false;
      }
    }
  }

  async function onDownload() {
    if (!payslip.value?.id || downloading.value) return;
    downloading.value = true;
    error.value = "";
    try {
      const name = `${payslip.value.code || `payslip-${payslip.value.id}`}.pdf`;
      await payslipsApiService.downloadPdf(payslip.value.id, name);
    } catch (e) {
      error.value = parseApiError(e) || "Unable to download payslip PDF.";
    } finally {
      downloading.value = false;
    }
  }

  function formatAmount(value, currency = "USD") {
    const n = Number(value) || 0;
    const cur = payslip.value?.currency || currency || "USD";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: cur,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return `$${n.toFixed(2)}`;
    }
  }

  function statusClass(status) {
    if (status === "Approved") return "bg-sky-100 text-sky-700";
    if (status === "Paid") return "bg-emerald-100 text-emerald-700";
    if (status === "Pending") return "bg-amber-100 text-amber-700";
    if (status === "Rejected") return "bg-rose-100 text-rose-700";
    return "bg-neutral-100 text-neutral-700";
  }

  watch(
    () => route.params.id,
    () => {
      load();
    },
    { immediate: true }
  );

  return {
    payslip,
    employee,
    loading,
    downloading,
    error,
    load,
    onDownload,
    formatAmount,
    statusClass,
  };
}
