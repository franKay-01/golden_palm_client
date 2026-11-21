import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import ShitoImg from '../assets/shito.webp'
import { Facebook, Instagram, Tiktok, ShoppingCart, ArrowLeft } from 'lucide-react';
import Asset6 from '../assets/images/asset_6.webp'
import Asset8 from '../assets/images/asset_8.webp'
import useFunctions from '../utils/functions';
import { CartContext } from '../context/cartContext';
import { ShowToast } from '../components/showToast';
import Header from '../components/header';
import Footer from '../components/footer';
import HeatLevelModal from '../components/heatLevelModal';
import { getHeatVariations } from '../utils/heatLevels';
import ProductCard from '../components/productCard';
import { effectiveUnitPrice } from '../utils/pricing';
import SaleDeals from '../components/saleDeals';
import { ShopGridSkeleton } from '../components/skeletons';

export default function ShopPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bundleType, setBundleType] = useState('');
  const [bundles, setBundles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  // The curated-bundles endpoint doesn't embed per-variation availability, so we
  // fetch it from each hot sub-product's detail and stash it for the modal.
  const [heatVariations, setHeatVariations] = useState([]);
  const { getCuratedSelectedBundle, getProductDetail } = useFunctions();
  const { addToCart, openCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Resolve real heat-level availability for a bundle by pulling each hot sub-product's
  // variations from its detail (the curated-bundles list doesn't include them).
  const resolveBundleHeatVariations = async (bundle) => {
    const hotSubs = (bundle.product_details || []).filter(p => p.is_hot && p.sku);
    const detailed = [];
    for (const sub of hotSubs) {
      const res = await getProductDetail(sub.sku);
      if (res.response_code === '000' && res.product?.variations?.length) {
        detailed.push({ ...sub, is_hot: true, variations: res.product.variations });
      }
    }
    return getHeatVariations({ product_details: detailed });
  };

  const handleAddToCart = async (e, bundle) => {
    e.stopPropagation();

    if (bundle.is_available === false) {
      ShowToast("error", `${bundle.name} is out of stock. Prices adjusted`);
      return;
    }

    // Check if bundle has hot products
    const hasHotProduct = bundle.product_details?.some(product => product.is_hot);

    if (hasHotProduct) {
      const variations = await resolveBundleHeatVariations(bundle);
      setHeatVariations(variations);
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
      price: effectiveUnitPrice(bundle),
      unit_price: effectiveUnitPrice(bundle),
      quantity: 1,
      img_url: bundle.img_url,
      type: 'bundle',
      heat_level: null,
      shipping_weight: totalWeight,
      product_details: bundle.product_details
    };

    addToCart(cartItem);
    openCart();
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedBundle) return;

    // Defense in depth: never add an out-of-stock heat level even if it slipped through the modal
    const chosenVariation = heatVariations.find(
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
      price: effectiveUnitPrice(selectedBundle),
      unit_price: effectiveUnitPrice(selectedBundle),
      quantity: 1,
      img_url: selectedBundle.img_url,
      type: 'bundle',
      heat_level: heatLevel,
      shipping_weight: totalWeight,
      product_details: selectedBundle.product_details
    };

    addToCart(cartItem);
    openCart();
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
          

        {/* Black Friday / sale deals (renders nothing when no sale is running) */}
        <SaleDeals />

        <div className='relative'>
          <div className="bg-gp-light-green text-white text-center py-1 rounded-lg mb-8">
            <h1 className="text-[2rem] md:text-[3rem] lg:text-[5rem] font-caslon">Curated Bundles</h1>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ShopGridSkeleton />
        ) : bundles.length === 0 ? (
          <div className="flex justify-center items-center py-20 px-4">
            <div className="text-center">
              <h3 className="text-gp-light-green text-2xl sm:text-3xl md:text-[3rem] font-caslon mb-4">No Bundles Available</h3>
              <p className="text-gray-600 text-base sm:text-lg font-canaro-book">Check back soon for amazing bundle deals!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3.5 gap-y-7 md:gap-8">
            {bundles.map((bundle) => (
              <ProductCard
                key={bundle.id}
                item={bundle}
                onAdd={(e) => handleAddToCart(e, bundle)}
              />
            ))}
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
          setHeatVariations([]);
        }}
        onSelect={handleHeatLevelSelect}
        productName={selectedBundle?.name}
        variations={heatVariations}
      />

      <Footer/>
    </>
  );
};