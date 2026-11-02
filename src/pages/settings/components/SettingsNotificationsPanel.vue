<template>
  <div class="max-w-xl space-y-4">
    <div
      v-if="feedback"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ feedback }}
    </div>

    <label
      v-for="item in items"
      :key="item.key"
      class="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50/80"
    >
      <span>
        <span class="block text-sm font-medium text-neutral-900">{{ item.label }}</span>
        <span class="mt-0.5 block text-xs text-neutral-500">{{ item.hint }}</span>
      </span>
      <input
        v-model="form[item.key]"
        type="checkbox"
        class="mt-0.5 h-4 w-4 rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
      />
    </label>

    <div class="flex justify-end pt-2">
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
