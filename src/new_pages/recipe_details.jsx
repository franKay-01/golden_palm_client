import React, { useState, useEffect, useContext } from 'react';
import LogoAlt from "../assets/images/logo.png"
import BrushWhite from "../assets/images/brush_white.png"
import BrushYellow from "../assets/images/brush_yellow.png"
import Header from '../components/header';
import useFunctions from '../utils/functions';
import { ShowToast } from '../components/showToast';
import Loader from '../components/loader';
import Asset14 from '../assets/images/asset_14.png'
import Asset11 from '../assets/images/asset_11.png'
import Asset19 from '../assets/images/asset_19.png'
import Asset18 from '../assets/images/asset_18.png'
import Footer from '../components/footer';
import { Facebook, Instagram, Twitter, Menu, Clock, Users, ChefHat  } from 'lucide-react';
import { CartContext } from '../context/cartContext';
import HeatLevelModal from '../components/heatLevelModal';
import ShareComponent from '../components/shareComponent';

export default function RecipeDetailsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [recipeProducts, setRecipeProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [heatModalOpen, setHeatModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { getRecipeDetail } = useFunctions();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (recipeId) {
      const fetchRecipe = async () => {
        setIsLoading(true);
        const {response_code, recipe, products, msg} = await getRecipeDetail(recipeId);

        if (response_code === '000') {
          setRecipeProducts(products)
          setRecipe(recipe);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        ShowToast("error", "Failed to load recipe details");
      };

      fetchRecipe();
    } else {
      ShowToast("error", "No recipe selected");
      window.location.href = '/recipes';
    }
  }, []);

  const handleAddToCart = (product) => {
    // Check if product requires heat level
    if (product.is_hot) {
      setSelectedProduct(product);
      setHeatModalOpen(true);
      return;
    }

    // For products without heat level requirement, add directly
    const cartItem = {
      id: product.sku,
      name: product.name,
      price: parseFloat(product.price),
      unit_price: parseFloat(product.price),
      quantity: 1,
      img_url: product.img_url,
      type: 'product',
      heat_level: null,
      weight: product.weight || null
    };

    addToCart(cartItem);
    ShowToast("success", `${product.name} added to cart`);
  };

  const handleHeatLevelSelect = (heatLevel) => {
    if (!selectedProduct) return;

    const cartItem = {
      id: selectedProduct.sku,
      name: selectedProduct.name,
      price: parseFloat(selectedProduct.price),
      unit_price: parseFloat(selectedProduct.price),
      quantity: 1,
      img_url: selectedProduct.img_url,
      type: 'product',
      heat_level: heatLevel,
      weight: selectedProduct.weight || null
    };

    addToCart(cartItem);
    ShowToast("success", `${selectedProduct.name} added to cart`);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />

      {isLoading ? (
        <div className='flex justify-center items-center min-h-screen'>
          <Loader/>
        </div>
      ) : recipe ? (
        <>
        <div className="relative max-w-7xl mx-auto px-4 pb-12">
          <div className="absolute top-[58rem] right-12 transform">
            <img src={Asset14} alt="" className='w-[2rem] h-[2rem]'/>
          </div>
          <div className="absolute top-[70rem] -right-[5rem] transform rotate-12">
            <img src={Asset11} alt="" className='w-[12rem] h-[12rem]'/>
          </div>
          <div className="absolute top-[35rem] right-0 transform">
            <img src={Asset19} alt="" className='w-[10rem] h-[10rem]'/>
          </div>
          <div className="absolute top-[52rem] -left-40 transform rotate-2">
            <img src={Asset18} alt="" className='w-[10rem] h-[16rem]'/>
          </div>

          {/* Additional decorative images for long preparation sections */}
          <div className="absolute top-[90rem] left-12 transform -rotate-12">
            <img src={Asset14} alt="" className='w-[3rem] h-[3rem]'/>
          </div>
          <div className="absolute top-[110rem] -left-20 transform rotate-45">
            <img src={Asset19} alt="" className='w-[8rem] h-[8rem]'/>
          </div>
          <div className="absolute top-[130rem] right-8 transform -rotate-6">
            <img src={Asset11} alt="" className='w-[10rem] h-[10rem]'/>
          </div>
          <div className="absolute top-[150rem] -left-32 transform rotate-12">
            <img src={Asset18} alt="" className='w-[8rem] h-[12rem]'/>
          </div>
          <div className="absolute top-[170rem] right-16 transform rotate-3">
            <img src={Asset14} alt="" className='w-[2.5rem] h-[2.5rem]'/>
          </div>

          <div className="px-4 py-8 max-w-6xl mx-auto">
            <div className="bg-gp-yellow rounded-3xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="p-4">
                  <img
                    src={`http://localhost:5001${recipe.associated_image}`}
                    alt={recipe.title}
                    className="w-[30rem] h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="md:w-2/3 p-6 md:p-8 text-white">
                  <h2 className="text-3xl md:text-4xl text-gp-light-green font-bold mb-4">
                    {recipe.title}
                  </h2>
                  <img src={BrushWhite} className="mb-4" />
                  <p className="text-sm md:text-2xl text-slate-800 font-canaro-book leading-relaxed mb-6 opacity-90">
                    {recipe.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row md:flex-row justify-between gap-3 p-4">
                <div className="bg-black/50 backdrop-blur rounded-full px-12 py-2 flex flex-row justify-center items-center gap-2">
                  <Clock size={18} color='white'/>
                  <span className="text-[1rem] font-canaro-book text-white">{recipe.prep_info[0]} minutes prep</span>
                </div>
                <div className="bg-black/50 backdrop-blur rounded-full px-12 py-2 flex flex-row justify-center items-center gap-2">
                  <Clock size={16} color='white'/>
                  <span className="text-[1rem] font-canaro-book text-white">{recipe.prep_info[1]} minutes cook</span>
                </div>
                <div className="bg-black/50 backdrop-blur rounded-full px-12 py-2 flex flex-row justify-center items-center gap-2">
                  <Users size={16} color='white' />
                  <span className="text-[1rem] font-canaro-book text-white">Serves {recipe.prep_info[2]} people</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="px-4 py-8 max-w-6xl mx-auto">
            <div className='flex flex-col items-center justify-center'>
              <h2 className="text-[14px] md:text-[3rem] lg:text-[5rem] font-caslon text-center text-gray-800 mb-2">Ingredients</h2>
              <img src={BrushYellow} className="w-[50%] mb-4" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-8">
                {recipe.ingredients.map((ingredient, index) => {
                  return <div key={index}>
                  <h3 className="font-canaro-semibold text-[2rem] mb-4">{ingredient.category}:</h3>
                  <ul className="space-y-2 text-gray-700">
                    {ingredient.items.map((list, index) => {
                      return <li className='font-canaro-book text-[1.5rem]' key={index}>• {list.description}</li>
                    })}
                  </ul>
                </div>
                })}
              </div>
            </div>
          </div>

          {/* Preparation Section */}
          <div className="px-4 py-8 max-w-6xl mx-auto">
            <div className='flex flex-col items-center justify-center'>
              <h2 className="text-[14px] md:text-[3rem] lg:text-[5rem] font-caslon text-center text-gray-800 mb-2">Preparation</h2>
              <img src={BrushYellow} className="w-[50%] mb-4" />
            </div>
          
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-8">
                {recipe.preparation.map((prep, index) => {
                  return <div key={index}>
                  <h3 className="font-canaro-semibold text-[2rem] mb-4">{index + 1}. {prep.category}:</h3>
                  <ul className="space-y-2 text-gray-700">
                    {prep.items.map((list, index) => {
                      return <li className='font-canaro-book text-[1.5rem]' key={index}>• {list}</li>
                    })}
                  </ul>
                </div>
                })}
              </div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center mt-8">
              <ShareComponent title="Share this recipe" color='gp-yellow' />
            </div>
          </div>

          {/* Products Section */}
          { recipe.associated_products.length > 0 ?
            <>
              <h2 className="text-[4rem] font-canaro-semibold leading-10 mt-12 text-gp-light-green">Crafted With</h2>
              <h3 className="text-[2.5rem] font-canaro-semibold text-gp-light-green mb-2">These Ingredients:</h3>
              { recipeProducts.map((recipeProduct, index) => {
                return <div key={index} className="px-4 py-12 max-w-6xl mx-auto">
                <div className="space-y-4">
                  {/* Product Card 1 */}
                  <div className="rounded-2xl p-6 grid grid-cols-2 items-center justify-between" 
                  style={{ backgroundColor: recipeProduct.ref_color }}>
                    <div className="flex items-center gap-4">
                      <img
                        src={`http://localhost:5001${recipeProduct.img_url}`}
                        alt={recipeProduct.name}
                        className="w-[25rem] h-[25rem] object-cover rounded-lg"
                      />
                      
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div className="text-white">
                        <h4 className="text-[7rem] font-dry-brush">{recipeProduct.slug}</h4>
                        <p className="text-[3rem] font-canaro-semibold">${parseFloat(recipeProduct?.price).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(recipeProduct)}
                        className="bg-gp-light-green text-white px-6 py-2 rounded-md font-bold hover:bg-green-800 transition-colors"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </div>})}
            </>
            
          : null

          }
        </div>
      </>
      ) : (
        <div className='flex justify-center items-center min-h-screen'>
          <p className="text-gray-600 text-xl">Recipe not found</p>
        </div>
      )}

      <HeatLevelModal
        isOpen={heatModalOpen}
        onClose={() => {
          setHeatModalOpen(false);
          setSelectedProduct(null);
        }}
        onSelect={handleHeatLevelSelect}
        productName={selectedProduct?.name}
      />

      <Footer/>
    </>
  );
};