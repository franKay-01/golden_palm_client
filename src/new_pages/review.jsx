import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Star, Check } from 'lucide-react';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Header from '../components/header';
import Seo from '../components/seo';
import Footer from '../components/footer';
import Loader from '../components/loader';

export default function ReviewPage() {
  const { orderReference } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [items, setItems] = useState([]);
  const [email, setEmail] = useState('');
  const [reviewed, setReviewed] = useState({});   // { [index]: true }
  const [ratings, setRatings] = useState({});     // { [index]: 1-5 }
  const [hovered, setHovered] = useState({});     // { [index]: 1-5 }
  const [comments, setComments] = useState({});   // { [index]: string }

  const [isLoading, setIsLoading] = useState(true);
  const [invalidLink, setInvalidLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const { getOrderReviewItems, submitItemReview } = useFunctions();

  const maxChars = 300;

  useEffect(() => {
    const load = async () => {
      if (!orderReference || !token) {
        setInvalidLink(true);
        setIsLoading(false);
        return;
      }

      const res = await getOrderReviewItems(orderReference, token);
      if (res.response_code === '000') {
        const loaded = res.items || [];
        setItems(loaded);
        setEmail(res.email || '');
        // Seed already-reviewed items
        const seed = {};
        loaded.forEach((it, i) => { if (it.already_reviewed) seed[i] = true; });
        setReviewed(seed);
      } else {
        setInvalidLink(true);
      }
      setIsLoading(false);
    };

    load();
  }, [orderReference, token]);

  const itemLabel = (item) =>
    item.heat_level ? `${item.name} (${item.heat_level})` : item.name;

  const handleSubmit = async () => {
    // Items the customer actually rated and hasn't already reviewed
    const toSubmit = items
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => !reviewed[index] && ratings[index] > 0);

    if (toSubmit.length === 0) {
      ShowToast('error', 'Please rate at least one item to submit.');
      return;
    }

    setIsSubmitting(true);

    // One call per rated item (fired in parallel)
    const results = await Promise.all(
      toSubmit.map(({ item, index }) =>
        submitItemReview({
          order_id: orderReference,
          item_reference_no: item.item_reference_no,
          rating: ratings[index],
          comment: (comments[index] || '').trim(),
          token,
        }).then((res) => ({ index, res }))
      )
    );

    const newReviewed = { ...reviewed };
    let failures = 0;
    results.forEach(({ index, res }) => {
      // 000 success, 002 already-reviewed -> both mark as reviewed
      if (res.response_code === '000' || res.response_code === '002') {
        newReviewed[index] = true;
      } else {
        failures += 1;
        ShowToast('error', res.response_message || 'Failed to submit a review.');
      }
    });

    setReviewed(newReviewed);
    setIsSubmitting(false);

    if (failures === 0) {
      ShowToast('success', 'Thank you for your review!');
      // If every item in the order is now reviewed, show the full thank-you state
      if (items.every((_, i) => newReviewed[i])) {
        setAllDone(true);
      }
    }
  };

  const StarInput = ({ index, disabled }) => (
    <div className="flex gap-1 sm:gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => setRatings((prev) => ({ ...prev, [index]: star }))}
          onMouseEnter={() => !disabled && setHovered((prev) => ({ ...prev, [index]: star }))}
          onMouseLeave={() => !disabled && setHovered((prev) => ({ ...prev, [index]: 0 }))}
          className={`focus:outline-none transition-transform ${disabled ? 'cursor-not-allowed' : 'hover:scale-110'}`}
        >
          <Star
            size={32}
            className={`${
              star <= (hovered[index] || ratings[index] || 0)
                ? 'fill-gp-yellow text-gp-yellow'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

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

  if (invalidLink) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-4">Review link unavailable</h1>
            <p className="text-gray-600 font-canaro-book text-sm sm:text-base">
              This review link is invalid or has expired.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (allDone) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-gp-light-green" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-caslon text-gp-light-green mb-4">Thank you for your reviews!</h1>
            <p className="text-gray-600 font-canaro-book text-sm sm:text-base">
              We appreciate you taking the time to share your feedback.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Seo title="Rate Your Order" path="/review" noIndex />
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-caslon text-gp-light-green mb-3">
            Rate Your Items
          </h1>
          <p className="text-gray-600 font-canaro-book text-base sm:text-lg">
            Order #{orderReference}
          </p>
          {email && (
            <p className="text-gray-500 font-canaro-light text-sm sm:text-base">{email}</p>
          )}
          <p className="text-gray-600 font-canaro-light mt-2 text-sm sm:text-base">
            Rate the items you'd like — you don't have to review all of them.
          </p>
        </div>

        {/* Per-item review cards */}
        <div className="space-y-5 sm:space-y-6">
          {items.map((item, index) => {
            const isReviewed = !!reviewed[index];
            return (
              <div
                key={`${item.item_reference_no}-${index}`}
                className={`border rounded-lg p-4 sm:p-6 ${isReviewed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-caslon text-gp-light-green">
                      {itemLabel(item)}
                    </h2>
                    <p className="text-xs text-gray-400 font-canaro-book uppercase tracking-wide mt-0.5">
                      {item.item_type}
                    </p>
                  </div>
                  {isReviewed && (
                    <span className="flex items-center gap-1 text-sm font-canaro-semibold text-gp-light-green whitespace-nowrap">
                      <Check size={16} /> Reviewed
                    </span>
                  )}
                </div>

                <StarInput index={index} disabled={isReviewed} />

                {!isReviewed && (
                  <div className="mt-4">
                    <textarea
                      value={comments[index] || ''}
                      onChange={(e) =>
                        setComments((prev) => ({ ...prev, [index]: e.target.value.slice(0, maxChars) }))
                      }
                      placeholder="Add a comment (optional)…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gp-light-green font-canaro-book"
                      rows="3"
                      maxLength={maxChars}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {(comments[index] || '').length}/{maxChars} characters
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {!items.every((_, i) => reviewed[i]) && (
          <div className="mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gp-light-green text-white px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-canaro-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Reviews'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
