import { useState, useMemo, useEffect } from "react";
import { WC_TEAMS } from "./teams.js";
import { TEAM_CARDS } from "./products.js";
import { whatsappUrl } from "./config.js";
import ProductImage from "./components/ProductImage.jsx";
import QuickViewModal from "./components/QuickViewModal.jsx";

const STATS = [
  { icon: "🏆", value: "48", label: "Reprezentacija" },
  { icon: "👕", value: "", label: "Domaći i Gostujući" },
  { icon: "⭐", value: "", label: "Fan i Player" },
  { icon: "🌎", value: "2026", label: "FIFA World Cup" },
];

function TeamCard({ t, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const accent = "#22d3ee";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(t)}
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, overflow: "hidden", transition: "all 0.3s cubic-bezier(.2,.8,.2,1)",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 22px 54px ${accent}26` : "0 6px 20px rgba(0,0,0,0.35)",
        display: "flex", flexDirection: "column", cursor: "pointer",
      }}
    >
      {/* Slika dresa - ~70% kartice */}
      <div style={{
        position: "relative", aspectRatio: "3 / 4",
        background: "radial-gradient(circle at 50% 42%, rgba(0,220,255,0.10), rgba(0,0,0,0) 66%), linear-gradient(180deg, #0b1018, #080b12)",
      }}>
        <div style={{ position: "absolute", inset: 0, padding: 14, transition: "transform 0.4s", transform: hovered ? "scale(1.06)" : "scale(1)" }}>
          <ProductImage src={t.images[0]} alt={`${t.team} dres 2026`} colors={t.colors} version="fan" />
        </div>
      </div>

      {/* Info ~30% */}
      <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", overflow: "hidden",
          }}>{t.flag}</span>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: "#fff", letterSpacing: 0.5, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.team}</h3>
        </div>

        {/* Badgevi - jasno vidljivi */}
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            background: "linear-gradient(135deg, #00dcff, #22d3ee)", color: "#04212a",
            borderRadius: 6, padding: "4px 9px", fontSize: 10, fontWeight: 900, letterSpacing: 0.5,
          }}>DOMAĆI</span>
          <span style={{
            background: "linear-gradient(135deg, #a855f7, #7c3aed)", color: "#fff",
            borderRadius: 6, padding: "4px 9px", fontSize: 10, fontWeight: 900, letterSpacing: 0.5,
          }}>GOSTUJUĆI</span>
        </div>

        <div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Od </span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 21, color: "#fff", letterSpacing: 0.5 }}>4.200</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 3 }}>RSD</span>
        </div>

        {/* CTA - pun širina, zeleni outline */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(t); }}
          style={{
            width: "100%", marginTop: 2,
            background: hovered ? "linear-gradient(135deg, #00dcff, #39ff14)" : "transparent",
            color: hovered ? "#04210f" : "#39ff14",
            border: `1px solid ${hovered ? "transparent" : "rgba(57,255,20,0.55)"}`,
            borderRadius: 10, padding: "11px", fontWeight: 800, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.2s",
          }}
        >{"👁"} Izaberi dres →</button>
      </div>
    </div>
  );
}

function CountryChip({ active, flag, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: active ? "linear-gradient(135deg, #00dcff, #39ff14)" : "rgba(255,255,255,0.05)",
      color: active ? "#04210f" : "rgba(255,255,255,0.8)",
      border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
      borderRadius: 999, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
      transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {flag && <span style={{ fontSize: 16 }}>{flag}</span>}
      {label}
    </button>
  );
}

function promoPill(color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999, padding: "9px 16px", fontSize: 13, fontWeight: 700, color,
  };
}

const fLabel = { fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 };

function getVersionFilter() {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/[?&]v=([a-z]+)/);
  return m && ["fan", "player", "mystery"].includes(m[1]) ? m[1] : null;
}

const VERSION_LABEL = {
  fan: "Fan verzija · 4.200 RSD",
  player: "Player verzija · 4.500 RSD",
  mystery: "Mystery Dres · iznenađenje",
};

export default function WorldCup({ onAddToCart, cartCount = 0 }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [openTeam, setOpenTeam] = useState(null);
  const [versionFilter, setVersionFilter] = useState(getVersionFilter());

  useEffect(() => {
    const sync = () => setVersionFilter(getVersionFilter());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

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
      {/* HERO */}
      <section className="wc-hero" style={{ position: "relative", borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: 700, overflow: "hidden" }}>
        {/* Subtle dark overlay over the whole image */}
        <div className="wc-hero-tint" style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />
        {/* Left-side readability gradient */}
        <div className="wc-hero-fade" style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: "linear-gradient(90deg, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.75) 35%, rgba(5,10,20,0.30) 60%, rgba(5,10,20,0.00) 100%)" }} />
        <div className="wc-hero-inner" style={{ position: "relative", zIndex: 6, maxWidth: 1400, margin: "0 auto", padding: "64px 1.5rem 56px", minHeight: 700, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 620 }}>
            <h1 className="wc-hero-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: "clamp(3.4rem, 7vw, 6.4rem)", lineHeight: 0.86, color: "#fff", marginBottom: 16, letterSpacing: 1, textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}>
              WORLD CUP 2026™<br />
              <span style={{ background: "linear-gradient(90deg, #00dcff, #39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KOLEKCIJA</span>
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.7)", marginBottom: 26, maxWidth: 500, lineHeight: 1.6 }}>
              Zvanični stil. Tvoja strast. Novi dresovi za najveći turnir na planeti.
            </p>

            {/* Statistika */}
            <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginBottom: 26 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    {s.value && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#fff", lineHeight: 1 }}>{s.value}</div>}
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo pilule */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
              <span style={promoPill("#00dcff")}>{"🚚"} <span><strong>Besplatna dostava</strong> na sve porudžbine</span></span>
              <span style={promoPill("#39ff14")}>{"🎁"} <span>Kupi 4 dresa i dobijaš <strong>Mystery Dres GRATIS</strong></span></span>
            </div>

            {/* Search */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(8,12,20,0.7)", border: "1px solid rgba(0,220,255,0.25)", borderRadius: 14, padding: "15px 20px", maxWidth: 620, backdropFilter: "blur(8px)", boxShadow: "0 0 30px rgba(0,220,255,0.1)" }}>
              <span style={{ color: "#00dcff", fontSize: 18 }}>{"🔍"}</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pretraži reprezentaciju (npr. Argentina, Brazil...)" style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, flex: 1 }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>✕</button>}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 1.5rem 8px" }}>
        <div style={fLabel}>Reprezentacija ({WC_TEAMS.length})</div>
        <div className="wc-chips" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
          <CountryChip active={country === "all"} flag={"🌍"} label="Sve države" onClick={() => setCountry("all")} />
          {WC_TEAMS.map((t) => (
            <CountryChip key={t.id} active={country === t.id} flag={t.flag} label={t.name} onClick={() => setCountry(t.id)} />
          ))}
        </div>
      </section>

      {/* GRID - 6 po redu, pun širina */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 1.5rem 80px" }}>
        {versionFilter && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            background: versionFilter === "player" ? "rgba(74,222,128,0.1)" : versionFilter === "mystery" ? "rgba(168,85,247,0.12)" : "rgba(34,211,238,0.1)",
            border: `1px solid ${versionFilter === "player" ? "rgba(74,222,128,0.3)" : versionFilter === "mystery" ? "rgba(168,85,247,0.35)" : "rgba(34,211,238,0.3)"}`,
            borderRadius: 12, padding: "12px 16px", marginBottom: 18, flexWrap: "wrap",
          }}>
            <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>
              {versionFilter === "mystery" ? "🎁" : versionFilter === "player" ? "⭐" : "👕"} Prikazana verzija: <strong>{VERSION_LABEL[versionFilter]}</strong>
              <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}> — izaberi reprezentaciju, verzija je već selektovana</span>
            </div>
            <a href="#/world-cup" style={{
              fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8, padding: "6px 12px", whiteSpace: "nowrap",
            }}>✕ Poništi filter</a>
          </div>
        )}
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
          Prikazano <strong style={{ color: "#00dcff" }}>{filtered.length}</strong> reprezentacija
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{"🔍"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Nema rezultata</div>
            <div>Pokušaj sa drugom pretragom.</div>
          </div>
        ) : (
          <div className="wc-product-grid">
            {filtered.map((t) => (
              <TeamCard key={t.teamId} t={t} onOpen={setOpenTeam} />
            ))}
          </div>
        )}
      </section>

      {/* Floating WhatsApp — only when there are items in the cart */}
      {cartCount > 0 && (
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="wc-whatsapp-fab"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 95,
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg, #25D366, #1ebe5d)", color: "#04210f",
            padding: "14px 22px", borderRadius: 999, fontWeight: 800, fontSize: 14,
            textDecoration: "none", boxShadow: "0 8px 30px rgba(37,211,102,0.45)",
          }}
        >{"💬"} Naruči putem WhatsApp-a</a>
      )}

      {openTeam && (
        <QuickViewModal
          team={openTeam}
          initialVersion={versionFilter === "player" ? "player" : "fan"}
          onClose={() => setOpenTeam(null)}
          onAddToCart={(item) => { onAddToCart(item); setOpenTeam(null); }}
        />
      )}
    </div>
  );
}
