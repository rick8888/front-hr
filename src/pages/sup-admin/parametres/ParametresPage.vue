<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Paramètres plateforme"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Paramètres' }]"
      home-to="/sup-admin/entreprises"
    />

    <p class="mb-6 text-sm text-neutral-500">
      Administration globale de l'application : rôles, messagerie et intégrations.
    </p>

    <div class="mb-6 flex flex-wrap gap-2 border-b border-neutral-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === tab.id
            ? 'border-secondary-500 text-secondary-600'
            : 'border-transparent text-neutral-500 hover:text-neutral-800',
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <RolesSettingsPanel v-show="activeTab === 'roles'" />
    <AttendanceTypesSettingsPanel v-if="activeTab === 'attendance-types'" />
    <RegularizationTypesSettingsPanel v-if="activeTab === 'regularization-types'" />
    <DayTypesSettingsPanel v-if="activeTab === 'day-types'" />
    <ExpenseTypesSettingsPanel v-if="activeTab === 'expense-types'" />
    <DocumentCategoriesSettingsPanel v-if="activeTab === 'document-categories'" />
    <TrainingCategoriesSettingsPanel v-if="activeTab === 'training-categories'" />
    <EquipmentCategoriesSettingsPanel v-if="activeTab === 'equipment-categories'" />
    <PayrollCyclesSettingsPanel v-if="activeTab === 'payroll-cycles'" />
    <CountriesSettingsPanel v-if="activeTab === 'countries'" />
    <SmtpSettingsPanel v-if="activeTab === 'smtp'" />
    <SmsSettingsPanel v-if="activeTab === 'sms'" />

    <section
      v-show="activeTab === 'general'"
      class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 p-10 text-center"
    >
      <p class="text-sm text-neutral-600">
        Paramètres généraux (branding, maintenance, localisation) — à venir.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PageHero from "../../../components/common/PageHero.vue";
import RolesSettingsPanel from "./components/RolesSettingsPanel.vue";
import AttendanceTypesSettingsPanel from "./components/AttendanceTypesSettingsPanel.vue";
import RegularizationTypesSettingsPanel from "./components/RegularizationTypesSettingsPanel.vue";
import DayTypesSettingsPanel from "./components/DayTypesSettingsPanel.vue";
import ExpenseTypesSettingsPanel from "./components/ExpenseTypesSettingsPanel.vue";
import DocumentCategoriesSettingsPanel from "./components/DocumentCategoriesSettingsPanel.vue";
import TrainingCategoriesSettingsPanel from "./components/TrainingCategoriesSettingsPanel.vue";
import EquipmentCategoriesSettingsPanel from "./components/EquipmentCategoriesSettingsPanel.vue";
import PayrollCyclesSettingsPanel from "./components/PayrollCyclesSettingsPanel.vue";
import CountriesSettingsPanel from "./components/CountriesSettingsPanel.vue";
import SmtpSettingsPanel from "./components/SmtpSettingsPanel.vue";
import SmsSettingsPanel from "./components/SmsSettingsPanel.vue";

const activeTab = ref("roles");

const tabs = [
  { id: "roles", label: "Rôles & permissions" },
  { id: "attendance-types", label: "Attendance types" },
  { id: "regularization-types", label: "Types de régularisation" },
  { id: "day-types", label: "Type de jour" },
  { id: "expense-types", label: "Type de dépenses" },
  { id: "document-categories", label: "Catégorie documents" },
  { id: "training-categories", label: "Catégorie Formation" },
  { id: "equipment-categories", label: "Catégorie Matériel" },
  { id: "payroll-cycles", label: "Cycle de paie" },
  { id: "countries", label: "Pays" },
  { id: "smtp", label: "SMTP" },
  { id: "sms", label: "SMS" },
  { id: "general", label: "Général" },
];
</script>
