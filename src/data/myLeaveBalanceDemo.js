/**
 * Démo / fixtures pour /self-service/my-leave-balance.
 */

export const leaveBalanceSummary = {
  totalEntitlement: 254,
  usedLeaves: 115.7,
  pendingApproval: 1.5,
  availableBalance: 177.3,
};

/** Solde par type de congé */
export const leaveBalanceByType = [
  {
    leaveType: "Casual Leave",
    entitlement: 13,
    used: 6.5,
    pending: 0,
    available: 12.5,
  },
  {
    leaveType: "Sick Leave",
    entitlement: 12,
    used: 8,
    pending: 0,
    available: 4,
  },
  {
    leaveType: "Earned Leave",
    entitlement: 18,
    used: 11,
    pending: 0,
    available: 7,
  },
  {
    leaveType: "Maternity Leave",
    entitlement: 90,
    used: 0,
    pending: 0,
    available: 90,
  },
  {
    leaveType: "Paternity Leave",
    entitlement: 10,
    used: 2,
    pending: 1,
    available: 8,
  },
  {
    leaveType: "Emergency Leave",
    entitlement: 3,
    used: 1.5,
    pending: 0,
    available: 1.5,
  },
  {
    leaveType: "Annual Leave",
    entitlement: 22,
    used: 14,
    pending: 0,
    available: 8,
  },
  {
    leaveType: "Birthday Leave",
    entitlement: 1,
    used: 0,
    pending: 1,
    available: 0,
  },
  {
    leaveType: "Medical Leave",
    entitlement: 30,
    used: 12,
    pending: 0,
    available: 18,
  },
  {
    leaveType: "Compensatory Off",
    entitlement: 8,
    used: 5,
    pending: 0,
    available: 3,
  },
];

export const upcomingLeaves = [
  {
    id: 1,
    leaveType: "Birthday Leave",
    rangeLabel: "May 20 - May 22, 2026",
    days: 3,
  },
  {
    id: 2,
    leaveType: "Annual Leave",
    rangeLabel: "Jun 01 - Jun 05, 2026",
    days: 5,
  },
];

export const recentLeaveHistory = [
  {
    id: 1,
    leaveType: "Quarantine Leave",
    fromDate: "Jun 14, 2025",
    toDate: "Jun 20, 2025",
    days: 5,
    status: "Approved",
    appliedOn: "Feb 19, 2026",
  },
  {
    id: 2,
    leaveType: "Birthday Leave",
    fromDate: "May 20, 2026",
    toDate: "May 22, 2026",
    days: 3,
    status: "Approved",
    appliedOn: "Feb 19, 2026",
  },
  {
    id: 3,
    leaveType: "Paternity Leave",
    fromDate: "Jun 17, 2026",
    toDate: "Jun 17, 2026",
    days: 0.5,
    status: "Pending",
    appliedOn: "Feb 19, 2026",
  },
  {
    id: 4,
    leaveType: "Emergency Leave",
    fromDate: "Jun 21, 2025",
    toDate: "Jun 21, 2025",
    days: 0,
    status: "Rejected",
    appliedOn: "Feb 19, 2026",
  },
];

/**
 * Données dédiées au graphique « Balance Overview » (6 catégories, échelle 0–16 jours).
 * Clés : entitlement = Entitled, used = Used, available = Available
 */
export const leaveBalanceChartRows = [
  { leaveType: "Casual", entitlement: 14, used: 6, available: 8 },
  { leaveType: "Sick", entitlement: 12, used: 7, available: 5 },
  { leaveType: "Earned", entitlement: 16, used: 9, available: 7 },
  { leaveType: "Paternity", entitlement: 10, used: 3, available: 7 },
  { leaveType: "Emergency", entitlement: 4, used: 2, available: 2 },
  { leaveType: "Annual", entitlement: 15, used: 11, available: 4 },
];
