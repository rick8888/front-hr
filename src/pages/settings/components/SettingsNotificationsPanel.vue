<template>
  <div class="space-y-5">
    <div
      v-if="feedback"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ feedback }}
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <label
        v-for="item in items"
        :key="item.key"
        class="flex min-h-28 cursor-pointer items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-secondary-200 hover:bg-neutral-50/70 hover:shadow-md"
      >
        <span>
          <span class="block text-sm font-semibold text-neutral-900">{{ item.label }}</span>
          <span class="mt-1.5 block text-sm leading-5 text-neutral-500">{{ item.hint }}</span>
        </span>
        <input
          v-model="form[item.key]"
          type="checkbox"
          class="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
        />
      </label>
    </div>

    <div class="flex justify-end border-t border-neutral-100 pt-4">
      <button type="button" class="btn-primary text-sm" @click="save">
        {{ t("settings.notifications.save") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "../../../i18n/index.js";

const STORAGE_KEY = "settings-notifications";

const { t, locale } = useI18n();
const feedback = ref("");
const form = ref({
  email: true,
  payroll: true,
  attendance: false,
});

const items = computed(() => {
  void locale.value;
  return [
    {
      key: "email",
      label: t("settings.notifications.email"),
      hint: t("settings.notifications.emailHint"),
    },
    {
      key: "payroll",
      label: t("settings.notifications.payroll"),
      hint: t("settings.notifications.payrollHint"),
    },
    {
      key: "attendance",
      label: t("settings.notifications.attendance"),
      hint: t("settings.notifications.attendanceHint"),
    },
  ];
});

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
  feedback.value = t("settings.notifications.saved");
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) form.value = { ...form.value, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
});
</script>
