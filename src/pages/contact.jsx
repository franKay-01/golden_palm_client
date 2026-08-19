import Navbar from "../components/navbar"
import CarrotImg from "../assets/carrots.webp";
import 'pure-react-carousel/dist/react-carousel.es.css';

import { useState } from "react";
import Footer from "../components/footer";
import { ShowToast } from "../components/showToast";
import useFunctions from "../utils/functions";
import { useNavigate } from "react-router-dom";

export default function Contact(){
  const [form, setForm] = useState({first_name: '', last_name: '', email: '', message: ''})
  const [isLoading, setIsLoading] = useState(false)

  const router =  useNavigate()
  const { submitContactDetails } = useFunctions()
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
	}

  const areAnyValuesEmpty = () => {
    return Object.entries(form).some(([key, value]) => value === '');
  };

  const submitDetails = async () => {
    const response = areAnyValuesEmpty()
    if (response){
      ShowToast("error", "All fields are required")
      return
    }

    setIsLoading(true)

    const params = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      message: form.message
    }

    const {response_code, response_message} = await submitContactDetails(params)
    if (response_code === 200){
      ShowToast("success", response_message)
      setForm({first_name: '', last_name: '', email: '', message: ''})
      setIsLoading(false)
      router.go(0)
      return
    }

    ShowToast("error", response_message)
    setIsLoading(false)
    return
  }

  return (
    <div className="min-h-screen relative">
      <Navbar/>
      <main className="main-home-content-alt mb-24">
        <div className="flex flex-col dashboard-image-container image-container dashboard-image-container-alt">
          <h1 className="banner-text banner-text-alt">Talk to us!!</h1>
        </div>
        <div className="flex flex-col main-container mt-12">
          <div className="container">
            <div class="flex justify-start lg:justify-center md:justify-center">
              <h1 className="header-colored-text header-colored-text-alt-1">Let's start a conversation</h1>
            </div>
            <div class="hidden lg:grid md:grid grid-flow-col gap-4">
              <div class="row-start-2 row-span-2">
                <div className="custom-width">
                  <h1 className="header-colored-text header-colored-text-alt">Ask us anything.</h1>
                  <h1 className="recipe-sub-text">We'll respond via email within 2 - 3 business days</h1>
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
                <img class="contact-width-image" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
              </div>
              <div className="lg:col-span-2 md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="contact-label">First Name:.</label>
                    <input name="first_name" placeholder="First Name" className="contact-input" value={form.first_name} onChange={handleChange}/>
                  </div>
                  <div>
                    <label className="contact-label">Last Name:.</label>
                    <input name="last_name" placeholder="Last Name" className="contact-input" value={form.last_name} onChange={handleChange}/>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="contact-label">Email:.</label>
                    <input name="email" placeholder="Email" className="contact-input" value={form.email} onChange={handleChange}/>
                  </div>
                  <div className="flex flex-col">
                    <label className="contact-label">Message:.</label>
                    <textarea name="message" rows="4" class="text-field-a text-field-c" onChange={handleChange} placeholder="Write your message here...">
                      {form.message}
                    </textarea>
                  </div>
                </div>
                {
                  isLoading ? 
                  <button className='banner-button float-right cursor-pointer'>
                    <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin border border-solid border-white border-t-transparent"></div>
                    </span>
                  </button>
                  :
                  <button className="banner-button float-right cursor-pointer" onClick={() => submitDetails()}>
                    <h1 className="banner-button-text flex flex-row space-x-2">
                      <p>Send</p>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </h1>
                  </button>
                }
                
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}