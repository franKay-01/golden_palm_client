import React, { useState, useEffect, useContext } from 'react';
import ShitoImg from '../assets/shito.png'
import { Facebook, Instagram, Tiktok, ShoppingCart } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import { CartContext } from '../context/cartContext';
import Header from '../components/header';
import LogoAlt from "../assets/images/logo.png"
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/footer';
import HeatLevelModal from '../components/heatLevelModal';
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

    // Check if it's a bundle (has product_details)
    const isBundle = product.product_details && product.product_details.length > 0;
    const hasHotProduct = isBundle ? product.product_details?.some(p => p.is_hot) : product.is_hot;

    // For products that require heat level, show modal first
    if (hasHotProduct) {
      setSelectedProduct(product);
      setHeatModalOpen(true);
      return;
    }

    // Calculate weight for bundles by summing product_details weights
    let totalWeight = product.weight || null;
    if (isBundle && product.product_details) {
      totalWeight = product.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.weight) || 0);
      }, 0);
    }

    // For products without heat level requirement, add directly
    const cartItem = {
      id: product.sku,
      name: product.name,
      price: parseFloat(product.price),
      unit_price: parseFloat(product.price),
      quantity: 1,
      img_url: product.img_url,
      type: isBundle ? 'bundle' : 'product',
      heat_level: null,
      weight: totalWeight,
      product_details: isBundle ? product.product_details : null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedProduct) return;

    const isBundle = selectedProduct.product_details && selectedProduct.product_details.length > 0;

    // Calculate weight for bundles by summing product_details weights
    let totalWeight = selectedProduct.weight || null;
    if (isBundle && selectedProduct.product_details) {
      totalWeight = selectedProduct.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.weight) || 0);
      }, 0);
    }

    const cartItem = {
      id: selectedProduct.sku,
      name: selectedProduct.name,
      price: parseFloat(selectedProduct.price),
      unit_price: parseFloat(selectedProduct.price),
      quantity: 1,
      img_url: selectedProduct.img_url,
      type: isBundle ? 'bundle' : 'product',
      heat_level: heatLevel,
      weight: totalWeight,
      product_details: isBundle ? selectedProduct.product_details : null
    };

    addToCart(cartItem);
    ShowToast("success", `${selectedProduct.name} added to cart`);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      {/* Main Content */}
      
      { isLoading ? 
        <div className='flex justify-center items-center'>
          <Loader/>
        </div>
        :
        <>
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-6 mt-8">
              <div className="flex items-center space-x-2 text-[1.5rem] font-canaro-book text-gray-600">
                <span>SHOP</span>
                <span>/</span>
                <span>SHOP ALL</span>
              </div>
            </div>

            {/* Shop All Header */}
            <div className='relative'>
              <div className="bg-gp-light-green text-white text-center py-1 rounded-lg mb-8">
                <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] font-caslon">Shop All</h1>
              </div>
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

                  return <div key={product.sku} className="rounded-lg overflow-hidden cursor-pointer" >
                    {/* Product Image */}
                    <div onClick={async () => {
                      if (!isBundle) {
                        // Store SKU in Dexie
                        await sessionDataHelpers.set('selectedProductSku', product.sku);
                        window.location.href = `/product-detail`;
                      }
                    }} className={`relative flex items-center justify-center py-8 ${!isBundle ? 'cursor-pointer' : 'cursor-default'}`}>
                      <div className="relative">
                        <img className='w-full h-full shadow-lg rounded-md' src={`https://api.goldenpalmfoods.com${product.img_url}` || ShitoImg} alt={product.name} />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="px-6 pb-6">
                      <h3 className="text-[2rem] md:text-[2.5rem] font-caslon text-gp-light-green leading-[1] md:leading-[1.7]">{product.name}</h3>
                      <p className="text-[2.8rem] md:text-[4rem] font-canaro-semibold text-gp-light-green">${product.price}</p>
                      {product.product_details && product.product_details.length > 0 && (
                        <div className='flex flex-row gap-2 items-center '>
                          <p className="text-[1rem] font-canaro-semibold text-gray-600 mb-4">
                            {product.product_details.map(p => p.name).join(' + ')}
                          </p>
                          <p className='text-[1rem] font-canaro-semibold text-gray-600 mb-4'>|</p>
                          <p className="text-sm font-canaro-semibold text-gray-600 mb-4">
                            Save ${product.discount_percentage} from this bundle
                          </p> 
                        </div>
                      )}

                      {!product.product_details && product.weight && (
                        <p className="text-[1.2rem] font-canaro-book text-gp-light-green mb-4">Size {parseInt(product.weight)} lbs</p>
                      )}

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-gp-light-green font-canaro-book text-white py-4 text-lg hover:bg-gp-dark-green transition-colors"
                      >
                        ADD TO CART
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
      />

      <Footer />
    </>
  );
};