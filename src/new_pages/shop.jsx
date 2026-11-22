import React, { useState, useEffect, useContext } from 'react';
import ShitoImg from '../assets/shito.webp'
import { effectiveUnitPrice } from '../utils/pricing'
import { ArrowLeft } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import { ShopGridSkeleton } from '../components/skeletons';
import { CartContext } from '../context/cartContext';
import Header from '../components/header';
import Seo from '../components/seo';
import LogoAlt from "../assets/images/logo.webp"
import { useSearchParams, useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import HeatLevelModal from '../components/heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';
import { sessionDataHelpers } from '../utils/db';
import ProductCard from '../components/productCard';
import SaleDeals from '../components/saleDeals';

export default function ShopPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { getProductsByCategory, getProductsAndBundles } = useFunctions();
  const { addToCart, openCart } = useContext(CartContext);
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
    openCart();
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
    openCart();
    setSelectedProduct(null);
  };

  // Navigate to a product's detail page and auto-scroll to its Customer Reviews section
  const goToReviews = async (e, product) => {
    e.stopPropagation();
    await sessionDataHelpers.set('selectedProductSku', product.sku);
    navigate(`/product-detail/${product.sku}`, { state: { scrollToReviews: true } });
  };

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
          ? 'Shop West African & Specialty Ingredients'
          : `Shop West African ${getCategoryName()}`}
        description={getCategoryName() === 'All'
          ? 'Browse specialty food products and cooking ingredients — West African oils, spices, Bambara beans & chili pastes. Authentic flavors, shipped across the USA.'
          : `Shop West African ${getCategoryName().toLowerCase()} from Golden Palm Foods — authentic, small-batch and shipped nationwide across the USA.`}
        path="/shop"
      />
      <Header />
      {/* Main Content */}
      
      { isLoading ?
        <ShopGridSkeleton />
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

            {/* Black Friday / sale deals (renders nothing when no sale is running) */}
            <SaleDeals />

            {/* Shop Header */}
            <div className='relative'>
              <div className="bg-gp-light-green text-white text-center py-1 rounded-lg mb-8">
                <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] font-caslon">Shop {getCategoryName()}</h1>
              </div>
              {/* SEO copy — present for crawlers, visually hidden so it doesn't affect the design */}
              <p className="sr-only">
                {getCategoryName() === 'All'
                  ? 'Authentic West African food and pantry staples — Bambara beans, Ebesse chili paste, unrefined red palm, peanut and coconut oils, and small-batch spice blends. Specialty ingredients shipped across the USA.'
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3.5 gap-y-7 md:gap-8">
                {filteredProducts.map((product) => {
                  const isBundle = product.product_details && product.product_details.length > 0;
                  return (
                    <ProductCard
                      key={product.sku}
                      item={product}
                      onAdd={(e) => handleAddToCart(e, product)}
                      onOpen={isBundle ? undefined : async () => {
                        // Store SKU in Dexie and put it in the URL so the product is shareable
                        await sessionDataHelpers.set('selectedProductSku', product.sku);
                        navigate(`/product-detail/${product.sku}`);
                      }}
                      onReviewsClick={isBundle ? undefined : (e) => goToReviews(e, product)}
                      onTestimonialsClick={() => navigate('/reviews')}
                    />
                  );
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