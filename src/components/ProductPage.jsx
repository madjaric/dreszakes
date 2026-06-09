import { useState, useEffect } from "react";
import { PRODUCTS_BY_SLUG, getRelated } from "../products.js";
import ProductGallery from "./ProductGallery.jsx";
import ProductImage from "./ProductImage.jsx";
import SizeSelector from "./SizeSelector.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import PromoPerks from "./PromoPerks.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";

// Update document head for SEO (title + meta description).
function useSeo(product) {
  useEffect(() => {
    if (!product) return;
    const prevTitle = document.title;
    document.title = product.seoTitle;

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta ? meta.getAttribute("content") : null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", product.seoDescription);

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, [product]);
}

export default function ProductPage({ slug, onAddToCart, onWish, wishlist }) {
  const product = PRODUCTS_BY_SLUG[slug];
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  useSeo(product);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!product) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#fff", marginBottom: 12 }}>Proizvod nije pronađen</h2>
        <a href="#/world-cup" style={{ color: "#00dcff", textDecoration: "none", fontWeight: 700 }}>← Nazad na SP 2026 kolekciju</a>
      </div>
    );
  }

  const accent = product.version === "player" ? "#4ade80" : "#22d3ee";
  const related = getRelated(slug, 4);
  const wished = wishlist.includes(product.id);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 1.5rem 60px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
        <a href="#/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Početna</a>
        {" / "}
        <a href="#/world-cup" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>SP 2026</a>
        {" / "}
        <span style={{ color: accent }}>{product.team} {product.typeLabel}</span>
      </div>

      <div className="pp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* Gallery */}
        <ProductGallery product={product} height={460} />

        {/* Info */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ ...badge, background: "rgba(255,255,255,0.08)", color: "#fff" }}>{product.flag} {product.team}</span>
            <span style={{ ...badge, background: "rgba(0,220,255,0.12)", color: "#00dcff", border: "1px solid rgba(0,220,255,0.3)" }}>{product.typeLabel}</span>
            <span style={{ ...badge, background: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}>{product.versionLabel}</span>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: "#fff", letterSpacing: 0.5, lineHeight: 1.05, marginBottom: 14 }}>
            {product.title}
          </h1>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 46, color: accent }}>{product.price.toLocaleString("sr-RS")}</span>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>RSD</span>
          </div>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 24 }}>
            {product.description}
          </p>

          <div style={{ marginBottom: 20 }}>
            <SizeSelector sizes={product.sizes} value={size} onChange={setSize} accent={accent} />
          </div>
          <div style={{ marginBottom: 26 }}>
            <QuantitySelector value={qty} onChange={setQty} accent={accent} />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => onAddToCart({ ...product, size, qty })}
              style={{
                flex: 1, background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                color: "#000", border: "none", borderRadius: 12, padding: "16px",
                fontWeight: 800, fontSize: 16, cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
              }}
            >🛒 DODAJ U KORPU</button>
            <button
              onClick={() => onWish(product)}
              aria-label="Lista želja"
              style={{
                width: 56, borderRadius: 12,
                background: wished ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${wished ? "#ff4d6d55" : "rgba(255,255,255,0.12)"}`,
                color: wished ? "#ff4d6d" : "#fff", fontSize: 22, cursor: "pointer"
              }}
            >{wished ? "♥" : "♡"}</button>
          </div>

          {/* WhatsApp order */}
          <div style={{ marginBottom: 24 }}>
            <WhatsAppButton product={product} size={size} qty={qty} full />
          </div>

          <PromoPerks />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#fff", letterSpacing: 1, marginBottom: 24 }}>
            SLIČNI DRESOVI
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
            {related.map((r) => {
              const rAccent = r.version === "player" ? "#4ade80" : "#22d3ee";
              return (
                <a
                  key={r.slug}
                  href={`#/world-cup/${r.slug}`}
                  style={{
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "transform 0.2s, border 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.border = `1px solid ${rAccent}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; }}
                >
                  <div style={{ height: 160 }}>
                    <ProductImage src={r.images[0]} alt={r.title} colors={r.colors} version={r.version} />
                  </div>
                  <div style={{ padding: "12px 14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span>{r.flag}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: "#fff" }}>{r.team}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{r.typeLabel} · {r.versionLabel}</div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: rAccent }}>{r.price.toLocaleString("sr-RS")} <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>RSD</span></span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
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
