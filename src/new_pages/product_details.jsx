import React, { useState, useEffect, useContext } from 'react';
import Asset16 from "../assets/images/asset_16.png"
import Loader from '../components/loader';
import AuthenticImg from "../assets/images/authentic.png"
import NoPreImg from "../assets/images/no_pre.png"
import VarietyImg from "../assets/images/variety.png"
import Asset6Img from '../assets/images/asset_6.png'
import { Facebook, Instagram, Twitter, Minus, Plus, Flame, Check  } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import { CartContext } from '../context/cartContext';
import Header from '../components/header';
import Asset8Img from '../assets/images/asset_8.png'
import Footer from '../components/footer';
import CookingImgAlt from '../assets/images/bg2.jpg'
import HeatLevelModal from '../components/heatLevelModal';
import { sessionDataHelpers } from '../utils/db';

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState('');
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedHeatLevel, setSelectedHeatLevel] = useState('');

  const { getProductDetail } = useFunctions();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Get SKU from Dexie
        const sku = await sessionDataHelpers.get('selectedProductSku');

        if (sku) {
          setIsLoading(true);
          const response = await getProductDetail(sku);

          if (response.response_code === "000") {
            console.log(response.product);
            setProduct(response.product);
            setCurrentImage(response.product.img_url);

            // Set default heat level if product is hot
            if (response.product.is_hot && response.product.variations?.length > 0) {
              setSelectedHeatLevel(response.product.variations[0].heat_level);
            }

            setIsLoading(false);
            return;
          }

          setIsLoading(false);
          ShowToast("error", "Product details retrieval failed");
          return;
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setIsLoading(false);
        ShowToast("error", "Failed to load product");
      }
    };

    fetchProductData();
  }, []);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleHeatLevelChange = (e) => {
    const heatLevel = e.target.value;
    setSelectedHeatLevel(heatLevel);

    // Update image based on selected heat level
    if (product.variations) {
      const variation = product.variations.find(
        v => v.heat_level.toLowerCase() === heatLevel.toLowerCase()
      );
      if (variation) {
        setCurrentImage(variation.img_url);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if product requires heat level but none is selected
    if (product.is_hot && !selectedHeatLevel) {
      ShowToast("error", "Please select a heat level");
      return;
    }

    const cartItem = {
      id: product.sku,
      name: product.name,
      price: parseFloat(product.price) * quantity,
      unit_price: parseFloat(product.price),
      quantity: quantity,
      img_url: currentImage,
      type: 'product',
      heat_level: product.is_hot ? selectedHeatLevel : null,
      weight: product.weight || null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!product) return;

    // Update image based on selected heat level
    if (product.variations) {
      const variation = product.variations.find(
        v => v.heat_level.toLowerCase() === heatLevel.toLowerCase()
      );
      if (variation) {
        setCurrentImage(variation.img_url);
      }
    }

    const cartItem = {
      id: product.sku,
      name: product.name,
      price: parseFloat(product.price) * quantity,
      unit_price: parseFloat(product.price),
      quantity: quantity,
      img_url: currentImage,
      type: 'product',
      heat_level: heatLevel,
      weight: product.weight || null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  return (
    <>
      <Header />

      { isLoading ?
        <div className='flex justify-center items-center min-h-screen'>
          <Loader/>
        </div>
       :
        <>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            {/* Product Title */}
            <div className="text-left mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-2 font-caslon text-gp-light-green">{product?.name}</h1>
              <p className="text-gray-600 uppercase tracking-wider text-sm sm:text-base md:text-lg font-canaro-book">
                {product?.highlights || 'Bold · Flavorful & Versatile'}
              </p>
            </div>

            {/* Product Main Content */}
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-6 sm:mb-8">
              {/* Left Column - Image and Gallery */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={`https://api.goldenpalmfoods.com${currentImage}`}
                    alt={product?.name}
                    className="w-full mx-auto rounded-lg h-[20rem] sm:h-[22rem] md:h-[25rem] object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-4 sm:space-y-6">
                {/* Brand and Price */}
                <div>
                  <h2 className="text-[1.8rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] text-gp-black font-bold italic mb-2 sm:mb-4 font-dry-brush">{product?.slug}</h2>
                  <div className="flex items-baseline gap-2 sm:gap-4">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gp-light-green font-canaro-semibold">${parseFloat(product?.price).toFixed(2)}</span>
                    {product?.discount_percentage && parseFloat(product?.discount_percentage) > 0 && (
                      <span className="text-base sm:text-lg md:text-xl text-gray-500 line-through">
                        ${(parseFloat(product?.price) / (1 - parseFloat(product?.discount_percentage) / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
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
                      {product.variations.map((variation, index) => (
                        <option key={index} value={variation.heat_level}>
                          {variation.heat_level}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button onClick={handleAddToCart} className="w-full bg-gp-light-green text-white font-canaro-book py-3 sm:py-4 rounded-lg text-base sm:text-lg hover:bg-green-800 transition-colors">
                  ADD TO CART
                </button>
              </div>
            </div>

            <div>
              {/* Product Description */}
              <div className="prose prose-gray">
                <p className="text-gray-700 text-base sm:text-lg md:text-xl lg:text-[26px] leading-relaxed font-canaro-light">
                  {product?.description}
                </p>
              </div>

              {/* Perfect For Section */}
              <div className='mt-6 sm:mt-8'>
                <h3 className="text-2xl sm:text-3xl md:text-4xl mb-3 font-caslon text-gp-light-green">Perfect for:</h3>
                <ul className="space-y-2 text-gray-700 font-canaro-light">
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
                    <h4 className="font-canaro-semibold !text-sm sm:!text-base md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].preservative.title}:</h4>
                    <p className="font-canaro-light !text-xs sm:!text-sm md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].preservative.description}</p>
                  </div>
                </div>
              )}

              {product?.metadata?.[0]?.authentic?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <img src={AuthenticImg} className='w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 lg:w-[18rem] lg:h-[7rem] flex-shrink-0' alt="Authentic"/>
                  <div>
                    <h4 className="font-canaro-semibold !text-sm sm:!text-base md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].authentic.title}:</h4>
                    <p className="font-canaro-light !text-xs sm:!text-sm md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].authentic.description}</p>
                  </div>
                </div>
              )}

              {product?.metadata?.[0]?.other?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <img src={VarietyImg} className='w-16 h-12 sm:w-20 sm:h-14 md:w-28 md:h-20 lg:w-[10rem] lg:h-[7rem] flex-shrink-0' alt="Variety"/>
                  <div>
                    <h4 className="font-canaro-semibold !text-sm sm:!text-base md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].other.title}:</h4>
                    <p className="font-canaro-light !text-xs sm:!text-sm md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].other.description}</p>
                  </div>
                </div>
              )}

              {product?.metadata?.[0]?.heat?.title && (
                <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 md:mt-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Flame className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-canaro-semibold !text-sm sm:!text-base md:!text-xl lg:!text-[26px] mb-1">{product.metadata[0].heat.title}:</h4>
                    <p className="font-canaro-light !text-xs sm:!text-sm md:!text-lg lg:!text-[24px] text-gray-600">{product.metadata[0].heat.description}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Product Images Gallery */}

            <div className="flex justify-center space-x-4 md:space-x-8 mt-6 sm:mt-8 md:mt-16 z-10 mb-8 sm:mb-10 md:mb-12">
              <img src={Asset16} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" alt="Product gallery"/>
            </div>

            {/* Recipe Image */}
            <div onClick={() => window.location.href = `/recipes`} className="relative rounded-2xl overflow-hidden mb-8 sm:mb-10 md:mb-12 cursor-pointer">
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
              <p className="text-gray-800 font-canaro-semibold text-base sm:text-lg mb-2">"Let's Eat"</p>
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