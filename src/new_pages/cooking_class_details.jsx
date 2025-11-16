import React, { useState } from 'react';
import { Menu, Quote } from 'lucide-react';
import Logo from "../assets/logo.png"
import CookingImg from '../assets/cooking.png'
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Header from '../components/header';

export default function CookingClassDetailsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      
      {/* Main Content */}
      <Header />
      <div className="max-w-5xl mx-auto px-4 pb-12">
       
        {/* Our Story Section */}
        <section className="mb-8">
          <div className="">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    Golden Palm Foods began as more than a business, it started as a mission. Living in Canada for over 16 years, Carmen felt a deep longing for the authentic tastes of home, the rich flavors of West African cuisine that connected her to her heritage.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    Missing her son J.I, who was living away in Montreal where the African food scene was limited, Carmen decided to take action. She began importing and distributing premium African food products, ensuring that families like hers could enjoy the authentic flavors they craved, no matter where life took them. What started as a personal mission has grown into Golden Palm Foods - connecting the African diaspora to the flavors of home.
                  </p>
                  <button className="float-right bg-green-700 text-white px-8 py-3 rounded text-sm font-semibold hover:bg-green-800 transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Orange Section - Quality Promise */}
        <section className="mb-8">
          <div className="bg-orange-400 rounded-lg p-8">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <h3 className="text-white text-lg font-bold mb-3">BRINGING YOU CLOSER TO HOME</h3>
                <p className="text-white text-sm leading-relaxed mb-4">
                  Every ingredient, every tradition, every product is a journey, bridging the gap between your Canadian home and your African roots. Our carefully curated selection of authentic African food products ensures you never have to compromise on taste, quality, or tradition, bringing the warmth of home to your table, wherever you are.
                </p>
                <button className="bg-green-700 text-white px-8 py-3 rounded text-sm font-semibold hover:bg-green-800 transition-colors">
                  READ MORE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-8">
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-white text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-white text-sm leading-relaxed mb-4">
              At Golden Palm Foods, our mission is to provide fresh, African food solutions and the expertise to use it. Based in Ontario, Canada, we are committed to bridging the gap between the African diaspora and their culinary heritage by importing the authentic, high-quality African food products.
            </p>
            <p className="text-white text-sm leading-relaxed mb-6">
              We believe that food is more than sustenance—it's a connection to culture, family, and identity. Through our carefully selected products, we help families maintain their traditions and introduce others to the rich, diverse flavors of Africa. Whether you're recreating a childhood favorite or exploring new tastes, Golden Palm Foods is your trusted partner in this flavorful journey.
            </p>
            <button className="bg-green-700 text-white px-8 py-3 rounded text-sm font-semibold hover:bg-green-800 transition-colors">
              READ MORE
            </button>
          </div>
        </section>

        {/* Quote Section */}
        <section className="mb-8">
          <div className="text-center py-8">
            <div className="text-8xl text-[#445717] mb-4">"</div>
            <blockquote className="text-[#445717] text-xl font-medium mb-4 max-w-2xl mx-auto">
              We want you to experience the real, unrefined taste of Africa
            </blockquote>
            <cite className="text-orange-300 text-lg italic">~Carmen</cite>
          </div>
        </section>

        {/* From Our Kitchen Section */}
        <section className="mb-8">
          <div className="bg-orange-400 rounded-lg p-8">
            <h3 className="text-white text-xl font-bold mb-4">From Our Kitchen to Yours, Flavorful Journey Together</h3>
            <p className="text-white text-sm leading-relaxed">
              Golden Palm Foods was born from Carmen's desire to bridge the gap between her Canadian home and her West African roots. What began as a personal quest to bring authentic flavors to her family has evolved into a mission to serve the entire African diaspora across Canada. Today, we're proud to offer premium African food products that maintain the authentic taste and quality that connects us all to home, no matter how far we've traveled. From our kitchen to yours, let's embark on this flavorful journey together.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-[#445717] text-4xl font-bold mb-2">Team</h2>
            <div className="w-20 h-1 bg-orange-400 mx-auto"></div>
          </div>

          {/* Carmen Artukosie */}
          <div className="mb-12">
            <div className="bg-orange-400 rounded-lg p-1 mb-6 max-w-md mx-auto">
              <div className="bg-orange-500 rounded p-6 h-64 flex items-center justify-center">
                <span className="text-white text-sm">Carmen's Photo</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-green-800 text-2xl font-bold mb-4">Carmen Artukosie</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Born in Lagos, Nigeria, Carmen moved to the US at the age of 16. Over two decades, she founded a fish and manufacturing supply business and had a son. In 2006, she relocated to Canada to pursue a better life for her family.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Carmen discovered the challenges faced by the African diaspora in accessing authentic African food products. She now lives comfortably outside Toronto city. Her son remains in Montreal, having persevered through years of missing authentic African flavors. Today, Carmen specializes in sourcing and distributing genuine African food products, helping others stay connected to their heritage through food.
              </p>
            </div>
          </div>

          {/* Arlette Gomez-Kyeonton */}
          <div className="mb-12">
            <div className="bg-orange-400 rounded-lg p-1 mb-6 max-w-md mx-auto">
              <div className="bg-orange-500 rounded p-6 h-64 flex items-center justify-center">
                <span className="text-white text-sm">Arlette's Photo</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 ">
              <h3 className="text-green-800 text-2xl font-bold mb-4">Arlette Gomez-Kyeonton</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Born and raised in Accra, Ghana, Arlette brings a wealth of knowledge and expertise. Having lived in four different countries, she deeply understands the importance of maintaining cultural connections through authentic cuisine.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Arlette provides international logistics support and brings her knowledge of West African food culture. She ensures our products meet the highest quality standards and maintains strong relationships with our suppliers across West Africa, helping Golden Palm Foods stay true to its roots.
              </p>
            </div>
          </div>
        </section>
       
      </div>
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Navigation */}
            <div className="space-y-6">
              <nav className="space-y-4">
                <a href="#" className="block text-lg font-medium hover:text-orange-300 transition-colors border-b border-green-700 pb-2">
                  FAQ
                </a>
                <a href="#" className="block text-lg font-medium hover:text-orange-300 transition-colors border-b border-green-700 pb-2">
                  Contact
                </a>
                <a href="#" className="block text-lg font-medium hover:text-orange-300 transition-colors border-b border-green-700 pb-2">
                  Wholesale
                </a>
                <a href="#" className="block text-lg font-medium hover:text-orange-300 transition-colors border-b border-green-700 pb-2">
                  Terms & conditions
                </a>
                <a href="#" className="block text-lg font-medium hover:text-orange-300 transition-colors">
                  Privacy Policy
                </a>
              </nav>
            </div>

            {/* Center Logo */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                {/* Palm leaf icon */}
                <img src={Logo}/>
              </div>
              <div className="text-2xl font-bold tracking-wide">
                <div>GOLDEN PALM</div>
                <div className="text-xl mt-1">FOODS</div>
              </div>
            </div>

            {/* Right Email Signup */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">Email us</h3>
                <p className="text-green-200 mb-6">
                  Sign up to get new Golden Palm recipes, deals, news and more
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your E-mail"
                    className="w-full bg-transparent border-b-2 border-green-600 pb-2 text-white placeholder-green-300 focus:border-orange-400 focus:outline-none transition-colors"
                  />
                  <div className="flex space-x-4 pt-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-green-700">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-green-300">
              <div>© 2025 GOLDEN PALM FOODS. All rights reserved.</div>
              <div className="mt-4 md:mt-0">
                No longer want to receive these emails? You can{' '}
                <a href="#" className="text-orange-400 hover:text-orange-300 underline">
                  unsubscribe here
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};