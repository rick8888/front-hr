export const TYPE_LABELS = {
  fiscal: "Fiscale",
  social: "Sociale",
};

export const FREQUENCY_LABELS = {
  monthly: "Mensuelle",
  quarterly: "Trimestrielle",
  annual: "Annuelle",
};

export const REFERENCE_PERIOD_LABELS = {
  previous_month: "Mois précédent",
  previous_quarter: "Trimestre précédent",
  previous_year: "Année précédente",
};

export const DUE_RULE_TYPE_LABELS = {
  fixed_day_next_month: "Jour fixe du mois suivant",
  fixed_day: "Date fixe (jour + mois)",
  end_of_month_next_month: "Fin du mois suivant",
};

export const FILING_CHANNEL_LABELS = {
  online: "En ligne",
  paper: "Papier",
  both: "Les deux",
};

export function typeLabel(type) {
  return TYPE_LABELS[type] ?? type;
}

export function frequencyLabel(frequency) {
  return FREQUENCY_LABELS[frequency] ?? frequency;
}

export function referencePeriodLabel(period) {
  return REFERENCE_PERIOD_LABELS[period] ?? period;
}

export function defaultForm(countryId) {
  return {
    country_id: countryId,
    code: "",
    name: "",
    description: "",
    type: "social",
    authority: "",
    frequency: "monthly",
    reference_period: "previous_month",
    due_rule: { type: "fixed_day_next_month", day: 15 },
    grace_days: 0,
    effective_from: "",
    is_active: true,
    settings: {
      filing_channel: "online",
      is_mandatory: true,
      linked_rule_codes: [],
    },
  };
}

export function obligationToForm(obligation) {
  return {
    country_id: obligation.country_id,
    code: obligation.code,
    name: obligation.name,
    description: obligation.description ?? "",
    type: obligation.type,
    authority: obligation.authority ?? "",
    frequency: obligation.frequency,
    reference_period: obligation.reference_period,
    due_rule: obligation.due_rule ?? { type: "fixed_day_next_month", day: 15 },
    grace_days: obligation.grace_days ?? 0,
    effective_from: obligation.effective_from ?? "",
    is_active: obligation.is_active,
    settings: {
      filing_channel: obligation.settings?.filing_channel ?? obligation.filing_channel ?? "online",
      is_mandatory: obligation.settings?.is_mandatory ?? obligation.is_mandatory ?? true,
      linked_rule_codes: obligation.settings?.linked_rule_codes ?? obligation.linked_rule_codes ?? [],
    },
  };
}

export function formToPayload(form) {
  return {
    country_id: form.country_id,
    code: form.code.trim().toUpperCase(),
    name: form.name.trim(),
    description: form.description?.trim() || null,
    type: form.type,
    authority: form.authority?.trim() || null,
    frequency: form.frequency,
    reference_period: form.reference_period,
    due_rule: { ...form.due_rule },
    grace_days: form.grace_days ?? 0,
    effective_from: form.effective_from || null,
    is_active: form.is_active,
    settings: {
      filing_channel: form.settings.filing_channel,
      is_mandatory: form.settings.is_mandatory,
      linked_rule_codes: form.settings.linked_rule_codes ?? [],
    },
  };
}
