import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Determine role based on email
  const determineRole = (email) => {
    if (email === "employee@bravorh.com") {
      return "Employee";
    }
    return "Admin";
  };

  // Mock user data based on role
  const getUserData = (email, role) => {
    if (role === "Employee") {
      return {
        id: 2,
        name: "Brooklyn Simmons",
        email: "employee@bravorh.com",
        role: "Employee",
        designation: "UI/UX Designer",
        department: "Design",
      };
    } else {
      return {
        id: 1,
        name: "Robert Anderson",
        email: "admin@bravorh.com",
        role: "Admin",
      };
    }
  };

  const login = (credentials) => {
    const role = determineRole(credentials.email);
    user.value = getUserData(credentials.email, role);
    isAuthenticated.value = true;
    
    // Save to localStorage
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("user", JSON.stringify(user.value));
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("user");
  };

  // Initialize user from localStorage on app start
  const initAuth = () => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (savedUser && token) {
      user.value = JSON.parse(savedUser);
      isAuthenticated.value = true;
    }
  };

  // Computed properties
  const isAdmin = computed(() => user.value?.role === "Admin");
  const isEmployee = computed(() => user.value?.role === "Employee");

  return {
    user,
    isAuthenticated,
    isAdmin,
    isEmployee,
    login,
    logout,
    initAuth,
  };
});
