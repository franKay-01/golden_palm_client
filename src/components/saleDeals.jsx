import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import useFunctions from '../utils/functions';
import { CartContext } from '../context/cartContext';
import { ShowToast } from './showToast';
import HeatLevelModal from './heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';
import { isOnSale, effectiveUnitPrice, amountOff } from '../utils/pricing';
import { apiImageProps } from '../utils/images';
import TomatoImg from '../assets/images/asset_4.webp';

const MAX_DEALS = 12;

// Several pages ask for the same data; share one request for a few minutes.
const CACHE_MS = 5 * 60 * 1000;
let cache = { at: 0, promise: null };

// Deals are single products or bundles (bundles carry bundle_id and product_details)
const isBundle = (p) => !!p?.bundle_id;
const dealKey = (p) => (isBundle(p) ? `b-${p.bundle_id}` : p.sku);
const dealHref = (p) => (isBundle(p) ? `/bundle-detail/${p.bundle_id}` : `/product-detail/${p.sku}`);
const dealDetail = (p) => {
  if (isBundle(p)) {
    const n = (p.product_details || []).length;
    return n ? `Bundle of ${n} ${n === 1 ? 'item' : 'items'}` : 'Bundle';
  }
  return p.weight ? `Size ${parseInt(p.weight)} ${p.weight_type}` : null;
};

const DealCard = ({ p, onAdd, className = '' }) => (
  <div className={`bg-[#FFF7EB] rounded-[10px] p-2 md:p-2.5 pb-2.5 md:pb-3 flex flex-col gap-2 min-w-0 ${className}`}>
    <Link to={dealHref(p)} className="relative block aspect-[3/2] rounded-md overflow-hidden bg-[#F3F3F1]">
      <img className="w-full h-full object-cover block" {...apiImageProps(p.img_url, '(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 248px')} alt={p.name} loading="lazy" />
      <div className="absolute top-2 left-2 flex flex-col items-start gap-[5px]">
        <Tag className="bg-gp-yellow text-[#1F270C]">Save ${amountOff(p)}</Tag>
        {p._best && <Tag className="bg-gp-light-green text-[#FFF7EB]">Best Seller</Tag>}
      </div>
    </Link>
    <div className="px-1 flex flex-col gap-1.5 flex-1">
      <Link to={dealHref(p)} title={p.name} className="font-caslon text-gp-light-green leading-[1.15] line-clamp-2 min-h-[2.3em] text-base md:text-lg">{p.name}</Link>
      <div className="flex items-baseline gap-1.5 mt-auto">
        <span className="font-canaro-semibold text-gp-light-green leading-none text-xl md:text-[1.375rem]">${parseFloat(p.sale_price).toFixed(2)}</span>
        <span className="text-[#7C786B] line-through font-canaro-semibold leading-none text-[0.8125rem] md:text-sm">${parseFloat(p.price).toFixed(2)}</span>
      </div>
      {dealDetail(p) && <span className="hidden md:block text-xs font-canaro-semibold text-[#45454D] leading-snug">{dealDetail(p)}</span>}
    </div>
    <button
      type="button"
      onClick={() => onAdd(p)}
      className="h-10 rounded-sm bg-gp-light-green hover:bg-gp-dark-green text-[#FFF7EB] uppercase tracking-wide font-canaro-semibold text-[0.8125rem] transition-colors"
    >
      Add to Cart
    </button>
  </div>
);

// "Nov 27" (UTC, so the label reads the same for every visitor)
const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

const Tag = ({ className = '', children }) => (
  <span className={`font-canaro-semibold uppercase leading-none tracking-wide text-[0.6875rem] px-2 py-1.5 rounded shadow-md ${className}`}>{children}</span>
);

// "Deals" block for the Shop and Bundles pages. Shows up only while a sale event is active and at least
// one product is actually on sale; otherwise it renders nothing and the page looks as it did before.
export default function SaleDeals({ bundlesFirst = false }) {
  const { getActiveSaleEvent, getProductsAndBundles, getBestSellers, getProductDetail } = useFunctions();
  const { addToCart, openCart } = useContext(CartContext);
  const [data, setData] = useState(null); // { event, deals }
  const [allOpen, setAllOpen] = useState(false);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [heatVariations, setHeatVariations] = useState([]);

  useEffect(() => {
    let cancelled = false;
    if (!cache.promise || Date.now() - cache.at > CACHE_MS) {
      cache = {
        at: Date.now(),
        promise: (async () => {
          const sale = await getActiveSaleEvent();
          if (!sale.is_active) return null;
          const [all, best] = await Promise.all([getProductsAndBundles(), getBestSellers(6)]);
          if (all.response_code !== '000') return null;
          const bestSkus = new Set(best.response_code === '000' ? best.products.map((p) => p.sku) : []);
          const deals = (all.products || [])
            .filter((p) => isOnSale(p) && p.is_available !== false)
            .map((p) => ({ ...p, _best: bestSkus.has(p.sku) }))
            .sort((a, b) => Number(b._best) - Number(a._best));
          // Bundles on sale appear in the "View All Deals" modal after the products
          const bundleDeals = (all.bundles || [])
            .filter((b) => isOnSale(b) && b.is_available !== false);
          return deals.length || bundleDeals.length ? { event: sale.event, deals, bundleDeals } : null;
        })()
      };
    }
    cache.promise.then((result) => { if (!cancelled) setData(result); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deals modal: Esc closes it and the page behind it doesn't scroll
  useEffect(() => {
    if (!allOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setAllOpen(false); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [allOpen]);

  if (!data) return null;
  const { event, deals, bundleDeals = [] } = data;
  // Bundles page: bundles lead (row and modal). Elsewhere the row shows products, falling back to
  // bundles only if no single product is on sale, and the modal lists products then bundles.
  const allDeals = bundlesFirst ? [...bundleDeals, ...deals] : [...deals, ...bundleDeals];
  const shown = (bundlesFirst ? allDeals : (deals.length ? deals : bundleDeals)).slice(0, MAX_DEALS);
  const pct = Math.round(parseFloat(event.discount_percentage) || 0);
  const start = formatDate(event.starts_at);
  const end = formatDate(event.ends_at);
  const dateRange = start && end ? `${start} \u2013 ${end}` : end;
  const line = event.scope === 'all' ? `${pct}% off everything while the sale lasts.` : `${pct}% off our favorites while the sale lasts.`;

  const addProduct = (product, heatLevel) => {
    if (isBundle(product)) {
      const parts = product.product_details || [];
      addToCart({
        id: product.bundle_id,
        name: product.name,
        price: effectiveUnitPrice(product),
        unit_price: effectiveUnitPrice(product),
        quantity: 1,
        img_url: product.img_url,
        type: 'bundle',
        heat_level: heatLevel,
        shipping_weight: parts.length
          ? parts.reduce((sum, item) => sum + (parseFloat(item.shipping_weight) || 0), 0)
          : (product.shipping_weight || null),
        product_details: product.product_details
      });
      openCart();
      return;
    }
    addToCart({
      id: product.sku,
      name: product.name,
      price: effectiveUnitPrice(product),
      unit_price: effectiveUnitPrice(product),
      quantity: 1,
      img_url: product.img_url,
      type: 'product',
      heat_level: heatLevel,
      shipping_weight: product.shipping_weight || null,
      product_details: null
    });
    openCart();
  };

  // Bundles list doesn't include heat variations, so pull them from each hot item's detail
  // (same approach as the bundles page)
  const resolveBundleHeatVariations = async (bundle) => {
    const hotSubs = (bundle.product_details || []).filter((s) => s.is_hot && s.sku);
    const detailed = [];
    for (const sub of hotSubs) {
      const res = await getProductDetail(sub.sku);
      if (res.response_code === '000' && res.product?.variations?.length) {
        detailed.push({ ...sub, is_hot: true, variations: res.product.variations });
      }
    }
    return getHeatVariations({ product_details: detailed });
  };

  const handleAdd = async (product) => {
    if (isBundle(product)) {
      if ((product.product_details || []).some((s) => s.is_hot)) {
        const variations = await resolveBundleHeatVariations(product);
        setHeatVariations(variations);
        setSelectedProduct(product);
        setHeatModalOpen(true);
        return;
      }
      addProduct(product, null);
      return;
    }
    if (product.is_hot) {
      setHeatVariations(getHeatVariations(product));
      setSelectedProduct(product);
      setHeatModalOpen(true);
      return;
    }
    addProduct(product, null);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedProduct) return;
    const chosen = heatVariations.find((v) => v.heat_level?.toLowerCase() === heatLevel?.toLowerCase());
    if (chosen?.is_available === false) {
      ShowToast('error', `The ${heatLevel} option is out of stock`);
      return;
    }
    addProduct(selectedProduct, heatLevel);
    setSelectedProduct(null);
  };

  return (
    <section
      aria-label={`${event.name} deals`}
      className="relative overflow-hidden bg-[#1F270C] md:rounded-xl -mx-4 md:mx-0 mt-5 mb-10 md:mb-14 pt-7 pb-5 pl-4 md:p-6 flex flex-col gap-5 md:gap-5"
    >
      <img src={TomatoImg} alt="" className="hidden md:block absolute right-[12.5rem] -top-14 w-36 opacity-90 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-2.5 md:gap-6 pr-4 md:pr-0">
        <div className="flex flex-col gap-2.5 md:gap-3">
          {dateRange && <span className="font-canaro-semibold text-sm md:text-base tracking-wide text-gp-yellow">{dateRange}</span>}
          <h2 className="font-caslon text-[#FFF7EB] text-4xl md:text-[3.25rem] leading-none tracking-tight">{event.name} Deals</h2>
          <p className="font-canaro-book text-[#DCD6C2] text-[0.9375rem] md:text-[1.0625rem] leading-snug">{line}</p>
        </div>
        <button type="button" onClick={() => setAllOpen(true)} className="hidden md:block shrink-0 text-gp-yellow font-canaro-semibold text-[1.0625rem] underline underline-offset-[7px] decoration-2">
          View All Deals →
        </button>
      </div>

      <div className="relative flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 md:scroll-px-0 pr-4 md:pr-0 pb-2 [scrollbar-width:none] md:[scrollbar-width:thin] [scrollbar-color:rgba(255,247,235,0.35)_transparent]">
        {shown.map((p) => (
          <DealCard key={dealKey(p)} p={p} onAdd={handleAdd} className="w-[15.5rem] md:w-[17rem] shrink-0 snap-start" />
        ))}
      </div>

      <button type="button" onClick={() => setAllOpen(true)} className="md:hidden relative self-start text-gp-yellow font-canaro-semibold text-base leading-[2.75rem] underline underline-offset-[6px]">
        View All Deals →
      </button>

      {allOpen && (
        <div className="fixed inset-0 z-[45] flex items-end md:items-center justify-center md:p-6" role="dialog" aria-modal="true" aria-label={`All ${event.name} deals`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setAllOpen(false)} />
          <div className="relative bg-[#1F270C] w-full max-w-6xl max-h-[92vh] md:max-h-[88vh] rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-4 md:px-8 pt-5 md:pt-7 pb-4">
              <div className="flex flex-col gap-1.5">
                {dateRange && <span className="font-canaro-semibold text-sm text-gp-yellow tracking-wide">{dateRange}</span>}
                <h2 className="font-caslon text-[#FFF7EB] text-3xl md:text-5xl leading-none tracking-tight">{event.name} Deals</h2>
                <p className="font-canaro-book text-[#DCD6C2] text-sm md:text-base">{allDeals.length} {allDeals.length === 1 ? 'item' : 'items'} on sale. {line}</p>
              </div>
              <button type="button" onClick={() => setAllOpen(false)} aria-label="Close deals" className="shrink-0 w-10 h-10 flex items-center justify-center rounded-md text-[#FFF7EB] hover:bg-[#FFF7EB]/10">
                <X size={22} />
              </button>
            </div>
            <div className="overflow-y-auto px-4 md:px-8 pb-6 md:pb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {allDeals.map((p) => (
                  <DealCard key={dealKey(p)} p={p} onAdd={(product) => { setAllOpen(false); handleAdd(product); }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <HeatLevelModal
        isOpen={heatModalOpen}
        onClose={() => { setHeatModalOpen(false); setSelectedProduct(null); }}
        onSelect={handleHeatLevelSelect}
        productName={selectedProduct?.name}
        variations={heatVariations}
      />
    </section>
  );
}
