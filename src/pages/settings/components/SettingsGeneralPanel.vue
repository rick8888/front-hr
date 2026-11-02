<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        class="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1"
        role="tablist"
      >
        <button
          v-for="tab in sectionTabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            section === tab.id
              ? 'bg-white text-secondary-700 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          "
          @click="section = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn-outline text-sm" @click="reset">
          {{ t("settings.general.resetChanges") }}
        </button>
        <button type="button" class="btn-primary text-sm" @click="save">
          {{ t("settings.general.save") }}
        </button>
      </div>
    </div>

    <div
      v-if="feedback"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ feedback }}
    </div>
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div v-show="section === 'company'" class="space-y-5">
      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.logo") }}
        </h3>
        <div class="flex flex-wrap items-center gap-5">
          <div
            class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
            :class="{ 'border-dashed border-neutral-300': !form.logo }"
          >
            <img
              v-if="form.logo"
              :src="form.logo"
              :alt="t('settings.general.logo')"
              class="h-full w-full object-cover"
            />
            <svg
              v-else
              class="h-7 w-7 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <label class="btn-primary inline-flex cursor-pointer text-sm">
              {{ t("settings.general.uploadLogo") }}
              <input type="file" accept="image/*" class="hidden" @change="onLogo" />
            </label>
            <p class="mt-1.5 text-xs text-neutral-500">{{ t("settings.general.logoHint") }}</p>
            <button
              v-if="form.logo"
              type="button"
              class="mt-1 text-sm text-error-600 hover:text-error-700"
              @click="form.logo = null"
            >
              {{ t("settings.general.removeLogo") }}
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.basicInfo") }}
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.companyName") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.name" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.companyType") }}
            </label>
            <select v-model="form.companyType" class="input-base w-full text-sm">
              <option value="SARL">SARL</option>
              <option value="SA">SA</option>
              <option value="SAS">SAS</option>
              <option value="EURL">EURL</option>
              <option value="SNC">SNC</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.companyEmail") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.email" type="email" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.phone") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.phone" type="tel" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.website") }}
            </label>
            <input v-model="form.website" type="url" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.foundedYear") }}
            </label>
            <input
              v-model.number="form.foundedYear"
              type="number"
              min="1900"
              :max="new Date().getFullYear()"
              class="input-base w-full text-sm"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.description") }}
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="input-base w-full text-sm"
              :placeholder="t('settings.general.descriptionPlaceholder')"
            />
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.addressInfo") }}
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.streetAddress") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.address" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.city") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.city" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.state") }}
            </label>
            <input v-model="form.state" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.postalCode") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.postalCode" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.country") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.country" type="text" class="input-base w-full text-sm" />
          </div>
        </div>
      </section>
    </div>

    <div v-show="section === 'legal'" class="space-y-5">
      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.legalInfo") }}
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.siret") }}</label>
            <input v-model="form.siret" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.siren") }}</label>
            <input v-model="form.siren" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.vatNumber") }}</label>
            <input v-model="form.vatNumber" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.rcs") }}</label>
            <input v-model="form.rcs" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.apeCode") }}</label>
            <input v-model="form.apeCode" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.shareCapital") }}</label>
            <input v-model="form.shareCapital" type="text" class="input-base w-full text-sm" />
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.bankInfo") }}
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.bankName") }}</label>
            <input v-model="form.bankName" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.accountHolder") }}</label>
            <input v-model="form.accountHolder" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.iban") }}</label>
            <input v-model="form.iban" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.bic") }}</label>
            <input v-model="form.bic" type="text" class="input-base w-full text-sm" />
          </div>
        </div>
      </section>
    </div>

    <div v-show="section === 'contact'" class="space-y-5">
      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.contactInfo") }}
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.contactName") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.contactName" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.contactPosition") }}</label>
            <input v-model="form.contactPosition" type="text" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">
              {{ t("settings.general.contactEmail") }} <span class="text-error-600">*</span>
            </label>
            <input v-model="form.contactEmail" type="email" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.contactPhone") }}</label>
            <input v-model="form.contactPhone" type="tel" class="input-base w-full text-sm" />
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-neutral-200 p-5">
        <h3 class="mb-4 text-sm font-semibold text-neutral-900">
          {{ t("settings.general.socialMedia") }}
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.linkedin") }}</label>
            <input v-model="form.linkedin" type="url" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.twitter") }}</label>
            <input v-model="form.twitter" type="url" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.facebook") }}</label>
            <input v-model="form.facebook" type="url" class="input-base w-full text-sm" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700">{{ t("settings.general.instagram") }}</label>
            <input v-model="form.instagram" type="url" class="input-base w-full text-sm" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "../../../i18n/index.js";

const STORAGE_KEY = "settings-general";

const { t, locale } = useI18n();
const section = ref("company");
const feedback = ref("");
const error = ref("");

const defaults = () => ({
  logo: null,
  name: "",
  companyType: "SARL",
  email: "",
  phone: "",
  website: "",
  foundedYear: new Date().getFullYear(),
  description: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  siret: "",
  siren: "",
  vatNumber: "",
  rcs: "",
  apeCode: "",
  shareCapital: "",
  bankName: "",
  iban: "",
  bic: "",
  accountHolder: "",
  contactName: "",
  contactPosition: "",
  contactEmail: "",
  contactPhone: "",
  linkedin: "",
  twitter: "",
  facebook: "",
  instagram: "",
});

const form = ref(defaults());

const sectionTabs = computed(() => {
  void locale.value;
  return [
    { id: "company", label: t("settings.general.section.company") },
    { id: "legal", label: t("settings.general.section.legal") },
    { id: "contact", label: t("settings.general.section.contact") },
  ];
});

function onLogo(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    error.value = t("settings.general.logoTooLarge");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    form.value.logo = reader.result;
    error.value = "";
  };
  reader.readAsDataURL(file);
}

function save() {
  feedback.value = "";
  error.value = "";
  if (!form.value.name?.trim() || !form.value.email?.trim() || !form.value.phone?.trim()) {
    error.value = t("settings.general.requiredFields");
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
  feedback.value = t("settings.general.saveSuccess");
}

function reset() {
  if (!confirm(t("settings.general.resetConfirm"))) return;
  form.value = defaults();
  localStorage.removeItem(STORAGE_KEY);
  feedback.value = "";
  error.value = "";
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) form.value = { ...defaults(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
});
</script>
