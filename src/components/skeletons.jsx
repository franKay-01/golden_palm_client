import React from 'react';

// Placeholder blocks shown while data loads. Sizes mirror the real layouts so the page
// doesn't jump when content arrives. The pulse is skipped for reduced-motion users.
// One place to change the colour of every loading placeholder.
export const SKELETON_BG = 'bg-[#E4DCC8]';

const Bar = ({ className = '' }) => (
  <div className={`${SKELETON_BG} rounded motion-safe:animate-pulse ${className}`} />
);

export function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12"
    >
      <span className="sr-only">Loading product…</span>

      {/* Back, title, highlights */}
      <Bar className="h-6 w-20 mt-6 mb-4" />
      <Bar className="h-9 sm:h-12 w-3/4 sm:w-1/2 mb-3" />
      <Bar className="h-4 w-1/2 sm:w-1/3 mb-6" />

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-8 md:mb-20">
        {/* Photo + thumbnails */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
          <div className="flex sm:flex-col gap-2 sm:gap-3">
            {[0, 1, 2].map((i) => (
              <Bar key={i} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex-shrink-0" />
            ))}
          </div>
          <Bar className="flex-1 h-[20rem] sm:h-[30rem] rounded-lg" />
        </div>

        {/* Price, shipping line, add to cart */}
        <div className="space-y-4 sm:space-y-6">
          <Bar className="h-12 sm:h-20 w-2/3" />
          <Bar className="h-10 sm:h-14 w-40" />
          <Bar className="h-5 w-3/4" />
          <Bar className="h-12 sm:h-14 w-full rounded-lg" />
          <div className="flex gap-3">
            <Bar className="h-12 sm:h-14 flex-1 rounded-lg" />
            <Bar className="h-12 sm:h-14 w-12 sm:w-14 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Bar className="h-5 w-full" />
        <Bar className="h-5 w-11/12" />
        <Bar className="h-5 w-10/12" />
        <Bar className="h-5 w-2/3" />
      </div>
    </div>
  );
}

export function ShopGridSkeleton({ count = 6 }) {
  return (
    <div role="status" aria-busy="true" className="max-w-7xl mx-auto px-4 pb-12">
      <span className="sr-only">Loading products…</span>
      <Bar className="h-8 w-48 mt-6 mb-6" />
      <Bar className="h-14 md:h-20 w-full rounded-lg mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3.5 gap-y-7 md:gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Bar className="w-full aspect-square md:aspect-[3/2] rounded-lg" />
            <Bar className="h-6 md:h-8 w-4/5 mt-4" />
            <Bar className="h-7 md:h-10 w-1/3" />
            <Bar className="h-4 w-1/2" />
            <Bar className="h-11 md:h-[3.25rem] w-full rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic image-card grid (blogs, recipes, cooking classes, reviews).
export function CardGridSkeleton({ count = 6 }) {
  return (
    <div role="status" aria-busy="true" className="max-w-7xl mx-auto px-4 py-8 pb-12">
      <span className="sr-only">Loading…</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Bar className="w-full h-56 rounded-xl" />
            <Bar className="h-6 w-3/4" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// A few review rows, shown while a product or bundle's reviews load.
export function ReviewsSkeleton({ count = 2 }) {
  return (
    <div role="status" aria-busy="true" className="space-y-6 py-4">
      <span className="sr-only">Loading reviews…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Bar className="h-4 w-32" />
          <Bar className="h-4 w-full" />
          <Bar className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

// Shown by the router while a page's code is still downloading.
export function PageSkeleton() {
  return (
    <div>
      <div className="h-24 bg-[#2B2D22]" />
      <CardGridSkeleton />
    </div>
  );
}
