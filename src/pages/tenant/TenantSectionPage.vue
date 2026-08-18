<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <PageHero
        :title="pageTitle"
        :breadcrumbs="breadcrumbs"
        :home-to="homeTo"
      />
      <section
        class="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs md:p-8"
      >
        <p class="text-sm leading-relaxed text-neutral-600">
          {{ pageLead }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import PageHero from "../../components/common/PageHero.vue";

const route = useRoute();

const homeTo = "/tenant/dashboard";

const pageTitle = computed(() => route.meta.title || "Portal");

const pageLead = computed(
  () =>
    route.meta.lead ||
    "This section is a placeholder for the tenant portal. Connect your API here.",
);

const breadcrumbs = computed(() => {
  const raw = route.meta.breadcrumbs;
  if (Array.isArray(raw) && raw.length) return raw;
  return [{ label: pageTitle.value }];
});
</script>
