<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">Rémunération</h1>
      <p class="text-sm text-neutral-600">
        Consultez les détails de votre rémunération et de vos éléments de paie
      </p>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm mb-6">
      <div class="border-b border-neutral-200">
        <div class="flex items-center gap-1 px-6 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="activeTab = tab.id"
          >
            <span class="text-lg">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <!-- Vue d'ensemble Tab -->
      <div v-if="activeTab === 'overview'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Vue d'ensemble</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h3 class="text-sm font-medium text-neutral-600 mb-2">Salaire de base</h3>
            <p class="text-2xl font-bold text-neutral-900">€{{ formatNumber(salaryData.baseSalary) }}</p>
          </div>
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h3 class="text-sm font-medium text-neutral-600 mb-2">Total des éléments</h3>
            <p class="text-2xl font-bold text-neutral-900">€{{ formatNumber(salaryData.totalElements) }}</p>
          </div>
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h3 class="text-sm font-medium text-neutral-600 mb-2">Total des déductions</h3>
            <p class="text-2xl font-bold text-red-600">-€{{ formatNumber(salaryData.totalDeductions) }}</p>
          </div>
        </div>
        <div class="mt-6 bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <h3 class="text-sm font-medium text-neutral-600 mb-2">Salaire net</h3>
          <p class="text-3xl font-bold text-primary-600">€{{ formatNumber(salaryData.netSalary) }}</p>
        </div>
      </div>

      <!-- Éléments de paie Tab -->
      <div v-if="activeTab === 'elements'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Éléments de paie</h2>
        <div class="space-y-4">
          <div
            v-for="element in salaryElements"
            :key="element.id"
            class="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div>
              <h3 class="font-medium text-neutral-900">{{ element.name }}</h3>
              <p class="text-sm text-neutral-600">{{ element.description }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-neutral-900">€{{ formatNumber(element.amount) }}</p>
              <p class="text-xs text-neutral-500">{{ element.period }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Déductions Tab -->
      <div v-if="activeTab === 'deductions'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Déductions</h2>
        <div class="space-y-4">
          <div
            v-for="deduction in deductions"
            :key="deduction.id"
            class="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div>
              <h3 class="font-medium text-neutral-900">{{ deduction.name }}</h3>
              <p class="text-sm text-neutral-600">{{ deduction.description }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-red-600">-€{{ formatNumber(deduction.amount) }}</p>
              <p class="text-xs text-neutral-500">{{ deduction.period }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique Tab -->
      <div v-if="activeTab === 'history'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Historique</h2>
        <div class="space-y-4">
          <div
            v-for="record in history"
            :key="record.id"
            class="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div>
              <h3 class="font-medium text-neutral-900">{{ record.period }}</h3>
              <p class="text-sm text-neutral-600">{{ record.description }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-neutral-900">€{{ formatNumber(record.amount) }}</p>
              <p class="text-xs text-neutral-500">{{ formatDate(record.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('overview');

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'elements', label: 'Éléments de paie', icon: '💰' },
  { id: 'deductions', label: 'Déductions', icon: '📉' },
  { id: 'history', label: 'Historique', icon: '📅' },
];

// Mock data - In a real app, this would come from an API
const salaryData = ref({
  baseSalary: 3500,
  totalElements: 4200,
  totalDeductions: 1050,
  netSalary: 3150,
});

const salaryElements = ref([
  {
    id: 1,
    name: 'Salaire de base',
    description: 'Salaire mensuel',
    amount: 3500,
    period: 'Mensuel',
  },
  {
    id: 2,
    name: 'Prime de performance',
    description: 'Prime trimestrielle',
    amount: 500,
    period: 'Trimestriel',
  },
  {
    id: 3,
    name: 'Indemnité transport',
    description: 'Remboursement transport',
    amount: 200,
    period: 'Mensuel',
  },
]);

const deductions = ref([
  {
    id: 1,
    name: 'Cotisation sociale',
    description: 'Sécurité sociale',
    amount: 350,
    period: 'Mensuel',
  },
  {
    id: 2,
    name: 'Retraite',
    description: 'Cotisation retraite',
    amount: 280,
    period: 'Mensuel',
  },
  {
    id: 3,
    name: 'Assurance chômage',
    description: 'Cotisation assurance',
    amount: 140,
    period: 'Mensuel',
  },
  {
    id: 4,
    name: 'Impôt sur le revenu',
    description: 'Précompte',
    amount: 280,
    period: 'Mensuel',
  },
]);

const history = ref([
  {
    id: 1,
    period: 'Décembre 2025',
    description: 'Salaire net',
    amount: 3150,
    date: '2025-12-31',
  },
  {
    id: 2,
    period: 'Novembre 2025',
    description: 'Salaire net',
    amount: 3150,
    date: '2025-11-30',
  },
  {
    id: 3,
    period: 'Octobre 2025',
    description: 'Salaire net',
    amount: 3150,
    date: '2025-10-31',
  },
]);

const formatNumber = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
</script>

<style scoped></style>
