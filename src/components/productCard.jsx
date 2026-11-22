import React from 'react';
import { Info, AlertTriangle, Star } from 'lucide-react';
import { isOnSale, percentOff, bundleSavings } from '../utils/pricing';
import { apiImageProps } from '../utils/images';

export const CARD_IMAGE_SIZES = '(min-width: 768px) 33vw, 50vw';

const Badge = ({ className = '', children }) => (
  <span className={`font-canaro-semibold uppercase leading-none tracking-wide text-[0.6875rem] md:text-xs px-[0.4375rem] py-1.5 md:px-[0.5625rem] md:py-[0.4375rem] rounded shadow-md ${className}`}>
    {children}
  </span>
);

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5 leading-none">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={15} className={`block shrink-0 ${s <= Math.round(rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'}`} />
    ))}
  </div>
);

/*
 * Shop / bundle grid card (Black Friday card design).
 *  - item:            product or bundle object from the API
 *  - onAdd(e):        add-to-cart handler
 *  - onOpen():        optional, opens the detail page from the photo and name
 *  - onReviewsClick(e) / onTestimonialsClick(e): optional links under the price
 *  - showSale:        use sale_price / "Save N%" when the item is on sale
 * Out-of-stock keeps the existing treatment: faded grayscale photo and a gray, disabled button.
 */
export default function ProductCard({
  item, onAdd, onOpen, onReviewsClick, onTestimonialsClick, showSale = true, sizes = CARD_IMAGE_SIZES
}) {
  const isBundle = Array.isArray(item.product_details) && item.product_details.length > 0;
  const isOutOfStock = item.is_available === false;
  const onSale = showSale && isOnSale(item);
  const price = parseFloat(onSale ? item.sale_price : item.price);
  const unavailable = isBundle ? item.product_details.filter((p) => p.is_available === false) : [];
  const stop = (fn) => (e) => { e.stopPropagation(); fn(e); };

  return (
    <div className="flex flex-col min-w-0">
      {/* Photo */}
      <div
        onClick={onOpen}
        className={`relative aspect-square md:aspect-[3/2] rounded-lg overflow-hidden bg-[#F3F3F1] shadow-md ${onOpen ? 'cursor-pointer' : ''}`}
      >
        <img
          className={`w-full h-full object-cover block ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          {...apiImageProps(item.img_url, sizes)}
          alt={item.name}
        />
        <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 flex flex-col md:flex-row md:flex-wrap items-start gap-[5px] md:gap-1.5">
          {onSale && <Badge className="bg-gp-yellow text-[#1F270C]">Save {percentOff(item)}%</Badge>}
          {isOutOfStock && <Badge className="bg-[#D42A2A] text-white">Out of Stock</Badge>}
        </div>
        {unavailable.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-white px-2 py-1 text-[0.6875rem] md:text-xs font-canaro-semibold">
            <span className="flex gap-1">
              <AlertTriangle size={12} className="flex-shrink-0 mt-px" />
              <span>{unavailable.map((p) => p.name).join(', ')} out of stock. Prices adjusted</span>
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="pt-4 md:pt-[1.375rem] md:px-3.5 flex flex-col gap-2.5 md:gap-3 flex-1">
        <h3
          title={item.name}
          onClick={onOpen}
          className={`font-caslon text-gp-light-green leading-[1.15] tracking-tight line-clamp-3 md:line-clamp-2 min-h-[3.45em] md:min-h-[2.3em] text-[1.25rem] md:text-[1.75rem] xl:text-[2.125rem] ${onOpen ? 'cursor-pointer' : ''}`}
        >
          {item.name}
        </h3>

        <div className="flex items-baseline gap-1.5 md:gap-2.5 flex-wrap">
          <span className="font-canaro-semibold text-gp-light-green leading-none text-[1.375rem] md:text-3xl xl:text-4xl">${price.toFixed(2)}</span>
          {onSale && (
            <span className="text-[#7C786B] line-through font-canaro-semibold leading-none text-[0.8125rem] md:text-lg">${parseFloat(item.price).toFixed(2)}</span>
          )}
        </div>

        {/* Fixed-height slot so cards without reviews still line up with the rest of the row */}
        <div className="min-h-[1.25rem] flex items-center">
        {item.review_count > 0 ? (
          <div
            onClick={onReviewsClick ? stop(onReviewsClick) : undefined}
            className={`flex items-center gap-2 ${onReviewsClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          >
            <Stars rating={item.avg_rating} />
            <span className="text-xs md:text-sm font-canaro-book text-gray-600 leading-none mt-[3px] underline">
              {parseFloat(item.avg_rating).toFixed(1)} ({item.review_count})
            </span>
          </div>
        ) : onTestimonialsClick ? (
          <div onClick={stop(onTestimonialsClick)} className="cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xs md:text-sm font-canaro-book text-gp-light-green leading-none underline">Read our testimonials</span>
          </div>
        ) : null}
        </div>

        {/* Reserves two lines so a bundle's extra "Save $X" line doesn't push its button down */}
        <div className="min-h-[2.4rem] md:min-h-[2.6rem]">
        {isBundle ? (
          <div className="flex flex-col gap-0.5">
            <div className="relative group w-fit">
              <div className="flex items-center gap-1 cursor-help">
                <span className="text-xs md:text-sm font-canaro-semibold text-[#45454D] leading-snug">
                  Bundle includes {item.product_details.filter((p) => p.is_available !== false).length} items
                </span>
                <Info size={14} className="text-gray-500 shrink-0" />
              </div>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
                <p className="font-canaro-semibold mb-2">Bundle contains:</p>
                <ul className="space-y-1 font-canaro-light">
                  {item.product_details.map((p, idx) => (
                    <li key={idx} className={p.is_available === false ? 'line-through text-gray-400' : ''}>• {p.name}</li>
                  ))}
                </ul>
                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800" />
              </div>
            </div>
            {bundleSavings(item) != null && (
              <span className="text-xs font-canaro-semibold text-gray-600 leading-snug">Save ${bundleSavings(item).toFixed(2)} from this bundle</span>
            )}
          </div>
        ) : item.weight ? (
          <span className="text-xs md:text-sm font-canaro-semibold text-[#45454D] leading-snug">Size {parseInt(item.weight)} {item.weight_type}</span>
        ) : null}
        </div>

        <button
          onClick={onAdd}
          disabled={isOutOfStock}
          className={`mt-auto h-11 md:h-[3.25rem] rounded-sm text-white uppercase tracking-wide font-canaro-semibold text-[0.8125rem] md:text-base transition-colors ${
            isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-gp-light-green hover:bg-gp-dark-green'
          }`}
        >
          {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
