/**
 * Démo / fixtures pour /self-service/document-requests.
 * Liste des demandes de documents officiels de l'employé connecté.
 */

export const MY_DOC_REQUEST_TYPE_OPTIONS = [
  "Employment Certificate",
  "Salary Letter",
  "Experience Letter",
  "No Objection Certificate (NOC)",
  "Address Proof",
  "Bank Letter",
  "Other",
];

export const MY_DOC_REQUEST_STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Approved",
  "Rejected",
  "Completed",
];

/** Liste vide par défaut — match exactement la maquette ("No data available in table"). */
export const myDocumentRequests = [];
