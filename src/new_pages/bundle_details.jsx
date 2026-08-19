import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import Seo from '../components/seo';
import Loader from '../components/loader';
import ShareComponent from '../components/shareComponent';
import HeatLevelModal from '../components/heatLevelModal';
import { CartContext } from '../context/cartContext';
import { ShowToast } from '../components/showToast';
import useFunctions from '../utils/functions';
import { getHeatVariations } from '../utils/heatLevels';
import { sessionDataHelpers } from '../utils/db';

const StarDisplay = ({ rating, size = 20 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={size} className={star <= Math.round(rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'} />
    ))}
  </div>
);

// Review card: clamps long comments to 3 lines + hides admin reply behind a toggle.
const ReviewCard = ({ review }) => {
  const commentRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    const el = commentRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [review.comment]);

  return (
    <div className="flex-shrink-0 w-[85%] sm:w-[24rem] snap-start bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={18} className={s <= Math.round(review.rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'} />
          ))}
        </div>
        {review.createdAt && (
          <span className="text-xs sm:text-sm text-gray-500 font-canaro-light">
            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>

      {review.comment && (
        <div className="mb-4">
          <p ref={commentRef} className={`text-gray-700 font-canaro-light text-sm sm:text-base ${expanded ? '' : 'line-clamp-3'}`}>
            "{review.comment}"
          </p>
          {(isClamped || expanded) && (
            <button type="button" onClick={() => setExpanded(!expanded)} className="mt-1 text-xs font-canaro-semibold text-gp-light-green hover:text-gp-dark-green transition-colors">
              {expanded ? 'Show less' : 'Show all'}
            </button>
          )}
        </div>
      )}

      {review.user_email && (
        <p className="text-sm font-canaro-semibold text-gray-900">{review.user_email.split('@')[0]}</p>
      )}

      {review.admin_response && (
        <div className="mt-3">
          <button type="button" onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-xs font-canaro-semibold text-gp-light-green hover:text-gp-dark-green transition-colors">
            {showReply ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showReply ? 'Hide response' : 'View response from Golden Palm Foods'}
          </button>
          {showReply && (
            <div className="mt-2 ml-1 border-l-4 border-gp-light-green bg-green-50 rounded-r-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-canaro-semibold text-gp-light-green mb-1">Response from Golden Palm Foods:</p>
              <p className="text-sm text-gray-700 font-canaro-light">{review.admin_response}</p>
              {review.responded_at && (
                <p className="text-[0.7rem] sm:text-xs text-gray-500 font-canaro-light mt-2">
                  {new Date(review.responded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function BundleDetailsPage() {
  const { bundleId: bundleIdParam } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { getBundleDetail, getProductDetail, getItemReviews } = useFunctions();

  const [bundle, setBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [heatVariations, setHeatVariations] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const bundleId = bundleIdParam || await sessionDataHelpers.get('selectedBundleId');
      if (!bundleId) { navigate('/bundle'); return; }
      if (bundleIdParam) await sessionDataHelpers.set('selectedBundleId', bundleIdParam);

      setIsLoading(true);
      const res = await getBundleDetail(bundleId);
      if (res.response_code === '000') {
        setBundle(res.bundle);
        setIsLoading(false);
        fetchBundleReviews(bundleId);
      } else {
        setIsLoading(false);
        setLoadError(true);
        ShowToast('error', 'Bundle could not be loaded');
        setTimeout(() => navigate('/bundles?bt=all'), 2500);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleIdParam]);

  const fetchBundleReviews = async (bundleId) => {
    setReviewsLoading(true);
    const res = await getItemReviews(bundleId);
    if (res.response_code === '000') {
      setReviews(res.reviews || []);
      setAvgRating(res.avg_rating || 0);
      setReviewCount(res.review_count || 0);
    }
    setReviewsLoading(false);
  };

  // The curated data doesn't embed per-variation availability, so pull it per hot sub-product.
  const resolveBundleHeatVariations = async (b) => {
    const hotSubs = (b.product_details || []).filter(p => p.is_hot && p.sku);
    const detailed = [];
    for (const sub of hotSubs) {
      const r = await getProductDetail(sub.sku);
      if (r.response_code === '000' && r.product?.variations?.length) {
        detailed.push({ ...sub, is_hot: true, variations: r.product.variations });
      }
    }
    return getHeatVariations({ product_details: detailed });
  };

  const buildCartItem = (heatLevel) => {
    let totalWeight = bundle.shipping_weight || null;
    if (bundle.product_details) {
      totalWeight = bundle.product_details.reduce((sum, item) => sum + (parseFloat(item.shipping_weight) || 0), 0);
    }
    return {
      id: bundle.bundle_id,
      name: bundle.name,
      price: parseFloat(bundle.price),
      unit_price: parseFloat(bundle.price),
      quantity: 1,
      img_url: bundle.img_url,
      type: 'bundle',
      heat_level: heatLevel,
      shipping_weight: totalWeight,
      product_details: bundle.product_details,
    };
  };

  const handleAddToCart = async () => {
    if (!bundle || bundle.is_available === false) {
      ShowToast('error', `${bundle?.name || 'This bundle'} is out of stock`);
      return;
    }
    const hasHotProduct = bundle.product_details?.some(p => p.is_hot);
    if (hasHotProduct) {
      const variations = await resolveBundleHeatVariations(bundle);
      setHeatVariations(variations);
      setHeatModalOpen(true);
      return;
    }
    addToCart(buildCartItem(null));
    ShowToast('success', `${bundle.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    const chosen = heatVariations.find(v => v.heat_level?.toLowerCase() === heatLevel?.toLowerCase());
    if (chosen?.is_available === false) {
      ShowToast('error', `The ${heatLevel} option is out of stock`);
      return;
    }
    addToCart(buildCartItem(heatLevel));
    ShowToast('success', `${bundle.name} added to cart`);
  };

  if (isLoading) {
    return (<><Header /><div className="flex justify-center items-center min-h-screen"><Loader /></div><Footer /></>);
  }

  if (loadError || !bundle) {
    return (
      <>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-3">Bundle unavailable</h1>
          <p className="text-gray-600 font-canaro-book text-base sm:text-lg mb-6">We couldn't load this bundle. Taking you to bundles…</p>
          <div className="mb-6"><Loader /></div>
          <button onClick={() => navigate('/bundles?bt=all')} className="bg-gp-light-green text-white px-8 py-3 rounded-lg font-canaro-semibold hover:bg-green-800 transition-colors">
            View Bundles
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const isOutOfStock = bundle.is_available === false;
  const includedCount = (bundle.product_details || []).filter(p => p.is_available !== false).length;

  return (
    <>
      <Seo
        title={`${bundle.name} — West African Bundle`}
        description={`${bundle.name}: a curated Golden Palm Foods bundle of authentic West African pantry staples. ${bundle.product_details?.map(p => p.name).join(', ') || ''}`.slice(0, 160)}
        path={`/bundle-detail/${bundle.bundle_id}`}
        image={bundle.img_url ? `https://api.goldenpalmfoods.com${bundle.img_url}` : undefined}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: bundle.name,
          image: bundle.img_url ? `https://api.goldenpalmfoods.com${bundle.img_url}` : undefined,
          sku: bundle.bundle_id,
          brand: { '@type': 'Brand', name: 'Golden Palm Foods' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: parseFloat(bundle.price).toFixed(2),
            availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            url: `https://goldenpalmfoods.com/bundle-detail/${bundle.bundle_id}`,
          },
          ...(reviewCount > 0 ? {
            aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(avgRating).toFixed(1), reviewCount },
          } : {}),
        }}
      />
      <Header />

      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="mt-2 mb-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gp-light-green hover:text-gp-dark-green transition-colors font-canaro-semibold text-base sm:text-lg">
            <ArrowLeft size={20} /><span className="mt-1">Back</span>
          </button>
        </div>

        {/* Main */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-10">
          {/* Image */}
          <div className="relative flex items-center justify-center bg-gp-cream/40 rounded-2xl p-4">
            <img
              src={`https://api.goldenpalmfoods.com${bundle.img_url}`}
              alt={bundle.name}
              className={`w-full max-h-[30rem] object-contain rounded-lg ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-canaro-semibold uppercase tracking-wide">Out of Stock</div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-caslon text-gp-light-green leading-tight">{bundle.name}</h1>
            <p className="text-[2.5rem] md:text-5xl lg:text-6xl text-gp-light-green font-canaro-semibold">${bundle.price}</p>

            {reviewCount > 0 ? (
              <div className="flex items-center gap-2">
                <StarDisplay rating={avgRating} size={20} />
                <span className="text-sm text-gray-600 font-canaro-book">{parseFloat(avgRating).toFixed(1)} ({reviewCount})</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-canaro-book">No ratings yet</p>
            )}

            {bundle.discount_percentage && (
              <p className="text-base font-canaro-semibold text-gp-bright-green">Save ${bundle.discount_percentage} with this bundle</p>
            )}

            {/* Out-of-stock sub-items notice */}
            {bundle.product_details?.some(p => p.is_available === false) && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 font-canaro-book">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{bundle.product_details.filter(p => p.is_available === false).map(p => p.name).join(', ')} — currently out of stock. Prices adjusted.</span>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-canaro-book text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-colors ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-gp-light-green hover:bg-green-800'}`}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>

            <div className="flex justify-center [&>button]:!px-8 [&>button]:!py-3">
              <ShareComponent
                title="Share this bundle"
                buttonClassName="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gp-light-green text-gp-light-green hover:bg-gp-light-green hover:text-white transition-colors"
              >
                Share
              </ShareComponent>
            </div>
          </div>
        </div>

        {/* What's included */}
        {bundle.product_details?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-5">
              What's included <span className="text-gray-400 text-xl">({includedCount} items)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bundle.product_details.map((p, idx) => {
                const subOut = p.is_available === false;
                return (
                  <div key={p.sku || idx} className={`flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden ${subOut ? 'opacity-60' : ''}`}>
                    <div className="bg-gp-cream/40 flex items-center justify-center h-36 p-3">
                      {p.img_url && <img src={`https://api.goldenpalmfoods.com${p.img_url}`} alt={p.name} className="max-h-full w-auto object-contain" loading="lazy" />}
                    </div>
                    <div className="p-3">
                      <p className={`text-sm font-caslon ${subOut ? 'text-gray-400 line-through' : 'text-gp-light-green'}`}>{p.name}</p>
                      {subOut && <p className="text-[0.7rem] text-red-500 font-canaro-semibold mt-1">Out of stock</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        <div id="customer-reviews" className="mt-10 sm:mt-14 border-t border-gray-200 pt-8 sm:pt-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-caslon text-gp-light-green mb-6">Customer Reviews</h2>

          {reviewsLoading ? (
            <div className="flex justify-center items-center py-10"><Loader /></div>
          ) : reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-3 sm:gap-4 mb-8 flex-wrap">
                <span className="text-4xl sm:text-5xl font-canaro-semibold text-gp-light-green">{parseFloat(avgRating).toFixed(1)}</span>
                <div>
                  <StarDisplay rating={avgRating} size={24} />
                  <p className="text-sm sm:text-base text-gray-600 font-canaro-book mt-1">Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                {reviews.map((review, index) => <ReviewCard key={review.id || index} review={review} />)}
              </div>
            </>
          ) : (
            <p className="text-gray-500 font-canaro-book text-base sm:text-lg py-4">No reviews yet for this bundle.</p>
          )}
        </div>
      </div>

      <HeatLevelModal
        isOpen={heatModalOpen}
        onClose={() => { setHeatModalOpen(false); setHeatVariations([]); }}
        onSelect={handleHeatLevelSelect}
        productName={bundle.name}
        variations={heatVariations}
      />

      <Footer />
    </>
  );
}
