import { useState, useEffect, useMemo } from "react";
import ProductGallery from "./ProductGallery.jsx";
import SizeSelector from "./SizeSelector.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import PromoPerks from "./PromoPerks.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";
import { getVariant } from "../products.js";

// `team` is a TEAM_CARDS entry. The modal lets the user pick kit type + version,
// then resolves to the concrete product variant for cart / wishlist / WhatsApp.
export default function QuickViewModal({ team, onClose, onAddToCart, onWish, wishlist }) {
  const [type, setType] = useState("home"); // home | away
  const [version, setVersion] = useState("fan"); // fan | player
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  const product = useMemo(() => getVariant(team.teamId, type, version), [team, type, version]);
  const accent = version === "player" ? "#4ade80" : "#22d3ee";
  const wished = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0a0a14", border: `1px solid ${accent}33`,
          borderRadius: 22, maxWidth: 920, width: "100%",
          maxHeight: "92vh", overflowY: "auto", position: "relative",
          animation: "modalIn 0.3s ease",
        }}
      >
        <button
          onClick={onClose} aria-label="Zatvori"
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 38, height: 38, borderRadius: 10,
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: 18, cursor: "pointer",
          }}
        >✕</button>

        <div className="qv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, padding: 28 }}>
          <ProductGallery product={product} height={380} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>{team.flag}</span>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#fff", letterSpacing: 0.5, lineHeight: 1 }}>
                {team.team}
              </h2>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 18 }}>
              Dres za Svetsko prvenstvo 2026
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={selLabel}>Tip dresa</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Toggle active={type === "home"} onClick={() => setType("home")} accent={accent}>Domaći</Toggle>
                <Toggle active={type === "away"} onClick={() => setType("away")} accent={accent}>Gostujući</Toggle>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={selLabel}>Verzija</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Toggle active={version === "fan"} onClick={() => setVersion("fan")} accent="#22d3ee">
                  Fan · 4.200
                </Toggle>
                <Toggle active={version === "player"} onClick={() => setVersion("player")} accent="#4ade80">
                  Player · 4.500
                </Toggle>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: accent }}>
                {product.price.toLocaleString("sr-RS")}
              </span>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginLeft: 5 }}>RSD</span>
            </div>

            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20 }}>
              {type === "home" ? team.descHome : team.descAway}
            </p>

            <div style={{ marginBottom: 18 }}>
              <SizeSelector sizes={product.sizes} value={size} onChange={setSize} accent={accent} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <QuantitySelector value={qty} onChange={setQty} accent={accent} />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <button
                onClick={() => onAddToCart({ ...product, size, qty })}
                style={{
                  flex: 1, background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                  color: "#000", border: "none", borderRadius: 12, padding: "15px",
                  fontWeight: 800, fontSize: 15, cursor: "pointer",
                  fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2,
                }}
              >🛒 DODAJ U KORPU</button>
              <button
                onClick={() => onWish(product)} aria-label="Lista želja"
                style={{
                  width: 52, borderRadius: 12,
                  background: wished ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${wished ? "#ff4d6d55" : "rgba(255,255,255,0.12)"}`,
                  color: wished ? "#ff4d6d" : "#fff", fontSize: 20, cursor: "pointer",
                }}
              >{wished ? "♥" : "♡"}</button>
            </div>

            <div style={{ marginBottom: 18 }}>
              <WhatsAppButton product={product} size={size} qty={qty} full />
            </div>

            {/* Promo strip */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              <span style={promoPill("#00dcff")}>🚚 Besplatna dostava na sve porudžbine</span>
              <span style={promoPill("#39ff14")}>🎁 Kupi 4 dresa i dobijaš Mystery Dres GRATIS</span>
            </div>

            <PromoPerks compact />

            <a
              href={`#/world-cup/${product.slug}`}
              onClick={onClose}
              style={{ marginTop: 14, textAlign: "center", color: accent, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
            >
              Pogledaj celu stranicu proizvoda →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const selLabel = { fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 };

function promoPill(color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "9px 12px", fontSize: 12.5, fontWeight: 700, color,
  };
}

function Toggle({ active, onClick, accent, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: "11px 14px", borderRadius: 10,
        background: active ? accent : "rgba(255,255,255,0.05)",
        color: active ? "#000" : "rgba(255,255,255,0.7)",
        border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
        fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
      }}
    >{children}</button>
  );
}
