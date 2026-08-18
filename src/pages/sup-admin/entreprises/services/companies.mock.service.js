const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const deepClone = (value) => JSON.parse(JSON.stringify(value));

let idCounter = 10;

const companies = [
  {
    id: "cmp-001",
    name: "Acme Corporation",
    code: "ACME",
    subdomain: "acme",
    legal_form: "SAS",
    registration_number: "123 456 789 00012",
    vat_number: "FR12345678901",
    industry: "Technologies",
    founded_at: "2015-03-12",
    country: "France",
    currency: "EUR",
    language: "fr",
    timezone: "Europe/Paris",
    headcount_range: "51-200",
    plan: "Business",
    website: "https://www.acme.demo",
    address: { street: "12 Avenue des Champs-Élysées", city: "Paris", postal_code: "75008", state: "Île-de-France" },
    primary_contact: {
      title: "Mme",
      first_name: "Sophie",
      last_name: "Martin",
      job_title: "Directrice RH",
      email: "contact@acme.demo",
      phone: "+33 1 42 00 00 01",
      mobile: "+33 6 12 34 56 78",
      language: "fr",
    },
    email: "contact@acme.demo",
    phone: "+33 1 42 00 00 01",
    is_active: true,
    created_at: "2025-11-12T10:00:00.000Z",
  },
  {
    id: "cmp-002",
    name: "Bravo RH Demo",
    code: "BRAVO",
    subdomain: "bravo-demo",
    legal_form: "SARL",
    registration_number: "123456789",
    vat_number: "MA123456789",
    industry: "Services",
    founded_at: "2020-06-01",
    country: "Maroc",
    currency: "MAD",
    language: "fr",
    timezone: "Africa/Casablanca",
    headcount_range: "11-50",
    plan: "Enterprise",
    website: "https://bravorh.demo",
    address: { street: "45 Bd Mohammed V", city: "Casablanca", postal_code: "20000", state: "Casablanca-Settat" },
    primary_contact: {
      title: "M.",
      first_name: "Youssef",
      last_name: "Benali",
      job_title: "DRH",
      email: "admin@bravorh.com",
      phone: "+212 5 22 00 00 02",
      mobile: "+212 6 11 22 33 44",
      language: "fr",
    },
    email: "admin@bravorh.com",
    phone: "+212 5 22 00 00 02",
    is_active: true,
    created_at: "2025-12-01T08:30:00.000Z",
  },
  {
    id: "cmp-003",
    name: "TechNova SARL",
    code: "TECHNOVA",
    subdomain: "technova",
    legal_form: "SARL",
    registration_number: "987 654 321 00045",
    vat_number: "FR98765432109",
    industry: "Technologies",
    founded_at: "2018-09-20",
    country: "France",
    currency: "EUR",
    language: "fr",
    timezone: "Europe/Paris",
    headcount_range: "1-10",
    plan: "Starter",
    website: "https://technova.io",
    address: { street: "8 Rue de la République", city: "Lyon", postal_code: "69002", state: "Auvergne-Rhône-Alpes" },
    primary_contact: {
      title: "M.",
      first_name: "Lucas",
      last_name: "Dupont",
      job_title: "Responsable RH",
      email: "hr@technova.io",
      phone: "+33 4 78 00 00 03",
      mobile: "",
      language: "fr",
    },
    email: "hr@technova.io",
    phone: "+33 4 78 00 00 03",
    is_active: false,
    created_at: "2026-01-15T14:20:00.000Z",
  },
  {
    id: "cmp-004",
    name: "GreenLogistics",
    code: "GREENLOG",
    subdomain: "greenlog",
    legal_form: "SA",
    registration_number: "SN-RC-2020-B-12345",
    vat_number: "",
    industry: "Transport & Logistique",
    founded_at: "2020-01-15",
    country: "Sénégal",
    currency: "XOF",
    language: "fr",
    timezone: "Africa/Dakar",
    headcount_range: "201-500",
    plan: "Business",
    website: "https://greenlogistics.com",
    address: { street: "Zone industriale de Diamniadio", city: "Dakar", postal_code: "18000", state: "Dakar" },
    primary_contact: {
      title: "Mme",
      first_name: "Aïssatou",
      last_name: "Diop",
      job_title: "Directrice des Ressources Humaines",
      email: "ops@greenlogistics.com",
      phone: "+221 33 800 00 04",
      mobile: "+221 77 123 45 67",
      language: "fr",
    },
    email: "ops@greenlogistics.com",
    phone: "+221 33 800 00 04",
    is_active: true,
    created_at: "2026-02-03T09:15:00.000Z",
  },
  {
    id: "cmp-005",
    name: "Atlas Consulting",
    code: "ATLAS",
    subdomain: "atlas",
    legal_form: "SARL",
    registration_number: "RC 456789",
    vat_number: "ICE 001234567890123",
    industry: "Finance",
    founded_at: "2019-11-05",
    country: "Maroc",
    currency: "MAD",
    language: "fr",
    timezone: "Africa/Casablanca",
    headcount_range: "11-50",
    plan: "Starter",
    website: "",
    address: { street: "Immeuble Atlas, Av. Hassan II", city: "Rabat", postal_code: "10000", state: "Rabat-Salé-Kénitra" },
    primary_contact: {
      title: "M.",
      first_name: "Karim",
      last_name: "Alaoui",
      job_title: "Gérant",
      email: "info@atlas-consulting.ma",
      phone: "+212 5 37 00 00 05",
      mobile: "+212 6 55 44 33 22",
      language: "fr",
    },
    email: "info@atlas-consulting.ma",
    phone: "+212 5 37 00 00 05",
    is_active: false,
    created_at: "2026-03-10T16:45:00.000Z",
  },
];

export const companiesMockService = {
  async fetchCompanies() {
    await delay();
    return deepClone(companies);
  },

  async createCompany(payload) {
    await delay();
    idCounter += 1;
    const company = {
      id: `cmp-${String(idCounter).padStart(3, "0")}`,
      is_active: true,
      created_at: new Date().toISOString(),
      ...payload,
    };
    companies.unshift(company);
    return deepClone(company);
  },

  async updateCompany(id, updates) {
    await delay();
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Entreprise introuvable");
    companies[index] = { ...companies[index], ...updates };
    return deepClone(companies[index]);
  },

  async toggleCompanyStatus(id, isActive) {
    return this.updateCompany(id, { is_active: isActive });
  },

  async deleteCompany(id) {
    await delay();
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Entreprise introuvable");
    companies.splice(index, 1);
    return true;
  },
};
