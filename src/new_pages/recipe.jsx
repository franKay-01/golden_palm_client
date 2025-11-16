import React, { useState, useEffect } from 'react';
import { Menu, Quote } from 'lucide-react';
import Logo from "../assets/images/logo_alt.png"
import LogoAlt from "../assets/images/logo.png"
import CookingImg from '../assets/cooking.png'
import { Facebook, Instagram, Twitter } from 'lucide-react';
import BrushYellow from "../assets/images/brush_yellow.png"
import Asset5 from "../assets/images/asset_5.png"
import Asset6 from "../assets/images/asset_6.png"
import Asset8 from "../assets/images/asset_8.png"
import Asset11 from "../assets/images/asset_11.png"
import Asset14 from "../assets/images/asset_14.png"
import Asset17 from "../assets/images/asset_17.png"
import Asset19 from "../assets/images/asset_19.png"
import Header from '../components/header';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import Footer from '../components/footer';

export default function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllRecipes } = useFunctions();

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const response = await getAllRecipes();

      if (response.response_code === '000') {
        const allRecipes = response.recipes;

        // Select 5 random recipes
        if (allRecipes.length <= 5) {
          setRecipes(allRecipes);
        } else {
          const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
          setRecipes(shuffled.slice(0, 5));
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      ShowToast("error", "Failed to load recipes");
    };

    fetchRecipes();
  }, []);

  const colors = ["bg-green-600", "bg-yellow-500", "bg-red-500", "bg-gray-900", "bg-orange-500"];

  return (
    <>
      <div className="bg-gradient-to-b from-green-700 to-green-800">
        <Header/>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center min-h-screen'>
          <Loader/>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className=" px-4 py-12 md:py-16">
              <div className="mx-auto flex flex-col">
                <div className='flex flex-col items-center justify-center'>
                  <h2 className="text-4xl md:text-[5rem] font-caslon text-gp-light-green mb-12">
                    Mama Carmen's
                  </h2>
                  <h2 className="text-4xl md:text-[5rem] font-caslon text-gp-light-green mb-8">
                    Recipes
                  </h2>
                  <img src={BrushYellow} alt="" className='mb-8 w-[40rem]' /> 
                </div>
                          
                <p className="text-gp-light-green font-canaro-book text-[1.8rem] mx-auto leading-relaxed mb-8">
                  Developed by Mama Carmen and her daughter, Carmen, these recipes bring together traditional West African classics and modern twists inspired by home cooking. From Jollof rice and Bambara beans to vibrant salads and spicy wings, each dish celebrates culture, family, and the bold flavors of West Africa through the lens of Golden Palm Foods.
                </p>
              </div>
              
              {/* Product Image */}
              <div className="flex mt-8">
                <div className="relative">
                  <img src={Asset5} alt="" className='w-[45rem] h-[16rem]' />
                </div>
              </div>
            </div>

            {/* Recipe Cards */}
            <div className="px-4 py-8 max-w-6xl mx-auto relative">
              {recipes.length >= 1 && (
                <div className="hidden md:block absolute top-[1rem] right-[-5rem] transform rotate-12 z-20">
                  <img src={Asset19} alt="" className='w-[10rem] h-[10rem]'/>
                </div>
              )}
              {recipes.length >= 2 && (
                <div className="hidden md:block absolute top-[20rem] left-[-7rem] transform rotate-12 z-20">
                  <img src={Asset11} alt="" className='w-[10rem] h-[10rem]'/>
                </div>
              )}
              {recipes.length >= 3 && (
                <div className="hidden md:block absolute top-[40rem] right-[-10rem] transform rotate-12 z-20">
                  <img src={Asset14} alt="" className='w-[7rem] h-[7rem]'/>
                </div>
              )}
              {recipes.length >= 4 && (
                <div className="hidden md:block absolute top-[55rem] right-[-4rem] transform rotate-12 z-20">
                  <img src={Asset17} alt="" className='w-[10rem] h-[10rem]'/>
                </div>
              )}
              {recipes.length >= 5 && (
                <div className="hidden md:block absolute top-[58rem] left-[-5rem] transform rotate-12 z-20">
                  <img src={Asset19} alt="" className='w-[10rem] h-[10rem]'/>
                </div>
              )}
              {recipes.length >= 5 && (
                <div className="hidden md:block absolute bottom-0 right-[15rem] transform rotate-12 z-20">
                  <img src={Asset14} alt="" className='w-[5rem] h-[5rem]'/>
                </div>
              )}
              <div className="space-y-12">
                {recipes.map((recipe, index) => (
                  <div key={index} className="relative cursor-pointer" onClick={() => {
                    window.location.href = `/recipe-detail?id=${recipe.id}`;
                  }}>
                    {index % 2 === 0 ? (
                      // Image on left layout
                      <div className="flex items-start">
                        <div className="w-1/3 md:w-1/4 z-10 relative">
                          <img
                            src={`http://localhost:5001${recipe.associated_image}`}
                            alt={recipe.title}
                            className="w-full h-32 md:h-40 object-cover rounded-xl shadow-md shadow-black"
                          />
                        </div>
                        <div className={`${colors[index % colors.length]} flex-1 rounded-r-2xl flex items-center justify-center ${recipe.title.length > 30 ? 'leading-[2.5rem]' : 'leading-[2.8rem]'} px-8 py-4 md:py-4 relative overflow-hidden -ml-6`}>
                          <h3 className={`text-white font-caslon text-center max-w-[30rem] ml-6 ${recipe.title.length > 30 ? 'leading-[1] text-[1rem] md:text-[2rem]' : 'text-[1.3rem] leading-[1] md:text-[3rem]'}`}>
                            {recipe.title}
                          </h3>
                          {/* Decorative elements */}
                          {index === 0 && (
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-30">
                              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
                                <circle cx="50" cy="30" r="25"/>
                                <circle cx="35" cy="60" r="20"/>
                                <circle cx="65" cy="65" r="15"/>
                              </svg>
                            </div>
                          )}
                          {index === 2 && (
                            <div className="absolute right-12 bottom-4 opacity-30">
                              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" className="text-yellow-400">
                                <circle cx="50" cy="50" r="30"/>
                                <circle cx="50" cy="50" r="20"/>
                                <circle cx="50" cy="50" r="10"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Image on right layout
                      <div className="flex items-start">
                        <div className={`${colors[index % colors.length]} flex-1 rounded-l-2xl flex items-center justify-center px-8 py-4 ${recipe.title.length > 30 ? 'leading-[2.5rem]' : 'leading-[2.8rem]'} md:py-4 relative overflow-hidden -mr-6`}>
                          <h3 className={`text-white font-caslon text-center max-w-[30rem] ml-6 ${recipe.title.length > 30 ? 'leading-[1] text-[1rem] md:text-[2rem]' : 'leading-[1] text-[1rem] md:text-[3rem]'}`}>
                            {recipe.title}
                          </h3>
                          {/* Decorative elements */}
                          {index === 1 && (
                            <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-30">
                              <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor" className="text-yellow-600">
                                <circle cx="50" cy="50" r="8"/>
                                <circle cx="30" cy="30" r="5"/>
                                <circle cx="70" cy="30" r="5"/>
                                <circle cx="30" cy="70" r="5"/>
                                <circle cx="70" cy="70" r="5"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="w-1/3 md:w-1/4 z-10 relative">
                          <img
                            src={`http://localhost:5001${recipe.associated_image}`}
                            alt={recipe.name}
                            className="w-full h-32 md:h-40 object-cover rounded-xl shadow-md shadow-black"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="px-12 py-20 relative">
              <div className="max-w-xl mx-auto bg-gp-yellow rounded-lg px-12 py-8 text-center text-white">
                <p className="text-[1.3rem] font-canaro-semibold mb-8">
                  These recipes were created by Golden Palm Foods. If you contact us where it, we kindly ask that you credit Golden Palm.
                </p>
                <h3 className="text-[1.6rem] md:text-[3rem] leading-4 font-dry-brush mb-2 mt-4">Mi Dounou</h3>
                <h5 className='text-[1rem] font-canaro-semibold mb-4'>let's eat</h5>
                <div className="flex justify-center space-x-2 text-sm">
                  <span><Facebook size={30} /></span>
                  <span><Instagram size={30} /></span>
                  <span><Twitter size={30} /></span>
                </div>
              </div>
            </div>
          </div>
          <div className='relative'>
            <div className="hidden md:block absolute bottom-[-15rem] left-0 transform -translate-y-1/2">
              <img src={Asset6} alt="" className='w-[12rem] h-[34rem]'/>
            </div>
            <div className="hidden md:block absolute bottom-[-18rem] right-0 transform -translate-y-1/2">
              <img src={Asset8} alt="" className='w-[22rem] h-[24rem]'/>
            </div>
          </div>
        </>
      )}

      <Footer/>
    </>
  );
};