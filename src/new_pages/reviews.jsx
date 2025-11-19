import React, { useState, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import Header from '../components/header';
import YellowBrushImg from '../assets/images/brush_yellow.png'
import Asset3Img from "../assets/images/asset_3.png"
import Asset6Img from '../assets/images/asset_6.png'
import FacebookLogo from '../assets/facebook_alt.png'
import InstagramLogo from '../assets/instagram_alt.png'
import TiktokLogo from "../assets/images/tiktok.png"
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import Footer from '../components/footer';

export default function ReviewsPage() {
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const { getAllReviews } = useFunctions();

  const maskOrderId = (orderId) => {
    const clean = String(orderId).replace(/[^a-zA-Z0-9]/g, "");
    const last5 = clean.slice(-5);
    return "*****" + last5;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const { response_code, reviews, msg } = await getAllReviews();

      if (response_code === '000') {
        setAllReviews(reviews);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      ShowToast("error", msg || "Failed to load reviews");
    };

    fetchReviews();
  }, []);

  const StarDisplay = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= rating
                ? 'fill-gp-yellow text-gp-yellow'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = allReviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'product') return review.item_type === 'product' || review.item_type === 'bundle and product';
    if (filter === 'bundle') return review.item_type === 'bundle' || review.item_type === 'bundle and product';
    return true;
  });

  const averageRating = allReviews.length > 0
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : 0;

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className='relative'>
        <img src={Asset3Img} className='hidden md:block absolute w-[8rem] h-[10rem] md:w-[12rem] md:h-[15rem] top-[-4rem] right-[4rem]' alt="Ebesse" />
      </div>
      <div className='flex flex-col items-center mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 justify-center px-4'>
        <h1 className="text-gp-light-green text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] font-caslon tracking-wide">Reviews</h1>
        <img src={YellowBrushImg} className='w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%]'/>
      </div>
     
      {isLoading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <Loader/>
        </div>
      ) : allReviews.length === 0 ? (
        <div className='flex justify-center items-center min-h-[400px] px-4'>
          <div className="text-center">
            <h3 className="text-gp-light-green text-2xl sm:text-3xl md:text-[3rem] font-caslon mb-4">No Reviews Available</h3>
            <p className="text-gray-600 text-base sm:text-lg font-canaro-book">Check back soon for new reviews and updates!</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
          {/* Stats Summary */}
          <div className="bg-gradient-to-r from-gp-light-green to-green-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-caslon mb-2">{allReviews.length}</p>
                <p className="font-canaro-book text-base sm:text-lg">Total Reviews</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-caslon mb-2">{averageRating}</p>
                <div className="flex justify-center mb-2">
                  <StarDisplay rating={Math.round(averageRating)} />
                </div>
                <p className="font-canaro-book text-base sm:text-lg">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-caslon mb-2">
                  {allReviews.filter(r => r.rating === 5).length}
                </p>
                <p className="font-canaro-book text-base sm:text-lg">5-Star Reviews</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-canaro-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-gp-light-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter('product')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-canaro-semibold transition-colors ${
                filter === 'product'
                  ? 'bg-gp-light-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setFilter('bundle')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-canaro-semibold transition-colors ${
                filter === 'bundle'
                  ? 'bg-gp-light-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Bundles
            </button>
          </div>

          {/* Reviews Grid */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-canaro-book text-lg">No reviews found for this filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Rating and Date */}
                  <div className="flex justify-between items-start mb-4">
                    <StarDisplay rating={review.rating} />
                    <span className="text-xs text-gray-500 font-canaro-light">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 font-canaro-light text-sm mb-4 ">
                      "{review.comment}"
                    </p>
                  )}

                  {/* Customer Info */}
                  <div className="border-t flex flex-row items-center justify-between pt-4">
                    <p className="text-sm font-canaro-semibold text-gray-900 mb-1">
                      {review.user_email.split('@')[0]}
                    </p>
                    <div className="flex items-center justify-between">
                      
                      {review.order && (
                        <span className="text-xs text-gray-600 font-canaro-book">
                          Order #{maskOrderId(review.order.order_custom_id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 sm:mt-16 bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-3 sm:mb-4">
              Share Your Experience
            </h2>
            <p className="text-gray-600 font-canaro-book text-sm sm:text-base mb-4 sm:mb-6">
              Have you tried our products? We'd love to hear from you!
            </p>
            <button
              onClick={() => window.location.href = '/shop?tp=all'}
              className="bg-gp-light-green text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-green-800 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      )}
      <div className='hidden md:grid grid-cols-3 gap-4'>
        <img src={Asset6Img} className='w-full max-w-[12rem] h-auto max-h-[34rem]' alt="" />
        <div className='flex justify-center items-center'>
          <div className="text-center py-12">
            <h3 className="text-3xl md:text-4xl lg:text-[5rem] font-dry-brush leading-[1] text-gray-800">Mi Dounou</h3>
            <p className="text-gray-800 font-canaro-semibold text-lg md:text-xl lg:text-[2rem] mb-2">"Let's Eat"</p>
            <div className='flex flex-row gap-4 items-center justify-center'>
              <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
                <img src={FacebookLogo}/>
              </a>
              <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
                <img src={InstagramLogo}/>
              </a>
              <a href='/get-started' className="brown-button button-margin-left w-10 h-10 md:w-auto md:h-auto bg-gp-yellow rounded-md p-1">
                <img src={TiktokLogo} className="w-full h-full object-contain"/>
              </a>
            </div>
            <p className="text-gray-800 font-canaro-semibold mt-1 text-base md:text-lg lg:text-[1.5rem]">@Goldenpalmfoods</p>
          </div>
        </div>
        <div className='flex justify-center items-center'>
          <img src={Asset3Img} className='w-full max-w-[12rem] h-auto max-h-[12rem]' alt="" />
        </div>
      </div>
      <div className='md:hidden flex flex-col items-center py-8 px-4'>
        <div className="text-center mb-6">
          <h3 className="text-4xl sm:text-5xl font-dry-brush leading-[1] text-gray-800">Mi Dounou</h3>
          <p className="text-gray-800 font-canaro-semibold text-lg sm:text-xl mb-2">"Let's Eat"</p>
          <div className='flex flex-row gap-4 items-center justify-center'>
            <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
              <img src={FacebookLogo}/>
            </a>
            <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
              <img src={InstagramLogo}/>
            </a>
            <a href='/get-started' className="brown-button button-margin-left w-[2rem] md:w-auto md:h-auto bg-gp-yellow rounded-full p-[5px]">
              <img src={TiktokLogo} className="w-full h-full object-contain"/>
            </a>
          </div>
          <p className="text-gray-800 font-canaro-semibold mt-1 text-base">@Goldenpalmfoods</p>
        </div>
      </div>

      <Footer/>
    </>
  );
};