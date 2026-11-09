<template>
  <Modal
    :model-value="open"
    :title="isEdit ? 'Modifier l\'entreprise' : 'Ajouter une entreprise'"
    size="xl"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form class="space-y-5" @submit.prevent="submit">
      <nav class="-mx-1 flex flex-nowrap gap-0 overflow-x-auto border-b border-neutral-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-700'
              : 'border-transparent text-neutral-500 hover:text-neutral-800',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span
            v-if="tabHasErrors(tab.id)"
            class="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-red-500"
            aria-hidden="true"
          />
        </button>
      </nav>

      <!-- Identité légale -->
      <div v-show="activeTab === 'legal'" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Raison sociale <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text" class="input-base w-full" />
              <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Code interne <span class="text-red-500">*</span>
              </label>
              <input v-model="form.code" type="text" class="input-base w-full uppercase" />
              <p v-if="errors.code" class="mt-1 text-xs text-red-600">{{ errors.code }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Sous-domaine</label>
              <div class="flex items-center gap-1">
                <input v-model="form.subdomain" type="text" class="input-base w-full" placeholder="acme" />
                <span class="shrink-0 text-xs text-neutral-400">.opencorebs.com</span>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Forme juridique</label>
              <select v-model="form.legal_form" class="input-base w-full">
                <option v-for="lf in legalForms" :key="lf" :value="lf">{{ lf }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">N° d'immatriculation (SIRET / ICE / RC)</label>
              <input v-model="form.registration_number" type="text" class="input-base w-full" placeholder="ex: 123 456 789 00012" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">N° TVA / Identifiant fiscal</label>
              <input v-model="form.vat_number" type="text" class="input-base w-full" placeholder="ex: FR12345678901" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Secteur d'activité</label>
              <select v-model="form.industry" class="input-base w-full">
                <option v-for="ind in industries" :key="ind" :value="ind">{{ ind }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Date de création</label>
              <input v-model="form.founded_at" type="date" class="input-base w-full" />
            </div>
          </div>
      </div>

      <!-- Localisation & paramètres -->
      <div v-show="activeTab === 'settings'" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Pays <span class="text-red-500">*</span>
              </label>
              <select v-model.number="form.country_id" class="input-base w-full" @change="onCountryChange">
                <option v-for="c in countries" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.code }})
                </option>
              </select>
              <p v-if="errors.country_id" class="mt-1 text-xs text-red-600">{{ errors.country_id }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Devise</label>
              <select v-model="form.currency" class="input-base w-full">
                <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Langue par défaut</label>
              <select v-model="form.language" class="input-base w-full">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Fuseau horaire</label>
              <select v-model="form.timezone" class="input-base w-full">
                <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Effectif</label>
              <select v-model="form.headcount_range" class="input-base w-full">
                <option v-for="hr in headcountRanges" :key="hr" :value="hr">{{ hr }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Plan d'abonnement</label>
              <select v-model="form.plan" class="input-base w-full">
                <option value="Starter">Starter</option>
                <option value="Business">Business</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-800">Site web</label>
              <input v-model="form.website" type="url" class="input-base w-full" placeholder="https://www.exemple.com" />
            </div>
          </div>
        <div v-if="isEdit" class="mt-4 rounded-lg border border-neutral-100 bg-neutral-50/80 px-4 py-3">
          <SwitchField
            v-model="form.is_active"
            label="Entreprise active"
            hint="Désactiver pour bloquer l'accès à la plateforme"
          />
        </div>
      </div>

      <!-- Adresse du siège -->
      <div v-show="activeTab === 'address'" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-800">Adresse</label>
              <input v-model="form.address.street" type="text" class="input-base w-full" placeholder="N°, rue, complément" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Ville</label>
              <input v-model="form.address.city" type="text" class="input-base w-full" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Code postal</label>
              <input v-model="form.address.postal_code" type="text" class="input-base w-full" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-800">Région / Province</label>
              <input v-model="form.address.state" type="text" class="input-base w-full" />
            </div>
          </div>
      </div>

      <!-- Contact principal -->
      <div v-show="activeTab === 'contact'" class="space-y-6">
        <p class="text-sm text-neutral-600">
          Responsable administratif ou RH — point de contact principal pour la gestion du compte plateforme.
        </p>

        <section>
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Identité du représentant</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Civilité</label>
              <select v-model="form.primary_contact.title" class="input-base w-full">
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Mlle">Mlle</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Fonction / Poste <span class="text-red-500">*</span>
              </label>
              <input v-model="form.primary_contact.job_title" type="text" class="input-base w-full" placeholder="ex: DRH, Directeur général" />
              <p v-if="errors['primary_contact.job_title']" class="mt-1 text-xs text-red-600">{{ errors['primary_contact.job_title'] }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input v-model="form.primary_contact.first_name" type="text" class="input-base w-full" />
              <p v-if="errors['primary_contact.first_name']" class="mt-1 text-xs text-red-600">{{ errors['primary_contact.first_name'] }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Nom <span class="text-red-500">*</span>
              </label>
              <input v-model="form.primary_contact.last_name" type="text" class="input-base w-full" />
              <p v-if="errors['primary_contact.last_name']" class="mt-1 text-xs text-red-600">{{ errors['primary_contact.last_name'] }}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Coordonnées</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Email professionnel <span class="text-red-500">*</span>
              </label>
              <input v-model="form.primary_contact.email" type="email" class="input-base w-full" />
              <p v-if="errors['primary_contact.email']" class="mt-1 text-xs text-red-600">{{ errors['primary_contact.email'] }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Téléphone fixe <span class="text-red-500">*</span>
              </label>
              <input v-model="form.primary_contact.phone" type="tel" class="input-base w-full" placeholder="+33 1 23 45 67 89" />
              <p v-if="errors['primary_contact.phone']" class="mt-1 text-xs text-red-600">{{ errors['primary_contact.phone'] }}</p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Mobile</label>
              <input v-model="form.primary_contact.mobile" type="tel" class="input-base w-full" placeholder="+33 6 12 34 56 78" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">Langue de communication</label>
              <select v-model="form.primary_contact.language" class="input-base w-full">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-800">Rôle d'accès plateforme</label>
              <div class="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm text-sky-900">
                <span class="font-semibold">Tenant</span>
                <span class="text-sky-700"> — accès portail client (gestion du compte entreprise)</span>
              </div>
              <p class="mt-1 text-xs text-neutral-500">
                Un compte utilisateur sera créé ou mis à jour avec ce rôle à l'enregistrement.
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Connexion -->
      <div v-show="activeTab === 'login'" class="space-y-6">
        <p class="text-sm text-neutral-600">
          Identifiants du compte tenant associé au contact principal
          <span v-if="form.primary_contact.email" class="font-medium text-neutral-800">
            ({{ form.primary_contact.email }})
          </span>.
        </p>

        <section>
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Mot de passe
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Mot de passe
                <span v-if="!isEdit" class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.login.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  class="input-base w-full pr-10"
                  :placeholder="isEdit ? 'Laisser vide pour ne pas modifier' : 'Minimum 8 caractères'"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  @click="showLoginPassword = !showLoginPassword"
                >
                  <svg
                    v-if="!showLoginPassword"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="errors['login.password']" class="mt-1 text-xs text-red-600">
                {{ errors['login.password'] }}
              </p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-800">
                Confirmation du mot de passe
                <span v-if="!isEdit" class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.login.password_confirmation"
                  :type="showLoginPasswordConfirm ? 'text' : 'password'"
                  class="input-base w-full pr-10"
                  :placeholder="isEdit ? 'Laisser vide pour ne pas modifier' : 'Répétez le mot de passe'"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  @click="showLoginPasswordConfirm = !showLoginPasswordConfirm"
                >
                  <svg
                    v-if="!showLoginPasswordConfirm"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="errors['login.password_confirmation']" class="mt-1 text-xs text-red-600">
                {{ errors['login.password_confirmation'] }}
              </p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs text-neutral-500">
                {{
                  isEdit
                    ? "Laissez les champs vides pour conserver le mot de passe actuel du compte."
                    : "Ces identifiants permettront au contact principal de se connecter au portail tenant."
                }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div class="flex justify-end gap-3 border-t border-neutral-100 pt-4">
        <button type="button" class="btn-outline" @click="close">Annuler</button>
        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer" }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import SwitchField from "../../../../components/common/SwitchField.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  company: { type: Object, default: null },
  countries: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "submit"]);
const defaultCurrency = String(import.meta.env.VITE_DEFAULT_CURRENCY || "USD").toUpperCase();

const tabs = [
  { id: "legal", label: "Identité légale" },
  { id: "settings", label: "Localisation & paramètres" },
  { id: "address", label: "Adresse du siège" },
  { id: "contact", label: "Contact principal" },
  { id: "login", label: "Connexion" },
];

const activeTab = ref("legal");
const showLoginPassword = ref(false);
const showLoginPasswordConfirm = ref(false);

const legalForms = ["SARL", "SA", "SAS", "SASU", "EURL", "SNC", "Auto-entrepreneur", "Association", "Autre"];
const industries = [
  "Technologies",
  "Services",
  "Industrie",
  "Commerce",
  "Santé",
  "Éducation",
  "Finance",
  "Transport & Logistique",
  "BTP",
  "Autre",
];
const headcountRanges = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const currencies = computed(() => [...new Set([
  "EUR", "MAD", "XOF", "CDF", "TND", "USD", "CAD",
  ...props.countries.map((country) => String(country.currency || "").toUpperCase()),
].filter(Boolean))].sort());
const timezones = [
  "Europe/Paris",
  "Africa/Casablanca",
  "Africa/Dakar",
  "Africa/Abidjan",
  "Africa/Tunis",
  "Europe/Brussels",
  "America/Montreal",
];

const isEdit = computed(() => Boolean(props.company?.id));

const TENANT_ROLE = "tenant";

const emptyContact = () => ({
  title: "M.",
  first_name: "",
  last_name: "",
  job_title: "",
  email: "",
  phone: "",
  mobile: "",
  language: "fr",
  role: TENANT_ROLE,
});

const emptyLogin = () => ({
  password: "",
  password_confirmation: "",
});

const emptyForm = () => ({
  name: "",
  code: "",
  subdomain: "",
  legal_form: "SARL",
  registration_number: "",
  vat_number: "",
  industry: "Services",
  founded_at: "",
  country_id: null,
  currency: defaultCurrency,
  language: "fr",
  timezone: "Europe/Paris",
  headcount_range: "11-50",
  plan: "Business",
  website: "",
  address: { street: "", city: "", postal_code: "", state: "" },
  primary_contact: emptyContact(),
  login: emptyLogin(),
  is_active: true,
});

const form = reactive(emptyForm());
const errors = reactive({});

function resetErrors() {
  Object.keys(errors).forEach((k) => delete errors[k]);
}

function mapCompanyToForm(company) {
  return {
    name: company.name ?? "",
    code: company.code ?? "",
    subdomain: company.subdomain ?? "",
    legal_form: company.legal_form ?? "SARL",
    registration_number: company.registration_number ?? "",
    vat_number: company.vat_number ?? "",
    industry: company.industry ?? "Services",
    founded_at: company.founded_at ?? "",
    country_id: company.country_id ?? null,
    currency: company.currency ?? defaultCurrency,
    language: company.language ?? "fr",
    timezone: company.timezone ?? "Europe/Paris",
    headcount_range: company.headcount_range ?? "11-50",
    plan: company.plan ?? "Business",
    website: company.website ?? "",
    address: {
      street: company.address?.street ?? "",
      city: company.address?.city ?? "",
      postal_code: company.address?.postal_code ?? "",
      state: company.address?.state ?? "",
    },
    primary_contact: {
      ...emptyContact(),
      ...company.primary_contact,
      role: company.primary_contact?.role ?? TENANT_ROLE,
      email: company.primary_contact?.email ?? company.email ?? "",
      phone: company.primary_contact?.phone ?? company.phone ?? "",
    },
    login: emptyLogin(),
    is_active: company.is_active ?? true,
  };
}

watch(
  () => [props.open, props.company],
  () => {
    resetErrors();
    activeTab.value = "legal";
    showLoginPassword.value = false;
    showLoginPasswordConfirm.value = false;
    if (!props.open) {
      Object.assign(form, emptyForm());
      form.primary_contact = emptyContact();
      form.login = emptyLogin();
      form.address = { street: "", city: "", postal_code: "", state: "" };
      return;
    }
    if (props.company) {
      const mapped = mapCompanyToForm(props.company);
      Object.assign(form, mapped);
      Object.assign(form.address, mapped.address);
      Object.assign(form.primary_contact, mapped.primary_contact);
      Object.assign(form.login, mapped.login);
    } else {
      Object.assign(form, emptyForm());
      form.country_id = props.countries[0]?.id ?? null;
      form.primary_contact = emptyContact();
      form.login = emptyLogin();
      form.address = { street: "", city: "", postal_code: "", state: "" };
      form.currency = props.countries[0]?.currency || defaultCurrency;
    }
  },
  { immediate: true }
);

function onCountryChange() {
  const country = props.countries.find((c) => c.id === form.country_id);
  form.currency = country?.currency || defaultCurrency;
}

const tabErrorMap = {
  legal: ["name", "code"],
  settings: ["country_id"],
  address: [],
  contact: [
    "primary_contact.first_name",
    "primary_contact.last_name",
    "primary_contact.job_title",
    "primary_contact.email",
    "primary_contact.phone",
  ],
  login: ["login.password", "login.password_confirmation"],
};

function tabHasErrors(tabId) {
  return (tabErrorMap[tabId] ?? []).some((k) => errors[k]);
}

function validate() {
  resetErrors();
  let valid = true;
  let firstErrorTab = null;

  if (!form.name.trim()) {
    errors.name = "La raison sociale est obligatoire.";
    valid = false;
    firstErrorTab ??= "legal";
  }
  if (!form.code.trim()) {
    errors.code = "Le code est obligatoire.";
    valid = false;
    firstErrorTab ??= "legal";
  }
  if (!form.country_id) {
    errors.country_id = "Le pays est obligatoire.";
    valid = false;
    firstErrorTab ??= "settings";
  }
  if (!form.primary_contact.first_name.trim()) {
    errors["primary_contact.first_name"] = "Le prénom est obligatoire.";
    valid = false;
    firstErrorTab ??= "contact";
  }
  if (!form.primary_contact.last_name.trim()) {
    errors["primary_contact.last_name"] = "Le nom est obligatoire.";
    valid = false;
    firstErrorTab ??= "contact";
  }
  if (!form.primary_contact.job_title.trim()) {
    errors["primary_contact.job_title"] = "La fonction est obligatoire.";
    valid = false;
    firstErrorTab ??= "contact";
  }
  if (!form.primary_contact.email.trim()) {
    errors["primary_contact.email"] = "L'email est obligatoire.";
    valid = false;
    firstErrorTab ??= "contact";
  }
  if (!form.primary_contact.phone.trim()) {
    errors["primary_contact.phone"] = "Le téléphone est obligatoire.";
    valid = false;
    firstErrorTab ??= "contact";
  }
  const password = form.login.password.trim();
  const passwordConfirmation = form.login.password_confirmation.trim();

  if (!isEdit.value && !password) {
    errors["login.password"] = "Le mot de passe est obligatoire.";
    valid = false;
    firstErrorTab ??= "login";
  } else if (password && password.length < 8) {
    errors["login.password"] = "Le mot de passe doit contenir au moins 8 caractères.";
    valid = false;
    firstErrorTab ??= "login";
  }

  if (!isEdit.value && !passwordConfirmation) {
    errors["login.password_confirmation"] = "La confirmation est obligatoire.";
    valid = false;
    firstErrorTab ??= "login";
  } else if (password && password !== passwordConfirmation) {
    errors["login.password_confirmation"] = "Les mots de passe ne correspondent pas.";
    valid = false;
    firstErrorTab ??= "login";
  } else if (!password && passwordConfirmation) {
    errors["login.password"] = "Saisissez le mot de passe pour le confirmer.";
    valid = false;
    firstErrorTab ??= "login";
  }

  if (!valid && firstErrorTab) activeTab.value = firstErrorTab;
  return valid;
}

function close() {
  emit("update:open", false);
}

function submit() {
  if (!validate()) return;

  const pc = form.primary_contact;
  emit("submit", {
    name: form.name.trim(),
    code: form.code.trim().toUpperCase(),
    subdomain: form.subdomain.trim().toLowerCase() || form.code.trim().toLowerCase(),
    legal_form: form.legal_form,
    registration_number: form.registration_number.trim(),
    vat_number: form.vat_number.trim(),
    industry: form.industry,
    founded_at: form.founded_at || null,
    country_id: form.country_id,
    currency: form.currency,
    language: form.language,
    timezone: form.timezone,
    headcount_range: form.headcount_range,
    plan: form.plan,
    website: form.website.trim(),
    address: {
      street: form.address.street.trim(),
      city: form.address.city.trim(),
      postal_code: form.address.postal_code.trim(),
      state: form.address.state.trim(),
    },
    primary_contact: {
      title: pc.title,
      first_name: pc.first_name.trim(),
      last_name: pc.last_name.trim(),
      job_title: pc.job_title.trim(),
      email: pc.email.trim(),
      phone: pc.phone.trim(),
      mobile: pc.mobile.trim(),
      language: pc.language,
      role: TENANT_ROLE,
      ...(form.login.password.trim() ? { password: form.login.password.trim() } : {}),
    },
    email: pc.email.trim(),
    phone: pc.phone.trim(),
    ...(isEdit.value ? { is_active: form.is_active } : {}),
  });
}
</script>
