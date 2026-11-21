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

// "15d 4h", "5h 20m", "12m"
const formatRemaining = (ms) => {
  const mins = Math.floor(ms / 60000);
  const d = Math.floor(mins / 1440);
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${Math.max(m, 1)}m`;
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

  useEffect(() => {
    if (!announcement?.ends_at) return undefined;
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, [announcement]);

  if (!announcement || dismissed) return null;

  const remaining = announcement.ends_at ? new Date(announcement.ends_at).getTime() - now : null;
  if (remaining !== null && remaining <= 0) return null;
  const countdown = remaining !== null ? formatRemaining(remaining) : null;

  const dismiss = () => {
    writeDismissed(keyOf(announcement));
    setDismissed(true);
  };

  return (
    <div role="region" aria-label="Announcement" className="relative bg-black text-[#FFF7EB] h-10 md:h-11 flex items-center justify-center gap-2.5 md:gap-4 pl-3 pr-11 md:px-14 text-[0.8125rem] md:text-sm font-canaro-semibold whitespace-nowrap">
      <span className="hidden md:inline text-xs tracking-[0.16em] uppercase text-gp-yellow font-canaro-semibold">{announcement.name}</span>
      <Divider className="hidden md:block h-4" />
      <span className="truncate min-w-0">{announcement.offer_line}</span>
      {countdown && (
        <>
          <Divider className="h-3.5 md:h-4" />
          <span className="shrink-0 tabular-nums">
            <span className="hidden md:inline text-[#D9D3C0] mr-1.5">Ends in</span>
            <span className="text-gp-yellow">{countdown}</span>
          </span>
        </>
      )}
      <Divider className="h-3.5 md:h-4" />
      <Link to="/shop" className="shrink-0 text-gp-yellow underline underline-offset-4 hover:text-[#FFF7EB]">Shop now</Link>
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
