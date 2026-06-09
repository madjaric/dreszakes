import { useState, useMemo } from "react";
import { WC_TEAMS, SIZES } from "./teams.js";
import { PRODUCTS } from "./products.js";
import ProductImage from "./components/ProductImage.jsx";
import QuickViewModal from "./components/QuickViewModal.jsx";

function ProductCard({ p, onQuickView, onWish, wished }) {
  const [hovered, setHovered] = useState(false);
  const accent = p.version === "player" ? "#4ade80" : "#22d3ee";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? accent + "40" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 18, overflow: "hidden", transition: "all 0.3s",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 18px 50px ${accent}18` : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ height: 210, position: "relative", cursor: "pointer" }} onClick={() => onQuickView(p)}>
        <button
          onClick={(e) => { e.stopPropagation(); onWish(p); }}
          aria-label="Lista zelja"
          style={{
            position: "absolute", top: 12, left: 12, zIndex: 3,
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8, width: 34, height: 34, cursor: "pointer",
            color: wished ? "#ff4d6d" : "#fff", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >{wished ? "\u2665" : "\u2661"}</button>

        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 3,
          background: accent, color: "#000", borderRadius: 6, padding: "4px 9px",
          fontSize: 10, fontWeight: 800, letterSpacing: 1
        }}>{p.version === "player" ? "PLAYER" : "FAN"}</div>

        <div style={{ transition: "transform 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)", height: "100%" }}>
          <ProductImage src={p.images[0]} alt={p.title} colors={p.colors} version={p.version} />
        </div>

        <div style={{
          position: "absolute", bottom: 12, left: 12, zIndex: 2,
          background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: "#fff"
        }}>{p.typeLabel}</div>

        {hovered && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.25)", pointerEvents: "none"
          }}>
            <span style={{
              background: "rgba(0,0,0,0.7)", border: `1px solid ${accent}`,
              color: accent, padding: "8px 18px", borderRadius: 99,
              fontSize: 12, fontWeight: 700, letterSpacing: 1
            }}>\uD83D\uDC41 BRZI PREGLED</span>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>{p.flag}</span>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: "#fff", letterSpacing: 0.8, lineHeight: 1 }}>{p.team}</h3>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 14, flex: 1 }}>
          {p.description.length > 90 ? p.description.slice(0, 90) + "\u2026" : p.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: accent }}>{p.price.toLocaleString("sr-RS")}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>RSD</span>
          </div>
          <button
            onClick={() => onQuickView(p)}
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
              color: "#000", border: "none", borderRadius: 9,
              padding: "9px 16px", fontWeight: 800, fontSize: 12, cursor: "pointer",
              transition: "transform 0.15s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >Brzi pregled \u2192</button>
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
  const [size, setSize] = useState("all");
  const [kitFilter, setKitFilter] = useState("all");
  const [versionFilter, setVersionFilter] = useState("all");
  const [visible, setVisible] = useState(24);
  const [quickView, setQuickView] = useState(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (country !== "all" && p.teamId !== country) return false;
      if (kitFilter !== "all" && p.type !== kitFilter) return false;
      if (versionFilter !== "all" && p.version !== versionFilter) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.team.toLowerCase().includes(q) && !p.conf.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [country, kitFilter, versionFilter, size, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div style={{ background: "#05050e", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: "#fff" }}>
      <section style={{ padding: "50px 1.5rem 36px", maxWidth: 1280, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,220,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 22, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#39ff14", textTransform: "uppercase" }}>\uD83C\uDFC6 Zvanicna kolekcija</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 8vw, 6rem)", lineHeight: 0.95, color: "#fff", marginBottom: 16, position: "relative" }}>
          SVETSKO PRVENSTVO<br />
          <span style={{ background: "linear-gradient(90deg, #00dcff, #39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026 KOLEKCIJA</span>
        </h1>
        <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6, position: "relative" }}>
          Svi dresovi reprezentacija na Mundijalu 2026. Domaci i gostujuci, Fan i Player verzije.
          Dostupno {WC_TEAMS.length} nacija \u00b7 {PRODUCTS.length} modela.
        </p>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 32px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,220,255,0.2)", borderRadius: 14, padding: "13px 18px", marginBottom: 24, maxWidth: 560 }}>
          <span style={{ color: "#00dcff", fontSize: 18 }}>\uD83D\uDD0D</span>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setVisible(24); }} placeholder="Pretrazi reprezentaciju (npr. Argentina, Srbija...)" style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, flex: 1 }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>\u2715</button>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={fLabel}>Verzija</div>
              <div style={{ display: "flex", gap: 8 }}>
                <FilterChip active={versionFilter === "all"} onClick={() => { setVersionFilter("all"); setVisible(24); }}>Sve</FilterChip>
                <FilterChip active={versionFilter === "fan"} onClick={() => { setVersionFilter("fan"); setVisible(24); }}>Fan (4.200)</FilterChip>
                <FilterChip active={versionFilter === "player"} onClick={() => { setVersionFilter("player"); setVisible(24); }}>Player (4.500)</FilterChip>
              </div>
            </div>
            <div>
              <div style={fLabel}>Tip dresa</div>
              <div style={{ display: "flex", gap: 8 }}>
                <FilterChip active={kitFilter === "all"} onClick={() => { setKitFilter("all"); setVisible(24); }}>Svi</FilterChip>
                <FilterChip active={kitFilter === "home"} onClick={() => { setKitFilter("home"); setVisible(24); }}>Domaci</FilterChip>
                <FilterChip active={kitFilter === "away"} onClick={() => { setKitFilter("away"); setVisible(24); }}>Gostujuci</FilterChip>
              </div>
            </div>
            <div>
              <div style={fLabel}>Velicina</div>
              <div style={{ display: "flex", gap: 6 }}>
                <FilterChip active={size === "all"} onClick={() => { setSize("all"); setVisible(24); }}>Sve</FilterChip>
                {SIZES.map((s) => (
                  <FilterChip key={s} active={size === s} onClick={() => { setSize(s); setVisible(24); }}>{s}</FilterChip>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={fLabel}>Drzava ({WC_TEAMS.length})</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 96, overflowY: "auto", paddingBottom: 4 }}>
              <FilterChip active={country === "all"} onClick={() => { setCountry("all"); setVisible(24); }}>\uD83C\uDF0D Sve drzave</FilterChip>
              {WC_TEAMS.map((t) => (
                <FilterChip key={t.id} active={country === t.id} onClick={() => { setCountry(t.id); setVisible(24); }}>{t.flag} {t.name}</FilterChip>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Prikazano <strong style={{ color: "#00dcff" }}>{Math.min(visible, filtered.length)}</strong> od <strong style={{ color: "#fff" }}>{filtered.length}</strong> dresova
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 60px" }}>
        {shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>\uD83D\uDD0D</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Nema rezultata</div>
            <div>Pokusaj sa drugim filterima ili pretragom.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {shown.map((p) => (
              <ProductCard key={p.id} p={p} onQuickView={setQuickView} onWish={onWish} wished={wishlist.includes(p.id)} />
            ))}
          </div>
        )}

        {visible < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={() => setVisible((v) => v + 24)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,220,255,0.3)", color: "#00dcff", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>UCITAJ JOS DRESOVA ({filtered.length - visible}) \u2192</button>
          </div>
        )}
      </section>

      {quickView && (
        <QuickViewModal
          product={quickView}
          onClose={() => setQuickView(null)}
          onAddToCart={(item) => { onAddToCart(item); setQuickView(null); }}
          onWish={onWish}
          wished={wishlist.includes(quickView.id)}
        />
      )}
    </div>
  );
}
