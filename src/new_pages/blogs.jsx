import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import FacebookIcon from '../assets/icons/icons_facebook_yellow.webp'
import InstagramIcon from '../assets/icons/icons_instagram_yellow.webp'
import TiktokIcon from '../assets/icons/icons_tiktok_yellow.webp'

import Header from '../components/header';
import YellowBrushImg from '../assets/images/brush_yellow.webp'
import Asset3Img from "../assets/images/asset_3.webp"
import BlogModal from '../components/blogModal';
import Asset6Img from '../assets/images/asset_6.webp'
import FacebookLogo from '../assets/facebook_alt.webp'
import InstagramLogo from '../assets/instagram_alt.webp'
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import Footer from '../components/footer';
import Seo from '../components/seo';
import ShareComponent from '../components/shareComponent';
import { toPlainText } from '../utils/sanitize';
import TiktokLogo from "../assets/images/tiktok.webp"

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
      <Seo
        title="Blog — West African Recipes, Ingredients & Stories"
        description="West African recipes, ingredient guides, and stories from Golden Palm Foods — how to cook Bambara beans, use red palm oil, and explore Togolese food and traditional West African cooking."
        path="/blogs"
      />
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className='relative overflow-x-clip md:overflow-x-visible'>
        <img src={Asset3Img} className='block absolute w-[5rem] h-auto md:w-[12rem] md:h-[15rem] top-1 right-1 md:top-[-4rem] md:right-[4rem] opacity-60 md:opacity-100 pointer-events-none' alt="Ebesse" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          {/* Blog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog, index) => {
              const publishedAt = blog.createdAt || blog.created_at || blog.date;
              const formattedDate = publishedAt
                ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null;

              return (
                <article
                  key={blog.id || index}
                  onClick={() => openModal(blog)}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-shadow duration-300 cursor-pointer"
                >
                  {/* Featured image */}
                  <div className="relative w-full h-52 sm:h-56 overflow-hidden">
                    <img
                      src={`https://api.goldenpalmfoods.com${blog.img_url}`}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    {formattedDate && (
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-canaro-book mb-2">
                        {formattedDate}
                      </p>
                    )}
                    <h3 className="text-gp-light-green text-xl sm:text-2xl font-caslon leading-tight mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-canaro-book leading-relaxed mb-5 line-clamp-3">
                      {toPlainText(blog.content)}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1.5 text-gp-light-green font-canaro-semibold text-sm sm:text-base group-hover:gap-2.5 transition-all">
                        Read more
                        <ArrowRight size={18} />
                      </span>
                      <span onClick={(e) => e.stopPropagation()}>
                        <ShareComponent
                          title="Share this blog"
                          buttonClassName="text-gray-400 hover:text-gp-light-green transition-colors text-sm font-canaro-book underline"
                        >
                          Share
                        </ShareComponent>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
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