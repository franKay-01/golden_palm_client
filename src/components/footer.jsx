import React from 'react';
import { Facebook, Instagram, Tiktok } from 'lucide-react';
import LogoAlt from "../assets/images/logo.png";
import TiktokImg from "../assets/images/tiktok_alt.png"
import FacebookIcon from '../assets/icons/icons_facebook_white.png'
import InstagramIcon from '../assets/icons/icons_instagram_white.png'
import TiktokIcon from '../assets/icons/icons_tiktok_white.png'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gp-light-green to-gp-light-green text-white px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Navigation */}
          <div className="space-y-6">
            <nav className="space-y-4">
              <a href="/faqs" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                FAQ
              </a>
              <a href="/reviews" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                Testimonials
              </a>
              <a href="/wholesale" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                Wholesale
              </a>
              <a href="/terms-of-service" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors border-b border-white pb-2">
                Terms & conditions
              </a>
              <a href="/privacy" className="block text-lg font-canaro-book hover:text-orange-300 transition-colors">
                Privacy Policy
              </a>
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
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white">
            <div className='font-canaro-book'>© 2025 GOLDEN PALM FOODS. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
