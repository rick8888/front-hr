import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const notesApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/self-service/notes");
    const notes = unwrap(data);
    return Array.isArray(notes) ? notes : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/self-service/notes", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.patch(`/self-service/notes/${id}`, payload);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/self-service/notes/${id}`);
  },
};
