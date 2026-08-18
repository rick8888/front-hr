/**
 * Démo / fixtures pour /self-service/holidays.
 * Liste des jours fériés de l'année + helpers pour KPI / regroupements.
 */

export const MY_HOLIDAYS_TODAY = "2026-05-10";
export const MY_HOLIDAYS_YEAR = 2026;

/** Jours fériés démo pour 2026 (alignés avec la maquette). */
export const myHolidays = [
  { id: 1, name: "New Year's Day", date: "2026-01-01", notes: "" },
  { id: 2, name: "Martin Luther King Jr. Day", date: "2026-01-20", notes: "" },
  { id: 3, name: "yesterday", date: "2026-02-24", notes: "" },
  { id: 4, name: "tomorrow", date: "2026-02-26", notes: "" },
  { id: 5, name: "Good Friday", date: "2026-03-29", notes: "" },
  { id: 6, name: "Company Foundation Day", date: "2026-06-15", notes: "" },
  { id: 7, name: "Independence Day", date: "2026-07-04", notes: "" },
  { id: 8, name: "Summer Friday", date: "2026-07-12", notes: "" },
  { id: 9, name: "Diwali", date: "2026-11-01", notes: "" },
  { id: 10, name: "Thanksgiving", date: "2026-11-28", notes: "" },
  { id: 11, name: "Christmas Day", date: "2026-12-25", notes: "" },
];

export function parseIso(iso) {
  const d = new Date(iso + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dayName(iso, locale = "en-US") {
  const d = parseIso(iso);
  if (!d) return "";
  return d.toLocaleDateString(locale, { weekday: "long" });
}

export function shortDayName(iso, locale = "en-US") {
  const d = parseIso(iso);
  if (!d) return "";
  return d.toLocaleDateString(locale, { weekday: "short" });
}

export function shortDateLabel(iso, locale = "en-US") {
  const d = parseIso(iso);
  if (!d) return iso;
  return d.toLocaleDateString(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function daysBetween(fromIso, toIso) {
  const a = parseIso(fromIso);
  const b = parseIso(toIso);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** Statut du jour férié vis-à-vis d'aujourd'hui. */
export function holidayStatus(iso, todayIso = MY_HOLIDAYS_TODAY) {
  const diff = daysBetween(todayIso, iso);
  if (diff < 0) return "Past";
  return "Upcoming";
}

/** KPIs (Total / Past / Upcoming). */
export function computeMyHolidaysKpis(rows = [], todayIso = MY_HOLIDAYS_TODAY) {
  let past = 0;
  let upcoming = 0;
  rows.forEach((h) => {
    const diff = daysBetween(todayIso, h.date);
    if (diff < 0) past += 1;
    else upcoming += 1;
  });
  return { total: rows.length, past, upcoming };
}

/** Liste « Upcoming Holidays » triée par date asc avec days left. */
export function listUpcoming(rows = [], todayIso = MY_HOLIDAYS_TODAY, limit = 4, locale = "en-US") {
  return rows
    .filter((h) => daysBetween(todayIso, h.date) >= 0)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, limit)
    .map((h) => ({
      ...h,
      daysLeft: daysBetween(todayIso, h.date),
      day: dayName(h.date, locale),
    }));
}

/** Regroupe les jours fériés par mois (mois sans jour férié sont exclus). */
export function groupByMonth(rows = [], locale = "en-US") {
  const groups = new Map();
  rows.forEach((h) => {
    const d = parseIso(h.date);
    if (!d) return;
    const monthIdx = d.getMonth();
    if (!groups.has(monthIdx)) groups.set(monthIdx, []);
    groups.get(monthIdx).push(h);
  });
  return Array.from(groups.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([monthIdx, items]) => ({
      monthIdx,
      monthLabel: new Date(items[0]?.date?.slice(0, 4) || 2026, monthIdx, 1).toLocaleDateString(
        locale,
        { month: "long" },
      ),
      items: items.sort((a, b) => (a.date < b.date ? -1 : 1)),
    }));
}
