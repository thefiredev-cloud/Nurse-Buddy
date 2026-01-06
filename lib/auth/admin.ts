// Admin authentication utilities
export const ADMIN_EMAIL = "tanner@firedev.com";

/**
 * Check if the given email is an admin
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Check if the given email list contains an admin email
 */
export function hasAdminEmail(emails: { emailAddress: string }[] | undefined): boolean {
  if (!emails || emails.length === 0) return false;
  return emails.some(e => isAdmin(e.emailAddress));
}






