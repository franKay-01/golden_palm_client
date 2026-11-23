import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Minus, Plus } from 'lucide-react';
import useFunctions from '../utils/functions';
import { CartContext } from '../context/cartContext';
import { ShowToast } from './showToast';
import HeatLevelModal from './heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';
import { isOnSale, effectiveUnitPrice, amountOff } from '../utils/pricing';
import { apiImageProps } from '../utils/images';
import { SKELETON_BG } from './skeletons';

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5 leading-none">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={`block shrink-0 ${s <= Math.round(rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const CardSkeleton = () => (
  <div className="flex shrink-0 w-[23rem] rounded-2xl overflow-hidden bg-white/60 border border-[#e6e0cc] h-[11rem]">
    <div className={`w-[9.5rem] ${SKELETON_BG} motion-safe:animate-pulse`} />
    <div className="flex-1 p-3 space-y-3">
      <div className={`h-6 w-3/4 ${SKELETON_BG} rounded motion-safe:animate-pulse`} />
      <div className={`h-4 w-1/2 ${SKELETON_BG} rounded motion-safe:animate-pulse`} />
      <div className={`h-8 w-1/3 ${SKELETON_BG} rounded motion-safe:animate-pulse`} />
      <div className={`h-11 w-full ${SKELETON_BG} rounded motion-safe:animate-pulse`} />
    </div>
  </div>
);

// "Best sellers" row for the Shop landing page: top products by recent sales, with quick add.
export default function BestSellers({ limit = 6 }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});
  const { getBestSellers } = useFunctions();
  const { addToCart, openCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getBestSellers(limit);
      if (cancelled) return;
      if (res.response_code === '000') setProducts(res.products);
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const getQty = (sku) => quantities[sku] || 1;
  const changeQty = (sku, delta) =>
    setQuantities((q) => ({ ...q, [sku]: Math.max(1, (q[sku] || 1) + delta) }));

  const addProduct = (product, heatLevel) => {
    addToCart({
      id: product.sku,
      name: product.name,
      price: effectiveUnitPrice(product),
      unit_price: effectiveUnitPrice(product),
      quantity: getQty(product.sku),
      img_url: product.img_url,
      type: 'product',
      heat_level: heatLevel,
      shipping_weight: product.shipping_weight || null,
      product_details: null
    });
    openCart();
  };

  const handleAdd = (product) => {
    if (product.is_available === false) {
      ShowToast('error', `${product.name} is out of stock`);
      return;
    }
    // Hot products need a heat level first
    if (product.is_hot) {
      setSelectedProduct(product);
      setHeatModalOpen(true);
      return;
    }
    addProduct(product, null);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedProduct) return;
    const chosen = getHeatVariations(selectedProduct).find(
      (v) => v.heat_level?.toLowerCase() === heatLevel?.toLowerCase()
    );
    if (chosen?.is_available === false) {
      ShowToast('error', `The ${heatLevel} option is out of stock`);
      return;
    }
    addProduct(selectedProduct, heatLevel);
    setSelectedProduct(null);
  };

  // Nothing to show (error or empty catalogue): leave the page as it was
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-12 md:pt-16 md:pb-12" aria-labelledby="best-sellers-heading">
      <h2 id="best-sellers-heading" className="text-4xl md:text-6xl font-caslon text-gp-light-green text-center mb-3">
        Best Sellers
      </h2>
      <p className="text-gp-black font-canaro-book text-base md:text-[20px] text-center mb-8 md:mb-10">
        What our customers are buying right now.
      </p>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-4 -mx-4 px-4 [scrollbar-width:thin] [&>:first-child]:ml-auto [&>:last-child]:mr-auto">
        {isLoading
          ? Array.from({ length: Math.min(limit, 6) }).map((_, i) => <CardSkeleton key={i} />)
          : products.map((product) => {
              const onSale = isOnSale(product);
              const price = effectiveUnitPrice(product);
              return (
                <div
                  key={product.sku}
                  className="flex shrink-0 snap-start w-[23rem] h-[11rem] rounded-2xl overflow-hidden bg-white border border-[#e6e0cc] shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/product-detail/${product.sku}`)}
                    aria-label={`View ${product.name}`}
                    className="relative block w-[9.5rem] h-full shrink-0 bg-white"
                  >
                    <img
                      {...apiImageProps(product.img_url, '152px')}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {onSale && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[0.7rem] font-canaro-semibold px-2 py-0.5 rounded-full shadow">
                        Save ${amountOff(product)}
                      </span>
                    )}
                  </button>

                  <div className="flex flex-col flex-1 min-w-0 p-3 justify-between">
                    <h3
                      onClick={() => navigate(`/product-detail/${product.sku}`)}
                      className="text-base leading-tight font-caslon font-bold text-gp-light-green line-clamp-2 cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    {product.review_count > 0 && (
                      <div className="flex items-center gap-2">
                        <Stars rating={product.avg_rating} />
                        <span className="text-xs font-canaro-semibold text-gp-black">
                          {parseFloat(product.avg_rating).toFixed(1)}
                        </span>
                        <span className="text-xs font-canaro-book text-gray-600">({product.review_count})</span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2">
                      <span className="text-xl leading-none font-canaro-semibold text-gp-light-green">${price.toFixed(2)}</span>
                      {onSale && (
                        <span className="text-sm text-gray-500 line-through">${parseFloat(product.price).toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex items-stretch gap-2 h-9">
                      <div className="flex items-center justify-between border-2 border-[#dcd8c0] rounded-lg w-[5rem] shrink-0">
                        <button
                          type="button"
                          onClick={() => changeQty(product.sku, -1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="p-1 text-gp-black disabled:opacity-40"
                          disabled={getQty(product.sku) <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-canaro-semibold text-sm text-gp-black" aria-live="polite">
                          {getQty(product.sku)}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQty(product.sku, 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="p-1 text-gp-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className="flex-1 min-w-0 bg-gp-light-green hover:bg-gp-dark-green text-white font-canaro-semibold tracking-wide text-xs rounded-lg transition-colors whitespace-nowrap"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <HeatLevelModal
        isOpen={heatModalOpen}
        onClose={() => {
          setHeatModalOpen(false);
          setSelectedProduct(null);
        }}
        onSelect={handleHeatLevelSelect}
        productName={selectedProduct?.name}
        variations={getHeatVariations(selectedProduct)}
      />
    </section>
  );
}
