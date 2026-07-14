import React from 'react';
import { useNavigate } from 'react-router-dom';
import CookingImg from '../assets/images/bundle_p.webp'
import Footer from '../components/footer';
import Asset13 from '../assets/images/asset_13.png'
import Asset15 from '../assets/images/asset_15.webp'
import Asset17 from '../assets/images/asset_17.png'
import Asset2 from '../assets/images/asset_2.webp'
import Asset3 from '../assets/images/asset_3.webp'
import Asset11 from '../assets/images/asset_11.png'
import Asset8 from '../assets/images/asset_8_alt.webp'
import Asset6 from '../assets/images/asset_6.webp'
import Asset18 from '../assets/images/asset_18.png'
import Asset15Alt from '../assets/images/asset_15_alt.webp'
import Header from '../components/header';

export default function GoldenPalmBundlePage() {
  const navigate = useNavigate();

  return (
    <>
    <Header />
      {/* Hero Section */}
    <div className='relative'>
      <section className="relative h-96 md:h-[650px] overflow-hidden md:block mx-4 md:mx-8 mt-8 rounded-2xl">
        <div className="absolute inset-0 opacity-60">
          <div
            className="w-full h-full bg-gradient-to-r from-amber-800 via-transparent to-amber-800"
            style={{
              backgroundImage: `url(${CookingImg})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'bottom'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <div className="absolute inset-0 top-[-4rem] bg-black bg-opacity-40 flex flex-col gap-4 items-center justify-center">
          <img src={Asset13} alt="" className='w-[10rem] h-[8rem]' />
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-caslon mb-8 leading-tight">
              WEST AFRICAN<br />FLAVORS
            </h1>
          </div>
        </div>
      </section>

      <section className="relative py-6 md:py-16 overflow-x-clip md:overflow-x-visible">
        {/* Mobile-curated accent */}
        <div className="block absolute top-2 left-1 md:top-[-8rem] md:left-12 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset15} alt="" className='w-[5rem] h-auto md:w-[22rem] md:h-[24rem]'/>
        </div>
        <div className="block absolute top-[22rem] left-1 md:top-[40rem] md:left-20 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset3} alt="" className='w-[4.5rem] h-auto md:w-[20rem] md:h-[20rem]'/>
        </div>
        {/* Mobile-curated accent */}
        <div className="block absolute top-2 right-1 md:top-[-8rem] md:right-12 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset17} alt="" className='w-[5rem] h-auto md:w-[12rem] md:h-[15rem]'/>
        </div>
        {/* Mobile-curated accent */}
        <div className="block absolute top-[16rem] right-1 md:top-[20rem] md:right-12 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset2} alt="" className='w-[4rem] h-auto md:w-[10rem] md:h-[10rem]'/>
        </div>
        <div className="block absolute top-[30rem] right-1 md:top-[40rem] md:right-28 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset11} alt="" className='w-[4rem] h-auto md:w-[15rem] md:h-[15rem]'/>
        </div>
        <div className="block absolute top-[40rem] right-1 md:top-[65rem] md:right-0 transform opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset8} alt="" className='w-[4rem] h-auto md:w-[15rem] md:h-[25rem]'/>
        </div>
        <div className="block absolute top-[46rem] left-1 md:top-[68rem] md:left-12 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset18} alt="" className='w-[4rem] h-auto md:w-[12rem] md:h-[16rem]'/>
        </div>
        <div className="container flex flex-col gap-20 md:gap-32 mx-auto px-4 text-center justify-center items-center">
          <div className='flex flex-col text-center justify-center'>
            <h2 className="text-4xl md:text-6xl font-caslon text-gp-light-green mb-6 mt-8">Shop All</h2>
            <p className="text-gp-black font-canaro-book text-[20px] mb-8 max-w-3xl mx-auto">
              Explore our full collection of West African pantry staples, artisan oils, and curated bundles.
            </p>
            <div>
              <button onClick={() => navigate('/shop?tp=all')} className="bg-gp-light-green w-fit hover:bg-gp-dark-green text-[1.2rem] text-white px-12 py-5 rounded-md font-canaro-book transition-colors">
                SHOP GOLDEN
              </button>
            </div>
          
          </div>
          <div className='flex flex-col text-center justify-center'>
            <h2 className="text-4xl md:text-6xl font-caslon text-gp-light-green mb-6">Crafted Spices & Sauces</h2>
            <p className="text-gp-black font-canaro-book text-[20px] mb-8 max-w-3xl mx-auto">
              Bold, Small-batch blends rooted in tradition and flavor.
            </p>
            <div>
              <button onClick={() => navigate('/shop?tp=spices')} className="bg-gp-light-green w-fit hover:bg-gp-dark-green text-[1.2rem] text-white px-12 py-5 rounded-md font-canaro-book transition-colors">
                SHOP SPICES
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-caslon text-gp-light-green mb-6">Artisan Oils</h2>
            <p className="text-gp-black font-canaro-book text-[20px] mb-8 max-w-3xl mx-auto">
              Unrefined, naturally extracted oils from small-scale producers in Togo.
            </p>
            <button onClick={() => navigate('/shop?tp=oils')} className="bg-gp-light-green w-fit hover:bg-gp-dark-green text-[1.2rem] text-white px-12 py-5 rounded-md font-canaro-book transition-colors">
              SHOP OILS
            </button>
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-caslon text-gp-light-green mb-6">Heritage Staples</h2>
            <p className="text-gp-black font-canaro-book text-[20px] mb-8 max-w-3xl mx-auto">
            Nourishing essentials from West Africa's culinary heartland.
            </p>
            <button onClick={() => navigate('/shop?tp=staples')} className="bg-gp-light-green w-fit hover:bg-gp-dark-green text-[1.2rem] text-white px-12 py-5 rounded-md font-canaro-book transition-colors">
              SHOP STAPLES
            </button>
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-caslon text-gp-light-green mb-6">Curated Bundles</h2>
            <p className="text-gp-black font-canaro-book text-[20px] mb-8 max-w-3xl mx-auto">
              Save on curated bundles featuring all of our small-batch West African pantry staples.
            </p>
            <button onClick={() => navigate('/bundles?bt=all')} className="bg-gp-light-green w-fit hover:bg-gp-dark-green text-[1.2rem] text-white px-12 py-5 rounded-md font-canaro-book transition-colors">
              SHOP BUNDLES
            </button>
          </div>
        </div>
        <div className="block absolute bottom-0 left-0 md:bottom-[-15rem] transform -translate-y-1/2 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset6} alt="" className='w-[4.5rem] h-auto md:w-[12rem] md:h-[34rem]'/>
        </div>
        <div className="flex justify-end opacity-60 md:opacity-100">
          <img src={Asset15Alt} alt="" className='w-[8rem] h-auto md:w-[20rem] md:h-[24rem]'/>
        </div>
      </section>
    </div>

    <Footer/>
    </>
  );
};