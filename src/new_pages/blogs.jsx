import React, { useState, useEffect } from 'react';
import { Menu, Quote, ChevronRight } from 'lucide-react';
import Logo from "../assets/logo.png"
import CookingImg from '../assets/cooking.png'
import { Facebook, Instagram, Twitter } from 'lucide-react';
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

export default function BlogPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <img src={Asset3Img} className='absolute w-[12rem] h-[15rem] top-[-4rem] right-[4rem]' alt="Ebesse" />
      </div>
      <div className='flex flex-col items-center mt-12 mb-12 justify-center'>
        <h1 className="text-gp-light-green text-[5rem] font-caslon tracking-wide">Blogs</h1>
        <img src={YellowBrushImg} className='w-[50%]'/>
      </div>
     
      {isLoading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <Loader/>
        </div>
      ) : blogs.length === 0 ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className="text-center">
            <h3 className="text-gp-light-green text-[3rem] font-caslon mb-4">No Blogs Available</h3>
            <p className="text-gray-600 text-lg font-canaro-book">Check back soon for new stories and updates!</p>
          </div>
        </div>
      ) : (
        <div className="max-w-full mx-auto px-4 relative overflow-hidden">
          {/* Blog section */}
          <section className="flex flex-row gap-[6rem] mb-8 overflow-x-auto scrollbar-hide px-4">
            {blogs.map((blog, index) => (
              <div key={blog.id || index} className="flex flex-col gap-4 bg-[#FBB041] rounded-[2rem] p-8 max-w-[50rem] flex-shrink-0">
                <div className="flex flex-row gap-6">
                  <img src={`http://localhost:5001${blog.img_url}`} className='rounded-md w-[20rem] h-[20rem] object-cover' alt={blog.title} />
                  <div className="flex-1">
                    <h3 className="text-gp-light-green text-[3rem] leading-[1] font-caslon mb-3">{blog.title}</h3>
                    <p className="text-white text-[1rem] flex flex-wrap font-canaro-book leading-relaxed mb-4" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 10,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.content}
                    </p>
                  </div>
                </div>
                <div className='flex flex-row justify-between'>
                  <ShareComponent title="Share this blog" />
                  <button
                    onClick={() => openModal(blog)}
                    className="bg-black text-white px-20 py-4 rounded text-xl font-canaro-book hover:bg-green-800 transition-colors"
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
      <div className='grid grid-cols-3'>
        <img src={Asset6Img} className='w-[12rem] h-[34rem]' alt="" />
        <div className='flex justify-center items-center'>
          <div className="text-center py-12">
            <h3 className="text-[5rem] font-dry-brush leading-[1] text-gray-800">Mi Dounou</h3>
            <p className="text-gray-800 font-canaro-semibold text-[2rem] mb-2">"Let's Eat"</p>
            <div className='flex flex-row gap-4 items-center justify-center'>
              <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
                <img src={FacebookLogo}/>
              </a>
              <a href='/get-started' className="brown-button button-margin-left w-[2rem]">
                <img src={InstagramLogo}/>
              </a>
            </div>
            <p className="text-gray-800 font-canaro-semibold mt-1 text-[1.5rem]">@Goldenpalmfoods</p>
          </div>
        </div>
        <div className='flex justify-center items-center'>
          <img src={Asset3Img} className='w-[12rem] h-[12rem]' alt="" />
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