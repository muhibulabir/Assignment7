const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]);
}

export function bengaliToNumber(value: number | string): number {
  const normalized = String(value)
    .replace(/[০-৯]/g, (digit) => String(BANGLA_DIGITS.indexOf(digit)))
    .replace(/[٬,]/g, "")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPrice(value: number | string): string {
  const numericValue = bengaliToNumber(value);
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(numericValue);
  const bengaliFormatted = formatted.replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]);
  return `${bengaliFormatted} টাকা`;
}

export function formatBanglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Dhaka",
    weekday: "long",
    year: "numeric",
  }).format(date);
}

export function formatUnit(unit: string): string {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    gram: "প্রতি গ্রাম",
    liter: "প্রতি লিটার",
    l: "প্রতি লিটার",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };
  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}
