/* eslint-disable */
/**
 * Generates public/sitemap.xml with core routes + dynamic product/blog URLs
 * pulled from the API. Run before build:  node scripts/generate-sitemap.js
 * (wired as a `presitemap`/`build` step — see package.json).
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://goldenpalmfoods.com';
const API = process.env.API_URL || 'https://api.goldenpalmfoods.com';

const STATIC = [
  ['/', 'weekly', '1.0'],
  ['/shop?tp=all', 'daily', '0.9'],
  ['/bundles?bt=all', 'weekly', '0.8'],
  ['/wholesale', 'monthly', '0.8'],
  ['/recipes', 'weekly', '0.7'],
  ['/blogs', 'weekly', '0.7'],
  ['/reviews', 'weekly', '0.6'],
  ['/our-story', 'monthly', '0.6'],
  ['/cooking-class', 'monthly', '0.5'],
  ['/faqs', 'monthly', '0.4'],
  ['/wholesale-policy', 'yearly', '0.3'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms-of-service', 'yearly', '0.3'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urlTag = (loc, freq, pri) =>
  `  <url><loc>${SITE}${esc(loc)}</loc><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`;

async function getJson(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    console.warn(`sitemap: could not fetch ${url} — ${e.message}`);
    return null;
  }
}

(async () => {
  const urls = STATIC.map(([l, f, p]) => urlTag(l, f, p));

  // Products (shareable /product-detail/:sku)
  const products = await getJson(`${API}/common/products-and-bundles`);
  (products?.products || []).forEach((p) => {
    if (p.sku) urls.push(urlTag(`/product-detail/${p.sku}`, 'weekly', '0.8'));
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') +
    `\n</urlset>\n`;

  const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(out, xml);
  console.log(`sitemap: wrote ${urls.length} URLs to ${out}`);
})();
