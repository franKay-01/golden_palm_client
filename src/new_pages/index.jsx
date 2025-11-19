import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Facebook, Instagram, Tiktok } from 'lucide-react';
import CookingImg from '../assets/images/index_bg.jpg'
import CookingImgAlt from '../assets/images/bg2.jpg'
import BlogImg from '../assets/images/blog_car.jpg'
import TogetherImg from '../assets/images/together.jpeg'
import CookingClassImg from '../assets/images/cooking_cla.jpeg'
import Asset11 from "../assets/images/asset_11.png"
import Asset17 from "../assets/images/asset_17.png"
import Asset16 from "../assets/images/asset_16.png"
import Asset4 from "../assets/images/asset_4.png"
import BrushYellow from "../assets/images/brush_yellow.png"
import useFunctions from '../utils/functions';
import Header from '../components/header';
import BlogModal from '../components/blogModal';
import Footer from '../components/footer';
import GoldenPalmOilsImg from '../assets/images/golden_palm_bundle.jpg'

export default function GoldenPalmFoods() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { getAllBlogs } = useFunctions();

  const contentItems = [
    {
      bg: TogetherImg,
      title: 'Our Story',
      button: 'Read more',
      route: '/our-story',
      paragraph: 'Golden Palm Foods: Authentic West African pantry staples that bring heritage, bold flavor, and community to every table.'
    },
    {
      bg: CookingClassImg,
      title: 'Cooking Classes',
      button: 'Sign up',
      route: '/cooking-class',
      paragraph: 'Hands-on West African cooking classes in Arizona with Golden Palm Foods.'
    },
    {
      bg: CookingImgAlt,
      title: 'Recipes',
      button: 'Explore recipes',
      route: '/recipes',
      paragraph: 'Flavorful West African recipes, straight from our kitchen to yours.'
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getAllBlogs();
      if (response.response_code === '000') {
        setBlogs(response.blogs);
      }
    };

    fetchBlogs();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % contentItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + contentItems.length) % contentItems.length);
  };

  const nextBlogSlide = () => {
    setCurrentBlogSlide((prev) => (prev + 1) % blogs.length);
  };

  const prevBlogSlide = () => {
    setCurrentBlogSlide((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gp-light-green pb-12 header-radius">
       
        <Header />
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 mb-4 md:mb-12">
          <div className="p-0 md:p-8 relative overflow-hidden">
            <img src={CookingImg} className='rounded-[3rem] h-[30vh] md:h-[52vh] w-full object-cover' alt="" />
          </div>

          {/* Welcome text */}
          <div className="mt-4 mb-8 relative">
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl leading-tight font-caslon">
              Welcome to<br />
              Golden Palm Foods
            </h2>
            <p className="text-green-200 text-xs md:text-sm mb-4 font-canaro-light">
              Sharing the bold, honest flavors of West Africa from our family to yours.
            </p>
            
            {/* Floating product - hidden on mobile */}
            <div className="hidden md:block absolute -right-4 top-[5rem] z-10">
              <img src={Asset11} className='w-[15rem] h-[15rem]'/>
            </div>
            <div className="hidden md:block absolute md:right-0 lg:right-[-3rem] -top-[3rem] z-10">
              <img src={Asset17} className='w-[10rem] h-[10rem]'/>
            </div>
          </div>
        </div>
      </div>
     
      {/* Cooking Classes Section */}
      <div className="min-h-screen relative">
        {/* <div className="absolute inset-0 bg-[#fff7ec]/80" /> */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 ">
        
          <div className="relative">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-caslon text-gp-light-green mb-4">{contentItems[currentSlide].title}</h3>

            <button 
              onClick={prevSlide}
              className="absolute left-0 md:left-[-1rem] top-1/2 -translate-y-1/2 z-10 bg-orange-400 hover:bg-orange-500 rounded-full p-2 md:p-3 transition-colors"
            >
              <ChevronLeft className="text-white" size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 md:right-[-1rem] top-1/2 -translate-y-1/2 z-10 bg-orange-400 hover:bg-orange-500 rounded-full p-2 md:p-3 transition-colors"
            >
              <ChevronRight className="text-white" size={20} />
            </button>

            {/* Carousel */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {contentItems.map((item, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <div 
                        className="relative h-96 md:h-[700px] bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url('${item.bg}')`
                        }}
                      >
                        {/* <div className="absolute inset-0 bg-black bg-opacity-10"></div> */}
                        
                        <div className="relative z-10 h-full flex flex-col justify-end">
                          <div className="flex justify-end px-6 pb-6">
                            <button onClick={() => window.location.href = item.route} className="bg-[#445717] hover:bg-[#fcb040] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                              {item.button}
                            </button>
                          </div>
                          <div className="bg-[#b1b1b1] p-4 rounded-md">
                            <p className="leading-relaxed font-canaro-book text-sm text-black md:text-base lg:text-lg">
                              {item.paragraph}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center space-x-2 mb-4">
              {contentItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
          {/* Bottom products */}
            <div className="flex justify-center space-x-4 md:space-x-8 mt-8 md:mt-16 z-10">
              <img src={Asset16} className="w-full max-w-5xl px-4"/>
            </div>

            {/* Product Bundles Section */}
            <div className="py-2 md:py-20">
              <div className="max-w-7xl mx-auto px-4">
                <div onClick={() => window.location.href = '/shop-options'} className="mb-4 md:mb-4 cursor-pointer">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="order-2 lg:order-1">
                      <h3 className="text-3xl md:text-[2rem] lg:text-[5rem] w-full lg:w-[80%] font-caslon text-gp-light-green mb-4 leading-tight lg:leading-[5rem]">
                        Golden Palm Artisan Oils
                      </h3>
                      <p className="text-gray-600 font-canaro-book text-base md:text-lg lg:text-xl mb-6 w-full lg:w-[70%]">
                        Bold, Small-batch blends rooted in tradition and flavor.
                      </p>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center items-center">
                      <img src={GoldenPalmOilsImg} className='img-border w-full max-w-3xl' alt={'Golden Palm Artisan Oils'}/>
                    </div>
                  </div>
                </div>


                {/* Bottom product and More bundles button */}
                <div className="flex flex-col lg:flex-row items-center justify-between relative mt-8 lg:mt-0">
                  {/* Single product jar - hidden on mobile */}
                  <div className="hidden lg:block flex-shrink-0 absolute top-[-9rem]">
                    <img src={Asset4} className='w-[25rem] h-[25rem]'/>
                  </div>

                  {/* More bundles button */}
                  <div className="flex-grow flex justify-center lg:justify-end w-full lg:w-auto">
                    <button onClick={() => window.location.href = '/bundles?bt=all'} className="bg-[#445717] hover:bg-gp-dark-green text-white px-8 md:px-12 py-4 md:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce-subtle w-full lg:w-auto">
                      <h1 className='text-xl md:text-[25px] font-canaro-book'>Shop bundles</h1>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Section */}
            {/* <div className="bg-orange-50 min-h-screen"> */}
            <div className="max-w-7xl mx-auto px-4 py-2 md:py-16">
              <h3 className="text-3xl md:text-5xl lg:text-[5rem] font-caslon text-gp-light-green mb-2 mt-12">Blog</h3>
              <img src={BrushYellow} alt="" className='mb-8 md:mb-12 w-full md:w-[70%]' />
              {blogs.length > 0 ? (
                <div className="relative">
                  <button
                    onClick={prevBlogSlide}
                    className="absolute left-0 md:left-[-1rem] top-1/2 -translate-y-1/2 z-10 bg-orange-400 hover:bg-orange-500 rounded-full p-2 md:p-3 transition-colors"
                  >
                    <ChevronLeft className="text-white" size={20} />
                  </button>
                  <button
                    onClick={nextBlogSlide}
                    className="absolute right-0 md:right-[-1rem] top-1/2 -translate-y-1/2 z-10 bg-orange-400 hover:bg-orange-500 rounded-full p-2 md:p-3 transition-colors"
                  >
                    <ChevronRight className="text-white" size={20} />
                  </button>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentBlogSlide * 100}%)` }}
                    >
                      {blogs.map((blog, slideIndex) => (
                        <div key={blog.id || slideIndex} className="w-full flex-shrink-0 cursor-pointer" onClick={() => openModal(blog)}>
                          <div className="relative rounded-t-2xl overflow-hidden ">
                            <div
                              className="relative h-96 md:h-[500px] bg-cover bg-center"
                              style={{
                                backgroundImage: `url('https://api.goldenpalmfoods.com${blog.img_url}')`
                              }}
                            >
                              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                            </div>
                          </div>
                          <div className="bg-gp-yellow rounded-b-2xl p-4">
                            <h4 className="text-gp-light-green text-xl md:text-2xl font-caslon mb-2">
                              {blog.title}
                            </h4>
                            <p className="leading-relaxed font-canaro-book text-sm text-black md:text-base lg:text-lg line-clamp-3">
                              {blog.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2 mb-4">
                    {blogs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBlogSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          currentBlogSlide === index ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-canaro-book">No blogs available at the moment.</p>
                </div>
              )}

              <div className="flex mt-8 justify-center text-center md:text-right">
                <a href='/blogs' className="bg-[#b8673c] hover:bg-green-800 text-white px-6 md:px-20 py-2 md:py-3 rounded-lg transition-colors">
                  <h1 className='text-[20px] font-canaro-book'>Read more</h1>
                </a>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      <Footer />

      <BlogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        blog={selectedBlog}
      />
    </div>
  );
}