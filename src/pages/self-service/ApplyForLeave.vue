<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHero :title="pageTitle" :breadcrumbs="breadcrumbs" />

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div class="lg:col-span-2">
          <LeaveApplicationForm
            :policies="policies"
            :initial="initialForm"
            :saving="saving"
            :loading="loading"
            :read-only="readOnly"
            :submit-label="submitLabel"
            @submit="onSubmit"
            @cancel="cancel"
          />
        </div>
        <div class="lg:col-span-1">
          <LeavePoliciesPanel
            :policies="policies"
            :loading="loading"
            :default-open-id="policies[0]?.id || ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PageHero from "../../components/common/PageHero.vue";
import LeaveApplicationForm from "../../components/self-service/LeaveApplicationForm.vue";
import LeavePoliciesPanel from "../../components/self-service/LeavePoliciesPanel.vue";
import { useApplyForLeave } from "./composables/useApplyForLeave.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();

const {
  policies,
  loading,
  saving,
  error,
  mode,
  readOnly,
  initialForm,
  submit,
  cancel,
} = useApplyForLeave();

const breadcrumbs = computed(() => {
  void locale.value;
  return [
    { label: t("ss.breadcrumb") },
    { label: t("ss.leaveRequests.title"), to: "/self-service/leave-requests" },
    { label: t("ss.leaveRequests.applyBreadcrumb") },
  ];
});

const pageTitle = computed(() => {
  void locale.value;
  if (mode.value === "view") return t("ss.leaveRequests.view");
  if (mode.value === "edit") return t("ss.leaveRequests.edit");
  return t("ss.applyLeave.title");
});

const submitLabel = computed(() => {
  void locale.value;
  return mode.value === "edit"
    ? t("ss.leaveRequests.save")
    : t("ss.leaveRequests.submit");
});

async function onSubmit(payload) {
  await submit(payload);
}
</script>
