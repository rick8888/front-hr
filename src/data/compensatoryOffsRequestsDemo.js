/** Demo seed for the Compensatory Off Requests page (table + chart + KPIs). */

const EMPLOYEES = [
  { name: "Robert Veteran", code: "EMP-012" },
  { name: "Peter Inactive", code: "EMP-011" },
  { name: "Nina ProbationEnding", code: "EMP-010" },
  { name: "Tom TeamChange", code: "EMP-009" },
  { name: "Lily Scott", code: "EMP-016" },
  { name: "Ben Walker", code: "EMP-017" },
  { name: "Zoe Young", code: "EMP-018" },
  { name: "Sam King", code: "EMP-019" },
  { name: "Ruby Hill", code: "EMP-020" },
  { name: "James Chen", code: "EMP-001" },
];

const STATUSES = ["Approved", "Approved", "Approved", "Approved", "Pending", "Rejected"];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(iso, days) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Fixed today for stable layout (matches mocked "Current Year" tag). */
const TODAY = "2026-05-07";

function deriveUsage(status, expiryISO) {
  if (status !== "Approved") return "-";
  return expiryISO < TODAY ? "Expired" : "Used";
}

export function createCompensatoryOffsRequestsSeed(count = 39, seed = 17) {
  const rand = mulberry32(seed);
  const rows = [];

  for (let i = 0; i < count; i++) {
    const emp = EMPLOYEES[i % EMPLOYEES.length];
    const status = STATUSES[Math.floor(rand() * STATUSES.length)];

    const startWorked = "2025-08-01";
    const dayOffset = Math.floor(rand() * 200);
    const workedDate = addDays(startWorked, dayOffset);

    const hoursWorked = +(8 + rand() * 4).toFixed(2);
    const compOffDays = +(hoursWorked / 8).toFixed(2);

    const expiryDate = addDays(workedDate, 90);
    const usageStatus = deriveUsage(status, expiryDate);

    rows.push({
      id: i + 1,
      employee: emp.name,
      employeeCode: emp.code,
      workedDate,
      hoursWorked,
      compOffDays,
      expiryDate,
      status,
      usageStatus,
    });
  }

  rows.sort((a, b) => (a.workedDate < b.workedDate ? 1 : -1));
  return rows.map((r, idx) => ({ ...r, id: idx + 1 }));
}

export const COMPENSATORY_OFF_STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];
export const COMPENSATORY_OFF_USAGE_OPTIONS = ["Used", "Expired", "-"];
