import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Asset16 from "../assets/images/asset_16.webp"
import Loader from '../components/loader';
import AuthenticImg from "../assets/images/authentic.png"
import NoPreImg from "../assets/images/no_pre.png"
import VarietyImg from "../assets/images/variety.png"
import Asset6Img from '../assets/images/asset_6.webp'
import { Facebook, Instagram, Tiktok, Minus, Plus, Flame, ArrowLeft, Star, Share2, ChevronDown, ChevronUp  } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import { CartContext } from '../context/cartContext';
import Header from '../components/header';
import Seo from '../components/seo';
import Asset8Img from '../assets/images/asset_8.webp'
import Footer from '../components/footer';
import CookingImgAlt from '../assets/images/bg2.webp'
import HeatLevelModal from '../components/heatLevelModal';
import ShareComponent from '../components/shareComponent';
import { sanitizeHtml, toPlainText } from '../utils/sanitize';
import { isOnSale, effectiveUnitPrice, percentOff } from '../utils/pricing';
import SaleBadge from '../components/saleBadge';
import { sessionDataHelpers } from '../utils/db';
import FacebookIcon from '../assets/icons/icons_facebook_yellow.png'
import InstagramIcon from '../assets/icons/icons_instagram_yellow.png'
import TiktokIcon from '../assets/icons/icons_tiktok_yellow.png'

// Keyword-rich, category-aware SEO title/description per product (matched by name).
// Commercial-intent phrasing for e-commerce search.
const PRODUCT_SEO_RULES = [
  { match: /bambara|bean|azigokui/i, title: (n) => `Buy ${n} (Azigokui) Online — USA`,
    kw: 'Buy Bambara beans (Azigokui) online in the USA — protein-rich, gluten-free West African beans.' },
  { match: /chili|ebesse|paste|hot sauce/i, title: (n) => `${n} — Scotch Bonnet Chili Sauce`,
    kw: 'Authentic West African chili paste & hot sauce made with scotch bonnet peppers.' },
  { match: /spice|season|mix|atikanli/i, title: (n) => `${n} — West African Seasoning`,
    kw: 'All-purpose West African spice blend & seasoning with grains of selim.' },
  { match: /palm/i, title: (n) => withRegion(n),
    kw: 'Unrefined West African red palm oil for authentic soups, stews & sauces.' },
  { match: /peanut/i, title: (n) => withRegion(n),
    kw: 'Unrefined African peanut cooking oil for frying, grilling & sautéing.' },
  { match: /coconut/i, title: (n) => withRegion(n),
    kw: 'Unrefined African coconut oil for cooking, baking & everyday use.' },
  { match: /oil/i, title: (n) => withRegion(n),
    kw: 'Unrefined West African cooking oil, minimally processed for authentic flavor.' },
];

// Prefix "West African" for keyword value, unless the name already carries a region word.
const withRegion = (n) => (/west african|african/i.test(n) ? n : `West African ${n}`);

const buildProductSeo = (product) => {
  const name = product?.name || '';
  const baseDesc = product?.description ? toPlainText(product.description) : '';

  // 1) Explicit SEO fields from the API win (so new products are covered without a code change)
  if (product?.seo_title || product?.seo_description) {
    return {
      title: product.seo_title || `Buy ${name} Online`,
      description: (product.seo_description || `${baseDesc}`).trim().slice(0, 160),
    };
  }

  // 2) Otherwise, match keywords in the product name
  const rule = PRODUCT_SEO_RULES.find((r) => r.match.test(name));
  if (rule) {
    return { title: rule.title(name), description: `${rule.kw} ${baseDesc}`.trim().slice(0, 160) };
  }

  // 3) Generic, still-valid fallback for anything unmatched
  return {
    title: `Buy ${name} Online`,
    description: `Buy ${name} online — an authentic West African pantry staple from Golden Palm Foods. ${baseDesc}`.trim().slice(0, 160),
  };
};

// A single customer-review card: clamps long comments to 3 lines (Show all toggle)
// and hides the admin reply behind a "View response" toggle.
const ProductReviewCard = ({ review }) => {
  const commentRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    const el = commentRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [review.comment]);

  const stars = (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          className={star <= Math.round(review.rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  return (
    <div className="flex-shrink-0 w-[85%] sm:w-[24rem] snap-start bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
      <div className="flex justify-between items-start mb-3">
        {stars}
        {review.createdAt && (
          <span className="text-xs sm:text-sm text-gray-500 font-canaro-light">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        )}
      </div>

      {/* Comment (clamped to 3 lines with a Show all / Show less toggle) */}
      {review.comment && (
        <div className="mb-4">
          <p
            ref={commentRef}
            className={`text-gray-700 font-canaro-light text-sm sm:text-base ${expanded ? '' : 'line-clamp-3'}`}
          >
            "{review.comment}"
          </p>
          {(isClamped || expanded) && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs font-canaro-semibold text-gp-light-green hover:text-gp-dark-green transition-colors"
            >
              {expanded ? 'Show less' : 'Show all'}
            </button>
          )}
        </div>
      )}

      {review.user_email && (
        <p className="text-sm font-canaro-semibold text-gray-900">
          {review.user_email.split('@')[0]}
        </p>
      )}

      {/* Admin reply - hidden until the user chooses to view it */}
      {review.admin_response && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1 text-xs font-canaro-semibold text-gp-light-green hover:text-gp-dark-green transition-colors"
          >
            {showReply ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showReply ? 'Hide response' : 'View response from Golden Palm Foods'}
          </button>

          {showReply && (
            <div className="mt-2 ml-1 border-l-4 border-gp-light-green bg-green-50 rounded-r-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-canaro-semibold text-gp-light-green mb-1">
                Response from Golden Palm Foods:
              </p>
              <p className="text-sm text-gray-700 font-canaro-light">
                {review.admin_response}
              </p>
              {review.responded_at && (
                <p className="text-[0.7rem] sm:text-xs text-gray-500 font-canaro-light mt-2">
                  {new Date(review.responded_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [currentImage, setCurrentImage] = useState('');
  const [currentAdditionalImages, setCurrentAdditionalImages] = useState([]);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedHeatLevel, setSelectedHeatLevel] = useState('');
  const [showIngredients, setShowIngredients] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { getProductDetail, addCartItem, getItemReviews } = useFunctions();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { sku: skuParam } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Prefer the SKU from the URL (so product links are shareable),
        // fall back to the last-selected SKU stored in Dexie.
        const sku = skuParam || await sessionDataHelpers.get('selectedProductSku');

        if (sku) {
          // Keep Dexie in sync so other views (e.g. cart) still resolve the product
          if (skuParam) await sessionDataHelpers.set('selectedProductSku', skuParam);

          setIsLoading(true);
          const response = await getProductDetail(sku);

          if (response.response_code === "000") {
            console.log(response.product);
            setProduct(response.product);
            setRelatedProducts(response.related_products || []);
            setCurrentImage(response.product.img_url);
            setCurrentAdditionalImages(response.product.additional_images || []);

            // Set default heat level if product is hot — prefer the first AVAILABLE variation
            if (response.product.is_hot && response.product.variations?.length > 0) {
              const defaultVariation =
                response.product.variations.find(v => v.is_available !== false) ||
                response.product.variations[0];
              setSelectedHeatLevel(defaultVariation.heat_level);
              setCurrentImage(defaultVariation.img_url);
              setCurrentAdditionalImages(defaultVariation.additional_images || []);
            }

            setIsLoading(false);
            fetchItemReviews(sku);
            return;
          }

          setIsLoading(false);
          setLoadError(true);
          ShowToast("error", "Product details retrieval failed");
          // Let the user see the error, then send them to the shop
          setTimeout(() => navigate('/bundle'), 2500);
          return;
        } else{
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setIsLoading(false);
        setLoadError(true);
        ShowToast("error", "Failed to load product");
        setTimeout(() => navigate('/bundle'), 2500);
      }
    };

    fetchProductData();
  }, [skuParam]);

  const fetchItemReviews = async (sku) => {
    setReviewsLoading(true);
    const response = await getItemReviews(sku);
    if (response.response_code === '000') {
      setReviews(response.reviews || []);
      setAvgRating(response.avg_rating || 0);
      setReviewCount(response.review_count || 0);
    }
    setReviewsLoading(false);
  };

  // When navigated here from a product's rating, scroll to the Customer Reviews section
  useEffect(() => {
    if (location.state?.scrollToReviews && !isLoading && product && !reviewsLoading) {
      const el = document.getElementById('customer-reviews');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Clear the flag so it doesn't re-trigger on subsequent renders
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, isLoading, product, reviewsLoading]);

  const StarDisplay = ({ rating, size = 20 }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  // Open a related product's detail page (by sku, falling back to slug)
  const goToRelated = async (item) => {
    const ref = item.sku || item.slug;
    if (!ref) return;
    await sessionDataHelpers.set('selectedProductSku', ref);
    navigate(`/product-detail/${ref}`);
    window.scrollTo(0, 0);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleHeatLevelChange = (e) => {
    const heatLevel = e.target.value;
    setSelectedHeatLevel(heatLevel);

    // Update image and additional images based on selected heat level
    if (product.variations) {
      const variation = product.variations.find(
        v => v.heat_level.toLowerCase() === heatLevel.toLowerCase()
      );
      if (variation) {
        setCurrentImage(variation.img_url);
        setCurrentAdditionalImages(variation.additional_images || []);
      }
    }
  };

  // Get the main image URL for the current variant or base product
  const getMainImageUrl = () => {
    if (product?.is_hot && selectedHeatLevel && product?.variations) {
      const variation = product.variations.find(
        v => v.heat_level.toLowerCase() === selectedHeatLevel.toLowerCase()
      );
      return variation?.img_url || product?.img_url;
    }
    return product?.img_url;
  };

  // Handle mouse move for zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // The currently selected variation object (for hot products)
  const getSelectedVariation = () => {
    if (!product?.is_hot || !product?.variations || !selectedHeatLevel) return null;
    return product.variations.find(
      v => v.heat_level.toLowerCase() === selectedHeatLevel.toLowerCase()
    );
  };

  // A variation is unavailable when is_available === false (absent field => available)
  const isVariationUnavailable = (variation) => variation?.is_available === false;

  // Whole product is out of stock if the product itself is unavailable OR every variation is unavailable
  const allVariationsUnavailable =
    product?.is_hot &&
    product?.variations?.length > 0 &&
    product.variations.every(v => v.is_available === false);
  const isProductOutOfStock = product?.is_available === false || allVariationsUnavailable;

  // Sale pricing: effectivePrice is what the customer pays and what we send as unit_price
  const onSale = isOnSale(product);
  const effectivePrice = effectiveUnitPrice(product);
  const saleOff = percentOff(product);

  const handleAddToCart = async () => {
    if (!product) return;

    if (isProductOutOfStock) {
      ShowToast("error", `${product.name} is out of stock`);
      return;
    }

    // Check if product requires heat level but none is selected
    if (product.is_hot && !selectedHeatLevel) {
      ShowToast("error", "Please select a heat level");
      return;
    }

    // Block adding an out-of-stock variation
    const selectedVariation = getSelectedVariation();
    if (product.is_hot && isVariationUnavailable(selectedVariation)) {
      ShowToast("error", `The ${selectedHeatLevel} option is out of stock`);
      return;
    }

    // Confirm availability with the backend, which now rejects out-of-stock items
    const { response_code, response_message } = await addCartItem({
      session_id: localStorage.getItem('cart_session_id'),
      sku: product.sku,
      heat_level: product.is_hot ? selectedHeatLevel : null,
      quantity: quantity
    });

    if (response_code === "002") {
      ShowToast("error", response_message || `${product.name} is out of stock`);
      return;
    }

    const cartItem = {
      id: product.sku,
      name: product.name,
      price: effectivePrice * quantity,
      unit_price: effectivePrice,
      quantity: quantity,
      img_url: currentImage,
      type: 'product',
      heat_level: product.is_hot ? selectedHeatLevel : null,
      shipping_weight: product.shipping_weight || null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!product) return;

    // Update image and additional images based on selected heat level
    if (product.variations) {
      const variation = product.variations.find(
        v => v.heat_level.toLowerCase() === heatLevel.toLowerCase()
      );
      if (variation) {
        setCurrentImage(variation.img_url);
        setCurrentAdditionalImages(variation.additional_images || []);
      }
    }

    const cartItem = {
      id: product.sku,
      name: product.name,
      price: effectivePrice * quantity,
      unit_price: effectivePrice,
      quantity: quantity,
      img_url: currentImage,
      type: 'product',
      heat_level: heatLevel,
      shipping_weight: product.shipping_weight || null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  const metaDesc = product?.description ? toPlainText(product.description).slice(0, 160) : undefined;
  const productSeo = product ? buildProductSeo(product) : { title: undefined, description: undefined };
  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: currentImage ? `https://api.goldenpalmfoods.com${currentImage}` : undefined,
    description: metaDesc,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Golden Palm Foods' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: !isNaN(effectivePrice) ? effectivePrice.toFixed(2) : undefined,
      availability: isProductOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `https://goldenpalmfoods.com/product-detail/${product.sku}`,
    },
    ...(reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(avgRating).toFixed(1),
        reviewCount,
      },
    } : {}),
  } : null;

  return (
    <>
      <Seo
        title={productSeo.title}
        description={productSeo.description || metaDesc}
        path={`/product-detail/${skuParam || product?.sku || ''}`}
        image={currentImage ? `https://api.goldenpalmfoods.com${currentImage}` : undefined}
        type="product"
        jsonLd={productJsonLd}
      />
      <Header />

      { isLoading ?
        <div className='flex justify-center items-center min-h-screen'>
          <Loader/>
        </div>
       : (loadError || !product) ?
        <div className='flex flex-col justify-center items-center min-h-[60vh] px-4 text-center mb-8 mt-8'>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-3">Product unavailable</h1>
          <p className="text-gray-600 font-canaro-book text-base sm:text-lg mb-6">
            We couldn't load this product. Taking you to the shop…
          </p>
          <div className="mb-6"><Loader/></div>
          <button
            onClick={() => navigate('/bundle')}
            className="bg-gp-light-green text-white px-8 py-3 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-green-800 transition-colors"
          >
            Go to Shop
          </button>
        </div>
       :
        <>
          <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            {/* Product Title */}
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="flex justify-center items-center gap-2 text-gp-light-green hover:text-gp-dark-green transition-colors font-canaro-semibold text-base sm:text-lg"
              >
                <ArrowLeft size={20} />
                <span className='mt-1'>Back</span>
              </button>
            </div>
            <div className="text-left mb-4 sm:mb-4 md:mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-2 font-caslon text-gp-light-green">{product?.name}</h1>
              <p className="text-gray-600 uppercase tracking-wider text-sm sm:text-base md:text-lg font-canaro-book">
                {product?.highlights || 'Bold · Flavorful & Versatile'}
              </p>
            </div>

            {/* Product Main Content */}
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-8 md:mb-20">
              {/* Left Column - Image and Gallery */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                {/* Additional Images Thumbnails - Vertical on the left */}
                {(currentAdditionalImages?.length > 0 || product?.additional_images?.length > 0) && (
                  <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[30rem]">
                    {/* Main image thumbnail */}
                    <div
                      onClick={() => setCurrentImage(getMainImageUrl())}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentImage === getMainImageUrl()
                          ? 'border-gp-light-green'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={`https://api.goldenpalmfoods.com${getMainImageUrl()}`}
                        // src={`http://localhost:5001${getMainImageUrl()}`}
                        alt={`${product.name} main`}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                      />
                    </div>

                    {/* Additional images thumbnails - show variant images if available, otherwise show base product images */}
                    {(currentAdditionalImages?.length > 0 ? currentAdditionalImages : product?.additional_images || []).map((imgUrl, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImage(imgUrl)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          currentImage === imgUrl
                            ? 'border-gp-light-green'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={`https://api.goldenpalmfoods.com${imgUrl}`}
                          // src={`http://localhost:5001${imgUrl}`}
                          alt={`${product.name} ${index + 1}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Image with Zoom */}
                <div className="relative flex-1">
                  {/* Sale badge sits on the outer wrapper so overflow-hidden below doesn't clip it */}
                  {onSale && (
                    <SaleBadge className="absolute -top-5 right-[0.35rem] md:right-[-0.25rem] z-20" />
                  )}

                  <div
                    className="relative overflow-hidden rounded-lg"
                    onMouseEnter={() => setShowZoom(true)}
                    onMouseLeave={() => setShowZoom(false)}
                    onMouseMove={handleMouseMove}
                  >
                    <img
                      // src={`http://localhost:5001${currentImage}`}
                      src={`https://api.goldenpalmfoods.com${currentImage}`}
                      alt={product?.name}
                      className="w-full max-h-[30rem] h-full object-cover cursor-zoom-in"
                    />

                    {/* Zoomed overlay */}
                    {showZoom && (
                      <div
                        className="hidden md:block absolute inset-0 bg-white pointer-events-none"
                        style={{
                          backgroundImage: `url(https://api.goldenpalmfoods.com${currentImage})`,
                          // backgroundImage: `url(http://localhost:5001${currentImage})`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundSize: '200%',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-1 sm:space-y-6">
                {/* Brand and Price */}
                <div>
                  <h2 className="text-[2.2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] text-gp-black italic font-dry-brush">{product?.slug}</h2>
                  <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap">
                    <span className="text-[1.8rem] md:text-5xl lg:text-6xl text-gp-light-green font-canaro-semibold">${effectivePrice.toFixed(2)}</span>
                    {onSale && (
                      <span className="text-base sm:text-lg md:text-xl text-gray-500 line-through">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    )}
                    {onSale && saleOff > 0 && (
                      <span className="bg-red-600 text-white text-xs sm:text-sm font-canaro-semibold uppercase tracking-wide px-2.5 py-1 rounded-md">
                        Sale · {saleOff}% off
                      </span>
                    )}
                    {!onSale && product?.discount_percentage && parseFloat(product?.discount_percentage) > 0 && (
                      <span className="text-base sm:text-lg md:text-xl text-gray-500 line-through">
                        ${(parseFloat(product?.price) / (1 - parseFloat(product?.discount_percentage) / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {isProductOutOfStock && (
                    <div className="mt-3 inline-block bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base font-canaro-semibold uppercase tracking-wide">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Heat Level Selector */}
                {product?.is_hot && product?.variations && product.variations.length > 0 && (
                  <div>
                    <label className="block text-gray-700 font-canaro-semibold mb-2 text-base sm:text-lg flex items-center gap-2">
                      <Flame className="text-red-600" size={20} />
                      Select Heat Level
                    </label>
                    <select
                      value={selectedHeatLevel}
                      onChange={handleHeatLevelChange}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg font-canaro-book focus:outline-none focus:ring-2 focus:ring-gp-light-green"
                    >
                      {product.variations.map((variation, index) => {
                        const unavailable = variation.is_available === false;
                        return (
                          <option
                            key={index}
                            value={variation.heat_level}
                            disabled={unavailable}
                            style={unavailable ? { color: '#9ca3af' } : undefined}
                          >
                            {variation.heat_level}{unavailable ? ' — Out of stock' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="flex items-stretch gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isProductOutOfStock}
                    className={`flex-1 font-canaro-book text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-colors ${
                      isProductOutOfStock
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gp-light-green hover:bg-green-800'
                    }`}
                  >
                    {isProductOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                  </button>

                  {/* Share this product */}
                  <ShareComponent
                    title="Share this product"
                    buttonClassName="flex-shrink-0 flex items-center justify-center w-12 sm:w-14 rounded-lg border border-gp-light-green text-gp-light-green hover:bg-gp-light-green hover:text-white transition-colors"
                  >
                    <Share2 size={22} />
                  </ShareComponent>
                </div>

              </div>
            </div>

            <div>
              {/* Product Description - HTML fragment from API, sanitized on render (defense in depth).
                  Plain-text descriptions still render correctly through the same path. */}
              {product?.description && (
                <div
                  className="product-description text-gray-700 text-base sm:text-lg md:text-[20px] lg:text-[26px] leading-relaxed md:leading-[1.5]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              )}

              {/* Ingredients Section */}
              {product?.ingredients && (
                <div className='mt-6 sm:mt-8 bg-amber-50 border-l-4 border-gp-light-green p-4 sm:p-6 rounded-r-lg'>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green">
                      Ingredients
                    </h3>
                    <button
                      onClick={() => setShowIngredients(!showIngredients)}
                      className="bg-gp-light-green hover:bg-gp-dark-green text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-canaro-semibold transition-colors"
                    >
                      {showIngredients ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showIngredients && (
                    <>
                      <ul className="space-y-2 text-gray-800 font-canaro-book">
                        {(Array.isArray(product.ingredients)
                          ? product.ingredients
                          : product.ingredients.split(',').map(i => i.trim())
                        ).map((ingredient, index) => (
                          <li key={index} className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-relaxed">
                            • {ingredient}
                          </li>
                        ))}
                      </ul>
                      <p className="text-gray-600 text-sm sm:text-base mt-4 font-canaro-light italic">
                        * Please review ingredients carefully if you have food allergies or dietary restrictions.
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Perfect For Section */}
              <div className='mt-6 sm:mt-8'>
                <h3 className="text-2xl sm:text-3xl md:text-4xl mb-3 font-caslon text-gp-light-green">Perfect for:</h3>
                <ul className="space-y-4 text-gray-700 font-canaro-light">
                  { product?.uses.length > 0 ?
                    <>
                      {product.uses.map((use, index) => {
                        return <li className='!text-base sm:!text-lg md:!text-xl lg:!text-[26px]' key={index}>• {use}</li>
                      })}
                    </>
                    :
                    <li>No uses listed</li>
                  }
                </ul>
              </div>
            </div>
            {/* Features Grid */}
            <div className="flex flex-col py-4">
              <div className='mt-4'>
                <h3 className="font-caslon text-gp-light-green text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3">{product?.metadata?.[0]?.tagline || 'Bold Flavor, Clean Ingredients'}:</h3>
              </div>
              {product?.metadata?.[0]?.preservative?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4">
                  <img src={NoPreImg} className='w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-[10rem] lg:h-[10rem] flex-shrink-0' alt="No preservatives"/>
                  <div>
                    <h4 className="font-canaro-semibold !text-[18px] md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].preservative.title}:</h4>
                    <p className="font-canaro-light !text-[16px] md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].preservative.description}</p>
                  </div>
                </div>
              )}

              {product?.metadata?.[0]?.authentic?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <img src={AuthenticImg} className='w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 lg:w-[18rem] lg:h-[7rem] flex-shrink-0' alt="Authentic"/>
                  <div>
                    <h4 className="font-canaro-semibold !text-[18px] md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].authentic.title}:</h4>
                    <p className="font-canaro-light !text-[16px] md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].authentic.description}</p>
                  </div>
                </div>
              )}

              {product?.metadata?.[0]?.other?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <img src={VarietyImg} className='w-16 h-12 sm:w-20 sm:h-14 md:w-28 md:h-20 lg:w-[10rem] lg:h-[7rem] flex-shrink-0' alt="Variety"/>
                  <div>
                    <h4 className="font-canaro-semibold !text-[18px] md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].other.title}:</h4>
                    <p className="font-canaro-light !text-[16px] md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].other.description}</p>
                  </div>
                </div>
              )}

              {product?.metadata?.[0]?.heat?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 md:mt-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Flame className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-canaro-semibold !text-[18px] md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].heat.title}:</h4>
                    <p className="font-canaro-light !text-[16px] md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].heat.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews */}
            <div id="customer-reviews" className="mt-10 sm:mt-14 md:mt-16 border-t border-gray-200 pt-8 sm:pt-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-caslon text-gp-light-green mb-6">
                Customer Reviews
              </h3>

              {reviewsLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader />
                </div>
              ) : reviewCount > 0 ? (
                <>
                  {/* Average rating summary */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-8 flex-wrap">
                    <span className="text-4xl sm:text-5xl font-canaro-semibold text-gp-light-green">
                      {parseFloat(avgRating).toFixed(1)}
                    </span>
                    <div>
                      <StarDisplay rating={avgRating} size={24} />
                      <p className="text-sm sm:text-base text-gray-600 font-canaro-book mt-1">
                        Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>

                  {/* Reviews list - horizontal scroll */}
                  <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                    {reviews.map((review, index) => (
                      <ProductReviewCard key={review.id || index} review={review} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 font-canaro-book text-base sm:text-lg py-4">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>

            {/* You may also like */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-8 sm:pt-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-caslon text-gp-light-green mb-6 sm:mb-8">
                  You may also like
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {relatedProducts.map((item, index) => {
                    const relOnSale = isOnSale(item);
                    const relPrice = effectiveUnitPrice(item);
                    return (
                      <div
                        key={item.sku || item.slug || index}
                        onClick={() => goToRelated(item)}
                        className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="bg-gp-cream/40 flex items-center justify-center h-40 sm:h-48 p-3">
                          <img
                            src={`https://api.goldenpalmfoods.com${item.img_url}`}
                            alt={item.name}
                            className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col flex-1 p-3 sm:p-4">
                          <h4 className="text-sm sm:text-base font-caslon text-gp-light-green leading-tight mb-1 line-clamp-2">
                            {item.name}
                          </h4>

                          {/* Rating */}
                          {item.review_count > 0 ? (
                            <div className="flex items-center gap-1.5 mb-2">
                              <StarDisplay rating={item.avg_rating} size={14} />
                              <span className="text-xs text-gray-500 font-canaro-book">
                                {parseFloat(item.avg_rating).toFixed(1)} ({item.review_count})
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 mb-2">
                              <StarDisplay rating={0} size={14} />
                              <span className="text-xs text-gray-400 font-canaro-book">No ratings yet</span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="mt-auto flex items-baseline gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-canaro-semibold text-gp-light-green">
                              ${relPrice.toFixed(2)}
                            </span>
                            {relOnSale && (
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ${parseFloat(item.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Images Gallery */}

            <div className="flex justify-center space-x-4 md:space-x-8 mt-6 sm:mt-8 md:mt-16 z-10 mb-8 sm:mb-10 md:mb-12">
              <img src={Asset16} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-4xl" alt="Product gallery"/>
            </div>

            {/* Recipe Image */}
            <div onClick={() => navigate('/recipes')} className="relative rounded-2xl overflow-hidden mb-8 sm:mb-10 md:mb-12 cursor-pointer">
              <img
                src={CookingImgAlt}
                alt="Dishes made with Ebesse"
                className="w-full h-full md:h-[30rem] lg:h-[35rem] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                <h2 className="text-[#f37200] text-xl sm:text-3xl md:text-5xl lg:text-[8rem] font-canaro-semibold p-4 sm:p-6 md:p-8">RECIPES {'>>'}</h2>
              </div>
            </div>
          </div>
          <div className='hidden md:grid grid-cols-3 gap-4'>
            <img src={Asset6Img} className='w-full max-w-[12rem] h-auto max-h-[34rem] object-cover' alt="" />
            <div className='flex justify-center items-center'>
              <div className="text-center py-12">
                <h3 className="text-3xl md:text-4xl lg:text-[5rem] font-dry-brush leading-[1] text-gp-light-green">Mi Dounou</h3>
                <p className="text-gray-800 font-canaro-semibold text-base md:text-lg mb-2">"Let's Eat"</p>
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <a
                    href="https://www.facebook.com/goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <img src={FacebookIcon} className='w-[3rem]'/>
                  </a>
                  <a
                    href="https://www.instagram.com/goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <img src={InstagramIcon} className='w-[3rem]' />
                  </a>
                  <a
                    href="https://www.tiktok.com/@goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on TikTok"
                  >
                    <img src={TiktokIcon} className='w-[3rem]' />
                  </a>
                </div>
                <p className="text-gray-800 font-canaro-semibold text-base md:text-lg mt-1">@Goldenpalmfoods</p>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <img src={Asset8Img} className='w-full max-w-[25rem] h-auto max-h-[30rem] object-cover' alt="" />
            </div>
          </div>
          <div className='md:hidden flex flex-col items-center py-8 px-4'>
            <div className="text-center mb-6">
              <h3 className="text-4xl sm:text-5xl font-dry-brush leading-[1] text-gp-light-green">Mi Dounou</h3>
              <p className="text-gray-800 font-canaro-semibold text-base sm:text-lg">"Let's Eat"</p>
              <div className="flex items-center justify-center space-x-4">
                  <a
                    href="https://www.facebook.com/goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <img src={FacebookIcon} className='w-[2rem]'/>
                  </a>
                  <a
                    href="https://www.instagram.com/goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <img src={InstagramIcon} className='w-[2rem]' />
                  </a>
                  <a
                    href="https://www.tiktok.com/@goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on TikTok"
                  >
                    <img src={TiktokIcon} className='w-[2rem]' />
                  </a>
                </div>
              <p className="text-gray-800 font-canaro-semibold text-base sm:text-lg mt-1">@Goldenpalmfoods</p>
            </div>
          </div>
        </>
      }

      <HeatLevelModal
        isOpen={heatModalOpen}
        onClose={() => setHeatModalOpen(false)}
        onSelect={handleHeatLevelSelect}
        productName={product?.name}
      />

      <Footer/>
    </>
  );
};