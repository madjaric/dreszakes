// Premium scrolling announcement bar (marquee / ticker).
//
// - Nije sticky, nije fixed — običan blok koji skroluje zajedno sa stranicom.
// - Beskonačna petlja bez seckanja: sadržaj je dupliran, animacija pomera
//   prvu kopiju za tačno -50% širine pa se vraća na 0 → savršen seamless loop.
// - Pauza na hover (desktop). Konstantna brzina. Bez spoljnih biblioteka.
// - Reusable: prosledi `items` (niz stringova) i opciono `speed` (sekunde po ciklusu).

const DEFAULT_ITEMS = [
  "🚚 Besplatna dostava na sve porudžbine",
  "📸 Šaljemo uživo slike dresa na WhatsApp/Instagram",
  "🎁 Kupi 4 dresa → Mystery Dres GRATIS",
  "⚽ Svi timovi Svetskog prvenstva 2026",
];

export default function AnnouncementBar({ items = DEFAULT_ITEMS, speed = 28 }) {
  // Jedan "lanac" poruka, razdvojen tačkicama. Renderujemo ga dvaput za loop.
  const Chain = ({ ariaHidden }) => (
    <div className="ab-chain" aria-hidden={ariaHidden}>
      {items.map((text, i) => (
        <span className="ab-item" key={i}>
          <span className="ab-text">{text}</span>
          <span className="ab-dot" aria-hidden="true">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ab-root" role="region" aria-label="Obaveštenja">
      <div className="ab-track" style={{ animationDuration: `${speed}s` }}>
        <Chain ariaHidden={false} />
        <Chain ariaHidden={true} />
      </div>

      <style>{`
        .ab-root {
          width: 100%;
          height: 44px;
          overflow: hidden;
          display: flex;
          align-items: center;
          background: linear-gradient(180deg, rgba(12,17,26,0.96), rgba(8,12,20,0.96));
          border-top: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative;
          /* Suptilan fade na levoj i desnoj ivici da poruke "ulaze/izlaze" meko */
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
                  mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
        }
        .ab-track {
          display: flex;
          flex-shrink: 0;
          width: max-content;
          will-change: transform;
          animation-name: ab-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .ab-root:hover .ab-track { animation-play-state: paused; }

        .ab-chain {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .ab-item {
          display: inline-flex;
          align-items: center;
        }
        .ab-text {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: rgba(255,255,255,0.78);
          white-space: nowrap;
          padding: 0 4px;
        }
        .ab-dot {
          color: #00dcff;
          font-size: 14px;
          margin: 0 26px;
          opacity: 0.7;
          line-height: 1;
        }

        /* Pomera za tačno polovinu (jedan ceo lanac) → seamless beskonačno */
        @keyframes ab-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @media (max-width: 640px) {
          .ab-root { height: 42px; }
          .ab-text { font-size: 12px; }
          .ab-dot { margin: 0 18px; }
        }

        /* Poštuj korisnike koji ne žele animacije */
        @media (prefers-reduced-motion: reduce) {
          .ab-track { animation: none; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
