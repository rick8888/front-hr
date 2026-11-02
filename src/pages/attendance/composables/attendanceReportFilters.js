import { departmentsApiService } from "../../organization/services/departments.api.service.js";

export function mergeDepartmentNames(catalog, employeeList) {
  const names = new Set();
  for (const entry of catalog) {
    const name = typeof entry === "string" ? entry : entry?.name ?? entry?.label;
    if (name) names.add(name);
  }
  for (const employee of employeeList) {
    if (employee?.department) names.add(employee.department);
  }
  return [...names].sort((a, b) => a.localeCompare(b, "fr"));
}

export async function fetchDepartmentCatalog(cached = []) {
  if (cached.length) return cached;
  const list = await departmentsApiService.fetchAll().catch(() => []);
  return Array.isArray(list) ? list : [];
}
