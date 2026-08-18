/** Données démo pour le rapport Department Summary (front only). */

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * Lignes de synthèse par département (valeurs proches de la maquette).
 * @returns {Array<object>}
 */
export function buildDepartmentSummaryRows() {
  // Totaux cibles maquette : net $4,307,809.03 · 10 employés · moy. $97,904.75 (sur base register)
  // Répartition volontairement déséquilibrée (Sales dominant).
  const seed = [
    {
      id: "admin",
      department: "Admin Department",
      employees: 1,
      totalGross: 280150.0,
      totalDeductions: 26120.5,
    },
    {
      id: "hr",
      department: "HR Department",
      employees: 2,
      totalGross: 520400.0,
      totalDeductions: 48980.25,
    },
    {
      id: "it",
      department: "IT Department",
      employees: 2,
      totalGross: 615300.0,
      totalDeductions: 57450.0,
    },
    {
      id: "sales",
      department: "Sales Department",
      employees: 5,
      totalGross: 3387300.0,
      totalDeductions: 362790.22,
    },
  ];

  const rows = seed.map((r) => {
    const totalNet = round2(r.totalGross - r.totalDeductions);
    const averageSalary = r.employees > 0 ? round2(totalNet / r.employees) : 0;
    return {
      ...r,
      totalGross: round2(r.totalGross),
      totalDeductions: round2(r.totalDeductions),
      totalNet,
      averageSalary,
      cycles: ["Monthly", "Bi-weekly"],
    };
  });

  // Ajuste le net total vers 4,307,809.03 (sur Sales)
  const TARGET_NET = 4307809.03;
  const sumNet = rows.reduce((s, r) => s + r.totalNet, 0);
  const drift = round2(TARGET_NET - sumNet);
  const sales = rows[rows.length - 1];
  sales.totalNet = round2(sales.totalNet + drift);
  sales.totalGross = round2(sales.totalNet + sales.totalDeductions);
  sales.averageSalary = round2(sales.totalNet / sales.employees);

  return rows;
}

/**
 * Options de cycle pour les filtres.
 */
export const DEPARTMENT_SUMMARY_CYCLES = ["Monthly", "Bi-weekly", "Weekly"];
