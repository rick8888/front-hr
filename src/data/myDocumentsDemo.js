/**
 * Compat : options documents déplacées dans useMyDocuments.
 */
export {
  DOCUMENT_CATEGORY_OPTIONS as MY_DOCUMENT_CATEGORY_OPTIONS,
  DOCUMENT_STATUS_OPTIONS as MY_DOCUMENT_STATUS_OPTIONS,
  DOCUMENT_EXPIRY_OPTIONS as MY_DOCUMENT_EXPIRY_OPTIONS,
} from "../pages/self-service/composables/useMyDocuments.js";

/** @deprecated Données démo — la page lit désormais l’API. */
export const myDocuments = [];
