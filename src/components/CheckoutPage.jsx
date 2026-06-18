import { useState } from "react";
import { buildWhatsAppCheckoutUrl } from "../whatsapp.js";

function priceNum(p) {
  return typeof p === "number" ? p : parseInt(String(p).replace(/\./g, ""), 10) || 0;
}

const FIELDS = [
  { key: "fullName", label: "Ime i prezime", type: "text", required: true },
  { key: "phone", label: "Telefon", type: "tel", required: true },
  { key: "email", label: "Email", type: "email", required: false },
  { key: "address", label: "Adresa", type: "text", required: true },
  { key: "city", label: "Grad", type: "text", required: true },
  { key: "zip", label: "Poštanski broj", type: "text", required: false },
];

// Fields that block submission until filled (per spec): ime, telefon, adresa, grad.
const REQUIRED_KEYS = ["fullName", "phone", "address", "city"];

export default function CheckoutPage({ items, onClearCart, onRemoveItem }) {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "", city: "", zip: "" });
  const [errors, setErrors] = useState({});

  const total = items.reduce((s, i) => s + priceNum(i.price) * (i.qty || 1), 0);
  const totalQty = items.reduce((s, i) => s + (i.qty || 1), 0);

  const emailOk = !form.email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
  const isValid = REQUIRED_KEYS.every((k) => form[k].trim().length > 0) && emailOk;

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const validate = () => {
    const e = {};
    REQUIRED_KEYS.forEach((k) => {
      if (!form[k].trim()) e[k] = true;
    });
    if (form.email && !emailOk) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const url = buildWhatsAppCheckoutUrl(items, form);
    window.open(url, "_blank", "noopener,noreferrer");
    onClearCart();
    window.location.hash = "/";
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#fff", marginBottom: 12 }}>Korpa je prazna</h2>
        <a href="#/world-cup" style={{ color: "#00dcff", textDecoration: "none", fontWeight: 700 }}>← Nazad na SP 2026 kolekciju</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 1.5rem 80px", color: "#fff" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
        <a href="#/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Početna</a> / <span style={{ color: "#00dcff" }}>Naručivanje</span>
      </div>

      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem,5vw,3.2rem)", letterSpacing: 1, marginBottom: 8 }}>
        NARUČIVANJE
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 28 }}>
        Popunite podatke za dostavu. Porudžbinu šaljete i potvrđujete putem WhatsApp-a.
      </p>

      <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 28, alignItems: "start" }}>
        {/* Form */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", letterSpacing: 0.5, marginBottom: 18 }}>Podaci za dostavu</h3>
          <div className="checkout-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {FIELDS.map((f) => (
              <div key={f.key} className={f.key === "address" ? "checkout-span" : undefined} style={{ gridColumn: f.key === "address" ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 6, fontWeight: 600 }}>
                  {f.label}{f.required && <span style={{ color: "#ff4d6d" }}> *</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${errors[f.key] ? "#ff4d6d" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none",
                  }}
                />
                {errors[f.key] && <div style={{ color: "#ff4d6d", fontSize: 11, marginTop: 4 }}>Obavezno polje</div>}
              </div>
            ))}
          </div>

          <button onClick={submit} disabled={!isValid} style={{
            width: "100%", marginTop: 22,
            background: isValid ? "linear-gradient(135deg, #25D366, #1ebe5d)" : "rgba(255,255,255,0.08)",
            color: isValid ? "#04210f" : "rgba(255,255,255,0.35)",
            border: isValid ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px", fontWeight: 800, fontSize: 15,
            cursor: isValid ? "pointer" : "not-allowed", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
          }}>💬 POŠALJI PORUDŽBINU</button>

          {!isValid && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>
              Popunite obavezna polja: ime i prezime, telefon, adresa i grad.
            </p>
          )}

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 12 }}>
            🚚 Dostava 10-14 radnih dana · 🔒 Sigurna kupovina
          </p>
        </div>

        {/* Order summary */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, position: "sticky", top: 90 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", letterSpacing: 0.5, marginBottom: 16 }}>Pregled porudžbine</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 9, flexShrink: 0,
                  background: "rgba(0,220,255,0.1)", border: "1px solid rgba(0,220,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>{item.flag || item.emoji || "⚽"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{item.team || item.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                    {(item.qty || 1)}x{item.size ? ` · ${item.size}` : ""}{item.versionLabel ? ` · ${item.versionLabel}` : ""}
                  </div>
                  {item.personalization && item.personalization.enabled && (
                    <div style={{ color: "#39ff14", fontSize: 10, marginTop: 1 }}>
                      ✏️ {item.personalization.name || "-"} {item.personalization.number || ""}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: "#00dcff" }}>
                    {(priceNum(item.price) * (item.qty || 1)).toLocaleString("sr-RS")}
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(i)}
                      aria-label="Ukloni iz korpe"
                      title="Ukloni"
                      style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.25)",
                        color: "#ff4d6d", fontSize: 15, cursor: "pointer", lineHeight: 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >×</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalQty >= 4 && (
            <div style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#39ff14", fontWeight: 700, marginBottom: 14 }}>
              🎁 Dobijaš Mystery Dres GRATIS!
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Ukupno:</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#fff" }}>{total.toLocaleString("sr-RS")} RSD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
