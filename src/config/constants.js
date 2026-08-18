export const APP_CONFIG = {
  name: "Bravo RH",
  version: "1.0.0",
  description: "HR Management Admin System",
  baseUrl: import.meta.env?.VITE_APP_API_URL || "http://localhost:3000",
  timeout: 30000,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const USER_ROLES = {
  ADMIN: "admin",
  HR_MANAGER: "hr_manager",
  EMPLOYEE: "employee",
  MANAGER: "manager",
};

export const LEAVE_TYPES = [
  { value: "annual", label: "Annual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "study", label: "Study Leave" },
  { value: "recovery", label: "Récupération" },
];

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
];

export const PERFORMANCE_RATINGS = [
  { value: 5, label: "Excellent" },
  { value: 4, label: "Good" },
  { value: 3, label: "Average" },
  { value: 2, label: "Poor" },
  { value: 1, label: "Needs Improvement" },
];

export const DATE_FORMAT = "yyyy-MM-dd";
export const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const TIME_FORMAT = "HH:mm:ss";

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
};

export const COLORS = {
  primary: "#5b99f5",
  secondary: "#9333ea",
  success: "#22c55e",
  warning: "#eab308",
  error: "#ef4444",
  info: "#0ea5e9",
};
