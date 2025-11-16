import { useContext, useState } from "react";

import Navbar from "../components/navbar";
import ShopImg from "../assets/shop_item.png"
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom"

import { Popover } from '@headlessui/react'
import { CartContext } from "../context/cartContext";
import useFunctions from "../utils/functions";
import { ShowToast } from "../components/showToast";
import { useEffect } from "react";

export default function Cart(){
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [selectedOption, setSelectedOption] = useState('');
  const [zipcode, setZipcode] = useState('')

  const { removeFromCart } = useContext(CartContext);

  const router = useNavigate()

  const { submitCheckOut } = useFunctions();
  const { cart, calculateTotal, increaseQuantity, changePrice, getProductPrice} = useContext(CartContext);

  const handleOptionChange = (event, productId) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    increaseQuantity(productId, selectedValue)
    changePrice(productId, selectedValue)
  };

  
  const checkout = async () => {
    setIsLoading(true)

    if (zipcode === ""){
      ShowToast('error', "Zipcode dertails are required")
      setIsLoading(false)
      return
    }
    
    const params = {
      'zipcode': zipcode,
      'cart': cart
    }

    const { response_code, checkout_url, error, msg } = await submitCheckOut(params);

    if (error){
      if (response_code === 300){
        setIsLoading(false)
        ShowToast('error', msg)
        localStorage.removeItem('ttk');
        router('/credentials')
        return
      } else if (response_code === 301){
        setIsLoading(false)
        ShowToast('error', msg)
        return
      }
      setIsLoading(false)
      ShowToast('error', 'Checkout process failed. Please try again in a few minutes')
      return
    }
    setIsLoading(false)
    localStorage.removeItem('cart');
    window.location.href = checkout_url
  }

  useEffect(()=>{
    const token = localStorage.getItem('ttk')
    if (token){
      setIsSignedIn(true)
    }
  }, [])
  return (
    
    <div className="min-h-screen relative">
      <Navbar/>
      <main className="main-home-content pb-32">
        <div className="grid mt-12">
          <div className="flex flex-row space-x-8">
            <h1 className="header-colored-text header-colored-text-alt-2">Cart</h1>
            <h1 className="cart-number">{cart?.length} items</h1>
          </div>
        </div>
        <div className="container main-container">
          <hr className="default-alt-2"></hr>
        </div>
        <div className="container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3">
          <div className="mt-8 lg:mt-0 md:mt-0 lg:col-span-2 md:col-span-2 order-2 lg:order-1 md:order-2 space-y-4">
            {cart?.length > 0 ? 
              cart?.map((cart_item)=>{
                return <div className="cart-card flex flex-col lg:flex-row md:flex-row space-x-0 lg:space-x-12 md:space-x-12 p-4">
                  <img className="w-auto h-auto lg:w-48 md:w-48 lg:h-32 md:h-32" src={ShopImg}/>
                  <div className="flex flex-col lg:w-full md:w-full">
                    <div className="flex flex-row justify-between">
                      <h1 className="item-card-label">{cart_item.name}</h1>
                      <h1 className="item-card-label">$ {cart_item.price}</h1>
                    </div>
                    <h1 className="item-card-price item-card-price-alt">${cart_item.unit_price} / 9 oz</h1>
                    <div className="flex flex-row justify-between">
                      {cart_item.bulk ? 
                        <select id="quantity_alt"
                          onChange={(e) => handleOptionChange(e, cart_item.id)}
                          className="cart-b mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg block w-32 p-2.5">                      
                          <option value="5" selected>5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                        </select>
                        :
                        <select id="quantity"
                          onChange={(e) => handleOptionChange(e, cart_item.id)}
                          className="cart-b mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg block w-32 p-2.5">                      
                          <option value="1" selected>1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                        </select>
                      }
                      
                      <div onClick={()=> removeFromCart(cart_item.id)} class="relative group cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mt-4 red-label">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>

                        <div class="tooltip-position-alt rounded-md invisible">
                          <h1 className="tooltip-text">Remove</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              })
              :
              <div className="flex justify-center items-center">
                <h1 className="header-colored-text header-colored-text-alt-2">No Items</h1>
              </div>
            }
          </div>
          <div className="order-1 lg:order-2 md:order-2 summary-card p-4 flex flex-col space-y-4">
            <h1 className="item-card-label">Order Summary</h1>
            <div className="flex justify-between">
              <h1 className="summary-card-sub">Subtotal</h1>
              <h1 className="summary-card-sub">$ {calculateTotal()}</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="summary-card-sub">Shipping</h1>
              <h1 className="summary-card-sub">To be calculated</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="item-card-label">Total</h1>
              <h1 className="item-card-label">$ {calculateTotal()}</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="summary-card-sub focus:outline-none mt-8">Zipcode</h1>
              <input className="zipcode-input-field mt-8" onChange={(e) => setZipcode(e.target.value)} type="text" name="zipcode"/>
            </div>
            <span className="flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 red-label">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="font-bold text-sm">This zipcode is for recepient of product. Shipping cost will be displayed on payment page.</p>
            </span>
            {isLoading ? 
              <div className="cart-payment-button flex flex-row justify-between cursor-pointer">
                <span className="spinner-position spinner-position-alt">
                    <div class="w-6 h-6 rounded-full animate-spin
                      border border-solid border-white border-t-transparent"></div>
                  </span>
              </div>
              :
              isSignedIn ? 
                cart.length > 0 ?
                  <div className="cart-payment-button flex flex-row justify-between cursor-pointer" onClick={() => checkout()}>
                    <h1 className="banner-button-text">Continue to payment</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M8 16H24M24 16L18 10M24 16L18 22" stroke="white"/>
                    </svg>
                  </div>
                  :
                  <a href="/shop" className="cart-payment-button flex flex-row justify-between cursor-pointer">
                    <h1 className="banner-button-text">Add Items to Cart</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M8 16H24M24 16L18 10M24 16L18 22" stroke="white"/>
                    </svg>
                  </a>
              : 
                <a href="/credentials" className="cart-payment-button flex flex-row justify-between cursor-pointer">
                  <h1 className="banner-button-text">Sign In to continue</h1>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16H24M24 16L18 10M24 16L18 22" stroke="white"/>
                  </svg>
                </a>
            }
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}