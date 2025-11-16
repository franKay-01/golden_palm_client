import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Loader from '../components/loader';
import Navbar from '../components/navbar';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

export default function SingleProduct(){
  const history = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState([])
  
  
  const convertToDirectUrl = (url) => {
    const driveFileIdMatch = url.match(/file\/d\/([^\/]+)/);
    if (driveFileIdMatch) {
      const fileId = driveFileIdMatch[1];

      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    return url;
  };

  useEffect(() => {
    const { state } = location;
    if (state === null){
      return history('/')
    }
    const { data } = state;
    const { product } = data[0];
    setIsLoading(true)
    setProducts(product)

    const imgUrls = product.img_url.split(',\n');
    const convertedUrls = imgUrls.map((image) => convertToDirectUrl(image));
    setImages(convertedUrls);
  },[])

  useEffect(() => {
    setIsLoading(false)
  }, [images])

  useEffect(() => {
    const primarySlider = new Splide('#primary_slider', {
      type: 'fade',
      heightRatio: 0.5,
      pagination: false,
      arrows: false,
      cover: true,
    });

    const thumbnailSlider = new Splide('#thumbnail_slider', {
      rewind: true,
      fixedWidth: 100,
      fixedHeight: 64,
      isNavigation: true,
      gap: 10,
      focus: 'center',
      pagination: false,
      cover: true,
      breakpoints: {
        '600': {
          fixedWidth: 66,
          fixedHeight: 40,
        }
      }
    });

    primarySlider.sync(thumbnailSlider).mount();
    thumbnailSlider.mount();

    // Clean up on component unmount
    return () => {
      primarySlider.destroy();
      thumbnailSlider.destroy();
    };
  }, [images]);

  return (
    <>
      { isLoading ? 
        <Loader/> 
        :
        <div className="min-h-screen relative">
          <main className="product-content">
            <div class="bcca-breadcrumb">
              <div class="bcca-breadcrumb-item">{products.name}</div>
              <Link to='/shop' class="bcca-breadcrumb-item">Shop</Link>
              <Link to='/' class="bcca-breadcrumb-item">Home</Link>
            </div>
          <div className="grid mt-12">
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
            <div class="thumbnail_slider">
              <div id="primary_slider" className="splide">
                <div className="splide__track">
                  <ul className="splide__list">
                    { images.map((image, index) => {
                      return <li key={index} className="splide__slide"><img src={image}/></li>
                    })}
                  </ul>
                </div>
              </div>

              <div id="thumbnail_slider" className="splide">
                <div className="splide__track">
                  <ul className="splide__list">
                    { images.map((image, index) => {
                      return <li key={index} className="splide__slide thumbnail__slide"><img src={image}/></li>
                    })}
                  </ul>
                </div>
              </div>
            </div>
            {/* Change recipes to Mama Carmen Recipes */}
            <div className='flex flex-col'>
              <h1 className="product-title">{products.name}</h1>
              <hr className="default-alt-2"></hr>
              <div className='product-text-size gap-2 flex flex-col'>
                <h1 className='flex flex-wrap product-text-color'>
                  Crunchy Togolese Peanuts | Naturally Roasted | Protein-Packed Snack.
                  Enjoy the authentic taste of our perfectly roasted peanuts.
                </h1>
                <h1 className='mt-1 product-title-sub'>Product Highlights:</h1>
                <ul className="bullet-ul product-text-color">
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Locally sourced from Togolese farms</span>
                  </li>
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Dry-roasted with no added oils</span>
                  </li>
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Rich in protein and healthy fats</span>
                  </li>
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Satisfyingly crunchy texture</span>
                  </li>
                </ul>
                <h1 className='mt-1 product-title-sub'>Great for:</h1>
                <ul className="bullet-ul product-text-color">
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Healthy snacking</span>
                  </li>
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Addition to salads and stir-fries</span>
                  </li>
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Traditional West African recipes</span>
                  </li>
                  <li className={`flex flex-col gap-2`}>
                    <span className="flex flex-col gap-2">Serving of Gari</span>
                  </li>
                </ul>
                <h1 className='flex flex-wrap product-text-color'>
                  Crunch into the heart of West African cuisine with our all-natural, farm-fresh roasted peanuts.
                  #RoastedPeanuts #TogoSnacks #HealthyNuts #AfricanPeanuts
                </h1>
                <h1 className="single-product-price mt-4">$ {products.price} / 9oz</h1>
                <hr className="default-alt-2"></hr>
                <a href="/shop" className="cart-payment-button cart-payment-button-alt flex flex-row justify-start gap-4 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer bag-icon-color">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <h1 className="banner-button-text">Add to Cart</h1>
                  
                </a>
              </div>
            </div>
          </div>
          </main>
        </div> 
      }
    </>
  )
}