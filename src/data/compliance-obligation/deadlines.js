/**
 * Calcul des prochaines échéances à partir d'une obligation de conformité.
 */

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return startOfDay(d);
}

function lastDayOfMonth(year, month1to12) {
  return new Date(year, month1to12, 0).getDate();
}

function shiftMonth(year, month1to12, delta) {
  const d = new Date(year, month1to12 - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function formatPeriodLabel(obligation, refYear, refMonth) {
  if (obligation.frequency === "annual" || obligation.reference_period === "previous_year") {
    return String(refYear);
  }
  if (obligation.frequency === "quarterly" || obligation.reference_period === "previous_quarter") {
    const quarter = Math.ceil(refMonth / 3);
    return `T${quarter} ${refYear}`;
  }
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${months[refMonth - 1]} ${refYear}`;
}

function computeDueDate(obligation, refYear, refMonth) {
  const rule = obligation.due_rule ?? {
    type: "fixed_day_next_month",
    day: obligation.deadline_day_of_month ?? 15,
  };

  if (rule.type === "fixed_day_next_month") {
    const next = shiftMonth(refYear, refMonth, 1);
    const day = Math.min(rule.day ?? 15, lastDayOfMonth(next.year, next.month));
    return startOfDay(new Date(next.year, next.month - 1, day));
  }

  if (rule.type === "fixed_day") {
    const dueYear = obligation.frequency === "annual" ? refYear + 1 : refYear;
    const month = rule.month ?? refMonth;
    const day = Math.min(rule.day ?? 1, lastDayOfMonth(dueYear, month));
    return startOfDay(new Date(dueYear, month - 1, day));
  }

  if (rule.type === "end_of_month_next_month") {
    const next = shiftMonth(refYear, refMonth, 1);
    const last = lastDayOfMonth(next.year, next.month);
    return startOfDay(new Date(next.year, next.month - 1, last));
  }

  const day = Math.min(
    obligation.deadline_day_of_month ?? 15,
    lastDayOfMonth(refYear, refMonth)
  );
  return startOfDay(new Date(refYear, refMonth - 1, day));
}

function referenceForDueMonth(obligation, dueYear, dueMonth) {
  if (obligation.reference_period === "previous_year") {
    return { year: dueYear - 1, month: 1 };
  }
  if (obligation.reference_period === "previous_quarter") {
    const shifted = shiftMonth(dueYear, dueMonth, -3);
    return { year: shifted.year, month: shifted.month };
  }
  const shifted = shiftMonth(dueYear, dueMonth, -1);
  return { year: shifted.year, month: shifted.month };
}

/**
 * Prochaine échéance pour une obligation (après la date `fromDate`).
 */
export function computeNextDeadline(obligation, fromDate = new Date()) {
  const today = startOfDay(fromDate);
  const maxIterations = obligation.frequency === "annual" ? 5 : 24;

  let probeYear = today.getFullYear();
  let probeMonth = today.getMonth() + 1;

  for (let i = 0; i < maxIterations; i++) {
    const ref = referenceForDueMonth(obligation, probeYear, probeMonth);
    const dueDate = computeDueDate(obligation, ref.year, ref.month);
    const graceEnd = addDays(dueDate, obligation.grace_days ?? 0);

    if (graceEnd >= today) {
      return buildDeadlineRow(obligation, ref.year, ref.month, dueDate, graceEnd, today);
    }

    if (obligation.frequency === "annual") {
      probeYear += 1;
    } else if (obligation.frequency === "quarterly") {
      const next = shiftMonth(probeYear, probeMonth, 3);
      probeYear = next.year;
      probeMonth = next.month;
    } else {
      const next = shiftMonth(probeYear, probeMonth, 1);
      probeYear = next.year;
      probeMonth = next.month;
    }
  }

  const ref = referenceForDueMonth(obligation, probeYear, probeMonth);
  const dueDate = computeDueDate(obligation, ref.year, ref.month);
  const graceEnd = addDays(dueDate, obligation.grace_days ?? 0);
  return buildDeadlineRow(obligation, ref.year, ref.month, dueDate, graceEnd, today);
}

function buildDeadlineRow(obligation, refYear, refMonth, dueDate, graceEnd, today) {
  const daysUntil = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));
  const daysUntilGraceEnd = Math.round((graceEnd - today) / (1000 * 60 * 60 * 24));

  let status = "upcoming";
  if (today > graceEnd) {
    status = "overdue";
  } else if (today > dueDate) {
    status = "grace";
  } else if (daysUntil <= 7) {
    status = "due_soon";
  }

  return {
    obligation_id: obligation.id,
    code: obligation.code,
    name: obligation.name,
    type: obligation.type,
    authority: obligation.authority,
    frequency: obligation.frequency,
    reference_period_label: formatPeriodLabel(obligation, refYear, refMonth),
    due_date: dueDate.toISOString().slice(0, 10),
    grace_end_date: graceEnd.toISOString().slice(0, 10),
    days_until: daysUntil,
    days_until_grace_end: daysUntilGraceEnd,
    status,
    linked_rule_codes: obligation.linked_rule_codes ?? obligation.settings?.linked_rule_codes ?? [],
    is_mandatory: obligation.is_mandatory ?? obligation.settings?.is_mandatory ?? false,
  };
}

/** @param {Array<object>} obligations */
export function computeAllDeadlines(obligations, fromDate = new Date()) {
  return obligations
    .filter((o) => o.is_active)
    .map((o) => computeNextDeadline(o, fromDate))
    .sort((a, b) => a.due_date.localeCompare(b.due_date));
}

export const DEADLINE_STATUS_LABELS = {
  overdue: "En retard",
  grace: "Délai de grâce",
  due_soon: "À échéance proche",
  upcoming: "À venir",
};

export function deadlineStatusLabel(status) {
  return DEADLINE_STATUS_LABELS[status] ?? status;
}

export function formatFrenchDate(isoDate) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}
