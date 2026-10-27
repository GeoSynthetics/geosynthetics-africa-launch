/**
 * One "Email or phone" field is all the enquiry forms ask for. These helpers
 * split what the visitor typed into an email and/or phone number.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * quote_requests.contact_email is required, so a phone-only enquiry stores a
 * placeholder address on this reserved (never-deliverable) domain.
 */
export const PHONE_PLACEHOLDER_DOMAIN = "@phone-inquiry.invalid";

export function isPlaceholderEmail(email: string | null | undefined): boolean {
  return !email || email.endsWith(PHONE_PLACEHOLDER_DOMAIN) || !EMAIL_REGEX.test(email);
}

/** Splits "email or phone" input into an email (or placeholder) and a phone. */
export function parseContactInput(contactInput: string): { email: string; phone: string | null } {
  const trimmed = contactInput.trim();

  if (EMAIL_REGEX.test(trimmed)) {
    return { email: trimmed, phone: null };
  }

  const isLikelyPhone = /^[\d\s+\-()]{6,}$/.test(trimmed);
  if (isLikelyPhone) {
    return {
      email: `${trimmed.replace(/[^\d+]/g, "")}${PHONE_PLACEHOLDER_DOMAIN}`,
      phone: trimmed,
    };
  }

  const matchEmail = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (matchEmail) {
    const email = matchEmail[0];
    const phone = trimmed.replace(email, "").trim() || null;
    return { email, phone };
  }

  return { email: trimmed, phone: null };
}

/** True when the visitor gave a valid email, a phone number, or both. */
export function hasEmailOrPhone(email: string, phone: string): boolean {
  const e = email.trim();
  const p = phone.trim();
  if (e && !EMAIL_REGEX.test(e)) return false;
  return Boolean(e) || /^[\d\s+\-()]{6,}$/.test(p);
}

/**
 * Builds the stored contact from separate email and phone fields. When only a
 * phone is given, the email becomes a placeholder on the reserved domain.
 */
export function resolveContact(
  email: string,
  phone: string,
): { email: string; phone: string | null } {
  const e = email.trim();
  const p = phone.trim() || null;
  if (e) return { email: e, phone: p };
  return { email: `${(p ?? "").replace(/[^\d+]/g, "")}${PHONE_PLACEHOLDER_DOMAIN}`, phone: p };
}
