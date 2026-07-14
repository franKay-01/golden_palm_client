import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import YellowBrushImg from '../assets/images/brush_yellow.png'
import Asset15 from '../assets/images/asset_15.webp'
import Asset17 from '../assets/images/asset_17.png'
import Asset12 from '../assets/images/asset_12.png'
import Asset11 from '../assets/images/asset_11.png'

export default function WholesalePolicyPage() {
  return (
    <>
      <Header />
      
      <div className="relative max-w-7xl mx-auto px-4 pb-12 overflow-x-clip md:overflow-x-visible">
        <div className="block absolute top-2 -left-3 md:top-[8rem] md:-left-[12rem] transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset15} alt="" className='w-[5rem] h-auto md:w-[15rem] md:h-[14rem]'/>
        </div>
        <div className="block absolute top-[22rem] -left-2 md:top-[40rem] md:-left-20 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset12} alt="" className='w-[3.5rem] h-auto md:w-[7rem] md:h-[10rem]'/>
        </div>
        <div className="block absolute top-2 -right-3 md:top-[-8rem] md:right-12 transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset17} alt="" className='w-[5rem] h-auto md:w-[12rem] md:h-[15rem]'/>
        </div>
        <div className="block absolute top-[14rem] -right-2 md:top-[40rem] md:-right-[2rem] transform rotate-12 opacity-60 md:opacity-100 pointer-events-none">
          <img src={Asset11} alt="" className='w-[3rem] h-auto md:w-[5rem] md:h-[5rem]'/>
        </div>
       
        <div className='flex flex-col items-center justify-center mb-8 md:mb-12 mt-12'>
          <h3 className="text-3xl md:text-5xl lg:text-8xl font-caslon text-gp-light-green">Wholesale</h3>
          <img src={YellowBrushImg} alt="Yellow Brush" />
        </div>
        
        <div className="mx-auto px-4">
          <div className="bg-gp-yellow rounded-2xl overflow-hidden shadow-md p-8 flex flex-col gap-4">
            <div className='flex flex-col gap-1'>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Bring bold, authentic West African staples to your shelves. We work directly with farmers, food producers, and market women in Togo (and across West Africa), then bottle and pack in Phoenix, AZ for consistent quality, freshness, and reliable supply.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>What we offer</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               <span className='font-canaro-semibold'># Ebesse Chili Paste </span>– coming soon to wholesale (mild, medium, hot). Email hello@goldenpalmfoods.com to be notified when wholesale orders open.
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               <span className='font-canaro-semibold'># All-Purpose Spice Mix </span>– clean-label, aromatic blend
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               <span className='font-canaro-semibold'># Bambara beans </span>– nutrient-rich African superfood
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               <span className='font-canaro-semibold'># Unrefined oils </span>– red palm, peanut, and coconut
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Why stock Golden Palm Foods</p>
              
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Distinct, high-quality SKUs that introduce underrepresented flavors
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Traceable sourcing with clear stories your team can share
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Shelf-ready packaging and simple merchandising support
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Low minimums, flexible ordering, dependable lead times
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Logistics</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Bottled and fulfilled from Phoenix, AZ
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Samples, sell sheets, and merchandising assets available on request
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Ready to order?</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Email <a href='mailto:hello@goldenpalmfoods.com'>hello@goldenpalmfoods.com</a> and we’ll send our current wholesale order sheet.
              </h1>
            </div>

          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
};