/**
 * Démo / fixtures pour la page « Dashboard 2 » (vue employé connecté).
 */

export const DASHBOARD2_TODAY = "2026-05-10";

export const dashboard2User = {
  name: "John Confirmed",
  greeting: "Welcome back",
};

/** KPIs en haut de page (aligné avec la maquette). */
export const dashboard2Kpis = {
  weekHoursMinutes: 0,
  monthHoursMinutes: 0,
  totalLeaves: 14,
  leavesApproved: 9,
  leavesPending: 3,
  myTasks: 10,
  tasksCompleted: 3,
  tasksPending: 0,
};

/** Statut « Today's Attendance ». */
export const dashboard2Attendance = {
  status: "In Progress",
  checkInTime: "11:33 AM",
  workingDuration: "11h 4m",
  checkOutTime: null,
};

export const dashboard2RecentActivities = {
  leaves: [
    {
      id: 1,
      label: "Leave Request",
      range: "May 07 - May 08, 2026",
      status: "Pending",
      occurredOn: "2026-05-08",
    },
    {
      id: 2,
      label: "Leave Request",
      range: "Apr 01 - Apr 03, 2026",
      status: "Approved",
      occurredOn: "2026-04-03",
    },
    {
      id: 3,
      label: "Leave Request",
      range: "Mar 22 - Mar 23, 2026",
      status: "Approved",
      occurredOn: "2026-03-23",
    },
    {
      id: 4,
      label: "Leave Request",
      range: "Mar 12 - Mar 19, 2026",
      status: "Approved",
      occurredOn: "2026-03-19",
    },
    {
      id: 5,
      label: "Leave Request",
      range: "Mar 11 - Mar 12, 2026",
      status: "Approved",
      occurredOn: "2026-03-12",
    },
  ],
  expenses: [
    {
      id: 1,
      label: "Team lunch",
      range: "$120.00 - Food",
      status: "Reimbursed",
      occurredOn: "2026-05-02",
    },
  ],
  tasks: [
    {
      id: 1,
      label: "Update onboarding deck",
      range: "Recruitment",
      status: "In Progress",
      occurredOn: "2026-05-09",
    },
  ],
};

/**
 * Convertit une durée en minutes en libellé court (ex. « 0m », « 4h 12m »).
 */
export function formatHoursLabel(totalMinutes) {
  const m = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (h <= 0) return `${mins}m`;
  if (mins === 0) return `${h}h`;
  return `${h}h ${mins}m`;
}

/**
 * Renvoie un libellé relatif (« 2 days ago », « 1 month ago », « in 3 days »).
 * @param {string} iso
 * @param {string} todayIso
 * @param {(key: string, params?: Record<string, string|number>) => string} [t]
 */
export function timeAgoLabel(iso, todayIso = DASHBOARD2_TODAY, t) {
  if (!iso) return "";
  const a = new Date(todayIso + "T12:00:00");
  const b = new Date(iso + "T12:00:00");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return iso;
  const diffDays = Math.round((a.getTime() - b.getTime()) / 86400000);
  const past = diffDays >= 0;
  const abs = Math.abs(diffDays);
  if (!t) {
    if (abs === 0) return "today";
    if (abs === 1) return past ? "yesterday" : "tomorrow";
    if (abs < 30) return past ? `${abs} days ago` : `in ${abs} days`;
    const months = Math.round(abs / 30);
    if (months === 1) return past ? "1 month ago" : "in 1 month";
    if (months < 12) return past ? `${months} months ago` : `in ${months} months`;
    const years = Math.round(months / 12);
    if (years === 1) return past ? "1 year ago" : "in 1 year";
    return past ? `${years} years ago` : `in ${years} years`;
  }
  if (abs === 0) return t("ss.dashboard2.timeAgo.today");
  if (abs === 1) return past ? t("ss.dashboard2.timeAgo.yesterday") : t("ss.dashboard2.timeAgo.tomorrow");
  if (abs < 30) {
    return past
      ? t("ss.dashboard2.timeAgo.daysAgo", { n: abs })
      : t("ss.dashboard2.timeAgo.inDays", { n: abs });
  }
  const months = Math.round(abs / 30);
  if (months === 1) return past ? t("ss.dashboard2.timeAgo.oneMonthAgo") : t("ss.dashboard2.timeAgo.inOneMonth");
  if (months < 12) {
    return past
      ? t("ss.dashboard2.timeAgo.monthsAgo", { n: months })
      : t("ss.dashboard2.timeAgo.inMonths", { n: months });
  }
  const years = Math.round(months / 12);
  if (years === 1) return past ? t("ss.dashboard2.timeAgo.oneYearAgo") : t("ss.dashboard2.timeAgo.inOneYear");
  return past
    ? t("ss.dashboard2.timeAgo.yearsAgo", { n: years })
    : t("ss.dashboard2.timeAgo.inYears", { n: years });
}
