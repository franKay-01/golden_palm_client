import Navbar from "../components/navbar";
import Footer from "../components/footer";
import GalleryImg from "../assets/gallery_img.png"
import FacebookLogo from '../assets/facebook_alt.png'
import InstagramLogo from '../assets/instagram_alt.png'
import YoutubeLogo from '../assets/youtube_alt.png'
import FounderImg from '../assets/about_3.jpg'
import YellowStripImg from '../assets/yellow_strip.png'
import GreenStripFullImg from '../assets/green_strip_full.png'

export default function Success(){
  return (
    <div className="min-h-screen relative">
      <Navbar/>
      <main className="main-home-content-ab pb-32">
        <div className="grid grid-cols-2 h-4/5 md:flex-row gap-2 mt-24 pr-12">
          <img src={FounderImg} alt="Founders" className="founder-img"/>
          <div className="flex flex-col gap-1 justify-start mt-8">
            <h1 className="about-text">About us</h1>
            <h1 className="golden-food-text uppercase">Golden Palm Foods</h1>
            <img src={YellowStripImg} className="rotate-180	about-img-strip"/>
            <h1 className="about-paragraph">
              Golden Palm Foods was born from a simple yet powerful idea: to bring the vibrant flavors of West Africa to kitchens across America. Our journey began with our co-founder, a Togolese immigrant with a passion for her homeland's cuisine. What started as a small venture serving her local community soon revealed an untapped market opportunity.
              The turning point came when her daughter, our CEO and co-founder, recognized the immense potential in her mother's culinary expertise. Armed with a background in international relations and a vision for cultural bridge-building, she saw beyond the challenges of a fledgling business to the possibilities of a global brand.
            </h1>
            <h1 className="about-paragraph about-paragraph-sub">
              Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market.
              Understanding the importance of presentation in the speciality foods sector, we invested in sleek, eye-catching packaging designed to appeal to discerning consumers. 
              <br /><br />
              Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market.
              <br /><br /> Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market....
              <span className="underline text-[#FCB040] ml-1">Read more</span>
            </h1>
            <div className="flex flex-row justify-end mt-2">
              <div className="lg:flex lg:w-auto mr-4">
                <a href='/get-started' className="flex w-12 h-12">
                  <img src={FacebookLogo}/>
                </a>
              </div>
              <div className="lg:flex lg:w-auto mr-4">
                <a href='/get-started' className="flex w-12 h-12">
                  <img src={YoutubeLogo}/>
                </a>
              </div>
              <div className="lg:flex lg:w-auto">
                <a href='/get-started' className="flex w-12 h-12">
                  <img src={InstagramLogo}/>
                </a>
              </div>
            </div>
          </div>
        </div>
        <img src={GreenStripFullImg} />
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-4 pl-12 pr-20">
          <div className="flex flex-col space-y-2">
            <img className="mt-4 about-img-alt" src={GalleryImg} alt=""/>
          </div>
          <div className="mt-4">
            <h1 className="name-text">Carmen</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <h1 className="about-paragraph">
                Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                </h1>
                <div className="flex flex-row mb-12">
                  <div className="lg:flex lg:w-auto mr-2">
                    <a href='/get-started' className="flex w-8 h-8">
                      <img src={FacebookLogo}/>
                    </a>
                  </div>
                  <div className="lg:flex lg:w-auto mr-2">
                    <a href='/get-started' className="flex w-8 h-8">
                      <img src={YoutubeLogo}/>
                    </a>
                  </div>
                  <div className="lg:flex lg:w-auto">
                    <a href='/get-started' className="flex w-8 h-8">
                      <img src={InstagramLogo}/>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <h1 className="about-paragraph">
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  <br /><br />
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                </h1>
              </div>
            </div>
            <h1 className="about-paragraph about-paragraph-sub">
              Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market.
              Understanding the importance of presentation in the speciality foods sector, we invested in sleek, eye-catching packaging designed to appeal to discerning consumers. 
              <br /><br />
              Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market.
              <br /><br /> Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market....
              <span className="underline text-[#FCB040] ml-1">Read more</span>
            </h1>
          </div>
        </div>

        <img src={YellowStripImg}/>

        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mt-4 pl-12 pr-8">
          <div className="mt-4">
            <h1 className="name-text">Carmen</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
              <div className="col-span-2 pr-2">
                <h1 className="about-paragraph">
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  <br /><br />
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                  Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                </h1>
              </div>
              <div className="flex flex-col gap-4 pl-2">
                <h1 className="about-paragraph">
                Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                Discover a world of culinary excellence, where every dish is a testament to our commitment to delivering exceptional quality.
                </h1>
                <div className="flex flex-row mb-12">
                  <div className="lg:flex lg:w-auto mr-2">
                    <a href='/get-started' className="flex w-8 h-8">
                      <img src={FacebookLogo}/>
                    </a>
                  </div>
                  <div className="lg:flex lg:w-auto mr-2">
                    <a href='/get-started' className="flex w-8 h-8">
                      <img src={YoutubeLogo}/>
                    </a>
                  </div>
                  <div className="lg:flex lg:w-auto">
                    <a href='/get-started' className="flex w-8 h-8">
                      <img src={InstagramLogo}/>
                    </a>
                  </div>
                </div>
              </div>
             
            </div>
            <h1 className="about-paragraph about-paragraph-sub">
              Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market.
              Understanding the importance of presentation in the speciality foods sector, we invested in sleek, eye-catching packaging designed to appeal to discerning consumers. 
              <br /><br />
              Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market.
              <br /><br /> Together, they embarked on a mission to modernize traditional West African flavors for the American palate. They carefully selected three flagship products - artisanal peanuts, a versatile all-purpose spice mix, and a bold chili paste - each offering a unique taste experience that stands out in today's competitive food market....
              <span className="underline text-[#FCB040] ml-1">Read more</span>
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <img className="mt-4 about-img-alt" src={GalleryImg} alt=""/>
          </div>
        </div>
        <div className="flex justify-center items-center mt-12">
          <img src={YellowStripImg} className="rotate-180	about-img-strip-alt"/>
        </div>
        <div className="flex flex-col space-y-4 ml-12 mt-12 mb-8 items-start">
          <h1 className="about-text">Experience us</h1>
          <h1 className="golden-food-text uppercase">Golden Palm Foods</h1>
        </div>
      </main>
      <Footer/>
    </div>
  )
}