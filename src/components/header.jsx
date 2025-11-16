import React, { useState, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from "../assets/images/logo_alt.png";
import { CartContext } from '../context/cartContext';
import CartModal from './cartModal';
import BasketImg from '../assets/images/basket.png'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { getCartItemCount } = useContext(CartContext);

  const mobileOnlyItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/our-story' },
    { name: 'Shop', path: '/bundle' },
    { name: 'Bundles', path: '/bundles?bt=all' },
  ];

  const menuItems = [
    { name: 'Recipes', path: '/recipes' },
    { name: 'Terms & conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <div className="bg-gradient-to-b from-[#445717] to-[#445717]">
        {/* Header */}
        <header className="p-4">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="hidden lg:flex space-x-4 lg:space-x-8 text-white text-sm font-medium">
            <a href="/" className="hover:text-orange-300 transition-colors">Home</a>
            <a href="/our-story" className="hover:text-orange-300 transition-colors">About us</a>
            <a href="/bundle" className="hover:text-orange-300 transition-colors">Shop</a>
            <a href="/recipes" className="hover:text-orange-300 transition-colors">Mama Carmen's Recipes</a>
          </div>

          {/* Cart Icon - Desktop */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setCartModalOpen(true)}
              className="relative text-white hover:text-orange-300 transition-colors"
            >
              <img src={BasketImg} className='w-[4rem] h-[4rem]'/>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 right-0 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
            
          </div>

          {/* Mobile menu button and cart */}
          <div className="lg:hidden flex items-center gap-4 ml-auto">
            <button
              onClick={() => setCartModalOpen(true)}
              className="relative text-white"
            >
              <img src={BasketImg} className='w-[3rem] h-[3rem]'/>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-green-600 rounded transition-colors"
            >
              <div className="">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30 flex items-center justify-center">
                  <div className="space-y-1.5">
                    <div className="w-8 h-0.5 bg-white rounded"></div>
                    <div className="w-8 h-0.5 bg-white rounded"></div>
                    <div className="w-8 h-0.5 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          // <div className="lg:hidden bg-green-800 mt-4 rounded-lg p-4">
          //   <div className="flex flex-col space-y-3 text-white text-sm font-medium">
          //     <a href="/" className="hover:text-orange-300 transition-colors py-2">Home</a>
          //     <a href="/about" className="hover:text-orange-300 transition-colors py-2">About us</a>
          //     <a href="/shop" className="hover:text-orange-300 transition-colors py-2">Shop</a>
          //     <a href="/recipes" className="hover:text-orange-300 transition-colors py-2">Mama Carmen's Recipes</a>
          //   </div>
          // </div>
          <div
          className={`fixed py-8 pt-[7rem] top-0 right-0 h-fit w-80 bg-gp-light-green shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            borderTopLeftRadius: '2rem',
            borderBottomLeftRadius: '2rem',
          }}
            >
              {/* Menu Icon in rounded square */}
              <div onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30 flex items-center justify-center">
                  <div className="space-y-1.5">
                    <div className="w-8 h-0.5 bg-white rounded"></div>
                    <div className="w-8 h-0.5 bg-white rounded"></div>
                    <div className="w-8 h-0.5 bg-white rounded"></div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Menu Items */}
              <nav className="flex flex-col justify-center h-full px-8 space-y-1">
                {/* Mobile-only items - shown on mobile */}
                <div className="lg:hidden">
                  {mobileOnlyItems.map((item, index) => (
                    <div key={index} className="relative">
                      <a
                        href={item.path}
                        className="block text-white text-right py-4 text-xl font-medium hover:text-amber-300 transition-colors relative"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = item.path;
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.name}
                      </a>
                      {/* Underline */}
                      <div className="absolute bottom-2 right-0 w-16 h-0.5 bg-amber-400/60"></div>
                    </div>
                  ))}
                </div>

                {/* All menu items */}
                {menuItems.map((item, index) => (
                  <div key={index} className="relative">
                    <a
                      href={item.path}
                      className="block text-white text-right py-4 text-xl font-medium hover:text-amber-300 transition-colors relative"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = item.path;
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </a>
                    {/* Underline */}
                    <div className="absolute bottom-2 right-0 w-16 h-0.5 bg-amber-400/60"></div>
                  </div>
                ))}
              </nav>
            </div>
        )}

        {/* Logo */}
        <div className="text-center py-2 md:py-2">
          <div className="flex items-center justify-center space-x-2 md:space-x-3">
            <a href="/">
              <img src={Logo} className='w-[25rem] h-[4rem]' alt="Golden Palm Foods" />
            </a>
          </div>
        </div>
        </header>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={cartModalOpen} onClose={() => setCartModalOpen(false)} />
    </>
  );
}
