import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const PAYROLL_CYCLE_OPTIONS = [
  { value: "monthly", label: "Mensuel" },
  { value: "biweekly", label: "Bi-mensuel" },
  { value: "weekly", label: "Hebdomadaire" },
];

export function normalizePayrollCycle(raw) {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    label: raw.name,
    description: raw.description ?? "",
    sortOrder: raw.sort_order ?? 0,
    isSystem: !!raw.is_system,
    isActive: raw.is_active !== false,
  };
}

export function fallbackPayrollCycles() {
  return PAYROLL_CYCLE_OPTIONS.map((option, index) => ({
    id: option.value,
    name: option.label,
    code: option.value,
    label: option.label,
    description: "",
    sortOrder: (index + 1) * 10,
    isSystem: true,
    isActive: true,
  }));
}

export function payrollCycleLabel(code, catalog = []) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const fallback = PAYROLL_CYCLE_OPTIONS.find((item) => item.value === code);
  return fallback?.label || code || "—";
}

export const payrollCyclesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/payroll-cycles", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizePayrollCycle) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/payroll-cycles", payload);
    return normalizePayrollCycle(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/payroll-cycles/${id}`, payload);
    return normalizePayrollCycle(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/payroll-cycles/${id}/status`, {
      is_active: isActive,
    });
    return normalizePayrollCycle(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/payroll-cycles/${id}`);
  },
};
