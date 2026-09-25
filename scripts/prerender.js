/* eslint-disable */
/**
 * Prerender the built SPA to static HTML so crawlers and social scrapers (which
 * don't run JS) get per-page <title>/description/OG + JSON-LD instead of the
 * generic index.html.
 *
 * Runs as `postbuild`. It serves the build/ folder locally, drives a real Chrome
 * (via puppeteer-core) to each route, waits for the API + react-helmet to settle,
 * then writes the rendered HTML back into build/<route>/index.html.
 *
 * Chrome resolution (first that exists wins):
 *   1. $PUPPETEER_EXECUTABLE_PATH   (set this on your Linux build/deploy server)
 *   2. common macOS / Linux install paths
 *
 * Product-detail pages are reached via onClick, not <a> links, so they can't be
 * crawled — every SKU is listed explicitly (pulled from the API, like the sitemap).
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const API = process.env.API_URL || 'https://api.goldenpalmfoods.com';
const PORT = 45678;

const STATIC_ROUTES = [
  '/',
  '/shop',
  '/bundle',
  '/bundles',
  '/wholesale',
  '/wholesale-policy',
  '/recipes',
  '/blogs',
  '/reviews',
  '/our-story',
  '/cooking-class',
  '/faqs',
  '/privacy',
  '/terms-of-service',
];

const CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
].filter(Boolean);

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
  if (!found) {
    throw new Error(
      'No Chrome/Chromium found. Install Chrome, or set PUPPETEER_EXECUTABLE_PATH to its binary.'
    );
  }
  return found;
}

async function getProductRoutes() {
  try {
    const res = await fetch(`${API}/common/products-and-bundles`);
    const data = await res.json();
    return (data && data.products ? data.products : [])
      .filter((p) => p.sku)
      .map((p) => `/product-detail/${p.sku}`);
  } catch (e) {
    console.warn(`prerender: could not fetch products (${e.message}); static routes only`);
    return [];
  }
}

// Serve build/ with SPA fallback: real files as-is, everything else -> index.html.
function startServer() {
  const indexHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'));
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(BUILD_DIR, urlPath);
    if (urlPath !== '/' && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.end(indexHtml);
    }
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

function outFileFor(route) {
  if (route === '/') return path.join(BUILD_DIR, 'index.html');
  return path.join(BUILD_DIR, route, 'index.html');
}

async function snapshot(browser, base, route) {
  const page = await browser.newPage();
  // Signal prerender so public/index.html skips MailerLite (keeps Chrome from hanging).
  await page.evaluateOnNewDocument(() => { window.__PRERENDER__ = true; });
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 45000 });
  // Give react-helmet's final commit a beat after the last network response.
  await new Promise((r) => setTimeout(r, 500));

  // react-helmet-async appends its own tags (marked data-rh) but leaves the
  // baked-in defaults from public/index.html in place, so each managed meta
  // ends up duplicated. Drop the static copy wherever Helmet set its own; keep
  // static tags Helmet didn't touch as fallbacks.
  await page.evaluate(() => {
    const managed = new Set();
    document.head.querySelectorAll('meta[data-rh="true"]').forEach((el) => {
      const key = el.getAttribute('property') || el.getAttribute('name');
      if (key) managed.add(key.toLowerCase());
    });
    document.head.querySelectorAll('meta').forEach((el) => {
      if (el.getAttribute('data-rh') === 'true') return;
      const key = el.getAttribute('property') || el.getAttribute('name');
      if (key && managed.has(key.toLowerCase())) el.remove();
    });
  });

  const html = '<!doctype html>' + (await page.content()).replace(/^<!doctype html>/i, '');
  const out = outFileFor(route);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  await page.close();
}

(async () => {
  if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
    console.error('prerender: build/index.html not found — run `react-scripts build` first.');
    process.exit(1);
  }

  const executablePath = findChrome();
  const routes = [...STATIC_ROUTES, ...(await getProductRoutes())];
  console.log(`prerender: ${routes.length} routes via ${executablePath}`);

  const server = await startServer();
  const base = `http://127.0.0.1:${PORT}`;
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // The SPA calls the API on a different origin (api.goldenpalmfoods.com),
      // and the snapshot runs from 127.0.0.1, which isn't an allowed CORS origin.
      // Disabling web security lets those fetches through so product/blog pages
      // render their real data (and thus real SEO). Build-time only — never a
      // user-facing browser.
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  const failed = [];
  for (const route of routes) {
    try {
      await snapshot(browser, base, route);
      process.stdout.write(`  ✓ ${route}\n`);
    } catch (e) {
      failed.push(route);
      process.stdout.write(`  ✗ ${route} — ${e.message}\n`);
    }
  }

  await browser.close();
  server.close();

  console.log(`prerender: ${routes.length - failed.length}/${routes.length} routes written`);
  if (failed.length === routes.length) {
    console.error('prerender: every route failed');
    process.exit(1);
  }
})();
