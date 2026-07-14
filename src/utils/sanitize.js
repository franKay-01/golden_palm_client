import DOMPurify from 'dompurify';

// The only tags the API allows in description HTML fragments (change request #7).
// We sanitize again on render as defense in depth.
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li', 'span', 'h3', 'h4', 'a'
];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

// Where uploaded assets are served from (matches the base URL used elsewhere in the app).
const API_BASE = 'https://api.goldenpalmfoods.com';

// Blog articles are richer than product descriptions: they may embed images.
const ARTICLE_TAGS = [...ALLOWED_TAGS, 'img', 'figure', 'figcaption', 'blockquote', 'h2'];
const ARTICLE_ATTR = [...ALLOWED_ATTR, 'src', 'alt', 'title', 'width', 'height'];

/**
 * Sanitize an HTML fragment for safe rendering via dangerouslySetInnerHTML.
 * Plain-text (tagless) strings pass through unchanged, so this is backward compatible.
 */
export const sanitizeHtml = (html) =>
  DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR });

// Rewrite embedded image URLs so they resolve in every environment:
// relative "/uploads/..." and dev "http://localhost:5001/..." both become the API host.
const normalizeImg = (node) => {
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src') || '';
    if (src.startsWith('/')) {
      node.setAttribute('src', API_BASE + src);
    } else {
      const local = src.match(/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/.*)$/i);
      if (local) node.setAttribute('src', API_BASE + local[1]);
    }
    node.setAttribute('loading', 'lazy');
  }
};

/**
 * Sanitize a rich blog article. Same safety guarantees as sanitizeHtml, but also
 * permits images (and a few structural tags) and normalizes image URLs to the API host.
 */
export const sanitizeArticle = (html) => {
  DOMPurify.addHook('afterSanitizeAttributes', normalizeImg);
  const clean = DOMPurify.sanitize(html || '', { ALLOWED_TAGS: ARTICLE_TAGS, ALLOWED_ATTR: ARTICLE_ATTR });
  DOMPurify.removeHook('afterSanitizeAttributes');
  return clean;
};

/**
 * Strip all HTML tags, returning plain text. Use anywhere the description is shown
 * as plain text (cards, tiles, previews, truncated blurbs, meta/OG/SEO tags) and
 * before truncating so a tag is never cut in half. No-op on tagless strings.
 */
export const toPlainText = (html) =>
  DOMPurify.sanitize(html || '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
