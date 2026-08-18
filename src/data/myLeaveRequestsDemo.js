/**
 * Démo / fixtures pour /self-service/leave-requests.
 * Replace by API calls once backend is wired in.
 */

export const myLeaveSummary = {
  total: 8,
  pending: 2,
  approved: 5,
  rejected: 1,
};

export const myLeaveTypes = [
  "Quarantine Leave",
  "Birthday Leave",
  "Bereavement Leave",
  "Paternity Leave",
  "Maternity Leave",
  "Emergency Leave",
  "Voting Leave",
  "Medical Leave",
  "Marriage Leave",
  "Annual Leave",
  "Sick Leave",
];

export const myLeaveStatuses = ["Pending", "Approved", "Rejected"];

export const myLeaveRequests = [
  {
    id: 1,
    requestDate: "Feb 19, 2026",
    leaveType: "Quarantine Leave",
    fromDate: "Jun 14, 2025",
    toDate: "Jun 20, 2025",
    days: 5,
    status: "Approved",
  },
  {
    id: 2,
    requestDate: "Feb 19, 2026",
    leaveType: "Birthday Leave",
    fromDate: "May 20, 2026",
    toDate: "May 22, 2026",
    days: 3,
    status: "Approved",
  },
  {
    id: 3,
    requestDate: "Feb 19, 2026",
    leaveType: "Bereavement Leave",
    fromDate: "Jul 01, 2025",
    toDate: "Jul 10, 2025",
    days: 8,
    status: "Approved",
  },
  {
    id: 4,
    requestDate: "Feb 19, 2026",
    leaveType: "Paternity Leave",
    fromDate: "Jun 17, 2026",
    toDate: "Jun 17, 2026",
    days: 0.5,
    status: "Pending",
  },
  {
    id: 5,
    requestDate: "Feb 19, 2026",
    leaveType: "Emergency Leave",
    fromDate: "Jun 21, 2025",
    toDate: "Jun 21, 2025",
    days: 0,
    status: "Rejected",
  },
  {
    id: 6,
    requestDate: "Feb 19, 2026",
    leaveType: "Voting Leave",
    fromDate: "Jun 21, 2025",
    toDate: "Jun 25, 2025",
    days: 3,
    status: "Approved",
  },
  {
    id: 7,
    requestDate: "Feb 19, 2026",
    leaveType: "Medical Leave",
    fromDate: "Aug 15, 2025",
    toDate: "Aug 15, 2025",
    days: 1,
    status: "Approved",
  },
  {
    id: 8,
    requestDate: "Feb 19, 2026",
    leaveType: "Marriage Leave",
    fromDate: "Jul 28, 2026",
    toDate: "Jul 28, 2026",
    days: 1,
    status: "Pending",
  },
];
