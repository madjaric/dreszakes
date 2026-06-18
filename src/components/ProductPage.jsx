import { useState, useEffect } from "react";
import { PRODUCTS_BY_SLUG, getRelated } from "../products.js";
import ProductImage from "./ProductImage.jsx";
import SizeSelector from "./SizeSelector.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import PromoPerks from "./PromoPerks.jsx";
import LivePhotosBadge from "./LivePhotosBadge.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";

import { applySeo, breadcrumbLd, productLd, SITE } from "../seo.js";
import { handleNavClick, href } from "../navigate.js";

// Update document head for SEO (title, meta, canonical, OG, JSON-LD).
function useSeo(product) {
  useEffect(() => {
    if (!product) return;
    const path = `/world-cup/${product.slug}`;
    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        productLd(product, path),
        breadcrumbLd([
          { name: "Početna", path: "/" },
          { name: "SP 2026", path: "/world-cup" },
          { name: product.team, path },
        ]),
      ],
    };
    applySeo({
      title: product.seoTitle,
      description: product.seoDescription,
      path,
      image: product.images && product.images[0] ? `${SITE}${product.images[0]}` : undefined,
      jsonLd: ld,
    });
  }, [product]);
}

export default function ProductPage({ slug, onAddToCart }) {
  const product = PRODUCTS_BY_SLUG[slug];
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [personalize, setPersonalize] = useState(false);
  const [pName, setPName] = useState("");
  const [pNumber, setPNumber] = useState("");
  useSeo(product);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!product) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#fff", marginBottom: 12 }}>Proizvod nije pronađen</h2>
        <a href={href("/world-cup")} onClick={(e) => handleNavClick(e, "/world-cup")} style={{ color: "#00dcff", textDecoration: "none", fontWeight: 700 }}>← Nazad na SP 2026 kolekciju</a>
      </div>
    );
  }

  const accent = product.version === "player" ? "#4ade80" : "#22d3ee";
  const related = getRelated(slug, 4);
  const personalization = { enabled: personalize, name: pName.trim(), number: pNumber.trim() };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 1.5rem 60px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
        <a href={href("/")} onClick={(e) => handleNavClick(e, "/")} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Početna</a>
        {" / "}
        <a href={href("/world-cup")} onClick={(e) => handleNavClick(e, "/world-cup")} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>SP 2026</a>
        {" / "}
        <span style={{ color: accent }}>{product.team} {product.typeLabel}</span>
      </div>

      <div className="pp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* Glavna slika proizvoda */}
        <div style={{
          aspectRatio: "1 / 1", borderRadius: 16, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "radial-gradient(circle at 50% 42%, rgba(0,220,255,0.08), rgba(0,0,0,0) 66%), linear-gradient(180deg, #0b1018, #080b12)",
          padding: 24,
        }}>
          <ProductImage src={product.images[0]} alt={product.title} colors={product.colors} version={product.version} />
        </div>

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
          <div style={{ marginBottom: 20 }}>
            <QuantitySelector value={qty} onChange={setQty} accent={accent} />
          </div>

          {/* Personalizacija */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Personalizacija dresa</div>
            <div style={{ display: "flex", gap: 8, marginBottom: personalize ? 12 : 0 }}>
              <button onClick={() => setPersonalize(false)} style={ppOpt(!personalize, accent)}>Bez imena i broja</button>
              <button onClick={() => setPersonalize(true)} style={ppOpt(personalize, accent)}>Sa imenom i brojem</button>
            </div>
            {personalize && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>Ime</label>
                  <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Npr. MESSI"
                    style={ppInput} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>Broj</label>
                  <input value={pNumber} onChange={(e) => setPNumber(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="10" inputMode="numeric"
                    style={ppInput} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => onAddToCart({ ...product, size, qty, personalization })}
              style={{
                flex: 1, background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                color: "#000", border: "none", borderRadius: 12, padding: "16px",
                fontWeight: 800, fontSize: 16, cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
              }}
            >🛒 DODAJ U KORPU</button>
          </div>

          {/* WhatsApp order */}
          <div style={{ marginBottom: 24 }}>
            <WhatsAppButton product={product} size={size} qty={qty} personalization={personalization} full />
          </div>

          <div style={{ marginBottom: 24 }}>
            <LivePhotosBadge />
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
                  href={href(`/world-cup/${r.slug}`)} onClick={(e) => handleNavClick(e, `/world-cup/${r.slug}`)}
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

function ppOpt(active, accent) {
  return {
    flex: 1, padding: "11px 12px", borderRadius: 10,
    background: active ? accent : "rgba(255,255,255,0.05)",
    color: active ? "#000" : "rgba(255,255,255,0.7)",
    border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
    fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
  };
}

const ppInput = {
  width: "100%", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "11px 12px", color: "#fff", fontSize: 14, outline: "none",
};
