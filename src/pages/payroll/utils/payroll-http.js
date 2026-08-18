/**
 * Helpers HTTP paie — unwrap ressources Laravel (collection ou item).
 */

export function unwrapResource(payload) {
  if (payload == null) return null;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.data !== undefined) return payload.data;
  return payload;
}

export function unwrapList(payload) {
  const data = unwrapResource(payload);
  return Array.isArray(data) ? data : [];
}

export function initialsFromName(name) {
  if (!name) return "??";
  const parts = String(name).split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return String(name).slice(0, 2).toUpperCase();
}

export function avatarColor(name) {
  const colors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
}

/** YYYY-MM from date (YYYY-MM-DD) */
export function toPeriodMonth(dateStr) {
  if (!dateStr) return null;
  return String(dateStr).slice(0, 7);
}

/** First day of YYYY-MM as YYYY-MM-DD */
export function periodToDateStart(period) {
  if (!period) return null;
  return `${period}-01`;
}

/** Last day of YYYY-MM as YYYY-MM-DD (approx via Date) */
export function periodToDateEnd(period) {
  if (!period) return null;
  const [y, m] = period.split("-").map(Number);
  const last = new Date(y, m, 0);
  const dd = String(last.getDate()).padStart(2, "0");
  return `${y}-${String(m).padStart(2, "0")}-${dd}`;
}
