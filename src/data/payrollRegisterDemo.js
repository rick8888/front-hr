/** Données démo pour le rapport Payroll Register (front only). */

const FIRST_NAMES = [
  "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa",
  "James", "Maria", "William", "Anna", "Richard", "Laura", "Thomas", "Sophie",
  "Chris", "Nina", "Daniel", "Emma", "Matthew", "Olivia", "Anthony", "Chloe",
  "Mark", "Julia", "Steven", "Rachel", "Paul", "Karen", "Andrew", "Helen",
  "Joshua", "Nancy", "Kevin", "Betty", "Brian", "Sandra", "George", "Ashley",
  "Edward", "Kimberly", "Ronald", "Donna",
];

const LAST_NAMES = [
  "Confirmed", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
  "Flores", "Green", "Adams", "Nelson",
];

const DEPTS = ["Engineering", "Human Resources", "Finance", "Operations", "Product", "Sales", "IT"];

const STATUSES = ["pending", "approved", "paid"];

/**
 * Construit 44 lignes de registre de paie (valeurs proches de la maquette).
 * @returns {Array<object>}
 */
export function buildPayrollRegisterRecords() {
  const rows = [];
  const periods = ["April 2026", "March 2026", "February 2026"];

  for (let i = 0; i < 44; i++) {
    const id = i + 1;
    const name = `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`;
    const grossBase = 95000 + (i % 11) * 3200 + (i % 5) * 850;
    const gross = Math.round(grossBase * 100) / 100;
    const deductions = Math.round(gross * (0.09 + (i % 7) * 0.005) * 100) / 100;
    const net = Math.round((gross - deductions) * 100) / 100;
    let status = "paid";
    if (i % 5 === 0) status = "pending";
    else if (i % 7 === 0) status = "approved";

    const period = periods[i % periods.length];

    rows.push({
      id,
      employeeId: id,
      employeeName: name,
      empCode: `EMP-${String(id).padStart(3, "0")}`,
      department: DEPTS[i % DEPTS.length],
      period,
      cycle: period,
      grossSalary: gross,
      deductions,
      netPay: net,
      status: STATUSES.includes(status) ? status : "paid",
    });
  }

  // Ajuste totaux pour coller à la maquette (arrondis centimes)
  const TARGET = {
    gross: 4803150.0,
    deductions: 495340.97,
    net: 4307809.03,
  };
  const sumGross = rows.reduce((s, r) => s + r.grossSalary, 0);
  if (sumGross > 0) {
    const gFactor = TARGET.gross / sumGross;
    rows.forEach((r) => {
      r.grossSalary = Math.round(r.grossSalary * gFactor * 100) / 100;
    });
    const driftG = TARGET.gross - rows.reduce((s, r) => s + r.grossSalary, 0);
    rows[rows.length - 1].grossSalary =
      Math.round((rows[rows.length - 1].grossSalary + driftG) * 100) / 100;
  }
  const sumDed = rows.reduce((s, r) => s + r.deductions, 0);
  if (sumDed > 0) {
    const dFactor = TARGET.deductions / sumDed;
    rows.forEach((r) => {
      r.deductions = Math.round(r.deductions * dFactor * 100) / 100;
    });
    const driftD = TARGET.deductions - rows.reduce((s, r) => s + r.deductions, 0);
    rows[rows.length - 1].deductions =
      Math.round((rows[rows.length - 1].deductions + driftD) * 100) / 100;
  }
  rows.forEach((r) => {
    r.netPay = Math.round((r.grossSalary - r.deductions) * 100) / 100;
  });
  const driftN = TARGET.net - rows.reduce((s, r) => s + r.netPay, 0);
  rows[rows.length - 1].netPay =
    Math.round((rows[rows.length - 1].netPay + driftN) * 100) / 100;

  return rows;
}
