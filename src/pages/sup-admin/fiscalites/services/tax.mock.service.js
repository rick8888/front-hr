import {
  FISCAL_COUNTRIES,
  FISCAL_PROFILES_BY_CODE,
} from "../../../../data/fiscal/index.js";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const deepClone = (value) => JSON.parse(JSON.stringify(value));

let ruleIdCounter = 500;
let categoryIdCounter = 50;
let calculationBaseIdCounter = 20;
let declarationIdCounter = 100;
let versionIdCounter = 20;

function buildCountryList() {
  return FISCAL_COUNTRIES.map((c) => ({
    country_code: c.code,
    country_name: c.name,
    region: c.region,
    currency: c.currency,
    locale: c.locale,
    fiscal_year_start: c.fiscal_year_start,
    legal_framework: c.legal_framework,
  }));
}

function buildFiscalProfile(countryCode) {
  const country = FISCAL_COUNTRIES.find((c) => c.code === countryCode);
  const seed = FISCAL_PROFILES_BY_CODE[countryCode];
  if (!country || !seed) return null;

  return {
    country_code: country.code,
    country_name: country.name,
    currency: country.currency,
    locale: country.locale,
    fiscal_year_start: country.fiscal_year_start,
    legal_framework: country.legal_framework,
    status: seed.status,
    version: seed.version,
    last_updated: seed.last_updated,
    rules: deepClone(seed.rules),
    scales: deepClone(seed.scales ?? []),
    declaration_periods: deepClone(seed.declaration_periods ?? []),
  };
}

function buildCategories(countryCode) {
  const seed = FISCAL_PROFILES_BY_CODE[countryCode];
  return seed ? deepClone(seed.categories) : [];
}

function buildCalculationBases(countryCode) {
  const seed = FISCAL_PROFILES_BY_CODE[countryCode];
  return seed ? deepClone(seed.calculation_bases ?? []) : [];
}

function buildVersionHistory(countryCode) {
  const seed = FISCAL_PROFILES_BY_CODE[countryCode];
  if (!seed) return [];
  const profile = buildFiscalProfile(countryCode);
  const categories = buildCategories(countryCode);
  const calculation_bases = buildCalculationBases(countryCode);
  return seed.versions
    .map((v, index) => ({
      id: v.id,
      timestamp: v.timestamp,
      summary: v.summary,
      is_latest: index === seed.versions.length - 1,
      snapshot: {
        ...deepClone(profile),
        categories: deepClone(categories),
        calculation_bases: deepClone(calculation_bases),
      },
    }))
    .reverse();
}

function countRulesUsingBase(countryCode, baseId) {
  return (fiscalProfiles[countryCode]?.rules ?? []).filter((r) => r.base === baseId).length;
}

const COUNTRIES = buildCountryList();
const fiscalProfiles = {};
const versionHistory = {};
const categoriesByCountry = {};
const calculationBasesByCountry = {};

COUNTRIES.forEach((country) => {
  const code = country.country_code;
  fiscalProfiles[code] = buildFiscalProfile(code);
  categoriesByCountry[code] = buildCategories(code);
  calculationBasesByCountry[code] = buildCalculationBases(code);
  versionHistory[code] = buildVersionHistory(code);
});

function pushVersion(countryCode, summary) {
  versionIdCounter += 1;
  const entry = {
    id: `v-${countryCode}-${versionIdCounter}`,
    timestamp: new Date().toISOString(),
    summary,
    is_latest: true,
    snapshot: {
      ...deepClone(fiscalProfiles[countryCode]),
      categories: deepClone(categoriesByCountry[countryCode]),
      calculation_bases: deepClone(calculationBasesByCountry[countryCode]),
    },
  };
  versionHistory[countryCode].forEach((v) => {
    v.is_latest = false;
  });
  versionHistory[countryCode].unshift(entry);
  fiscalProfiles[countryCode].version += 1;
}

export const taxMockService = {
  async fetchCountries() {
    await delay();
    return deepClone(COUNTRIES);
  },

  async fetchFiscalProfile(countryCode) {
    await delay();
    const profile = fiscalProfiles[countryCode];
    if (!profile) throw new Error(`Profil fiscal introuvable pour ${countryCode}`);
    return deepClone(profile);
  },

  async fetchCategories(countryCode) {
    await delay(250);
    return deepClone(categoriesByCountry[countryCode] ?? []);
  },

  async fetchCalculationBases(countryCode) {
    await delay(250);
    return deepClone(calculationBasesByCountry[countryCode] ?? []);
  },

  async updateFiscalProfile(countryCode, payload) {
    await delay();
    fiscalProfiles[countryCode] = {
      ...fiscalProfiles[countryCode],
      ...payload,
      country_code: countryCode,
      last_updated: new Date().toISOString(),
    };
    pushVersion(countryCode, "Profil fiscal mis à jour");
    return deepClone(fiscalProfiles[countryCode]);
  },

  async addTaxRule(countryCode, rule) {
    await delay();
    ruleIdCounter += 1;
    const newRule = {
      id: `rule-${ruleIdCounter}`,
      code: rule.code || `CUSTOM_${ruleIdCounter}`,
      base: rule.base || "gross_salary",
      ceiling: rule.ceiling ?? null,
      is_mandatory: rule.is_mandatory ?? false,
      effective_from: rule.effective_from || new Date().toISOString().slice(0, 10),
      description: rule.description || "",
      is_active: true,
      currency: null,
      ...rule,
    };
    fiscalProfiles[countryCode].rules.push(newRule);
    fiscalProfiles[countryCode].last_updated = new Date().toISOString();
    pushVersion(countryCode, `Règle ajoutée : ${newRule.name}`);
    return deepClone(newRule);
  },

  async updateTaxRule(countryCode, ruleId, updates) {
    await delay();
    const profile = fiscalProfiles[countryCode];
    const index = profile.rules.findIndex((r) => r.id === ruleId);
    if (index === -1) throw new Error("Règle introuvable");
    profile.rules[index] = { ...profile.rules[index], ...updates };
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Règle modifiée : ${profile.rules[index].name}`);
    return deepClone(profile.rules[index]);
  },

  async deleteTaxRule(countryCode, ruleId) {
    await delay();
    const profile = fiscalProfiles[countryCode];
    const rule = profile.rules.find((r) => r.id === ruleId);
    profile.rules = profile.rules.filter((r) => r.id !== ruleId);
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Règle supprimée : ${rule?.name ?? ruleId}`);
    return true;
  },

  async addCategory(countryCode, category) {
    await delay(250);
    categoryIdCounter += 1;
    const newCategory = {
      id: category.id || `custom_${categoryIdCounter}`,
      label: category.label,
      is_active: true,
    };
    categoriesByCountry[countryCode].push(newCategory);
    pushVersion(countryCode, `Catégorie ajoutée : ${newCategory.label}`);
    return deepClone(newCategory);
  },

  async updateCategory(countryCode, categoryId, updates) {
    await delay(250);
    const list = categoriesByCountry[countryCode];
    const index = list.findIndex((c) => c.id === categoryId);
    if (index === -1) throw new Error("Catégorie introuvable");
    list[index] = { ...list[index], ...updates };
    pushVersion(countryCode, `Catégorie renommée : ${list[index].label}`);
    return deepClone(list[index]);
  },

  async disableCategory(countryCode, categoryId) {
    await delay(250);
    const list = categoriesByCountry[countryCode];
    const index = list.findIndex((c) => c.id === categoryId);
    if (index === -1) throw new Error("Catégorie introuvable");
    list[index].is_active = false;
    pushVersion(countryCode, `Catégorie désactivée : ${list[index].label}`);
    return deepClone(list[index]);
  },

  async addCalculationBase(countryCode, base) {
    await delay(250);
    calculationBaseIdCounter += 1;
    const newBase = {
      id: base.id || `base_${calculationBaseIdCounter}`,
      label: base.label,
      description: base.description || "",
      source: base.source || "payroll",
      is_active: true,
    };
    calculationBasesByCountry[countryCode].push(newBase);
    pushVersion(countryCode, `Base de calcul ajoutée : ${newBase.label}`);
    return deepClone(newBase);
  },

  async updateCalculationBase(countryCode, baseId, updates) {
    await delay(250);
    const list = calculationBasesByCountry[countryCode];
    const index = list.findIndex((b) => b.id === baseId);
    if (index === -1) throw new Error("Base de calcul introuvable");
    list[index] = { ...list[index], ...updates };
    pushVersion(countryCode, `Base de calcul modifiée : ${list[index].label}`);
    return deepClone(list[index]);
  },

  async disableCalculationBase(countryCode, baseId) {
    await delay(250);
    const usageCount = countRulesUsingBase(countryCode, baseId);
    if (usageCount > 0) {
      throw new Error(`Cette base est utilisée par ${usageCount} règle(s) et ne peut pas être désactivée.`);
    }
    const list = calculationBasesByCountry[countryCode];
    const index = list.findIndex((b) => b.id === baseId);
    if (index === -1) throw new Error("Base de calcul introuvable");
    list[index].is_active = false;
    pushVersion(countryCode, `Base de calcul désactivée : ${list[index].label}`);
    return deepClone(list[index]);
  },

  async fetchVersions(countryCode) {
    await delay();
    return deepClone(versionHistory[countryCode] ?? []);
  },

  async updateScaleBracket(countryCode, scaleId, bracketIndex, updates) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const scale = profile.scales?.find((s) => s.id === scaleId);
    if (!scale) throw new Error("Barème introuvable");
    scale.brackets[bracketIndex] = { ...scale.brackets[bracketIndex], ...updates };
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Tranche modifiée — ${scale.name}`);
    return deepClone(scale.brackets[bracketIndex]);
  },

  async addScaleBracket(countryCode, scaleId, bracketData) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const scale = profile.scales?.find((s) => s.id === scaleId);
    if (!scale) throw new Error("Barème introuvable");
    const last = scale.brackets[scale.brackets.length - 1];
    const newOrder = (last?.order ?? scale.brackets.length) + 1;
    const bracket = bracketData
      ? { order: newOrder, min: bracketData.min, max: bracketData.max ?? null, rate: bracketData.rate, deduction: bracketData.deduction }
      : {
          order: newOrder,
          min: last?.max ? last.max + 0.01 : 0,
          max: null,
          rate: 0,
          deduction: 0,
        };
    if (!bracketData && last && last.max != null) last.max = bracket.min - 0.01;
    scale.brackets.push(bracket);
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Tranche ajoutée — ${scale.name}`);
    return deepClone(bracket);
  },

  async deleteScaleBracket(countryCode, scaleId, bracketIndex) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const scale = profile.scales?.find((s) => s.id === scaleId);
    if (!scale || scale.brackets.length <= 1) throw new Error("Impossible de supprimer la dernière tranche");
    scale.brackets.splice(bracketIndex, 1);
    scale.brackets.forEach((b, i) => {
      b.order = i + 1;
    });
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Tranche supprimée — ${scale.name}`);
    return true;
  },

  async toggleScale(countryCode, scaleId, isActive) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const scale = profile.scales?.find((s) => s.id === scaleId);
    if (!scale) throw new Error("Barème introuvable");
    scale.is_active = isActive;
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Barème ${isActive ? "activé" : "désactivé"} — ${scale.name}`);
    return deepClone(scale);
  },

  async addDeclarationPeriod(countryCode, period) {
    await delay(250);
    declarationIdCounter += 1;
    const newPeriod = {
      id: `decl-${declarationIdCounter}`,
      code: period.code || `DECL_${declarationIdCounter}`,
      name: period.name,
      type: period.type || "social",
      authority: period.authority || "",
      frequency: period.frequency || "monthly",
      reference_period: period.reference_period || "previous_month",
      due_rule: period.due_rule || { type: "fixed_day_next_month", day: 15 },
      grace_days: period.grace_days ?? 0,
      filing_channel: period.filing_channel || "online",
      linked_categories: period.linked_categories ?? [],
      linked_rule_codes: period.linked_rule_codes ?? [],
      is_mandatory: period.is_mandatory ?? false,
      is_active: true,
      effective_from: period.effective_from || new Date().toISOString().slice(0, 10),
      description: period.description || "",
    };
    fiscalProfiles[countryCode].declaration_periods.push(newPeriod);
    fiscalProfiles[countryCode].last_updated = new Date().toISOString();
    pushVersion(countryCode, `Période de déclaration ajoutée : ${newPeriod.name}`);
    return deepClone(newPeriod);
  },

  async updateDeclarationPeriod(countryCode, periodId, updates) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const index = profile.declaration_periods.findIndex((p) => p.id === periodId);
    if (index === -1) throw new Error("Période de déclaration introuvable");
    profile.declaration_periods[index] = { ...profile.declaration_periods[index], ...updates };
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Période modifiée : ${profile.declaration_periods[index].name}`);
    return deepClone(profile.declaration_periods[index]);
  },

  async deleteDeclarationPeriod(countryCode, periodId) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const period = profile.declaration_periods.find((p) => p.id === periodId);
    profile.declaration_periods = profile.declaration_periods.filter((p) => p.id !== periodId);
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Période supprimée : ${period?.name ?? periodId}`);
    return true;
  },

  async toggleDeclarationPeriod(countryCode, periodId, isActive) {
    await delay(250);
    const profile = fiscalProfiles[countryCode];
    const period = profile.declaration_periods.find((p) => p.id === periodId);
    if (!period) throw new Error("Période de déclaration introuvable");
    period.is_active = isActive;
    profile.last_updated = new Date().toISOString();
    pushVersion(countryCode, `Période ${isActive ? "activée" : "désactivée"} — ${period.name}`);
    return deepClone(period);
  },

  async restoreVersion(countryCode, versionId) {
    await delay(600);
    const version = (versionHistory[countryCode] ?? []).find((v) => v.id === versionId);
    if (!version) throw new Error("Version introuvable");
    const restored = deepClone(version.snapshot);
    const { categories, calculation_bases, ...profile } = restored;
    profile.last_updated = new Date().toISOString();
    fiscalProfiles[countryCode] = profile;
    if (categories) categoriesByCountry[countryCode] = categories;
    if (calculation_bases) calculationBasesByCountry[countryCode] = calculation_bases;
    pushVersion(countryCode, `Restauration du ${new Date(version.timestamp).toLocaleString("fr-FR")}`);
    return deepClone(restored);
  },
};
