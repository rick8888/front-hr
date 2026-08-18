/** Données démo partagées : liste (Payroll.vue) et fiche détail (PayrollShow.vue). */

import { buildPayrollRegisterRecords } from "./payrollRegisterDemo.js";
import { buildPayrollDetailFromRow, getShowcasePayrollDetail } from "./payrollShowDemo.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/** Jeu de données démo : 34 lignes (identique à l’ancien build dans Payroll.vue). */
export function buildDemoRecords() {
  const firstNames = [
    "Rachel", "David", "Sophie", "Karim", "Emma", "Lucas", "Julie", "Marc", "Nina", "Paul",
    "Chloé", "Thomas", "Léa", "Hugo", "Anna", "James", "Maria", "Chris", "Laura", "Alex",
    "Sam", "Jordan", "Taylor", "Morgan", "Casey", "River", "Quinn", "Blake", "Drew", "Reese",
    "Jamie", "Cameron", "Avery", "Rowan",
  ];
  const lastNames = [
    "Vance", "Promoted", "Martin", "Benali", "Laurent", "Bernard", "Petit", "Dubois", "Roche", "Garnier",
    "Arnaud", "Leroy", "Fontaine", "Mercier", "Lee", "Brown", "Garcia", "Wilson", "Martinez", "Anderson",
    "Taylor", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Moore", "Clark", "Lewis",
    "Walker", "Hall", "Young", "King",
  ];
  const rows = [];
  const now = new Date();
  const periodStr = now.toLocaleString("en-US", { month: "short", year: "numeric" });

  for (let i = 0; i < 34; i++) {
    const id = i + 1;
    const name = `${firstNames[i]} ${lastNames[i]}`;
    const empCode = `EMP-${String(100 + id).padStart(3, "0")}`;
    const basic = 4200 + (i % 7) * 400 + (i % 3) * 150;
    const gross = Math.round(basic * 1.18 + (i % 5) * 200);
    const net = Math.round(gross * 0.82 - (i % 4) * 50);
    let status = "paid";
    if (i < 11) status = "pending";

    rows.push({
      id,
      employeeId: id,
      employeeName: name,
      empCode,
      period: periodStr,
      basicSalary: basic,
      grossSalary: gross,
      netSalary: net,
      status,
    });
  }
  const TARGET_PAYOUT = 3122270.47;
  const paidRows = rows.filter((r) => r.status === "paid");
  const sumNet = paidRows.reduce((s, r) => s + r.netSalary, 0);
  if (sumNet > 0 && paidRows.length) {
    const factor = TARGET_PAYOUT / sumNet;
    paidRows.forEach((r) => {
      r.netSalary = Math.round(r.netSalary * factor * 100) / 100;
    });
    const drift = TARGET_PAYOUT - paidRows.reduce((s, r) => s + r.netSalary, 0);
    paidRows[paidRows.length - 1].netSalary =
      Math.round((paidRows[paidRows.length - 1].netSalary + drift) * 100) / 100;
  }
  return rows;
}

/**
 * Détail complet pour la fiche `/payroll/show/:id`.
 * Priorité : vitrine #38 → registre de paie → liste All Records.
 * @param {string|number} id
 * @returns {object|null}
 */
export function getPayrollDetail(id) {
  if (String(id) === "38") {
    return getShowcasePayrollDetail();
  }

  const registerRow = buildPayrollRegisterRecords().find((r) => String(r.id) === String(id));
  if (registerRow) {
    return buildPayrollDetailFromRow({
      ...registerRow,
      netSalary: registerRow.netPay,
      basicSalary: round2(registerRow.grossSalary * 0.55),
    });
  }

  const listRow = buildDemoRecords().find((r) => String(r.id) === String(id));
  if (listRow) {
    return buildPayrollDetailFromRow(listRow);
  }

  return null;
}

export { getShowcasePayrollDetail } from "./payrollShowDemo.js";
