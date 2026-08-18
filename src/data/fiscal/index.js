/**
 * Données fiscales mock — alignées sur bravo-api-K/database/data/fiscal/
 * Source API future : GET /api/fiscal/countries, GET /api/fiscal/profiles/{code}
 */
import countries from "./countries.json";
import maProfile from "./profiles/MA.json";
import frProfile from "./profiles/FR.json";
import snProfile from "./profiles/SN.json";
import ciProfile from "./profiles/CI.json";
import tnProfile from "./profiles/TN.json";

export const FISCAL_COUNTRIES = countries;

export const FISCAL_PROFILES_BY_CODE = {
  MA: maProfile,
  FR: frProfile,
  SN: snProfile,
  CI: ciProfile,
  TN: tnProfile,
};

export const FISCAL_BASE_LABELS = {
  gross_salary: "Salaire brut",
  gross_salary_capped: "Salaire brut plafonné",
  taxable_income: "Revenu imposable",
  net_taxable: "Net imposable",
  company_revenue: "Chiffre d'affaires",
};

export const CALCULATION_BASE_SOURCE_LABELS = {
  payroll: "Bulletin de paie",
  computed: "Calculée",
  manual: "Saisie manuelle",
};

export const APPLIES_TO_LABELS = {
  employee: "Salarié",
  employer: "Employeur",
  both: "Les deux",
};

export const PERIOD_LABELS = {
  monthly: "Mensuel",
  quarterly: "Trimestriel",
  annual: "Annuel",
};

export const DECLARATION_TYPE_LABELS = {
  fiscal: "Fiscale",
  social: "Sociale",
};

export const DECLARATION_FREQUENCY_LABELS = {
  monthly: "Mensuelle",
  quarterly: "Trimestrielle",
  annual: "Annuelle",
};

export const REFERENCE_PERIOD_LABELS = {
  previous_month: "Mois précédent",
  current_month: "Mois en cours",
  previous_quarter: "Trimestre précédent",
  previous_year: "Année précédente",
  current_year: "Année en cours",
};

export const FILING_CHANNEL_LABELS = {
  online: "En ligne",
  portal: "Portail dédié",
  paper: "Papier",
};

const MONTH_NAMES = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function formatDueRule(dueRule) {
  if (!dueRule) return "—";
  switch (dueRule.type) {
    case "fixed_day_next_month":
      return `Le ${dueRule.day} du mois suivant`;
    case "fixed_day":
      return `Le ${dueRule.day} ${MONTH_NAMES[(dueRule.month ?? 1) - 1]}`;
    case "nth_working_day":
      return `${dueRule.working_day}e jour ouvré du mois${dueRule.month_offset ? " suivant" : ""}`;
    default:
      return dueRule.type;
  }
}
