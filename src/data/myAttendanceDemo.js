/**
 * Démo / fixtures pour la page /self-service/my-attendance.
 * Replace by API call once backend is wired in.
 */

export const myAttendanceSummary = {
  presentDays: 3,
  absentDays: 0,
  lateArrivals: 0,
  halfDays: 0,
  monthLabel: "This Month",
};

export const myAttendanceToday = {
  date: "Friday, May 08, 2026",
  hasRecord: false,
  message: "No attendance record for today. Please check in to mark your attendance.",
};

export const myAttendanceHistory = [
  {
    id: 1,
    date: "May 06, 2026",
    day: "Wednesday",
    checkIn: "09:17 AM",
    checkOut: null,
    totalMinutes: 0,
    overtime: null,
    status: "Checked in",
    logs: [
      { type: "Check In", time: "09:17:09 AM", location: "N/A" },
    ],
  },
  {
    id: 2,
    date: "May 02, 2026",
    day: "Saturday",
    checkIn: "01:45 PM",
    checkOut: null,
    totalMinutes: 0,
    overtime: null,
    status: "Checked in",
    logs: [
      { type: "Check In", time: "01:45:32 PM", location: "N/A" },
    ],
  },
  {
    id: 3,
    date: "May 01, 2026",
    day: "Friday",
    checkIn: "04:19 PM",
    checkOut: null,
    totalMinutes: 0,
    overtime: null,
    status: "Checked in",
    logs: [
      { type: "Check In", time: "04:19:48 PM", location: "Office - HQ" },
    ],
  },
];
