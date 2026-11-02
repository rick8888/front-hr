<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      title="Paramètres plateforme"
      :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Paramètres' }]"
      home-to="/sup-admin/entreprises"
    />

    <p class="mb-6 text-sm text-neutral-500">
      Administration globale de l'application : rôles, catalogues, messagerie et intégrations.
    </p>

    <div class="mb-4 lg:hidden">
      <label class="mb-1.5 block text-xs font-medium text-neutral-500">Section</label>
      <select v-model="activeTab" class="input-base w-full text-sm">
        <optgroup v-for="group in menuGroups" :key="group.id" :label="group.label">
          <option v-for="item in group.items" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </optgroup>
      </select>
    </div>

    <div class="flex items-start gap-6">
      <aside class="sticky top-4 hidden w-60 shrink-0 lg:block">
        <nav
          class="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-sm"
          aria-label="Menu des paramètres"
        >
          <div v-for="group in menuGroups" :key="group.id" class="mb-2 last:mb-0">
            <p
              class="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400"
            >
              {{ group.label }}
            </p>
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              :class="[
                'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                activeTab === item.id
                  ? 'bg-secondary-50 text-secondary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
              ]"
              @click="activeTab = item.id"
            >
              {{ item.label }}
            </button>
          </div>
        </nav>
      </aside>

      <div class="min-w-0 flex-1">
        <h2 class="mb-4 text-lg font-semibold text-neutral-900">{{ activeLabel }}</h2>

        <RolesSettingsPanel v-show="activeTab === 'roles'" />
        <AttendanceTypesSettingsPanel v-if="activeTab === 'attendance-types'" />
        <RegularizationTypesSettingsPanel v-if="activeTab === 'regularization-types'" />
        <DayTypesSettingsPanel v-if="activeTab === 'day-types'" />
        <ExpenseTypesSettingsPanel v-if="activeTab === 'expense-types'" />
        <TerminationTypesSettingsPanel v-if="activeTab === 'termination-types'" />
        <DocumentCategoriesSettingsPanel v-if="activeTab === 'document-categories'" />
        <DocumentTemplatesSettingsPanel v-if="activeTab === 'document-templates'" :platform-only="true" />
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
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHero from "../../../components/common/PageHero.vue";
import RolesSettingsPanel from "./components/RolesSettingsPanel.vue";
import AttendanceTypesSettingsPanel from "./components/AttendanceTypesSettingsPanel.vue";
import RegularizationTypesSettingsPanel from "./components/RegularizationTypesSettingsPanel.vue";
import DayTypesSettingsPanel from "./components/DayTypesSettingsPanel.vue";
import ExpenseTypesSettingsPanel from "./components/ExpenseTypesSettingsPanel.vue";
import TerminationTypesSettingsPanel from "./components/TerminationTypesSettingsPanel.vue";
import DocumentCategoriesSettingsPanel from "./components/DocumentCategoriesSettingsPanel.vue";
import DocumentTemplatesSettingsPanel from "./components/DocumentTemplatesSettingsPanel.vue";
import TrainingCategoriesSettingsPanel from "./components/TrainingCategoriesSettingsPanel.vue";
import EquipmentCategoriesSettingsPanel from "./components/EquipmentCategoriesSettingsPanel.vue";
import PayrollCyclesSettingsPanel from "./components/PayrollCyclesSettingsPanel.vue";
import CountriesSettingsPanel from "./components/CountriesSettingsPanel.vue";
import SmtpSettingsPanel from "./components/SmtpSettingsPanel.vue";
import SmsSettingsPanel from "./components/SmsSettingsPanel.vue";

const route = useRoute();
const router = useRouter();

const menuGroups = [
  {
    id: "access",
    label: "Accès",
    items: [
      { id: "roles", label: "Rôles & permissions" },
      { id: "general", label: "Général" },
    ],
  },
  {
    id: "catalogs",
    label: "Catalogues",
    items: [
      { id: "attendance-types", label: "Types de présence" },
      { id: "regularization-types", label: "Types de régularisation" },
      { id: "day-types", label: "Type de jour" },
      { id: "expense-types", label: "Type de dépenses" },
      { id: "termination-types", label: "Type fin de contrats" },
      { id: "document-categories", label: "Catégorie documents" },
      { id: "document-templates", label: "Modèles documentaires" },
      { id: "training-categories", label: "Catégorie Formation" },
      { id: "equipment-categories", label: "Catégorie Matériel" },
      { id: "payroll-cycles", label: "Cycle de paie" },
    ],
  },
  {
    id: "reference",
    label: "Référentiel",
    items: [{ id: "countries", label: "Pays" }],
  },
  {
    id: "messaging",
    label: "Messagerie",
    items: [
      { id: "smtp", label: "SMTP" },
      { id: "sms", label: "SMS" },
    ],
  },
];

const menuItems = menuGroups.flatMap((group) => group.items);
const validIds = new Set(menuItems.map((item) => item.id));

const activeTab = computed({
  get() {
    const section = route.query.section;
    return typeof section === "string" && validIds.has(section) ? section : "roles";
  },
  set(id) {
    router.replace({
      query: { ...route.query, section: id },
    });
  },
});

const activeLabel = computed(
  () => menuItems.find((item) => item.id === activeTab.value)?.label || "Paramètres"
);
</script>
