/**
 * Normalize phone numbers for deduplification.
 * Strips non-digit chars, ensures +55 prefix for BR numbers.
 */
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;

  // Strip everything except digits and leading +
  let digits = raw.replace(/[^\d+]/g, '');

  // Remove leading + for uniform processing
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }

  // If starts with 55 and has 12-13 digits, it's already BR international
  if (digits.startsWith('55') && digits.length >= 12 && digits.length <= 13) {
    return `+${digits}`;
  }

  // If 10-11 digits starting with DDD, add +55
  if (digits.length >= 10 && digits.length <= 11) {
    return `+55${digits}`;
  }

  // Already international (other country) or too short — return as-is with +
  if (digits.length > 6) {
    return `+${digits}`;
  }

  return raw.trim() || null;
}
