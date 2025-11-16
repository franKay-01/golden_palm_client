import { useContext } from "react";
import Navbar from "../components/navbar";
import ShopImg from "../assets/shop_item.png"
import Footer from "../components/footer";
import { Popover } from '@headlessui/react'
import { useState } from "react";
import { CartContext } from "../context/cartContext";
import useFunctions from "../utils/functions";
import { useEffect } from "react";
import { ShowToast } from "../components/showToast";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

export default function Shop(){
  const [checkoutItem, setCheckoutItem] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const history = useNavigate();
  const [searchParams] = useSearchParams();

  const { getProducts } = useFunctions();

  const { addToCart } = useContext(CartContext);

  const getShopProducts = async () => {
    const { response_code, products } = await getProducts();
    if (response_code === 200){
      console.log(JSON.stringify(products))
      setAllProducts(products)

      // Filter products based on tp parameter
      const typeParam = searchParams.get('tp');
      if (typeParam === 'all') {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(products);
      }
    }else{
      ShowToast("error", "Products could not be loaded. Please try again in a few minutes")
    }
  }

  const handleProduct = (product) => {
    const data = [
      { product }
    ]
    history('/product', { state: { data } });
  };

  useEffect(()=>{
    getShopProducts()
  },[searchParams])

  return (
    <div className="min-h-screen relative">
      <Navbar/>
      <main className="main-home-content">
        <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3">
          <h1 className="lg:col-span-2 md:col-span-2 header-colored-text header-colored-text-alt-2 mt-12">Products</h1>
          <div className="flex flex-row a-z-position">
            <Popover className="relative px-3 rounded-md font-normal text-lg text-default-blue learn-display focus:outline-none">
              <Popover.Button className="a-z">
                <span className="flex flex-col">A - Z</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="item-drop-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </Popover.Button>

              <Popover.Panel className="absolute z-10 mt-4">
                <div className="grid grid-cols-1 item-bar">
                  <a className='mb-6' href="/contact">A - Z</a>
                  <a className='mb-6' href="/about">Lowest to Highest</a>
                  <a href="/contact">Highest to Lowest</a>
                </div>
              </Popover.Panel>
            </Popover>
            <span className="a-z">List View</span>
          </div>
        </div>
        <div className="container main-container">
          <hr className="default-alt-2"></hr>
        </div>
        <div className="container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3">
          {filteredProducts.map((item, index) => {
            const imgUrls = item.img_url.split(',\n');
            const convertToDirectUrl = (url) => {
              const driveFileIdMatch = url.match(/file\/d\/([^\/]+)/);
              if (driveFileIdMatch) {
                const fileId = driveFileIdMatch[1];
                // return `https://drive.google.com/file/d/${fileId}/preview`;

                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
              }
              return url;
            };
            const displayImgUrl = convertToDirectUrl(imgUrls[0]);

            return <div className="item-card flex flex-row relative">
              <div onClick={() => handleProduct(item)} className="item-card-top cursor-pointer">
              {displayImgUrl === "" ? 
                <img className="item-card-img" src={ShopImg} alt="Default" />
                :
                <img className="item-card-img" src={displayImgUrl} alt="Product Image" />
                // <iframe
                //   className="item-card-img"
                //   src={displayImgUrl}
                //   frameBorder="0"
                //   width="100%" // Adjust width as needed
                //   height="auto" // Adjust height as needed
                //   allow="autoplay; fullscreen" // Allow specific features if needed
                //   title="Product Image"
                // />
              } 
              </div>
              <div onClick={() => handleProduct(item)} className="item-card-bottom flex flex-col cursor-pointer">
                <div id={`b-${index}`} className="grid pt-4 pl-8">
                  <h1 className="item-card-label">{item.name}</h1>
                  <h1 className="item-card-price">$ {item.price} / 9oz</h1>
                  <h1 className="item-card-description truncate-text">{item.description}</h1>
                </div>
              </div>
              <div className="view-product-position cursor-pointer">
                <div onClick={() => handleProduct(item)}>
                  <div class="relative group cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <div class="tooltip-position-view rounded-md invisible">
                      <h1 className="tooltip-text">Details</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cart-bag-position">
                
                <div onClick={()=>addToCart({id: index, product_id: item.sku,unit_price: item.price, price: item.price, name: item.name, quantity: 1, bulk: false, type: 'product'})} class="relative group cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>

                  <div class="tooltip-position rounded-md invisible">
                    <h1 className="tooltip-text">Add to Cart</h1>
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </main>
      <Footer/>
    </div>
  )
}