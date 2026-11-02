<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <PageHero
      :title="t('settings.title')"
      :breadcrumbs="[{ label: t('settings.title') }, { label: activeLabel }]"
      home-to="/"
    />

    <p class="mb-6 text-sm text-neutral-500">
      {{ t("settings.pageHint") }}
    </p>

    <div class="mb-4 lg:hidden">
      <label class="mb-1.5 block text-xs font-medium text-neutral-500">
        {{ t("settings.sectionLabel") }}
      </label>
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
          :aria-label="t('settings.navAria')"
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
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-neutral-900">{{ activeLabel }}</h2>
          <p v-if="activeHint" class="mt-0.5 text-sm text-neutral-500">{{ activeHint }}</p>
        </div>

        <div class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
          <SettingsGeneralPanel v-if="activeTab === 'general'" />
          <SettingsBusinessPanel
            v-else-if="activeTab === 'business-central'"
            @go-tab="activeTab = $event"
          />
          <SettingsDepartmentsPanel v-else-if="activeTab === 'departments'" />
          <SettingsHolidaysPanel v-else-if="activeTab === 'holidays'" />
          <DocumentTemplatesSettingsPanel
            v-else-if="activeTab === 'document-templates'"
            :platform-only="false"
          />
          <SettingsWhatsAppPanel v-else-if="activeTab === 'whatsapp'" />
          <SettingsPreferencesPanel v-else-if="activeTab === 'preferences'" />
          <SettingsNotificationsPanel v-else-if="activeTab === 'notifications'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHero from "../components/common/PageHero.vue";
import SettingsGeneralPanel from "./settings/components/SettingsGeneralPanel.vue";
import SettingsBusinessPanel from "./settings/components/SettingsBusinessPanel.vue";
import SettingsDepartmentsPanel from "./settings/components/SettingsDepartmentsPanel.vue";
import SettingsHolidaysPanel from "./settings/components/SettingsHolidaysPanel.vue";
import SettingsWhatsAppPanel from "./settings/components/SettingsWhatsAppPanel.vue";
import SettingsPreferencesPanel from "./settings/components/SettingsPreferencesPanel.vue";
import SettingsNotificationsPanel from "./settings/components/SettingsNotificationsPanel.vue";
import DocumentTemplatesSettingsPanel from "./sup-admin/parametres/components/DocumentTemplatesSettingsPanel.vue";
import { useI18n } from "../i18n/index.js";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const menuGroups = computed(() => {
  void locale.value;
  return [
    {
      id: "company",
      label: t("settings.group.company"),
      items: [
        {
          id: "general",
          label: t("settings.tabs.general"),
          hint: t("settings.general.subtitle"),
        },
        {
          id: "business-central",
          label: t("settings.tabs.business"),
          hint: t("settings.business.subtitle"),
        },
        {
          id: "departments",
          label: t("settings.tabs.departments"),
          hint: t("settings.departments.subtitle"),
        },
        {
          id: "holidays",
          label: t("settings.tabs.holidays"),
          hint: t("settings.holidays.subtitle"),
        },
      ],
    },
    {
      id: "hr-docs",
      label: t("settings.group.documents"),
      items: [
        {
          id: "document-templates",
          label: t("settings.tabs.documentTemplates"),
          hint: t("admin.employees.documentTemplates.hintTenant"),
        },
      ],
    },
    {
      id: "integrations",
      label: t("settings.group.integrations"),
      items: [
        {
          id: "whatsapp",
          label: t("settings.tabs.whatsapp"),
          hint: t("settings.whatsapp.subtitle"),
        },
      ],
    },
    {
      id: "personal",
      label: t("settings.group.personal"),
      items: [
        {
          id: "preferences",
          label: t("settings.tabs.preferences"),
          hint: t("settings.preferences.subtitle"),
        },
        {
          id: "notifications",
          label: t("settings.tabs.notifications"),
          hint: t("settings.notifications.subtitle"),
        },
      ],
    },
  ];
});

const menuItems = computed(() => menuGroups.value.flatMap((g) => g.items));
const validIds = computed(() => new Set(menuItems.value.map((item) => item.id)));

const activeTab = computed({
  get() {
    const section = route.query.section;
    return typeof section === "string" && validIds.value.has(section)
      ? section
      : "general";
  },
  set(id) {
    router.replace({
      query: { ...route.query, section: id },
    });
  },
});

const activeItem = computed(() =>
  menuItems.value.find((item) => item.id === activeTab.value),
);

const activeLabel = computed(
  () => activeItem.value?.label || t("settings.title"),
);

const activeHint = computed(() => activeItem.value?.hint || "");
</script>
