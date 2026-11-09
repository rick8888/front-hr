import { computed, ref } from "vue";
import { employeesApiService } from "../services/employees.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { usePaginatedSearch } from "../../../composables/usePaginatedSearch.js";
import { getVisiblePages } from "../../../composables/useLeaveRequestsTable.js";
import { t } from "../../../i18n/index.js";

function normalizeActivity(raw, index) {
  const eventTitle = raw?.event
    ? t(`admin.employees.activityEvents.${raw.event}`)
    : "";
  return {
    id: raw?.id ?? `activity-${index + 1}`,
    type: raw?.type || "status",
    title:
      eventTitle && eventTitle !== `admin.employees.activityEvents.${raw.event}`
        ? eventTitle
        : raw?.title || t("admin.employees.view.activity"),
    description: raw?.description || "",
    status: raw?.status || null,
    timestamp: raw?.timestamp || null,
  };
}

/**
 * Flux « Recent Activity » d'un employé (audit logs backend) avec pagination.
 */
export function useEmployeeActivities(options = {}) {
  const activities = ref([]);
  const loading = ref(false);
  const error = ref("");

  const {
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  } = usePaginatedSearch(activities, {
    pageSize: options.pageSize ?? 5,
    searchFields: ["title", "description", "status"],
  });

  const visiblePages = computed(() =>
    getVisiblePages(page.value, pageCount.value)
  );

  async function load(employeeId) {
    if (!employeeId) return;
    loading.value = true;
    error.value = "";
    page.value = 1;
    try {
      const list = await employeesApiService.fetchActivities(employeeId, {
        limit: 100,
      });
      activities.value = list.map(normalizeActivity);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.view.activityError");
      activities.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    activities,
    paginatedActivities: paginatedRows,
    loading,
    error,
    load,
    searchQuery,
    page,
    pageSize,
    totalFiltered,
    pageCount,
    rangeLabel,
    visiblePages,
  };
}
