// Product catalog for World Cup 2026 collection.
// Each product follows the schema:
// { id, slug, team, teamId, flag, version, type, price, images, description, seoTitle, seoDescription, sizes, colors, conf }
//
// Images point to /jerseys/<country>/<file>. If the files don't exist yet,
// the <ProductImage> component shows a premium SVG fallback automatically.
// Drop real photos into public/jerseys/<country>/ and they appear with no code changes.

import { WC_TEAMS, SIZES } from "./teams.js";

export const FAN_PRICE = 4200;
export const PLAYER_PRICE = 4500;

// Which teams actually have a distinct away kit in our catalog (all do here).
// type: "home" | "away"  ·  version: "fan" | "player"

const VERSION_LABEL = { fan: "Fan Version", player: "Player Version" };
const TYPE_LABEL_SR = { home: "Domaći", away: "Gostujući" };

function imagePaths(teamId, type) {
  // 3 image slots per kit: front, back, detail.
  const base = `/jerseys/${teamId}`;
  return [
    `${base}/${type}-1.jpg`,
    `${base}/${type}-2.jpg`,
    `${base}/${type}-3.jpg`,
  ];
}

function buildSeo(team, typeSr, versionLabel) {
  const seoTitle = `${team.name} Dres 2026 ${typeSr} ${versionLabel} | Kupi Online — DresZaKes`;
  const seoDescription =
    `Kupi ${team.name} ${typeSr.toLowerCase()} dres za Svetsko prvenstvo 2026 (${versionLabel}). ` +
    `Vrhunski kvalitet, brza dostava širom Srbije, plaćanje pouzećem. Besplatna dostava na sve porudžbine.`;
  return { seoTitle, seoDescription: seoDescription.slice(0, 160) };
}

export const PRODUCTS = (() => {
  const list = [];
  WC_TEAMS.forEach((team) => {
    ["home", "away"].forEach((type) => {
      const typeSr = TYPE_LABEL_SR[type];
      const baseDesc = type === "home" ? team.descHome : team.descAway;
      ["fan", "player"].forEach((version) => {
        const versionLabel = VERSION_LABEL[version];
        const price = version === "fan" ? FAN_PRICE : PLAYER_PRICE;
        const slug = `${team.id}-${type}-${version}`;
        const { seoTitle, seoDescription } = buildSeo(team, typeSr, versionLabel);

        const versionSentence =
          version === "player"
            ? " Player verzija donosi atletski slim kroj i premium lagani materijal identičan onome koji nose profesionalci na terenu."
            : " Fan verzija nudi udoban regularni kroj i izdržljiv materijal — savršen za navijanje i svakodnevno nošenje.";

        list.push({
          id: slug,
          slug,
          team: team.name,
          teamId: team.id,
          flag: team.flag,
          conf: team.conf,
          version,
          versionLabel,
          type, // home | away
          typeLabel: typeSr,
          price,
          images: imagePaths(team.id, type),
          colors: team[type],
          title: `${team.name} ${typeSr} Dres 2026 — ${versionLabel}`,
          description: baseDesc + versionSentence,
          seoTitle,
          seoDescription,
          sizes: SIZES,
        });
      });
    });
  });
  return list;
})();

export const PRODUCTS_BY_SLUG = PRODUCTS.reduce((acc, p) => {
  acc[p.slug] = p;
  return acc;
}, {});

// Related products: same team (other kits/versions) first, then same confederation.
export function getRelated(slug, limit = 4) {
  const p = PRODUCTS_BY_SLUG[slug];
  if (!p) return [];
  const sameTeam = PRODUCTS.filter((x) => x.teamId === p.teamId && x.slug !== slug);
  const sameConf = PRODUCTS.filter(
    (x) => x.conf === p.conf && x.teamId !== p.teamId
  );
  const seen = new Set();
  const out = [];
  [...sameTeam, ...sameConf].forEach((x) => {
    if (out.length >= limit || seen.has(x.slug)) return;
    seen.add(x.slug);
    out.push(x);
  });
  return out.slice(0, limit);
}

export { SIZES };
