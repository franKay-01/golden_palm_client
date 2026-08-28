import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '../components/header';
import Seo from '../components/seo';
import Footer from '../components/footer';

// Landing page for Stripe's WHOLESALE_SUCCESS_URL (default /wholesale/success?order=WH-…).
// The order only exists once payment completes, so this page simply confirms it.
export default function WholesaleSuccessPage() {
  const [params] = useSearchParams();
  const orderRef = params.get('order');

  return (
    <>
      <Seo
        title="Order Confirmed"
        description="Your Golden Palm Foods wholesale order is confirmed."
        path="/wholesale/success"
        noIndex
      />
      <Header />

      <section className="bg-gp-light-green py-20 sm:py-28">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 sm:p-10 text-center">
            <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-gp-light-green" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-caslon text-gp-light-green mb-2">
              Thank you for your order!
            </h1>
            {orderRef && (
              <p className="text-gray-500 font-canaro-book mb-2">
                Order reference:{' '}
                <span className="font-canaro-semibold text-gray-800">{orderRef}</span>
              </p>
            )}
            <p className="text-gray-600 font-canaro-book mb-6">
              Your payment was received and your wholesale order is confirmed. We'll email you a
              receipt and follow up shortly with fulfillment details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/wholesale"
                className="bg-gp-light-green text-white px-6 py-3 rounded-lg font-canaro-semibold hover:bg-green-800 transition-colors"
              >
                Place another order
              </Link>
              <Link
                to="/"
                className="border border-gp-light-green text-gp-light-green px-6 py-3 rounded-lg font-canaro-semibold hover:bg-green-50 transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
