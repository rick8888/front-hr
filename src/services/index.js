import apiClient from "./api";

export const employeeService = {
  getAll: () => apiClient.get("/employees").then((r) => r.data?.data ?? r.data),
  getById: (id) => apiClient.get(`/employees/${id}`).then((r) => r.data?.data ?? r.data),
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

export const candidateService = {
  getAll: () => apiClient.get("/candidates"),
  create: (data) => apiClient.post("/candidates", data),
  update: (id, data) => apiClient.put(`/candidates/${id}`, data),
  updateStage: (id, stage) => apiClient.patch(`/candidates/${id}/stage`, { stage }),
  delete: (id) => apiClient.delete(`/candidates/${id}`),
};
