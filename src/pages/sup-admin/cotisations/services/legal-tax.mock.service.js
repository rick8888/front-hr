import LEGAL_TAX_COUNTRIES from "../../../../data/legal-tax/countries.json";
import LEGAL_TAXES_SEED from "../../../../data/legal-tax/legal-taxes.json";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const deepClone = (value) => JSON.parse(JSON.stringify(value));

let countries = deepClone(LEGAL_TAX_COUNTRIES);
let legalTaxes = deepClone(LEGAL_TAXES_SEED);
let taxIdCounter = 20;
let bracketIdCounter = 20;

function sortTaxes(list) {
  return [...list].sort((a, b) => {
    if (a.country_id !== b.country_id) return a.country_id - b.country_id;
    return (a.sequence ?? 0) - (b.sequence ?? 0);
  });
}

function normalizeBrackets(brackets = []) {
  return brackets.map((b, i) => ({
    id: b.id ?? ++bracketIdCounter,
    min_amount: b.min_amount ?? 0,
    max_amount: b.max_amount ?? null,
    rate: b.rate ?? 0,
    fixed_deduction: b.fixed_deduction ?? 0,
    sequence: b.sequence ?? i,
  }));
}

export const legalTaxMockService = {
  async fetchCountries() {
    await delay(250);
    return deepClone(countries);
  },

  async fetchLegalTaxes(countryId = null) {
    await delay();
    let list = legalTaxes;
    if (countryId) list = list.filter((t) => t.country_id === countryId);
    return sortTaxes(deepClone(list));
  },

  async fetchLegalTax(id) {
    await delay(200);
    const tax = legalTaxes.find((t) => t.id === id);
    if (!tax) throw new Error("Cotisation introuvable");
    return deepClone(tax);
  },

  async createLegalTax(payload) {
    await delay();
    const exists = legalTaxes.some(
      (t) => t.country_id === payload.country_id && t.code === payload.code
    );
    if (exists) throw new Error(`Le code ${payload.code} existe déjà pour ce pays.`);

    taxIdCounter += 1;
    const tax = {
      id: taxIdCounter,
      country_id: payload.country_id,
      code: payload.code?.trim().toUpperCase(),
      name: payload.name?.trim(),
      description: payload.description?.trim() || "",
      type: payload.type,
      base_target: payload.base_target,
      employer_rate: payload.employer_rate ?? 0,
      employee_rate: payload.employee_rate ?? 0,
      ceiling: payload.ceiling ?? null,
      floor: payload.floor ?? null,
      formula: payload.formula ?? null,
      reduces_taxable: !!payload.reduces_taxable,
      is_active: payload.is_active !== false,
      sequence: payload.sequence ?? 100,
      effective_from: payload.effective_from || null,
      effective_to: payload.effective_to || null,
      brackets: normalizeBrackets(payload.brackets ?? []),
    };
    legalTaxes.push(tax);
    return deepClone(tax);
  },

  async updateLegalTax(id, payload) {
    await delay();
    const index = legalTaxes.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Cotisation introuvable");

    const duplicate = legalTaxes.some(
      (t) =>
        t.id !== id &&
        t.country_id === (payload.country_id ?? legalTaxes[index].country_id) &&
        t.code === (payload.code ?? legalTaxes[index].code)
    );
    if (duplicate) throw new Error(`Le code ${payload.code} existe déjà pour ce pays.`);

    const updated = {
      ...legalTaxes[index],
      ...payload,
      brackets:
        payload.brackets !== undefined
          ? normalizeBrackets(payload.brackets)
          : legalTaxes[index].brackets,
    };
    if (payload.code) updated.code = payload.code.trim().toUpperCase();
    legalTaxes[index] = updated;
    return deepClone(updated);
  },

  async deleteLegalTax(id) {
    await delay();
    const index = legalTaxes.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Cotisation introuvable");
    legalTaxes.splice(index, 1);
    return true;
  },
};
