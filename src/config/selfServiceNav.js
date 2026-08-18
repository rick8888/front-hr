/**
 * Self Service sidebar menu — same items for admin & employee layouts.
 * labelKey → i18n (nav.ss.*)
 */
export const SELF_SERVICE_MENU = [
  { labelKey: "nav.ss.profile", path: "/self-service/profile" },
  { labelKey: "nav.ss.attendance", path: "/self-service/my-attendance" },
  { labelKey: "nav.ss.regularization", path: "/self-service/my-regularization" },
  { labelKey: "nav.ss.leaveRequests", path: "/self-service/leave-requests" },
  { labelKey: "nav.ss.leaveBalance", path: "/self-service/my-leave-balance" },
  { labelKey: "nav.ss.applyLeave", path: "/self-service/leave-requests/new" },
  { labelKey: "nav.ss.compOff", path: "/self-service/my-compensatory-offs" },
  { labelKey: "nav.ss.expenses", path: "/self-service/expenses" },
  { labelKey: "nav.ss.createExpense", path: "/self-service/expenses/new" },
  { labelKey: "nav.ss.loans", path: "/self-service/loans" },
  { labelKey: "nav.ss.requestLoan", path: "/self-service/loans/request" },
  { labelKey: "nav.ss.payslips", path: "/self-service/payslips" },
  { labelKey: "nav.ss.documents", path: "/self-service/documents" },
  { labelKey: "nav.ss.documentRequests", path: "/self-service/document-requests" },
  { labelKey: "nav.ss.requestDocument", path: "/self-service/documents/request" },
  { labelKey: "nav.ss.holidays", path: "/self-service/holidays" },
  { labelKey: "nav.ss.training", path: "/training" },
  { labelKey: "nav.ss.equipment", path: "/equipment" },
  { labelKey: "nav.ss.reports", path: "/self-service/reports" },
];

/** Used by sidebar watch / active section detection. */
export function pathMatchesSelfServiceMenu(path) {
  return SELF_SERVICE_MENU.some(
    (item) => path === item.path || path.startsWith(`${item.path}/`)
  );
}
