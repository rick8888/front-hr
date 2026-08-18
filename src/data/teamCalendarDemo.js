/** Seed events + filter options for Team Leave Calendar (demo). */

export const DESIGNATION_OPTIONS = [
  "All Designations",
  "HR Manager",
  "Sales Manager",
  "Developer",
  "Designer",
];

export const LEAVE_TYPE_FILTER_OPTIONS = [
  "All Leave Types",
  "Birthday Leave",
  "Casual Leave",
  "Sick Leave",
  "Annual Leave",
];

export const STATUS_FILTER_OPTIONS = ["All Statuses", "Approved", "Pending", "Rejected"];

/** Demo leaves — HR User Birthday Leave May 20–22 2026 */
export const TEAM_LEAVE_EVENTS_SEED = [
  {
    id: 1,
    employee: "HR User",
    designation: "HR Manager",
    leaveType: "Birthday Leave",
    status: "Approved",
    start: "2026-05-20",
    end: "2026-05-22",
  },
];

export function filterLeaveEvents(events, filters) {
  return events.filter((e) => {
    if (
      filters.designation &&
      filters.designation !== "All Designations" &&
      e.designation !== filters.designation
    ) {
      return false;
    }
    if (
      filters.leaveType &&
      filters.leaveType !== "All Leave Types" &&
      e.leaveType !== filters.leaveType
    ) {
      return false;
    }
    if (
      filters.status &&
      filters.status !== "All Statuses" &&
      e.status !== filters.status
    ) {
      return false;
    }
    return true;
  });
}

/** Events overlapping a given calendar day (ISO yyyy-MM-dd). */
export function eventsOnDay(events, isoDay) {
  const target = parseIso(isoDay);
  return events.filter((e) => {
    const a = parseIso(e.start);
    const b = parseIso(e.end);
    return target >= a && target <= b;
  });
}

function parseIso(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
