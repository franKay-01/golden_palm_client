import React, { useContext, useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, Tag, Check, Minus, Plus, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/cartContext';
import { ShowToast } from './showToast';
import useFunctions from '../utils/functions';
import { isOnSale, effectiveUnitPrice } from '../utils/pricing';
import { estimateShipping, cartItemCount } from '../utils/shipping';
import { apiImageProps } from '../utils/images';
import EmptyCart from './emptyCart';

// Small "+" registration marks on the corners of an element (purely decorative)
const Crosshairs = () => (
  <>
    {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos) => (
      <span key={pos} aria-hidden="true" className={`absolute ${pos} w-4 h-4 pointer-events-none`}>
        <span className="absolute left-1/2 top-0 h-full w-px bg-gray-500" />
        <span className="absolute top-1/2 left-0 w-full h-px bg-gray-500" />
      </span>
    ))}
  </>
);

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, calculateTotal, changePrice, updateCartPricing } = useContext(CartContext);
  const shipping = estimateShipping(cartItemCount(cart), calculateTotal());
  // Items at pre-sale prices, so the summary can show "Sale savings" as its own line
  const itemsBeforeSale = cart.reduce((sum, item) => {
    const wasSale = item.on_sale && item.original_price > item.unit_price;
    return sum + (wasSale ? item.original_price : item.unit_price) * item.quantity;
  }, 0);
  const saleSavings = itemsBeforeSale - calculateTotal();
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  // Discount code: `discountCode` is the input, `appliedCode` is the validated code sent at checkout
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountMsg, setDiscountMsg] = useState(null); // { type: 'success' | 'error', text }
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [showDiscountField, setShowDiscountField] = useState(false); // collapsed by default
  const [showUnappliedPrompt, setShowUnappliedPrompt] = useState(false); // typed-but-not-applied code
  const [priceNotices, setPriceNotices] = useState([]); // messages about corrected prices
  // Arizona pickup / free local delivery. `inAz` is null until the customer answers; everyone else
  // (answers No, or skips) checks out with standard shipping and no zip, exactly as before.
  const [inAz, setInAz] = useState(null);
  const [azZip, setAzZip] = useState('');
  const [azCheck, setAzCheck] = useState(null); // az-check result for the current zip + subtotal
  const [azChecking, setAzChecking] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // 'standard' | 'pickup' | 'local_delivery'
  const [deliveryError, setDeliveryError] = useState('');
  const { submitCheckOut, getProductDetail, validateDiscountCode, getProductsAndBundles, checkAzShipping, getActiveSaleEvent, getCheckoutSettings } = useFunctions();
  // Backend kill switch for the Arizona step: null while loading (render nothing, no flash),
  // then true/false. When false, checkout behaves as if the customer is outside Arizona.
  const [askAz, setAskAz] = useState(null);
  const [saleEvent, setSaleEvent] = useState(null); // active sale, for its optional pickup/delivery notes
  const subtotal = calculateTotal();
  const zipValid = /^\d{5}$/.test(azZip);
  const pickupOffered = !!(azCheck && azCheck.is_az && azCheck.pickup_eligible);
  const localOffered = !!(azCheck && azCheck.is_az && azCheck.local_delivery_eligible);
  // Pickup / local delivery are free, so the summary and totals follow the chosen method
  const freeShipping = deliveryMethod === 'pickup' || deliveryMethod === 'local_delivery';
  const orderTotal = calculateTotal() + (freeShipping ? 0 : (shipping.amount || 0));

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
      const changed = [];
      cart.forEach(item => {
        const info = pricingById[item.productId];
        if (!info) return;
        updates[item.productId] = info;
        // Tell the customer when a price moved since they added the item (a sale started or ended)
        if (Math.abs(parseFloat(item.unit_price) - info.unit_price) > 0.01) {
          changed.push(`The price of ${item.name} changed from $${parseFloat(item.unit_price).toFixed(2)} to $${info.unit_price.toFixed(2)}.`);
        }
      });
      if (Object.keys(updates).length) updateCartPricing(updates);
      if (changed.length) setPriceNotices(changed);
    };

    setPriceNotices([]); // start each open with a clean slate
    refreshPrices();
    // Run once per open; reading `cart` from closure at open time is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Read the kill switch each time the cart opens so an admin change applies without a reload
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      const res = await getCheckoutSettings();
      if (cancelled) return;
      setAskAz(res.ask_arizona_question);
      if (!res.ask_arizona_question) {
        // Switched off: drop any earlier Arizona answer so nothing is sent
        setInAz(null); setAzZip(''); setDeliveryMethod('standard'); setDeliveryError('');
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load the active sale once the customer says they're in Arizona; its delivery_info /
  // pickup_info is optional copy shown after they pick a method. Failure just means no notice.
  useEffect(() => {
    if (!isOpen || inAz !== true) return;
    let cancelled = false;
    (async () => {
      const res = await getActiveSaleEvent();
      if (!cancelled) setSaleEvent(res.is_active ? res.event : null);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, inAz]);

  // Debounced eligibility check once a full zip is typed; re-runs if the subtotal changes
  // (local delivery needs $75+). `cancelled` drops out-of-order responses.
  useEffect(() => {
    if (!isOpen || inAz !== true || !zipValid) {
      setAzCheck(null);
      setAzChecking(false);
      return;
    }
    let cancelled = false;
    setAzChecking(true);
    const t = setTimeout(async () => {
      const result = await checkAzShipping(azZip, subtotal);
      if (cancelled) return;
      setAzCheck(result);
      setAzChecking(false);
    }, 500);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, inAz, azZip, subtotal]);

  // If the chosen method stops being offered (zip edited, cart changed), fall back to standard
  useEffect(() => {
    if (deliveryMethod === 'pickup' && !pickupOffered) setDeliveryMethod('standard');
    if (deliveryMethod === 'local_delivery' && !localOffered) setDeliveryMethod('standard');
  }, [pickupOffered, localOffered, deliveryMethod]);

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
    // Don't even attempt checkout if a line item is already flagged out of stock
    if (hasUnavailableItems) {
      ShowToast("error", "Some items in your cart are out of stock. Please update your cart before checking out.");
      return;
    }

    // A code was typed but never applied — confirm before proceeding without it
    if (!skipUnappliedCheck && !appliedCode && discountCode.trim()) {
      setShowUnappliedPrompt(true);
      return;
    }

    // Don't send a pickup/delivery choice before its eligibility check has come back
    if (deliveryMethod !== 'standard' && azChecking) {
      ShowToast("error", "Still checking your Arizona options. One moment.");
      return;
    }

    setDeliveryError('');
    setIsLoading(true);
    const params = {
      email: email,
      shipping_address: shippingAddress,
      phone_number: phoneNumber || null,
      cart: cart,
      sms_consent: smsConsent
    };
    // Arizona pickup / local delivery: only sent when chosen; everyone else omits both fields
    if (askAz === true && inAz === true && deliveryMethod !== 'standard') {
      params.delivery_method = deliveryMethod;
      params.zipcode = azZip;
    }
    // Include the applied discount code if one was validated; omit otherwise
    if (appliedCode) {
      params.discount_code = appliedCode;
    }

    const { response_code, checkout_url, error, msg, outOfStock, discountRejected, deliveryRejected, priceMismatch, mismatches } = await submitCheckOut(params);

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
      ShowToast("error", msg || "Some prices in your cart have changed. Please review and try again.");
      return;
    }

    // 310: pickup / local delivery no longer qualifies (e.g. a coupon dropped the total under $75).
    // Do NOT redirect; show the reason inline and fall back to standard shipping.
    if (deliveryRejected) {
      setDeliveryMethod('standard');
      setDeliveryError(msg || "That delivery option isn't available for this order.");
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
      ShowToast("error", msg || "An item in your cart is out of stock. Please update your cart to continue.");
      return;
    }

    ShowToast("error", msg || "Checkout failed. Please try again.");
  };

  // Pieces rendered once in the desktop summary column and once in the phone sticky footer
  const totalRow = (
    <div className="flex items-end justify-between">
      <span className="text-lg md:text-xl font-caslon uppercase tracking-wide text-gp-black">Total</span>
      <span className="text-3xl md:text-4xl font-canaro-semibold text-gp-black leading-none">${orderTotal.toFixed(2)}</span>
    </div>
  );

  const oosWarning = hasUnavailableItems ? (
    <div className="flex items-start gap-2 bg-red-50 border border-red-300 text-red-700 rounded-md px-3 py-2 mb-3 text-xs font-canaro-semibold">
      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
      <span>Some items are out of stock. Please remove them before checking out.</span>
    </div>
  ) : null;

  const checkoutButton = (
    <div className="relative">
      <button
        onClick={() => {
          if (hasUnavailableItems) {
            ShowToast("error", "Please remove out-of-stock items before checking out.");
            return;
          }
          handleCheckout();
        }}
        disabled={hasUnavailableItems || isLoading}
        className={`flex items-center justify-center gap-3 w-full text-white py-4 px-4 font-canaro-semibold tracking-[0.12em] transition-colors ${
          hasUnavailableItems || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gp-yellow hover:bg-yellow-600'
        }`}
      >
        {isLoading ? (
          'PROCESSING...'
        ) : (
          <>
            <span>CHECKOUT</span>
            <span aria-hidden="true">·</span>
            <span>${orderTotal.toFixed(2)}</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
      <Crosshairs />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-scroll md:overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 border-b">
          <h2 className="text-[1.75rem] md:text-[2.3rem] font-caslon text-black">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gp-yellow transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {cart.length === 0 ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <>
          <div className="flex flex-col md:flex-row md:max-h-[calc(90vh-5.5rem)]">
            {/* Cart Items - Left Side */}
            <div className="flex-1 min-w-0 px-4 sm:px-6 py-2 md:py-6 md:overflow-y-auto">
              {/* Price-change notices (after a 305 correction) */}
              {priceNotices.length > 0 && (
                <div className="mt-4 mb-4 md:mb-6 bg-amber-50 border border-amber-300 rounded-lg p-3 sm:p-4">
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

              {/* Table header (desktop only) */}
              <div className="hidden md:flex items-center gap-4 pb-3 border-b border-gray-300 text-xs font-canaro-semibold uppercase tracking-[0.18em] text-gray-500">
                <span className="w-6 flex-shrink-0">No.</span>
                <span className="flex-1">Product</span>
                <span>Price</span>
              </div>

              <div>
                {cart.map((item, index) => {
                  const unavailable = isItemUnavailable(item);
                  const onSale = item.on_sale && item.original_price > item.unit_price;
                  const percentOff = onSale ? Math.round((1 - item.unit_price / item.original_price) * 100) : 0;
                  return (
                    <div
                      key={`${item.id}-${item.heat_level}`}
                      className={`relative flex gap-3 md:gap-4 py-4 md:py-5 border-b border-gray-200 ${unavailable ? 'bg-red-50 border-red-200' : ''}`}
                    >
                      <span className="hidden md:block w-6 flex-shrink-0 pt-1 text-sm font-canaro-book text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Product Image */}
                      <div className="flex-shrink-0 self-start relative w-24 h-24 bg-white border border-gray-200">
                        <img
                          {...apiImageProps(getImageUrl(item), '96px')}
                          alt={item.name}
                          className={`w-full h-full object-cover ${unavailable ? 'opacity-50 grayscale' : ''}`}
                        />
                        <Crosshairs />
                        {unavailable && (
                          <div className="absolute top-1 left-1 bg-red-600 text-white px-2 py-0.5 rounded text-[0.6rem] font-canaro-semibold uppercase tracking-wide">
                            Out of Stock
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 pr-8 md:pr-0">
                        <h3 className={`text-lg sm:text-xl font-caslon leading-tight ${unavailable ? 'text-gray-400 line-through' : 'text-gp-light-green'}`}>
                          {item.name}
                        </h3>
                        {unavailable && (
                          <p className="text-xs text-red-600 font-canaro-semibold mt-1 flex items-center gap-1">
                            <AlertTriangle size={12} className="flex-shrink-0" />
                            This item is out of stock. Please remove it to continue.
                          </p>
                        )}
                        {item.heat_level && (
                          <p className="text-sm text-gray-500 font-canaro-book mt-1">
                            Heat level · {item.heat_level}
                          </p>
                        )}
                        {item.type === 'bundle' && (
                          <p className="text-sm text-gray-500 font-canaro-book mt-1">
                            {item.product_details?.map(p => p.name).join(' + ')}
                          </p>
                        )}

                        {/* Quantity stepper + Remove (desktop) */}
                        <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-3">
                          <div className="inline-flex items-stretch border border-gray-300 bg-white">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white disabled:cursor-not-allowed"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 h-10 md:h-9 flex items-center justify-center border-x border-gray-300 text-base text-gp-black font-canaro-book">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.heat_level)}
                            className="hidden md:flex items-center gap-1.5 text-sm font-canaro-semibold text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Remove (phone): icon at the top right of the row */}
                      <button
                        onClick={() => removeFromCart(item.id, item.heat_level)}
                        aria-label={`Remove ${item.name}`}
                        className="md:hidden absolute top-4 right-0 p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      {/* Price: bottom right on phones */}
                      <div className="flex flex-col items-end justify-end md:justify-start flex-shrink-0 self-end md:self-auto">
                        {onSale && (
                          <span className="text-sm text-gray-400 line-through font-canaro-book md:order-2">
                            ${(item.original_price * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <p className="text-lg sm:text-xl font-canaro-semibold text-gp-black md:order-1">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </p>
                        {onSale && (
                          <span className="hidden md:inline-block md:order-3 mt-2 text-xs font-canaro-semibold text-gp-light-green bg-gp-cream border border-gp-yellow/50 px-2 py-1 whitespace-nowrap">
                            Sale −{percentOff}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary - Right Side (below the items on phones) */}
            <div className="w-full md:w-[27rem] flex-shrink-0 flex flex-col bg-gp-cream border-t md:border-t-0 md:border-l border-gray-200 px-4 sm:px-6 py-5 md:py-6 md:overflow-y-auto">
              {/* Summary lines */}
              <div className="order-2 md:order-1">
                <h3 className="text-sm font-canaro-semibold uppercase tracking-[0.18em] text-gp-light-green mb-4 md:mb-5">Order Summary</h3>
                <div className="space-y-1.5 text-base font-canaro-book text-gp-black">
                  <div className="flex justify-between">
                    <span>Items ({cartItemCount(cart)})</span>
                    <span>${itemsBeforeSale.toFixed(2)}</span>
                  </div>
                  {saleSavings > 0.004 && (
                    <div className="flex justify-between text-gp-light-green">
                      <span>Sale savings</span>
                      <span>−${saleSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{freeShipping ? 'Free' : shipping.needsQuote ? 'Contact us for a quote' : `$${shipping.amount.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
              </div>

              {/* Total (desktop; phones show it in the sticky footer) */}
              <div className="hidden md:block order-2">
                <div className="border-t border-gp-black my-5" />
                <div className="mb-6">{totalRow}</div>
              </div>

              {/* Discount code (first on phones, like the link above the summary) */}
              <div className="order-1 md:order-3 mb-5 md:mb-4">
                {appliedCode ? (
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
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => (showDiscountField ? handleRemoveCode() : setShowDiscountField(true))}
                      className="flex items-center gap-2 text-base text-gp-light-green hover:text-gp-dark-green font-canaro-semibold transition-colors"
                    >
                      <Tag size={16} />
                      {showDiscountField ? 'Hide discount code' : 'Add a discount code'}
                    </button>
                    {showDiscountField && (
                      <div className="mt-3">
                        <label htmlFor="discount-code" className="block text-sm text-gray-600 font-canaro-book mb-2">
                          Discount code
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="discount-code"
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyCode();
                              }
                            }}
                            placeholder="E.G. PALM10"
                            autoFocus
                            className="flex-1 min-w-0 px-3 py-2.5 text-sm text-gp-black bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gp-yellow uppercase"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCode}
                            disabled={isApplyingCode || !discountCode.trim()}
                            className="flex-shrink-0 px-4 py-2.5 text-sm bg-gp-light-green text-white font-canaro-semibold hover:bg-gp-dark-green transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {isApplyingCode ? 'Checking...' : 'Apply'}
                          </button>
                        </div>
                        {discountMsg?.type === 'error' && (
                          <p className="text-xs mt-2 font-canaro-book text-red-500">{discountMsg.text}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Arizona pickup / local delivery (optional; everyone else ships standard) */}
              {askAz === true && (
              <div className="order-2 md:order-3 mt-5 md:mt-0 md:mb-5 border-t border-gray-300 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-canaro-semibold text-gp-black">Are you in Arizona?</span>
                  <div className="inline-flex border border-gp-black" role="group" aria-label="Are you in Arizona?">
                    {[{ v: true, label: 'Yes' }, { v: false, label: 'No' }].map(({ v, label }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          const next = inAz === v ? null : v;
                          setInAz(next);
                          setDeliveryError('');
                          if (next !== true) { setAzZip(''); setDeliveryMethod('standard'); }
                        }}
                        aria-pressed={inAz === v}
                        className={`min-w-[3.5rem] px-4 py-2 text-sm font-canaro-semibold transition-colors ${
                          inAz === v ? 'bg-gp-light-green text-white' : 'bg-white text-gp-black hover:bg-gray-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {inAz === true && (
                  <div className="mt-3">
                    <label htmlFor="az-zip" className="sr-only">Arizona ZIP code</label>
                    <input
                      id="az-zip"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      autoFocus
                      maxLength={5}
                      value={azZip}
                      onChange={(e) => { setAzZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setDeliveryError(''); }}
                      placeholder="ZIP code, e.g. 85004"
                      className={`w-full px-3 py-3 text-sm text-gp-black bg-white border focus:outline-none focus:border-gp-light-green placeholder:text-gray-400 ${zipValid ? 'border-gp-light-green' : 'border-gray-300'}`}
                    />
                    {azChecking && <p className="text-xs text-gray-500 font-canaro-book mt-2">Checking your options...</p>}

                    {zipValid && !azChecking && azCheck && !azCheck.is_az && (
                      <p className="text-xs text-gray-600 font-canaro-book mt-2">That zip isn't in Arizona — standard shipping will apply.</p>
                    )}
                    {zipValid && !azChecking && !azCheck && (
                      <p className="text-xs text-gray-600 font-canaro-book mt-2">We couldn't check that zip right now — standard shipping will apply.</p>
                    )}

                    {zipValid && !azChecking && azCheck?.is_az && (
                      <>
                        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Delivery method">
                          {[
                            { v: 'standard', label: 'Standard', price: shipping.needsQuote ? 'Quote' : `$${shipping.amount.toFixed(2)}`, show: true },
                            { v: 'pickup', label: 'Pickup', price: 'Free', show: pickupOffered },
                            { v: 'local_delivery', label: 'Local delivery', price: 'Free', show: localOffered },
                          ].filter(o => o.show).map(o => (
                            <button
                              key={o.v}
                              type="button"
                              role="radio"
                              aria-checked={deliveryMethod === o.v}
                              onClick={() => { setDeliveryMethod(o.v); setDeliveryError(''); }}
                              className={`flex-1 flex flex-col items-center justify-center gap-0 px-2 py-1.5 text-center text-xs leading-tight font-canaro-semibold text-gp-black transition-colors ${
                                deliveryMethod === o.v ? 'border-2 border-gp-light-green bg-[#F3ECD6]' : 'border border-gray-300 bg-white hover:border-gray-400'
                              }`}
                            >
                              <span>{o.label}</span>
                              <span className={o.price === 'Free' ? 'text-gp-light-green' : 'text-gp-black'}>{o.price}</span>
                            </button>
                          ))}
                        </div>
                        {deliveryMethod !== 'standard' && (
                          <p className="text-sm text-gray-600 font-canaro-book mt-3">
                            Your shipping is set to {deliveryMethod === 'pickup' ? 'pickup' : 'local delivery'} (free) at checkout. It can't be changed on the payment page.
                          </p>
                        )}
                        {(() => {
                          // Optional logistics copy from the active sale (e.g. a fixed holiday pickup window)
                          const info = deliveryMethod === 'pickup' ? saleEvent?.pickup_info
                            : deliveryMethod === 'local_delivery' ? saleEvent?.delivery_info : null;
                          return info && String(info).trim() ? (
                            <p className="mt-3 border-l-4 border-gp-yellow bg-white px-3 py-2 text-sm text-gp-black font-canaro-book">
                              {info}
                            </p>
                          ) : null;
                        })()}
                      </>
                    )}
                  </div>
                )}

                {deliveryError && (
                  <p className="text-xs mt-2 font-canaro-book text-red-500">{deliveryError} Standard shipping is selected.</p>
                )}
              </div>
              )}

              {/* SMS Consent (optional) */}
              <div className="order-3 md:order-4 flex items-start gap-3 mt-5 md:mt-0 md:mb-6">
                <input
                  id="sms-consent"
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-1 h-5 w-5 flex-shrink-0 accent-gp-light-green cursor-pointer"
                />
                <label htmlFor="sms-consent" className="text-sm text-gray-700 font-canaro-book cursor-pointer">
                  I agree to receive text messages from Golden Palm Foods regarding my order, including shipping updates and any issues that may require my attention.
                </label>
              </div>

              {/* Checkout (desktop; phones use the sticky footer below) */}
              <div className="hidden md:block order-5">
                {oosWarning}
                <div className="mb-4">{checkoutButton}</div>
                <button
                  onClick={onClose}
                  className="block w-full text-center text-base font-canaro-semibold text-gp-black hover:text-gp-light-green py-2"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </div>

          {/* Sticky total + checkout (phones) */}
          <div className="md:hidden sticky bottom-0 z-10 bg-white border-t border-gray-300 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {oosWarning}
            {totalRow}
            <p className="text-xs text-gray-500 font-canaro-book mt-1 mb-3">
              {saleSavings > 0.004 ? `You save $${saleSavings.toFixed(2)} · ` : ''}tax at checkout
            </p>
            {checkoutButton}
            <button
              onClick={onClose}
              className="block w-full text-center text-base font-canaro-semibold text-gp-black py-2 mt-2"
            >
              Continue shopping
            </button>
          </div>
          </>
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
