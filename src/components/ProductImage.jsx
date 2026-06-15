import { useState } from "react";

// Premium jersey SVG fallback, colored per team. Shown when the real photo
// is not present yet. When you add the file, the <img> loads and the fallback
// disappears automatically.
function JerseyFallback({ colors, version, label }) {
  const { primary = "#1a1a2e", secondary = "#00dcff" } = colors || {};
  const gid = `g-${primary}-${secondary}`.replace(/[^a-zA-Z0-9-]/g, "");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "linear-gradient(135deg, #0a0a14, #0f0f1f)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 55%, ${primary}22 0%, transparent 65%)`,
        }}
      />
      <svg width="58%" height="58%" viewBox="0 0 150 168" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "relative", zIndex: 1 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primary} stopOpacity="0.95" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.72" />
          </linearGradient>
        </defs>
        <path
          d="M32 52 L10 72 L26 84 L26 158 L124 158 L124 84 L140 72 L118 52 L100 40 Q75 30 50 40 Z"
          fill={`url(#${gid})`}
          stroke={secondary}
          strokeWidth="2"
        />
        <path d="M32 52 L10 72 L26 84 L40 66 Z" fill={secondary} fillOpacity="0.85" />
        <path d="M118 52 L140 72 L124 84 L110 66 Z" fill={secondary} fillOpacity="0.85" />
        <path d="M56 44 Q75 56 94 44 Q86 37 75 36 Q64 37 56 44 Z" fill={secondary} />
        <text x="75" y="120" textAnchor="middle" fill={secondary} fontSize="34" fontFamily="'Bebas Neue', sans-serif" opacity="0.95">
          {version === "player" ? "10" : "9"}
        </text>
        <path d="M48 62 Q60 56 72 62" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            letterSpacing: 1,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          Foto uskoro
        </div>
      )}
    </div>
  );
}

export default function ProductImage({ src, alt, colors, version, label = false, style }) {
  const [errored, setErrored] = useState(false);
  const showImg = !errored && src;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {showImg && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      )}
      {!showImg && <JerseyFallback colors={colors} version={version} label={label} />}
    </div>
  );
}
