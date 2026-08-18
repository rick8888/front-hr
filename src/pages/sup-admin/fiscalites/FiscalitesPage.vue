<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero title="Fiscalités" :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Fiscalités' }]" />

    <p class="mb-4 text-sm text-neutral-500">
      Référentiel fiscal par pays — données alignées sur
      <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">bravo-api-K/database/data/fiscal/</code>
    </p>

    <div class="mb-6 max-w-sm">
      <CountryTaxSelector
        :model-value="taxStore.selectedCountry"
        :countries="taxStore.countries"
        :disabled="taxStore.loading"
        @select="taxStore.selectCountry"
      />
    </div>

    <div v-if="taxStore.loading && !taxStore.fiscalProfile" class="py-16 text-center text-sm text-neutral-500">
      Chargement du profil fiscal…
    </div>

    <div v-else-if="taxStore.fiscalProfile" class="space-y-6">
      <FiscalProfilePanel
        :profile="taxStore.fiscalProfile"
        :active-rules-count="taxStore.activeRulesCount"
        :disabled="taxStore.saving"
        @toggle-status="taxStore.toggleProfileStatus"
      />

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Cotisations salariales"
          :value="employeeRulesCount"
          unit-label="Règles"
          tone="violet"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </KpiCard>
        <KpiCard
          title="Cotisations patronales"
          :value="employerRulesCount"
          unit-label="Règles"
          tone="blue"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </template>
        </KpiCard>
        <KpiCard
          title="Barèmes actifs"
          :value="taxStore.activeScalesCount"
          unit-label="Barèmes"
          tone="neutral"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </template>
        </KpiCard>
        <KpiCard
          title="Déclarations actives"
          :value="taxStore.activeDeclarationPeriodsCount"
          unit-label="Échéances"
          tone="green"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </template>
        </KpiCard>
      </div>

      <DeclarationPeriodsManager
        :periods="taxStore.declarationPeriods"
        :rules="taxStore.taxRules"
        :categories="taxStore.categories"
        :disabled="taxStore.saving"
        @add="taxStore.addDeclarationPeriod"
        @update="taxStore.updateDeclarationPeriod"
        @delete="taxStore.deleteDeclarationPeriod"
        @toggle="taxStore.toggleDeclarationPeriod"
      />

      <TaxScaleManager
        :scales="taxStore.taxScales"
        :currency="taxStore.fiscalProfile.currency"
        :disabled="taxStore.saving"
        @update-bracket="taxStore.updateScaleBracket"
        @add-bracket="taxStore.addScaleBracket"
        @delete-bracket="taxStore.deleteScaleBracket"
        @toggle-scale="taxStore.toggleScale"
      />

      <div class="grid gap-6 xl:grid-cols-3">
        <div class="xl:col-span-2">
          <TaxRulesManager
            :rules="taxStore.taxRules"
            :active-categories="taxStore.activeCategories"
            :calculation-bases="taxStore.calculationBases"
            :active-calculation-bases="taxStore.activeCalculationBases"
            :scales="taxStore.taxScales"
            :currency="taxStore.fiscalProfile.currency"
            :disabled="taxStore.saving"
            @add="taxStore.addTaxRule"
            @update="taxStore.updateTaxRule"
            @delete="taxStore.deleteTaxRule"
          />
        </div>
        <div class="space-y-6">
          <TaxCategoriesManager
            :categories="taxStore.categories"
            :disabled="taxStore.saving"
            @add="taxStore.addCategory"
            @rename="taxStore.updateCategory"
            @disable="taxStore.disableCategory"
          />
          <TaxCalculationBasesManager
            :bases="taxStore.calculationBases"
            :rules="taxStore.taxRules"
            :disabled="taxStore.saving"
            @add="taxStore.addCalculationBase"
            @update="taxStore.updateCalculationBase"
            @disable="taxStore.disableCalculationBase"
          />
          <FiscalVersionManager
            :versions="taxStore.versions"
            :disabled="taxStore.saving"
            @restore="taxStore.restoreVersion"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import PageHero from "../../../components/common/PageHero.vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import CountryTaxSelector from "./components/CountryTaxSelector.vue";
import FiscalProfilePanel from "./components/FiscalProfilePanel.vue";
import DeclarationPeriodsManager from "./components/DeclarationPeriodsManager.vue";
import TaxScaleManager from "./components/TaxScaleManager.vue";
import TaxRulesManager from "./components/TaxRulesManager.vue";
import TaxCategoriesManager from "./components/TaxCategoriesManager.vue";
import TaxCalculationBasesManager from "./components/TaxCalculationBasesManager.vue";
import FiscalVersionManager from "./components/FiscalVersionManager.vue";
import { useTaxStore } from "./store/tax.store.js";

const taxStore = useTaxStore();

const employeeRulesCount = computed(
  () => taxStore.taxRules.filter((r) => r.is_active && (r.applies_to === "employee" || r.applies_to === "both")).length
);
const employerRulesCount = computed(
  () => taxStore.taxRules.filter((r) => r.is_active && (r.applies_to === "employer" || r.applies_to === "both")).length
);
onMounted(async () => {
  await taxStore.fetchCountries();
  if (taxStore.selectedCountry) await taxStore.fetchFiscalProfile(taxStore.selectedCountry);
});
</script>
