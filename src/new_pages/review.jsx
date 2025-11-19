import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Header from '../components/header';
import Footer from '../components/footer';
import Loader from '../components/loader';

export default function ReviewPage() {
  const { orderReference } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [orderItemType, setOrderItemType] = useState([])
  const { submitReview, getOrdersDetailsForReview} = useFunctions();

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!orderReference || !token) {
        ShowToast("error", "Invalid review link");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const orderResponse = await getOrdersDetailsForReview(orderReference);
        if (orderResponse.response_code === "000") {
          const order = orderResponse.orders;

          // Set order items with their details
          const items = order.orderItems.map(item => ({
            order_item_reference_no: item.order_item_reference_no,
            item_reference_no: item.item_reference_no,
            item_type: item.item_type,
            quantity: item.quantity,
            unit_amount: item.unit_amount,
            desc: item.desc,
            heat_level: item.heat_level,
            itemDetails: item.itemDetails
          }));

          // Collect unique item types
          const itemTypes = [...new Set(items.map(item => item.item_type))];
          setOrderItemType(itemTypes);

          // Determine order item_type based on what's in the order
          let orderType = '';
          const hasProduct = itemTypes.includes('product');
          const hasBundle = itemTypes.includes('bundle');

          if (hasProduct && hasBundle) {
            orderType = 'bundle and product';
          } else if (hasBundle) {
            orderType = 'bundle';
          } else if (hasProduct) {
            orderType = 'product';
          }

          setOrderInfo({
            order_reference: order.order_custom_id,
            reference_no: order.reference_no,
            created_at: order.createdAt,
            item_type: orderType,
            status: order.status ? 'completed' : 'pending',
            total_amount: order.amount,
            quantity: order.quantity,
            other_info: order.other_info
          });

          setOrderItems(items);
        } else {
          ShowToast("error", "Failed to load order details");
        }
      } catch (error) {
        console.error('Error loading order data:', error);
        ShowToast("error", "Failed to load order details");
      }

      setIsLoading(false);
    };

    fetchOrderItems();
  }, [orderReference, token]);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (selectedRating) => {
    setHoveredRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate rating
    if (rating === 0) {
      ShowToast("error", "Please provide a rating");
      return;
    }

    setIsSubmitting(true);

    // Submit order review
    const response = await submitReview({
      order_id: orderInfo.reference_no,
      item_type: orderInfo.item_type,
      rating: rating,
      comment: comment.trim() || null,
      token: token
    });

    if (response.response_code === '000') {
      ShowToast("success", "Thank you for your review!");
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment('');
      window.location.href = '/';
    } else {
      ShowToast("error", response.msg || "Failed to submit review. Please try again.");
    }

    setIsSubmitting(false);
  };

  const StarRating = () => {
    return (
      <div className="flex gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => handleRatingHover(star)}
            onMouseLeave={() => handleRatingHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={window.innerWidth < 640 ? 32 : 40}
              className={`${
                star <= (hoveredRating || rating)
                  ? 'fill-gp-yellow text-gp-yellow'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  if (!orderInfo || orderItems.length === 0) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-4">Order Not Found</h1>
            <p className="text-gray-600 font-canaro-book text-sm sm:text-base">
              We couldn't find the order you're looking for. Please check your link and try again.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const maxChars = 300;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-caslon text-gp-light-green mb-3 sm:mb-4">
            Share Your Experience
          </h1>
          <p className="text-gray-600 font-canaro-book text-base sm:text-lg">
            Order #{orderInfo.order_reference}
          </p>
          <p className="text-gray-500 font-canaro-light text-sm sm:text-base">
            Placed on {new Date(orderInfo.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-600 font-canaro-light mt-2 text-sm sm:text-base">
            We'd love to hear what you think about your purchase!
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6 lg:sticky lg:top-4">
              <h2 className="text-xl sm:text-2xl font-caslon text-gp-light-green mb-3 sm:mb-4">Order Summary</h2>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between font-canaro-book text-xs sm:text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="text-gray-900">{orderInfo.order_reference}</span>
                </div>
                <div className="flex justify-between font-canaro-book text-xs sm:text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="text-gray-900">{orderInfo.quantity}</span>
                </div>
                <div className="flex justify-between font-canaro-semibold border-t pt-2 sm:pt-3">
                  <span className="text-gray-700 text-sm sm:text-base">Total:</span>
                  <span className="text-gp-light-green text-base sm:text-lg">${parseFloat(orderInfo.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="border-t pt-3 sm:pt-4">
                <h3 className="font-canaro-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Items in Order</h3>
                <div className="space-y-2 sm:space-y-3">
                  {orderItems?.map((item) => (
                    <div key={item.order_item_reference_no} className="flex gap-2 sm:gap-3 pb-2 sm:pb-3 border-b last:border-b-0">
                      {item.itemDetails?.img_url && (
                        <img
                          src={`https://api.goldenpalmfoods.com${item.itemDetails.img_url}`}
                          alt={item.itemDetails.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-canaro-semibold text-xs sm:text-sm text-gray-900">
                          {item.itemDetails?.name || item.desc}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-600 font-canaro-light">
                          Qty: {item.quantity} × ${parseFloat(item.unit_amount).toFixed(2)}
                        </p>
                        {item.heat_level && (
                          <p className="text-[10px] sm:text-xs text-gray-500 font-canaro-light">
                            Heat: {item.heat_level}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Review Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-caslon text-gp-light-green mb-4 sm:mb-6">Rate Your Order</h2>

                {/* Star Rating */}
                <div className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 font-canaro-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                    How would you rate your overall experience?
                  </label>
                  <StarRating />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-gray-700 font-canaro-semibold mb-2 sm:mb-3 text-base sm:text-lg">
                    Tell us about your experience (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, maxChars))}
                    placeholder="Share your thoughts about the products, delivery, packaging, or anything else..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gp-light-green font-canaro-book"
                    rows="6"
                    maxLength={maxChars}
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {comment.length}/{maxChars} characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="mt-6 sm:mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gp-light-green text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
