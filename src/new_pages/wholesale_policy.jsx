import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Seo from '../components/seo';
import Footer from '../components/footer';
import YellowBrushImg from '../assets/images/brush_yellow.webp'
import Asset15 from '../assets/images/asset_15.webp'
import Asset17 from '../assets/images/asset_17.webp'
import Asset12 from '../assets/images/asset_12.webp'
import Asset11 from '../assets/images/asset_11.webp'

const LEFT_SECTIONS = [
  {
    title: 'Introduction & Availability',
    items: [
      'Wholesale pricing is listed in this catalog.',
      'Suggested retail pricing (SRP) is provided as a guideline.',
      'Prices are subject to change due to fluctuations in raw material costs, international sourcing, and logistics.',
      'Golden Palm Foods sources ingredients directly from West Africa, and pricing may be impacted by shipping conditions, tariffs, and availability.',
      'We are committed to maintaining fair and stable pricing and will provide advance notice of any changes.',
    ],
  },
  {
    title: 'Ordering Process',
    items: [
      'Complete our wholesale order form with your desired products and quantities.',
      'We will review your order and send an invoice via Square, including shipping or delivery costs (if applicable).',
      'Orders are confirmed once payment is received through the invoice.',
    ],
  },
  {
    title: 'Payment Terms',
    items: [
      'Payment is due within 48 hours of invoice issuance.',
      'Non-payment may result in order cancellation.',
      'Invoices are issued through Square.',
      'All payments should be made via Credit/Debit or ACH bank transfer.',
    ],
  },
  {
    title: 'Storage & Handling',
    items: [
      'All products are shelf-stable unless otherwise noted.',
      'Store in a cool, dry place away from direct sunlight.',
      'Oils may naturally solidify or change appearance with temperature. This does not affect quality.',
    ],
  },
];

const RIGHT_SECTIONS = [
  {
    title: 'Allergen Information',
    items: [
      'Some products contain or are made with shellfish (shrimp) and fish (herrings).',
      'Please review ingredient lists on the label carefully before resale.',
    ],
  },
  {
    title: 'Turnaround Time',
    items: [
      <>Orders are fulfilled within <span className="font-canaro-semibold">3–7 business days</span> after payment confirmation.</>,
    ],
  },
  {
    title: 'Shipping',
    items: [
      'Orders are shipped via standard carriers (UPS/USPS).',
      'Shipping costs are calculated based on order weight and destination.',
      'Shipping charges are included in the Square invoice.',
    ],
  },
  {
    title: 'Local Delivery & Pickup',
    items: [
      'Local delivery available within the Phoenix metro area.',
      <>Phoenix delivery costs <span className="font-canaro-semibold">$15</span>.</>,
      <>Outside Phoenix (Tempe, Chandler, Mesa, etc.): <span className="font-canaro-semibold">$20</span>.</>,
      <>Free local delivery for orders <span className="font-canaro-semibold">$500 and up</span>.</>,
    ],
    extra: (
      <p className="text-gp-light-green font-canaro-book text-[1rem] md:text-[1.15rem] mt-2">
        Local pickup available in Phoenix, at our production kitchen:
        <br />
        <span className="font-canaro-semibold">6727 N. 47th Ave. Glendale, AZ 85301</span>
      </p>
    ),
  },
  {
    title: 'Damages & Returns Policy',
    items: [
      'Please inspect all orders upon delivery.',
      'Any damages or issues must be reported within 24 hours of delivery.',
      'We will replace or refund damaged items when applicable.',
      'Due to the nature of food products, all sales are final.',
    ],
  },
];

const PolicySection = ({ title, items, extra }) => (
  <div className="flex flex-col gap-1.5">
    <h2 className="font-canaro-semibold text-gp-light-green text-[1.15rem] md:text-[1.5rem]">{title}</h2>
    <ul className="list-disc pl-5 space-y-1 text-gp-light-green font-canaro-book text-[1rem] md:text-[1.15rem]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
    {extra}
  </div>
);

export default function WholesalePolicyPage() {
  return (
    <>
      <Seo
        title="Wholesale Policies"
        description="Golden Palm Foods wholesale policies — ordering, payment terms, shipping, local delivery & pickup, turnaround time, allergens, and returns."
        path="/wholesale-policy"
      />
      <Header />

      <div className="relative max-w-7xl mx-auto px-4 pb-16 overflow-x-clip md:overflow-x-visible">
        <div className="block absolute top-2 -left-3 md:top-[8rem] md:-left-[12rem] transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset15} alt="" className='w-[5rem] h-auto md:w-[15rem] md:h-[14rem]'/>
        </div>
        <div className="block absolute top-[22rem] -left-2 md:top-[40rem] md:-left-20 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset12} alt="" className='w-[3.5rem] h-auto md:w-[7rem] md:h-[10rem]'/>
        </div>
        <div className="block absolute top-2 -right-3 md:top-[-8rem] md:right-12 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset17} alt="" className='w-[5rem] h-auto md:w-[12rem] md:h-[15rem]'/>
        </div>
        <div className="block absolute top-[14rem] -right-2 md:top-[40rem] md:-right-[2rem] transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset11} alt="" className='w-[3rem] h-auto md:w-[5rem] md:h-[5rem]'/>
        </div>

        <div className='flex flex-col items-center justify-center mb-8 md:mb-12 mt-12'>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-caslon text-gp-light-green text-center">Wholesale Policies</h1>
          <img src={YellowBrushImg} alt="" className="w-[70%] sm:w-[55%] md:w-[45%]" />
        </div>

        <div className="mx-auto">
          <div className="bg-gp-yellow rounded-2xl shadow-md p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-x-14 md:gap-y-8">
              <div className="flex flex-col gap-7">
                {LEFT_SECTIONS.map((s) => <PolicySection key={s.title} {...s} />)}
              </div>
              <div className="flex flex-col gap-7">
                {RIGHT_SECTIONS.map((s) => <PolicySection key={s.title} {...s} />)}
              </div>
            </div>
          </div>

          {/* CTA back to ordering — hidden for now, re-enable when wholesale ordering is live
          <div className="text-center mt-8 sm:mt-10">
            <Link
              to="/wholesale"
              className="inline-block bg-gp-light-green text-white px-8 py-3.5 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-green-800 transition-colors"
            >
              Start Your Order
            </Link>
          </div>
          */}
        </div>
      </div>

      <Footer/>
    </>
  );
};
