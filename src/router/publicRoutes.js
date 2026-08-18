/** Pages publiques (sans authentification). */
export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function isPublicPath(path) {
  return PUBLIC_PATHS.includes(path);
}
