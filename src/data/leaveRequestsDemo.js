/** Demo seed for admin Leave Requests list (layout reference). */

export const LEAVE_TYPE_LABELS = [
  "Casual Leave",
  "Emergency Leave",
  "Sick Leave",
  "Voting Leave",
  "Work From Home",
  "Maternity Leave",
  "Paternity Leave",
];

export const LEAVE_STATUS_LABELS = ["Pending", "Approved", "Cancelled"];

const DEMO_EMPLOYEES = [
  { name: "James Chen", code: "EMP-001" },
  { name: "Emma Price", code: "EMP-002" },
  { name: "Oliver Blake", code: "EMP-003" },
  { name: "Sophia Reed", code: "EMP-004" },
  { name: "Noah Foster", code: "EMP-005" },
  { name: "Ava Morgan", code: "EMP-006" },
  { name: "Liam Hughes", code: "EMP-007" },
  { name: "Mia Collins", code: "EMP-008" },
  { name: "Ethan Parker", code: "EMP-009" },
  { name: "Isla Turner", code: "EMP-010" },
  { name: "Lucas Gray", code: "EMP-011" },
  { name: "Grace Ward", code: "EMP-012" },
  { name: "Henry Cole", code: "EMP-013" },
  { name: "Chloe Bell", code: "EMP-014" },
  { name: "Jack Ross", code: "EMP-015" },
  { name: "Lily Scott", code: "EMP-016" },
  { name: "Ben Walker", code: "EMP-017" },
  { name: "Zoe Young", code: "EMP-018" },
  { name: "Sam King", code: "EMP-019" },
  { name: "Ruby Hill", code: "EMP-020" },
];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Deterministic demo rows (default 95 to match pagination demo).
 */
export function createLeaveRequestsSeed(count = 95, seed = 42) {
  const rand = mulberry32(seed);
  const rows = [];
  const anchor = new Date(2026, 0, 1);

  for (let i = 0; i < count; i++) {
    const emp = DEMO_EMPLOYEES[i % DEMO_EMPLOYEES.length];
    const leaveType =
      LEAVE_TYPE_LABELS[Math.floor(rand() * LEAVE_TYPE_LABELS.length)];
    const status =
      LEAVE_STATUS_LABELS[Math.floor(rand() * LEAVE_STATUS_LABELS.length)];

    const dayOffset = Math.floor(rand() * 240);
    const fromDate = new Date(anchor);
    fromDate.setDate(anchor.getDate() + dayOffset);
    const from = fromDate.toISOString().slice(0, 10);
    const dur = Math.max(
      1,
      Math.floor(rand() * 5) + (rand() > 0.88 ? 7 : 0),
    );
    const to = addDays(from, dur - 1);

    rows.push({
      id: i + 1,
      employee: emp.name,
      employeeCode: emp.code,
      leaveType,
      from,
      to,
      status,
      document: null,
      submittedAt: addDays(from, -Math.floor(rand() * 12) - 1),
    });
  }

  rows.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  return rows.map((r, idx) => ({ ...r, id: idx + 1 }));
}

export function employeeFilterOptions(seedRows) {
  const map = new Map();
  seedRows.forEach((r) => map.set(r.employeeCode, r.employee));
  return [...map.entries()].map(([code, name]) => ({ code, name }));
}
