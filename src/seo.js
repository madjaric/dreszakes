// Centralni SEO helper — dinamički postavlja <title>, meta description,
// canonical, Open Graph i JSON-LD strukturirane podatke po ruti.
// Ne dira UI ni funkcionalnost; radi samo sa <head>.

const SITE = "https://www.dreszakes.shop";
const SITE_NAME = "Dres za Keš";
const OG_IMAGE = `${SITE}/images/logo.png`;

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Upravlja jednim <script type="application/ld+json" data-seo="route">
function setJsonLd(obj) {
  const ID = "route-jsonld";
  let el = document.getElementById(ID);
  if (!obj) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

// Glavni API: pozovi sa objektom { title, description, path, image, jsonLd }
export function applySeo({ title, description, path = "/", image = OG_IMAGE, jsonLd = null }) {
  const url = `${SITE}${path}`;
  if (title) document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image);
  setMeta("property", "og:type", path.includes("/world-cup/") ? "product" : "website");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", image);
  setCanonical(url);
  setJsonLd(jsonLd);
}

// --- JSON-LD graditelji ---

export function breadcrumbLd(items) {
  // items: [{ name, path }]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
}

export function productLd(product, path) {
  const priceNum =
    typeof product.price === "number"
      ? product.price
      : parseInt(String(product.price).replace(/\./g, ""), 10) || 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title || `${product.team} dres 2026`,
    description: product.seoDescription || product.description,
    image: product.images && product.images[0] ? `${SITE}${product.images[0]}` : OG_IMAGE,
    brand: { "@type": "Brand", name: product.team },
    category: "Fudbalski dresovi",
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `${SITE}${path}`,
      priceCurrency: "RSD",
      price: priceNum,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

export function collectionLd(name, description, path) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE}${path}`,
    isPartOf: { "@id": `${SITE}/#website` },
  };
}

export { SITE, SITE_NAME, OG_IMAGE };
