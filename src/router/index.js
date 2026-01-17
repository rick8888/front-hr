import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import Dashboard from "../pages/Dashboard.vue";
import Employees from "../pages/Employees.vue";
import EmployeeShow from "../pages/EmployeeShow.vue";
import NewEmployee from "../pages/NewEmployee.vue";
import EditEmployee from "../pages/EditEmployee.vue";
import Attendance from "../pages/Attendance.vue";
import Payroll from "../pages/Payroll.vue";
import Settings from "../pages/Settings.vue";
import LeaveRequests from "../pages/LeaveRequests.vue";
import NewAbsenceRequest from "../pages/NewAbsenceRequest.vue";
import PaySlip from "../pages/PaySlip.vue";
import PerformanceReviews from "../pages/PerformanceReviews.vue";
import Training from "../pages/Training.vue";
import Reports from "../pages/Reports.vue";
import Departments from "../pages/Departments.vue";
import DepartmentDetail from "../pages/DepartmentDetail.vue";
import Recruitment from "../pages/Recruitment.vue";
import CompanyInfo from "../pages/CompanyInfo.vue";
import Holidays from "../pages/Holidays.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ForgotPassword from "../pages/ForgotPassword.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import Profile from "../pages/Profile.vue";

// Admin-only routes
const adminOnlyRoutes = [
  "/employees",
  "/employees/new",
  "/employees/edit",
  "/departments",
  "/payroll",
  "/recruitment",
  "/settings",
  "/reports",
  "/performance-reviews",
  "/training",
  "/company-info",
  "/holidays",
];

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
  },
  {
    path: "/employees/:id",
    name: "EmployeeShow",
    component: EmployeeShow,
  },
  {
    path: "/employees/new",
    name: "NewEmployee",
    component: NewEmployee,
  },
  {
    path: "/employees/edit/:id",
    name: "EditEmployee",
    component: EditEmployee,
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: Attendance,
  },
  {
    path: "/payroll",
    name: "Payroll",
    component: Payroll,
  },
  {
    path: "/leave-requests",
    name: "LeaveRequests",
    component: LeaveRequests,
  },
  {
    path: "/leave-requests/new",
    name: "NewAbsenceRequest",
    component: NewAbsenceRequest,
  },
  {
    path: "/holidays",
    name: "Holidays",
    component: Holidays,
  },
  {
    path: "/payslip",
    name: "PaySlip",
    component: PaySlip,
  },
  {
    path: "/performance-reviews",
    name: "PerformanceReviews",
    component: PerformanceReviews,
  },
  {
    path: "/training",
    name: "Training",
    component: Training,
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
  },
  {
    path: "/departments",
    name: "Departments",
    component: Departments,
  },
  {
    path: "/departments/:id",
    name: "DepartmentDetail",
    component: DepartmentDetail,
  },
  {
    path: "/recruitment",
    name: "Recruitment",
    component: Recruitment,
  },
  {
    path: "/company-info",
    name: "CompanyInfo",
    component: CompanyInfo,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth if not already done
  if (!authStore.user && localStorage.getItem("user")) {
    authStore.initAuth();
  }

  // Check if route requires authentication
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(to.path);
  
  // If not authenticated and trying to access protected route
  if (!authStore.isAuthenticated && !isAuthPage) {
    next("/login");
    return;
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (authStore.isAuthenticated && isAuthPage) {
    next("/");
    return;
  }

  // Check if route is admin-only and user is employee
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => to.path.startsWith(route));
  if (isAdminOnlyRoute && authStore.isEmployee) {
    // Redirect employee to dashboard if trying to access admin routes
    next("/");
    return;
  }

  next();
});

export default router;
