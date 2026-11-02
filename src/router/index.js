import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { translate } from "../i18n/index.js";
import { isPublicPath } from "./publicRoutes.js";
import LandingPage from "../pages/landing/LandingPage.vue";
import Dashboard from "../pages/Dashboard.vue";
import Dashboard2 from "../pages/Dashboard2.vue";
import Employees from "../pages/Employees.vue";
import EmployeeShow from "../pages/EmployeeShow.vue";
import EmployeeView from "../pages/EmployeeView.vue";
import NewEmployee from "../pages/NewEmployee.vue";
import EditEmployee from "../pages/EditEmployee.vue";
import Attendance from "../pages/Attendance.vue";
import Shifts from "../pages/attendance/Shifts.vue";
import AttendanceTypes from "../pages/attendance/AttendanceTypes.vue";
import Regularizations from "../pages/attendance/Regularizations.vue";
import DailyAttendanceReport from "../pages/attendance/reports/DailyAttendanceReport.vue";
import MonthlyAttendanceSummary from "../pages/attendance/reports/MonthlyAttendanceSummary.vue";
import LateArrivalsReport from "../pages/attendance/reports/LateArrivalsReport.vue";
import OvertimeReport from "../pages/attendance/reports/OvertimeReport.vue";
import DepartmentComparison from "../pages/attendance/reports/DepartmentComparison.vue";
import Payroll from "../pages/Payroll.vue";
import PayrollLayout from "../pages/payroll/PayrollLayout.vue";
import PayrollDashboard from "../pages/payroll/PayrollDashboard.vue";
import PayrollPlaceholder from "../pages/payroll/PayrollPlaceholder.vue";
import PayrollRegisterReport from "../pages/payroll/reports/PayrollRegisterReport.vue";
import DepartmentSummaryReport from "../pages/payroll/reports/DepartmentSummaryReport.vue";
import TaxSummaryReport from "../pages/payroll/reports/TaxSummaryReport.vue";
import EmployeeHistoryReport from "../pages/payroll/reports/EmployeeHistoryReport.vue";
import PayrollComponents from "../pages/payroll/PayrollComponents.vue";
import PayrollModifiers from "../pages/payroll/PayrollModifiers.vue";
import PayrollSalaryStructures from "../pages/payroll/PayrollSalaryStructures.vue";
import PayrollSalaryStructureBuilder from "../pages/payroll/PayrollSalaryStructureBuilder.vue";
import PayrollSettings from "../pages/payroll/PayrollSettings.vue";
import PayrollShow from "../pages/payroll/PayrollShow.vue";
import PayrollAdjustments from "../pages/payroll/PayrollAdjustments.vue";
import PayrollSimulator from "../pages/payroll/PayrollSimulator.vue";
import TenantDeadlines from "../pages/tenant/TenantDeadlines.vue";
import Settings from "../pages/Settings.vue";
import LeaveRequests from "../pages/LeaveRequests.vue";
import NewAbsenceRequest from "../pages/NewAbsenceRequest.vue";
import PaySlip from "../pages/PaySlip.vue";
import PerformanceReviews from "../pages/PerformanceReviews.vue";
import Training from "../pages/Training.vue";
import AdminTrainings from "../pages/AdminTrainings.vue";
import AdminEquipments from "../pages/AdminEquipments.vue";
import Reports from "../pages/Reports.vue";
import Departments from "../pages/organization/Departments.vue";
import DepartmentDetail from "../pages/DepartmentDetail.vue";
import Recruitment from "../pages/Recruitment.vue";
import CandidateManagement from "../pages/CandidateManagement.vue";
import CompanyInfo from "../pages/CompanyInfo.vue";
import Entreprise from "../pages/Entreprise.vue";
import Holidays from "../pages/Holidays.vue";
import Login from "../pages/Login.vue";
import ForgotPassword from "../pages/ForgotPassword.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import Profile from "../pages/Profile.vue";
import Documents from "../pages/Documents.vue";
import Equipment from "../pages/Equipment.vue";
import Notifications from "../pages/Notifications.vue";
import EmployeeCalendar from "../pages/EmployeeCalendar.vue";
import Team from "../pages/organization/Team.vue";
import Designation from "../pages/organization/Designation.vue";
import Sites from "../pages/organization/Sites.vue";
import EmployeeCategoryList from "../pages/employees/EmployeeCategoryList.vue";
import LeaveTypes from "../pages/leave-management/LeaveTypes.vue";
import CompensatoryOffs from "../pages/leave-management/CompensatoryOffs.vue";
import Expenses from "../pages/expenses/Expenses.vue";
import EmployeeDocuments from "../pages/employee-documents/EmployeeDocuments.vue";
import LeaveBalance from "../pages/leave-management/LeaveBalance.vue";
import LeaveBalanceDetail from "../pages/leave-management/LeaveBalanceDetail.vue";
import LeaveBalanceReport from "../pages/leave-management/reports/LeaveBalanceReport.vue";
import LeaveHistoryReport from "../pages/leave-management/reports/LeaveHistoryReport.vue";
import LeaveComplianceReport from "../pages/leave-management/reports/LeaveComplianceReport.vue";
import LeaveDepartmentStatisticsReport from "../pages/leave-management/reports/LeaveDepartmentStatisticsReport.vue";
import LeaveAnalyticsDashboard from "../pages/leave-management/reports/LeaveAnalyticsDashboard.vue";
import TeamCalendar from "../pages/leave-management/TeamCalendar.vue";
import MyAttendance from "../pages/self-service/MyAttendance.vue";
import MyRegularization from "../pages/self-service/MyRegularization.vue";
import MyLeaveRequests from "../pages/self-service/MyLeaveRequests.vue";
import ApplyForLeave from "../pages/self-service/ApplyForLeave.vue";
import MyLeaveBalance from "../pages/self-service/MyLeaveBalance.vue";
import MyCompensatoryOffs from "../pages/self-service/MyCompensatoryOffs.vue";
import MyExpenses from "../pages/self-service/MyExpenses.vue";
import SubmitExpense from "../pages/self-service/SubmitExpense.vue";
import MyPayslips from "../pages/self-service/MyPayslips.vue";
import MyPayslipShow from "../pages/self-service/MyPayslipShow.vue";
import MyDocuments from "../pages/self-service/MyDocuments.vue";
import MyDocumentRequests from "../pages/self-service/MyDocumentRequests.vue";
import RequestDocument from "../pages/self-service/RequestDocument.vue";
import MyHolidays from "../pages/self-service/MyHolidays.vue";
import RequestLoan from "../pages/self-service/RequestLoan.vue";
import MyLoans from "../pages/self-service/MyLoans.vue";
import MyNotes from "../pages/self-service/MyNotes.vue";
import MyReports from "../pages/self-service/MyReports.vue";
import TenantSectionPage from "../pages/tenant/TenantSectionPage.vue";
import TenantDashboard from "../pages/tenant/TenantDashboard.vue";
import TenantSubscription from "../pages/tenant/TenantSubscription.vue";
import TenantSubscriptionChange from "../pages/tenant/TenantSubscriptionChange.vue";
import TenantBillings from "../pages/tenant/TenantBillings.vue";
import TenantInvoices from "../pages/tenant/TenantInvoices.vue";
import TenantInvoiceView from "../pages/tenant/TenantInvoiceView.vue";
import TenantUsage from "../pages/tenant/TenantUsage.vue";
import TenantCompanyProfile from "../pages/tenant/TenantCompanyProfile.vue";
import TenantSupport from "../pages/tenant/TenantSupport.vue";
import TenantUsers from "../pages/tenant/TenantUsers.vue";
import SupAdminLayout from "../components/layout/SupAdminLayout.vue";
import EntreprisesPage from "../pages/sup-admin/entreprises/EntreprisesPage.vue";
import FiscalitesPage from "../pages/sup-admin/fiscalites/FiscalitesPage.vue";
import CotisationsPage from "../pages/sup-admin/cotisations/CotisationsPage.vue";
import DeclarationsPage from "../pages/sup-admin/declarations/DeclarationsPage.vue";
import PlansPage from "../pages/sup-admin/plans/PlansPage.vue";
import FacturationPage from "../pages/sup-admin/facturation/FacturationPage.vue";
import ParametresPage from "../pages/sup-admin/parametres/ParametresPage.vue";
import StatutsPage from "../pages/sup-admin/statuts/StatutsPage.vue";
import Forbidden from "../pages/Forbidden.vue";

// Admin-only routes (fallback rôle employé — les permissions affinent ensuite)
const adminOnlyRoutes = [
  "/employees",
  "/employees/new",
  "/employees/edit",
  "/organization",
  "/payroll",
  "/recruitment",
  "/candidates",
  "/settings",
  "/reports",
  "/performance-reviews",
  "/company-info",
  "/entreprise",
  "/holidays",
  "/admin-trainings",
  "/admin-equipments",
  "/leave-management",
  "/attendance",
  "/expenses",
  "/employee-documents",
  "/leave-requests",
  "/departments",
  "/teams",
  "/designations",
  "/sites",
];

/** Préfixe de route → au moins une permission requise */
const routePermissionRules = [
  { prefix: "/sup-admin", anyOf: ["platform.manage", "platform.billing", "platform.roles"] },
  { prefix: "/payroll", anyOf: ["payroll.view", "payroll.manage"] },
  { prefix: "/employees", anyOf: ["employees.view", "employees.manage"] },
  { prefix: "/organization", anyOf: ["organization.manage"] },
  { prefix: "/departments", anyOf: ["organization.manage"] },
  { prefix: "/teams", anyOf: ["organization.manage"] },
  { prefix: "/designations", anyOf: ["organization.manage"] },
  { prefix: "/sites", anyOf: ["organization.manage"] },
  { prefix: "/attendance", anyOf: ["attendance.manage"] },
  { prefix: "/holidays", anyOf: ["organization.manage", "attendance.manage"] },
  { prefix: "/leave-management", anyOf: ["leave.manage"] },
  { prefix: "/leave-requests", anyOf: ["leave.manage"] },
  { prefix: "/expenses", anyOf: ["leave.manage", "payroll.view"] },
  { prefix: "/employee-documents", anyOf: ["leave.manage", "employees.manage"] },
  { prefix: "/recruitment", anyOf: ["organization.manage", "employees.manage"] },
  { prefix: "/candidates", anyOf: ["organization.manage", "employees.manage"] },
  { prefix: "/admin-trainings", anyOf: ["organization.manage", "employees.manage"] },
  { prefix: "/admin-equipments", anyOf: ["organization.manage", "employees.manage"] },
  { prefix: "/settings", anyOf: ["settings.manage"] },
  { prefix: "/reports", anyOf: ["reports.view"] },
  { prefix: "/entreprise", anyOf: ["settings.manage"] },
  { prefix: "/company-info", anyOf: ["settings.manage"] },
];

function requiredPermissionsForPath(path) {
  const rule = routePermissionRules
    .filter((r) => path === r.prefix || path.startsWith(`${r.prefix}/`))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];
  return rule?.anyOf ?? null;
}
const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    redirect: { path: "/", hash: "#inscription" },
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
    path: "/tenant",
    redirect: "/tenant/dashboard",
  },
  {
    path: "/tenant/dashboard",
    name: "TenantPortalDashboard",
    component: TenantDashboard,
    meta: { title: "Portal dashboard" },
  },
  {
    path: "/tenant/subscription/change",
    name: "TenantSubscriptionChange",
    component: TenantSubscriptionChange,
    meta: { title: "Change Subscription Plan" },
  },
  {
    path: "/tenant/subscription",
    name: "TenantSubscription",
    component: TenantSubscription,
    meta: { title: "Subscription" },
  },
  {
    path: "/tenant/billings",
    name: "TenantBillings",
    component: TenantBillings,
    meta: { title: "Billings" },
  },
  {
    path: "/tenant/invoices",
    name: "TenantInvoices",
    component: TenantInvoices,
    meta: { title: "Invoices" },
  },
  {
    path: "/tenant/invoices/:id",
    name: "TenantInvoiceView",
    component: TenantInvoiceView,
    meta: { title: "Invoice" },
  },
  {
    path: "/tenant/usage",
    name: "TenantUsage",
    component: TenantUsage,
    meta: { title: "Usage" },
  },
  {
    path: "/tenant/company-profile",
    redirect: "/tenant/profile",
  },
  {
    path: "/tenant/profile",
    name: "TenantCompanyProfile",
    component: TenantCompanyProfile,
    meta: { title: "Company Profile" },
  },
  {
    path: "/tenant/support",
    name: "TenantSupport",
    component: TenantSupport,
    meta: { title: "Support" },
  },
  {
    path: "/tenant/echeances",
    name: "TenantDeadlines",
    component: TenantDeadlines,
    meta: { title: "Mes échéances" },
  },
  {
    path: "/tenant/utilisateurs",
    name: "TenantUsers",
    component: TenantUsers,
    meta: { title: "Utilisateurs" },
  },
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
    meta: { titleKey: "landing.meta.title" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/dashboard-2",
    name: "Dashboard2",
    component: Dashboard2,
    meta: { title: "Dashboard 2" },
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
    meta: { titleKey: "admin.employees.title" },
  },
  {
    path: "/employees/new",
    name: "NewEmployee",
    component: NewEmployee,
    meta: { titleKey: "admin.employees.create.title" },
  },
  {
    path: "/employees/categories",
    redirect: "/employees/categories/onboarding",
  },
  {
    path: "/employees/categories/:category",
    name: "EmployeeCategoryList",
    component: EmployeeCategoryList,
    props: true,
    meta: { titleKey: "admin.employees.categories.title" },
  },
  {
    path: "/employees/view/:id",
    name: "EmployeeView",
    component: EmployeeView,
    meta: { titleKey: "admin.employees.view.title" },
  },
  {
    path: "/employees/:id",
    name: "EmployeeShow",
    component: EmployeeShow,
    meta: { titleKey: "admin.employees.view.title" },
  },
  {
    path: "/employees/edit/:id",
    name: "EditEmployee",
    component: EditEmployee,
    meta: { titleKey: "admin.employees.edit.title" },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: Attendance,
    meta: { titleKey: "admin.attendance.title" },
  },
  {
    path: "/attendance/shifts",
    name: "AttendanceShifts",
    component: Shifts,
    meta: { titleKey: "admin.attendance.shifts.title" },
  },
  {
    path: "/attendance/types",
    name: "AttendanceTypes",
    component: AttendanceTypes,
    meta: { titleKey: "admin.attendance.types.title" },
  },
  {
    path: "/attendance/regularizations",
    name: "AttendanceRegularizations",
    component: Regularizations,
    meta: { titleKey: "admin.attendance.regularizations.title" },
  },
  {
    path: "/attendance/reports/daily",
    name: "AttendanceReportDaily",
    component: DailyAttendanceReport,
    meta: { titleKey: "admin.attendance.reports.daily.title" },
  },
  {
    path: "/attendance/reports/monthly-summary",
    name: "AttendanceReportMonthlySummary",
    component: MonthlyAttendanceSummary,
    meta: { titleKey: "admin.attendance.reports.monthly.title" },
  },
  {
    path: "/attendance/reports/late-arrivals",
    name: "AttendanceReportLateArrivals",
    component: LateArrivalsReport,
    meta: { titleKey: "admin.attendance.reports.late.title" },
  },
  {
    path: "/attendance/reports/overtime",
    name: "AttendanceReportOvertime",
    component: OvertimeReport,
    meta: { titleKey: "admin.attendance.reports.overtime.title" },
  },
  {
    path: "/attendance/reports/department-comparison",
    name: "AttendanceReportDepartmentComparison",
    component: DepartmentComparison,
    meta: { titleKey: "admin.attendance.reports.dept.title" },
  },
  {
    path: "/attendance/reports",
    redirect: "/attendance/reports/daily",
  },
  {
    path: "/payroll",
    component: PayrollLayout,
    redirect: "/payroll/dashboard",
    children: [
      {
        path: "dashboard",
        name: "PayrollDashboard",
        component: PayrollDashboard,
        meta: { titleKey: "admin.payroll.dashboard.title" },
      },
      {
        path: "records",
        name: "PayrollRecords",
        component: Payroll,
        meta: { titleKey: "admin.payroll.title" },
      },
      {
        path: "show/:id",
        name: "PayrollShow",
        component: PayrollShow,
        meta: { titleKey: "admin.payroll.show.title" },
      },
      {
        path: ":id/adjustments",
        name: "PayrollAdjustments",
        component: PayrollAdjustments,
        meta: { titleKey: "admin.payroll.adjustments.title" },
      },
      {
        path: "components",
        name: "PayrollComponents",
        component: PayrollComponents,
        meta: { titleKey: "admin.payroll.components.title" },
      },
      {
        path: "modifiers",
        name: "PayrollModifiers",
        component: PayrollModifiers,
        meta: { titleKey: "admin.payroll.modifiers.title" },
      },
      {
        path: "salary-structures/builder",
        name: "PayrollSalaryStructureBuilder",
        component: PayrollSalaryStructureBuilder,
        meta: { titleKey: "admin.payroll.builder.title" },
      },
      {
        path: "salary-structures",
        name: "PayrollSalaryStructures",
        component: PayrollSalaryStructures,
        meta: { titleKey: "admin.payroll.structures.title" },
      },
      {
        path: "reports/payroll-register",
        name: "PayrollReportRegister",
        component: PayrollRegisterReport,
        meta: { titleKey: "admin.payroll.reports.register.title" },
      },
      {
        path: "reports/department-summary",
        name: "PayrollReportDepartmentSummary",
        component: DepartmentSummaryReport,
        meta: { titleKey: "admin.payroll.reports.dept.title" },
      },
      {
        path: "reports/tax-summary",
        name: "PayrollReportTaxSummary",
        component: TaxSummaryReport,
        meta: { titleKey: "admin.payroll.reports.tax.title" },
      },
      {
        path: "reports/employee-history",
        name: "PayrollReportEmployeeHistory",
        component: EmployeeHistoryReport,
        meta: { titleKey: "admin.payroll.reports.history.title" },
      },
      {
        path: "reports",
        redirect: "/payroll/reports/payroll-register",
      },
      {
        path: "settings",
        name: "PayrollSettings",
        component: PayrollSettings,
        meta: { titleKey: "admin.payroll.settings.title" },
      },
      {
        path: "simulator",
        name: "PayrollSimulator",
        component: PayrollSimulator,
        meta: { titleKey: "admin.payroll.simulator.title" },
      },
    ],
  },
  {
    path: "/leave-requests",
    name: "LeaveRequests",
    component: LeaveRequests,
    meta: { titleKey: "admin.leave.title" },
  },
  {
    path: "/leave-requests/new",
    name: "NewAbsenceRequest",
    component: NewAbsenceRequest,
    meta: { titleKey: "admin.leave.newRequest.title" },
  },
  {
    path: "/leave-management/compensatory-offs",
    name: "LeaveManagementCompensatoryOffs",
    component: CompensatoryOffs,
    meta: { titleKey: "admin.leave.compOff.title" },
  },
  {
    path: "/expenses",
    name: "Expenses",
    component: Expenses,
    meta: { titleKey: "admin.leave.expenses.title" },
  },
  {
    path: "/employee-documents",
    name: "EmployeeDocuments",
    component: EmployeeDocuments,
    meta: { titleKey: "admin.leave.documents.title" },
  },
  {
    path: "/employee-documentsActions",
    redirect: "/employee-documents",
  },
  {
    path: "/leave-management/team-calendar",
    name: "LeaveManagementTeamCalendar",
    component: TeamCalendar,
    meta: { titleKey: "admin.leave.calendar.title" },
  },
  {
    path: "/leave-management/types",
    name: "LeaveManagementTypes",
    component: LeaveTypes,
    meta: { titleKey: "admin.leave.types.title" },
  },
  {
    path: "/leave-management/balance",
    name: "LeaveManagementBalance",
    component: LeaveBalance,
    meta: { titleKey: "admin.leave.balances.title" },
  },
  {
    path: "/leave-management/balance/:employeeCode",
    name: "LeaveManagementBalanceDetail",
    component: LeaveBalanceDetail,
    meta: { titleKey: "admin.leave.balances.detailTitle" },
  },
  {
    path: "/leave-management/reports/dashboard",
    name: "LeaveManagementReportDashboard",
    component: LeaveAnalyticsDashboard,
    meta: { titleKey: "admin.leave.reports.dashboard.title" },
  },
  {
    path: "/leave-management/reports/leave-balance",
    name: "LeaveManagementReportLeaveBalance",
    component: LeaveBalanceReport,
    meta: { titleKey: "admin.leave.reports.balance.title" },
  },
  {
    path: "/leave-management/reports/leave-history",
    name: "LeaveManagementReportLeaveHistory",
    component: LeaveHistoryReport,
    meta: { titleKey: "admin.leave.reports.history.title" },
  },
  {
    path: "/leave-management/reports/department-statistics",
    name: "LeaveManagementReportDepartmentStatistics",
    component: LeaveDepartmentStatisticsReport,
    meta: { titleKey: "admin.leave.reports.dept.title" },
  },
  {
    path: "/leave-management/reports/compliance",
    name: "LeaveManagementReportCompliance",
    component: LeaveComplianceReport,
    meta: { titleKey: "admin.leave.reports.compliance.title" },
  },
  {
    path: "/leave-management/reports",
    redirect: "/leave-management/reports/dashboard",
  },
  {
    path: "/mon-calendrier",
    name: "EmployeeCalendar",
    component: EmployeeCalendar,
  },
  {
    path: "/holidays",
    name: "Holidays",
    component: Holidays,
    meta: { titleKey: "admin.attendance.holidays.title" },
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
    path: "/admin-trainings",
    name: "AdminTrainings",
    component: AdminTrainings,
  },
  {
    path: "/admin-equipments",
    name: "AdminEquipments",
    component: AdminEquipments,
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
  },
  {
    path: "/departments",
    redirect: "/organization/departments",
  },
  {
    path: "/organization/departments",
    name: "OrganizationDepartments",
    component: Departments,
    meta: { titleKey: "admin.org.departments.title" },
  },
  {
    path: "/organization/team",
    name: "OrganizationTeam",
    component: Team,
    meta: { titleKey: "admin.org.teams.title" },
  },
  {
    path: "/organization/designation",
    name: "OrganizationDesignation",
    component: Designation,
    meta: { titleKey: "admin.org.designations.title" },
  },
  {
    path: "/organization/sites",
    name: "OrganizationSites",
    component: Sites,
    meta: { titleKey: "admin.org.sites.title" },
  },
  {
    path: "/departments/:id",
    redirect: (to) => `/organization/departments/${to.params.id}`,
  },
  {
    path: "/organization/departments/:id",
    name: "DepartmentDetail",
    component: DepartmentDetail,
    meta: { titleKey: "admin.org.departments.title" },
  },
  {
    path: "/recruitment",
    name: "Recruitment",
    component: Recruitment,
    meta: { titleKey: "admin.recruitment.title" },
  },
  {
    path: "/candidates",
    name: "Candidates",
    component: CandidateManagement,
  },
  {
    path: "/company-info",
    name: "CompanyInfo",
    component: CompanyInfo,
  },
  {
    path: "/entreprise",
    name: "Entreprise",
    component: Entreprise,
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
  {
    path: "/documents",
    name: "Documents",
    component: Documents,
  },
  {
    path: "/equipment",
    name: "Equipment",
    component: Equipment,
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
  },
  // Self Service — toutes les routes du menu Self Service sous /self-service/*
  {
    path: "/self-service/profile",
    name: "SelfServiceProfile",
    component: Profile,
    meta: { title: "My Profile" },
  },
  {
    path: "/self-service/leave-requests",
    name: "SelfServiceLeaveRequests",
    component: MyLeaveRequests,
    meta: { title: "My Leave Requests" },
  },
  {
    path: "/self-service/leave-requests/new",
    name: "SelfServiceLeaveRequestsNew",
    component: ApplyForLeave,
    meta: { title: "Apply for Leave" },
  },
  {
    path: "/self-service/payslips",
    name: "SelfServicePayslips",
    component: MyPayslips,
    meta: { title: "My Payslips" },
  },
  {
    path: "/self-service/payslips/:id",
    name: "SelfServicePayslipShow",
    component: MyPayslipShow,
    meta: { title: "Payslip Details" },
  },
  {
    path: "/self-service/documents",
    name: "SelfServiceDocuments",
    component: MyDocuments,
    meta: { title: "My Documents" },
  },
  {
    path: "/self-service/my-attendance",
    name: "SelfServiceMyAttendance",
    component: MyAttendance,
    meta: { title: "My Attendance" },
  },
  {
    path: "/self-service/my-regularization",
    name: "SelfServiceMyRegularization",
    component: MyRegularization,
    meta: { title: "My Regularization" },
  },
  {
    path: "/self-service/my-leave-balance",
    name: "SelfServiceMyLeaveBalance",
    component: MyLeaveBalance,
    meta: { title: "My Leave Balance" },
  },
  {
    path: "/self-service/my-compensatory-offs",
    name: "SelfServiceMyCompensatoryOffs",
    component: MyCompensatoryOffs,
    meta: { title: "My Compensatory Offs" },
  },
  {
    path: "/self-service/expenses",
    name: "SelfServiceExpenses",
    component: MyExpenses,
    meta: { title: "My Expenses" },
  },
  {
    path: "/self-service/expenses/new",
    name: "SelfServiceExpensesNew",
    component: SubmitExpense,
    meta: { title: "Submit Expense Request" },
  },
  {
    path: "/self-service/loans",
    name: "SelfServiceLoans",
    component: MyLoans,
    meta: { title: "My Loans" },
  },
  {
    path: "/self-service/loans/request",
    name: "SelfServiceLoansRequest",
    component: RequestLoan,
    meta: { title: "Request New Loan" },
  },
  {
    path: "/self-service/document-requests",
    name: "SelfServiceDocumentRequests",
    component: MyDocumentRequests,
    meta: { title: "My Document Requests" },
  },
  {
    path: "/self-service/documents/request",
    name: "SelfServiceDocumentsRequest",
    component: RequestDocument,
    meta: { title: "Request Document" },
  },
  {
    path: "/self-service/holidays",
    name: "SelfServiceHolidays",
    component: MyHolidays,
    meta: { title: "My Holidays" },
  },
  {
    path: "/notes",
    name: "MyNotes",
    component: MyNotes,
    meta: { title: "My Notes" },
  },
  {
    path: "/self-service/reports",
    name: "SelfServiceReports",
    component: MyReports,
    meta: { title: "Attendance Reports" },
  },
  {
    path: "/sup-admin",
    component: SupAdminLayout,
    redirect: "/sup-admin/entreprises",
    children: [
      {
        path: "entreprises",
        name: "SupAdminEntreprises",
        component: EntreprisesPage,
        meta: { title: "Entreprises" },
      },
      {
        path: "fiscalites",
        name: "SupAdminFiscalites",
        component: FiscalitesPage,
        meta: { title: "Fiscalités" },
      },
      {
        path: "cotisations",
        name: "SupAdminCotisations",
        component: CotisationsPage,
        meta: { title: "Cotisations légales" },
      },
      {
        path: "declarations",
        name: "SupAdminDeclarations",
        component: DeclarationsPage,
        meta: { title: "Déclarations par pays" },
      },
      {
        path: "plans",
        name: "SupAdminPlans",
        component: PlansPage,
        meta: { title: "Plans d'abonnement" },
      },
      {
        path: "facturation",
        name: "SupAdminFacturation",
        component: FacturationPage,
        meta: { title: "Facturation" },
      },
      {
        path: "statuts",
        name: "SupAdminStatuts",
        component: StatutsPage,
        meta: { title: "Statuts" },
      },
      {
        path: "parametres",
        name: "SupAdminParametres",
        component: ParametresPage,
        meta: { title: "Paramètres plateforme" },
      },
    ],
  },
  {
    path: "/forbidden",
    name: "Forbidden",
    component: Forbidden,
    meta: { title: "Accès interdit" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.user && localStorage.getItem("user")) {
    authStore.hydrateAuth();
  }

  const publicPage = isPublicPath(to.path);

  if (!authStore.isAuthenticated && !publicPage) {
    next("/login");
    return;
  }

  if (authStore.isAuthenticated && publicPage) {
    next(authStore.homePath);
    return;
  }

  if (authStore.isEmployee && to.path === "/dashboard") {
    next("/dashboard-2");
    return;
  }

  if (authStore.isTenant && !to.path.startsWith("/tenant")) {
    next("/tenant/dashboard");
    return;
  }

  if (
    authStore.isAuthenticated &&
    !authStore.isTenant &&
    to.path.startsWith("/tenant")
  ) {
    next(authStore.isEmployee ? "/dashboard-2" : "/dashboard");
    return;
  }

  // Check if route is admin-only and user is employee
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => to.path.startsWith(route));
  if (isAdminOnlyRoute && authStore.isEmployee) {
    // Redirect employee to dashboard if trying to access admin routes
    next("/dashboard-2");
    return;
  }

  // Permissions fines (team_manager, admin partiel, etc.)
  const requiredPermissions = requiredPermissionsForPath(to.path);
  if (
    requiredPermissions &&
    authStore.isAuthenticated &&
    !authStore.isTenant &&
    !authStore.can(...requiredPermissions)
  ) {
    next("/forbidden");
    return;
  }

  // Super Admin : accès réservé au préfixe /sup-admin
  if (
    authStore.isSuperAdmin &&
    !publicPage &&
    to.path !== "/forbidden" &&
    !to.path.startsWith("/sup-admin")
  ) {
    next("/sup-admin/entreprises");
    return;
  }

  if (to.path.startsWith("/sup-admin") && !authStore.isSuperAdmin) {
    next("/forbidden");
    return;
  }

  next();
});

router.afterEach((to) => {
  if (typeof to.meta.titleKey === "string") {
    document.title = `${translate(to.meta.titleKey)} · ${translate("app.name")}`;
  }
});

export default router;
