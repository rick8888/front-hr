function parseJoinDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function toIsoDate(value) {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value.trim())) {
    return value.trim().slice(0, 10);
  }
  const date = parseJoinDate(value);
  if (!date) return null;
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function addMonthsToIso(iso, months) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setMonth(date.getMonth() + months);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Période d'essai en cours d'après les champs saisis à la création. */
export function isCurrentlyOnProbation(employee) {
  const months = Number(employee?.probationMonths) || 0;
  const join = toIsoDate(employee?.joinDate);
  const today = todayIso();
  let end = toIsoDate(employee?.probationEndDate);

  if (!end && months > 0 && join) {
    end = addMonthsToIso(join, months);
  }
  if (!end) return false;
  if (join && join > today) return false;
  return end >= today;
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
      if (isCurrentlyOnProbation(employee)) return false;
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
      if (employee.status !== "active" || employee.metadata?.probation_decision) return false;
      return isCurrentlyOnProbation(employee);
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
