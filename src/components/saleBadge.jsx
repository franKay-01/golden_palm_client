import React from 'react';

// Circular starburst "seal" style sale badge. The outer div takes the positioning
// classes from the consumer (e.g. "absolute top-3 right-3"); the inner div is the
// always-relative burst so its stacked layers anchor correctly.
export default function SaleBadge({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <div className="relative w-16 h-16 md:w-[4.75rem] md:h-[4.75rem]">
        {/* Starburst layers */}
        <div className="absolute inset-0 bg-red-600 rounded-[20%] rotate-[22.5deg] shadow-md"></div>
        <div className="absolute inset-0 bg-red-600 rounded-[20%] shadow-md"></div>
        {/* Inner circle */}
        <div className="absolute inset-[14%] bg-red-600 rounded-full"></div>
        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white uppercase leading-none text-center">
          <span className="text-[0.5rem] md:text-[0.55rem] tracking-wide mb-0.5">Ongoing</span>
          <span className="text-lg md:text-xl italic font-caslon tracking-wide">Sale</span>
        </div>
      </div>
    </div>
  );
}
