/** Données démo pour le rapport Tax Summary (front only). */

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

const EMPLOYEES = [
  { id: 1, name: "John Confirmed", empCode: "EMP-001", department: "Sales Department" },
  { id: 2, name: "Jane Smith", empCode: "EMP-002", department: "HR Department" },
  { id: 3, name: "Michael Johnson", empCode: "EMP-003", department: "IT Department" },
  { id: 4, name: "Sarah Williams", empCode: "EMP-004", department: "Admin Department" },
  { id: 5, name: "David Brown", empCode: "EMP-005", department: "Sales Department" },
  { id: 6, name: "Emily Jones", empCode: "EMP-006", department: "Finance Department" },
  { id: 7, name: "Robert Garcia", empCode: "EMP-007", department: "IT Department" },
  { id: 8, name: "Lisa Miller", empCode: "EMP-008", department: "HR Department" },
];

const PERIODS = [
  "April 2026",
  "March 2026",
  "February 2026",
  "January 2026",
  "December 2025",
  "November 2025",
];

/**
 * Lignes détail taxe (≈ 24) — KPIs proches de la maquette.
 * @returns {Array<object>}
 */
export function buildTaxSummaryRecords() {
  const rows = [];
  let id = 1;

  // 3 périodes × 8 employés = 24 lignes
  for (let p = 0; p < 3; p++) {
    EMPLOYEES.forEach((emp, ei) => {
      const gross = round2(72000 + ei * 4200 + p * 850 + (ei % 3) * 1200);
      const taxableRatio = 0.82 + (ei % 5) * 0.01;
      const taxableIncome = round2(gross * taxableRatio);
      // Taxe individuelle max cible ~13 880 (Employee index 0 period 0 un peu au-dessus, puis rééchelonnage)
      let taxAmount = round2(taxableIncome * (0.08 + (ei % 4) * 0.012 + p * 0.002));
      const netPay = round2(gross - taxAmount);

      rows.push({
        id: id++,
        employeeId: emp.id,
        employeeName: emp.name,
        empCode: emp.empCode,
        email: `${emp.name.replace(/\s+/g, ".").toLowerCase()}@company.com`,
        department: emp.department,
        period: PERIODS[p],
        cycle: "Monthly",
        grossSalary: gross,
        taxableIncome,
        taxAmount,
        netPay,
      });
    });
  }

  // Ajuste le total taxe vers 159 120 et plafonne le max individuel autour de 13 880
  const TARGET_TAX = 159120;
  const TARGET_MAX = 13880;
  const sumTax = rows.reduce((s, r) => s + r.taxAmount, 0);
  if (sumTax > 0) {
    const factor = TARGET_TAX / sumTax;
    rows.forEach((r) => {
      r.taxAmount = round2(r.taxAmount * factor);
      r.netPay = round2(r.grossSalary - r.taxAmount);
    });
  }
  const maxRow = rows.reduce((a, b) => (a.taxAmount >= b.taxAmount ? a : b));
  if (maxRow.taxAmount > 0 && Math.abs(maxRow.taxAmount - TARGET_MAX) > 1) {
    const scale = TARGET_MAX / maxRow.taxAmount;
    // Scale lightly all rows then fix max and reconverge sum
    rows.forEach((r) => {
      r.taxAmount = round2(r.taxAmount * scale);
    });
    const sum2 = rows.reduce((s, r) => s + r.taxAmount, 0);
    const drift = round2(TARGET_TAX - sum2);
    maxRow.taxAmount = round2(maxRow.taxAmount + drift);
    // Keep max as highest
    rows.forEach((r) => {
      if (r !== maxRow && r.taxAmount > maxRow.taxAmount) {
        r.taxAmount = round2(maxRow.taxAmount - 50);
      }
      r.netPay = round2(r.grossSalary - r.taxAmount);
    });
  }

  return rows;
}

/**
 * Tendance des 6 derniers mois (taxe agrégée).
 * @returns {{ labels: string[], values: number[] }}
 */
export function buildTaxTrendSeries() {
  // Période inverse chrono pour l’axe Mar → Aug style, ici Nov 25 → Apr 26
  const labels = [
    "Nov 2025",
    "Dec 2025",
    "Jan 2026",
    "Feb 2026",
    "Mar 2026",
    "Apr 2026",
  ];
  const values = [24200, 25150, 24800, 26800, 27520, 30650];
  // Total ~ 159 120 approx sur 6 mois pour cohérence visuelle
  const sum = values.reduce((s, v) => s + v, 0);
  const target = 159120;
  const factor = target / sum;
  return {
    labels,
    values: values.map((v) => round2(v * factor)),
  };
}

export const TAX_SUMMARY_CYCLES = ["Monthly", "Bi-weekly", "Weekly"];

export function listTaxEmployees() {
  return EMPLOYEES.map((e) => ({
    id: e.id,
    name: e.name,
    department: e.department,
  }));
}

export function listTaxDepartments() {
  return [...new Set(EMPLOYEES.map((e) => e.department))].sort();
}
