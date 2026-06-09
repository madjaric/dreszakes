import { useState, useEffect } from "react";
import ProductGallery from "./ProductGallery.jsx";
import SizeSelector from "./SizeSelector.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import PromoPerks from "./PromoPerks.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";

export default function QuickViewModal({ product, onClose, onAddToCart, onWish, wished }) {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const accent = product.version === "player" ? "#4ade80" : "#22d3ee";

  // Lock scroll + ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0a0a14",
          border: `1px solid ${accent}33`,
          borderRadius: 22,
          maxWidth: 920,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
          animation: "modalIn 0.3s ease",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Zatvori"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div className="qv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, padding: 28 }}>
          {/* Gallery */}
          <ProductGallery product={product} height={380} />

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ ...badge, background: "rgba(255,255,255,0.08)", color: "#fff" }}>
                {product.flag} {product.team}
              </span>
              <span style={{ ...badge, background: "rgba(0,220,255,0.12)", color: "#00dcff", border: "1px solid rgba(0,220,255,0.3)" }}>
                {product.typeLabel}
              </span>
              <span style={{ ...badge, background: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}>
                {product.versionLabel}
              </span>
            </div>

            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#fff", letterSpacing: 0.5, lineHeight: 1.05, marginBottom: 12 }}>
              {product.title}
            </h2>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: accent }}>
                {product.price.toLocaleString("sr-RS")}
              </span>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginLeft: 5 }}>RSD</span>
            </div>

            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20 }}>
              {product.description}
            </p>

            <div style={{ marginBottom: 18 }}>
              <SizeSelector sizes={product.sizes} value={size} onChange={setSize} accent={accent} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <QuantitySelector value={qty} onChange={setQty} accent={accent} />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <button
                onClick={() => onAddToCart({ ...product, size, qty })}
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                  color: "#000",
                  border: "none",
                  borderRadius: 12,
                  padding: "15px",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: 2,
                }}
              >
                🛒 DODAJ U KORPU
              </button>
              <button
                onClick={() => onWish(product)}
                aria-label="Lista želja"
                style={{
                  width: 52,
                  borderRadius: 12,
                  background: wished ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${wished ? "#ff4d6d55" : "rgba(255,255,255,0.12)"}`,
                  color: wished ? "#ff4d6d" : "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                {wished ? "♥" : "♡"}
              </button>
            </div>

            {/* WhatsApp order */}
            <div style={{ marginBottom: 18 }}>
              <WhatsAppButton product={product} size={size} qty={qty} full />
            </div>

            <PromoPerks compact />

            {/* Full page link */}
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

const badge = {
  borderRadius: 7,
  padding: "5px 11px",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.5,
};
