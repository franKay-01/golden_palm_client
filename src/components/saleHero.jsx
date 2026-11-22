import React from 'react';
import { Link } from 'react-router-dom';
import SpiceRings from '../assets/images/asset_17.webp';
import Asset11 from '../assets/images/asset_11.webp';
import BundleImg from '../assets/images/golden_palm_bundle.webp';
import ChilliImg from '../assets/images/chilli.webp';

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

// Black Friday style hero, shown on the home page while a sale event is active
// (GET /sale-events/active -> is_active). Copy comes from the event.
export default function SaleHero({ event }) {
  const pct = Math.round(parseFloat(event.discount_percentage) || 0);
  const all = event.scope === 'all';
  const endDate = formatDate(event.ends_at);
  const startDate = formatDate(event.starts_at);
  const dateRange = startDate && endDate ? `${startDate} \u2013 ${endDate}` : endDate;
  const headline = `Get up to ${pct}% off your favorite West African pantry staples.`;
  const support = endDate ? `Prices already marked down. Sale ends ${endDate}.` : 'Prices already marked down while the sale lasts.';
  const [first, ...rest] = (event.name || 'Sale').split(' ');

  return (
    <section
      aria-label={event.name}
      className="relative overflow-hidden text-center px-5 pt-10 pb-20 md:pt-20 md:pb-20 xl:pb-36 xl:min-h-[52rem] flex flex-col items-center"
    >
      {/* Desktop decorations stay inside a centered max-width frame on very wide screens */}
      <div className="hidden xl:block absolute inset-0 mx-auto max-w-[90rem]">
      <div className="hidden xl:block absolute motion-safe:animate-hero-left [animation-delay:150ms] left-8 top-[7rem] w-[20rem] h-[28rem] -rotate-[5deg] rounded-2xl overflow-hidden shadow-2xl">
        <img src={ChilliImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="hidden xl:block absolute motion-safe:animate-hero-right [animation-delay:250ms] right-8 top-[9rem] w-[25rem] h-[23rem] rotate-[4deg] rounded-2xl overflow-hidden shadow-2xl">
        <img src={BundleImg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="hidden xl:flex absolute motion-safe:animate-hero-pop [animation-delay:700ms] right-[20rem] top-[5rem] w-32 h-32 rounded-full bg-gp-yellow text-[#1F270C] flex-col items-center justify-center gap-1 -rotate-[10deg] shadow-xl pointer-events-none">
        <span className="font-caslon text-5xl leading-none">{pct}%</span>
      </div>
      <img src={Asset11} alt="" className="absolute motion-safe:animate-hero-pop [animation-delay:600ms] left-[20rem] top-[33rem] w-44 pointer-events-none" />
      <img src={SpiceRings} alt="" className="hidden xl:block absolute left-[22rem] top-8 w-28 pointer-events-none" />
      </div>
      <img src={SpiceRings} alt="" className="xl:hidden absolute left-2 top-4 w-16 pointer-events-none" />

      <div className="relative z-10 motion-safe:animate-hero-up [animation-delay:100ms] flex flex-col items-center gap-4 md:gap-7 max-w-lg">
        {dateRange && (
          <span className="font-canaro-semibold text-sm md:text-base tracking-wide text-gp-yellow">{dateRange}</span>
        )}
        <h1 className="font-caslon text-gp-yellow text-[4.5rem] md:text-[8rem] leading-[0.9] tracking-tight">
          {first}{rest.length > 0 && <><br />{rest.join(' ')}</>}
        </h1>
        <h2 className="font-caslon text-white text-2xl md:text-4xl leading-tight mt-2 md:mt-3">{headline}</h2>
        <p className="font-canaro-book text-[#DCD6C2] text-sm md:text-lg">{support}</p>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-8 mt-3 md:mt-4 self-stretch md:self-auto">
          <Link to="/shop?tp=all" className="bg-gp-yellow text-[#1F270C] font-canaro-semibold text-base md:text-lg px-8 py-4 rounded-lg shadow-md hover:brightness-95 transition">
            Shop the Sale
          </Link>
          <Link to="/bundles?bt=all" className="text-white font-canaro-semibold text-base md:text-lg underline underline-offset-[7px] decoration-2 py-3">
            Shop Bundles →
          </Link>
        </div>
      </div>

      {/* Mobile photos + stamp */}
      <div className="xl:hidden relative motion-safe:animate-hero-up [animation-delay:300ms] self-stretch w-full max-w-md mx-auto h-60 mt-8">
        <div className="absolute left-1 top-3 w-[13rem] h-56 -rotate-[5deg] rounded-xl overflow-hidden shadow-xl">
          <img src={ChilliImg} alt="" className="w-full h-full object-cover" />
        </div>
        <img src={Asset11} alt="" className="absolute left-[7rem] -bottom-4 w-20 pointer-events-none" />
        <div className="absolute right-1 top-6 w-[12.5rem] h-[12.5rem] rotate-[4deg] rounded-xl overflow-hidden shadow-xl">
          <img src={BundleImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute left-[9.5rem] -top-2 w-20 h-20 rounded-full bg-gp-yellow text-[#1F270C] flex flex-col items-center justify-center -rotate-[10deg] shadow-lg pointer-events-none">
          <span className="font-caslon text-3xl leading-none">{pct}%</span>
          <span className="font-canaro-semibold text-[0.5rem] tracking-widest uppercase">off</span>
        </div>
      </div>
    </section>
  );
}
