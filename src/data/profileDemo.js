/**
 * Démo / fixtures pour la page /profile.
 * Remplacer par un appel API quand le backend sera branché.
 */

export const profileDemo = {
  identity: {
    initials: "HU",
    name: "HR User",
    email: "hr@demo.com",
    joinedLabel: "Feb 19, 2026",
    statusLabel: "Active",
    connectionLabel: "Connected",
    avatarBg: "bg-secondary-200 text-secondary-700",
  },
  personal: {
    fullName: "HR User",
    dateOfBirth: "Feb 11, 2007",
    gender: "Male",
    language: "EN",
  },
  contact: {
    email: "hr@demo.com",
    phone: "0987654321",
  },
  system: {
    role: "hr",
    status: "Active",
    employeeCode: "DEMO-002",
  },
  work: {
    joiningDate: "Feb 19, 2023",
    experience: "3 years",
  },
  account: {
    username: "hr@demo.com",
    role: "hr",
    joiningDate: "Feb 19, 2023",
    languagePreference: "EN",
  },
  kpis: [
    { id: "member-since", icon: "clock", value: "2 months", label: "Member Since", tone: "secondary" },
    { id: "email-status", icon: "verified", value: "Verified", label: "Email Status", tone: "success" },
    { id: "joined-on", icon: "calendar", value: "Feb 19, 2026", label: "Joined On", tone: "info" },
    { id: "activities", icon: "activity", value: "100", label: "Activities", tone: "warning" },
  ],
  activities: buildDemoActivities(),
};

function buildDemoActivities() {
  const base = [
    {
      url: "https://opencorebs.com/auth/logout",
      ip: "105.112.125.237",
      relative: "5 hours ago",
    },
    {
      url: "https://opencorebs.com/auth/logout",
      ip: "2409:40d2:132a:cb67:f1ad:23f2:2b04:cdb9",
      relative: "22 hours ago",
    },
    {
      url: "https://opencorebs.com/auth/logout",
      ip: "2605:59c1:1916:a110:c924:8c96:1731:e130",
      relative: "22 hours ago",
    },
    {
      url: "https://saasopencorebs.czappstudio.com/auth/logout",
      ip: "5.163.146.159",
      relative: "2 days ago",
    },
    {
      url: "https://saasopencorebs.czappstudio.com/auth/logout",
      ip: "92.13.214.4",
      relative: "2 days ago",
    },
    {
      url: "https://opencorebs.com/dashboard",
      ip: "105.112.125.237",
      relative: "3 days ago",
    },
  ];
  return base.map((entry, index) => ({
    id: `activity-${index + 1}`,
    type: "Updated",
    ...entry,
  }));
}
