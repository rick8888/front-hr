/**
 * Libellés UI — modèle aligné sur le backend HR (LegalTax + TaxBracket).
 * Données : GET/POST/PUT/DELETE /api/v1/legal-taxes
 */

export const LEGAL_TAX_CATEGORY_LABELS = {
  social: "Sociale",
  fiscal: "Fiscale",
};

export const LEGAL_TAX_CATEGORY_TONES = {
  social: "bg-sky-50 text-sky-800",
  fiscal: "bg-violet-50 text-violet-800",
};

export const LEGAL_TAX_TYPE_LABELS = {
  percent: "Pourcentage",
  progressive: "Barème progressif",
  fixed: "Montant fixe",
  formula: "Formule",
};

export const LEGAL_TAX_TYPE_TONES = {
  percent: "bg-blue-50 text-blue-800",
  progressive: "bg-violet-50 text-violet-800",
  fixed: "bg-amber-50 text-amber-800",
  formula: "bg-neutral-100 text-neutral-700",
};

export const BASE_TARGET_LABELS = {
  BASE: "Base salariale",
  GROSS: "Salaire brut",
  TAXABLE: "Revenu imposable",
  NET: "Salaire net",
  CUSTOM: "Personnalisée",
};

export function legalTaxCategoryLabel(category) {
  return LEGAL_TAX_CATEGORY_LABELS[category] ?? category ?? "—";
}

export function legalTaxTypeLabel(type) {
  return LEGAL_TAX_TYPE_LABELS[type] ?? type ?? "—";
}

/** Fallback si l'API ne renvoie pas encore category */
export function resolveLegalTaxCategory(tax) {
  if (tax?.category) return tax.category;
  if (tax?.type === "progressive") return "fiscal";
  return "social";
}

export function baseTargetLabel(target) {
  return BASE_TARGET_LABELS[target] ?? target ?? "—";
}

/** Affiche un taux décimal HR (0.0448) en pourcentage lisible (4,48 %) */
export function formatRatePercent(rate) {
  if (rate == null || rate === 0) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rate);
}

export function formatAmount(amount, currency = "EUR") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CDF" || currency === "XOF" ? 0 : 2,
  }).format(amount);
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function countryById(countries, id) {
  return countries.find((c) => c.id === id) ?? null;
}

export function countryByCode(countries, code) {
  return countries.find((c) => c.code === code) ?? null;
}
