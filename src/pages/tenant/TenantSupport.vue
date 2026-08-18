<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-4xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Support Center
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          We're here to help you with any questions or issues
        </p>
      </header>

      <div class="flex justify-start">
        <TenantSupportEmailCard
          :email="demo.email"
          :response-time="demo.responseTime"
        />
      </div>

      <TenantSupportTopicsAccordion :topics="topics" />
    </div>
  </div>
</template>

<script setup>
import TenantSupportEmailCard from "../../components/tenant/TenantSupportEmailCard.vue";
import TenantSupportTopicsAccordion from "../../components/tenant/TenantSupportTopicsAccordion.vue";
import {
  tenantSupportDemo,
  tenantSupportTopics,
} from "../../data/tenantSupportDemo.js";

const demo = tenantSupportDemo;
const topics = tenantSupportTopics;
</script>
