import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const employeeOnboardingApiService = {
  async fetchTasks(employeeId) {
    const { data } = await apiClient.get(`/employees/${employeeId}/onboarding`);
    const tasks = unwrap(data);
    return Array.isArray(tasks) ? tasks : [];
  },

  async updateTask(employeeId, taskId, status) {
    const { data } = await apiClient.patch(
      `/employees/${employeeId}/onboarding/${taskId}`,
      { status },
    );
    const tasks = unwrap(data);
    return Array.isArray(tasks) ? tasks : [];
  },
};
