/**
 * Démo / fixtures pour la page /self-service/leave-requests/new.
 * Chaque entrée représente un type de congé et son solde (annuel + utilisé).
 */

export const leavePolicies = [
  {
    id: "casual",
    name: "Casual Leave",
    description: "",
    annualEntitlement: 13,
    additional: 4,
    used: 6.5,
  },
  {
    id: "sick",
    name: "Sick Leave",
    description: "Paid leave for illness or medical appointments.",
    annualEntitlement: 12,
    additional: 0,
    used: 2,
  },
  {
    id: "earned",
    name: "Earned Leave",
    description: "Earned leave accrued based on service period.",
    annualEntitlement: 18,
    additional: 0,
    used: 5,
  },
  {
    id: "maternity",
    name: "Maternity Leave",
    description: "Paid leave for childbirth and recovery.",
    annualEntitlement: 90,
    additional: 0,
    used: 0,
  },
  {
    id: "paternity",
    name: "Paternity Leave",
    description: "Paid leave for fathers around the time of childbirth.",
    annualEntitlement: 10,
    additional: 0,
    used: 0,
  },
  {
    id: "adoption",
    name: "Adoption Leave",
    description: "Paid leave for legal child adoption.",
    annualEntitlement: 30,
    additional: 0,
    used: 0,
  },
  {
    id: "bereavement",
    name: "Bereavement Leave",
    description: "Paid leave for the loss of a close family member.",
    annualEntitlement: 5,
    additional: 0,
    used: 0,
  },
  {
    id: "marriage",
    name: "Marriage Leave",
    description: "Paid leave on marriage (employee or first-degree family).",
    annualEntitlement: 5,
    additional: 0,
    used: 0,
  },
  {
    id: "study",
    name: "Study Leave",
    description: "Paid or unpaid leave for academic exams or coursework.",
    annualEntitlement: 7,
    additional: 0,
    used: 0,
  },
  {
    id: "compensatory",
    name: "Compensatory Off",
    description: "Earned by working on a holiday or weekend.",
    annualEntitlement: 0,
    additional: 0,
    used: 0,
  },
  {
    id: "wfh",
    name: "Work From Home",
    description: "Day(s) of remote work.",
    annualEntitlement: 0,
    additional: 0,
    used: 0,
  },
  {
    id: "lwp",
    name: "Leave Without Pay",
    description: "Unpaid leave when other balances are exhausted.",
    annualEntitlement: 0,
    additional: 0,
    used: 0,
  },
  {
    id: "sabbatical",
    name: "Sabbatical Leave",
    description: "Long-term unpaid leave for personal projects.",
    annualEntitlement: 0,
    additional: 0,
    used: 0,
  },
  {
    id: "medical",
    name: "Medical Leave",
    description: "Extended leave for serious medical conditions.",
    annualEntitlement: 30,
    additional: 0,
    used: 0,
  },
  {
    id: "emergency",
    name: "Emergency Leave",
    description: "Short-notice leave for urgent personal events.",
    annualEntitlement: 3,
    additional: 0,
    used: 0,
  },
  {
    id: "quarantine",
    name: "Quarantine Leave",
    description: "Mandatory isolation due to contagious illness.",
    annualEntitlement: 14,
    additional: 0,
    used: 0,
  },
  {
    id: "jury",
    name: "Jury Duty Leave",
    description: "Leave for serving on jury duty.",
    annualEntitlement: 5,
    additional: 0,
    used: 0,
  },
  {
    id: "voting",
    name: "Voting Leave",
    description: "Leave to participate in official elections.",
    annualEntitlement: 1,
    additional: 0,
    used: 0,
  },
  {
    id: "birthday",
    name: "Birthday Leave",
    description: "1 paid day off on or near your birthday.",
    annualEntitlement: 1,
    additional: 0,
    used: 0,
  },
  {
    id: "relocation",
    name: "Relocation Leave",
    description: "Leave for moving to a new home.",
    annualEntitlement: 3,
    additional: 0,
    used: 0,
  },
];

export function getPolicyAvailable(policy) {
  if (!policy) return 0;
  return (
    Number(policy.annualEntitlement || 0) +
    Number(policy.additional || 0) -
    Number(policy.used || 0)
  );
}
