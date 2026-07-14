import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import ShitoImg from '../assets/shito.png'
import { Facebook, Instagram, Tiktok, ShoppingCart, Info, ArrowLeft, AlertTriangle } from 'lucide-react';
import Asset6 from '../assets/images/asset_6.webp'
import Asset8 from '../assets/images/asset_8.webp'
import useFunctions from '../utils/functions';
import { CartContext } from '../context/cartContext';
import { ShowToast } from '../components/showToast';
import Header from '../components/header';
import Footer from '../components/footer';
import HeatLevelModal from '../components/heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';

export default function ShopPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bundleType, setBundleType] = useState('');
  const [bundles, setBundles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const { getCuratedSelectedBundle } = useFunctions();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (e, bundle) => {
    e.stopPropagation();

    if (bundle.is_available === false) {
      ShowToast("error", `${bundle.name} is out of stock. Prices adjusted`);
      return;
    }

    // Check if bundle has hot products
    const hasHotProduct = bundle.product_details?.some(product => product.is_hot);

    if (hasHotProduct) {
      setSelectedBundle(bundle);
      setHeatModalOpen(true);
      return;
    }

    // Calculate shipping weight for bundles by summing product_details shipping weights
    let totalWeight = bundle.shipping_weight || null;
    if (bundle.product_details) {
      totalWeight = bundle.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.shipping_weight) || 0);
      }, 0);
    }

    const cartItem = {
      id: bundle.bundle_id,
      name: bundle.name,
      price: parseFloat(bundle.price),
      unit_price: parseFloat(bundle.price),
      quantity: 1,
      img_url: bundle.img_url,
      type: 'bundle',
      heat_level: null,
      shipping_weight: totalWeight,
      product_details: bundle.product_details
    };

    addToCart(cartItem);
    ShowToast("success", `${bundle.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedBundle) return;

    // Defense in depth: never add an out-of-stock heat level even if it slipped through the modal
    const chosenVariation = getHeatVariations(selectedBundle).find(
      v => v.heat_level?.toLowerCase() === heatLevel?.toLowerCase()
    );
    if (chosenVariation?.is_available === false) {
      ShowToast("error", `The ${heatLevel} option is out of stock`);
      return;
    }

    // Calculate shipping weight for bundles by summing product_details shipping weights
    let totalWeight = selectedBundle.shipping_weight || null;
    if (selectedBundle.product_details) {
      totalWeight = selectedBundle.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.shipping_weight) || 0);
      }, 0);
    }

    const cartItem = {
      id: selectedBundle.bundle_id,
      name: selectedBundle.name,
      price: parseFloat(selectedBundle.price),
      unit_price: parseFloat(selectedBundle.price),
      quantity: 1,
      img_url: selectedBundle.img_url,
      type: 'bundle',
      heat_level: heatLevel,
      shipping_weight: totalWeight,
      product_details: selectedBundle.product_details
    };

    addToCart(cartItem);
    ShowToast("success", `${selectedBundle.name} added to cart`);
    setSelectedBundle(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bt = params.get('bt');
    if (bt) {
      setBundleType(bt);
    }else{
      ShowToast("error", "URL entry is not allowed")
      navigate('/')
    }
  }, []);

  useEffect(() => {
    const fetchBundles = async () => {
      if (bundleType) {
        setIsLoading(true);
        const response = await getCuratedSelectedBundle(bundleType);
        if (response.response_code === "000") {
          setBundles(response.curated);
        }
        setIsLoading(false);
      }
    };
    fetchBundles();
  }, [bundleType]);

  return (
    <>
      <Header />
      {/* Main Content */}

      <div className="max-w-7xl mx-auto px-4 pb-12 relative">
        {/* Back Button */}
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
            <span>SHOP BUNDLES</span>
          </div>
        </div>
          

        <div className='relative'>
          <div className="bg-gp-light-green text-white text-center py-1 rounded-lg mb-8">
            <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] font-caslon">Curated Bundles</h1>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gp-light-green"></div>
          </div>
        ) : bundles.length === 0 ? (
          <div className="flex justify-center items-center py-20 px-4">
            <div className="text-center">
              <h3 className="text-gp-light-green text-2xl sm:text-3xl md:text-[3rem] font-caslon mb-4">No Bundles Available</h3>
              <p className="text-gray-600 text-base sm:text-lg font-canaro-book">Check back soon for amazing bundle deals!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bundles.map((bundle) => {
              const isOutOfStock = bundle.is_available === false;

              return (
                <div key={bundle.id} className="rounded-lg overflow-hidden">
                  {/* Product Image */}
                  <div className="relative flex items-center justify-center py-8">
                    <div className="relative">
                      <img className={`w-full h-full max-h-[24rem] shadow-lg rounded-md ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} src={`https://api.goldenpalmfoods.com${bundle.img_url}` || ShitoImg} alt={bundle.name} />
                      {isOutOfStock && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-canaro-semibold uppercase tracking-wide">
                          Out of Stock
                        </div>
                      )}
                      {bundle.product_details && bundle.product_details.some(p => p.is_available === false) && (
                        <div className={`absolute ${isOutOfStock ? 'top-12' : 'top-3'} left-3 bg-amber-500 text-white px-3 pt-[0.25rem] rounded-md text-xs font-canaro-semibold max-w-[90%]`}>
                          <span className="flex gap-1">
                            <AlertTriangle size={12} className="flex-shrink-0" />
                            {bundle.product_details.filter(p => p.is_available === false).map(p => p.name).join(', ')} — out of stock. Prices adjusted
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="px-6 pb-6">
                    <h3 className="text-[2.5rem] font-caslon text-gp-light-green leading-[1] md:leading-[1.7]">{bundle.name}</h3>
                    <p className="text-[4rem] font-canaro-semibold text-gp-light-green leading-[1.5]">${bundle.price}</p>

                    {bundle.product_details && bundle.product_details.length > 0 && (
                      <div className='flex flex-row gap-2 items-center '>
                        <div className="relative group">
                          <div className="flex items-center gap-1 cursor-help">
                            <p className="text-[1rem] font-canaro-semibold text-gray-600 mb-4">
                              Bundle includes {bundle.product_details.filter(p => p.is_available !== false).length} items
                            </p>
                            <Info size={16} className="text-gray-500 mb-4" />
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
                            <p className="font-canaro-semibold mb-2">Bundle contains:</p>
                            <ul className="space-y-1 font-canaro-light">
                              {bundle.product_details.map((p, idx) => (
                                <li key={idx} className={p.is_available === false ? 'line-through text-gray-400' : ''}>• {p.name}</li>
                              ))}
                            </ul>
                            {/* Arrow */}
                            <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                        <p className='text-[1rem] font-canaro-semibold text-gray-600 mb-4'>|</p>
                        <p className="text-sm font-canaro-semibold text-gray-600 mb-4">
                          Save ${bundle.discount_percentage} from this bundle
                        </p>
                      </div>
                    )}

                    <button
                      onClick={(e) => handleAddToCart(e, bundle)}
                      disabled={isOutOfStock}
                      className={`w-full text-white py-4 font-bold text-lg transition-colors ${
                        isOutOfStock
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gp-light-green hover:bg-green-900'
                      }`}
                    >
                      {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        
      </div>
      <div className='relative'>
        <div className="hidden md:block absolute bottom-[-15rem] left-0 transform -translate-y-1/2">
          <img src={Asset6} alt="" className='w-[12rem] h-[34rem]'/>
        </div>
        <div className="hidden md:block absolute bottom-[-14rem] right-0 transform -translate-y-1/2">
          <img src={Asset8} alt="" className='w-[12rem] h-[14rem]'/>
        </div>
      </div>

      <HeatLevelModal
        isOpen={heatModalOpen}
        onClose={() => {
          setHeatModalOpen(false);
          setSelectedBundle(null);
        }}
        onSelect={handleHeatLevelSelect}
        productName={selectedBundle?.name}
        variations={getHeatVariations(selectedBundle)}
      />

      <Footer/>
    </>
  );
};