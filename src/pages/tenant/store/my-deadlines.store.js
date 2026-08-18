import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { companiesApiService } from "../../sup-admin/entreprises/services/companies.api.service.js";
import { complianceObligationApiService } from "../../sup-admin/declarations/services/compliance-obligation.api.service.js";
import { computeAllDeadlines } from "../../../data/compliance-obligation/deadlines.js";
import { parseApiError } from "../../../utils/apiErrors.js";

export const useMyDeadlinesStore = defineStore("myDeadlines", () => {
  const company = ref(null);
  const obligations = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const typeFilter = ref("all");

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

  async function init() {
    loading.value = true;
    error.value = null;
    try {
      const companies = await companiesApiService.fetchCompanies();
      const list = Array.isArray(companies) ? companies : [];
      company.value = list.find((c) => c.is_active) ?? list[0] ?? null;

      if (!company.value?.country_id) {
        obligations.value = [];
        return;
      }

      obligations.value = await complianceObligationApiService.fetchObligations({
        country_id: company.value.country_id,
        is_active: true,
      });
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
    typeFilter,
    loading,
    error,
    init,
  };
});
