import { initialsFromName } from "../utils/payroll-http.js";

/**
 * Mappe employés + structure active pour l’écran Structures / Builder.
 */

export function mapEmployeeBase(emp) {
  const name =
    emp.full_name ||
    emp.name ||
    [emp.first_name, emp.last_name].filter(Boolean).join(" ") ||
    "—";

  return {
    id: emp.id,
    name,
    empCode: emp.matricule || `EMP-${emp.id}`,
    email: emp.email || "",
    departmentId: emp.department || emp.department_id || null,
    departmentName: emp.department || "—",
    baseSalaryContract: emp.base_salary != null ? Number(emp.base_salary) : null,
    currency: emp.currency || null,
    initials: initialsFromName(name),
    avatarUrl: emp.avatar_url ?? emp.avatarUrl ?? null,
    is_active: emp.is_active !== false && emp.active !== false,
  };
}

export function pickActiveStructure(structures) {
  if (!Array.isArray(structures) || !structures.length) return null;
  return (
    structures.find((s) => s.status === "active") ||
    structures[0] ||
    null
  );
}

export function mapStructureLinesToDraft(structure, catalogByCode) {
  if (!structure?.lines?.length) return [];

  return structure.lines.map((line, idx) => {
    const comp = line.component;
    const code = comp?.code || `COMP_${line.salary_component_id}`;
    const meta = catalogByCode?.[code];
    const calc = comp?.calculation_type || meta?.calculation_type || "fixed";

    let valueKind = "fixed";
    let value = line.amount_override;
    if (line.rate_override != null) {
      valueKind = "percent";
      value = Number(line.rate_override) * 100;
    } else if (calc === "percent" && line.amount_override != null) {
      valueKind = "percent";
      value = Number(line.amount_override) * 100;
    } else if (value == null && meta?.default_value != null) {
      value = Number(meta.default_value);
    }

    const sourceType =
      meta?.source_type ||
      (calc === "tax" || meta?.is_statutory || comp?.is_statutory
        ? "tax"
        : "manual");

    return {
      id: line.id || `line-${line.salary_component_id}-${idx}`,
      salary_component_id: line.salary_component_id,
      componentCode: code,
      name: comp?.name || meta?.name || code,
      type: (comp?.type || meta?.type || "earning") === "earning" ? "gain" : "deduction",
      sourceType,
      valueKind,
      value: sourceType === "manual" ? value : null,
      effectiveFrom: structure.effective_from || null,
      effectiveTo: structure.effective_to || null,
      active: line.is_active !== false,
      displayOrder: line.sequence ?? meta?.display_order ?? 100,
      base: code === "BASE_SALARY" || !!meta?.base,
    };
  });
}

export function enrichEmployeeWithStructure(base, structure, catalogByCode = {}) {
  const lines = mapStructureLinesToDraft(structure, catalogByCode);
  const active = lines.filter((l) => l.active);
  const codes = active.map((l) => l.componentCode);

  // Catalogue attendu : tous les composants actifs de l’entreprise
  const expectedCodes = Object.keys(catalogByCode || {}).filter(Boolean);
  const assignedSet = new Set(
    codes.filter((code) => expectedCodes.includes(code) || catalogByCode?.[code])
  );

  const expectedCount = expectedCodes.length;
  // Composants du catalogue effectivement présents dans la composition
  const assignedCount =
    expectedCount > 0
      ? expectedCodes.filter((code) => assignedSet.has(code)).length
      : codes.length;

  let baseSalary =
    structure?.base_salary != null ? Number(structure.base_salary) : null;
  if (baseSalary == null) {
    const baseLine = active.find(
      (l) => l.componentCode === "BASE_SALARY" || l.base
    );
    if (baseLine?.value != null) baseSalary = Number(baseLine.value);
  }

  /**
   * Complet = chaque composant du catalogue entre dans la composition salariale.
   * Incomplet = structure démarrée mais catalogue non entièrement couvert.
   * Non configuré = aucune structure / aucune ligne.
   */
  let structureStatus = "none";
  if (!structure && active.length === 0) {
    structureStatus = "none";
  } else if (
    expectedCount > 0 &&
    expectedCodes.every((code) => assignedSet.has(code))
  ) {
    structureStatus = "complete";
  } else if (structure || active.length > 0) {
    structureStatus = "incomplete";
  } else {
    structureStatus = "none";
  }

  const missingCodes =
    expectedCount > 0
      ? expectedCodes.filter((code) => !assignedSet.has(code))
      : [];

  const fixedSum = active
    .filter((l) => l.sourceType === "manual" && l.valueKind === "fixed" && l.value != null)
    .reduce((s, l) => s + (Number(l.value) || 0), 0);

  return {
    ...base,
    currency: structure?.currency || base.currency,
    structure,
    structureId: structure?.id ?? null,
    structureLines: lines,
    componentCodes: codes,
    baseSalary,
    structureStatus,
    assignedCount,
    expectedCount,
    missingComponentCodes: missingCodes,
    totalFixed: active.length ? fixedSum || baseSalary : null,
    hasVariablePercent: active.some((l) => l.valueKind === "percent"),
    lastUpdatedLabel: structure?.effective_from
      ? `depuis ${structure.effective_from}`
      : "—",
  };
}

/**
 * Construit le payload POST structure depuis le draft builder.
 * @param {object} opts
 * @param {Array} opts.draftLines
 * @param {Array} opts.components — catalogue API mappé (avec id)
 * @param {number|null} opts.baseSalaryHint
 */
export function mapDraftToAssignPayload({ draftLines, components, baseSalaryHint }) {
  const byCode = Object.fromEntries((components || []).map((c) => [c.code, c]));
  const active = (draftLines || []).filter((l) => l.active);

  const baseLine = active.find((l) => l.componentCode === "BASE_SALARY");
  let baseSalary = baseSalaryHint;
  if (baseLine && baseLine.value != null) {
    baseSalary = Number(baseLine.value);
  }
  if (baseSalary == null || Number.isNaN(baseSalary)) baseSalary = 0;

  const dates = active
    .map((l) => l.effectiveFrom)
    .filter(Boolean)
    .sort();
  const effective_from = dates[0] || new Date().toISOString().slice(0, 10);

  const lines = active
    .map((line, idx) => {
      const comp = byCode[line.componentCode];
      if (!comp?.id) return null;

      const payload = {
        salary_component_id: comp.id,
        sequence: line.displayOrder ?? (idx + 1) * 10,
        is_active: true,
        amount_override: null,
        rate_override: null,
        formula_override: null,
      };

      if (line.sourceType === "manual") {
        if (line.valueKind === "percent") {
          payload.rate_override = (Number(line.value) || 0) / 100;
        } else {
          payload.amount_override = Number(line.value) || 0;
        }
      }

      return payload;
    })
    .filter(Boolean);

  return {
    name: "Structure active",
    base_salary: baseSalary,
    effective_from,
    effective_to: null,
    status: "active",
    lines,
  };
}
