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
          label="Current Plan"
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
              {{ dashboard.planStatus }}
            </span>
          </template>
        </TenantDashboardStatCard>

        <TenantDashboardStatCard
          label="Next Payment"
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
            <span class="text-sm text-neutral-500">{{ dashboard.nextPaymentDate }}</span>
          </template>
        </TenantDashboardStatCard>

        <TenantDashboardStatCard
          label="Users"
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
              of {{ dashboard.usersAllowedLabel }} allowed
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
          :status="dashboard.planStatus"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TenantPortalTopBar from "../../components/tenant/TenantPortalTopBar.vue";
import TenantWelcomeHero from "../../components/tenant/TenantWelcomeHero.vue";
import TenantDashboardStatCard from "../../components/tenant/TenantDashboardStatCard.vue";
import TenantQuickActionsCard from "../../components/tenant/TenantQuickActionsCard.vue";
import TenantSubscriptionDetailsCard from "../../components/tenant/TenantSubscriptionDetailsCard.vue";
import { useTenantDashboard } from "../../composables/useTenantDashboard.js";

const { loading, error, dashboard, load } = useTenantDashboard();

const heroPaths = {
  subscription: "/tenant/subscription",
  company: "/tenant/profile",
  support: "/tenant/support",
};

const quickActions = [
  { label: "View Billing History", to: "/tenant/billings", icon: "document" },
  { label: "Download Invoices", to: "/tenant/invoices", icon: "download" },
  { label: "Check Usage", to: "/tenant/usage", icon: "chart" },
];

onMounted(() => {
  load();
});
</script>
