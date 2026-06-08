export default function SizeSelector({ sizes, value, onChange, accent = "#00dcff" }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>
        Veličina
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {sizes.map((s) => {
          const isActive = value === s;
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              style={{
                minWidth: 48,
                padding: "10px 14px",
                borderRadius: 10,
                background: isActive ? accent : "rgba(255,255,255,0.05)",
                color: isActive ? "#000" : "rgba(255,255,255,0.7)",
                border: isActive ? "none" : "1px solid rgba(255,255,255,0.12)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
