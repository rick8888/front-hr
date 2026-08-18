/**
 * Démo / fixtures pour la page /self-service/my-regularization.
 * Replace by API call once backend is wired in.
 */

export const myRegularizationRequests = [
  {
    id: 1,
    date: "May 01, 2026",
    type: "Missing Check-in",
    requestedIn: "2026-05-08 03:52:00",
    requestedOut: "2026-05-08 03:54:00",
    reason: "ddexss",
    status: "Approved",
    approvedBy: {
      initials: "HU",
      name: "HR User",
      email: "hr@demo.com",
      avatarBg: "bg-secondary-200 text-secondary-700",
    },
  },
];
