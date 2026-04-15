import React from 'react';
import { X } from 'lucide-react';
import BrushWhite from '../assets/images/brush_white.png';
import Asset3Img from '../assets/images/asset_3.png'
import Asset6Img from '../assets/images/asset_6_alt.png'
import FacebookLogo from '../assets/facebook.png'
import InstagramLogo from '../assets/instagram.png'

export default function BlogModal({ isOpen, onClose, blog }) {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative rounded-[2rem] shadow-xl max-w-4xl overflow-y-auto w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: '#FBB041' }}>
        {/* Header */}
        <div className="relative flex flex-col px-4 md:px-6 py-4">
          <img src={Asset3Img} className='hidden md:block absolute w-[10rem] h-[10rem] right-[3rem]' alt="" />
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-[2rem] font-caslon text-gp-light-green pr-8 md:pr-0">{blog.title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gp-light-green transition-colors flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>
          <img src={BrushWhite} alt="" className="mt-2 w-full md:w-[80%]" />
        </div>

        {/* Content */}
        <div className="relative py-6 flex-1">
          <div className="space-y-4 px-4 md:px-6">
            {/* Blog Content */}
            <div className="text-white text-base md:text-[1.1rem] font-canaro-light leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>

            {/* Image at the end */}
            <img src={BrushWhite} alt="" className="mt-2 w-full md:w-[80%]" />

            {blog.img_url && (
              <div className="mt-6 mb-12 md:mb-20">
                <img
                  src={`https://api.goldenpalmfoods.com${blog.img_url}`}
                  alt={blog.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0'>
            <img src={Asset6Img} className='hidden md:block w-[12rem] h-[34rem]' alt="" />
            <div className='flex justify-center items-center'>
              <div className="text-center py-8 md:py-12">
                <h3 className="text-2xl md:text-[3rem] font-dry-brush leading-[1] text-gray-800">Mi Dounou</h3>
                <p className="text-gray-800 font-canaro-semibold text-base md:text-lg mb-2">"Let's Eat"</p>
                <div className='flex flex-row gap-4 items-center justify-center'>
                  <a href='/get-started' className="brown-button button-margin-left w-10 h-10 md:w-auto md:h-auto">
                    <img src={FacebookLogo} className="w-full h-full object-contain"/>
                  </a>
                  <a href='/get-started' className="brown-button button-margin-left w-10 h-10 md:w-auto md:h-auto">
                    <img src={InstagramLogo} className="w-full h-full object-contain"/>
                  </a>
                </div>
                <p className="text-gray-800 font-canaro-semibold text-sm md:text-base mt-1">@Goldenpalmfoods</p>
              </div>
            </div>
            <div className='hidden md:flex justify-center items-center'>
              <img src={Asset3Img} className='w-[12rem] h-[12rem]' alt="" />
            </div>
          </div>
        </div>

        {/* Fixed Bottom Image */}
       
      </div>
    </div>
  );
}
