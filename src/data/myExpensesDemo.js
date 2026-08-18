/**
 * Démo / fixtures pour /self-service/expenses.
 * Représente les notes de frais de l'employé connecté.
 */

export const MY_EXPENSE_TYPE_OPTIONS = [
  "Food",
  "Travel",
  "Accommodation",
  "Office Supplies",
  "Training",
  "Other",
];

export const MY_EXPENSE_STATUS_OPTIONS = ["Pending", "Approved", "Rejected", "Reimbursed"];

export const myExpenses = [
  {
    id: 4,
    type: "Food",
    expenseDate: "2026-05-07",
    amount: 250,
    currency: "USD",
    status: "Pending",
    receiptUrl: null,
    description: "Team lunch with the recruitment squad.",
  },
];
