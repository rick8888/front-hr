import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const DOCUMENT_TEMPLATE_FAMILIES = [
  { value: "contracts", labelKey: "admin.employees.documentTemplates.family.contracts" },
  { value: "discipline", labelKey: "admin.employees.documentTemplates.family.discipline" },
  { value: "termination", labelKey: "admin.employees.documentTemplates.family.termination" },
  { value: "certificates", labelKey: "admin.employees.documentTemplates.family.certificates" },
  { value: "email", labelKey: "admin.employees.documentTemplates.family.email" },
  { value: "notification", labelKey: "admin.employees.documentTemplates.family.notification" },
];

export const DOCUMENT_TEMPLATE_CHANNELS = [
  { value: "pdf", labelKey: "admin.employees.documentTemplates.channel.pdf" },
  { value: "email", labelKey: "admin.employees.documentTemplates.channel.email" },
  { value: "notification", labelKey: "admin.employees.documentTemplates.channel.notification" },
];

export function normalizeDocumentTemplate(raw) {
  return {
    id: raw.id,
    companyId: raw.company_id ?? null,
    scope: raw.scope ?? (raw.company_id ? "company" : "platform"),
    name: raw.name,
    code: raw.code,
    family: raw.family,
    channel: raw.channel,
    locale: raw.locale ?? "fr",
    subject: raw.subject ?? "",
    bodyHtml: raw.body_html ?? "",
    bodyHtmlPreview: raw.body_html_preview ?? "",
    documentCategoryCode: raw.document_category_code ?? "",
    version: raw.version ?? 1,
    status: raw.status ?? "draft",
    sortOrder: raw.sort_order ?? 0,
    isSystem: !!raw.is_system,
    isActive: raw.is_active !== false,
    publishedAt: raw.published_at ?? null,
  };
}

export const documentTemplatesApiService = {
  async fetchAll({ companyOnly = false } = {}) {
    const { data } = await apiClient.get("/document-templates", {
      params: companyOnly ? { company_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeDocumentTemplate) : [];
  },

  async fetchCatalog({ channel = "pdf" } = {}) {
    const { data } = await apiClient.get("/document-templates/catalog", {
      params: { channel },
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeDocumentTemplate) : [];
  },

  async fetchVariables() {
    const { data } = await apiClient.get("/document-templates/variables");
    const payload = unwrap(data);
    return Array.isArray(payload) ? payload : payload?.data ?? [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/document-templates/${id}`);
    return normalizeDocumentTemplate(unwrap(data));
  },

  async create(payload) {
    const { data } = await apiClient.post("/document-templates", payload);
    return normalizeDocumentTemplate(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/document-templates/${id}`, payload);
    return normalizeDocumentTemplate(unwrap(data));
  },

  async publish(id) {
    const { data } = await apiClient.post(`/document-templates/${id}/publish`);
    return normalizeDocumentTemplate(unwrap(data));
  },

  async duplicate(id) {
    const { data } = await apiClient.post(`/document-templates/${id}/duplicate`);
    return normalizeDocumentTemplate(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/document-templates/${id}`);
  },

  async previewForEmployee(employeeId, payload) {
    const response = await apiClient.post(
      `/employees/${employeeId}/document-templates/preview`,
      payload,
      payload?.channel === "pdf" || !payload?.channel
        ? { responseType: "blob" }
        : undefined,
    );
    return response;
  },

  async generateForEmployee(employeeId, payload) {
    const { data } = await apiClient.post(
      `/employees/${employeeId}/document-templates/generate`,
      payload,
    );
    return unwrap(data);
  },

  async previewTemplate(templateId, { employeeId } = {}) {
    const response = await apiClient.post(
      `/document-templates/${templateId}/preview`,
      employeeId ? { employee_id: employeeId } : {},
      { responseType: "blob" },
    );

    const contentType = response.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      const text = await response.data.text();
      const json = JSON.parse(text);
      const payload = unwrap(json);
      return {
        type: "email",
        subject: payload.subject,
        bodyHtml: payload.body_html,
      };
    }

    const blob = response.data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apercu-${templateId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    return { type: "pdf" };
  },
};
