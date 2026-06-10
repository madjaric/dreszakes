import { useState, useMemo } from "react";
import { WC_TEAMS } from "./teams.js";
import { TEAM_CARDS } from "./products.js";
import ProductImage from "./components/ProductImage.jsx";
import QuickViewModal from "./components/QuickViewModal.jsx";

/* Trophy artwork for the hero (CSS/SVG, no external asset). */
function TrophyArt() {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <radialGradient id="trophyGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="rgba(57,255,20,0.30)" />
          <stop offset="45%" stopColor="rgba(0,220,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="trophyGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4a2a" />
          <stop offset="50%" stopColor="#1d2a16" />
          <stop offset="100%" stopColor="#0c1209" />
        </linearGradient>
        <linearGradient id="trophyEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(57,255,20,0.55)" />
          <stop offset="100%" stopColor="rgba(0,220,255,0.25)" />
        </linearGradient>
      </defs>
      <circle cx="210" cy="170" r="180" fill="url(#trophyGlow)" />
      {/* Stylised World Cup trophy silhouette */}
      <g transform="translate(120,70)" stroke="url(#trophyEdge)" strokeWidth="1.5" fill="url(#trophyGold)">
        <path d="M70 8 C40 8 28 40 36 92 C40 120 58 150 70 168 C82 150 100 120 104 92 C112 40 100 8 70 8 Z" />
        <path d="M62 168 L78 168 L82 210 L58 210 Z" />
        <path d="M44 210 L96 210 L104 240 L36 240 Z" />
        <ellipse cx="70" cy="92" rx="30" ry="46" fill="rgba(57,255,20,0.06)" stroke="rgba(57,255,20,0.3)" />
      </g>
    </svg>
  );
}

function TeamCard({ t, onOpen, onWish, wished }) {
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
        borderRadius: 20, overflow: "hidden", transition: "all 0.35s cubic-bezier(.2,.8,.2,1)",
        transform: hovered ? "translateY(-8px)" : "none",
        boxShadow: hovered ? `0 26px 64px ${accent}26, 0 0 0 1px ${accent}22` : "0 8px 24px rgba(0,0,0,0.35)",
        display: "flex", flexDirection: "column", cursor: "pointer", backdropFilter: "blur(10px)",
      }}
    >
      {/* Jersey showcase — the dominant visual */}
      <div style={{
        position: "relative", aspectRatio: "1 / 1",
        background: "radial-gradient(circle at 50% 38%, rgba(0,220,255,0.10), rgba(255,255,255,0.015) 55%, transparent 72%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onWish(t); }}
          aria-label="Lista želja"
          style={{
            position: "absolute", top: 14, left: 14, zIndex: 4,
            width: 38, height: 38, borderRadius: 11,
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.16)",
            color: wished ? "#ff4d6d" : "#fff", fontSize: 17, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)",
          }}
        >{wished ? "♥" : "♡"}</button>

        {/* Small Home / Away badges */}
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 4, display: "flex", gap: 6 }}>
          <span style={availBadge("rgba(34,211,238,0.16)", "#22d3ee")}>DOMAĆI</span>
          <span style={availBadge("rgba(124,92,255,0.18)", "#a99bff")}>GOSTUJUĆI</span>
        </div>

        {/* Jersey image fills the showcase */}
        <div style={{ position: "absolute", inset: 0, padding: 14, transition: "transform 0.45s", transform: hovered ? "scale(1.06)" : "scale(1)" }}>
          <ProductImage src={t.images[0]} alt={`${t.team} dres 2026`} colors={t.colors} version="fan" />
        </div>

        {hovered && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16,
            background: "linear-gradient(180deg, transparent 58%, rgba(0,0,0,0.55))", pointerEvents: "none"
          }}>
            <span style={{
              background: "rgba(0,0,0,0.72)", border: `1px solid ${accent}`,
              color: accent, padding: "8px 18px", borderRadius: 99,
              fontSize: 12, fontWeight: 700, letterSpacing: 1
            }}>👁 IZABERI DRES</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <span style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", overflow: "hidden",
          }}>{t.flag}</span>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 21, color: "#fff", letterSpacing: 0.6, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.team}</h3>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Domaći i Gostujući</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 1 }}>Od</div>
            <div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: accent }}>4.200</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>RSD</span>
            </div>
          </div>
          <span style={{
            background: hovered ? `linear-gradient(135deg, ${accent}, #0099cc)` : "rgba(255,255,255,0.06)",
            color: hovered ? "#000" : "#fff",
            border: hovered ? "none" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, padding: "9px 15px", fontWeight: 800, fontSize: 12, letterSpacing: 0.5, transition: "all 0.2s",
          }}>Izaberi →</span>
        </div>
      </div>
    </div>
  );
}

function availBadge(bg, color) {
  return {
    background: bg, color, borderRadius: 7, padding: "3px 9px",
    fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
    border: `1px solid ${color}44`, backdropFilter: "blur(6px)",
  };
}

function CountryChip({ active, flag, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: active ? "linear-gradient(135deg, #00dcff, #39ff14)" : "rgba(255,255,255,0.05)",
      color: active ? "#04210f" : "rgba(255,255,255,0.75)",
      border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
      borderRadius: 999, padding: "9px 16px",
      fontSize: 13, fontWeight: 700, cursor: "pointer",
      transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {flag && <span style={{ fontSize: 16 }}>{flag}</span>}
      {label}
    </button>
  );
}

/* Benefits sidebar card */
function BenefitsCard() {
  const items = [
    { icon: "🚚", title: "Besplatna dostava", sub: "na sve porudžbine" },
    { icon: "🛡️", title: "Top kvalitet", sub: "Fan i Player verzije" },
    { icon: "🔁", title: "Zamena veličine", sub: "brzo i jednostavno" },
    { icon: "🎁", title: "4 dresa = Mystery Dres", sub: "poklon iznenađenja" },
  ];
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24,
      backdropFilter: "blur(10px)", position: "sticky", top: 90,
    }}>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff", letterSpacing: 0.5, marginBottom: 18 }}>
        Zašto baš kod nas?
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((it) => (
          <div key={it.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: "rgba(0,220,255,0.1)", border: "1px solid rgba(0,220,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
            }}>{it.icon}</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{it.title}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <a href="#wc-grid" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginTop: 22, background: "linear-gradient(135deg, #25D366, #1ebe5d)",
        color: "#04210f", borderRadius: 12, padding: "13px", fontWeight: 800,
        fontSize: 13, letterSpacing: 1, textDecoration: "none",
      }}>💬 NARUČI PUTEM WHATSAPP-A</a>
    </div>
  );
}

const fLabel = { fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 };

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
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 30%, rgba(57,255,20,0.10), transparent 60%), radial-gradient(ellipse 50% 60% at 10% 10%, rgba(0,220,255,0.08), transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 1.5rem 36px", position: "relative", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, alignItems: "center" }} className="wc-hero-grid">
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.6rem, 6vw, 4.6rem)", lineHeight: 0.95, color: "#fff", marginBottom: 14, letterSpacing: 1 }}>
              WORLD CUP 2026™ <span style={{ background: "linear-gradient(90deg, #00dcff, #39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KOLEKCIJA</span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.6)", marginBottom: 24, maxWidth: 520, lineHeight: 1.6 }}>
              Zvanični stil. Tvoja strast. Novi dresovi za najveći turnir na planeti.
            </p>

            {/* Search */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,220,255,0.25)", borderRadius: 14, padding: "15px 20px", maxWidth: 620, boxShadow: "0 0 30px rgba(0,220,255,0.08)" }}>
              <span style={{ color: "#00dcff", fontSize: 18 }}>🔍</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pretraži reprezentaciju (npr. Argentina, Brazil...)" style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, flex: 1 }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>✕</button>}
            </div>

            {/* Promo strip */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
              <span style={promoPill("#00dcff")}>🚚 Besplatna dostava na sve porudžbine</span>
              <span style={promoPill("#39ff14")}>🎁 Kupi 4 dresa i dobijaš Mystery Dres GRATIS</span>
            </div>
          </div>

          {/* Trophy */}
          <div style={{ height: 300, position: "relative" }} className="wc-hero-art">
            <TrophyArt />
          </div>
        </div>
      </section>

      {/* COUNTRY FILTER */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 1.5rem 8px" }}>
        <div style={fLabel}>Reprezentacija ({WC_TEAMS.length})</div>
        <div className="wc-chips" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
          <CountryChip active={country === "all"} flag="🌍" label="Sve države" onClick={() => setCountry("all")} />
          {WC_TEAMS.map((t) => (
            <CountryChip key={t.id} active={country === t.id} flag={t.flag} label={t.name} onClick={() => setCountry(t.id)} />
          ))}
        </div>
      </section>

      {/* GRID + SIDEBAR */}
      <section id="wc-grid" style={{ maxWidth: 1320, margin: "0 auto", padding: "16px 1.5rem 60px" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
          Prikazano <strong style={{ color: "#00dcff" }}>{filtered.length}</strong> reprezentacija
        </div>

        <div className="wc-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
          {/* Cards */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Nema rezultata</div>
                <div>Pokušaj sa drugom pretragom.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
                {filtered.map((t) => (
                  <TeamCard key={t.teamId} t={t} onOpen={setOpenTeam} onWish={onWish} wished={wishlist.includes(`${t.teamId}-home-fan`)} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="wc-sidebar">
            <BenefitsCard />
          </aside>
        </div>
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

function promoPill(color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700, color,
  };
}
