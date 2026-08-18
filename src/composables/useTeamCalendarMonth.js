import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  format,
} from "date-fns";

/** First column Sunday (US calendar). */
export function buildCalendarWeeks(monthAnchor) {
  const monthStart = startOfMonth(monthAnchor);
  const monthEnd = endOfMonth(monthAnchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks.map((week) =>
    week.map((date) => ({
      date,
      iso: format(date, "yyyy-MM-dd"),
      dayOfMonth: date.getDate(),
      inCurrentMonth: isSameMonth(date, monthAnchor),
      isToday: false,
    })),
  );
}

function parseLocalDay(iso) {
  if (!iso) return null;
  const match = String(iso).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function dfMax(dates) {
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

function dfMin(dates) {
  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

/**
 * Split leaves into per-week overlay segments (CSS grid columns 1–7).
 */
export function buildLeaveSegments(weeks, leaves) {
  const segmentsByWeek = weeks.map(() => []);

  leaves.forEach((leave) => {
    const start = parseLocalDay(leave.start);
    const end = parseLocalDay(leave.end);
    if (!start || !end) return;

    weeks.forEach((week, wIdx) => {
      const ws = week[0].date;
      const we = week[6].date;
      const overlapStart = dfMax([start, ws]);
      const overlapEnd = dfMin([end, we]);
      if (Number.isNaN(overlapStart.getTime()) || Number.isNaN(overlapEnd.getTime())) {
        return;
      }
      if (overlapStart > overlapEnd) return;

      const startCol = overlapStart.getDay() + 1;
      const endCol = overlapEnd.getDay() + 1;

      segmentsByWeek[wIdx].push({
        gridColumnStart: startCol,
        gridColumnEnd: endCol + 1,
        label: `${leave.employee} - ${leave.leaveType}`,
        key: `${leave.id}-${wIdx}`,
      });
    });
  });

  return segmentsByWeek;
}

export function markTodayCells(weeks, todayIso) {
  weeks.forEach((week) => {
    week.forEach((cell) => {
      cell.isToday = todayIso && cell.iso === todayIso;
    });
  });
}

export function monthTitle(monthAnchor) {
  return format(monthAnchor, "MMMM yyyy");
}
