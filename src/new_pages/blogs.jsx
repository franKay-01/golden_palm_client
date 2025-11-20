import React, { useState, useEffect } from 'react';
import {  ChevronRight } from 'lucide-react';
import FacebookIcon from '../assets/icons/icons_facebook_yellow.png'
import InstagramIcon from '../assets/icons/icons_instagram_yellow.png'
import TiktokIcon from '../assets/icons/icons_tiktok_yellow.png'

import Header from '../components/header';
import YellowBrushImg from '../assets/images/brush_yellow.png'
import Asset3Img from "../assets/images/asset_3.png"
import BlogModal from '../components/blogModal';
import Asset6Img from '../assets/images/asset_6.png'
import FacebookLogo from '../assets/facebook_alt.png'
import InstagramLogo from '../assets/instagram_alt.png'
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import Footer from '../components/footer';
import ShareComponent from '../components/shareComponent';
import TiktokLogo from "../assets/images/tiktok.png"

export default function BlogPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllBlogs } = useFunctions();

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const { response_code, blogs, msg } = await getAllBlogs();

      if (response_code === '000') {
        setBlogs(blogs);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      ShowToast("error", msg || "Failed to load blogs");
    };

    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className='relative'>
        <img src={Asset3Img} className='hidden md:block absolute w-[8rem] h-[10rem] md:w-[12rem] md:h-[15rem] top-[-4rem] right-[4rem]' alt="Ebesse" />
      </div>
      <div className='flex flex-col items-center mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 justify-center px-4'>
        <h1 className="text-gp-light-green text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] font-caslon tracking-wide">Blogs</h1>
        <img src={YellowBrushImg} className='w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%]'/>
      </div>
     
      {isLoading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <Loader/>
        </div>
      ) : blogs.length === 0 ? (
        <div className='flex justify-center items-center min-h-[400px] px-4'>
          <div className="text-center">
            <h3 className="text-gp-light-green text-2xl sm:text-3xl md:text-[3rem] font-caslon mb-4">No Blogs Available</h3>
            <p className="text-gray-600 text-base sm:text-lg font-canaro-book">Check back soon for new stories and updates!</p>
          </div>
        </div>
      ) : (
        <div className="max-w-full mx-auto px-2 sm:px-4 relative overflow-hidden">
          {/* Blog section */}
          <section className="flex flex-row gap-4 sm:gap-8 md:gap-12 lg:gap-[6rem] mb-8 overflow-x-auto scrollbar-hide px-2 sm:px-4">
            {blogs.map((blog, index) => (
              <div key={blog.id || index} className="flex flex-col gap-3 sm:gap-4 bg-[#FBB041] rounded-xl sm:rounded-2xl lg:rounded-[2rem] p-4 sm:p-6 md:p-8 max-w-[85vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50rem] flex-shrink-0">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <img src={`https://api.goldenpalmfoods.com${blog.img_url}`} className='rounded-md w-full md:w-[12rem] lg:w-[20rem] h-[15rem] sm:h-[18rem] md:h-[12rem] lg:h-[20rem] object-cover' alt={blog.title} />
                  <div className="flex-1">
                    <h3 className="text-gp-light-green text-xl sm:text-2xl md:text-3xl lg:text-[3rem] leading-[1.1] sm:leading-[1] font-caslon mb-2 sm:mb-3">{blog.title}</h3>
                    <p className="text-white text-sm sm:text-base md:text-lg lg:text-[1rem] flex flex-wrap font-canaro-book leading-relaxed mb-3 sm:mb-4" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 10,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.content}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
                  <ShareComponent title="Share this blog" />
                  <button
                    onClick={() => openModal(blog)}
                    className="bg-black text-white px-6 sm:px-12 md:px-16 lg:px-20 py-3 sm:py-4 rounded text-base sm:text-lg md:text-xl font-canaro-book hover:bg-green-800 transition-colors"
                  >
                    READ MORE
                  </button>
                </div>
              </div>
            ))}

            {blogs.length > 0 && (
              <div className="max-w-[50rem] pointer-events-none animate-pulse relative">
                <div className="flex flex-col gap-4 bg-[#FBB041] rounded-[2rem] p-8 h-full opacity-30">
                  <div className="flex flex-row gap-6">
                    <div className="w-[20rem] h-[20rem] bg-white/30 rounded-md"></div>
                    <div className="flex-1">
                      <div className="h-12 bg-white/30 rounded mb-3"></div>
                      <div className="h-4 bg-white/30 rounded mb-2"></div>
                      <div className="h-4 bg-white/30 rounded mb-2"></div>
                      <div className="h-4 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* Arrow indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gp-light-green rounded-full p-3 animate-bounce">
                  <ChevronRight size={32} className="text-white" />
                </div>
              </div>
            )}
          </section>
        </div>
      )}
      <div className='hidden md:grid grid-cols-3 gap-4'>
        <img src={Asset6Img} className='w-full max-w-[12rem] h-auto max-h-[34rem]' alt="" />
        <div className='flex justify-center items-center'>
          <div className="text-center py-12">
            <h3 className="text-3xl md:text-4xl lg:text-[5rem] font-dry-brush leading-[1] text-gray-800">Mi Dounou</h3>
            <p className="text-gray-800 font-canaro-semibold text-base md:text-lg mb-2">"Let's Eat"</p>
            <div className="flex items-center justify-center space-x-4 pt-2">
              <a
                href="https://www.facebook.com/goldenpalmfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <img src={FacebookIcon} className='w-[3rem]'/>
              </a>
              <a
                href="https://www.instagram.com/goldenpalmfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <img src={InstagramIcon} className='w-[3rem]' />
              </a>
              <a
                href="https://www.tiktok.com/@goldenpalmfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-green-800 hover:bg-orange-100 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <img src={TiktokIcon} className='w-[3rem]' />
              </a>
            </div>
            <p className="text-gray-800 font-canaro-semibold mt-1 text-base md:text-lg lg:text-[1.5rem]">@Goldenpalmfoods</p>
          </div>
        </div>
        <div className='flex justify-center items-center'>
          <img src={Asset3Img} className='w-full max-w-[12rem] h-auto max-h-[12rem]' alt="" />
        </div>
      </div>
      <div className='md:hidden flex flex-col items-center py-8 px-4'>
        <div className="text-center mb-6">
          <h3 className="text-4xl sm:text-5xl font-dry-brush leading-[1] text-gray-800">Mi Dounou</h3>
          <p className="text-gray-800 font-canaro-semibold text-lg sm:text-xl mb-2">"Let's Eat"</p>
          <div className='flex flex-row gap-4 items-center justify-center'>
            <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
              <img src={FacebookLogo}/>
            </a>
            <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
              <img src={InstagramLogo}/>
            </a>
            <a href='/get-started' className="brown-button button-margin-left w-[2rem] md:w-auto md:h-auto bg-gp-yellow rounded-full p-[5px]">
              <img src={TiktokLogo} className="w-full h-full object-contain"/>
            </a>
          </div>
          <p className="text-gray-800 font-canaro-semibold mt-1 text-base">@Goldenpalmfoods</p>
        </div>
      </div>
      <BlogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        blog={selectedBlog}
      />

      <Footer/>
    </>
  );
};