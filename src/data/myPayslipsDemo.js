/**
 * Démo / fixtures pour /self-service/payslips.
 * Représente la liste des bulletins de paie de l'employé connecté.
 */

export const MY_PAYSLIP_STATUS_OPTIONS = ["Approved", "Pending", "Paid", "Rejected"];

/** Liste des périodes (filtre haut de page). */
export const MY_PAYSLIP_PERIOD_OPTIONS = [
  { value: "2026", label: "Year 2026" },
  { value: "2025", label: "Year 2025" },
  { value: "2026-Q1", label: "Q1 2026" },
  { value: "2025-Q4", label: "Q4 2025" },
  { value: "2025-Q3", label: "Q3 2025" },
];

/** Profil employé partagé pour la fiche détail. */
export const MY_PAYSLIP_EMPLOYEE = {
  name: "HR User",
  department: "HR Department",
  designation: "HR Manager",
};

function makeAttendance(overrides = {}) {
  return {
    workingDays: 0,
    workedDays: 0,
    leaveDays: 0,
    absentDays: 0,
    lateDays: 0,
    earlyCheckoutDays: 0,
    overtimeDays: 0,
    holidays: 0,
    ...overrides,
  };
}

export const myPayslips = [
  {
    id: 1,
    code: "PSLIP-202603-2-0001",
    period: "2026-03",
    periodLabel: "March 2026",
    basicSalary: 60000,
    allowances: 32800,
    totalEarnings: 92800,
    deductions: 23788,
    deductionDetails: [],
    netSalary: 69012,
    status: "Approved",
    paidOn: null,
    notes: "Payslip for March 2026",
    attendance: makeAttendance({ workedDays: 10 }),
  },
  {
    id: 2,
    code: "PSLIP-202509-2-0001",
    period: "2025-09",
    periodLabel: "September 2025",
    basicSalary: 60000,
    allowances: 5000,
    totalEarnings: 65000,
    deductions: 7000,
    deductionDetails: [
      { label: "Income Tax", amount: 5000 },
      { label: "Social Security", amount: 2000 },
    ],
    netSalary: 58000,
    status: "Paid",
    paidOn: null,
    notes: "Payslip for September 2025",
    attendance: makeAttendance({ workingDays: 22, workedDays: 22, holidays: 1 }),
  },
  {
    id: 3,
    code: "PAY-OCT-2-2198",
    period: "2025-10",
    periodLabel: "October 2025",
    basicSalary: 60000,
    allowances: 3000,
    totalEarnings: 63000,
    deductions: 3780,
    deductionDetails: [{ label: "Income Tax", amount: 3780 }],
    netSalary: 59220,
    status: "Pending",
    paidOn: null,
    notes: "Payslip for October 2025",
    attendance: makeAttendance({ workingDays: 21, workedDays: 20, leaveDays: 1 }),
  },
  {
    id: 4,
    code: "PAY-NOV-2-7096",
    period: "2025-11",
    periodLabel: "November 2025",
    basicSalary: 60000,
    allowances: 0,
    totalEarnings: 60000,
    deductions: 6500,
    deductionDetails: [
      { label: "Income Tax", amount: 4500 },
      { label: "Social Security", amount: 2000 },
    ],
    netSalary: 53500,
    status: "Paid",
    paidOn: null,
    notes: "Payslip for November 2025",
    attendance: makeAttendance({ workingDays: 22, workedDays: 22, holidays: 0 }),
  },
];

/** Récupère un bulletin par son id (numérique ou string). */
export function findPayslipById(id) {
  const num = Number(id);
  return myPayslips.find((p) => p.id === num) || null;
}

/** Calcule les KPIs en haut de page. */
export function computeMyPayslipsKpis(rows = []) {
  let total = 0;
  let paid = 0;
  let pending = 0;
  let lastPayment = null;

  rows.forEach((r) => {
    total += 1;
    if (r.status === "Paid") {
      paid += 1;
      if (r.paidOn && (!lastPayment || r.paidOn > lastPayment)) {
        lastPayment = r.paidOn;
      }
    } else if (r.status === "Pending" || r.status === "Approved") {
      pending += 1;
    }
  });

  return {
    total,
    paid,
    pending,
    lastPayment,
  };
}
