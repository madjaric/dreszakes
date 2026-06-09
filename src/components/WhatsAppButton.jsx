import { buildWhatsAppOrderUrl } from "../whatsapp.js";

// Prefilled WhatsApp order button. Opens wa.me in a new tab with the order details.
export default function WhatsAppButton({ product, size, qty, full = false, compact = false }) {
  const href = buildWhatsAppOrderUrl(product, { size, qty });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: full ? "100%" : "auto",
        background: "linear-gradient(135deg, #25D366, #1ebe5d)",
        color: "#04210f",
        border: "none",
        borderRadius: 12,
        padding: compact ? "12px 16px" : "15px 18px",
        fontWeight: 800,
        fontSize: compact ? 13 : 15,
        cursor: "pointer",
        textDecoration: "none",
        transition: "transform 0.15s, box-shadow 0.2s",
        boxShadow: "0 4px 18px rgba(37,211,102,0.25)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 26px rgba(37,211,102,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(37,211,102,0.25)";
      }}
    >
      {/* WhatsApp glyph */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2.5C6.84 2.5 2.6 6.74 2.6 11.94c0 1.66.43 3.28 1.26 4.71L2.5 21.5l4.97-1.3a9.4 9.4 0 0 0 4.56 1.16h.01c5.2 0 9.43-4.24 9.43-9.43 0-2.52-.98-4.89-2.76-6.67A9.36 9.36 0 0 0 12.04 2.5z"/>
      </svg>
      Poruči putem WhatsApp-a
    </a>
  );
}
