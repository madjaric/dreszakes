export default function QuantitySelector({ value, onChange, accent = "#00dcff" }) {
  const btn = {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>
        Količina
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={btn} onClick={() => onChange(Math.max(1, value - 1))} aria-label="Smanji">−</button>
        <div style={{
          minWidth: 52, textAlign: "center", fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 24, color: accent
        }}>{value}</div>
        <button style={btn} onClick={() => onChange(Math.min(10, value + 1))} aria-label="Povećaj">+</button>
      </div>
    </div>
  );
}
