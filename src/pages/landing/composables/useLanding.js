import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  landingApiService,
  normalizeLandingPlan,
  normalizeLandingService,
} from "../services/landing.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

const FEATURED_CODES = [
  "employees",
  "attendance",
  "leave",
  "self_service",
  "payroll",
  "recruitment",
];

const FALLBACK_SERVICES = [
  { code: "employees", label: "Gestion des employés", description: "Fiches employés, organigramme, contrats", category: "core", sort_order: 1 },
  { code: "attendance", label: "Présences & pointage", description: "Suivi des heures, retards, absences", category: "core", sort_order: 2 },
  { code: "leave", label: "Congés & absences", description: "Demandes, soldes, calendrier d'équipe", category: "core", sort_order: 3 },
  { code: "self_service", label: "Espace salarié", description: "Portail self-service pour les collaborateurs", category: "core", sort_order: 4 },
  { code: "payroll", label: "Paie", description: "Bulletins, composantes, déclarations", category: "hr", sort_order: 6 },
  { code: "recruitment", label: "Recrutement", description: "Offres, candidats, pipeline", category: "advanced", sort_order: 8 },
].map(normalizeLandingService);

const FALLBACK_PLANS = [
  { code: "free", name: "Free", tagline: "Pour découvrir sans pression", price_monthly: 0, is_free: true, is_highlighted: false, sort_order: 1, max_employees: 15, included_services: ["employees", "attendance", "self_service"] },
  { code: "starter", name: "Starter", tagline: "Les essentiels du quotidien RH", price_monthly: 49, is_highlighted: false, sort_order: 2, max_employees: 50, included_services: ["employees", "attendance", "leave", "self_service", "documents"] },
  { code: "premium", name: "Premium", tagline: "Quand l'équipe grandit avec vous", price_monthly: 149, is_highlighted: true, sort_order: 3, max_employees: 200, included_services: ["employees", "attendance", "leave", "self_service", "documents", "payroll", "expenses", "recruitment", "training", "analytics"] },
  { code: "enterprise", name: "Entreprise", tagline: "Sans limite, avec un vrai accompagnement", price_monthly: 499, is_highlighted: false, sort_order: 4, max_employees: null, included_services: ["employees", "attendance", "leave", "self_service", "documents", "payroll", "expenses", "recruitment", "training", "analytics", "api_access", "support_priority"] },
].map(normalizeLandingPlan);

function emptyForm() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    subdomain: "",
    countryId: "",
    plan: "free",
    agreeToTerms: false,
  };
}

function slugify(value, { upper = false } = {}) {
  const slug = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  if (!slug) return upper ? "ENTREPRISE" : "entreprise";
  return upper ? slug.toUpperCase() : slug;
}

export function useLanding() {
  const { t, locale, setLocale } = useI18n();
  const route = useRoute();
  const router = useRouter();

  const loading = ref(true);
  const submitting = ref(false);
  const error = ref("");
  const successMessage = ref("");

  const services = ref(FALLBACK_SERVICES);
  const plans = ref(FALLBACK_PLANS);
  const countries = ref([]);
  const form = ref(emptyForm());
  const menuOpen = ref(false);

  const featuredServices = computed(() => {
    const byCode = new Map(services.value.map((item) => [item.code, item]));
    const featured = FEATURED_CODES.map((code) => byCode.get(code)).filter(Boolean);
    return featured.length ? featured : services.value.slice(0, 6);
  });

  const visiblePlans = computed(() =>
    plans.value
      .filter((plan) => plan.isActive)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );

  const selectedPlan = computed(
    () => visiblePlans.value.find((plan) => plan.code === form.value.plan) || visiblePlans.value[0]
  );

  const dayStories = computed(() => {
    void locale.value;
    return [
      t("landing.hero.story1"),
      t("landing.hero.story2"),
      t("landing.hero.story3"),
      t("landing.hero.story4"),
    ];
  });

  const whatsappPoints = computed(() => {
    void locale.value;
    return [
      t("landing.whatsapp.point1"),
      t("landing.whatsapp.point2"),
      t("landing.whatsapp.point3"),
    ];
  });

  const chosenPlanLabel = computed(() => {
    void locale.value;
    const plan = selectedPlan.value;
    if (!plan) return "";
    return t("landing.form.chosenPlan", {
      name: plan.name,
      price: formatPrice(plan),
    });
  });

  function serviceName(code) {
    const key = `landing.service.${code}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    return services.value.find((item) => item.code === code)?.label || code;
  }

  function serviceBlurb(service) {
    const key = `landing.serviceHint.${service.code}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    return service.description || "";
  }

  function formatPrice(plan) {
    if (!plan) return "";
    if (plan.isFree) return t("landing.plans.freePrice");
    return t("landing.plans.price", { amount: plan.priceMonthly });
  }

  function formatLimit(value, infiniteKey) {
    if (value == null) return t(infiniteKey);
    return String(value);
  }

  function closeMenu() {
    menuOpen.value = false;
  }

  function toggleMenu() {
    menuOpen.value = !menuOpen.value;
  }

  function scrollToSignup() {
    closeMenu();
    const el = document.getElementById("inscription");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToSection(id) {
    closeMenu();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function choosePlan(code) {
    form.value.plan = code;
    successMessage.value = "";
    error.value = "";
    scrollToSignup();
  }

  function onCompanyNameInput(event) {
    const name = event.target.value;
    const previousSlug = slugify(form.value.companyName);
    form.value.companyName = name;
    if (!form.value.subdomain || form.value.subdomain === previousSlug) {
      form.value.subdomain = slugify(name);
    }
  }

  function validate() {
    if (!form.value.firstName.trim() || !form.value.lastName.trim()) {
      return t("landing.form.errorName");
    }
    if (!form.value.email.trim()) {
      return t("landing.form.errorEmail");
    }
    if ((form.value.password || "").length < 8) {
      return t("landing.form.errorPassword");
    }
    if (form.value.password !== form.value.confirmPassword) {
      return t("landing.form.errorPasswordMatch");
    }
    if (!form.value.companyName.trim()) {
      return t("landing.form.errorCompany");
    }
    if (!form.value.countryId) {
      return t("landing.form.errorCountry");
    }
    if (!form.value.agreeToTerms) {
      return t("landing.form.errorTerms");
    }
    return "";
  }

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const [planList, serviceList, countryList] = await Promise.all([
        landingApiService.fetchPlans().catch(() => []),
        landingApiService.fetchServices().catch(() => []),
        landingApiService.fetchCountries().catch(() => []),
      ]);

      plans.value = planList.filter((p) => p.isActive).length
        ? planList.filter((p) => p.isActive)
        : FALLBACK_PLANS;
      services.value = serviceList.length ? serviceList : FALLBACK_SERVICES;
      countries.value = countryList;

      const defaultCountry =
        countryList.find((c) => ["FR", "MA", "CI", "SN"].includes(String(c.code || "").toUpperCase())) ||
        countryList[0];
      if (defaultCountry && !form.value.countryId) {
        form.value.countryId = defaultCountry.id;
      }

      const defaultPlan = plans.value.find((p) => p.isFree) || plans.value[0];
      if (defaultPlan && !form.value.plan) {
        form.value.plan = defaultPlan.code;
      }
    } finally {
      loading.value = false;
      if (route.hash === "#inscription") {
        requestAnimationFrame(() => scrollToSignup());
      }
    }
  }

  async function submit() {
    if (submitting.value) return false;
    successMessage.value = "";
    const validation = validate();
    if (validation) {
      error.value = validation;
      return false;
    }

    submitting.value = true;
    error.value = "";
    const country = countries.value.find((c) => c.id === Number(form.value.countryId));
    const payload = {
      country_id: Number(form.value.countryId),
      name: form.value.companyName.trim(),
      code: slugify(form.value.companyName, { upper: true }),
      subdomain: slugify(form.value.subdomain || form.value.companyName),
      plan: form.value.plan,
      currency: country?.currency || "EUR",
      email: form.value.email.trim(),
      phone: form.value.phone.trim() || null,
      primary_contact: {
        first_name: form.value.firstName.trim(),
        last_name: form.value.lastName.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim() || null,
        job_title: "Dirigeant",
        role: "tenant",
        password: form.value.password,
      },
    };

    try {
      await landingApiService.registerTenant(payload);
      successMessage.value = t("landing.form.success");
      form.value = {
        ...emptyForm(),
        plan: payload.plan,
        countryId: payload.country_id,
      };
      return true;
    } catch (e) {
      error.value = parseApiError(e) || t("landing.form.saveError");
      return false;
    } finally {
      submitting.value = false;
    }
  }

  function goLogin() {
    router.push("/login");
  }

  function switchLocale(code) {
    setLocale(code);
  }

  onMounted(load);

  return {
    loading,
    submitting,
    error,
    successMessage,
    form,
    menuOpen,
    countries,
    featuredServices,
    visiblePlans,
    selectedPlan,
    dayStories,
    whatsappPoints,
    chosenPlanLabel,
    locale,
    switchLocale,
    serviceName,
    serviceBlurb,
    formatPrice,
    formatLimit,
    choosePlan,
    onCompanyNameInput,
    closeMenu,
    toggleMenu,
    goToSection,
    scrollToSignup,
    submit,
    goLogin,
  };
}
