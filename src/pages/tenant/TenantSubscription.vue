<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          {{ t("tenant.subscription.title") }}
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          {{ t("tenant.subscription.subtitle") }}
        </p>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="successMessage"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <TenantCurrentSubscriptionCard
        :subscription="localizedCurrent"
        :loading="loading"
        :cancelling="cancelling"
        @cancel="cancelDialogOpen = true"
        @renew="renewCurrentPlan"
      />

      <section>
        <h2 class="text-base font-bold text-neutral-900">{{ t("tenant.subscription.availablePlans") }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          <template v-if="loading && !plans.length">
            <TenantPlanCard
              v-for="i in 3"
              :key="'skeleton-plan-' + i"
              :loading="true"
            />
          </template>
          <template v-else>
            <TenantPlanCard
              v-for="plan in localizedPlans"
              :key="plan.id"
              :plan="plan"
              :loading="loading"
              @choose="onChoosePlan"
            />
          </template>
        </div>
      </section>

      <TenantSubscriptionHistoryTable :rows="localizedHistory" :loading="loading" />
    </div>

    <ConfirmDialog
      v-model="cancelDialogOpen"
      :title="t('tenant.subscription.cancelTitle')"
      :message="t('tenant.subscription.cancelMessage')"
      :confirm-text="t('tenant.subscription.confirmCancel')"
      :cancel-text="t('tenant.subscription.keepSubscription')"
      variant="danger"
      :busy="cancelling"
      :loading-text="t('tenant.subscription.cancelling')"
      @confirm="confirmCancel"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmDialog from "../../components/common/ConfirmDialog.vue";
import TenantCurrentSubscriptionCard from "../../components/tenant/TenantCurrentSubscriptionCard.vue";
import TenantPlanCard from "../../components/tenant/TenantPlanCard.vue";
import TenantSubscriptionHistoryTable from "../../components/tenant/TenantSubscriptionHistoryTable.vue";
import { useTenantSubscription } from "../../composables/useTenantSubscription.js";
import { useI18n } from "../../i18n/index.js";

const router = useRouter();
const cancelDialogOpen = ref(false);
const { t, locale } = useI18n();

const {
  loading,
  cancelling,
  error,
  successMessage,
  current,
  plans,
  history,
  load,
  cancel,
} = useTenantSubscription();

const localizedCurrent = computed(() => {
  void locale.value;
  if (!current.value) return null;

  return {
    ...current.value,
    statusLabel: translateStatus(current.value.status),
    price: translateCadence(current.value.price),
    startedDate: formatDate(current.value.startedDate),
    nextBillingDate: formatDate(current.value.nextBillingDate),
    features: current.value.features.map(translateFeature),
  };
});

const localizedPlans = computed(() => {
  void locale.value;
  return plans.value.map((plan) => ({
    ...plan,
    tagline: translateTagline(plan),
    cadence: translateCadence(plan.cadence),
    badge: plan.badge ? t("tenant.subscription.mostPopular") : null,
    features: plan.features.map(translateFeature),
    cta: {
      ...plan.cta,
      label: translatePlanAction(plan),
    },
  }));
});

const localizedHistory = computed(() => {
  void locale.value;
  return history.value.map((row) => ({
    ...row,
    statusLabel: translateStatus(row.status),
    period: formatPeriod(row.period),
  }));
});

onMounted(load);

function translateStatus(status) {
  const keys = {
    active: "tenant.subscription.status.active",
    cancelled: "tenant.subscription.status.cancelled",
    canceled: "tenant.subscription.status.cancelled",
    expired: "tenant.subscription.status.expired",
    suspended: "tenant.subscription.status.suspended",
    pending: "tenant.subscription.status.pending",
    partial: "tenant.subscription.status.partial",
    overdue: "tenant.subscription.status.overdue",
    paid: "tenant.subscription.status.paid",
    draft: "tenant.subscription.status.draft",
  };
  const key = keys[String(status || "").toLowerCase()];
  return key ? t(key) : status;
}

function translateCadence(value) {
  if (!value) return value;
  return value.replace(/\/monthly\b|per monthly\b/gi, t("tenant.subscription.perMonth"));
}

function translateFeature(feature) {
  const value = String(feature || "");
  const exact = {
    "Unlimited users": "tenant.subscription.feature.unlimitedUsers",
    "Unlimited employees": "tenant.subscription.feature.unlimitedEmployees",
    "Unlimited storage": "tenant.subscription.feature.unlimitedStorage",
  };
  if (exact[value]) return t(exact[value]);

  let match = value.match(/^Up to (\d+) users$/i);
  if (match) return t("tenant.subscription.feature.users", { count: match[1] });
  match = value.match(/^Up to (\d+) employees$/i);
  if (match) return t("tenant.subscription.feature.employees", { count: match[1] });
  match = value.match(/^(\d+) GB storage$/i);
  if (match) return t("tenant.subscription.feature.storage", { count: match[1] });
  match = value.match(/^(\d+) modules? included$/i);
  if (match) {
    const key = Number(match[1]) === 1
      ? "tenant.subscription.feature.modulesOne"
      : "tenant.subscription.feature.modules";
    return t(key, { count: match[1] });
  }
  return feature;
}

function translateTagline(plan) {
  const key = {
    free: "tenant.subscription.tagline.free",
    starter: "tenant.subscription.tagline.starter",
    premium: "tenant.subscription.tagline.premium",
    enterprise: "tenant.subscription.tagline.enterprise",
  }[String(plan.code || plan.id || "").toLowerCase()];
  return key ? t(key) : plan.tagline;
}

function translatePlanAction(plan) {
  if (!plan.priceAvailable) return t("tenant.subscription.priceUnavailable");
  if (plan.cta?.label === "Renew") return t("tenant.subscription.renewPlan");
  if (plan.isCurrent) return t("tenant.subscription.currentPlan");
  if (plan.cta?.label === "Upgrade") return t("tenant.subscription.upgrade");
  if (plan.cta?.label === "Downgrade") return t("tenant.subscription.downgrade");
  return t("tenant.subscription.choosePlan");
}

function formatDate(value) {
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

function formatPeriod(value) {
  if (!value || value === "—") return value || "—";
  const dates = value.split(" - ");
  return dates.length === 2
    ? `${formatDate(dates[0])} - ${formatDate(dates[1])}`
    : value;
}

async function confirmCancel() {
  try {
    await cancel();
    cancelDialogOpen.value = false;
  } catch {
    // error handled in composable
  }
}

function onChoosePlan(plan) {
  router.push({
    name: "TenantSubscriptionChange",
    query: { plan: plan.id },
  });
}

function renewCurrentPlan() {
  if (!current.value?.planCode) return;
  router.push({
    name: "TenantSubscriptionChange",
    query: { plan: current.value.planCode },
  });
}
</script>
