import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApiService } from "../services/auth.api.service.js";

function normalizeRole(role) {
  if (role === "employee") return "employe";
  return role ?? null;
}

function mapApiUser(apiUser) {
  if (!apiUser) return null;

  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: normalizeRole(apiUser.role),
    permissions: Array.isArray(apiUser.permissions) ? apiUser.permissions : [],
    company_id: apiUser.company_id,
    company: apiUser.company_name ?? apiUser.company ?? null,
  };
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  const isSuperAdmin = computed(() => user.value?.role === "super_admin");
  const isAdmin = computed(() =>
    ["admin", "team_manager"].includes(user.value?.role)
  );
  const isEmployee = computed(() => user.value?.role === "employe");
  const isTenant = computed(() => user.value?.role === "tenant");
  const permissions = computed(() => user.value?.permissions ?? []);
  const homePath = computed(() => {
    if (isTenant.value) return "/tenant/dashboard";
    if (isSuperAdmin.value) return "/sup-admin/entreprises";
    if (isEmployee.value) return "/dashboard-2";
    return "/dashboard";
  });

  function can(...keys) {
    if (isSuperAdmin.value) return true;
    const list = permissions.value;
    if (!list.length) return false;
    return keys.some((key) => list.includes(key));
  }

  function persistUser() {
    if (user.value) {
      localStorage.setItem("user", JSON.stringify(user.value));
    }
  }

  function hydrateAuth() {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        user.value = {
          ...parsed,
          role: normalizeRole(parsed.role),
          permissions: Array.isArray(parsed.permissions) ? parsed.permissions : [],
        };
        isAuthenticated.value = true;
      } catch {
        logout();
      }
    }
  }

  async function validateAuth() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const apiUser = await authApiService.me();
      user.value = mapApiUser(apiUser);
      isAuthenticated.value = true;
      persistUser();
    } catch {
      logout();
    }
  }

  async function login(credentials) {
    const data = await authApiService.login(credentials);
    localStorage.setItem("token", data.token);
    user.value = mapApiUser(data.user);
    isAuthenticated.value = true;
    persistUser();
  }

  async function logout() {
    try {
      await authApiService.logout();
    } catch {
      // Token déjà invalide ou session expirée
    }

    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("user");
  }

  async function initAuth() {
    hydrateAuth();
    await validateAuth();
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isEmployee,
    isTenant,
    isSuperAdmin,
    permissions,
    homePath,
    can,
    hydrateAuth,
    validateAuth,
    login,
    logout,
    initAuth,
  };
});
