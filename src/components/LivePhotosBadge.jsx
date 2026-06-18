import { INSTAGRAM_URL, INSTAGRAM_HANDLE, whatsappUrl } from "../config.js";

// Istaknut "šaljemo uživo slike" znak sa sjajnim Instagram brendiranjem.
// Reusable — koristi se na product stranici, WhyUs sekciji itd.
// compact=true daje manju inline verziju.
export default function LivePhotosBadge({ compact = false }) {
  const igGradient = "linear-gradient(135deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888)";

  if (compact) {
    return (
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(220,39,67,0.08)", border: "1px solid rgba(220,39,67,0.3)",
          borderRadius: 10, padding: "8px 12px", textDecoration: "none",
          color: "#fff", fontSize: 12.5, fontWeight: 600,
        }}
      >
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, borderRadius: 6, background: igGradient,
          fontSize: 12, flexShrink: 0,
        }}>📸</span>
        <span>Šaljemo <strong>uživo slike</strong> dresa pre slanja</span>
      </a>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      background: "linear-gradient(135deg, rgba(220,39,67,0.12), rgba(188,24,136,0.08))",
      border: "1px solid rgba(220,39,67,0.35)",
      borderRadius: 16, padding: "18px 20px",
      boxShadow: "0 0 30px rgba(220,39,67,0.15)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: igGradient,
        boxShadow: "0 0 22px rgba(220,39,67,0.5)",
        fontSize: 24,
      }}>📸</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: "#fff", letterSpacing: 0.5, lineHeight: 1.1 }}>
          ŠALJEMO UŽIVO SLIKE DRESA
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>
          Pre slanja porudžbine dobijate prave fotografije/video vašeg dresa na{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontWeight: 700, textDecoration: "none" }}>WhatsApp</a>
          {" ili "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#dc2743", fontWeight: 700, textDecoration: "none" }}>Instagram {INSTAGRAM_HANDLE}</a>.
        </div>
      </div>
    </div>
  );
}
