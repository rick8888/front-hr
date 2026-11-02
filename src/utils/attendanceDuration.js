/**
 * Durée écoulée depuis un pointage HH:mm.
 * Le check-in est enregistré en UTC (timezone Laravel). On le lit en UTC
 * pour ne pas ajouter le décalage local (+1 h). L’horloge utilisée est
 * celle du navigateur (Date.now), pas une horloge serveur.
 */
export function minutesSinceCheckIn(checkIn, dayIso) {
  const match = String(checkIn || "").trim().match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const day = toUtcDateParts(dayIso) || utcDateParts(new Date());
  if (!day) return 0;

  const startMs = Date.UTC(day.year, day.month, day.day, hours, minutes, 0, 0);
  if (Number.isNaN(startMs)) return 0;

  return Math.max(0, Math.floor((Date.now() - startMs) / 60000));
}

function toUtcDateParts(value) {
  if (!value) return null;
  if (value instanceof Date) return utcDateParts(value);
  const iso = String(value).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!iso) return null;
  return {
    year: Number(iso[1]),
    month: Number(iso[2]) - 1,
    day: Number(iso[3]),
  };
}

function utcDateParts(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}
