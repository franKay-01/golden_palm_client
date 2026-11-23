import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import useFunctions from '../utils/functions';

// The same announcement is requested by every page's header; share one result for a few minutes
// so navigating around the site doesn't refetch it each time.
const CACHE_MS = 5 * 60 * 1000;
let cache = { at: 0, promise: null };

const DISMISS_KEY = 'gp_announcement_dismissed';
const keyOf = (a) => `${a.name}|${a.ends_at || ''}`;

const readDismissed = () => {
  try { return sessionStorage.getItem(DISMISS_KEY); } catch { return null; }
};
const writeDismissed = (value) => {
  try { sessionStorage.setItem(DISMISS_KEY, value); } catch { /* storage unavailable */ }
};

// "Nov 25" - UTC so every visitor sees the same date
const formatDate = (iso) => {
  const d = new Date(iso);
  if (!iso || isNaN(d)) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};
const dayKey = (ms) => new Date(ms).toISOString().slice(0, 10);

// The date phrase depends on where "now" falls: before it starts, while it runs, or on its last day.
// Returns null when there is nothing to say (no dates at all).
const datePhrase = (a, now) => {
  const start = a.starts_at ? new Date(a.starts_at).getTime() : null;
  const end = a.ends_at ? new Date(a.ends_at).getTime() : null;
  const startLabel = formatDate(a.starts_at);
  const endLabel = formatDate(a.ends_at);
  if (start && !isNaN(start) && start > now && startLabel) return `Starts ${startLabel}`;
  if (end && !isNaN(end) && dayKey(end) === dayKey(now)) return 'Ends today';
  if (startLabel && endLabel) return `${startLabel} \u2013 ${endLabel}`;
  if (endLabel) return `Ends ${endLabel}`;
  return null;
};

const Divider = ({ className = '' }) => <span className={`w-px bg-[#FFF7EB]/30 shrink-0 ${className}`} />;

// Slim, dismissible bar above the header. Content comes from GET /common/announcement/active.
export default function AnnouncementBar() {
  const { getActiveAnnouncement } = useFunctions();
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    if (!cache.promise || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), promise: getActiveAnnouncement() };
    }
    cache.promise.then((res) => {
      if (cancelled || !res.is_active) return;
      setAnnouncement(res.announcement);
      setDismissed(readDismissed() === keyOf(res.announcement));
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-evaluate once a minute so the phrase flips at the start, on the last day, and at the end
  useEffect(() => {
    if (!announcement?.starts_at && !announcement?.ends_at) return undefined;
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, [announcement]);

  if (!announcement || dismissed) return null;

  const remaining = announcement.ends_at ? new Date(announcement.ends_at).getTime() - now : null;
  if (remaining !== null && remaining <= 0) return null;
  const dates = datePhrase(announcement, now);

  const dismiss = () => {
    writeDismissed(keyOf(announcement));
    setDismissed(true);
  };

  return (
    <div role="region" aria-label="Announcement" className="relative bg-black text-[#FFF7EB] h-10 md:h-11 flex items-center justify-center gap-2.5 md:gap-4 pl-3 pr-11 md:px-14 text-[0.8125rem] md:text-sm font-canaro-semibold whitespace-nowrap">
      <span className="hidden md:inline text-xs tracking-[0.16em] uppercase text-gp-yellow font-canaro-semibold">{announcement.name}</span>
      <Divider className="hidden md:block h-4" />
      <span className="truncate min-w-0">{announcement.offer_line}</span>
      {dates && (
        <>
          <Divider className="h-3.5 md:h-4" />
          <span className="shrink-0 text-gp-yellow">{dates}</span>
        </>
      )}
      <Divider className="h-3.5 md:h-4" />
      <Link to="/shop?tp=all" className="shrink-0 text-gp-yellow underline underline-offset-4 hover:text-[#FFF7EB]">Shop now</Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-0 md:right-2 top-0 md:top-1 w-11 md:w-9 h-10 md:h-9 flex items-center justify-center rounded-md text-[#FFF7EB] hover:bg-[#FFF7EB]/10"
      >
        <X size={18} />
      </button>
    </div>
  );
}
