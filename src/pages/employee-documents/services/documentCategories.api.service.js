import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const DOCUMENT_CATEGORY_OPTIONS = [
  { value: "passport", label: "Passeport" },
  { value: "work_visa", label: "Visa de travail" },
  { value: "employment_contract", label: "Contrat de travail" },
  { value: "driving_license", label: "Permis de conduire" },
  { value: "national_id", label: "Pièce d’identité" },
  { value: "other", label: "Autre" },
];

export function normalizeDocumentCategory(raw) {
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

export function fallbackDocumentCategories() {
  return DOCUMENT_CATEGORY_OPTIONS.map((option, index) => ({
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

export function documentCategoryLabel(code, catalog = []) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const fallback = DOCUMENT_CATEGORY_OPTIONS.find((item) => item.value === code);
  return fallback?.label || code || "—";
}

export const documentCategoriesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/document-categories", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeDocumentCategory) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/document-categories", payload);
    return normalizeDocumentCategory(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/document-categories/${id}`, payload);
    return normalizeDocumentCategory(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/document-categories/${id}/status`, {
      is_active: isActive,
    });
    return normalizeDocumentCategory(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/document-categories/${id}`);
  },
};
