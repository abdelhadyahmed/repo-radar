const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const full = new Intl.NumberFormat('en');

/** 1234 -> "1.2K". Used anywhere space is tight. */
export function compactNumber(value: number): string {
  return value < 1000 ? String(value) : compact.format(value);
}

export function fullNumber(value: number): string {
  return full.format(value);
}

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
];

/** "3 days ago". Returns null for missing or unparseable dates. */
export function relativeTime(date: string | number | null | undefined): string | null {
  if (date == null) return null;
  const time = typeof date === 'number' ? date : Date.parse(date);
  if (Number.isNaN(time)) return null;

  const diff = time - Date.now();
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return relative.format(Math.round(diff / ms), unit);
  }
  return 'just now';
}

export function absoluteDate(date: string | number | null | undefined): string | null {
  if (date == null) return null;
  const time = typeof date === 'number' ? date : Date.parse(date);
  if (Number.isNaN(time)) return null;
  return new Date(time).toLocaleString();
}
