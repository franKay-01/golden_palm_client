import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, Calendar, DollarSign } from 'lucide-react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import CookingImg from '../assets/images/ck_class.jpeg'
import Logo from "../assets/logo.png"
import Header from '../components/header';
import Footer from '../components/footer';
import useFunctions from '../utils/functions';
import { useEffect } from 'react';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';

export default function CookingClassPage() {
  const [cookingClasses, setCookingClasses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSlides, setCurrentSlides] = useState({})

  const { getAllCookingClasses } = useFunctions()

  const getAllClasses = async () => {
    setIsLoading(true)

    const { response_code, classes} = await getAllCookingClasses()

    if (response_code === '000'){
      // Sort classes: upcoming first, then others
      const sortedClasses = classes.sort((a, b) => {
        if (a.is_upcoming && !b.is_upcoming) return -1;
        if (!a.is_upcoming && b.is_upcoming) return 1;
        return 0;
      });

      setCookingClasses(sortedClasses)

      // Initialize slide positions for each class
      const initialSlides = {};
      sortedClasses.forEach(cls => {
        initialSlides[cls.class_id] = 0;
      });
      setCurrentSlides(initialSlides);

      setIsLoading(false)
      return
    }

    ShowToast("error", "Cooking Classes could not be retreived. Try again another time")
    setIsLoading(false)
    return
  }

  useEffect(() => {
    getAllClasses()
  }, [])

  const nextSlide = (classId, totalImages) => {
    setCurrentSlides(prev => ({
      ...prev,
      [classId]: (prev[classId] + 1) % totalImages
    }));
  };

  const prevSlide = (classId, totalImages) => {
    setCurrentSlides(prev => ({
      ...prev,
      [classId]: (prev[classId] - 1 + totalImages) % totalImages
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Header />
      {/* Logo */}
      { isLoading ?
        <div className='flex justify-center items-center min-h-screen'>
          <Loader/>
        </div>
        :
        <>
          <div className="bg-gradient-to-b from-[#445717] to-[#445717] flex flex-col px-4 md:px-20 py-8">
            <h1 className='font-caslon text-white text-3xl md:text-5xl lg:text-[60px] mb-2'>Cooking Classes</h1>
            <div className="relative overflow-hidden">
              <img src={CookingImg} className='rounded-[3rem] h-[60vh] w-full object-cover' alt="" />
            </div>
            <p className='font-canaro-light text-white text-[1rem] md:text-[1.5rem] lg:text-[1.8rem] text-left mt-4  mx-auto mb-8'>
              Join Mama Carmen and Carmen for authentic West African cooking classes. Learn traditional recipes and modern twists that celebrate culture, family, and the bold flavors of West Africa.
            </p>
          </div>

          {/* Cooking Classes Grid */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            {cookingClasses.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-gp-light-green text-3xl font-caslon mb-4">No Classes Available</h3>
                <p className="text-gray-600 text-lg font-canaro-book">Check back soon for upcoming cooking classes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cookingClasses.map((cookingClass) => {
                  const allImages = [cookingClass.image, ...cookingClass.class_images];
                  const currentSlide = currentSlides[cookingClass.class_id] || 0;

                  return (
                    <div key={cookingClass.class_id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* Image Slider */}
                      <div className="relative h-80 md:h-96">
                        {cookingClass.is_upcoming && (
                          <div className="absolute top-4 left-4 z-10 bg-gp-yellow text-white px-4 py-2 rounded-full font-canaro-semibold">
                            Upcoming
                          </div>
                        )}

                        {/* Current Image */}
                        <img
                          src={`https://api.goldenpalmfoods.com${allImages[currentSlide]}`}
                          alt={cookingClass.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Navigation Buttons */}
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={() => prevSlide(cookingClass.class_id, allImages.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                            >
                              <ChevronLeft size={24} />
                            </button>
                            <button
                              onClick={() => nextSlide(cookingClass.class_id, allImages.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                            >
                              <ChevronRight size={24} />
                            </button>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {allImages.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Class Info */}
                      <div className="p-6">
                        <h3 className="text-2xl md:text-3xl font-caslon text-gp-light-green mb-4">
                          {cookingClass.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="text-gp-light-green" size={20} />
                          <span className="text-gray-700 font-canaro-book text-lg">
                            {formatDate(cookingClass.date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <DollarSign className="text-gp-light-green" size={20} />
                          <span className="text-gray-700 font-canaro-semibold text-xl">
                            ${parseFloat(cookingClass.amount).toFixed(2)}
                          </span>
                        </div>

                        <a
                          href={cookingClass.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-gp-light-green text-white text-center py-3 rounded-lg font-canaro-semibold text-lg hover:bg-gp-dark-green transition-colors"
                        >
                          Sign Up
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>

      }
      

      

      <Footer/>
    </div>
  );
}