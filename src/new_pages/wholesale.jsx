import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronDown } from 'lucide-react';
import Header from '../components/header';
import Seo from '../components/seo';
import Footer from '../components/footer';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import BeansImg from '../assets/images/beans.webp';
import ChilliImg from '../assets/images/chilli.webp';
import OilsImg from '../assets/images/golden_palm_bundle.webp';
import BrushYellow from '../assets/images/brush_yellow.webp';
import HeroBg from '../assets/images/bg2.webp';
import Asset11 from '../assets/images/asset_11.webp';
import Asset17 from '../assets/images/asset_17.webp';
import Asset3 from '../assets/images/asset_3.webp';

// Catalog fallback (from the wholesale catalog PDF). In production this comes from
// GET /wholesale/products; each item's img_url overrides the local placeholder below.
const CATALOG = [
  {
    sku: 'SM-06', name: 'All Purpose Spice Mix', category: 'spice',
    origin: 'Made in Togo', shelf_life_months: 24, size: '6 oz', case_pack: 12, moq: 12,
    unit_wholesale_price: 11, case_price: 132, moq_total: 132, srp_min: 16, srp_max: 18,
    ingredients: 'Cloves, nutmeg, rosemary, coriander, grains of selim, ginger, bay leaves, anise, white pepper, black peppercorns, turmeric, fenugreek.',
    description: 'A balanced blend of traditional West African spices and familiar pantry ingredients, crafted to bring warmth, depth, and everyday versatility to cooking.',
    uses: 'Season meats, poultry, fish, soups, and vegetables. Great for baked goods and warm, earthy recipes; also for spiced teas and infused drinks.',
  },
  {
    sku: 'BB-22', name: 'Bambara Beans', category: 'legume',
    origin: 'Grown in Togo', shelf_life_months: 36, size: '2.2 lbs', case_pack: 12, moq: 12,
    unit_wholesale_price: 12, case_price: 144, moq_total: 144, srp_min: 20, srp_max: 22,
    ingredients: '100% Bambara Beans.',
    description: 'A nutrient-dense legume known for its nutty flavor and versatility. Naturally rich in plant-based protein and fiber, and naturally gluten-free.',
    uses: 'Use in soups and stews, roast for a crunchy snack, or blend into a flavorful hummus.',
  },
  {
    sku: 'CP-MI-09', name: 'Ebesse Chili Paste', heat_level: 'Mild', category: 'chili',
    origin: 'Made in Arizona', shelf_life_months: 12, size: '9 oz', case_pack: 12, moq: 24,
    unit_wholesale_price: 10, case_price: 120, moq_total: 240, srp_min: 15, srp_max: 18,
    ingredients: 'Olive oil, onions, tomato paste, ginger, bell peppers, salt, cayenne, garlic, onion powder, shrimp powder, herring powder, scotch bonnet peppers.',
    description: 'A bold, savory chili paste made with peppers, aromatics, and umami-rich ingredients — layered heat and depth in a single spoonful.',
    uses: 'Use as a marinade, cooking base, or finishing sauce. Ideal for meats, seafood, vegetables, and rice dishes.',
    note: 'Heat levels can be mixed & matched.',
  },
  {
    sku: 'CP-ME-09', name: 'Ebesse Chili Paste', heat_level: 'Medium', category: 'chili',
    origin: 'Made in Arizona', shelf_life_months: 12, size: '9 oz', case_pack: 12, moq: 24,
    unit_wholesale_price: 10, case_price: 120, moq_total: 240, srp_min: 15, srp_max: 18,
    ingredients: 'Olive oil, onions, tomato paste, ginger, bell peppers, salt, cayenne, garlic, onion powder, shrimp powder, herring powder, scotch bonnet peppers.',
    description: 'A bold, savory chili paste made with peppers, aromatics, and umami-rich ingredients — layered heat and depth in a single spoonful.',
    uses: 'Use as a marinade, cooking base, or finishing sauce. Ideal for meats, seafood, vegetables, and rice dishes.',
    note: 'Heat levels can be mixed & matched.',
  },
  {
    sku: 'CP-HO-09', name: 'Ebesse Chili Paste', heat_level: 'Hot', category: 'chili',
    origin: 'Made in Arizona', shelf_life_months: 12, size: '9 oz', case_pack: 12, moq: 24,
    unit_wholesale_price: 10, case_price: 120, moq_total: 240, srp_min: 15, srp_max: 18,
    ingredients: 'Olive oil, onions, tomato paste, ginger, bell peppers, salt, cayenne, garlic, onion powder, shrimp powder, herring powder, scotch bonnet peppers.',
    description: 'A bold, savory chili paste made with peppers, aromatics, and umami-rich ingredients — layered heat and depth in a single spoonful.',
    uses: 'Use as a marinade, cooking base, or finishing sauce. Ideal for meats, seafood, vegetables, and rice dishes.',
    note: 'Heat levels can be mixed & matched.',
  },
  {
    sku: 'CO-32', name: 'Unrefined Coconut Oil', category: 'oil',
    origin: 'Made in Togo', shelf_life_months: 24, size: '32 fl oz', case_pack: 12, moq: 12,
    unit_wholesale_price: 13, case_price: 156, moq_total: 156, srp_min: 18, srp_max: 20,
    ingredients: '100% Unrefined Coconut Oil.',
    description: 'Traditionally produced in Togo from freshly harvested coconuts. Minimally processed for a clean, natural aroma and smooth texture.',
    uses: 'Ideal for sautéing, frying, baking, and everyday cooking. Also suitable for smoothies and personal care.',
  },
  {
    sku: 'RPO-32', name: 'Unrefined Red Palm Oil', category: 'oil',
    origin: 'Made in Togo', shelf_life_months: 24, size: '32 fl oz', case_pack: 12, moq: 12,
    unit_wholesale_price: 11, case_price: 132, moq_total: 132, srp_min: 16, srp_max: 18,
    ingredients: '100% Unrefined Red Palm Oil.',
    description: 'A traditional, unrefined red palm oil from small-scale producers in Togo. Vibrant color with a rich, earthy flavor and distinctive aroma.',
    uses: 'Use in soups, stews, and sauces to add color, richness, and depth. Also great in baking.',
  },
  {
    sku: 'PO-32', name: 'Unrefined Peanut Cooking Oil', category: 'oil',
    origin: 'Made in Togo', shelf_life_months: 24, size: '32 fl oz', case_pack: 12, moq: 12,
    unit_wholesale_price: 12, case_price: 144, moq_total: 144, srp_min: 18, srp_max: 20,
    ingredients: '100% Unrefined Peanut Cooking Oil.',
    description: 'A single-origin unrefined peanut oil made from locally grown peanuts and minimally processed to preserve its natural richness.',
    uses: 'Perfect for frying, grilling, and sautéing. A reliable everyday oil for savory dishes and marinades.',
  },
];

const FALLBACK_IMG = { spice: OilsImg, legume: BeansImg, chili: ChilliImg, oil: OilsImg };

const CATEGORIES = [
  { key: 'all', label: 'All Products' },
  { key: 'chili', label: 'Chili Pastes' },
  { key: 'oil', label: 'Oils' },
  { key: 'spice', label: 'Spices' },
  { key: 'legume', label: 'Legumes' },
];

const REASONS = [
  {
    title: 'Clean-Label Ingredients Consumers Trust',
    text: 'Made with wholesome, recognizable ingredients that customers can easily read and understand.',
  },
  {
    title: 'Small-Batch, Quality-Focused Production',
    text: 'Produced in small batches to ensure consistency and attention to quality.',
  },
  {
    title: 'Unique, Story-Driven Products',
    text: 'Bring West African flavors to your shelves — an underrepresented category that offers something new, distinct, and easy for customers to use.',
  },
  {
    title: 'Approachable and Adaptable',
    text: 'Products are versatile and intuitive, making them accessible to both new and experienced consumers.',
  },
  {
    title: 'Built for Repeat Purchase',
    text: 'Pantry staples customers return to once incorporated into their routine.',
  },
];

const FAQS = [
  { q: 'What is the minimum order?', a: 'Minimum order quantities (MOQ) are listed per product — typically 1 case (12 units) for spices, oils, and legumes, and 2 cases for the Ebesse Chili Paste line.' },
  { q: 'Can I mix and match chili paste heat levels?', a: 'Yes. The Ebesse Chili Paste heat levels (Mild, Medium, Hot) can be mixed and matched to meet your MOQ.' },
  { q: 'How do I place an order?', a: 'Set the number of cases you want on each product in the catalog, then fill in your business details and submit. Our team will confirm availability, final totals, and shipping.' },
  { q: 'Do you ship nationwide?', a: 'Yes — we ship to retailers, restaurants, and distributors across the US. Shipping is calculated per order based on volume and destination.' },
];

const FULFILLMENT_OPTIONS = [
  { value: 'shipping', label: 'Ship to me' },
  { value: 'local_delivery', label: 'Local delivery' },
  { value: 'pickup', label: 'Pickup' },
];

const initialForm = {
  business_name: '', contact_name: '', email: '', phone: '',
  business_type: '', address: '', city: '', state: '', zip: '',
  website: '', message: '', fulfillment_method: 'shipping',
};

// Minimum number of CASES a customer must order for a product.
// Handles both data conventions:
//   - explicit min_cases field, if present
//   - moq expressed in UNITS (>= a full case pack) -> ceil(moq / case_pack)
//   - moq expressed in CASES (< a case pack, e.g. moq 2 / pack 12) -> use directly
const minCasesFor = (p) => {
  if (p.min_cases) return Math.max(1, parseInt(p.min_cases, 10) || 1);
  const cp = p.case_pack || 1;
  const moq = p.moq || cp;
  const min = moq >= cp ? Math.ceil(moq / cp) : moq;
  return Math.max(1, min);
};

export default function WholesalePage() {
  const [products, setProducts] = useState(CATALOG);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [caseQty, setCaseQty] = useState({}); // { [sku]: number of cases }
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Shipping/delivery cost preview. status: idle | loading | ready | ineligible | error
  const [quote, setQuote] = useState({ status: 'idle', cost: null, message: '' });
  const formRef = useRef(null);

  const { getWholesaleProducts, submitWholesaleOrder, getWholesaleShippingQuote } = useFunctions();

  // Prefer live catalog from the API; fall back to the bundled catalog data
  useEffect(() => {
    const load = async () => {
      const res = await getWholesaleProducts();
      if (res.response_code === '000' && res.products.length > 0) {
        setProducts(res.products);
      }
    };
    load();
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const imgFor = (p) =>
    p.img_url ? `https://api.goldenpalmfoods.com${p.img_url}` : (FALLBACK_IMG[p.category] || OilsImg);

  // Valid case quantities are 0 (not ordered) or >= the product's MOQ.
  // Anything between 1 and MOQ-1 snaps up to the minimum.
  const setQty = (p, value) => {
    const min = minCasesFor(p);
    let n = parseInt(value, 10);
    if (isNaN(n) || n <= 0) n = 0;
    else if (n < min) n = min;
    setCaseQty((prev) => ({ ...prev, [p.sku]: n }));
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Selected products -> order items, plus running totals.
  // Never include an out-of-stock product (deactivated SKU or unavailable), even if it
  // somehow carries a case count. The server also rejects deactivated SKUs.
  const selected = products.filter(
    (p) => (caseQty[p.sku] || 0) >= 1 && p.is_active !== false && p.is_available !== false
  );
  const items = selected.map((p) => ({ sku: p.sku, cases: caseQty[p.sku] }));
  const totalCases = items.reduce((sum, it) => sum + it.cases, 0);
  const estimatedTotal = selected.reduce((sum, p) => sum + (p.case_price || 0) * caseQty[p.sku], 0);

  const method = form.fulfillment_method;
  const zip = form.zip.trim();
  const itemsKey = JSON.stringify(items);

  // Preview shipping/local-delivery cost. Pickup is always free; shipping and
  // local_delivery are quoted server-side once we have a ZIP and at least one item.
  // Debounced so typing a ZIP doesn't fire a request per keystroke.
  useEffect(() => {
    if (method === 'pickup') {
      setQuote({ status: 'ready', cost: 0, message: '' });
      return;
    }
    if (items.length === 0 || !/^\d{5}$/.test(zip)) {
      setQuote({ status: 'idle', cost: null, message: '' });
      return;
    }

    let cancelled = false;
    setQuote((q) => ({ ...q, status: 'loading' }));
    const t = setTimeout(async () => {
      const res = await getWholesaleShippingQuote({
        fulfillment_method: method, zip, items, order_total: estimatedTotal,
      });
      if (cancelled) return;
      if (res.response_code === '000') {
        setQuote({ status: 'ready', cost: res.cost, message: '' });
      } else if (res.response_code === '002') {
        setQuote({ status: 'ineligible', cost: null, message: res.response_message || '' });
      } else {
        setQuote({ status: 'error', cost: null, message: res.response_message || '' });
      }
    }, 500);

    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, zip, itemsKey, estimatedTotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mirror backend validation: business name, at least one item, every item sku + cases >= 1
    if (!form.business_name.trim()) {
      ShowToast('error', 'Please enter your business name.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      ShowToast('error', 'Please enter a valid email address.');
      return;
    }
    if (items.length === 0) {
      ShowToast('error', 'Add at least one product (set the number of cases).');
      scrollToForm();
      return;
    }
    if (!items.every((it) => it.sku && it.cases >= 1)) {
      ShowToast('error', 'Every selected item needs at least 1 case.');
      return;
    }
    // Enforce MOQ: every selected line must meet its minimum case count
    const belowMoq = selected.find((p) => caseQty[p.sku] < minCasesFor(p));
    if (belowMoq) {
      ShowToast('error', `Minimum order for ${belowMoq.name} is ${minCasesFor(belowMoq)} case${minCasesFor(belowMoq) === 1 ? '' : 's'}.`);
      return;
    }
    // Shipping/delivery need a ZIP to be fulfilled
    if ((method === 'shipping' || method === 'local_delivery') && !/^\d{5}$/.test(zip)) {
      ShowToast('error', 'Please enter a valid ZIP code for shipping or delivery.');
      return;
    }
    // Local delivery only serves the Phoenix metro
    if (method === 'local_delivery' && quote.status === 'ineligible') {
      ShowToast('error', 'Local delivery is only available in the Phoenix metro area. Please choose shipping or pickup.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitWholesaleOrder({ ...form, items });

    // Success: the order isn't placed yet — send the browser to Stripe Checkout.
    if (res.response_code === '000' && res.checkout_url) {
      window.location.href = res.checkout_url;
      return; // keep the button disabled through the redirect
    }

    setIsSubmitting(false);
    if (res.response_code === '002') {
      // Local delivery outside the Phoenix metro
      setQuote({ status: 'ineligible', cost: null, message: res.msg || '' });
      ShowToast('error', res.msg || 'Local delivery is only available in the Phoenix metro area. Please choose shipping or pickup.');
      return;
    }
    ShowToast('error', res.msg || 'Something went wrong. Please try again.');
  };

  return (
    <>
      <Seo
        title="Wholesale Orders"
        description="Order authentic West African spices, oils, beans, and Ebesse chili pastes by the case. Case-pack wholesale pricing and margins built for retail."
        path="/wholesale"
      />
      <Header />

      {/* Hero — image card style (matches the /bundle top section) */}
      <section className="relative overflow-hidden min-h-[540px] md:min-h-[650px] flex items-center justify-center">
        {/* Background image + amber gradient */}
        <div className="absolute inset-0 opacity-60">
          <div
            className="w-full h-full bg-gradient-to-r from-amber-800 via-transparent to-amber-800"
            style={{
              backgroundImage: `url(${HeroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-gp-yellow font-canaro-semibold text-sm sm:text-base mb-4">
            Wholesale Ordering
          </p>
          <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl font-caslon mb-5 leading-tight">
            <span className="block sm:whitespace-nowrap">Bring West African flavor</span>
            <span className="block">to your shelves</span>
          </h1>
          <p className="text-green-100 font-canaro-book text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Order authentic, small-batch spices, oils, legumes, and chili pastes from Golden Palm Foods
            by the case — with pricing and margins built for retail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="bg-gp-yellow text-gp-light-green px-8 py-3.5 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-yellow-400 transition-colors"
            >
              Start Your Order
            </button>
            <Link
              to="/wholesale-policy"
              className="inline-flex items-center justify-center border border-white/60 text-white px-8 py-3.5 rounded-lg text-base sm:text-lg font-canaro-book hover:bg-white/10 transition-colors"
            >
              Wholesale Policy
            </Link>
            <a
              href="https://api.goldenpalmfoods.com/uploads/wholesale/catalog.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/60 text-white px-8 py-3.5 rounded-lg text-base sm:text-lg font-canaro-book hover:bg-white/10 transition-colors"
            >
              <Download size={18} /> Download Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Why stock our products */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 overflow-x-clip md:overflow-x-visible">
        {/* Floating accents */}
        <img src={Asset17} alt="" className="block absolute top-2 right-1 md:-top-6 md:-right-4 w-[4.5rem] h-auto md:w-[10rem] rotate-12 pointer-events-none z-10" />
        <img src={Asset11} alt="" className="hidden md:block absolute bottom-[-2rem] left-[-3rem] w-[9rem] h-auto -rotate-12 opacity-90 pointer-events-none z-10" />

        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-caslon text-gp-light-green mb-1">Why Stock Our Products</h2>
          <img src={BrushYellow} alt="" className="mx-auto w-[55%] sm:w-[45%] md:w-[35%] mb-2" />
          <p className="text-gray-600 font-canaro-book text-base sm:text-lg">Bring bold West African flavors to your shelves.</p>
        </div>

        <div className="relative z-0 bg-gp-yellow rounded-[2rem] p-6 sm:p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
            {REASONS.map((r) => (
              <div key={r.title}>
                <h3 className="text-xl md:text-2xl font-caslon text-gp-light-green leading-tight">
                  {r.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-800 font-canaro-book leading-relaxed mt-1">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 overflow-x-clip md:overflow-x-visible">
        {/* Floating accent */}
        <img src={Asset3} alt="" className="block absolute top-4 right-1 md:top-8 md:-right-6 w-[4rem] h-auto md:w-[9rem] rotate-6 pointer-events-none" />

        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-caslon text-gp-light-green mb-1">Wholesale Catalog</h2>
          <img src={BrushYellow} alt="" className="mx-auto w-[55%] sm:w-[45%] md:w-[35%] mb-2" />
          <p className="text-gray-600 font-canaro-book text-base sm:text-lg">Case-pack pricing and suggested retail for every product.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-canaro-semibold transition-colors ${
                activeCategory === c.key
                  ? 'bg-gp-light-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex justify-center py-10"><Loader /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((p) => {
              // Deactivated SKU (is_active) or the retail/variation being unavailable both mean out of stock.
              const isOutOfStock = p.is_active === false || p.is_available === false;
              return (
              <article key={p.sku} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative bg-gp-cream/60 flex items-center justify-center h-52 p-4">
                  <img src={imgFor(p)} alt={p.name} className={`max-h-44 w-auto object-contain ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} loading="lazy" />
                  {isOutOfStock && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-canaro-semibold uppercase tracking-wide px-2.5 py-1 rounded-md">
                      Out of Stock
                    </span>
                  )}
                  {p.heat_level && (
                    <span className={`absolute ${isOutOfStock ? 'top-12' : 'top-3'} left-3 bg-red-600 text-white text-xs font-canaro-semibold uppercase tracking-wide px-2.5 py-1 rounded-md`}>
                      {p.heat_level}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-600 text-[0.7rem] font-canaro-semibold px-2 py-1 rounded">
                    {p.sku}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl font-caslon text-gp-light-green leading-tight">{p.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-canaro-book uppercase tracking-wide mb-3">
                    {p.origin} · Shelf life {p.shelf_life_months} mo
                  </p>

                  <p className="text-sm text-gray-600 font-canaro-book leading-relaxed mb-4 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    {[['Size', p.size], ['Case pack', p.case_pack], ['MOQ', p.moq]].map(([k, v]) => (
                      <div key={k} className="bg-gray-50 rounded-lg py-2">
                        <p className="text-[0.65rem] text-gray-400 uppercase tracking-wide font-canaro-book">{k}</p>
                        <p className="text-sm font-canaro-semibold text-gray-800">{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="mt-auto border-t border-gray-100 pt-4 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-canaro-book">Unit wholesale</span>
                      <span className="font-canaro-semibold text-gp-light-green">${p.unit_wholesale_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-canaro-book">Case price</span>
                      <span className="font-canaro-semibold text-gp-light-green">${p.case_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-canaro-book">Suggested retail</span>
                      <span className="font-canaro-semibold text-gray-800">${p.srp_min}–${p.srp_max}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1.5 border-t border-dashed border-gray-100">
                      <span className="text-gray-600 font-canaro-semibold">MOQ total</span>
                      <span className="font-canaro-semibold text-gp-light-green">${p.moq_total}</span>
                    </div>
                  </div>

                  {p.note && (
                    <p className="text-[0.7rem] text-red-500 font-canaro-book mt-3">* {p.note}</p>
                  )}

                  {/* Case quantity selector */}
                  {isOutOfStock ? (
                    <div className="mt-4 text-center bg-gray-50 border border-gray-200 rounded-lg py-2.5 text-sm font-canaro-semibold text-gray-400">
                      Out of stock
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-canaro-semibold text-gray-700">Cases</span>
                        {minCasesFor(p) > 1 && (
                          <span className="text-[0.7rem] text-gray-400 font-canaro-book">Min {minCasesFor(p)} cases</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(p, (caseQty[p.sku] || 0) <= minCasesFor(p) ? 0 : (caseQty[p.sku] - 1))}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                          disabled={(caseQty[p.sku] || 0) <= 0}
                          aria-label={`Decrease cases of ${p.name}`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={caseQty[p.sku] || 0}
                          onChange={(e) => setQty(p, e.target.value)}
                          className="w-14 text-center px-2 py-1.5 border border-gray-300 rounded-md text-gray-800 font-canaro-semibold focus:outline-none focus:ring-2 focus:ring-gp-light-green"
                        />
                        <button
                          type="button"
                          onClick={() => setQty(p, (caseQty[p.sku] || 0) + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                          aria-label={`Increase cases of ${p.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Order request form */}
      <section ref={formRef} className="bg-gp-light-green py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-caslon text-white mb-3">Place a Wholesale Order</h2>
            <p className="text-green-100 font-canaro-book text-base sm:text-lg">
              Set the number of cases you want in the catalog above, add your business details, and continue
              to secure payment via Stripe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 space-y-6">
              {/* Order summary */}
              <div>
                <h3 className="text-lg font-canaro-semibold text-gp-light-green mb-3">Your order</h3>
                {items.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 font-canaro-book">
                    No items yet — set the number of cases on the products above to build your order.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {selected.map((p) => (
                      <div key={p.sku} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                        <span className="font-canaro-book text-gray-700">
                          {p.name}{p.heat_level ? ` (${p.heat_level})` : ''}
                          <span className="text-gray-400"> · {p.sku}</span>
                        </span>
                        <span className="font-canaro-semibold text-gray-800 whitespace-nowrap">
                          {caseQty[p.sku]} {caseQty[p.sku] === 1 ? 'case' : 'cases'}
                          {p.case_price ? <span className="text-gray-400"> · ${p.case_price * caseQty[p.sku]}</span> : null}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50">
                      <span className="font-canaro-semibold text-gray-700">{totalCases} {totalCases === 1 ? 'case' : 'cases'} total</span>
                      <span className="font-canaro-semibold text-gp-light-green">Est. ${estimatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fulfillment method */}
              <div>
                <h3 className="text-lg font-canaro-semibold text-gp-light-green mb-3">Fulfillment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FULFILLMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, fulfillment_method: opt.value }))}
                      className={`px-4 py-3 rounded-lg border text-sm sm:text-base font-canaro-semibold transition-colors ${
                        form.fulfillment_method === opt.value
                          ? 'border-gp-light-green bg-green-50 text-gp-light-green'
                          : 'border-gray-300 text-gray-700 hover:border-gp-light-green'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {form.fulfillment_method === 'shipping' && (
                  <p className="mt-3 text-sm text-gray-600 font-canaro-book">
                    Shipped via UPS/USPS. Shipping is calculated by order weight and destination.
                  </p>
                )}
                {form.fulfillment_method === 'local_delivery' && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 font-canaro-book">
                    Local delivery in the Phoenix metro area: <span className="font-canaro-semibold">$15</span> ·
                    outside Phoenix (Tempe, Chandler, Mesa, etc.): <span className="font-canaro-semibold">$20</span> ·
                    <span className="font-canaro-semibold"> free for orders $500 and up</span>.
                  </div>
                )}
                {form.fulfillment_method === 'pickup' && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gp-light-green font-canaro-book">
                    Pick up at our production kitchen:
                    <br />
                    <span className="font-canaro-semibold">6727 N. 47th Ave, Glendale, AZ 85301</span>
                  </div>
                )}

                {/* Live cost preview for shipping / local delivery */}
                {(form.fulfillment_method === 'shipping' || form.fulfillment_method === 'local_delivery') && (
                  <div className="mt-3">
                    {quote.status === 'idle' && (
                      <p className="text-sm text-gray-500 font-canaro-book">
                        Enter your ZIP in the business details below to preview {form.fulfillment_method === 'shipping' ? 'shipping' : 'delivery'} cost.
                      </p>
                    )}
                    {quote.status === 'loading' && (
                      <p className="text-sm text-gray-500 font-canaro-book">
                        Estimating {form.fulfillment_method === 'shipping' ? 'shipping' : 'delivery'}…
                      </p>
                    )}
                    {quote.status === 'ready' && (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                        <span className="text-sm text-gp-light-green font-canaro-semibold">
                          Estimated {form.fulfillment_method === 'shipping' ? 'shipping' : 'delivery'}
                        </span>
                        <span className="text-sm text-gp-light-green font-canaro-semibold">
                          {Number(quote.cost) === 0 ? 'Free' : `$${Number(quote.cost).toFixed(2)}`}
                        </span>
                      </div>
                    )}
                    {quote.status === 'ineligible' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 font-canaro-book">
                        {quote.message || 'Local delivery is only available in the Phoenix metro area. Please choose shipping or pickup.'}
                      </div>
                    )}
                    {quote.status === 'error' && (
                      <p className="text-sm text-red-500 font-canaro-book">
                        {quote.message || 'Could not estimate cost right now — our team will confirm it on your invoice.'}
                      </p>
                    )}
                    {(quote.status === 'ready' || quote.status === 'loading') && (
                      <p className="mt-1.5 text-xs text-gray-400 font-canaro-book">
                        Preview only — the final charge is recomputed at checkout.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Business details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Business name" name="business_name" value={form.business_name} onChange={handleChange} required />
                <Field label="Contact name" name="contact_name" value={form.contact_name} onChange={handleChange} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <div>
                  <label className="block text-sm text-gray-700 font-canaro-semibold mb-1.5">Business type</label>
                  <select
                    name="business_type" value={form.business_type} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-700 font-canaro-book focus:outline-none focus:ring-2 focus:ring-gp-light-green"
                  >
                    <option value="">Select…</option>
                    <option value="retailer">Retailer / Grocery</option>
                    <option value="restaurant">Restaurant / Food service</option>
                    <option value="distributor">Distributor / Wholesaler</option>
                    <option value="online">Online store</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Field label="Website (optional)" name="website" value={form.website} onChange={handleChange} />
                <Field label="Business address" name="address" value={form.address} onChange={handleChange} />
                <Field label="City" name="city" value={form.city} onChange={handleChange} />
                <Field label="State" name="state" value={form.state} onChange={handleChange} />
                <Field label="ZIP" name="zip" value={form.zip} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-canaro-semibold mb-1.5">Message (optional)</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows="4"
                  placeholder="Delivery notes, timing, or any questions about your order."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-700 font-canaro-book focus:outline-none focus:ring-2 focus:ring-gp-light-green"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gp-light-green text-white py-3.5 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Redirecting to payment…' : `Continue to Payment${totalCases > 0 ? ` (${totalCases} ${totalCases === 1 ? 'case' : 'cases'})` : ''}`}
              </button>
              <p className="text-xs text-gray-400 font-canaro-book text-center">
                You'll complete payment securely via Stripe. Shipping/delivery is recomputed at checkout. By continuing, you agree to our{' '}
                <Link to="/wholesale-policy" className="underline hover:text-gp-light-green">wholesale terms</Link>.
              </p>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-caslon text-gp-light-green mb-1">Wholesale FAQ</h2>
          <img src={BrushYellow} alt="" className="mx-auto w-[50%] sm:w-[40%] md:w-[30%]" />
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-canaro-semibold text-gray-800 text-sm sm:text-base">{f.q}</span>
                <ChevronDown size={18} className={`text-gp-light-green flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-sm sm:text-base text-gray-600 font-canaro-book leading-relaxed">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

const Field = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="block text-sm text-gray-700 font-canaro-semibold mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-700 font-canaro-book focus:outline-none focus:ring-2 focus:ring-gp-light-green"
    />
  </div>
);
