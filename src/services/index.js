import apiClient from "./api";

export const employeeService = {
  getAll: () => apiClient.get("/employees"),
  getById: (id) => apiClient.get(`/employees/${id}`),
  create: (data) => apiClient.post("/employees", data),
  update: (id, data) => apiClient.put(`/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/employees/${id}`),
};

export const attendanceService = {
  getAll: () => apiClient.get("/attendance"),
  getByDate: (date) => apiClient.get(`/attendance?date=${date}`),
  clockIn: (employeeId) => apiClient.post(`/attendance/${employeeId}/clock-in`),
  clockOut: (employeeId) =>
    apiClient.post(`/attendance/${employeeId}/clock-out`),
};

export const payrollService = {
  getAll: () => apiClient.get("/payroll"),
  getByMonth: (month, year) =>
    apiClient.get(`/payroll?month=${month}&year=${year}`),
  generate: (data) => apiClient.post("/payroll/generate", data),
};

export const departmentService = {
  getAll: () => apiClient.get("/departments"),
  getById: (id) => apiClient.get(`/departments/${id}`),
};
