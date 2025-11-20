import React, { useState } from 'react';
import { Menu, Quote } from 'lucide-react';
import LogoAlt from "../assets/images/logo.png"
import { Facebook, Instagram, Tiktok } from 'lucide-react';
import Asset16 from "../assets/images/asset_16.png"
import Asset10 from "../assets/images/asset_10.png"
import Asset17 from "../assets/images/asset_17.png"
import Asset9 from "../assets/images/asset_9.png"
import Asset6 from "../assets/images/asset_6.png"
import BrushGreen from "../assets/images/brush_green.png"
import BrushWhite from "../assets/images/brush_white.png"
import BrushYellow from "../assets/images/brush_yellow.png"
import Header from '../components/header';
import AboutModal from '../components/aboutModal';
import MamaImg from '../assets/images/mama.jpeg'
import CarmenImg from '../assets/images/carmen.jpeg'
import TogImg from "../assets/images/together.jpeg"
import Footer from '../components/footer';

export default function AboutUsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState(null);

  const openModal = (section) => {
    setModalSection(section);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-green-700 to-green-800">
        {/* Header */}
        <Header />
      </div>
      <div className="bg-gradient-to-b from-[#445717] to-[#445717] flex items-center justify-center p-4">
        <h1 className='font-caslon text-white text-3xl md:text-5xl lg:text-[60px]'>Our Story</h1>
      </div>
      {/* Main Content */}
      <section className="relative h-96 md:h-[950px] overflow-hidden mx-4 md:mx-8 rounded-b-[4rem]">
        {/* Background Image Simulation */}

        <div className="absolute inset-0 opacity-100">
          <div
            className="w-full h-full bg-gradient-to-r from-amber-800 via-transparent to-amber-800"
            style={{
              backgroundImage: `url(${TogImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-60" /> */}
        </div>
      </section>
      <div className="relative max-w-7xl mx-auto px-4 pb-12 z-10 flex flex-col">
        {/* Our Story Section */}
        <section className="mb-8">
          <div className="">
            <div className="pt-2">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed font-canaro-light mb-4 text-[14px] md:text-[20px] lg:text-[30px] leading-relaxed mt-4">
                  Golden Palm Foods began as a solution to a problem faced by many West African families living in the U.S.—the struggle to find authentic ingredients that carried the tastes of home. Moving to the U.S. at a young age, a mother and her daughter  found it hard to access the foods that connected them to their heritage. The spices, oils, and flavors that once brought comfort and a sense of belonging were nearly impossible to find in local stores.
                  </p>
                  <button onClick={() => openModal('story')} className="float-right bg-gp-bright-green font-canaro-semibold text-white px-6 md:px-12 py-4 md:py-6 rounded text-sm md:text-[14px] lg:text-[20px] font-semibold hover:bg-green-800 transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center space-x-4 md:space-x-8 mt-2 md:mt-4 z-10">
          <img src={Asset16} className="w-full max-w-5xl px-4"/>
        </div>
        {/* Orange Section - Quality Promise */}
        <section className="mb-4 md:mb-[1rem] mt-12 md:mt-20">
          <div className="bg-gp-yellow relative rounded-2xl p-6 md:p-8">
            <img src={Asset10} className='hidden md:block absolute top-[-4rem] right-8 w-[10rem] h-[8rem]'/>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <h3 className="text-white text-2xl md:text-[2.5rem] lg:text-[3.5rem] font-caslon">Why Choose Us:</h3>
                <img src={BrushGreen} alt="" className='mb-6 md:mb-8 w-[full] md:w-[70%]' />
                <p className="text-gp-black text-base md:text-[14px] lg:text-[25px] font-canaro-light leading-relaxed mb-4">
                  <span className='!font-canaro-semibold'>Honest Ingredients: </span>We believe in keeping things simple—pure, natural, and full of flavor, just like food should be. Our ingredients are not only wholesome but also sourced sustainably, supporting farmers, market women, and the environment with every bite.
                </p>

                <div className='flex items-center justify-center'>
                <div className='flex flex-col md:flex-row w-full md:w-[30rem] items-center justify-between gap-4 md:gap-0'>
                  <img src={Asset9} alt="" className='w-32 md:w-[12rem] h-16 md:h-[6rem]'/>
                  <button onClick={() => openModal('why')} className="bg-gp-bright-green text-white px-8 md:px-12 py-4 md:py-6 rounded text-sm md:text-[14px] lg:text-[20px]font-canaro-book hover:bg-green-800 transition-colors w-full md:w-auto">
                    READ MORE
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-4 md:mb-[1rem] mt-12 md:mt-20">
          <div className="bg-gray-900 rounded-lg p-6 md:p-8">
            <h2 className="text-white text-2xl md:text-[2.5rem] lg:text-[3.5rem] font-caslon">Our Mission</h2>
            <img src={BrushGreen} alt="" className='mb-6 md:mb-8 w-full md:w-[70%]' />

            <p className="text-white text-base md:text-[14px] lg:text-[25px] font-canaro-light leading-relaxed mb-4">
            At Golden Palm Foods, our mission is to make West African food accessible and represented in U.S. grocery stores. We are passionate about sharing authentic flavors, working directly with smallholder farmers and market women in West Africa who help bring our products to life. By supporting these farmers and communities, we not only deliver quality ingredients to your kitchen but also help create market access and economic opportunities back home.
            </p>
            <div className='flex justify-center'>
            <button onClick={() => openModal('mission')} className="bg-gp-bright-green text-white px-8 md:px-12 py-4 md:py-6 rounded text-sm font-canaro-book hover:bg-green-800 transition-colors w-full md:w-auto">
              READ MORE
            </button>
            </div>

          </div>
        </section>

        <section className="mb-12 md:mb-[4rem] mt-12 md:mt-20">
          <div className="bg-gp-yellow relative rounded-2xl p-6 md:p-8">
            <img src={Asset10} className='hidden md:block absolute top-[-4rem] right-8 w-[10rem] h-[8rem]'/>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <h3 className="text-white text-2xl md:text-[2.5rem] lg:text-[3.5rem] font-caslon">Our Vision</h3>
                <img src={BrushGreen} alt="" className='mb-6 md:mb-8 w-full md:w-[70%]' />
                <p className="text-gp-black text-base md:text-[20px] lg:text-[25px] font-canaro-light leading-relaxed mb-4">
                Golden Palm Foods envisions a future where West African flavors are a celebrated staple in kitchens everywhere. Rooted in tradition and crafted with authenticity, our products offer a taste of home for some, a bridge to heritage for others, and a delicious invitation for anyone eager to explore bold, global flavors. We believe great food connects people, and West Africa has a story worth sharing.
                </p>

                <div className='flex items-center justify-center'>
                <div className='flex flex-col md:flex-row w-full md:w-[30rem] items-center justify-between gap-4 md:gap-0'>
                  <img src={Asset9} alt="" className='w-32 md:w-[12rem] h-16 md:h-[6rem]'/>
                  <button onClick={() => openModal('vision')} className="bg-gp-bright-green text-white px-8 md:px-12 py-4 md:py-6 rounded text-sm font-canaro-book hover:bg-green-800 transition-colors w-full md:w-auto">
                    READ MORE
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="mb-12 md:mb-20">
          <div className="text-center py-8 px-4">
            <div className="flex justify-center item-center text-[#445717] mb-4">
              <Quote height={50} size={60} className="md:h-20 md:w-24" fill='currentColor' strokeWidth={0.5}/>
            </div>
            <blockquote className="text-[#445717] text-[2.5rem] md:text-[3rem] lg:text-[6rem] leading-tight md:leading-none font-caslon max-w-6xl mx-auto">
              We want you to experience the real, unrefined taste of Africa
            </blockquote>
            <div className='mr-4 md:mr-[8rem]'>
              <cite className="text-gp-dark-green float-right font-dry-brush text-[2rem] md:text-[5rem] italic">~Carmen</cite>
            </div>

          </div>
        </section>

        {/* From Our Kitchen Section */}
        <section className="mb-2 md:mb-8 mt-2 md:mt-8">
          <div className="bg-gp-yellow rounded-lg p-6 md:p-8">
            <h3 className="text-gp-light-green text-[1.5rem] md:text-[2.5rem] lg:text-[3.5rem] leading-[1] font-caslon">From Our Kitchen to Yours:</h3>
            <h3 className="text-gp-light-green text-[1.5rem] md:text-[2.5rem] lg:text-[3.5rem] leading-[1] font-caslon">Flavorful Journey Together</h3>
            <img src={BrushWhite} alt="" className='mb-6 md:mb-8 w-full md:w-[70%]' />
            <p className="text-gp-light-green text-base md:text-[20px] lg:text-[25px] font-canaro-light leading-relaxed">
            At Golden Palm Foods, we're more than just a food company. We're a family, sharing our heritage and inviting you to be part of our journey. When you buy from us, you're not just getting a product—you're joining a story that started in a small kitchen and is now reaching tables across the nation, with a vision to share these flavors even further in the future. We hope you'll join us, not just for the taste, but for the connection.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <div className="text-center mb-2 md:mb-12 mt-8 md:mt-24 flex flex-col items-center justify-center relative">
            <h2 className="text-[#445717] text-[3rem] md:text-4xl lg:text-[7rem] font-caslon">Team</h2>
            <img src={BrushYellow} alt="" className='mb-2 md:mb-8 w-full md:w-[50%] mt-0 md:mt-4' />
            <div className="hidden md:block absolute top-0 right-[16rem] rotate-12">
              <img src={Asset17} alt="" className='w-[4rem] h-[5rem]'/>
            </div>
          </div>

          {/* Carmen Attikossie */}
          <div className="mb-12">
            <div className="rounded-lg p-1">
              <img src={CarmenImg} alt="Carmen's Image" className='rounded-[3rem] w-full'/>
            </div>
            <div className="rounded-lg p-2 md:p-4 mt-4">
              <h3 className="text-gp-dark-green text-2xl md:text-[2rem] lg:text-[4rem] font-caslon ">Carmen Attikossie</h3>
              <img src={BrushGreen} alt="" className='mb-6 md:mb-8 w-full md:w-[70%]' />
              <p className="text-gp-black text-base md:text-[20px] lg:text-[28px] font-canaro-light leading-relaxed mb-4">
              Born in Lomé, Togo, Carmen moved to the U.S. at the age of seven and quickly noticed the lack of African cuisine in grocery stores, sparking her mission to make West African food more accessible and represented. As co-founder of Golden Palm Foods, she oversees daily operations, develops strategic partnerships, and sources ingredients directly from women traders and smallholder farmers in Togo. In her free time, Carmen enjoys traveling, spending time with family and friends, and connecting with the Togolese and African diaspora in the U.S. She is passionate about sharing the vibrant flavors of her heritage.
              </p>
            </div>
          </div>

          {/* Arlette Gomez-Kponton */}
          <div className="mb-4 md:mb-12">
            <div className="rounded-lg p-1">
              <img src={MamaImg} alt="Arlette's Image" className='rounded-[3rem] w-full'/>
            </div>
            <div className="rounded-lg p-2 md:p-4 mt-4">
              <h3 className="text-gp-dark-green text-2xl md:text-3xl lg:text-[4rem] font-caslon">Arlette Gomez-Kponton</h3>
              <img src={BrushYellow} alt="" className='mb-6 md:mb-8 w-full md:w-[70%]' />
              <p className="text-gp-black text-base md:text-[20px] lg:text-[28px] font-canaro-light leading-relaxed md:mb-4">
              Born in Lomé, Togo, Arlette moved to the U.S. over 20 years ago, bringing her rich culinary traditions with her. Despite challenges, she ensured her children stayed connected to Togolese culture through food. Now, as co-founder of Golden Palm Foods, she shares her passion for West African cuisine alongside her daughter, Carmen, sourcing ingredients from market women in Togo. In her free time, Arlette enjoys creating new recipes, bowling, traveling, and spending time with loved ones.
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className='relative hidden md:block'>
        <div className="absolute bottom-[-15rem] left-0 transform -translate-y-1/2 z-0">
          <img src={Asset6} alt="" className='w-[12rem] h-[34rem]'/>
        </div>
      </div>

      <AboutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        section={modalSection}
      />

      <Footer/>
    </>
  );
};