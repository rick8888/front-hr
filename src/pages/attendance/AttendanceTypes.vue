<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <PageHero
      :title="t('admin.attendance.types.title')"
      :breadcrumbs="breadcrumbs"
    />

    <p class="mb-6 -mt-2 text-sm text-neutral-500">
      {{ t("admin.attendance.types.hint") }}
    </p>

    <AttendanceTypesSettingsPanel />
  </div>
</template>

<script setup>
import { computed } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import AttendanceTypesSettingsPanel from "../sup-admin/parametres/components/AttendanceTypesSettingsPanel.vue";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("admin.attendance.breadcrumb"), to: "/attendance" },
    { label: t("admin.attendance.types.title") },
  ];
});
</script>
