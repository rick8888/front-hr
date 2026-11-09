<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-3xl">
      <header class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          {{ t("tenant.profile.title") }}
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          {{ t("tenant.profile.subtitle") }}
        </p>
      </header>

      <div
        v-if="error"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="successMessage"
        class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <div
        class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div
          v-if="loading"
          class="flex min-h-[16rem] items-center justify-center py-8"
        >
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
            aria-hidden="true"
          />
          <span class="ml-2 text-sm text-neutral-500">{{ t("tenant.profile.loading") }}</span>
        </div>

        <template v-else>
        <TenantProfileFormSection
          :title="t('tenant.profile.companyInformation')"
          :show-divider="false"
        >
          <div class="space-y-4">
            <div>
              <label
                for="tenant-company-name"
                class="mb-1.5 block text-xs font-semibold text-neutral-600"
              >
                {{ t("tenant.profile.companyName") }}
                <span class="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id="tenant-company-name"
                v-model="form.companyName"
                type="text"
                required
                class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  for="tenant-company-email"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.email") }}
                </label>
                <input
                  id="tenant-company-email"
                  v-model="form.email"
                  type="email"
                  disabled
                  class="w-full cursor-not-allowed rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-600"
                />
                <p class="mt-1 text-xs text-neutral-400">
                  {{ t("tenant.profile.emailHelp") }}
                </p>
              </div>
              <div>
                <label
                  for="tenant-company-phone"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.phone") }}
                </label>
                <input
                  id="tenant-company-phone"
                  v-model="form.phone"
                  type="text"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  for="tenant-company-website"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.website") }}
                </label>
                <input
                  id="tenant-company-website"
                  v-model="form.website"
                  type="url"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label
                  for="tenant-company-tax"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.taxId") }}
                </label>
                <input
                  id="tenant-company-tax"
                  v-model="form.taxId"
                  type="text"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </TenantProfileFormSection>

        <TenantProfileFormSection :title="t('tenant.profile.addressInformation')">
          <div class="space-y-4">
            <div>
              <label
                for="tenant-address-street"
                class="mb-1.5 block text-xs font-semibold text-neutral-600"
              >
                {{ t("tenant.profile.streetAddress") }}
              </label>
              <textarea
                id="tenant-address-street"
                v-model="form.streetAddress"
                rows="3"
                class="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  for="tenant-address-city"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.city") }}
                </label>
                <input
                  id="tenant-address-city"
                  v-model="form.city"
                  type="text"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label
                  for="tenant-address-state"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.stateProvince") }}
                </label>
                <input
                  id="tenant-address-state"
                  v-model="form.state"
                  type="text"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  for="tenant-address-country"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.country") }}
                </label>
                <input
                  id="tenant-address-country"
                  v-model="form.country"
                  type="text"
                  disabled
                  class="w-full cursor-not-allowed rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-600"
                />
              </div>
              <div>
                <label
                  for="tenant-address-postal"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  {{ t("tenant.profile.postalCode") }}
                </label>
                <input
                  id="tenant-address-postal"
                  v-model="form.postalCode"
                  type="text"
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </TenantProfileFormSection>

        <TenantProfileFormSection :title="t('tenant.profile.accountInformation')">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p class="text-xs font-semibold text-neutral-600">{{ t("tenant.profile.accountStatus") }}</p>
              <span
                :class="[
                  'mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold',
                  String(form.accountStatus).toLowerCase() === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700',
                ]"
              >
                {{ localizedStatus }}
              </span>
            </div>
            <div>
              <p class="text-xs font-semibold text-neutral-600">{{ t("tenant.profile.memberSince") }}</p>
              <p class="mt-2 text-sm text-neutral-600">{{ formatDate(form.memberSince) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-neutral-600">{{ t("tenant.profile.subdomain") }}</p>
              <a
                :href="subdomainHref"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-block text-sm font-medium text-[#7c7cf8] hover:underline"
              >
                {{ form.subdomain }}
              </a>
            </div>
          </div>
        </TenantProfileFormSection>

        <div class="mt-8 border-t border-neutral-200 pt-6">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-[#7c7cf8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving"
            @click="onSave"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zM9 9h6v6H9V9z"
              />
            </svg>
            {{ saving ? t("tenant.profile.saving") : t("tenant.profile.save") }}
          </button>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import TenantProfileFormSection from "../../components/tenant/TenantProfileFormSection.vue";
import { useTenantCompanyProfile } from "../../composables/useTenantCompanyProfile.js";
import { useI18n } from "../../i18n/index.js";

const { t, locale } = useI18n();
const {
  profile,
  loading,
  saving,
  error,
  successMessage,
  load,
  save,
  emptyProfileForm,
} = useTenantCompanyProfile();

const form = reactive(emptyProfileForm());

watch(
  profile,
  (value) => {
    if (value) {
      Object.assign(form, value);
    }
  },
  { immediate: true }
);

const subdomainHref = computed(() => {
  const s = (form.subdomain || "").trim();
  if (!s) return "#";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
});

const localizedStatus = computed(() => {
  const key = String(form.accountStatus || "").toLowerCase() === "active"
    ? "tenant.profile.status.active"
    : String(form.accountStatus || "").toLowerCase() === "suspended"
      ? "tenant.profile.status.suspended"
      : "";
  return key ? t(key) : form.accountStatus;
});

function formatDate(value) {
  if (!value) return "—";
  const raw = String(value);
  const date = /^\d{4}-\d{2}-\d{2}/.test(raw)
    ? new Date(`${raw.slice(0, 10)}T12:00:00`)
    : new Date(raw);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale.value === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

onMounted(load);

async function onSave() {
  if (!form.companyName.trim()) {
    error.value = t("tenant.profile.companyNameRequired");
    return;
  }

  try {
    await save(form);
  } catch {
    // error handled in composable
  }
}
</script>
