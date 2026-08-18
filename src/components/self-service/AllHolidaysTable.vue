<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">{{ title }}</h2>
    </header>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-neutral-100 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="px-5 py-3 md:px-6"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-neutral-500">
              {{ t("common.loading") }}
            </td>
          </tr>
          <tr v-else-if="!sortedRows.length">
            <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-neutral-500">
              {{ t("ss.holidays.emptyForTitle", { title }) }}
            </td>
          </tr>
          <tr
            v-for="row in sortedRows"
            v-else
            :key="row.id"
            class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40"
          >
            <td class="px-5 py-3.5 md:px-6 align-middle text-sm text-neutral-800">
              {{ row.name }}
            </td>
            <td class="px-5 py-3.5 md:px-6 align-middle text-sm text-neutral-700">
              {{ formatDate(row.date) }}
            </td>
            <td class="px-5 py-3.5 md:px-6 align-middle text-sm text-neutral-700">
              {{ dayName(row.date, bcp47) }}
            </td>
            <td class="px-5 py-3.5 md:px-6 align-middle text-sm text-neutral-500">
              {{ row.notes || "-" }}
            </td>
            <td class="px-5 py-3.5 md:px-6 align-middle">
              <span
                :class="['inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium', statusClass(row)]"
              >
                {{ statusLabel(row) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import {
  daysBetween,
  dayName,
  parseIso,
} from "../../data/myHolidaysDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  rows: { type: Array, required: true },
  title: { type: String, default: "All Holidays" },
  today: { type: String, required: true },
  loading: { type: Boolean, default: false },
});

const { t, locale, bcp47 } = useI18n();

const columns = computed(() => {
  void locale.value;
  return [
    { key: "holiday", label: t("ss.holidays.col.holiday") },
    { key: "date", label: t("common.date") },
    { key: "day", label: t("common.day") },
    { key: "notes", label: t("ss.holidays.col.notes") },
    { key: "status", label: t("common.status") },
  ];
});

const sortedRows = computed(() =>
  [...props.rows].sort((a, b) => (a.date < b.date ? -1 : 1)),
);

function formatDate(iso) {
  const d = parseIso(iso);
  if (!d) return iso;
  return d.toLocaleDateString(bcp47.value, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function isPast(row) {
  return daysBetween(props.today, row.date) < 0;
}

function statusLabel(row) {
  return isPast(row) ? t("ss.holidays.status.past") : t("ss.holidays.status.upcomingLabel");
}

function statusClass(row) {
  return isPast(row)
    ? "bg-neutral-100 text-neutral-600"
    : "bg-sky-100 text-sky-700";
}
</script>
