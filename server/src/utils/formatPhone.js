import { env } from "../config/env.js";

/**
 * WhatsApp Cloud API expects numbers in international format without
 * "+" or spaces, e.g. 919876543210. Client.phone is usually stored as a
 * plain 10-digit local number, so this adds the country code if missing.
 */
export const formatPhoneForWhatsApp = (phone) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `${env.whatsapp.defaultCountryCode}${digits}`;
  }
  return digits; // already has a country code, or unusual format — pass through
};
