<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-4xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          {{ t("tenant.support.title") }}
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          {{ t("tenant.support.subtitle") }}
        </p>
      </header>

      <div class="flex justify-start">
        <TenantSupportEmailCard
          :email="demo.email"
          :response-time="responseTime"
        />
      </div>

      <TenantSupportTopicsAccordion :topics="topics" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import TenantSupportEmailCard from "../../components/tenant/TenantSupportEmailCard.vue";
import TenantSupportTopicsAccordion from "../../components/tenant/TenantSupportTopicsAccordion.vue";
import { useI18n } from "../../i18n/index.js";
import {
  tenantSupportDemo,
  tenantSupportTopics,
} from "../../data/tenantSupportDemo.js";

const { t, locale } = useI18n();
const demo = tenantSupportDemo;
const responseTime = computed(() => {
  void locale.value;
  return t("tenant.support.responseTime");
});
const topics = computed(() => {
  void locale.value;
  const topicKeys = {
    billing: "tenant.support.topic.billing",
    account: "tenant.support.topic.account",
    technical: "tenant.support.topic.technical",
    faq: "tenant.support.topic.faq",
  };
  const linkKeys = {
    "View payment history": "tenant.support.link.paymentHistory",
    "Manage subscription": "tenant.support.link.subscription",
    "Download invoices": "tenant.support.link.invoices",
  };
  return tenantSupportTopics.map((topic) => ({
    ...topic,
    label: t(topicKeys[topic.id] || topic.label),
    links: topic.links.map((link) => ({
      ...link,
      label: t(linkKeys[link.label] || link.label),
    })),
  }));
});
</script>
