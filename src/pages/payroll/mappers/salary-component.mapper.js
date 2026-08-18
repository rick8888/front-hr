/**
 * Mappe SalaryComponent API ↔ UI composants de paie.
 */

export function mapComponentFromApi(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    company_id: raw.company_id,
    country_id: raw.country_id,
    legal_tax_id: raw.legal_tax_id ?? null,
    name: raw.name,
    code: raw.code,
    type: raw.type,
    calculation_type: raw.calculation_type ?? "fixed",
    base_target: raw.base_target ?? "BASE",
    formula: raw.formula ?? null,
    default_value: raw.default_value != null ? Number(raw.default_value) : null,
    affects_gross: !!raw.affects_gross,
    affects_net: !!raw.affects_net,
    is_taxable: !!raw.is_taxable,
    display_order: raw.sequence ?? 0,
    sequence: raw.sequence ?? 0,
    base: String(raw.code || "").toUpperCase() === "BASE_SALARY",
    is_system: !!raw.is_statutory,
    is_statutory: !!raw.is_statutory,
    is_active: raw.is_active !== false,
    depends_on: raw.depends_on ?? null,
    description: raw.description ?? null,
  };
}

/** Payload API pour create/update depuis le formulaire UI */
export function mapComponentToApi(form) {
  const isBase = !!form.base || String(form.code || "").toUpperCase() === "BASE_SALARY";
  let code = String(form.code || "")
    .replace(/\s+/g, "_")
    .toUpperCase();
  if (isBase) code = "BASE_SALARY";

  const calculation_type = isBase ? "fixed" : form.calculation_type || "fixed";
  const formula =
    calculation_type === "formula" ? (form.formula || "").trim() || null : null;

  // La colonne MySQL `default_value` n'accepte pas NULL (default 0).
  let default_value = 0;
  if (calculation_type === "fixed" || calculation_type === "percent") {
    if (form.default_value !== "" && form.default_value != null && !Number.isNaN(Number(form.default_value))) {
      default_value = Number(form.default_value);
    }
  }

  return {
    code,
    name: String(form.name || "").trim() || (isBase ? "Salaire de base" : ""),
    type: isBase ? "earning" : form.type,
    calculation_type,
    formula: isBase ? null : formula,
    default_value,
    base_target: isBase ? "BASE" : form.base_target || "BASE",
    sequence: Number(form.display_order) || 0,
    affects_gross: isBase ? true : !!form.affects_gross,
    affects_net: isBase ? true : !!form.affects_net,
    is_taxable: isBase ? true : !!form.is_taxable,
    is_active: true,
  };
}

/** Catalogue pour le builder de structure */
export function mapComponentToCatalogItem(c) {
  return {
    id: c.id,
    code: c.code,
    name: c.name,
    type: c.type === "earning" ? "gain" : c.type,
    source_type: c.is_statutory || c.calculation_type === "tax" ? "tax" : "manual",
    display_order: c.display_order ?? c.sequence ?? 0,
    base: c.base || String(c.code).toUpperCase() === "BASE_SALARY",
    calculation_type: c.calculation_type,
    default_value: c.default_value,
    base_target: c.base_target,
    is_statutory: !!(c.is_statutory || c.is_system),
  };
}
