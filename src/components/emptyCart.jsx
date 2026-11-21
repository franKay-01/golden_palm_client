import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFunctions from '../utils/functions';
import { CartContext } from '../context/cartContext';
import { ShowToast } from './showToast';
import HeatLevelModal from './heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';
import { effectiveUnitPrice } from '../utils/pricing';
import { apiImageProps } from '../utils/images';
import { SKELETON_BG } from './skeletons';

const COUNT = 3;

// Module-level cache of the in-stock product pool (not the picks), so reopening an empty
// cart doesn't refetch but still shows a fresh random three each time.
let pool = null;
let poolAt = 0;
const TTL_MS = 5 * 60 * 1000;

const pickRandom = (items, n) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
};

// One short line under the name: heat levels for hot products, otherwise the size
const subtitle = (p) => {
  if (p.is_hot) {
    const levels = getHeatVariations(p).map((v) => v.heat_level).filter(Boolean);
    if (levels.length > 1) return `${levels.slice(0, -1).join(', ')} or ${levels[levels.length - 1]}`;
    if (levels.length === 1) return levels[0];
  }
  return p.weight ? `Size ${parseInt(p.weight)} ${p.weight_type}` : '';
};

// Empty state for the cart modal: three random in-stock products to start with.
export default function EmptyCart({ onClose }) {
  const fresh = pool && Date.now() - poolAt < TTL_MS;
  const [products, setProducts] = useState(() => (fresh ? pickRandom(pool, COUNT) : []));
  const [isLoading, setIsLoading] = useState(!fresh);
  const [heatProduct, setHeatProduct] = useState(null);
  const { getProductsAndBundles } = useFunctions();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (fresh) return;
    let cancelled = false;
    (async () => {
      const res = await getProductsAndBundles();
      if (cancelled) return;
      // Single products only (no bundles), and only ones that can actually be bought
      const inStock = res.response_code === '000'
        ? (res.products || []).filter((p) => p.is_available !== false)
        : [];
      if (inStock.length) {
        pool = inStock;
        poolAt = Date.now();
        setProducts(pickRandom(inStock, COUNT));
      }
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = (product, heatLevel) => {
    // Adding fills the cart, so the modal switches to the normal cart view on its own
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
      product_details: null,
    });
  };

  const handleAdd = (product) => {
    if (product.is_available === false) {
      ShowToast('error', `${product.name} is out of stock`);
      return;
    }
    if (product.is_hot) {
      setHeatProduct(product);
      return;
    }
    addProduct(product, null);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!heatProduct) return;
    const chosen = getHeatVariations(heatProduct).find(
      (v) => v.heat_level?.toLowerCase() === heatLevel?.toLowerCase()
    );
    if (chosen?.is_available === false) {
      ShowToast('error', `The ${heatLevel} option is out of stock`);
      return;
    }
    addProduct(heatProduct, heatLevel);
    setHeatProduct(null);
  };

  const goShop = () => {
    onClose();
    navigate('/shop?tp=all');
  };

  return (
    <div className="px-4 sm:px-8 pt-6 pb-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="text-3xl md:text-4xl font-caslon text-gp-black leading-tight">Your cart is empty</h3>
          <p className="mt-1 text-base text-gray-600 font-canaro-book">
            {products.length > 0 || isLoading ? 'Start with one of our favorites.' : 'Browse the shop to find your next jar.'}
          </p>
        </div>
        <button
          onClick={goShop}
          className="flex-shrink-0 text-base font-canaro-semibold text-gp-light-green underline underline-offset-4 decoration-2 hover:text-gp-dark-green"
        >
          Shop all products
        </button>
      </div>

      {(isLoading || products.length > 0) && (
        <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:gap-6 md:overflow-visible -mx-4 px-4 sm:-mx-8 sm:px-8 md:mx-0 md:px-0">
          {isLoading
            ? Array.from({ length: COUNT }).map((_, i) => (
                <div key={i} className="w-[15rem] flex-shrink-0 md:w-auto space-y-3">
                  <div className={`aspect-[4/3] ${SKELETON_BG} motion-safe:animate-pulse`} />
                  <div className={`h-6 w-3/4 ${SKELETON_BG} rounded motion-safe:animate-pulse`} />
                  <div className={`h-4 w-1/2 ${SKELETON_BG} rounded motion-safe:animate-pulse`} />
                  <div className={`h-12 w-full ${SKELETON_BG} motion-safe:animate-pulse`} />
                </div>
              ))
            : products.map((p) => {
                const out = p.is_available === false;
                return (
                  <div key={p.sku} className="w-[15rem] flex-shrink-0 md:w-auto flex flex-col">
                    <div className="aspect-[4/3] bg-[#F3F3F1] overflow-hidden">
                      <img
                        {...apiImageProps(p.img_url, '(min-width: 768px) 360px, 240px')}
                        alt={p.name}
                        className={`w-full h-full object-cover ${out ? 'opacity-50 grayscale' : ''}`}
                      />
                    </div>
                    <h4 title={p.name} className="mt-3 text-xl md:text-2xl font-caslon text-gp-light-green leading-tight line-clamp-1">{p.name}</h4>
                    <p className="mt-1 text-sm text-gray-500 font-canaro-book min-h-[1.25rem]">{subtitle(p)}</p>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={out}
                      className="mt-3 w-full border border-gp-black bg-white hover:bg-gray-50 text-gp-black py-3.5 text-sm font-canaro-semibold tracking-[0.18em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {out ? 'Out of stock' : 'Add to cart'}
                    </button>
                  </div>
                );
              })}
        </div>
      )}

      <HeatLevelModal
        isOpen={!!heatProduct}
        onClose={() => setHeatProduct(null)}
        onSelect={handleHeatLevelSelect}
        productName={heatProduct?.name}
        variations={getHeatVariations(heatProduct)}
      />
    </div>
  );
}
