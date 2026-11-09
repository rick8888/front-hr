<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <TenantPortalTopBar :application-url="dashboard.applicationUrl" />

      <TenantWelcomeHero
        :product-name="dashboard.productName"
        :first-name="loading ? '…' : dashboard.firstName"
        :paths="heroPaths"
      />

      <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TenantDashboardStatCard
          :label="t('tenant.dashboard.currentPlan')"
          :value="dashboard.currentPlan"
          :loading="loading"
          tone="purple"
        >
          <template #icon>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect
                x="2"
                y="5"
                width="20"
                height="14"
                rx="2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2 10h20"
              />
            </svg>
          </template>
          <template #footer>
            <span
              class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ localizedStatus }}
            </span>
          </template>
        </TenantDashboardStatCard>

        <TenantDashboardStatCard
          :label="t('tenant.dashboard.nextPayment')"
          :value="dashboard.nextPaymentAmount"
          :loading="loading"
          tone="cyan"
        >
          <template #icon>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 3v4M8 3v4M3 11h18"
              />
            </svg>
          </template>
          <template #footer>
            <span class="text-sm text-neutral-500">{{ formatDashboardDate(dashboard.nextPaymentDate) }}</span>
          </template>
        </TenantDashboardStatCard>

        <TenantDashboardStatCard
          :label="t('tenant.dashboard.users')"
          :value="String(dashboard.usersCount)"
          :loading="loading"
          tone="green"
        >
          <template #icon>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </template>
          <template #footer>
            <span class="text-sm text-neutral-500">
              {{ usersAllowedText }}
            </span>
          </template>
        </TenantDashboardStatCard>
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <TenantQuickActionsCard class="xl:col-span-1" :actions="quickActions" />
        <TenantSubscriptionDetailsCard
          class="xl:col-span-2"
          :plan="dashboard.currentPlan"
          :price="dashboard.priceLabel"
          :started="dashboard.startedDate"
          :next-billing="dashboard.nextBillingDate"
          :status="localizedStatus"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import TenantPortalTopBar from "../../components/tenant/TenantPortalTopBar.vue";
import TenantWelcomeHero from "../../components/tenant/TenantWelcomeHero.vue";
import TenantDashboardStatCard from "../../components/tenant/TenantDashboardStatCard.vue";
import TenantQuickActionsCard from "../../components/tenant/TenantQuickActionsCard.vue";
import TenantSubscriptionDetailsCard from "../../components/tenant/TenantSubscriptionDetailsCard.vue";
import { useTenantDashboard } from "../../composables/useTenantDashboard.js";
import { useI18n } from "../../i18n/index.js";

const { loading, error, dashboard, load } = useTenantDashboard();
const { t, locale } = useI18n();

const heroPaths = {
  subscription: "/tenant/subscription",
  company: "/tenant/profile",
  support: "/tenant/support",
};

const quickActions = computed(() => {
  void locale.value;
  return [
    { label: t("tenant.dashboard.viewBillingHistory"), to: "/tenant/billings", icon: "document" },
    { label: t("tenant.dashboard.downloadInvoices"), to: "/tenant/invoices", icon: "download" },
    { label: t("tenant.dashboard.checkUsage"), to: "/tenant/usage", icon: "chart" },
  ];
});

const localizedStatus = computed(() => {
  void locale.value;
  const statuses = {
    active: "tenant.dashboard.status.active",
    inactive: "tenant.dashboard.status.inactive",
    suspended: "tenant.dashboard.status.suspended",
    cancelled: "tenant.dashboard.status.cancelled",
    expired: "tenant.dashboard.status.expired",
  };
  const key = statuses[String(dashboard.value.planStatus).toLowerCase()];
  return key ? t(key) : dashboard.value.planStatus;
});

const usersAllowedText = computed(() => {
  void locale.value;
  if (dashboard.value.usersAllowedLabel.toLowerCase() === "unlimited") {
    return t("tenant.dashboard.usersUnlimited");
  }
  return t("tenant.dashboard.usersAllowed", {
    count: dashboard.value.usersAllowedLabel,
  });
});

function formatDashboardDate(value) {
  if (!value || value === "—") return value || "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale.value === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

onMounted(() => {
  load();
});
</script>
