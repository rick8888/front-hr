import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const employeeOffboardingApiService = {
  async start(employeeId) {
    const { data } = await apiClient.post(`/employees/${employeeId}/offboarding`);
    const tasks = unwrap(data);
    return Array.isArray(tasks) ? tasks : [];
  },

  async fetchTasks() {
    const { data } = await apiClient.get("/employee-offboarding");
    const tasks = unwrap(data);
    return Array.isArray(tasks) ? tasks : [];
  },

  async updateTask(employeeId, taskId, status) {
    const { data } = await apiClient.patch(
      `/employees/${employeeId}/offboarding/${taskId}`,
      { status },
    );
    const tasks = unwrap(data);
    return Array.isArray(tasks) ? tasks : [];
  },
};
