import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { tenantProfileApiService } from "../services/tenant-profile.api.service.js";
import { complianceObligationApiService } from "../../sup-admin/declarations/services/compliance-obligation.api.service.js";
import { computeAllDeadlines } from "../../../data/compliance-obligation/deadlines.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";
import { complianceDeclarationReportApiService } from "../services/compliance-declaration-report.api.service.js";

export const useMyDeadlinesStore = defineStore("myDeadlines", () => {
  const company = ref(null);
  const obligations = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const typeFilter = ref("all");
  const reportPeriod = ref(currentPeriod());
  const report = ref(null);
  const reportLoading = ref(false);
  const reportError = ref(null);
  const pdfLoading = ref(false);
  const paymentUpdating = ref({});

  const deadlines = computed(() => computeAllDeadlines(obligations.value));

  const filteredDeadlines = computed(() => {
    if (typeFilter.value === "all") return deadlines.value;
    return deadlines.value.filter((d) => d.type === typeFilter.value);
  });

  const overdueCount = computed(
    () => deadlines.value.filter((d) => d.status === "overdue").length
  );

  const dueSoonCount = computed(
    () => deadlines.value.filter((d) => d.status === "due_soon" || d.status === "grace").length
  );

  const thisMonthCount = computed(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return deadlines.value.filter((d) => d.due_date.startsWith(ym)).length;
  });

  async function loadReport() {
    if (!company.value) return;
    reportLoading.value = true;
    reportError.value = null;
    try {
      report.value = await complianceDeclarationReportApiService.fetchReport(reportPeriod.value);
    } catch (e) {
      reportError.value = parseApiError(e);
      report.value = null;
    } finally {
      reportLoading.value = false;
    }
  }

  async function downloadReportPdf() {
    if (!company.value || pdfLoading.value) return;
    pdfLoading.value = true;
    reportError.value = null;
    try {
      await complianceDeclarationReportApiService.downloadPdf(reportPeriod.value);
    } catch (e) {
      reportError.value = parseApiError(e);
    } finally {
      pdfLoading.value = false;
    }
  }

  async function updateDeclarationPayment(row) {
    if (!company.value || paymentUpdating.value[row.id]) return;
    paymentUpdating.value = { ...paymentUpdating.value, [row.id]: true };
    reportError.value = null;
    try {
      await complianceDeclarationReportApiService.updatePayment({
        period: reportPeriod.value,
        obligationId: row.id,
        isPaid: !row.payment?.is_paid,
      });
      await loadReport();
    } catch (e) {
      reportError.value = parseApiError(e);
    } finally {
      const updating = { ...paymentUpdating.value };
      delete updating[row.id];
      paymentUpdating.value = updating;
    }
  }

  async function init({ tenantPortal = true } = {}) {
    loading.value = true;
    error.value = null;
    try {
      if (tenantPortal) {
        const profile = await tenantProfileApiService.fetchProfile();
        const data = profile?.data ?? profile ?? {};
        company.value = {
          name: data.company_name ?? null,
          country: data.country ?? null,
          country_id: data.country_id ?? null,
          is_active: data.account_status === "Active",
        };
      } else {
        const authStore = useAuthStore();
        company.value = {
          name: authStore.user?.company ?? null,
          country: null,
          country_id: null,
          is_active: true,
        };
      }

      if (tenantPortal && !company.value?.country_id) {
        obligations.value = [];
        return;
      }

      obligations.value = await complianceObligationApiService.fetchObligations({
        ...(company.value.country_id
          ? { country_id: company.value.country_id }
          : {}),
        is_active: true,
      });
      await loadReport();
    } catch (e) {
      error.value = parseApiError(e);
      obligations.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    company,
    obligations,
    deadlines,
    filteredDeadlines,
    overdueCount,
    dueSoonCount,
    thisMonthCount,
    reportPeriod,
    report,
    reportLoading,
    reportError,
    pdfLoading,
    paymentUpdating,
    loadReport,
    downloadReportPdf,
    updateDeclarationPayment,
    typeFilter,
    loading,
    error,
    init,
  };
});

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
