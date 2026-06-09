import { useState, useMemo } from "react";
import { WC_TEAMS } from "./teams.js";
import { TEAM_CARDS } from "./products.js";
import ProductImage from "./components/ProductImage.jsx";
import QuickViewModal from "./components/QuickViewModal.jsx";

function TeamCard({ t, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const accent = "#22d3ee";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(t)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? accent + "40" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 18, overflow: "hidden", transition: "all 0.3s",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 18px 50px ${accent}18` : "none",
        display: "flex", flexDirection: "column", cursor: "pointer",
      }}
    >
      <div style={{ height: 230, position: "relative" }}>
        <div style={{ transition: "transform 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)", height: "100%" }}>
          <ProductImage src={t.images[0]} alt={`${t.team} dres 2026`} colors={t.colors} version="fan" />
        </div>

        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 3,
          background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff", borderRadius: 6, padding: "4px 9px",
          fontSize: 10, fontWeight: 700, letterSpacing: 0.5
        }}>Domaći / Gostujući</div>

        {hovered && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.25)", pointerEvents: "none"
          }}>
            <span style={{
              background: "rgba(0,0,0,0.7)", border: `1px solid ${accent}`,
              color: accent, padding: "9px 20px", borderRadius: 99,
              fontSize: 12, fontWeight: 700, letterSpacing: 1
            }}>👁 IZABERI DRES</span>
          </div>
        )}
      </div>

      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>{t.flag}</span>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", letterSpacing: 0.8, lineHeight: 1 }}>{t.team}</h3>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{t.conf}</div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>od</span>{" "}
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: accent }}>4.200</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>RSD</span>
          </div>
          <span style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            color: "#000", borderRadius: 9, padding: "9px 16px",
            fontWeight: 800, fontSize: 12
          }}>Izaberi →</span>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "linear-gradient(135deg, #00dcff, #0099cc)" : "rgba(255,255,255,0.05)",
      color: active ? "#000" : "rgba(255,255,255,0.65)",
      border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
      borderRadius: 999, padding: "7px 16px",
      fontSize: 13, fontWeight: 700, cursor: "pointer",
      transition: "all 0.2s", whiteSpace: "nowrap"
    }}>{children}</button>
  );
}

const fLabel = { fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 };

export default function WorldCup({ onAddToCart, onWish, wishlist }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [openTeam, setOpenTeam] = useState(null);

  const filtered = useMemo(() => {
    return TEAM_CARDS.filter((t) => {
      if (country !== "all" && t.teamId !== country) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.team.toLowerCase().includes(q) && !t.conf.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [country, search]);

  return (
    <div style={{ background: "#05050e", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: "#fff" }}>
      <section style={{ padding: "50px 1.5rem 36px", maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,220,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 22, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#39ff14", textTransform: "uppercase" }}>🏆 Zvanična kolekcija</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 8vw, 6rem)", lineHeight: 0.95, color: "#fff", marginBottom: 16, position: "relative" }}>
          SVETSKO PRVENSTVO<br />
          <span style={{ background: "linear-gradient(90deg, #00dcff, #39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026 KOLEKCIJA</span>
        </h1>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6, position: "relative" }}>
          Dresovi svih reprezentacija na Mundijalu 2026. Izaberi svoj tim, pa u kartici odaberi domaći ili gostujući, Fan ili Player verziju.
        </p>

        <div style={{ display: "inline-flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 24, position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,220,255,0.08)", border: "1px solid rgba(0,220,255,0.2)",
            borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#00dcff"
          }}>🚚 Besplatna dostava na sve porudžbine</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)",
            borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#39ff14"
          }}>🎁 Kupi 4 dresa i dobijaš Mystery Dres GRATIS</span>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 32px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,220,255,0.2)", borderRadius: 14, padding: "13px 18px", marginBottom: 24, maxWidth: 560 }}>
          <span style={{ color: "#00dcff", fontSize: 18 }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pretraži reprezentaciju (npr. Argentina, Brazil...)" style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, flex: 1 }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>✕</button>}
        </div>

        <div>
          <div style={fLabel}>Država ({WC_TEAMS.length})</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 96, overflowY: "auto", paddingBottom: 4 }}>
            <FilterChip active={country === "all"} onClick={() => setCountry("all")}>🌍 Sve države</FilterChip>
            {WC_TEAMS.map((t) => (
              <FilterChip key={t.id} active={country === t.id} onClick={() => setCountry(t.id)}>{t.flag} {t.name}</FilterChip>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Prikazano <strong style={{ color: "#00dcff" }}>{filtered.length}</strong> reprezentacija
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 60px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Nema rezultata</div>
            <div>Pokušaj sa drugom pretragom.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 22 }}>
            {filtered.map((t) => (
              <TeamCard key={t.teamId} t={t} onOpen={setOpenTeam} />
            ))}
          </div>
        )}
      </section>

      {openTeam && (
        <QuickViewModal
          team={openTeam}
          onClose={() => setOpenTeam(null)}
          onAddToCart={(item) => { onAddToCart(item); setOpenTeam(null); }}
          onWish={onWish}
          wishlist={wishlist}
        />
      )}
    </div>
  );
}
