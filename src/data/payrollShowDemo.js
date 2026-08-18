/** Détail paie vitrine (maquette `/payroll/show/38`) + helpers de construction. */

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * Contenu exact de la maquette Payroll Details (John Confirmed / PAY-202604-0008).
 * @returns {object}
 */
export function getShowcasePayrollDetail() {
  const basic = 90000;
  const earnings = [
    { name: "Basic Salary", amount: 90000, percent: null, isBase: true },
    { name: "Festival Bonus", amount: 4500, percent: 5 },
    { name: "Performance incentive", amount: 2700, percent: null },
    { name: "Special", amount: 36000, percent: 40 },
    { name: "House Rent Allowance", amount: 34200, percent: 38 },
    { name: "Medical Allowance", amount: 1925, percent: null },
    { name: "Special Allowance", amount: 9000, percent: 10 },
  ];
  const deductions = [
    { name: "Late Coming Fine", amount: 100, percent: null },
    { name: "Uniform Deduction", amount: 500, percent: null },
  ];

  const grossSalary = 177325;
  const totalDeductions = 600;
  const netSalary = 176725;

  // Ajuste la dernière addition pour coller au brut maquette
  const earnSum = earnings.reduce((s, e) => s + e.amount, 0);
  const drift = round2(grossSalary - earnSum);
  if (Math.abs(drift) > 0.001) {
    earnings[earnings.length - 1].amount = round2(earnings[earnings.length - 1].amount + drift);
  }

  const modifiers = [
    ...earnings.map((e) => ({
      name: e.name,
      type: "earning",
      percent: e.percent,
      amount: e.amount,
    })),
    ...deductions.map((d) => ({
      name: d.name,
      type: "deduction",
      percent: d.percent,
      amount: d.amount,
    })),
  ];

  return {
    id: 38,
    employeeId: 1,
    employeeName: "John Confirmed",
    empCode: "EMP-001",
    email: "john.confirmed@company.com",
    phone: "+1 (555) 010-2030",
    role: "Sales Representative",
    department: "Sales Department",
    payrollNumber: "PAY-202604-0008",
    period: "April 2026",
    periodLabel: "April 2026",
    cycle: "April 2026",
    payDate: "May 05, 2026",
    periodStart: "Apr 01, 2026",
    periodEnd: "Apr 30, 2026",
    status: "pending",
    /** Badge global d’approbation (maquette : Approved + statut Pending à côté) */
    approvalBadge: "approved",
    approval: {
      status: "approved",
      by: "HR User",
      at: "May 01, 2026 10:24 AM",
    },
    defaultApproved: true,
    basicSalary: basic,
    earnings,
    deductions,
    grossSalary,
    totalDeductions,
    netSalary,
    modifiers,
    attendance: {
      daysWorked: 16.0,
      absentDays: 0,
      leaveDays: 0,
      overtimeHours: 0.0,
    },
    createdAt: "Apr 28, 2026, 09:15 AM",
    updatedAt: "May 01, 2026, 10:24 AM",
  };
}

/**
 * Construit un détail cohérent à partir d’une ligne de registre / liste.
 * @param {object} row
 * @param {object} [opts]
 */
export function buildPayrollDetailFromRow(row, opts = {}) {
  const pid = Number(row.id) || 1;
  const basic = round2(row.basicSalary ?? row.grossSalary * 0.55 ?? 5000);
  const gross = round2(row.grossSalary);
  const net = round2(row.netSalary ?? row.netPay ?? gross * 0.9);
  const totalDed = round2(row.deductions ?? row.totalDeductions ?? gross - net);

  const bonus = round2(basic * 0.05);
  const incentive = round2(basic * 0.03);
  const special = round2(basic * 0.12);
  const hra = round2(basic * 0.15);
  let earnings = [
    { name: "Basic Salary", amount: basic, percent: null, isBase: true },
    { name: "Festival Bonus", amount: bonus, percent: 5 },
    { name: "Performance incentive", amount: incentive, percent: null },
    { name: "Special", amount: special, percent: 12 },
    { name: "House Rent Allowance", amount: hra, percent: 15 },
  ];
  const earnSum = round2(earnings.reduce((s, e) => s + e.amount, 0));
  const other = round2(Math.max(0, gross - earnSum));
  if (other > 0) {
    earnings.push({ name: "Other Allowances", amount: other, percent: null });
  } else if (Math.abs(earnSum - gross) > 0.01) {
    earnings[0].amount = round2(earnings[0].amount + (gross - earnSum));
  }

  const late = round2(Math.min(100, totalDed * 0.2));
  const uniform = round2(Math.min(500, totalDed * 0.3));
  let rest = round2(Math.max(0, totalDed - late - uniform));
  const deductions = [
    { name: "Late Coming Fine", amount: late, percent: null },
    { name: "Uniform Deduction", amount: uniform, percent: null },
  ];
  if (rest > 0) {
    deductions.push({ name: "Other Deductions", amount: rest, percent: null });
  }

  const periodLabel = row.period || row.periodLabel || "April 2026";
  const cycle = row.cycle || periodLabel;

  const periodParts = String(periodLabel).trim().split(/\s+/);
  const monthName = periodParts[0] || "April";
  const yearStr = periodParts[1] || "2026";
  const monthIndex = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ].findIndex((m) => monthName.toLowerCase().startsWith(m.toLowerCase()));
  const y = parseInt(yearStr, 10) || 2026;
  const m = monthIndex >= 0 ? monthIndex : 3;
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  const pay = new Date(y, m + 1, 5);
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const pct = (amt) => (basic > 0 ? round2((amt / basic) * 100) : null);

  const modifiers = [
    ...earnings.map((e) => ({
      name: e.name,
      type: "earning",
      percent: e.percent ?? (e.isBase ? null : pct(e.amount)),
      amount: e.amount,
    })),
    ...deductions.map((d) => ({
      name: d.name,
      type: "deduction",
      percent: d.percent,
      amount: d.amount,
    })),
  ];

  const name = row.employeeName || "Employee";
  const roles = opts.roles || [
    "Sales Representative",
    "Software Engineer",
    "HR Manager",
    "Accountant",
    "Analyst",
  ];

  return {
    id: pid,
    employeeId: row.employeeId ?? pid,
    employeeName: name,
    empCode: row.empCode || `EMP-${String(pid).padStart(3, "0")}`,
    email: `${name.replace(/\s+/g, ".").toLowerCase()}@company.com`,
    phone: `+1 (${String(200 + (pid % 800)).padStart(3, "0")}) ${String(100 + (pid % 900)).padStart(3, "0")}-${String(1000 + (pid % 9000)).padStart(4, "0")}`,
    role: row.role || roles[pid % roles.length],
    department: row.department || "Sales Department",
    payrollNumber: row.payrollNumber || `PAY-${y}${String(m + 1).padStart(2, "0")}-${String(pid).padStart(4, "0")}`,
    period: periodLabel,
    periodLabel,
    cycle,
    payDate: fmt(pay),
    periodStart: fmt(start),
    periodEnd: fmt(end),
    status: row.status || "pending",
    approvalBadge: row.status === "paid" || row.status === "approved" ? "approved" : null,
    approval:
      row.status === "paid" || row.status === "approved"
        ? { status: "approved", by: "HR User", at: fmt(pay) }
        : null,
    defaultApproved: row.status === "approved" || row.status === "paid",
    basicSalary: basic,
    earnings,
    deductions,
    grossSalary: gross,
    totalDeductions: totalDed,
    netSalary: net,
    modifiers,
    attendance: {
      daysWorked: 16 + (pid % 5),
      absentDays: pid % 6 === 0 ? 1 : 0,
      leaveDays: pid % 7 === 0 ? 1 : 0,
      overtimeHours: round2((pid % 4) * 0.5),
    },
    createdAt: fmt(start) + ", 09:15 AM",
    updatedAt: fmt(pay) + ", 10:24 AM",
  };
}
