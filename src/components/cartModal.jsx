import React, { useContext, useState, useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { CartContext } from '../context/cartContext';
import { ShowToast } from './showToast';
import useFunctions from '../utils/functions';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, calculateTotal, changePrice } = useContext(CartContext);
  const [zipcode, setZipcode] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const summaryRef = useRef(null);
  const { submitCheckOut, getProductDetail } = useFunctions();

  // Fetch product details for items with heat levels
  useEffect(() => {
    const fetchProductDetails = async () => {
      const itemsWithHeatLevel = cart.filter(item => item.heat_level && item.type === 'product');

      for (const item of itemsWithHeatLevel) {
        if (!productDetails[item.id]) {
          const response = await getProductDetail(item.id);
          if (response.response_code === '000' && response.product.variations) {
            setProductDetails(prev => ({
              ...prev,
              [item.id]: response.product
            }));
          }
        }
      }
    };

    if (isOpen && cart.length > 0) {
      fetchProductDetails();
    }
  }, [isOpen, cart]);

  // Get the correct image URL based on heat level
  const getImageUrl = (item) => {
    // If item has heat level and we have product details with variations
    if (item.heat_level && productDetails[item.id]?.variations) {
      const variation = productDetails[item.id].variations.find(
        v => v.heat_level.toLowerCase() === item.heat_level.toLowerCase()
      );
      return variation ? variation.img_url : item.img_url;
    }
    return item.img_url;
  };

  // Auto-scroll to summary on mobile when modal opens
  useEffect(() => {
    if (isOpen && cart.length > 0 && summaryRef.current) {
      // Check if mobile screen (less than 768px)
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          summaryRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }, 300);
      }
    }
  }, [isOpen, cart.length]);

  if (!isOpen) return null;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    changePrice(item.id, newQuantity, item.heat_level);
  };

  const handleCheckout = async () => {
    if (!zipcode.trim()) {
      ShowToast("error", "Please enter your zipcode");
      return;
    }

    setIsLoading(true);
    const params = {
      zipcode: zipcode,
      email: email,
      shipping_address: shippingAddress,
      phone_number: phoneNumber || null,
      cart: cart
    };

    console.log(JSON.stringify(params))

    const { response_code, checkout_url, error, msg } = await submitCheckOut(params);

    if (response_code === 200 && !error && checkout_url) {
      window.location.href = checkout_url;
    } else {
      setIsLoading(false);
      ShowToast("error", msg || "Checkout failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-scroll md:overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-[2.3rem] font-caslon text-black">
            {showCheckoutForm ? 'Checkout Information' : 'Shopping Cart'}
          </h2>
          <button
            onClick={() => {
              if (showCheckoutForm) {
                setShowCheckoutForm(false);
              } else {
                onClose();
              }
            }}
            className="text-black hover:text-gp-yellow transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {showCheckoutForm ? (
          /* Checkout Form View */
          <div className="flex flex-col md:flex-row overflow-hidden max-h-[calc(90vh-100px)]">
            {/* Left Column - Form Fields */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Zipcode Input */}
                <div>
                  <label className="block text-sm text-gray-700 font-canaro-book mb-2">
                    Zipcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Enter zipcode"
                    className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gp-yellow"
                    maxLength="10"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full md:w-80 bg-gp-light-green px-6 py-6 border-l">
              <h3 className="text-[1.5rem] font-caslon text-gp-yellow mb-4">Order Summary</h3>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gp-yellow font-canaro-book">Items ({cart.length})</span>
                  <span className="text-gp-yellow font-canaro-book">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gp-yellow font-canaro-book">Shipping</span>
                  <span className="text-gp-yellow font-canaro-book">Calculated at checkout</span>
                </div>
                <div className="border-t border-gp-yellow pt-3 flex justify-between">
                  <span className="text-base text-gp-yellow font-canaro-semibold">Total</span>
                  <span className="text-lg text-gp-yellow font-canaro-semibold">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="block w-full bg-gp-yellow text-white text-center py-3 px-4 rounded-md font-canaro-book transition-colors hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'PROCESSING...' : 'COMPLETE CHECKOUT'}
                </button>
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="block w-full bg-transparent border border-gp-yellow text-gp-yellow text-center py-3 px-4 rounded-md font-canaro-book transition-colors hover:bg-gp-yellow hover:text-white"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your cart is empty</p>
            <button
              onClick={onClose}
              className="mt-4 text-[#445717] hover:text-green-700 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Cart Items - Left Side */}
            <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[calc(90vh-200px)]">
              <div className="space-y-8">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.heat_level}`}
                    className="flex gap-4 border-b pb-4"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={`http://localhost:5001${getImageUrl(item)}`}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-caslon text-gp-light-green">
                        {item.name}
                      </h3>
                      {item.heat_level && (
                        <p className="text-sm text-gray-500 mt-1">
                          Heat Level: {item.heat_level}
                        </p>
                      )}
                      {item.type === 'bundle' && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.product_details?.map(p => p.name).join(' + ')}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="text-md w-8 text-gp-light-green text-center font-canaro-book">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-base font-canaro-semibold text-gp-light-green">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id, item.heat_level)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary - Right Side */}
            <div ref={summaryRef} className="w-full md:w-80 bg-gp-light-green px-6 py-6 border-l">
              <h3 className="text-[1.5rem] font-caslon text-gp-yellow mb-4">Summary</h3>

              {/* Summary Details */}
              <div className="space-y-7 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gp-yellow font-canaro-book">Items ({cart.length})</span>
                  <span className="text-gp-yellow font-canaro-book">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gp-yellow font-canaro-book">Shipping</span>
                  <span className="text-gp-yellow font-canaro-book">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-base text-gp-yellow font-canaro-semibold">Total</span>
                  <span className="text-lg text-gp-yellow font-canaro-semibold">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="block w-full bg-gp-yellow text-white text-center py-3 px-4 rounded-md font-canaro-book transition-colors mb-3 hover:bg-yellow-600"
              >
                CHECKOUT
              </button>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="block w-full text-center text-sm text-white hover:text-gp-yellow py-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
