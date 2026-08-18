/**
 * Extrait un message lisible depuis une erreur Axios / Laravel.
 */
export function parseApiError(error) {
  const data = error?.response?.data;
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().join(" ");
  }
  return error?.message || "Une erreur est survenue.";
}
