import { useState, useEffect, useMemo, useRef } from "react";
import { PRODUCTS } from "../products.js";

// Probe a single image URL. Resolves true if it loads, false on error.
// A short timeout treats hanging requests as "missing".
function probeImage(src, timeout = 8000) {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = (ok) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    const t = setTimeout(() => done(false), timeout);
    img.onload = () => {
      clearTimeout(t);
      // Some servers return a 1x1 placeholder; treat tiny images as missing.
      done(img.naturalWidth > 2 && img.naturalHeight > 2);
    };
    img.onerror = () => {
      clearTimeout(t);
      done(false);
    };
    img.src = src;
  });
}

// Probe a list of URLs with limited concurrency.
async function probeAll(items, onProgress, concurrency = 6) {
  const results = {};
  let index = 0;
  let completed = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      const { key, src } = items[i];
      results[key] = await probeImage(src);
      completed++;
      onProgress(completed, items.length);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

export default function CoverageDashboard() {
  const [status, setStatus] = useState({}); // slug -> { ready: bool, found: number, total: number }
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [filter, setFilter] = useState("all"); // all | ready | missing
  const cancelled = useRef(false);

  const runScan = async () => {
    cancelled.current = false;
    setScanning(true);
    setStatus({});
    // Build a flat probe list: every image of every product.
    const items = [];
    PRODUCTS.forEach((p) => {
      p.images.forEach((src, idx) => {
        items.push({ key: `${p.slug}::${idx}`, src, slug: p.slug });
      });
    });
    setProgress({ done: 0, total: items.length });

    const raw = await probeAll(items, (done, total) => {
      if (!cancelled.current) setProgress({ done, total });
    });

    if (cancelled.current) return;

    // Aggregate per product
    const agg = {};
    PRODUCTS.forEach((p) => {
      const total = p.images.length;
      let found = 0;
      p.images.forEach((_, idx) => {
        if (raw[`${p.slug}::${idx}`]) found++;
      });
      agg[p.slug] = { found, total, ready: found > 0 };
    });
    setStatus(agg);
    setScanning(false);
  };

  useEffect(() => {
    cancelled.current = false;
    const id = setTimeout(() => runScan(), 0);
    return () => {
      cancelled.current = true;
      clearTimeout(id);
    };
  }, []);

  const stats = useMemo(() => {
    const slugs = Object.keys(status);
    const ready = slugs.filter((s) => status[s].ready).length;
    const total = PRODUCTS.length;
    const pct = total ? Math.round((ready / total) * 100) : 0;
    // image-level coverage
    let imgFound = 0;
    let imgTotal = 0;
    slugs.forEach((s) => {
      imgFound += status[s].found;
      imgTotal += status[s].total;
    });
    return { ready, missing: total - ready, total, pct, imgFound, imgTotal };
  }, [status]);

  const visible = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const st = status[p.slug];
      if (!st) return true;
      if (filter === "ready") return st.ready;
      if (filter === "missing") return !st.ready;
      return true;
    });
  }, [status, filter]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 1.5rem 60px", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
        <a href="#/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Početna</a> / <span style={{ color: "#00dcff" }}>Image Coverage</span>
      </div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem,5vw,3.4rem)", letterSpacing: 1, marginBottom: 8 }}>
        IMAGE COVERAGE DASHBOARD
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 28, maxWidth: 640 }}>
        Automatski proverava da li postoje slike za svih {PRODUCTS.length} proizvoda. Proba učitavanje svake slike iz <code style={{ color: "#00dcff" }}>/jerseys/&lt;država&gt;/</code>. Dodaj prave fotografije i ponovo pokreni skeniranje.
      </p>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <SummaryCard label="Pokrivenost" value={`${stats.pct}%`} accent="#00dcff" big />
        <SummaryCard label="Spremni proizvodi" value={`${stats.ready} / ${stats.total}`} accent="#39ff14" />
        <SummaryCard label="Nedostaju slike" value={stats.missing} accent="#ff4d6d" />
        <SummaryCard label="Slike pronađene" value={`${stats.imgFound} / ${stats.imgTotal}`} accent="#a855f7" />
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 10, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${stats.pct}%`,
            background: "linear-gradient(90deg, #00dcff, #39ff14)",
            transition: "width 0.4s",
          }} />
        </div>
        {scanning && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
            Skeniranje slika… {progress.done} / {progress.total}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>Svi ({stats.total})</Chip>
        <Chip active={filter === "ready"} onClick={() => setFilter("ready")}>✅ Spremni ({stats.ready})</Chip>
        <Chip active={filter === "missing"} onClick={() => setFilter("missing")}>❌ Nedostaju ({stats.missing})</Chip>
        <button
          onClick={runScan}
          disabled={scanning}
          style={{
            marginLeft: "auto",
            background: scanning ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #00dcff, #0099cc)",
            color: scanning ? "rgba(255,255,255,0.5)" : "#000",
            border: "none", borderRadius: 10, padding: "9px 18px",
            fontWeight: 700, fontSize: 13, cursor: scanning ? "default" : "pointer",
          }}
        >
          {scanning ? "Skeniranje…" : "↻ Ponovo skeniraj"}
        </button>
      </div>

      {/* Table */}
      <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 0.8fr 0.9fr 0.7fr", gap: 0, padding: "12px 16px", background: "rgba(255,255,255,0.04)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>
          <div>Proizvod</div>
          <div>Tip</div>
          <div>Verzija</div>
          <div>Slike</div>
          <div style={{ textAlign: "right" }}>Status</div>
        </div>
        <div style={{ maxHeight: 540, overflowY: "auto" }}>
          {visible.map((p, i) => {
            const st = status[p.slug];
            const ready = st?.ready;
            return (
              <div key={p.slug} style={{
                display: "grid", gridTemplateColumns: "1.6fr 0.8fr 0.8fr 0.9fr 0.7fr",
                gap: 0, padding: "11px 16px", alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent",
                fontSize: 13,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{p.flag}</span>
                  <a href={`#/world-cup/${p.slug}`} style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>{p.team}</a>
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)" }}>{p.typeLabel}</div>
                <div style={{ color: "rgba(255,255,255,0.6)" }}>{p.version === "player" ? "Player" : "Fan"}</div>
                <div style={{ color: "rgba(255,255,255,0.6)" }}>
                  {st ? `${st.found}/${st.total}` : "…"}
                </div>
                <div style={{ textAlign: "right" }}>
                  {!st ? (
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>…</span>
                  ) : ready ? (
                    <span style={{ color: "#39ff14", fontWeight: 700 }}>✅ Ready</span>
                  ) : (
                    <span style={{ color: "#ff4d6d", fontWeight: 700 }}>❌ Missing</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent, big }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent}22`,
      borderRadius: 14, padding: "18px 20px",
    }}>
      <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: big ? 44 : 30, color: accent, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "linear-gradient(135deg, #00dcff, #0099cc)" : "rgba(255,255,255,0.05)",
      color: active ? "#000" : "rgba(255,255,255,0.65)",
      border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
      borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
    }}>{children}</button>
  );
}
