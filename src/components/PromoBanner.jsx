// Global promotional banner — rendered on every page (home, collection, product, cart).
export default function PromoBanner() {
  const items = [
    { icon: "🚚", text: "BESPLATNA DOSTAVA NA SVE PORUDŽBINE", color: "#00dcff" },
    { icon: "🎁", text: "KUPI 4 DRESA I DOBIJAŠ MYSTERY DRES GRATIS", color: "#39ff14" },
  ];
  return (
    <div
      style={{
        background: "linear-gradient(90deg, rgba(0,220,255,0.12), rgba(57,255,20,0.12))",
        borderBottom: "1px solid rgba(0,220,255,0.15)",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          padding: "10px 0",
          whiteSpace: "nowrap",
          animation: "scrollBanner 24s linear infinite",
          width: "max-content",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{ display: "inline-flex", gap: 48, alignItems: "center" }}>
            {items.map((it, j) => (
              <span key={j} style={{ display: "inline-flex", gap: 48, alignItems: "center" }}>
                <span style={{ color: it.color, fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>
                  {it.icon} {it.text}
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
