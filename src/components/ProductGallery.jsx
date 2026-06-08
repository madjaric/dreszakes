import { useState, useRef } from "react";
import ProductImage from "./ProductImage.jsx";

export default function ProductGallery({ product, height = 420 }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef(null);

  const images = product.images || [];
  const count = images.length || 1;

  const go = (dir) => setActive((a) => (a + dir + count) % count);

  const handleMove = (e) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main frame */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMove}
        style={{
          position: "relative",
          height,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#0a0a14",
          cursor: zoom ? "zoom-in" : "default",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transition: "transform 0.2s ease-out",
            transform: zoom ? "scale(1.8)" : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        >
          <ProductImage
            src={images[active]}
            alt={`${product.title} — slika ${active + 1}`}
            colors={product.colors}
            version={product.version}
            label
          />
        </div>

        {/* Carousel arrows */}
        {count > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Prethodna slika" style={arrowStyle("left")}>‹</button>
            <button onClick={() => go(1)} aria-label="Sledeća slika" style={arrowStyle("right")}>›</button>
          </>
        )}

        {/* Zoom hint */}
        <div style={{
          position: "absolute", bottom: 10, right: 12, zIndex: 3,
          fontSize: 11, color: "rgba(255,255,255,0.45)",
          background: "rgba(0,0,0,0.4)", padding: "3px 9px", borderRadius: 6,
          pointerEvents: "none"
        }}>🔍 Pređi mišem za zum</div>

        {/* Dots */}
        {count > 1 && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 3 }}>
            {images.map((_, i) => (
              <span key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 18 : 7, height: 7, borderRadius: 99,
                background: i === active ? "#00dcff" : "rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.2s"
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div style={{ display: "flex", gap: 10 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flex: 1,
                height: 76,
                borderRadius: 10,
                overflow: "hidden",
                border: i === active ? "2px solid #00dcff" : "1px solid rgba(255,255,255,0.1)",
                padding: 0,
                cursor: "pointer",
                background: "#0a0a14",
              }}
            >
              <ProductImage
                src={img}
                alt={`${product.team} thumbnail ${i + 1}`}
                colors={product.colors}
                version={product.version}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function arrowStyle(side) {
  return {
    position: "absolute",
    top: "50%",
    [side]: 10,
    transform: "translateY(-50%)",
    zIndex: 3,
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.55)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: 24,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
