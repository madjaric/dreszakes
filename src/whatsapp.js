// WhatsApp ordering helper.
// Set your store's WhatsApp number here (international format, digits only, no + or spaces).
// Example for Serbia: country code 381 + number without leading 0.
//   Local 064 123 4567  ->  381641234567
export const WHATSAPP_NUMBER = "381668128438"; // TODO: replace with the real store number

// Builds a prefilled Serbian order message and returns a wa.me URL.
export function buildWhatsAppOrderUrl(product, { size, qty } = {}) {
  const lines = [
    "Zdravo! Želim da poručim dres:",
    "",
    `🏳️ Reprezentacija: ${product.team}`,
    `👕 Tip: ${product.typeLabel} dres`,
    `⚙️ Verzija: ${product.versionLabel}`,
    `📏 Veličina: ${size || "—"}`,
    `🔢 Količina: ${qty || 1}`,
    `💰 Cena: ${(product.price * (qty || 1)).toLocaleString("sr-RS")} RSD`,
    "",
    "Molim vas potvrdite dostupnost i dostavu. Hvala!",
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
