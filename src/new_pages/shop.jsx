import React, { useState, useEffect, useContext } from 'react';
import ShitoImg from '../assets/shito.png'
import { isOnSale, effectiveUnitPrice, percentOff } from '../utils/pricing'
import { Info, ArrowLeft, AlertTriangle, Star } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import { CartContext } from '../context/cartContext';
import Header from '../components/header';
import Seo from '../components/seo';
import LogoAlt from "../assets/images/logo.png"
import { useSearchParams, useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import HeatLevelModal from '../components/heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';
import { sessionDataHelpers } from '../utils/db';

export default function ShopPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { getProductsByCategory, getProductsAndBundles } = useFunctions();
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const typeParam = searchParams.get('tp');

      let response;
      if (typeParam === 'all') {
        // Use products-and-bundles endpoint when tp=all
        response = await getProductsAndBundles();
      } else {
        // Use regular products endpoint
        response = await getProductsByCategory(typeParam);
      }

      if (response.response_code === '000') {
        if (typeParam === 'all' && response.bundles) {
          // Merge products and bundles when typeParam is 'all'
          const allItems = [...(response.products || []), ...(response.bundles || [])];
          setProducts(allItems);
          setFilteredProducts(allItems);
        } else {
          setProducts(response.products);
          setFilteredProducts(response.products);
        }
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      ShowToast("error", "Error getting product info")
      return
    };
    fetchProducts();
  }, [searchParams]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (product.is_available === false) {
      ShowToast("error", `${product.name} is out of stock`);
      return;
    }

    // Check if it's a bundle (has product_details)
    const isBundle = product.product_details && product.product_details.length > 0;
    const hasHotProduct = isBundle ? product.product_details?.some(p => p.is_hot) : product.is_hot;

    // For products that require heat level, show modal first
    if (hasHotProduct) {
      setSelectedProduct(product);
      setHeatModalOpen(true);
      return;
    }

    // Calculate shipping weight for bundles by summing product_details shipping weights
    let totalWeight = product.shipping_weight || null;
    if (isBundle && product.product_details) {
      totalWeight = product.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.shipping_weight) || 0);
      }, 0);
    }

    // For products without heat level requirement, add directly
    const cartItem = {
      id: isBundle ? product.bundle_id : product.sku,
      name: product.name,
      price: effectiveUnitPrice(product),
      unit_price: effectiveUnitPrice(product),
      quantity: 1,
      img_url: product.img_url,
      type: isBundle ? 'bundle' : 'product',
      heat_level: null,
      shipping_weight: totalWeight,
      product_details: isBundle ? product.product_details : null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedProduct) return;

    // Defense in depth: never add an out-of-stock variation even if it slipped through the modal
    const chosenVariation = getHeatVariations(selectedProduct).find(
      v => v.heat_level?.toLowerCase() === heatLevel?.toLowerCase()
    );
    if (chosenVariation?.is_available === false) {
      ShowToast("error", `The ${heatLevel} option is out of stock`);
      return;
    }

    const isBundle = selectedProduct.product_details && selectedProduct.product_details.length > 0;

    // Calculate shipping weight for bundles by summing product_details shipping weights
    let totalWeight = selectedProduct.shipping_weight || null;
    if (isBundle && selectedProduct.product_details) {
      totalWeight = selectedProduct.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.shipping_weight) || 0);
      }, 0);
    }

    const cartItem = {
      id: isBundle ? selectedProduct.bundle_id : selectedProduct.sku,
      name: selectedProduct.name,
      price: effectiveUnitPrice(selectedProduct),
      unit_price: effectiveUnitPrice(selectedProduct),
      quantity: 1,
      img_url: selectedProduct.img_url,
      type: isBundle ? 'bundle' : 'product',
      heat_level: heatLevel,
      shipping_weight: totalWeight,
      product_details: isBundle ? selectedProduct.product_details : null
    };

    addToCart(cartItem);
    ShowToast("success", `${selectedProduct.name} added to cart`);
    setSelectedProduct(null);
  };

  // Navigate to a product's detail page and auto-scroll to its Customer Reviews section
  const goToReviews = async (e, product) => {
    e.stopPropagation();
    await sessionDataHelpers.set('selectedProductSku', product.sku);
    navigate(`/product-detail/${product.sku}`, { state: { scrollToReviews: true } });
  };

  const StarDisplay = ({ rating, size = 18 }) => (
    <div className="flex items-center gap-0.5 leading-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`block shrink-0 ${star <= Math.round(rating) ? 'fill-gp-yellow text-gp-yellow' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  // Get category display name based on tp parameter
  const getCategoryName = () => {
    const typeParam = searchParams.get('tp');
    if (!typeParam) return 'All';

    const categoryMap = {
      'all': 'All',
      'oil': 'Oils',
      'oils': 'Oils',
      'spice': 'Spices',
      'spices': 'Spices',
      'sauce': 'Sauces',
      'sauces': 'Sauces',
      'condiment': 'Condiments',
      'condiments': 'Condiments'
    };

    return categoryMap[typeParam.toLowerCase()] || typeParam.charAt(0).toUpperCase() + typeParam.slice(1);
  };

  return (
    <>
      <Seo
        title={getCategoryName() === 'All'
          ? 'Shop West African & Specialty International Ingredients'
          : `Shop West African ${getCategoryName()}`}
        description={getCategoryName() === 'All'
          ? 'Browse specialty food products and international cooking ingredients — West African oils, spices, Bambara beans & chili pastes. Authentic global flavors, shipped across the USA.'
          : `Shop West African ${getCategoryName().toLowerCase()} from Golden Palm Foods — authentic, small-batch and shipped nationwide across the USA.`}
        path="/shop"
      />
      <Header />
      {/* Main Content */}
      
      { isLoading ? 
        <div className='flex justify-center items-center'>
          <Loader/>
        </div>
        :
        <>
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="mt-6">
              <button
                onClick={() => navigate('/bundle')}
                className="flex justify-center items-center gap-2 text-gp-light-green hover:text-gp-dark-green transition-colors font-canaro-semibold text-base sm:text-lg"
              >
                <ArrowLeft size={20} />
                <span className='mt-1'>Back</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-6 mt-4">
              <div className="flex items-center space-x-2 text-[1.5rem] font-canaro-book text-gray-600">
                <span>SHOP</span>
                <span>/</span>
                <span>{getCategoryName().toUpperCase()}</span>
              </div>
            </div>

            {/* Shop Header */}
            <div className='relative'>
              <div className="bg-gp-light-green text-white text-center py-1 rounded-lg mb-8">
                <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] font-caslon">Shop {getCategoryName()}</h1>
              </div>
              {/* SEO copy — present for crawlers, visually hidden so it doesn't affect the design */}
              <p className="sr-only">
                {getCategoryName() === 'All'
                  ? 'Authentic West African food and global pantry staples — Bambara beans, Ebesse chili paste, unrefined red palm, peanut and coconut oils, and small-batch spice blends. Specialty international ingredients shipped across the USA.'
                  : `Authentic, small-batch West African ${getCategoryName().toLowerCase()} — shipped nationwide across the USA.`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <h3 className="text-gp-light-green text-[3rem] font-caslon mb-4">No Products Available</h3>
                  <p className="text-gray-600 text-lg font-canaro-book">Check back soon for new products!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map((product) => {
                  // Check if it's a bundle
                  const isBundle = product.product_details && product.product_details.length > 0;
                  const isOutOfStock = product.is_available === false;

                  return <div key={product.sku} className="rounded-lg overflow-hidden cursor-pointer" >
                    {/* Product Image */}
                    <div onClick={async () => {
                      if (!isBundle) {
                        // Store SKU in Dexie and put it in the URL so the product is shareable
                        await sessionDataHelpers.set('selectedProductSku', product.sku);
                        navigate(`/product-detail/${product.sku}`);
                      }
                    }} className={`relative flex items-center justify-center py-8 ${!isBundle ? 'cursor-pointer' : 'cursor-default'}`}>
                      <div className="relative">
                        <img className={`w-full h-full max-h-[20rem] shadow-lg rounded-md ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} src={`https://api.goldenpalmfoods.com${product.img_url}` || ShitoImg} alt={product.name} />
                        {isOutOfStock && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-canaro-semibold uppercase tracking-wide">
                            Out of Stock
                          </div>
                        )}
                        {isBundle && product.product_details.some(p => p.is_available === false) && (
                          <div className={`absolute ${isOutOfStock ? 'top-12' : 'top-3'} left-3 bg-amber-500 text-white px-3 pt-[0.25rem] rounded-md text-xs font-canaro-semibold max-w-[90%]`}>
                            <span className="flex gap-1">
                              <AlertTriangle size={12} className="flex-shrink-0" />
                              {product.product_details.filter(p => p.is_available === false).map(p => p.name).join(', ')} — out of stock. Prices adjusted
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="px-6 pb-6">
                      <h3 className="text-[2rem] md:text-[2.5rem] font-caslon text-gp-light-green leading-[1] md:leading-[1.7]">{product.name}</h3>
                      {isOnSale(product) ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-[2.8rem] md:text-[4rem] font-canaro-semibold text-gp-light-green">${parseFloat(product.sale_price).toFixed(2)}</p>
                          <span className="text-xl md:text-2xl text-gray-500 line-through">${parseFloat(product.price).toFixed(2)}</span>
                          <span className="bg-red-600 text-white text-xs md:text-sm font-canaro-semibold uppercase tracking-wide px-2.5 py-1 rounded-md">Sale · {percentOff(product)}% off</span>
                        </div>
                      ) : (
                        <p className="text-[2.8rem] md:text-[4rem] font-canaro-semibold text-gp-light-green">${product.price}</p>
                      )}

                      {/* Rating summary */}
                      {product.review_count > 0 ? (
                        <div
                          onClick={(e) => !isBundle && goToReviews(e, product)}
                          className={`flex items-center gap-2 mb-2 ${!isBundle ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                        >
                          <StarDisplay rating={product.avg_rating} />
                          <span className="text-sm font-canaro-book text-gray-600 leading-none mt-[5px] underline">
                            {parseFloat(product.avg_rating).toFixed(1)} ({product.review_count})
                          </span>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => { e.stopPropagation(); navigate('/reviews'); }}
                          className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <StarDisplay rating={0} />
                          <span className="text-sm font-canaro-book text-gp-light-green leading-none mt-[5px] underline">
                            Read our testimonials
                          </span>
                        </div>
                      )}
                      {product.product_details && product.product_details.length > 0 && (
                        <div className='flex flex-row gap-2 items-center '>
                          <div className="relative group">
                            <div className="flex items-center gap-1 cursor-help">
                              <p className="text-[1rem] font-canaro-semibold text-gray-600 mb-4">
                                Bundle includes {product.product_details.filter(p => p.is_available !== false).length} items
                              </p>
                              <Info size={16} className="text-gray-500 mb-4" />
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
                              <p className="font-canaro-semibold mb-2">Bundle contains:</p>
                              <ul className="space-y-1 font-canaro-light">
                                {product.product_details.map((p, idx) => (
                                  <li key={idx} className={p.is_available === false ? 'line-through text-gray-400' : ''}>• {p.name}</li>
                                ))}
                              </ul>
                              {/* Arrow */}
                              <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                          <p className='text-[1rem] font-canaro-semibold text-gray-600 mb-4'>|</p>
                          <p className="text-sm font-canaro-semibold text-gray-600 mb-4">
                            Save ${product.discount_percentage} from this bundle
                          </p>
                        </div>
                      )}

                      {!product.product_details && product.weight && (
                        <p className="text-[1.2rem] font-canaro-book text-gp-light-green mb-4">Size {parseInt(product.weight)} {product.weight_type}</p>
                      )}

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isOutOfStock}
                        className={`w-full font-canaro-book text-white py-4 text-lg transition-colors ${
                          isOutOfStock
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gp-light-green hover:bg-gp-dark-green'
                        }`}
                      >
                        {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>
                })}
              </div>
            )}
          </div> 
        </>
      }

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

      <Footer />
    </>
  );
};