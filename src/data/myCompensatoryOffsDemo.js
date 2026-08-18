/**
 * Démo / fixtures pour /self-service/my-compensatory-offs.
 * Représente les compensatory offs gagnés par l'employé connecté.
 */

const TODAY_ISO = "2026-05-09";

export const MY_COMP_OFF_STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];
export const MY_COMP_OFF_USAGE_OPTIONS = ["Available", "Used", "Expired"];

/** Source brute (alignée avec la maquette : 2 entrées approuvées et déjà expirées). */
export const myCompensatoryOffs = [
  {
    id: 1,
    workedDate: "2025-10-11",
    hoursWorked: 11,
    compOffDays: 1,
    expiryDate: "2026-01-11",
    status: "Approved",
    usageStatus: "Expired",
    reason: "Worked on Saturday for the quarterly release.",
  },
  {
    id: 2,
    workedDate: "2025-10-02",
    hoursWorked: 12,
    compOffDays: 1,
    expiryDate: "2026-01-02",
    status: "Approved",
    usageStatus: "Expired",
    reason: "Production incident handled on the weekend.",
  },
];

/** Calcule les KPIs « Total Earned / Available / Used / Expired » à partir de la liste. */
export function computeMyCompOffKpis(rows = []) {
  let totalEarned = 0;
  let used = 0;
  let expired = 0;
  let available = 0;

  rows.forEach((r) => {
    if (r.status !== "Approved") return;
    totalEarned += Number(r.compOffDays) || 0;
    if (r.usageStatus === "Used") used += Number(r.compOffDays) || 0;
    else if (r.usageStatus === "Expired") expired += Number(r.compOffDays) || 0;
    else if (r.usageStatus === "Available") available += Number(r.compOffDays) || 0;
  });

  return {
    totalEarned: round(totalEarned),
    available: round(available),
    used: round(used),
    expired: round(expired),
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}

export const MY_COMP_OFF_TODAY = TODAY_ISO;
