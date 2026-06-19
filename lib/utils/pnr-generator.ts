// lib/utils/pnr-generator.ts

/**
 * Generates a random 6-character PNR code
 * Format: 6 alphanumeric characters (uppercase)
 * Example: ABC123, XYZ789
 */
export function generatePNR(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return pnr;
}

/**
 * Generates a unique booking reference
 * Format: MOON-XXXXXX (6 random alphanumeric characters)
 */
export function generateBookingRef(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 6; i++) {
    ref += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `MOON-${ref}`;
}

/**
 * Validates a PNR code format
 * Returns true if valid (6 alphanumeric characters)
 */
export function isValidPNR(pnr: string): boolean {
  return /^[A-Z0-9]{6}$/.test(pnr);
}

/**
 * Generates a ticketing time limit
 * Default: 24 hours from now
 */
export function generateTicketingTimeLimit(hours: number = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/**
 * Generates an expiration date
 * Default: 14 days from now
 */
export function generateExpirationDate(days: number = 14): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
