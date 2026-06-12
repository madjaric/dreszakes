// Static perks strip shown inside the Quick View modal and on product pages.
export default function PromoPerks({ compact = false }) {
  const perks = [
    { icon: "🚚", text: "Besplatna dostava na sve porudžbine" },
    { icon: "🎁", text: "Kupi 4 dresa i dobijaš Mystery Dres GRATIS" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {perks.map((p) => (
        <div
          key={p.text}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: compact ? "8px 12px" : "10px 14px",
            fontSize: 13,
            color: "rgba(255,255,255,0.75)",
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: 16 }}>{p.icon}</span>
          {p.text}
        </div>
      ))}
    </div>
  );
}
