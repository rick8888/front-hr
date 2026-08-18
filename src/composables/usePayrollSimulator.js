import { computed, unref } from "vue";

/**
 * Simulateur de paie — Maroc (MAD).
 * Toutes les valeurs sont mensuelles.
 *
 * Taux CNSS salarial : 4.48 % — plafonné à 6000 MAD d'assiette.
 * Taux AMO salarial  : 2.26 % — non plafonné.
 * IR : barème progressif par tranches mensuelles.
 */

export const CNSS_RATE = 0.0448;
export const CNSS_CEILING = 6000;
export const AMO_RATE = 0.0226;

export const IR_BRACKETS = [
  { min: 0, max: 2500, rate: 0 },
  { min: 2500, max: 4166, rate: 0.1 },
  { min: 4166, max: 5000, rate: 0.2 },
  { min: 5000, max: 6666, rate: 0.3 },
  { min: 6666, max: 15000, rate: 0.34 },
  { min: 15000, max: null, rate: 0.38 },
];

const TAX_CODES = new Set(["CNSS", "AMO", "IR"]);

function round2(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

/**
 * Calcul cumulatif de l'IR par tranche.
 * @param {number} amount assiette imposable (TAXABLE)
 * @returns {number} IR mensuel en MAD
 */
export function calculateIR(amount) {
  const base = Number(amount);
  if (!Number.isFinite(base) || base <= 0) return 0;

  let tax = 0;
  for (const bracket of IR_BRACKETS) {
    if (base <= bracket.min) break;
    const upper = bracket.max == null ? Infinity : bracket.max;
    const taxableInBracket = Math.min(base, upper) - bracket.min;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    if (base <= upper) break;
  }

  return round2(tax);
}

/**
 * Composable principal — attend un ref (ou array reactive) de composants.
 * @param {import('vue').Ref | Array} componentsSource
 */
export function usePayrollSimulator(componentsSource) {
  const componentsList = computed(() => unref(componentsSource) || []);

  const gains = computed(() =>
    componentsList.value.filter((c) => c.type === "gain")
  );

  const deductions = computed(() =>
    componentsList.value.filter((c) => c.type === "deduction")
  );

  // GROSS = somme des gains
  const gross = computed(() =>
    round2(
      gains.value.reduce((sum, c) => sum + (Number(c.value) || 0), 0)
    )
  );

  // CNSS = MIN(GROSS, plafond) * taux
  const cnss = computed(() =>
    round2(Math.min(gross.value, CNSS_CEILING) * CNSS_RATE)
  );

  // AMO = GROSS * taux
  const amo = computed(() => round2(gross.value * AMO_RATE));

  // TAXABLE = GROSS - CNSS - AMO
  const taxable = computed(() => round2(gross.value - cnss.value - amo.value));

  // IR = barème progressif appliqué au TAXABLE
  const ir = computed(() => calculateIR(taxable.value));

  /**
   * Déductions enrichies : pour chaque composant de déduction,
   * on renvoie sa valeur calculée automatiquement si c'est une taxe connue.
   */
  const computedDeductions = computed(() =>
    deductions.value.map((d) => {
      const isAutoSource =
        d.source_type === "tax" ||
        d.source_type === "formula" ||
        TAX_CODES.has(d.code);

      let value = Number(d.value) || 0;
      if (isAutoSource) {
        if (d.code === "CNSS") value = cnss.value;
        else if (d.code === "AMO") value = amo.value;
        else if (d.code === "IR") value = ir.value;
      }

      return {
        ...d,
        value,
        auto: isAutoSource,
      };
    })
  );

  const totalDeductions = computed(() =>
    round2(
      computedDeductions.value.reduce(
        (sum, d) => sum + (Number(d.value) || 0),
        0
      )
    )
  );

  const net = computed(() => round2(gross.value - totalDeductions.value));

  /** Snapshot pur (non-réactif) — utile pour export / futur appel backend */
  function buildSnapshot() {
    return {
      gross: gross.value,
      cnss: cnss.value,
      amo: amo.value,
      taxable: taxable.value,
      ir: ir.value,
      totalDeductions: totalDeductions.value,
      net: net.value,
      gains: gains.value.map((g) => ({ ...g })),
      deductions: computedDeductions.value.map((d) => ({ ...d })),
    };
  }

  return {
    gains,
    deductions,
    computedDeductions,
    gross,
    cnss,
    amo,
    taxable,
    ir,
    totalDeductions,
    net,
    calculateIR,
    buildSnapshot,
  };
}
