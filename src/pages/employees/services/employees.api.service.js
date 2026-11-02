import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const employeesApiService = {
  /**
   * @param {object} [params]
   * @param {string} [params.search]
   * @param {string} [params.department]
   * @param {string} [params.structure_status] - complete | incomplete | none
   */
  async fetchAll(params = {}) {
    const query = {};
    if (params.search) query.search = params.search;
    if (params.department) query.department = params.department;
    if (params.structure_status && params.structure_status !== "all") {
      query.structure_status = params.structure_status;
    }
    const { data } = await apiClient.get("/employees", { params: query });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchById(id) {
    const { data } = await apiClient.get(`/employees/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    const { data } = await apiClient.post("/employees", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/employees/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/employees/${id}/status`);
    return unwrap(data);
  },

  /**
   * @param {number[]} ids
   * @param {'active'|'inactive'} status
   * @returns {Promise<{ updated: object[], skipped: { id: number, reason: string }[] }>}
   */
  async bulkStatus(ids, status) {
    const { data } = await apiClient.post("/employees/bulk-status", {
      ids,
      status,
    });
    const payload = unwrap(data) ?? {};
    return {
      updated: Array.isArray(payload.updated) ? payload.updated : [],
      skipped: Array.isArray(payload.skipped) ? payload.skipped : [],
    };
  },

  /**
   * @param {number|string} id
   * @param {{ suspensionDate: string, duration?: number|null, reason: string, notifyByEmail?: boolean }} payload
   */
  async suspend(id, payload) {
    const { data } = await apiClient.post(`/employees/${id}/suspend`, {
      suspension_date: payload.suspensionDate,
      duration: payload.duration || null,
      reason: payload.reason,
      notify_by_email: !!payload.notifyByEmail,
    });
    return unwrap(data);
  },

  /**
   * @param {number|string} id
   * @param {{ type: string, rehireEligible?: boolean, exitDate: string, lastWorkingDay: string, reason: string, notifyByEmail?: boolean, generateTerminationLetter?: boolean }} payload
   */
  async terminate(id, payload) {
    const { data } = await apiClient.post(`/employees/${id}/terminate`, {
      type: payload.type,
      rehire_eligible: !!payload.rehireEligible,
      exit_date: payload.exitDate,
      last_working_day: payload.lastWorkingDay,
      reason: payload.reason,
      notify_by_email: !!payload.notifyByEmail,
      generate_termination_letter: !!payload.generateTerminationLetter,
    });
    return unwrap(data);
  },

  async retire(id) {
    const { data } = await apiClient.post(`/employees/${id}/retire`);
    return unwrap(data);
  },

  async fetchActivities(id, params = {}) {
    const { data } = await apiClient.get(`/employees/${id}/activities`, {
      params,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async remove(id) {
    await apiClient.delete(`/employees/${id}`);
  },

  /**
   * Télécharge un CSV (tous ou une liste d'ids).
   * @param {number[]} [ids]
   */
  async exportCsv(ids = []) {
    const params = {};
    if (Array.isArray(ids) && ids.length) {
      params.ids = ids.join(",");
    }
    try {
      const { data, headers } = await apiClient.get("/employees/export", {
        params,
        responseType: "blob",
      });

      if (data instanceof Blob && data.type && data.type.includes("application/json")) {
        const text = await data.text();
        const json = JSON.parse(text);
        throw new Error(json?.message || "Export impossible.");
      }

      const blob = data instanceof Blob ? data : new Blob([data], { type: "text/csv" });
      const disposition = headers?.["content-disposition"] || "";
      const match = disposition.match(/filename="?([^"]+)"?/i);
      const filename = match?.[1] || `employees-${new Date().toISOString().slice(0, 10)}.csv`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      if (e?.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text();
          const json = JSON.parse(text);
          const err = new Error(json?.message || "Export impossible.");
          err.response = { data: json };
          throw err;
        } catch (inner) {
          if (inner?.response) throw inner;
        }
      }
      throw e;
    }
  },

  /**
   * Importe un fichier CSV.
   * @param {File} file
   * @returns {Promise<{imported: number, failed: number, errors: Array<{row: number, message: string}>}>}
   */
  async importCsv(file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post("/employees/import", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(data) ?? { imported: 0, failed: 0, errors: [] };
  },
};
