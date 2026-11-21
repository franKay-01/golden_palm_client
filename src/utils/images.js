// Responsive images for files served from the API's /uploads folder.
//
// For /uploads/products/abc.jpg the API also serves abc-400w.webp, abc-800w.webp and abc-1200w.webp
// (made on upload, or by scripts/optimize_images.js for older images). Keep WIDTHS in sync with the API
// (utils/imageVariants.js, VARIANT_WIDTHS).
// On localhost the images come from the local API too (it builds the resized copies on demand).
const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = isLocal ? 'http://localhost:5001' : 'https://api.goldenpalmfoods.com';
const WIDTHS = [400, 800, 1200];
const VARIANT_PATH = /^(\/uploads\/(?:products|bundles|recipes|cooking_classes)\/[A-Za-z0-9._-]+)\.(?:jpe?g|png|webp)$/i;

// Absolute URL of an image path returned by the API ('' when there is no path).
export const apiImageUrl = (path) => (path ? `${API_BASE}${path}` : '');

// A browser does not fall back to `src` when a srcset file fails to load. If a resized copy is missing
// (for example the API has not been updated yet), drop the srcset and load the original instead.
const fallbackToOriginal = (src) => (event) => {
  const img = event.currentTarget;
  if (img.dataset.srcsetFallback) return;
  img.dataset.srcsetFallback = '1';
  img.removeAttribute('sizes');
  img.srcset = '';
  img.src = src;
};

// Props for an <img>: <img {...apiImageProps(product.img_url, '(min-width: 768px) 33vw, 100vw')} alt="..." />
// `sizes` tells the browser how wide the image is drawn, so it can pick the smallest file that looks sharp.
export function apiImageProps(path, sizes = '100vw') {
  const src = apiImageUrl(path);
  const match = typeof path === 'string' ? VARIANT_PATH.exec(path) : null;
  if (!match) return { src };
  const srcSet = WIDTHS.map((w) => `${API_BASE}${match[1]}-${w}w.webp ${w}w`).join(', ');
  return { src, srcSet, sizes, onError: fallbackToOriginal(src) };
}
