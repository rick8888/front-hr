/**
 * Compat : types / helpers prêts déplacés dans useMyLoans.
 * Conservé pour d’éventuels imports historiques.
 */
export {
  MY_LOAN_TYPES,
  calculateEmi,
  computeMyLoansKpis,
} from "../pages/self-service/composables/useMyLoans.js";

export const MY_LOAN_STATUS_OPTIONS = [
  "Pending",
  "Approved",
  "Rejected",
  "Active",
  "Closed",
];

/** @deprecated Données démo — la page lit désormais l’API. */
export const myLoans = [];
