export const API_HOST = 'https://api.goldenpalmfoods.com';

// Build a safe image URL from an API `img_url`:
//  - pass through already-absolute URLs (http/https)
//  - prefix relative paths with the API host (adding the missing leading slash)
//  - encode so spaces/special characters don't break the request. Mobile Safari
//    and WebViews reject unencoded URLs that desktop Chrome tolerates, which shows
//    up as a broken-image icon.
// Returns null when there is no img_url so callers can fall back to a placeholder.
export const apiImageSrc = (u) => {
  if (!u) return null;
  const abs = /^https?:\/\//i.test(u) ? u : `${API_HOST}${u.startsWith('/') ? '' : '/'}${u}`;
  try {
    return encodeURI(abs);
  } catch {
    return abs;
  }
};
