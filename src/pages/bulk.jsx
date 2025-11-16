import { useEffect, useContext } from "react";
import { useState } from "react";
import Navbar from "../components/navbar";
import useFunctions from "../utils/functions";
import { ShowToast } from "../components/showToast";
import { CartContext } from "../context/cartContext";
import Footer from "../components/footer";

export default function BulkPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const { addToCart, removeFromCart, calculateTotal } = useContext(CartContext);

  const { getProducts } = useFunctions();

  const getShopProducts = async () => {
    const { response_code, products } = await getProducts();
    if (response_code === 200){
      setAllProducts(products)
    }else{
      ShowToast("error", "Products could not be loaded. Please try again in a few minutes")
    }
  }

  useEffect(() => {
    getShopProducts()
  },[])

  const updateCart = (item, isChecked, id) => {
    if (isChecked) {
      // Add item to cart logic
      addToCart({id, product_id: item.sku,unit_price: item.price, price: item.price * 5, name: item.name, quantity: 5, bulk: true, type: 'product'})

    } else {
      // Remove item from cart logic
      removeFromCart(id)
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar/>
      
      <main className="main-home-content">
        <div className="grid mt-12">
          <div className="flex flex-row space-x-8">
            <h1 className="header-colored-text header-colored-text-alt-2">Bulk Items</h1>
            <h1 className="cart-number"></h1>
          </div>
        </div>
        <div className="container main-container">
          <hr className="default-alt-2"></hr>
        </div>
        <div className="order-1 lg:order-2 md:order-2 summary-card p-4 flex flex-col space-y-4 mb-4">
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
        </div>
        { isLoading ? 
          <span className="spinner-position spinner-position-alt">
            <div class="w-6 h-6 rounded-full animate-spin
              border border-solid border-yellow-500 border-t-transparent"></div>
          </span>
          :
          <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-black mb-32">
              <thead class="text-xs text-black uppercase table-bg">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    #
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Action
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Minimum Quantity
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((item, index) => {
                  return <tr class="border-b dark:border-slate-100	">
                    <th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
                      {index + 1}
                    </th>
                    <td class="px-6 py-4">    
                      <input
                        type="checkbox"
                        className="itemCheckbox"
                        onChange={(e) => updateCart(item, e.target.checked, (index + 1))}
                      />              
                    </td>
                    <td class="px-6 py-4">
                      {item.name}
                    </td>
                    <td class="px-6 py-4">
                      {item.description}
                    </td>
                    <td class="px-6 py-4">
                      5/ 45oz
                    </td>
                    <td class="px-6 py-4">
                      ${item.price}/ 9oz
                    </td>
                  </tr>
                })}
                
              </tbody>
            </table>
          </div>

        }
      </main>
      <Footer/>
    </div>
  )
}