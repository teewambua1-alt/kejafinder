export function normalizeKenyanPhone(input: string): string | null {
  // Remove all non-digits except +
  const cleaned = input.replace(/[^\d+]/g, '');
  
  // Valid lengths/starts:
  // +254xxxxxxxxx (13 chars)
  // 254xxxxxxxxx (12 chars)
  // 07xxxxxxxx or 01xxxxxxxx (10 chars)
  // 7xxxxxxxx or 1xxxxxxxx (9 chars)
  
  const digits = cleaned.replace('+', '');
  
  if (digits.startsWith('254') && digits.length === 12) {
    return `+${digits}`;
  } else if (digits.startsWith('0') && digits.length === 10) {
    return `+254${digits.substring(1)}`;
  } else if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return `+254${digits}`;
  }
  
  return null;
}
