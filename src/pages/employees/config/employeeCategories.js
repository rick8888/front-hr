function parseJoinDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

export const EMPLOYEE_CATEGORIES = {
  onboarding: {
    slug: "onboarding",
    titleKey: "admin.employees.cat.onboarding.title",
    breadcrumbKey: "admin.employees.cat.onboarding.breadcrumb",
    statusLabelKey: "admin.employees.cat.onboarding.status",
    statusBadgeClass: "badge-info",
    uidPrefix: "ONBD",
    matches(employee) {
      const joinDate = parseJoinDate(employee.joinDate);
      if (!joinDate || employee.status !== "active") return false;
      return daysSince(joinDate) <= 90;
    },
  },
  "on-probation": {
    slug: "on-probation",
    titleKey: "admin.employees.cat.probation.title",
    breadcrumbKey: "admin.employees.cat.probation.breadcrumb",
    statusLabelKey: "admin.employees.cat.probation.status",
    statusBadgeClass: "badge-warning",
    uidPrefix: "PROB",
    matches(employee) {
      const joinDate = parseJoinDate(employee.joinDate);
      if (!joinDate || employee.status !== "active") return false;
      const elapsed = daysSince(joinDate);
      return elapsed > 90 && elapsed <= 180;
    },
  },
  inactive: {
    slug: "inactive",
    titleKey: "admin.employees.cat.inactive.title",
    breadcrumbKey: "admin.employees.cat.inactive.breadcrumb",
    statusLabelKey: "admin.employees.cat.inactive.status",
    statusBadgeClass: "badge-neutral",
    uidPrefix: "INAC",
    matches(employee) {
      return employee.status === "inactive";
    },
  },
  terminated: {
    slug: "terminated",
    titleKey: "admin.employees.cat.terminated.title",
    breadcrumbKey: "admin.employees.cat.terminated.breadcrumb",
    statusLabelKey: "admin.employees.cat.terminated.status",
    statusBadgeClass: "badge-neutral",
    uidPrefix: "TERM",
    matches(employee) {
      return ["terminated", "exited", "retired"].includes(employee.status);
    },
  },
};

export function getEmployeeCategory(slug) {
  return EMPLOYEE_CATEGORIES[slug] ?? null;
}
