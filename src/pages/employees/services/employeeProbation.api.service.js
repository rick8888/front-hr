import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const employeeProbationApiService = {
  async fetchReviews() {
    const { data } = await apiClient.get("/probation-reviews");
    const reviews = unwrap(data);
    return Array.isArray(reviews) ? reviews : [];
  },

  async recordReview(employeeId, payload) {
    const { data } = await apiClient.post(
      `/employees/${employeeId}/probation-reviews`,
      {
        review_date: payload.reviewDate,
        decision: payload.decision,
        extended_until: payload.extendedUntil || null,
        notes: payload.notes || null,
        termination: payload.termination
          ? {
              type: payload.termination.type,
              exit_date: payload.termination.exitDate,
              last_working_day: payload.termination.lastWorkingDay,
              reason: payload.termination.reason,
            }
          : undefined,
      },
    );
    return unwrap(data);
  },
};
