import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "../../../i18n/index.js";
import { payrollApiService } from "../services/payroll.api.service.js";
import { mapPayrollShowFromApi } from "../mappers/payroll-show.mapper.js";
import { PAYROLL_STATUS_UI } from "../mappers/payroll-record.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";

const TIMELINE_STORAGE_KEY = (id) => `payroll:timeline:${String(id)}`;

/**
 * Fiche bulletin `/payroll/show/:id` — API · mapping · actions.
 */
export function usePayrollShow() {
  const route = useRoute();
  const router = useRouter();
  const { t, bcp47 } = useI18n();
  const authStore = useAuthStore();

  const detail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const actionFeedback = ref("");
  let actionFeedbackTimer = null;

  const timeline = ref([]);

  const recalcLoading = ref(false);
  const approveLoading = ref(false);
  const markPaidLoading = ref(false);
  const rejectLoading = ref(false);

  const rejectReason = ref("");
  const rejectValidationError = ref("");
  const downloadingPdf = ref(false);

  const payrollId = computed(() => Number(route.params.id));

  const displayStatus = computed(() => detail.value?.status ?? "pending");
  const payrollApproved = computed(
    () => displayStatus.value === "approved" || displayStatus.value === "paid"
  );
  const payrollRejected = computed(() => displayStatus.value === "cancelled");
  const markPaidDone = computed(() => displayStatus.value === "paid");

  const salaryDisplay = computed(() => {
    const d = detail.value;
    if (!d) return { gross: 0, totalDeductions: 0, net: 0 };
    return {
      gross: d.grossSalary,
      totalDeductions: d.totalDeductions,
      net: d.netSalary,
    };
  });

  function currentActorName() {
    const n = authStore.user?.name?.trim();
    return n || "Guest";
  }

  function formatTimelineAt() {
    return new Date().toLocaleString(bcp47.value || "fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function loadTimeline() {
    try {
      const raw = sessionStorage.getItem(TIMELINE_STORAGE_KEY(route.params.id));
      timeline.value = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(timeline.value)) timeline.value = [];
    } catch {
      timeline.value = [];
    }
  }

  function saveTimeline() {
    try {
      sessionStorage.setItem(
        TIMELINE_STORAGE_KEY(route.params.id),
        JSON.stringify(timeline.value)
      );
    } catch {
      /* ignore */
    }
  }

  function pushTimeline(title, note = null) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: formatTimelineAt(),
      title,
      actor: currentActorName(),
      detail: note,
    };
    timeline.value = [entry, ...timeline.value].slice(0, 50);
    saveTimeline();
  }

  function logTimelineNav(title) {
    pushTimeline(title);
  }

  function flash(message) {
    actionFeedback.value = message;
    if (actionFeedbackTimer) clearTimeout(actionFeedbackTimer);
    actionFeedbackTimer = setTimeout(() => {
      actionFeedback.value = "";
      actionFeedbackTimer = null;
    }, 4000);
  }

  function applyRaw(raw) {
    detail.value = mapPayrollShowFromApi(raw, bcp47.value);
  }

  async function load() {
    const id = payrollId.value;
    if (!Number.isFinite(id) || id <= 0) {
      detail.value = null;
      error.value = t("admin.payroll.show.notFoundHint");
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const raw = await payrollApiService.fetchById(id);
      applyRaw(raw);
      if (!detail.value) {
        error.value = t("admin.payroll.show.notFoundHint");
      }
    } catch (e) {
      detail.value = null;
      error.value = parseApiError(e) || t("admin.payroll.show.notFoundHint");
    } finally {
      loading.value = false;
    }
  }

  async function patchStatus(status, reason = null) {
    const id = payrollId.value;
    const raw = await payrollApiService.updateStatus(id, {
      status,
      reason: reason || undefined,
    });
    applyRaw(raw);
  }

  async function recalculate() {
    const d = detail.value;
    if (!d?.employeeId || !d.periodKey) return false;
    recalcLoading.value = true;
    error.value = null;
    try {
      const raw = await payrollApiService.generate({
        employee_id: d.employeeId,
        period: d.periodKey,
      });
      applyRaw(raw);
      if (raw?.id && Number(raw.id) !== payrollId.value) {
        await router.replace(`/payroll/show/${raw.id}`);
      }
      pushTimeline(t("admin.payroll.show.timeline.recalculated"));
      return true;
    } catch (e) {
      error.value = parseApiError(e);
      return false;
    } finally {
      recalcLoading.value = false;
    }
  }

  async function approve() {
    approveLoading.value = true;
    error.value = null;
    try {
      await patchStatus("validated");
      pushTimeline(t("admin.payroll.show.timeline.approved"));
      return true;
    } catch (e) {
      error.value = parseApiError(e);
      return false;
    } finally {
      approveLoading.value = false;
    }
  }

  async function reject() {
    const reason = rejectReason.value.trim();
    if (!reason) {
      rejectValidationError.value = t("admin.payroll.show.rejectRequired");
      return false;
    }
    rejectValidationError.value = "";
    rejectLoading.value = true;
    error.value = null;
    try {
      await patchStatus("cancelled", reason);
      pushTimeline(t("admin.payroll.show.timeline.rejected"), reason);
      rejectReason.value = "";
      return true;
    } catch (e) {
      error.value = parseApiError(e);
      return false;
    } finally {
      rejectLoading.value = false;
    }
  }

  async function markPaid() {
    markPaidLoading.value = true;
    error.value = null;
    try {
      await patchStatus("paid");
      pushTimeline(t("admin.payroll.show.timeline.paid"));
      flash(t("admin.payroll.show.paidFeedback"));
      return true;
    } catch (e) {
      error.value = parseApiError(e);
      return false;
    } finally {
      markPaidLoading.value = false;
    }
  }

  async function cancelApproval() {
    error.value = null;
    try {
      await patchStatus("computed", t("admin.payroll.show.cancelNote"));
      pushTimeline(
        t("admin.payroll.show.timeline.cancelled"),
        t("admin.payroll.show.cancelNote")
      );
      return true;
    } catch (e) {
      error.value = parseApiError(e);
      return false;
    }
  }

  async function downloadPdf() {
    const d = detail.value;
    if (!d?.id || downloadingPdf.value) return false;
    downloadingPdf.value = true;
    error.value = null;
    try {
      const name = `fiche-de-paie-${d.empCode || d.id}-${d.periodKey || d.id}.pdf`;
      await payrollApiService.downloadPdf(d.id, name);
      pushTimeline(t("admin.payroll.show.timeline.downloadPayslip"));
      return true;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.payroll.show.downloadError");
      return false;
    } finally {
      downloadingPdf.value = false;
    }
  }

  function statusLabel(key) {
    const translated = t(`admin.payroll.status.${key}`);
    if (translated !== `admin.payroll.status.${key}`) return translated;
    return key;
  }

  function statusBadgeClass(key) {
    return PAYROLL_STATUS_UI[key]?.badge ?? "bg-neutral-100 text-neutral-700";
  }

  function clearTimers() {
    if (actionFeedbackTimer) clearTimeout(actionFeedbackTimer);
  }

  watch(
    () => route.params.id,
    () => {
      loadTimeline();
      load();
    },
    { immediate: true }
  );

  watch(
    () => detail.value?.employeeName,
    (name) => {
      document.title = name
        ? `${t("admin.payroll.show.title")} — ${name}`
        : t("admin.payroll.show.title");
    },
    { immediate: true }
  );

  return {
    detail,
    loading,
    error,
    actionFeedback,
    timeline,
    displayStatus,
    payrollApproved,
    payrollRejected,
    markPaidDone,
    salaryDisplay,
    recalcLoading,
    approveLoading,
    markPaidLoading,
    rejectLoading,
    rejectReason,
    rejectValidationError,
    downloadingPdf,
    load,
    recalculate,
    approve,
    reject,
    markPaid,
    cancelApproval,
    downloadPdf,
    pushTimeline,
    logTimelineNav,
    flash,
    statusLabel,
    statusBadgeClass,
    clearTimers,
  };
}
