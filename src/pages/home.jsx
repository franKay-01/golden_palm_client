import Navbar from "../components/navbar"
import LogoAlt from "../assets/logo_alt.png"
import QuoteImg from "../assets/quote.png"
import CarrotImg from "../assets/carrots.png";
import FacebookLogo from '../assets/facebook_alt.png'
import InstagramLogo from '../assets/instagram_alt.png'
import YoutubeLogo from '../assets/youtube_alt.png'
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import useFunctions from "../utils/functions";

export default function Home(){
  const [recipeItem, setRecipeItem] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { getRecipeOfTheWeek } = useFunctions()

  const getRecipeItem = async () => {
    setIsLoading(true)
    const { response_code, recipe } = await getRecipeOfTheWeek()

    console.log(JSON.stringify(recipe))
    if (response_code === '000'){
      setRecipeItem(recipe)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    return
  }

  useEffect(() => {
    getRecipeItem()
  },[])

  return (
    <div className="min-h-screen relative">
      <Navbar/>
      <main className="main-home-content-alt">
        <div className="flex flex-col dashboard-image-container image-container">
          <img src={LogoAlt}/>
          <h1 className="banner-text">We strive to bring the <span className="banner-text-italic">best taste</span>,<br></br>out of West Africa</h1>
          <div className="banner-button cursor-pointer">
            <Link to={'/about'} className="banner-button-text">Read more about us</Link>
          </div>
        </div>
        <div className="flex flex-col main-container mt-12 lg:mt-24 md:mt-24">
          <h1 className="header-colored-text width-30">Best quality right from the heart of West Africa</h1>
          <h1 className="essence-text mt-4 mb-12 lg:mt-12 md:mt-12">Taste the very Essence of West Africa</h1>

          <div className="container variety-bg flex flex-col">
            <h1 className="variety-text mb-32">Taste the variety</h1>
            <div className="banner-button">
              <h1 className="banner-button-text">Browse shop</h1>
            </div>
          </div>

          <div className="container grid grid-cols-1 md:flex md:flex-row space-x-0 lg:space-x-9 md:space-x-5">
            <div className="main-container flex flex-col">
              <img className="mt-12 quote-image" src={QuoteImg}/>
              <h1 className="quote-text">
                RevieLorem ipsum dolor sit consectetue
                radipiscing elit, sed diam nonummy
                nibh euismod t
              </h1>
              <h1 className="quote-text">- Satisfied Customer</h1>
            </div>
            <div className="main-container flex flex-col">
              <img className="mt-12 quote-image" src={QuoteImg}/>
              <h1 className="quote-text">
                RevieLorem ipsum dolor sit consectetue
                radipiscing elit, sed diam nonummy
                nibh euismod t
              </h1>
              <h1 className="quote-text">- Satisfied Customer</h1>
            </div>
            <div className="main-container flex flex-col">
              <img className="mt-12 quote-image" src={QuoteImg}/>
              <h1 className="quote-text">
                RevieLorem ipsum dolor sit consectetue
                radipiscing elit, sed diam nonummy
                nibh euismod t
              </h1>
              <h1 className="quote-text">- Satisfied Customer</h1>
            </div>
          </div>

          <div className="container">
            <hr className="default"/>
          </div>
          <div className="flex flex-col space-y-4 p-4 justify-center items-center lg:hidden md:hidden ">
            <div className="grid grid-cols-1">
              <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
              <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
            </div>
            <div>
              <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
              <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
            </div>
            <div className="grid grid-cols-1">
              <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
              <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
            </div>
            <div>
              <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
              <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
            </div>
          </div>
          <div class="hidden lg:block md:block max-w-screen-2xl mx-auto mt-12 px-4 relative bg-white">
            <div class="flex flex-col md:flex-row gap-2 scrollable-div scroll-pt-20	">
              <div class="flex flex-1 flex-col item">
                <div class="flex flex-1 flex-col">
                  <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                  <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
              <div class="flex flex-col item">
                <div class="grid grid-cols-1">
                  <div className="grid grid-cols-1">
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                  <div>
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-1 flex-col item">
                <div class="flex flex-1 flex-col">
                  <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                  <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
              <div class="flex flex-col item">
                <div class="grid grid-cols-1">
                  <div className="grid grid-cols-1">
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                  <div>
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-1 flex-col item">
                <div class="flex flex-1 flex-col">
                  <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                  <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
              <div class="flex flex-col item">
                <div class="grid grid-cols-1">
                  <div className="grid grid-cols-1">
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                  <div>
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-1 flex-col item">
                <div class="flex flex-1 flex-col">
                  <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                  <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
              <div class="flex flex-col item">
                <div class="grid grid-cols-1">
                  <div className="grid grid-cols-1">
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                  <div>
                    <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                    <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="pseduo-track"></div>
          </div>
          <div className="main-container">
            <div className="banner-button">
              <h1 className="banner-button-text">View Gallery</h1>
            </div>
          </div>
          <div className="container">
            <hr className="default"/>
          </div>
          { recipeItem === null ? 
            <>
              <h1 className="header-colored-text header-colored-text-alt-1">Recipe of the Week coming soon</h1>
            </>: 
            <>
              <div className="container">
                <div class="flex justify-start lg:justify-center md:justify-center">
                  <h1 className="header-colored-text header-colored-text-alt-1">Recipe of the Week</h1>
                </div>
                <div className="flex flex-col lg:hidden md:hidden mt-4">
                  <div className="custom-width">
                    <h1 className="header-colored-text">{recipeItem?.title}</h1>
                    <h1 className="recipe-sub-text">Taste the very Essence of Africa</h1>
                    <hr className="default hr-margin"/>
                  </div>
                </div>
                <div class="hidden lg:grid md:grid grid-flow-col gap-4">
                  <div class="row-start-2 row-span-2">
                    <div className="custom-width">
                      <h1 className="header-colored-text header-colored-text-alt">{recipeItem?.title}</h1>
                      <h1 className="recipe-sub-text">Taste the very Essence of Africa</h1>
                      <hr className="default hr-margin"/>
                    </div>
                  </div>
                
                  <div class="hidden lg:block md:block row-start-1 row-end-4 relative">
                    <div className="carrot-image">
                      <img className="carrot-image-alt" src={CarrotImg}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3">
                  <div>
                    <img class="image-width-alt" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  </div>
                  <div className="col-span-2">
                    <p style={{ whiteSpace: 'pre-wrap' }} className="recipe-p">
                      {recipeItem?.description}
                    </p>
                  </div>
                </div>
              </div>
            </>}
          
          
        </div>
        <div className="mt-24">
          <div className="variety-bg-alt flex flex-col">
            <h1 className="variety-text-alt mb-4">Follow us on</h1>
            <div className="flex flex-row mb-12">
              <div className="lg:block lg:w-auto mr-4">
                <a href='/get-started' className="brown-button button-margin-left">
                  <img src={FacebookLogo}/>
                </a>
              </div>
              <div className="lg:block lg:w-auto mr-4">
                <a href='/get-started' className="brown-button button-margin-left">
                  <img src={YoutubeLogo}/>
                </a>
              </div>
              <div className="lg:block lg:w-auto">
                <a href='/get-started' className="brown-button button-margin-left">
                  <img src={InstagramLogo}/>
                </a>
              </div>
            </div>
            <div className="banner-button banner-button-alt-1">
              <h1 className="banner-button-text">Browse shop</h1>
            </div>
          </div>

        </div>
      </main>
      <Footer/>
    </div>
  )
}