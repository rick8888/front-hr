import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

/** Self-service : GET /attendance + pointages. */
export const attendanceApiService = {
  async fetchMine() {
    const { data } = await apiClient.get("/attendance");
    return unwrap(data) ?? {};
  },

  async checkIn() {
    const { data } = await apiClient.post("/attendance/check-in");
    return unwrap(data) ?? {};
  },

  async checkOut() {
    const { data } = await apiClient.post("/attendance/check-out");
    return unwrap(data) ?? {};
  },

  async startBreak() {
    const { data } = await apiClient.post("/attendance/break/start");
    return unwrap(data) ?? {};
  },

  async endBreak() {
    const { data } = await apiClient.post("/attendance/break/end");
    return unwrap(data) ?? {};
  },
};
