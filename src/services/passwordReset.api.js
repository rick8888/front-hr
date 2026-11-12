import apiClient from "./api.js";

export const passwordResetApi = {
  async requestResetLink(email) {
    const { data } = await apiClient.post("/auth/password/email", { email });
    return data;
  },

  async resetPassword({ email, token, password, passwordConfirmation }) {
    const { data } = await apiClient.post("/auth/password/reset", {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
    return data;
  },
};
