import { useState, useEffect } from "react";
import WorldCup from "./WorldCup.jsx";
import ProductPage from "./components/ProductPage.jsx";
import CoverageDashboard from "./components/CoverageDashboard.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import AnnouncementBar from "./components/AnnouncementBar.jsx";
import { whatsappUrl } from "./config.js";
import { applySeo, breadcrumbLd, collectionLd } from "./seo.js";

const NAV_LINKS = [
  { label: "Početna", href: "#/" },
  { label: "Proizvodi", href: "#products" },
  { label: "SP 2026 🏆", href: "#/world-cup" },
  { label: "FAQ", href: "#faq" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Mystery Dres",
    price: "3.000",
    tag: "🎁 IZNENAĐENJE",
    tagColor: "from-purple-500 to-pink-500",
    accent: "#a855f7",
    desc: "Nasumični fudbalski dres iz naše kolekcije. Nikad ne znaš šta dobijaš.",
    emoji: "🎭",
    badge: "NAJPOPULARNIJE",
    badgeColor: "bg-purple-500",
    img: "mystery",
    addToCart: true, // Mystery je stvaran proizvod — ide direktno u korpu
  },
  {
    id: 2,
    name: "Fan Version",
    price: "4.200",
    tag: "⭐ VREDNOST",
    tagColor: "from-blue-500 to-cyan-400",
    accent: "#22d3ee",
    desc: "Najbolji odnos cene i kvaliteta. Savršen izbor za navijače.",
    emoji: "🏟️",
    badge: "BESTSELLER",
    badgeColor: "bg-blue-500",
    img: "fan",
    href: "#/world-cup?v=fan",
  },
  {
    id: 3,
    name: "Player Version",
    price: "4.500",
    tag: "🔥 PRO",
    tagColor: "from-green-400 to-emerald-500",
    accent: "#4ade80",
    desc: "Isti kroj i materijal kakav koriste profesionalni fudbaleri.",
    emoji: "⚽",
    badge: "PREMIUM",
    badgeColor: "bg-green-500",
    img: "player",
    href: "#/world-cup?v=player",
  },
];

const TESTIMONIALS = [
  { name: "Nikola M.", city: "Beograd", text: "Top kvalitet, sve preporuke. Definitivno kupujem opet!", stars: 5 },
  { name: "Marko P.", city: "Novi Sad", text: "Player verzija brutalna. Tačno kao na terenu, prelepo sedi.", stars: 5 },
  { name: "Stefan R.", city: "Niš", text: "Za ove pare predobro. Mystery dres bio Real Madrid, presrećan sam!", stars: 5 },
  { name: "Aleksandar V.", city: "Kragujevac", text: "Odličan kvalitet i komunikacija tokom porudžbine. 10/10", stars: 5 },
];

const FAQS = [
  { q: "Kako mogu da poručim?", a: "Izaberite dres, veličinu i opcije, dodajte u korpu i nastavite na naručivanje. Porudžbinu potvrđujete putem WhatsApp-a." },
  { q: "Koliko traje dostava?", a: "Dostava traje 10-14 radnih dana širom Srbije." },
  { q: "Koja je razlika između Fan i Player verzije?", a: "Fan verzija ima regularni kroj i standardni materijal — savršena za svakodnevno nošenje. Player verzija ima atletski slim fit i premium lagani materijal identičan onome koji koriste profesionalni igrači." },
  { q: "Da li mogu da biram veličinu?", a: "Naravno! Veličine XS, S, M, L, XL i XXL su dostupne za sve modele. Samo napišite željenu veličinu u napomeni pri narudžbini." },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#facc15" }}>★</span>
      ))}
    </div>
  );
}

function Navbar({ cartCount, onCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.4s",
        background: scrolled
          ? "rgba(5,5,10,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,220,255,0.1)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", height: 68 }}>
        {/* Logo */}
        <a href="#/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} aria-label="Dres za Keš — početna">
          <img
            src="/images/logo.png"
            alt="Dres za Keš — fudbalski dresovi reprezentacija"
            width="81"
            height="40"
            loading="eager"
            fetchpriority="high"
            style={{ height: 40, width: "auto", display: "block" }}
          />
        </a>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 32, marginLeft: 48, flex: 1 }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              color: "rgba(255,255,255,0.7)", textDecoration: "none",
              fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase",
              transition: "color 0.2s"
            }}
              onMouseEnter={e => e.target.style.color = "#00dcff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
            >{l.label}</a>
          ))}
        </div>

        {/* Icons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
          <button style={{ ...iconBtn, position: "relative" }} onClick={onCart}>
            🛒
            {cartCount > 0 && <span style={{ ...badge, background: "#00dcff", color: "#000" }}>{cartCount}</span>}
          </button>
          <button
            style={{ display: "none" }}
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(5,5,15,0.98)", padding: "1rem 1.5rem 1.5rem",
          display: "flex", flexDirection: "column", gap: 16
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              fontSize: 14, fontWeight: 600, letterSpacing: 1
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

const iconBtn = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8, width: 38, height: 38,
  cursor: "pointer", color: "#fff", fontSize: 16,
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.2s"
};

const badge = {
  position: "absolute", top: -6, right: -6,
  background: "#39ff14", color: "#000",
  borderRadius: 999, width: 18, height: 18,
  fontSize: 10, fontWeight: 800,
  display: "flex", alignItems: "center", justifyContent: "center"
};

function HeroSection({ withBar = false }) {
  return (
    <section id="hero" style={{
      minHeight: withBar ? "calc(100vh - 112px)" : "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: withBar ? "56px 1.5rem 80px" : "120px 1.5rem 80px"
    }}>
      {/* Background effects */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,220,255,0.12) 0%, transparent 60%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(57,255,20,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,220,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none"
      }} />

      {/* Glowing orbs */}
      <div style={{
        position: "absolute", top: "20%", left: "10%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,220,255,0.06) 0%, transparent 70%)",
        animation: "float 8s ease-in-out infinite", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "10%",
        width: 250, height: 250, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)",
        animation: "float 10s ease-in-out infinite reverse", pointerEvents: "none"
      }} />

      <div style={{ textAlign: "center", maxWidth: 820, position: "relative", zIndex: 1 }}>
        {/* Pill badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(0,220,255,0.08)",
          border: "1px solid rgba(0,220,255,0.2)",
          borderRadius: 999, padding: "6px 16px", marginBottom: 28,
          fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#00dcff",
          textTransform: "uppercase"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00dcff", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          Novo u kolekciji
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3.2rem, 9vw, 7.5rem)",
          lineHeight: 0.92,
          letterSpacing: "0.01em",
          color: "#fff",
          marginBottom: 24,
          textShadow: "0 0 80px rgba(0,220,255,0.2)"
        }}>
          NAJJAČI<br />
          <span style={{
            background: "linear-gradient(90deg, #00dcff, #39ff14)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>FUDBALSKI</span><br />
          DRESOVI
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          color: "rgba(255,255,255,0.6)",
          maxWidth: 540, margin: "0 auto 40px",
          lineHeight: 1.6, letterSpacing: 0.2
        }}>
          Player Version, Fan Version i Mystery Dresovi<br />
          <strong style={{ color: "rgba(255,255,255,0.85)" }}>sa dostavom širom Srbije.</strong>
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#products" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #00dcff, #0099cc)",
            color: "#000", fontWeight: 800, fontSize: 14,
            textTransform: "uppercase", padding: "14px 32px", borderRadius: 12,
            textDecoration: "none", boxShadow: "0 0 30px rgba(0,220,255,0.4)",
            transition: "all 0.3s", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 50px rgba(0,220,255,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,220,255,0.4)"; }}
          >⚡ Kupi odmah</a>
          <a href="#/world-cup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontWeight: 700, fontSize: 14,
            padding: "14px 32px", borderRadius: 12, textDecoration: "none",
            transition: "all 0.3s", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(57,255,20,0.4)"; e.currentTarget.style.color = "#39ff14"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#fff"; }}
          >🏆 SP 2026 Kolekcija →</a>
        </div>

        {/* Promo strip (moved here from the removed top banner) */}
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", marginTop: 28, flexWrap: "wrap"
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,220,255,0.08)", border: "1px solid rgba(0,220,255,0.2)",
            borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#00dcff"
          }}>🚚 Besplatna dostava na sve porudžbine</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)",
            borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#39ff14"
          }}>🎁 Kupi 4 dresa → Mystery Dres GRATIS</span>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 32, justifyContent: "center", marginTop: 56,
          flexWrap: "wrap"
        }}>
          {[["500+", "Zadovoljnih kupaca"], ["2", "Verzije dresova"], ["10-14", "Dana dostava"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#00dcff", lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const features = [
    { icon: "⚡", title: "Premium kvalitet", desc: "Svaki dres prolazi strogi QC pre slanja. Samo top materijali." },
    { icon: "🚚", title: "Dostava 10-14 radnih dana", desc: "Dostava širom Srbije za 10-14 radnih dana." },
    { icon: "🔒", title: "Sigurna kupovina", desc: "Tvoji podaci su zaštićeni i bezbedni." },
    { icon: "🔥", title: "Najtraženiji modeli", desc: "Real Madrid, Barcelona, Argentina, Brazil i mnogi drugi." },
    { icon: "⭐", title: "Zadovoljni kupci", desc: "500+ zadovoljnih kupaca. Provjeri recenzije!" },
  ];

  return (
    <section style={{ padding: "80px 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{ color: "#00dcff", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Zašto DresZaKes?</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#fff", lineHeight: 1 }}>
          RAZLOG ZAŠTO SMO<br />
          <span style={{ background: "linear-gradient(90deg,#00dcff,#39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BROJ 1 U SRBIJI</span>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "28px 22px",
            transition: "all 0.3s",
            cursor: "default",
            backdropFilter: "blur(10px)"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.border = "1px solid rgba(0,220,255,0.25)";
              e.currentTarget.style.background = "rgba(0,220,255,0.05)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#fff", letterSpacing: 1, marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsSection({ onAddToCart }) {
  const handleClick = (p) => {
    if (p.addToCart) {
      onAddToCart(p);
    } else {
      window.location.assign(p.href);
    }
  };
  return (
    <section id="products" style={{ padding: "80px 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{ color: "#39ff14", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Naša ponuda</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#fff", lineHeight: 1 }}>
          IZABERI SVOG<br />
          <span style={{ background: "linear-gradient(90deg,#39ff14,#00dcff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FAVORITA</span>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {PRODUCTS.map((p) => (
          <div key={p.id} onClick={() => handleClick(p)} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, overflow: "hidden",
            transition: "all 0.35s",
            cursor: "pointer",
            position: "relative"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${p.accent}40`;
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = `0 20px 60px ${p.accent}20`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Badge */}
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: p.accent, color: "#000",
              borderRadius: 6, padding: "4px 10px",
              fontSize: 10, fontWeight: 800, letterSpacing: 1.5, zIndex: 2
            }}>{p.badge}</div>

            {/* Product Image Area */}
            <div style={{
              height: 240, position: "relative",
              background: `linear-gradient(135deg, #0a0a12, #0f0f1e)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              {/* Decorative glow */}
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(circle at 50% 60%, ${p.accent}18 0%, transparent 65%)`,
                pointerEvents: "none"
              }} />

              {/* Jersey illustration */}
              <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "relative", zIndex: 1 }}>
                {/* Jersey body */}
                <path d="M30 50 L10 70 L25 80 L25 150 L115 150 L115 80 L130 70 L110 50 L95 40 Q70 30 45 40 Z"
                  fill={`${p.accent}22`}
                  stroke={p.accent}
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
                {/* Collar */}
                <path d="M52 42 Q70 52 88 42 Q80 36 70 35 Q60 36 52 42 Z"
                  fill={`${p.accent}40`}
                  stroke={p.accent}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />
                {/* Sleeves */}
                <path d="M30 50 L10 70 L25 80 L38 65 Z"
                  fill={`${p.accent}15`}
                  stroke={p.accent}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <path d="M110 50 L130 70 L115 80 L102 65 Z"
                  fill={`${p.accent}15`}
                  stroke={p.accent}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                {/* Number */}
                <text x="70" y="110" textAnchor="middle" fill={p.accent} fontSize="28" fontFamily="'Bebas Neue', sans-serif" opacity="0.9">
                  {p.id === 1 ? "?" : p.id === 2 ? "10" : "7"}
                </text>
                {/* Shine */}
                <path d="M45 60 Q55 55 65 60" stroke="white" strokeWidth="1" strokeOpacity="0.15" fill="none" />
              </svg>

              {/* Tag */}
              <div style={{
                position: "absolute", bottom: 14, left: 14,
                background: `rgba(0,0,0,0.6)`,
                border: `1px solid ${p.accent}40`,
                borderRadius: 6, padding: "4px 10px",
                fontSize: 11, fontWeight: 700, color: p.accent, letterSpacing: 1
              }}>{p.tag}</div>
            </div>

            {/* Card Content */}
            <div style={{ padding: "22px 22px 24px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff", letterSpacing: 1, marginBottom: 8 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>{p.desc}</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: p.accent, letterSpacing: 1 }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>RSD</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleClick(p); }} style={{
                  background: `linear-gradient(135deg, ${p.accent}, ${p.accent}aa)`,
                  color: "#000", border: "none", borderRadius: 10,
                  padding: "10px 20px", fontWeight: 800, fontSize: 13,
                  cursor: "pointer", transition: "all 0.2s",
                  letterSpacing: 0.5, display: "inline-block"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                >{p.addToCart ? "Dodaj u korpu 🛒" : "Pogledaj →"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div style={{
        display: "flex", gap: 24, justifyContent: "center", marginTop: 48,
        flexWrap: "wrap"
      }}>
        {["🔒 Sigurna kupovina", "🚚 Besplatna dostava"].map(t => (
          <div key={t} style={{
            fontSize: 13, color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "8px 14px"
          }}>{t}</div>
        ))}
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section style={{ padding: "80px 1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <p style={{ color: "#00dcff", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Poređenje</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff", lineHeight: 1 }}>
          FAN vs <span style={{ background: "linear-gradient(90deg,#00dcff,#39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PLAYER</span>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Fan Version */}
        <div style={{
          background: "rgba(34,211,238,0.05)",
          border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: 20, padding: "32px 28px"
        }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#22d3ee", marginBottom: 6, letterSpacing: 1 }}>Fan Version</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", marginBottom: 24 }}>4.200 <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>RSD</span></div>
          {[
            "Regular fit",
            "Standard performance fabric",
            "Made for fans and everyday wear",
            "Dostupno u svim veličinama",
          ].map(f => (
            <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
              <span style={{ color: "#22d3ee", marginTop: 1, flexShrink: 0 }}>✓</span>
              {f}
            </div>
          ))}
        </div>

        {/* Player Version */}
        <div style={{
          background: "rgba(74,222,128,0.05)",
          border: "1px solid rgba(74,222,128,0.25)",
          borderRadius: 20, padding: "32px 28px",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: 16, right: 16,
            background: "#4ade80", color: "#000",
            borderRadius: 6, padding: "3px 10px",
            fontSize: 10, fontWeight: 800, letterSpacing: 1
          }}>PREPORUČUJEMO</div>

          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#4ade80", marginBottom: 6, letterSpacing: 1 }}>Player Version</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", marginBottom: 24 }}>4.500 <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>RSD</span></div>
          {[
            "Slim athletic fit",
            "Premium lightweight fabric",
            "Match-quality construction",
            "Isti stil koji koriste profesionalci",
            "Dostupno u svim veličinama",
          ].map(f => (
            <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              <span style={{ color: "#4ade80", marginTop: 1, flexShrink: 0 }}>✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const MYSTERY_ITEMS = ["Real Madrid", "Barcelona", "Argentina", "Brazil", "PSG", "Man United"];

function MysterySection({ onAddToCart }) {
  const [revealed, setRevealed] = useState(false);
  const items = MYSTERY_ITEMS;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!revealed) {
      const id = setInterval(() => setCurrent(c => (c + 1) % items.length), 600);
      return () => clearInterval(id);
    }
  }, [revealed, items.length]);

  return (
    <section style={{
      padding: "80px 1.5rem",
      background: "linear-gradient(180deg, transparent, rgba(168,85,247,0.05), transparent)"
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "#a855f7", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Ekskluzivno</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.4rem, 6vw, 5rem)", color: "#fff", lineHeight: 1, marginBottom: 16 }}>
          KOJI DRES<br />
          <span style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ĆEŠ DOBITI?</span>
        </h2>

        {/* Mystery Box UI */}
        <div style={{
          background: "rgba(168,85,247,0.08)",
          border: "1px solid rgba(168,85,247,0.25)",
          borderRadius: 24, padding: "48px 32px", margin: "32px 0",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.1) 0%, transparent 60%)",
            pointerEvents: "none"
          }} />

          {/* Spinning question marks or revealed team */}
          <div style={{
            fontSize: revealed ? 28 : 80,
            marginBottom: 20,
            height: 96, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Bebas Neue', sans-serif",
            color: revealed ? "#a855f7" : "#fff",
            transition: "all 0.3s",
            letterSpacing: revealed ? 2 : 0
          }}>
            {revealed ? `🎉 ${items[current]}!` : "❓"}
          </div>

          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
            Možda ćeš dobiti...
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32,
            color: "#a855f7",
            marginBottom: 24,
            minHeight: 42,
            transition: "all 0.2s"
          }}>
            {items[current]}
          </div>

          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#fff", marginBottom: 8 }}>
            3.000 <span style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}>RSD</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 28 }}>
            Vrednost dresova kreće se od 4.200 do 4.500 RSD. Uvek dobijaš više nego što platiš.
          </p>

          {/* Scarcity */}
          <div style={{
            display: "inline-flex", gap: 8, alignItems: "center",
            background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.2)",
            borderRadius: 8, padding: "6px 14px", marginBottom: 24, fontSize: 12,
            color: "#ff6464", fontWeight: 700
          }}>
            🔥 Ostalo samo 7 komada!
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onAddToCart(PRODUCTS[0])} style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              color: "#fff", border: "none", borderRadius: 12,
              padding: "14px 32px", fontWeight: 800, fontSize: 14,
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
            }}>🎁 Naruči Mystery Dres</button>
            <button onClick={() => setRevealed(!revealed)} style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#a855f7", borderRadius: 12,
              padding: "14px 24px", fontWeight: 700, fontSize: 13,
              cursor: "pointer"
            }}>{revealed ? "Sakrij" : "Otkrij moguće dresove"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section style={{ padding: "80px 1.5rem", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: "#39ff14", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Recenzije</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "#fff", lineHeight: 1 }}>
            ŠTA KAŽU<br />
            <span style={{ background: "linear-gradient(90deg,#39ff14,#00dcff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KUPCI</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "24px 22px",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s"
            }}
              onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(57,255,20,0.2)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
            >
              <StarRating count={t.stars} />
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, margin: "14px 0 18px" }}>"{t.text}"</p>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{t.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "80px 1.5rem", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <p style={{ color: "#00dcff", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Pitanja</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "#fff", lineHeight: 1 }}>
          ČESTO POSTAVLJANA<br />
          <span style={{ background: "linear-gradient(90deg,#00dcff,#39ff14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PITANJA</span>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${open === i ? "rgba(0,220,255,0.25)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 14, overflow: "hidden", transition: "border 0.3s"
          }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", background: "none", border: "none",
              padding: "18px 22px", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              color: "#fff", fontWeight: 600, fontSize: 14, textAlign: "left", gap: 12
            }}>
              <span>{f.q}</span>
              <span style={{
                color: "#00dcff", fontSize: 18, flexShrink: 0,
                transition: "transform 0.3s",
                transform: open === i ? "rotate(45deg)" : "none"
              }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 22px 18px", color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "48px 1.5rem 32px",
      background: "rgba(0,0,0,0.4)"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 40 }}>
          <div>
            <img
              src="/images/logo.png"
              alt="Dres za Keš logo"
              width="89"
              height="44"
              loading="lazy"
              style={{ height: 44, width: "auto", display: "block", marginBottom: 14 }}
            />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, maxWidth: 200 }}>
              Najjači fudbalski dresovi u Srbiji. Premium kvalitet, dostava 10-14 radnih dana.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Linkovi</div>
            {[["Početna", "#/"], ["Proizvodi", "#products"], ["SP 2026", "#/world-cup"], ["FAQ", "#faq"]].map(([l, href]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <a href={href} style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}
                  onMouseEnter={e => e.target.style.color = "#00dcff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
                >{l}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Pratite nas</div>
            <a href="https://www.instagram.com/dreszakes/" target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: 13
            }}>📸 Instagram @dreszakes</a>
            <span style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              color: "rgba(255,255,255,0.45)", fontSize: 13
            }}>🎵 TikTok @dreszakes</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Kontakt</div>
            <div style={{ marginBottom: 10 }}>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#00dcff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >💬 Kontakt putem WhatsApp-a</a>
            </div>
            {["Politika privatnosti", "Uslovi korišćenja"].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
        }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>© 2025 DresZaKes. Sva prava zadržana.</p>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Made with ⚡ in Serbia</p>
        </div>
      </div>
    </footer>
  );
}

// Cart modal
function CartModal({ items, onClose, onCheckout, onRemoveItem }) {
  const priceNum = (p) => typeof p === "number" ? p : parseInt(String(p).replace(/\./g, ""), 10) || 0;
  const total = items.reduce((s, i) => s + priceNum(i.price) * (i.qty || 1), 0);
  const totalQty = items.reduce((s, i) => s + (i.qty || 1), 0);
  const freeMystery = totalQty >= 4;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1001,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "flex-end", justifyContent: "flex-end"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0a0a12", border: "1px solid rgba(0,220,255,0.2)",
        borderRadius: "20px 0 0 0", width: "100%", maxWidth: 420,
        height: "100vh", maxHeight: "100vh", overflow: "auto",
        padding: 28, display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#fff", letterSpacing: 2 }}>KORPA 🛒</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 18 }}>✕</button>
        </div>

        {/* Promo strip in cart */}
        <div style={{
          background: "linear-gradient(90deg, rgba(0,220,255,0.1), rgba(57,255,20,0.1))",
          border: "1px solid rgba(57,255,20,0.2)", borderRadius: 10,
          padding: "10px 12px", marginBottom: 20, fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5
        }}>
          🚚 Besplatna dostava na sve porudžbine<br />
          🎁 {freeMystery
            ? <strong style={{ color: "#39ff14" }}>Čestitamo! Dobijaš Mystery Dres GRATIS 🎉</strong>
            : `Dodaj još ${4 - totalQty} ${4 - totalQty === 1 ? "dres" : "dresa"} za Mystery Dres GRATIS`}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", marginTop: 60, flex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            Korpa je prazna
          </div>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "center",
                  padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                    background: `rgba(0,220,255,0.1)`, border: "1px solid rgba(0,220,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>{item.flag || item.emoji || "⚽"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{item.team || item.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                      {(item.qty || 1)}x{item.size ? ` · ${item.size}` : ""}{item.versionLabel ? ` · ${item.versionLabel}` : ""}
                    </div>
                    {item.personalization && item.personalization.enabled && (
                      <div style={{ color: "#39ff14", fontSize: 11, marginTop: 2 }}>
                        ✏️ {item.personalization.name || "-"} {item.personalization.number || ""}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#00dcff" }}>{(priceNum(item.price) * (item.qty || 1)).toLocaleString("sr-RS")} RSD</div>
                    {onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(i)}
                        aria-label="Ukloni iz korpe"
                        title="Ukloni"
                        style={{
                          background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.25)",
                          color: "#ff4d6d", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          borderRadius: 7, padding: "4px 10px", lineHeight: 1,
                          display: "flex", alignItems: "center", gap: 4,
                        }}
                      >✕ Ukloni</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Ukupno:</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff" }}>{total.toLocaleString("sr-RS")} RSD</span>
              </div>
              <button onClick={onCheckout} style={{
                width: "100%", background: "linear-gradient(135deg, #00dcff, #0099cc)",
                color: "#000", border: "none", borderRadius: 12, padding: "15px",
                fontWeight: 800, fontSize: 15, cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2
              }}>NASTAVI NA NARUČIVANJE →</button>
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 12 }}>
                🚚 Dostava 10-14 radnih dana · 🔒 Sigurna kupovina
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


function parseRoute() {
  if (typeof window === "undefined") return { name: "home" };
  // Podrži i hash (#/world-cup) i clean path (/world-cup) — clean path dolazi
  // iz sitemap-a / Google indeksa. Hash ima prednost ako postoji.
  let hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "/") {
    const path = window.location.pathname;
    if (path && path !== "/") hash = path;
  }
  if (hash === "/coverage") return { name: "coverage" };
  if (hash === "/checkout") return { name: "checkout" };
  // #/world-cup/:slug
  const productMatch = hash.match(/^\/world-cup\/(.+)$/);
  if (productMatch) return { name: "product", slug: productMatch[1] };
  if (hash.startsWith("/world-cup")) return { name: "worldcup" };
  return { name: "home" };
}

export default function DresZaKes() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [route, setRoute] = useState(parseRoute());

  useEffect(() => {
    // Clean URL → hash normalizacija (tačka 4): ako je korisnik/crawler došao
    // preko clean putanje (/world-cup, /world-cup/argentina-home-fan, /checkout...)
    // bez hash-a, prebaci na ekvivalentni #/ oblik. Koristi replaceState da NEMA
    // reload-a, NEMA gubitka React state-a, i da se URL ne duplira u istoriji.
    const path = window.location.pathname;
    const hasHash = window.location.hash && window.location.hash.length > 1;
    if (!hasHash && path && path !== "/") {
      const clean = path.replace(/\/+$/, ""); // ukloni trailing slash
      // postavi hash na clean putanju i resetuj pathname na "/" da ostane samo hash ruta
      window.history.replaceState(null, "", "/#" + clean);
      setRoute(parseRoute());
    }

    const onHash = () => {
      setRoute(parseRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Per-route SEO (title, meta, canonical, JSON-LD). ProductPage upravlja svojim.
  useEffect(() => {
    if (route.name === "home") {
      applySeo({
        title: "Fudbalski Dresovi Reprezentacija | Dres za Keš — World Cup 2026",
        description:
          "Fudbalski dresovi reprezentacija za Svetsko prvenstvo 2026. Fan i Player verzija, domaći i gostujući dresovi, Mystery Dres iznenađenje. Dostava širom Srbije 10-14 radnih dana.",
        path: "/",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbLd([{ name: "Početna", path: "/" }]),
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        },
      });
    } else if (route.name === "worldcup") {
      applySeo({
        title: "World Cup 2026 Dresovi — 48 Reprezentacija | Dres za Keš",
        description:
          "Dresovi svih 48 reprezentacija za Svetsko prvenstvo 2026. Argentina, Brazil, Nemačka, Portugal, Francuska, Engleska i ostali — Fan i Player verzija, domaći i gostujući. Dostava širom Srbije.",
        path: "/world-cup",
        jsonLd: collectionLd(
          "World Cup 2026 Kolekcija",
          "Fudbalski dresovi svih 48 reprezentacija za Svetsko prvenstvo 2026.",
          "/world-cup"
        ),
      });
    } else if (route.name === "checkout") {
      applySeo({
        title: "Naručivanje | Dres za Keš",
        description: "Završite porudžbinu fudbalskih dresova. Dostava širom Srbije 10-14 radnih dana.",
        path: "/checkout",
      });
      // checkout se ne indeksira
      let r = document.head.querySelector('meta[name="robots"]');
      if (r) r.setAttribute("content", "noindex, follow");
    } else if (route.name === "coverage") {
      applySeo({ title: "Image Coverage | Dres za Keš", description: "Interni pregled slika dresova.", path: "/coverage" });
    }
    // Vrati robots na index za ne-checkout rute
    if (route.name !== "checkout") {
      let r = document.head.querySelector('meta[name="robots"]');
      if (r) r.setAttribute("content", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }
  }, [route]);

  const addToCart = (product) => {
    const qty = product.qty || 1;
    setCartItems(prev => [...prev, { ...product, qty }]);
    setToast(`${product.team || product.name} dodat u korpu! 🛒`);
    setTimeout(() => setToast(null), 2800);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const goToCheckout = () => {
    setCartOpen(false);
    window.location.hash = "/checkout";
  };

  return (
    <div style={{ background: "#05050e", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: "#fff" }}>
      <Navbar cartCount={cartItems.length} onCart={() => setCartOpen(true)} />

      {route.name === "worldcup" && (
        <div style={{ paddingTop: 68 }}>
          <AnnouncementBar />
          <WorldCup onAddToCart={addToCart} cartCount={cartItems.length} />
        </div>
      )}

      {route.name === "product" && (
        <div style={{ paddingTop: 80 }}>
          <ProductPage slug={route.slug} onAddToCart={addToCart} />
        </div>
      )}

      {route.name === "checkout" && (
        <div style={{ paddingTop: 80 }}>
          <CheckoutPage items={cartItems} onClearCart={() => setCartItems([])} onRemoveItem={removeFromCart} />
        </div>
      )}

      {route.name === "coverage" && (
        <div style={{ paddingTop: 80 }}>
          <CoverageDashboard />
        </div>
      )}

      {route.name === "home" && (
        <>
          <div style={{ paddingTop: 68 }}>
            <AnnouncementBar />
          </div>
          <HeroSection withBar />
          <WhyUsSection />
          <ProductsSection onAddToCart={addToCart} />
          <ComparisonSection />
          <MysterySection onAddToCart={addToCart} />
          <TestimonialsSection />
          <FAQSection />
        </>
      )}
      <Footer />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,220,255,0.95)", color: "#000",
          borderRadius: 12, padding: "12px 22px", fontSize: 14, fontWeight: 700,
          zIndex: 999, animation: "toastIn 0.4s ease",
          boxShadow: "0 10px 30px rgba(0,220,255,0.4)"
        }}>
          {toast}
        </div>
      )}

      {cartOpen && <CartModal items={cartItems} onClose={() => setCartOpen(false)} onCheckout={goToCheckout} onRemoveItem={removeFromCart} />}
    </div>
  );
}
