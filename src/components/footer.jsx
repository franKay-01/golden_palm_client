import React, { useState } from 'react';
import { Facebook, Instagram, Tiktok } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoAlt from "../assets/images/logo.png";
import FacebookIcon from '../assets/icons/icons_facebook_white.png'
import InstagramIcon from '../assets/icons/icons_instagram_white.png'
import TiktokIcon from '../assets/icons/icons_tiktok_white.png'
import useFunctions from '../utils/functions';
import { ShowToast } from './showToast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { createEmailSubscription } = useFunctions();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    // Basic email validation before hitting the backend
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      ShowToast("error", "Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    // Backend forwards this to the MailerLite newsletter list (token stays server-side)
    const { response_code, msg } = await createEmailSubscription({ email: trimmed });
    setIsSubscribing(false);

    if (response_code === '000' || response_code === 200 || response_code === "200") {
      ShowToast("success", msg || "Thanks for subscribing!");
      setEmail('');
    } else {
      ShowToast("error", msg || "Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gp-light-green to-gp-light-green text-white px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Navigation */}
          <div className="space-y-6">
            <nav className="space-y-4">
              <Link to="/faqs" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                FAQ
              </Link>
              <Link to="/reviews" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                Testimonials
              </Link>
              <Link to="/wholesale" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                Wholesale
              </Link>
              <Link to="/terms-of-service" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                Terms & conditions
              </Link>
              <Link to="/privacy" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Center Logo */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              {/* Palm leaf icon */}
              <img src={LogoAlt}  className='w-[10rem] h-[10rem]'/>
            </div>
          </div>

          {/* Right Email Signup */}
          <div className="space-y-6">
            {/* Newsletter Sign-up */}
            <div>
              <h3 className="text-2xl font-bold mb-2 font-canaro-book">Join our newsletter</h3>
              <p className="text-sm text-green-100 mb-4 font-canaro-light">
                Bold West African flavors, recipes, and offers — straight to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 font-canaro-book focus:outline-none focus:ring-2 focus:ring-gp-yellow"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gp-yellow text-white px-6 py-3 rounded-lg font-canaro-book hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubscribing ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 font-canaro-book">Follow us</h3>
              <div className="space-y-4">
                <div className="flex space-x-4 pt-4">
                  <a
                    href="https://www.facebook.com/goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <img src={FacebookIcon} className='w-[2rem]'/>
                  </a>
                  <a
                    href="https://www.instagram.com/goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <img src={InstagramIcon} className='w-[2rem]' />
                  </a>
                  <a
                    href="https://www.tiktok.com/@goldenpalmfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    aria-label="Follow us on TikTok"
                  >
                    <img src={TiktokIcon} className='w-[2rem]' />
                  </a>
                </div>
                <div className="mt-4">
                  <a href="mailto:hello@goldenpalmfoods.com" className="text-white hover:text-orange-300 transition-colors font-canaro-book">
                    hello@goldenpalmfoods.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white">
            <div className='font-canaro-book'>© 2026 GOLDEN PALM FOODS. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
