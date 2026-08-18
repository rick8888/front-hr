<template>
  <Modal
    :model-value="modelValue"
    :title="t('ss.attendance.detailsTitle')"
    size="lg"
    hide-footer
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="record" class="space-y-5">
      <div>
        <p class="mb-1 text-xs font-medium text-neutral-500">{{ t("common.date") }}</p>
        <p class="text-base font-semibold text-neutral-900">{{ longDate }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="mb-1.5 text-xs font-medium text-neutral-500">{{ t("ss.attendance.col.checkIn") }}</p>
          <span v-if="record.checkIn" class="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {{ record.checkIn }}
          </span>
          <span v-else class="text-sm text-neutral-400">--:--</span>
        </div>
        <div>
          <p class="mb-1.5 text-xs font-medium text-neutral-500">{{ t("ss.attendance.col.checkOut") }}</p>
          <span v-if="record.checkOut" class="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            {{ record.checkOut }}
          </span>
          <span v-else class="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-400">--:--</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="mb-1 text-xs font-medium text-neutral-500">{{ t("common.totalHours") }}</p>
          <p class="text-sm font-semibold text-neutral-900">{{ totalHoursLabel }}</p>
        </div>
        <div>
          <p class="mb-1 text-xs font-medium text-neutral-500">{{ t("common.overtime") }}</p>
          <p class="text-sm font-medium text-neutral-500">{{ record.overtime ?? "--" }}</p>
        </div>
      </div>

      <div>
        <p class="mb-1.5 text-xs font-medium text-neutral-500">{{ t("common.status") }}</p>
        <span :class="['inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', statusClass]">
          {{ tAttendanceStatus(record.status) }}
        </span>
      </div>

      <div class="pt-2">
        <p class="mb-2 text-sm font-semibold text-neutral-900">{{ t("ss.attendance.logsTitle") }}</p>
        <div class="overflow-hidden rounded-lg border border-neutral-200">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <th scope="col" class="px-4 py-2.5">{{ t("common.type") }}</th>
                <th scope="col" class="px-4 py-2.5">{{ t("common.time") }}</th>
                <th scope="col" class="px-4 py-2.5">{{ t("common.location") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, idx) in record.logs ?? []" :key="idx" class="border-t border-neutral-100">
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', logTypeClass(log.type)]">
                    {{ tLogType(log.type) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-neutral-700">{{ log.time }}</td>
                <td class="px-4 py-3 text-neutral-500">{{ log.location || t("common.notApplicable") }}</td>
              </tr>
              <tr v-if="!(record.logs ?? []).length">
                <td colspan="3" class="px-4 py-6 text-center text-sm text-neutral-500">
                  {{ t("ss.attendance.noLogs") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  record: { type: Object, default: null },
});

defineEmits(["update:modelValue"]);
const { t } = useI18n();

const STATUS_CLASSES = {
  "Checked in": "bg-secondary-50 text-secondary-700",
  Present: "bg-emerald-50 text-emerald-700",
  Absent: "bg-rose-50 text-rose-700",
  Late: "bg-amber-50 text-amber-700",
  "Half Day": "bg-sky-50 text-sky-700",
};

const LOG_TYPE_CLASSES = {
  "Check In": "bg-emerald-50 text-emerald-700",
  "Check Out": "bg-rose-50 text-rose-700",
};

function tAttendanceStatus(status) {
  const key = `ss.attendance.status.${String(status || "").replace(/\s+/g, "_")}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

function tLogType(type) {
  const key = `ss.attendance.log.${String(type || "").replace(/\s+/g, "_")}`;
  const translated = t(key);
  return translated === key ? type : translated;
}

const statusClass = computed(
  () => STATUS_CLASSES[props.record?.status] || "bg-neutral-100 text-neutral-700",
);

function logTypeClass(type) {
  return LOG_TYPE_CLASSES[type] || "bg-neutral-100 text-neutral-700";
}

const longDate = computed(() => {
  if (!props.record) return "";
  const { day, date } = props.record;
  if (!date) return day || "";
  const stripped = date.replace(/\b0(\d)/g, "$1");
  return day ? `${day}, ${stripped}` : stripped;
});

const totalHoursLabel = computed(() => {
  const m = Number(props.record?.totalMinutes) || 0;
  if (m === 0) return t("ss.attendance.hoursLabel", { h: 0 });
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (r === 0) return t("ss.attendance.hoursLabel", { h });
  return t("ss.attendance.hoursMinutes", { h, m: r });
});
</script>
