import React, { useContext, useState, useEffect, useRef } from 'react';
import { X, Trash2, AlertTriangle, Tag, Check } from 'lucide-react';
import { CartContext } from '../context/cartContext';
import { ShowToast } from './showToast';
import useFunctions from '../utils/functions';
import { isOnSale, effectiveUnitPrice } from '../utils/pricing';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, calculateTotal, changePrice, updateCartPricing } = useContext(CartContext);
  const [zipcode, setZipcode] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  // Discount code: `discountCode` is the input, `appliedCode` is the validated code sent at checkout
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountMsg, setDiscountMsg] = useState(null); // { type: 'success' | 'error', text }
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [showDiscountField, setShowDiscountField] = useState(false); // collapsed by default
  const [showUnappliedPrompt, setShowUnappliedPrompt] = useState(false); // typed-but-not-applied code
  const [priceNotices, setPriceNotices] = useState([]); // messages about corrected prices
  const summaryRef = useRef(null);
  const { submitCheckOut, getProductDetail, validateDiscountCode, getProductsAndBundles } = useFunctions();

  // Refresh cart prices whenever the cart opens: re-fetch current product/bundle data and
  // reconcile each line to the effective price (sale_price when on_sale, else price), so a
  // sale starting/ending doesn't surprise the customer at checkout.
  useEffect(() => {
    if (!isOpen || cart.length === 0) return;

    const refreshPrices = async () => {
      const res = await getProductsAndBundles();
      if (res.response_code !== '000') return;

      const pricingById = {};
      const register = (p, id) => {
        if (id == null) return;
        pricingById[id] = {
          unit_price: effectiveUnitPrice(p),
          on_sale: isOnSale(p),
          original_price: parseFloat(p.price),
        };
      };
      (res.products || []).forEach(p => register(p, p.sku));
      (res.bundles || []).forEach(b => register(b, b.bundle_id));

      // Only pass entries for items actually in the cart
      const updates = {};
      cart.forEach(item => {
        if (pricingById[item.productId]) updates[item.productId] = pricingById[item.productId];
      });
      if (Object.keys(updates).length) updateCartPricing(updates);
    };

    setPriceNotices([]); // start each open with a clean slate
    refreshPrices();
    // Run once per open; reading `cart` from closure at open time is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fetch product details for all product line items so we can detect items whose
  // product or variation has since gone out of stock.
  useEffect(() => {
    const fetchProductDetails = async () => {
      const productItems = cart.filter(item => item.type === 'product');

      for (const item of productItems) {
        if (!productDetails[item.id]) {
          const response = await getProductDetail(item.id);
          if (response.response_code === '000' && response.product) {
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

  // A cart line item is unavailable when its product is_available === false, or when
  // the specific variation (heat level) it references has gone out of stock.
  const isItemUnavailable = (item) => {
    const product = productDetails[item.id];
    if (!product) return false;
    if (product.is_available === false) return true;
    if (item.heat_level && product.variations) {
      const variation = product.variations.find(
        v => v.heat_level.toLowerCase() === item.heat_level.toLowerCase()
      );
      if (variation && variation.is_available === false) return true;
    }
    return false;
  };

  const hasUnavailableItems = cart.some(isItemUnavailable);

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

  // Live "Apply" preview of a discount code before checkout
  const handleApplyCode = async () => {
    const code = discountCode.trim();
    if (!code) {
      setDiscountMsg({ type: 'error', text: 'Please enter a discount code' });
      return;
    }

    setIsApplyingCode(true);
    const result = await validateDiscountCode({ code, cart });
    setIsApplyingCode(false);

    if (result.valid) {
      setAppliedCode(code);
      setDiscountMsg({ type: 'success', text: result.msg || 'Discount code applied' });
    } else {
      setAppliedCode('');
      setDiscountMsg({ type: 'error', text: result.msg || 'This discount code is not valid' });
    }
  };

  const handleRemoveCode = () => {
    setAppliedCode('');
    setDiscountCode('');
    setDiscountMsg(null);
    setShowDiscountField(false);
  };

  const handleCheckout = async ({ skipUnappliedCheck = false } = {}) => {
    if (!zipcode.trim()) {
      ShowToast("error", "Please enter your zipcode");
      return;
    }

    // Don't even attempt checkout if a line item is already flagged out of stock
    if (hasUnavailableItems) {
      setShowCheckoutForm(false);
      ShowToast("error", "Some items in your cart are out of stock. Please update your cart before checking out.");
      return;
    }

    // A code was typed but never applied — confirm before proceeding without it
    if (!skipUnappliedCheck && !appliedCode && discountCode.trim()) {
      setShowUnappliedPrompt(true);
      return;
    }

    setIsLoading(true);
    const params = {
      zipcode: zipcode,
      email: email,
      shipping_address: shippingAddress,
      phone_number: phoneNumber || null,
      cart: cart,
      sms_consent: smsConsent
    };
    // Include the applied discount code if one was validated; omit otherwise
    if (appliedCode) {
      params.discount_code = appliedCode;
    }

    const { response_code, checkout_url, error, msg, outOfStock, discountRejected, priceMismatch, mismatches } = await submitCheckOut(params);

    setIsLoading(false);

    if (response_code === 200 && !error && checkout_url) {
      window.location.href = checkout_url;
      return;
    }

    // 305: a price changed after items were added (e.g. a sale ended). Do NOT redirect.
    // Correct each affected line to the current price, show notices, and let the user
    // review before re-attempting checkout. Expired sale prices are NOT honored.
    if (priceMismatch) {
      const updates = {};
      const notices = (mismatches || []).map((m) => {
        updates[m.id] = { unit_price: parseFloat(m.current_price), on_sale: false, original_price: parseFloat(m.current_price) };
        return `The price of ${m.name} changed from $${parseFloat(m.cart_price).toFixed(2)} to $${parseFloat(m.current_price).toFixed(2)}.`;
      });
      if (Object.keys(updates).length) updateCartPricing(updates);
      setPriceNotices(notices);
      setShowCheckoutForm(false);
      ShowToast("error", msg || "Some prices in your cart have changed. Please review and try again.");
      return;
    }

    // 309: discount code rejected at final validation. Do NOT redirect; reopen the
    // field (keeping the typed code) so the user can fix or remove it.
    if (discountRejected) {
      setAppliedCode('');
      setShowDiscountField(true);
      setDiscountMsg({ type: 'error', text: msg || 'Your discount code is no longer valid. Please update or remove it.' });
      ShowToast("error", msg || "Your discount code is no longer valid. Please update or remove it.");
      return;
    }

    // 306 (product out of stock) / 307 (variation out of stock): do NOT proceed to Stripe.
    // Send the user back to the cart to resolve the offending items.
    if (outOfStock) {
      setShowCheckoutForm(false);
      ShowToast("error", msg || "An item in your cart is out of stock. Please update your cart to continue.");
      return;
    }

    ShowToast("error", msg || "Checkout failed. Please try again.");
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

                {/* Discount Code - collapsed behind a link until needed */}
                <div>
                  {appliedCode ? (
                    /* Applied state */
                    <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-md px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Check size={16} className="text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-canaro-semibold text-green-700 truncate">
                            Code “{appliedCode}” applied
                          </p>
                          {discountMsg?.type === 'success' && discountMsg.text && (
                            <p className="text-xs text-green-600 font-canaro-book truncate">{discountMsg.text}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCode}
                        className="text-sm text-gray-500 hover:text-red-500 font-canaro-book whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  ) : showDiscountField ? (
                    /* Entry state */
                    <div>
                      <label className="block text-sm text-gray-700 font-canaro-book mb-2">
                        Discount code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCode();
                            }
                          }}
                          placeholder="Enter code"
                          autoFocus
                          className="flex-1 px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gp-yellow uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCode}
                          disabled={isApplyingCode || !discountCode.trim()}
                          className="px-5 py-2 rounded-md bg-gp-light-green text-white font-canaro-book hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {isApplyingCode ? 'Checking...' : 'Apply'}
                        </button>
                      </div>
                      {discountMsg?.type === 'error' && (
                        <p className="text-xs mt-2 font-canaro-book text-red-500">{discountMsg.text}</p>
                      )}
                    </div>
                  ) : (
                    /* Collapsed trigger */
                    <button
                      type="button"
                      onClick={() => setShowDiscountField(true)}
                      className="flex items-center gap-1.5 text-sm text-gp-light-green hover:text-gp-dark-green font-canaro-semibold transition-colors"
                    >
                      <Tag size={14} />
                      Have a discount code?
                    </button>
                  )}
                </div>

                {/* SMS Consent (optional) */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="sms-consent"
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setSmsConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 flex-shrink-0 accent-gp-light-green cursor-pointer"
                  />
                  <label htmlFor="sms-consent" className="text-sm text-gray-700 font-canaro-book cursor-pointer">
                    I agree to receive text messages from Golden Palm Foods regarding my order, including shipping updates and any issues that may require my attention.
                  </label>
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
                  onClick={() => handleCheckout()}
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
              {/* Price-change notices (after a 305 correction) */}
              {priceNotices.length > 0 && (
                <div className="mb-6 bg-amber-50 border border-amber-300 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-canaro-semibold text-amber-800">Some prices were updated</p>
                  </div>
                  <ul className="space-y-1 pl-6 list-disc">
                    {priceNotices.map((note, i) => (
                      <li key={i} className="text-xs sm:text-sm text-amber-800 font-canaro-book">{note}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-amber-700 font-canaro-book mt-2">Please review your cart, then continue to checkout.</p>
                </div>
              )}

              <div className="space-y-8">
                {cart.map((item) => {
                  const unavailable = isItemUnavailable(item);
                  return (
                  <div
                    key={`${item.id}-${item.heat_level}`}
                    className={`flex gap-4 border-b pb-4 ${unavailable ? 'border border-red-300 bg-red-50 rounded-lg p-3' : ''}`}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={`https://api.goldenpalmfoods.com${getImageUrl(item)}`}
                        alt={item.name}
                        className={`w-24 h-24 object-cover rounded ${unavailable ? 'opacity-50 grayscale' : ''}`}
                      />
                      {unavailable && (
                        <div className="absolute top-1 left-1 bg-red-600 text-white px-2 py-0.5 rounded text-[0.6rem] font-canaro-semibold uppercase tracking-wide">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-caslon ${unavailable ? 'text-gray-400 line-through' : 'text-gp-light-green'}`}>
                        {item.name}
                      </h3>
                      {unavailable && (
                        <p className="text-xs text-red-600 font-canaro-semibold mt-1 flex items-center gap-1">
                          <AlertTriangle size={12} className="flex-shrink-0" />
                          This item is out of stock. Please remove it to continue.
                        </p>
                      )}
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
                      <div className="flex flex-col items-end">
                        <p className="text-base font-canaro-semibold text-gp-light-green">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </p>
                        {item.on_sale && item.original_price > item.unit_price && (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              ${(item.original_price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-[0.6rem] font-canaro-semibold uppercase tracking-wide text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              Sale
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.heat_level)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  );
                })}
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

              {/* Out-of-stock warning */}
              {hasUnavailableItems && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-300 text-red-700 rounded-md px-3 py-2 mb-3 text-xs font-canaro-semibold">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Some items are out of stock. Please remove them before checking out.</span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => {
                  if (hasUnavailableItems) {
                    ShowToast("error", "Please remove out-of-stock items before checking out.");
                    return;
                  }
                  setShowCheckoutForm(true);
                }}
                disabled={hasUnavailableItems}
                className={`block w-full text-white text-center py-3 px-4 rounded-md font-canaro-book transition-colors mb-3 ${
                  hasUnavailableItems
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gp-yellow hover:bg-yellow-600'
                }`}
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

      {/* Unapplied discount code confirmation */}
      {showUnappliedPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowUnappliedPrompt(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 sm:p-10">
            <h3 className="text-2xl sm:text-3xl font-caslon text-gp-light-green mb-3">Unapplied discount code</h3>
            <p className="text-base text-gray-600 font-canaro-book mb-8">
              You entered the code “{discountCode.trim()}” but didn't apply it. If you continue, it won't be used for this order.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowUnappliedPrompt(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md text-base font-canaro-book hover:bg-gray-50 transition-colors"
              >
                Go back &amp; apply
              </button>
              <button
                onClick={() => {
                  setShowUnappliedPrompt(false);
                  handleCheckout({ skipUnappliedCheck: true });
                }}
                className="flex-1 bg-gp-light-green text-white py-3 rounded-md text-base font-canaro-book hover:bg-green-800 transition-colors"
              >
                Continue without code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
