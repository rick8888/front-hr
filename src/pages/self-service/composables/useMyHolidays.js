import { computed, onMounted, ref } from "vue";
import { holidaysApiService } from "../../holidays/services/holidays.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  computeMyHolidaysKpis,
  groupByMonth,
  listUpcoming,
} from "../../../data/myHolidaysDemo.js";
import { useI18n } from "../../../i18n/index.js";

export function normalizeMyHoliday(raw = {}) {
  return {
    id: raw.id,
    name: raw.name || "—",
    date: raw.date || "",
    notes: raw.description ?? raw.notes ?? "",
    type: raw.type || "",
    category: raw.category || "",
    color: raw.color || null,
    halfDay: !!(raw.half_day ?? raw.halfDay),
    optionalHoliday: !!(raw.optional_holiday ?? raw.optionalHoliday),
  };
}

export function useMyHolidays(options = {}) {
  const { t, locale, bcp47 } = useI18n();
  const today =
    options.today || new Date().toISOString().slice(0, 10);
  const year = ref(
    options.year ?? Number(String(today).slice(0, 4))
  );

  const records = ref([]);
  const loading = ref(true);
  const error = ref("");

  const kpis = computed(() =>
    computeMyHolidaysKpis(records.value, today)
  );
  const upcomingItems = computed(() => {
    void locale.value;
    return listUpcoming(records.value, today, 4, bcp47.value);
  });
  const monthGroups = computed(() => {
    void locale.value;
    return groupByMonth(records.value, bcp47.value);
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await holidaysApiService.fetchAll({ year: year.value });
      records.value = list.map(normalizeMyHoliday);
    } catch (e) {
      error.value =
        parseApiError(e) || t("common.error");
      records.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadData);

  return {
    today,
    year,
    records,
    loading,
    error,
    kpis,
    upcomingItems,
    monthGroups,
    loadData,
  };
}
