<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <ProfileHero :identity="profile.identity" :loading="loading" />

      <nav class="flex items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-secondary-500 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100',
          ]"
          @click="activeTab = tab.id"
        >
          <ProfileIcon :name="tab.icon" size="sm" />
          {{ tab.label }}
        </button>
      </nav>

      <div
        v-if="activeTab === 'profile'"
        class="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div class="lg:col-span-4 space-y-6">
          <ProfileInfoCard :sections="leftSections" :loading="loading" />
          <ProfileInfoCard :sections="workSections" :loading="loading" />
        </div>

        <div class="lg:col-span-8 space-y-6">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ProfileKpiTile
              v-for="kpi in profile.kpis"
              :key="kpi.id"
              :icon="kpi.icon"
              :value="kpi.value"
              :label="kpi.label"
              :tone="kpi.tone"
              :loading="loading"
            />
          </div>

          <ProfileAccountDetails :items="accountItems" :loading="loading" />

          <ProfileActivityFeed
            :activities="profile.activities"
            :total="profile.activitiesTotal"
            :loading="loading"
          />
        </div>
      </div>

      <section
        v-else-if="activeTab === 'security'"
        class="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 sm:p-6 max-w-2xl"
      >
        <h2 class="text-lg font-semibold text-neutral-900 mb-6">{{ t("ss.profile.security.title") }}</h2>

        <div
          v-if="passwordError"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ passwordError }}
        </div>
        <div
          v-else-if="passwordSuccess"
          class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {{ passwordSuccess }}
        </div>

        <div class="space-y-4">
          <div v-for="field in securityFields" :key="field.key">
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">
              {{ field.label }}
            </label>
            <input
              v-model="passwordForm[field.key]"
              type="password"
              autocomplete="off"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              :placeholder="field.placeholder"
              :disabled="savingPassword"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            :disabled="savingPassword"
            @click="resetPasswordForm"
          >
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            :disabled="savingPassword"
            @click="onUpdatePassword"
          >
            {{ savingPassword ? t("ss.profile.security.updating") : t("ss.profile.security.updatePassword") }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ProfileHero from "../components/profile/ProfileHero.vue";
import ProfileInfoCard from "../components/profile/ProfileInfoCard.vue";
import ProfileKpiTile from "../components/profile/ProfileKpiTile.vue";
import ProfileAccountDetails from "../components/profile/ProfileAccountDetails.vue";
import ProfileActivityFeed from "../components/profile/ProfileActivityFeed.vue";
import ProfileIcon from "../components/profile/ProfileIcon.vue";
import { useMyProfile } from "./self-service/composables/useMyProfile.js";
import { useI18n } from "../i18n/index.js";

const { t, locale } = useI18n();

const {
  profile,
  loading,
  savingPassword,
  error,
  passwordError,
  passwordSuccess,
  updatePassword,
} = useMyProfile();

const activeTab = ref("profile");

const tabs = computed(() => {
  void locale.value;
  return [
    { id: "profile", label: t("ss.profile.tab.profile"), icon: "user" },
    { id: "security", label: t("ss.profile.tab.security"), icon: "shield" },
  ];
});

const leftSections = computed(() => {
  void locale.value;
  return [
    {
      title: t("ss.profile.section.personalInfo"),
      items: [
        { icon: "user", label: t("ss.profile.field.fullName"), value: profile.value.personal.fullName },
        { icon: "calendar", label: t("ss.profile.field.dateOfBirth"), value: profile.value.personal.dateOfBirth },
        { icon: "user", label: t("ss.profile.field.gender"), value: profile.value.personal.gender },
        { icon: "globe", label: t("ss.profile.field.language"), value: profile.value.personal.language },
      ],
    },
    {
      title: t("ss.profile.section.contactInfo"),
      items: [
        { icon: "mail", label: t("ss.profile.field.email"), value: profile.value.contact.email },
        { icon: "phone", label: t("ss.profile.field.phone"), value: profile.value.contact.phone },
      ],
    },
    {
      title: t("ss.profile.section.systemInfo"),
      items: [
        { icon: "shield", label: t("ss.profile.field.role"), value: profile.value.system.role, badge: "secondary" },
        { icon: "verified", label: t("ss.profile.field.status"), value: profile.value.system.status, badge: "success" },
        { icon: "badge", label: t("ss.profile.field.employeeCode"), value: profile.value.system.employeeCode, badge: "neutral" },
      ],
    },
  ];
});

const workSections = computed(() => {
  void locale.value;
  return [
    {
      title: t("ss.profile.section.workInfo"),
      items: [
        { icon: "calendar", label: t("ss.profile.field.joiningDate"), value: profile.value.work.joiningDate },
        { icon: "clock", label: t("ss.profile.field.experience"), value: profile.value.work.experience },
        { icon: "badge", label: t("ss.profile.field.jobTitle"), value: profile.value.work.jobTitle },
        { icon: "globe", label: t("ss.profile.field.department"), value: profile.value.work.department },
      ],
    },
  ];
});

const accountItems = computed(() => {
  void locale.value;
  return [
    { icon: "user", label: t("ss.profile.field.username"), value: profile.value.account.username, tone: "secondary" },
    { icon: "shield", label: t("ss.profile.field.role"), value: profile.value.account.role, tone: "success" },
    { icon: "calendar", label: t("ss.profile.field.joiningDate"), value: profile.value.account.joiningDate, tone: "info" },
    { icon: "globe", label: t("ss.profile.field.languagePreference"), value: profile.value.account.languagePreference, tone: "warning" },
  ];
});

const securityFields = computed(() => {
  void locale.value;
  return [
    {
      key: "currentPassword",
      label: t("ss.profile.security.currentPassword"),
      placeholder: t("ss.profile.security.currentPlaceholder"),
    },
    {
      key: "newPassword",
      label: t("ss.profile.security.newPassword"),
      placeholder: t("ss.profile.security.newPlaceholder"),
    },
    {
      key: "confirmPassword",
      label: t("ss.profile.security.confirmPassword"),
      placeholder: t("ss.profile.security.confirmPlaceholder"),
    },
  ];
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

function resetPasswordForm() {
  passwordForm.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

async function onUpdatePassword() {
  const ok = await updatePassword(passwordForm.value);
  if (ok) resetPasswordForm();
}
</script>
