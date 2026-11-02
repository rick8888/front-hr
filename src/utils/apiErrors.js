/**
 * Extrait un message lisible depuis une erreur Axios / Laravel.
 */
export function parseApiError(error) {
  const data = error?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const validationMessage = Object.values(data.errors).flat().join(" ");
    if (validationMessage) return validationMessage;
  }
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }
  return error?.message || "Une erreur est survenue.";
}
