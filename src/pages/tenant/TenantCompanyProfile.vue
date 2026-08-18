<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-3xl">
      <header class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Company Profile
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          Manage your company information and settings
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
          <span class="ml-2 text-sm text-neutral-500">Loading profile…</span>
        </div>

        <template v-else>
        <TenantProfileFormSection
          title="Company Information"
          :show-divider="false"
        >
          <div class="space-y-4">
            <div>
              <label
                for="tenant-company-name"
                class="mb-1.5 block text-xs font-semibold text-neutral-600"
              >
                Company Name
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
                  Email
                </label>
                <input
                  id="tenant-company-email"
                  v-model="form.email"
                  type="email"
                  disabled
                  class="w-full cursor-not-allowed rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-600"
                />
                <p class="mt-1 text-xs text-neutral-400">
                  Contact support to change your email address
                </p>
              </div>
              <div>
                <label
                  for="tenant-company-phone"
                  class="mb-1.5 block text-xs font-semibold text-neutral-600"
                >
                  Phone
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
                  Website
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
                  Tax ID / VAT Number
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

        <TenantProfileFormSection title="Address Information">
          <div class="space-y-4">
            <div>
              <label
                for="tenant-address-street"
                class="mb-1.5 block text-xs font-semibold text-neutral-600"
              >
                Street Address
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
                  City
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
                  State / Province
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
                  Country
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
                  Postal Code
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

        <TenantProfileFormSection title="Account Information">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p class="text-xs font-semibold text-neutral-600">Account Status</p>
              <span
                :class="[
                  'mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold',
                  form.accountStatus === 'Active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700',
                ]"
              >
                {{ form.accountStatus }}
              </span>
            </div>
            <div>
              <p class="text-xs font-semibold text-neutral-600">Member Since</p>
              <p class="mt-2 text-sm text-neutral-600">{{ form.memberSince }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-neutral-600">Your Subdomain</p>
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
            {{ saving ? "Saving…" : "Save Changes" }}
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

onMounted(load);

async function onSave() {
  if (!form.companyName.trim()) {
    error.value = "Company name is required.";
    return;
  }

  try {
    await save(form);
  } catch {
    // error handled in composable
  }
}
</script>
