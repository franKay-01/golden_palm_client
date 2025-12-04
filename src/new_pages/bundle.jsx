import React, {useState, useEffect, useContext} from 'react';
import ShitoImg from '../assets/shito.png'
import { Facebook, Instagram, Tiktok, ShoppingCart } from 'lucide-react';
import Asset6 from '../assets/images/asset_6.png'
import Asset8 from '../assets/images/asset_8.png'
import useFunctions from '../utils/functions';
import { CartContext } from '../context/cartContext';
import { ShowToast } from '../components/showToast';
import Header from '../components/header';
import Footer from '../components/footer';
import HeatLevelModal from '../components/heatLevelModal';

export default function ShopPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bundleType, setBundleType] = useState('');
  const [bundles, setBundles] = useState([]);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const { getCuratedSelectedBundle } = useFunctions();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e, bundle) => {
    e.stopPropagation();

    // Check if bundle has hot products
    const hasHotProduct = bundle.product_details?.some(product => product.is_hot);

    if (hasHotProduct) {
      setSelectedBundle(bundle);
      setHeatModalOpen(true);
      return;
    }

    // Calculate weight for bundles by summing product_details weights
    let totalWeight = bundle.weight || null;
    if (bundle.product_details) {
      totalWeight = bundle.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.weight) || 0);
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
      weight: totalWeight,
      product_details: bundle.product_details
    };

    addToCart(cartItem);
    ShowToast("success", `${bundle.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedBundle) return;

    // Calculate weight for bundles by summing product_details weights
    let totalWeight = selectedBundle.weight || null;
    if (selectedBundle.product_details) {
      totalWeight = selectedBundle.product_details.reduce((sum, item) => {
        return sum + (parseFloat(item.weight) || 0);
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
      weight: totalWeight,
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
      window.location.href = '/'
    }
  }, []);

  useEffect(() => {
    const fetchBundles = async () => {
      if (bundleType) {
        const response = await getCuratedSelectedBundle(bundleType);
        if (response.response_code === "000") {
          setBundles(response.curated);
        }
      }
    };
    fetchBundles();
  }, [bundleType]);

  return (
    <>
      <Header />
      {/* Main Content */}
      
      <div className="max-w-7xl mx-auto px-4 pb-12 relative">
        <div className="flex items-center justify-between mb-6 mt-8">
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
        {bundles.length === 0 ? (
          <div className="flex justify-center items-center py-20 px-4">
            <div className="text-center">
              <h3 className="text-gp-light-green text-2xl sm:text-3xl md:text-[3rem] font-caslon mb-4">No Bundles Available</h3>
              <p className="text-gray-600 text-base sm:text-lg font-canaro-book">Check back soon for amazing bundle deals!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bundles.map((bundle) => {

              return (
                <div key={bundle.id} className="rounded-lg overflow-hidden">
                  {/* Product Image */}
                  <div className="relative flex items-center justify-center py-8">
                    <div className="relative">
                      <img className='w-full h-full max-h-[24rem] shadow-lg rounded-md' src={`https://api.goldenpalmfoods.com${bundle.img_url}` || ShitoImg} alt={bundle.name} />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="px-6 pb-6">
                    <h3 className="text-[2.5rem] font-caslon text-gp-light-green leading-[1] md:leading-[1.7]">{bundle.name}</h3>
                    <p className="text-[4rem] font-canaro-semibold text-gp-light-green leading-[1.5]">${bundle.price}</p>

                    {bundle.product_details && bundle.product_details.length > 0 && (
                      // <p className="text-sm font-canaro-semibold text-gray-600 mb-4">
                      //   {bundle.product_details.map(product => product.name).join(' + ')}
                      // </p>
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

                    <button
                      onClick={(e) => handleAddToCart(e, bundle)}
                      className="w-full bg-gp-light-green text-white py-4 font-bold text-lg hover:bg-green-900 transition-colors"
                    >
                      ADD TO CART
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
      />

      <Footer/>
    </>
  );
};