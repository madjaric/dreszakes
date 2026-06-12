// Central site configuration.
// Single source of truth — change values here, used across the whole app.

// WhatsApp number in international format (digits only, no + or spaces).
// Serbia example: country code 381 + number without the leading 0.
//   Local 064 123 4567  ->  381641234567
export const WHATSAPP_NUMBER = "381668128438"; // TODO: replace with the real store number

// Convenience: a ready-to-use wa.me base URL (optionally with prefilled text).
export function whatsappUrl(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// Delivery promise shown across the site.
export const DELIVERY_TEXT = "Dostava 10-14 radnih dana";
