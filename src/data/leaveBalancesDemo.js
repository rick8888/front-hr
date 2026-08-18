/** Demo data for the Leave Balance Management table. */

/** Master catalog of leave types in display order (code + human label). */
export const LEAVE_TYPE_DEFINITIONS = [
  { code: "CL", name: "Casual Leave" },
  { code: "SL", name: "Sick Leave" },
  { code: "EL", name: "Earned Leave" },
  { code: "ML", name: "Maternity Leave" },
  { code: "PTL", name: "Paternity Leave" },
  { code: "AL", name: "Adoption Leave" },
  { code: "BL", name: "Bereavement Leave" },
  { code: "MRL", name: "Marriage Leave" },
  { code: "STL", name: "Study Leave" },
  { code: "CO", name: "Compensatory Off" },
  { code: "WFH", name: "Work From Home" },
  { code: "LWP", name: "Leave Without Pay" },
  { code: "SAB", name: "Sabbatical Leave" },
  { code: "MDL", name: "Medical Leave" },
  { code: "EML", name: "Emergency Leave" },
  { code: "QL", name: "Quarantine Leave" },
  { code: "JDL", name: "Jury Duty Leave" },
  { code: "VL", name: "Voting Leave" },
  { code: "BDL", name: "Birthday Leave" },
  { code: "RL", name: "Relocation Leave" },
];

/** Column codes shown in the balance table (order matters). */
export const LEAVE_BALANCE_CODES = LEAVE_TYPE_DEFINITIONS.map((t) => t.code);

export const TEAMS_DEMO = [
  "Sales Team 1",
  "Default Team",
  "Admin Manager",
  "IT",
  "HR",
];

function balancesAt(value, codes = LEAVE_BALANCE_CODES) {
  return codes.reduce((acc, code) => {
    acc[code] = value;
    return acc;
  }, {});
}

function balancesFromMap(map, codes = LEAVE_BALANCE_CODES) {
  return codes.reduce((acc, code) => {
    acc[code] = map[code] ?? 0;
    return acc;
  }, {});
}

const ADMIN_BALANCES = {
  CL: 9.4,
  SL: 8.3,
  EL: 13.9,
  ML: 7.2,
  PTL: 7.2,
  AL: 9.2,
  BL: 10.2,
  MRL: 7.2,
  STL: 6.5,
  CO: 5.5,
  WFH: 6.5,
  LWP: 11.4,
  SAB: 9.2,
  MDL: 7.1,
  EML: 5.6,
  QL: 10.1,
  JDL: 5.2,
  VL: 5.6,
  BDL: 10.6,
  RL: 13,
};

export function createLeaveBalancesSeed() {
  const rows = [
    {
      id: 1,
      employee: "abc d",
      employeeCode: "EMP661",
      designation: "Sales Manager",
      team: "Sales Team 1",
      balances: balancesAt(0),
    },
    {
      id: 2,
      employee: "abc d2",
      employeeCode: "EMP2",
      designation: "IT Executive",
      team: "Sales Team 1",
      balances: balancesAt(0),
    },
    {
      id: 3,
      employee: "abc d3",
      employeeCode: "EMP 456",
      designation: "Sales Manager",
      team: "Sales Team 1",
      balances: balancesAt(0),
    },
    {
      id: 4,
      employee: "Admin User",
      employeeCode: "DEMO-001",
      designation: "Admin Manager",
      team: "Default Team",
      balances: balancesFromMap(ADMIN_BALANCES),
    },
    {
      id: 5,
      employee: "Ahmad Alamrah",
      employeeCode: "TENANT-008",
      designation: "-",
      team: "-",
      balances: balancesAt(0),
    },
    {
      id: 6,
      employee: "AMIT RAJ",
      employeeCode: "104",
      designation: "Default Designation",
      team: "Default Team",
      balances: balancesAt(0),
    },
    {
      id: 7,
      employee: "Anas Saif",
      employeeCode: "TENANT-003",
      designation: "-",
      team: "-",
      balances: balancesAt(0),
    },
    {
      id: 8,
      employee: "ASM SAKI",
      employeeCode: "new-44455555",
      designation: "Sales Manager",
      team: "Default Team",
      balances: balancesAt(0),
    },
    {
      id: 9,
      employee: "bhuva divyesh",
      employeeCode: "123456",
      designation: "Default Designation",
      team: "Default Team",
      balances: balancesAt(0),
    },
    {
      id: 10,
      employee: "Carla Rivers",
      employeeCode: "EMP-091",
      designation: "Recruiter",
      team: "HR",
      balances: balancesFromMap({
        CL: 4,
        SL: 2.5,
        EL: 1,
        AL: 6,
        BL: 1,
        WFH: 3.5,
      }),
    },
    {
      id: 11,
      employee: "Daniel Park",
      employeeCode: "EMP-092",
      designation: "Backend Engineer",
      team: "IT",
      balances: balancesFromMap({
        CL: 3,
        SL: 2,
        EL: 0.5,
        WFH: 8,
        CO: 2,
      }),
    },
    {
      id: 12,
      employee: "Elena Marsh",
      employeeCode: "EMP-093",
      designation: "Designer",
      team: "Default Team",
      balances: balancesAt(0),
    },
  ];

  return rows;
}

/** Lookup an employee in the seed by its `employeeCode`. */
export function findEmployeeByCode(code) {
  if (!code) return null;
  return createLeaveBalancesSeed().find((e) => e.employeeCode === code) || null;
}

/**
 * Build the per-leave-type detail rows for an employee.
 * Available = entitled + carriedForward + additional - used.
 * For demo purposes we mirror the existing "balance" column into Entitled
 * so totals match what the listing shows.
 */
export function buildLeaveBalanceDetails(employee) {
  if (!employee) return [];
  const balances = employee.balances ?? {};
  return LEAVE_TYPE_DEFINITIONS.map((type) => {
    const entitled = Number(balances[type.code] ?? 0);
    const carriedForward = 0;
    const additional = 0;
    const used = 0;
    const available = entitled + carriedForward + additional - used;
    return {
      code: type.code,
      name: type.name,
      entitled,
      carriedForward,
      additional,
      used,
      available,
    };
  });
}
