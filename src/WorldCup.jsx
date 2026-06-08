import { useState, useMemo } from "react";
import { WC_TEAMS, SIZES } from "./teams.js";

const FAN_PRICE = 4200;
const PLAYER_PRICE = 4500;

// Build the full product list: each team × {home, away} × {fan, player}
function buildProducts() {
  const products = [];
  WC_TEAMS.forEach((team) => {
    ["home", "away"].forEach((kit) => {
      const kitLabelSr = kit === "home" ? "Domaći" : "Gostujući";
      const desc = kit === "home" ? team.descHome : team.descAway;
      ["fan", "player"].forEach((version) => {
        const versionLabel = version === "fan" ? "Fan Version" : "Player Version";
        const price = version === "fan" ? FAN_PRICE : PLAYER_PRICE;
        products.push({
          id: `${team.id}-${kit}-${version}`,
          team: team.name,
          teamId: team.id,
          flag: team.flag,
          conf: team.conf,
          kit, // home | away
          kitLabel: kitLabelSr,
          version, // fan | player
          versionLabel,
          price,
          colors: team[kit],
          title: `${team.name} ${kitLabelSr} Dres 2026 — ${versionLabel}`,
          desc,
        });
      });
    });
  });
  return products;
}

const ALL_PRODUCTS = buildProducts();

// Jersey SVG with team colors
function JerseySVG({ colors, version }) {
  const { primary, secondary } = colors;
  const isStriped = false;
  return (
    <svg width="150" height="168" viewBox="0 0 150 168" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${primary}-${secondary}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={primary} stopOpacity="0.95" />
          <stop offset="100%" stopColor={primary} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Body */}
      <path
        d="M32 52 L10 72 L26 84 L26 158 L124 158 L124 84 L140 72 L118 52 L100 40 Q75 30 50 40 Z"
        fill={`url(#grad-${primary}-${secondary})`}
        stroke={secondary}
        strokeWidth="2"
      />
      {/* Sleeves */}
      <path d="M32 52 L10 72 L26 84 L40 66 Z" fill={secondary} fillOpacity="0.85" />
      <path d="M118 52 L140 72 L124 84 L110 66 Z" fill={secondary} fillOpacity="0.85" />
      {/* Collar */}
      <path d="M56 44 Q75 56 94 44 Q86 37 75 36 Q64 37 56 44 Z" fill={secondary} />
      {/* Number */}
      <text
        x="75" y="120" textAnchor="middle"
        fill={secondary} fontSize="34"
        fontFamily="'Bebas Neue', sans-serif"
        opacity="0.95"
      >
        {version === "player" ? "10" : "9"}
      </text>
      {/* Shine */}
      <path d="M48 62 Q60 56 72 62" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
    </svg>
  );
}

function PromoBanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, rgba(0,220,255,0.12), rgba(57,255,20,0.12))",
      borderBottom: "1px solid rgba(0,220,255,0.15)",
      borderTop: "1px solid rgba(0,220,255,0.15)",
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{
        display: "flex", gap: 48, padding: "12px 0",
        whiteSpace: "nowrap",
        animation: "scrollBanner 22s linear infinite",
        width: "max-content"
      }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} style={{ display: "inline-flex", gap: 48, alignItems: "center" }}>
            <span style={{ color: "#00dcff", fontWeight: 700, fontSize: 14 }}>🚚 Besplatna dostava na sve porudžbine</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
            <span style={{ color: "#39ff14", fontWeight: 700, fontSize: 14 }}>🎁 Kupi 4 dresa i dobijaš Mystery Dres GRATIS</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, onAdd, onWish, wished }) {
  const [hovered, setHovered] = useState(false);
  const [size, setSize] = useState("M");
  const accent = p.version === "player" ? "#4ade80" : "#22d3ee";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? accent + "40" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 18, overflow: "hidden",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 18px 50px ${accent}18` : "none",
        display: "flex", flexDirection: "column"
      }}
    >
      {/* Image */}
      <div style={{
        height: 210, position: "relative",
        background: "linear-gradient(135deg, #0a0a14, #0f0f1f)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 50% 55%, ${p.colors.primary}22 0%, transparent 65%)`
        }} />
        {/* Wishlist */}
        <button onClick={() => onWish(p)} style={{
          position: "absolute", top: 12, left: 12, zIndex: 3,
          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8, width: 34, height: 34, cursor: "pointer",
          color: wished ? "#ff4d6d" : "#fff", fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>{wished ? "♥" : "♡"}</button>

        {/* Version badge */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 3,
          background: accent, color: "#000",
          borderRadius: 6, padding: "4px 9px",
          fontSize: 10, fontWeight: 800, letterSpacing: 1
        }}>{p.version === "player" ? "PLAYER" : "FAN"}</div>

        <div style={{ transform: hovered ? "scale(1.08) rotate(-2deg)" : "scale(1)", transition: "transform 0.4s", zIndex: 1 }}>
          <JerseySVG colors={p.colors} version={p.version} />
        </div>

        {/* Kit label */}
        <div style={{
          position: "absolute", bottom: 12, left: 12, zIndex: 2,
          background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 6, padding: "3px 9px",
          fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.5
        }}>{p.kitLabel}</div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>{p.flag}</span>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: "#fff", letterSpacing: 0.8, lineHeight: 1 }}>
            {p.team}
          </h3>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 14, flex: 1 }}>
          {p.desc.length > 95 ? p.desc.slice(0, 95) + "…" : p.desc}
        </p>

        {/* Size selector */}
        {hovered && (
          <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
            {SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                flex: 1, minWidth: 28,
                background: size === s ? accent : "rgba(255,255,255,0.06)",
                color: size === s ? "#000" : "rgba(255,255,255,0.6)",
                border: "none", borderRadius: 5, padding: "5px 0",
                fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
              }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: accent }}>
              {p.price.toLocaleString("sr-RS")}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>RSD</span>
          </div>
          <button onClick={() => onAdd({ ...p, size })} style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            color: "#000", border: "none", borderRadius: 9,
            padding: "9px 16px", fontWeight: 800, fontSize: 12, cursor: "pointer",
            transition: "transform 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >U korpu →</button>
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

export default function WorldCup({ onAddToCart }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [size, setSize] = useState("all");
  const [kitFilter, setKitFilter] = useState("all"); // all | home | away
  const [versionFilter, setVersionFilter] = useState("all"); // all | fan | player
  const [wishlist, setWishlist] = useState([]);
  const [visible, setVisible] = useState(24);

  const toggleWish = (p) => {
    setWishlist(w => w.includes(p.id) ? w.filter(x => x !== p.id) : [...w, p.id]);
  };

  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      if (country !== "all" && p.teamId !== country) return false;
      if (kitFilter !== "all" && p.kit !== kitFilter) return false;
      if (versionFilter !== "all" && p.version !== versionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.team.toLowerCase().includes(q) &&
            !p.conf.toLowerCase().includes(q) &&
            !p.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [country, kitFilter, versionFilter, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div style={{ background: "#05050e", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: "#fff" }}>
      <PromoBanner />

      {/* Header */}
      <section style={{ padding: "60px 1.5rem 40px", maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,220,255,0.1) 0%, transparent 60%)",
          pointerEvents: "none"
        }} />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)",
          borderRadius: 999, padding: "6px 16px", marginBottom: 22,
          fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#39ff14", textTransform: "uppercase"
        }}>🏆 Zvanična kolekcija</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2.8rem, 8vw, 6rem)", lineHeight: 0.95, color: "#fff", marginBottom: 16,
          position: "relative"
        }}>
          SVETSKO PRVENSTVO<br />
          <span style={{ background: "linear-gradient(90deg, #00dcff, #39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026 KOLEKCIJA</span>
        </h1>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6, position: "relative" }}>
          Svi dresovi reprezentacija na Mundijalu 2026. Domaći i gostujući, Fan i Player verzije.
          Dostupno {WC_TEAMS.length} nacija · {ALL_PRODUCTS.length} modela.
        </p>
      </section>

      {/* Search + Filters */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 32px" }}>
        {/* Search */}
        <div style={{
          display: "flex", gap: 12, alignItems: "center",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,220,255,0.2)",
          borderRadius: 14, padding: "13px 18px", marginBottom: 24, maxWidth: 560
        }}>
          <span style={{ color: "#00dcff", fontSize: 18 }}>🔍</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setVisible(24); }}
            placeholder="Pretraži reprezentaciju (npr. Argentina, Srbija...)"
            style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, flex: 1 }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>✕</button>}
        </div>

        {/* Filter rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Version + Kit filters */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Verzija</div>
              <div style={{ display: "flex", gap: 8 }}>
                <FilterChip active={versionFilter === "all"} onClick={() => { setVersionFilter("all"); setVisible(24); }}>Sve</FilterChip>
                <FilterChip active={versionFilter === "fan"} onClick={() => { setVersionFilter("fan"); setVisible(24); }}>Fan (4.200)</FilterChip>
                <FilterChip active={versionFilter === "player"} onClick={() => { setVersionFilter("player"); setVisible(24); }}>Player (4.500)</FilterChip>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Tip dresa</div>
              <div style={{ display: "flex", gap: 8 }}>
                <FilterChip active={kitFilter === "all"} onClick={() => { setKitFilter("all"); setVisible(24); }}>Svi</FilterChip>
                <FilterChip active={kitFilter === "home"} onClick={() => { setKitFilter("home"); setVisible(24); }}>Domaći</FilterChip>
                <FilterChip active={kitFilter === "away"} onClick={() => { setKitFilter("away"); setVisible(24); }}>Gostujući</FilterChip>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Veličina</div>
              <div style={{ display: "flex", gap: 6 }}>
                <FilterChip active={size === "all"} onClick={() => setSize("all")}>Sve</FilterChip>
                {SIZES.map(s => (
                  <FilterChip key={s} active={size === s} onClick={() => setSize(s)}>{s}</FilterChip>
                ))}
              </div>
            </div>
          </div>

          {/* Country filter */}
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Država ({WC_TEAMS.length})</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 96, overflowY: "auto", paddingBottom: 4 }}>
              <FilterChip active={country === "all"} onClick={() => { setCountry("all"); setVisible(24); }}>🌍 Sve države</FilterChip>
              {WC_TEAMS.map(t => (
                <FilterChip key={t.id} active={country === t.id} onClick={() => { setCountry(t.id); setVisible(24); }}>
                  {t.flag} {t.name}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Prikazano <strong style={{ color: "#00dcff" }}>{Math.min(visible, filtered.length)}</strong> od <strong style={{ color: "#fff" }}>{filtered.length}</strong> dresova
          {size !== "all" && <span> · Veličina {size} dostupna</span>}
        </div>
      </section>

      {/* Products grid */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 60px" }}>
        {shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Nema rezultata</div>
            <div>Pokušaj sa drugim filterima ili pretragom.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {shown.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                onAdd={onAddToCart}
                onWish={toggleWish}
                wished={wishlist.includes(p.id)}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {visible < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={() => setVisible(v => v + 24)} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,220,255,0.3)",
              color: "#00dcff", borderRadius: 12, padding: "14px 32px",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
            }}>UČITAJ JOŠ DRESOVA ({filtered.length - visible}) →</button>
          </div>
        )}
      </section>
    </div>
  );
}
