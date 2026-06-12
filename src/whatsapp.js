// WhatsApp ordering helper.
import { WHATSAPP_NUMBER } from "./config.js";

// Re-export so existing imports of WHATSAPP_NUMBER from this module keep working.
export { WHATSAPP_NUMBER };

// Builds a prefilled Serbian order message for a single product and returns a wa.me URL.
export function buildWhatsAppOrderUrl(product, { size, qty, personalization } = {}) {
  const lines = [
    "Zdravo! \u017Delim da poru\u010Dim dres:",
    "",
    `\uD83C\uDFF3\uFE0F Reprezentacija: ${product.team}`,
    `\uD83D\uDC55 Tip: ${product.typeLabel} dres`,
    `\u2699\uFE0F Verzija: ${product.versionLabel}`,
    `\uD83D\uDCCF Veli\u010Dina: ${size || "\u2014"}`,
    `\uD83D\uDD22 Koli\u010Dina: ${qty || 1}`,
  ];
  if (personalization && personalization.enabled) {
    lines.push(`\u270F\uFE0F Personalizacija: ${personalization.name || "-"} ${personalization.number || ""}`.trim());
  }
  lines.push(`\uD83D\uDCB0 Cena: ${(product.price * (qty || 1)).toLocaleString("sr-RS")} RSD`);
  lines.push("", "Dostava 10-14 radnih dana. Molim vas potvrdite porudžbinu. Hvala!");
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Builds an order message for the whole cart + customer details (used by checkout).
export function buildWhatsAppCheckoutUrl(items, customer) {
  const priceNum = (p) => typeof p === "number" ? p : parseInt(String(p).replace(/\./g, ""), 10) || 0;
  const total = items.reduce((s, i) => s + priceNum(i.price) * (i.qty || 1), 0);
  const lines = ["Zdravo! \u017Delim da poru\u010Dim:", ""];
  items.forEach((i, idx) => {
    const name = i.team || i.name;
    const bits = [`${idx + 1}. ${name}`];
    if (i.versionLabel) bits.push(i.versionLabel);
    if (i.typeLabel) bits.push(i.typeLabel);
    if (i.size) bits.push(`vel. ${i.size}`);
    bits.push(`x${i.qty || 1}`);
    let line = bits.join(" \u00B7 ");
    if (i.personalization && i.personalization.enabled) {
      line += ` (${i.personalization.name || "-"} ${i.personalization.number || ""})`.replace(/\s+\)/, ")");
    }
    lines.push(line);
  });
  lines.push("", `Ukupno: ${total.toLocaleString("sr-RS")} RSD`, "");
  lines.push("Podaci za dostavu:");
  lines.push(`Ime i prezime: ${customer.fullName || ""}`);
  lines.push(`Telefon: ${customer.phone || ""}`);
  lines.push(`Email: ${customer.email || ""}`);
  lines.push(`Adresa: ${customer.address || ""}`);
  lines.push(`Grad: ${customer.city || ""}`);
  lines.push(`Po\u0161tanski broj: ${customer.zip || ""}`);
  lines.push("", "Dostava 10-14 radnih dana.");
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
