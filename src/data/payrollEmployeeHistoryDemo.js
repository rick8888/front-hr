/** Données démo — Employee Payslip History. */

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * Liste d’employés pour le sélecteur searchable.
 * @returns {Array<object>}
 */
export function listPayslipHistoryEmployees() {
  return [
    {
      id: 1,
      name: "bhuva divyesh",
      empCode: "123456",
      department: "Sales Department",
      designation: "Sales Associate",
      joinDate: "Jan 12, 2024",
      avatarUrl: null,
    },
    {
      id: 2,
      name: "CLEMENT KARIKARI",
      empCode: "1593914720",
      department: "IT Department",
      designation: "IT Associate",
      joinDate: "May 17, 2026",
      avatarUrl: null,
    },
    {
      id: 3,
      name: "David Promoted",
      empCode: "EMP-005",
      department: "HR Department",
      designation: "HR Manager",
      joinDate: "Mar 03, 2022",
      avatarUrl: null,
    },
    {
      id: 4,
      name: "John Confirmed",
      empCode: "EMP-001",
      department: "Sales Department",
      designation: "Sales Representative",
      joinDate: "Feb 14, 2023",
      avatarUrl: null,
    },
    {
      id: 5,
      name: "Jane Smith",
      empCode: "EMP-002",
      department: "Finance Department",
      designation: "Accountant",
      joinDate: "Aug 01, 2021",
      avatarUrl: null,
    },
    {
      id: 6,
      name: "Michael Johnson",
      empCode: "EMP-003",
      department: "IT Department",
      designation: "Software Engineer",
      joinDate: "Nov 20, 2020",
      avatarUrl: null,
    },
  ];
}

/**
 * Historique de bulletins par employé (démo).
 * @param {string|number} employeeId
 * @returns {Array<object>}
 */
export function getEmployeePayslipHistory(employeeId) {
  const id = String(employeeId);

  // CLEMENT (2) et bhuva (1) : pas d’historique (état maquette vide)
  if (id === "1" || id === "2") return [];

  // Autres employés : quelques bulletins pour illustrer le full flow
  const basePeriods = [
    { period: "April 2026", cycle: "April 2026", status: "paid" },
    { period: "March 2026", cycle: "March 2026", status: "paid" },
    { period: "February 2026", cycle: "February 2026", status: "approved" },
    { period: "January 2026", cycle: "January 2026", status: "pending" },
    { period: "December 2025", cycle: "December 2025", status: "paid" },
  ];

  const seed = Number(id) || 3;
  return basePeriods.map((p, i) => {
    const gross = round2(82000 + seed * 1200 + i * 850);
    const allowances = round2(gross * 0.12);
    const deductions = round2(gross * 0.05);
    const tax = round2(gross * 0.08);
    const net = round2(gross + allowances - deductions - tax);
    return {
      id: seed * 100 + i + 1,
      employeeId: Number(id),
      period: p.period,
      cycle: p.cycle,
      grossSalary: gross,
      allowances,
      deductions,
      tax,
      netSalary: net,
      status: p.status,
    };
  });
}

/**
 * KPI dérivés de l’historique.
 * @param {Array<object>} rows
 */
export function computePayslipHistoryKpis(rows = []) {
  const total = rows.length;
  const totalEarned = round2(rows.reduce((s, r) => s + Number(r.grossSalary || 0), 0));
  const totalDeductions = round2(
    rows.reduce((s, r) => s + Number(r.deductions || 0) + Number(r.tax || 0), 0)
  );
  const avgNet =
    total > 0 ? round2(rows.reduce((s, r) => s + Number(r.netSalary || 0), 0) / total) : 0;
  return {
    totalRecords: total,
    totalEarned,
    totalDeductions,
    averageNetPay: avgNet,
  };
}

/**
 * Série tendance salaire net (mois).
 * @param {Array<object>} rows
 * @returns {{ labels: string[], values: number[] }}
 */
export function buildSalaryTrendFromHistory(rows = []) {
  if (!rows.length) {
    return {
      labels: ["", "", "", "", ""],
      values: [0, 0, 0, 0, 0],
    };
  }
  // Chronologique croissant pour le graphique
  const ordered = [...rows].reverse();
  return {
    labels: ordered.map((r) => r.period.replace(/ 20/, " ")),
    values: ordered.map((r) => Number(r.netSalary) || 0),
  };
}
