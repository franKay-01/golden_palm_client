import React from 'react';

// Shared flag so we never reload more than once per failed-chunk sequence
// (prevents an infinite reload loop if a chunk is genuinely unreachable).
export const RELOAD_KEY = 'app_chunk_reloaded';

const getFlag = () => {
  try { return window.sessionStorage.getItem(RELOAD_KEY) === 'true'; } catch { return false; }
};
const setFlag = (v) => {
  try { v ? window.sessionStorage.setItem(RELOAD_KEY, 'true') : window.sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ }
};

/**
 * Drop-in replacement for React.lazy that survives a redeploy.
 * If a route's chunk fails to load (its hashed file was replaced by a new
 * deploy), force ONE full reload to fetch the fresh index.html + new chunks,
 * instead of leaving a blank page. If it still fails after the reload, the
 * error propagates to the ErrorBoundary.
 */
export default function lazyWithRetry(importFn) {
  return React.lazy(async () => {
    try {
      const module = await importFn();
      setFlag(false); // healthy load — clear any prior reload flag
      return module;
    } catch (error) {
      if (!getFlag()) {
        setFlag(true);
        window.location.reload();
        // Never resolve, so React shows the Suspense fallback until the reload happens.
        return new Promise(() => {});
      }
      throw error; // already retried once this session — let the ErrorBoundary handle it
    }
  });
}
