import { useState } from 'react';
import ScribbleImg from '../assets/pencil.webp'
import LoginImg from '../assets/login_p.webp'
import YouTubeImg from '../assets/youtube.svg'
import FacebookImg from '../assets/facebook.svg'
import InstagramImg from '../assets/instagram.svg'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ShowToast } from '../components/showToast';
import useFunctions from '../utils/functions';
import { useNavigate } from "react-router-dom"

export default function Users(){
  const [loginSelect, setLoginSelect] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [country, setCountry] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [username, setUsername] = useState('')

  const { signUp, signUserIn } = useFunctions();

  const router = useNavigate()

  const changeUserChoice = (choice) => {
    setCountry(choice)
  }

  const checkCredentials = () => {
    if (passcode === confirmPasscode){
      return {"resp_code": true, "resp_desc": "Passwords match"}
    }else{
      return {"resp_code": false, "resp_desc": "Passwords do not match"}
    }
  }

  const loginUser = async () => {

    if (passcode === "" || username === ""){
      ShowToast('error', "Please fill all required fields")
      return
    }

    const params = {"password": passcode, "username": username}

    setIsLoading(true)
    const { response_code, token, client_username, msg } = await signUserIn(params);
    if (response_code === 200){
      setIsLoading(false)
      localStorage.setItem('username', client_username)
      localStorage.setItem('ttk', token);

      router(-1)
    }else{
      ShowToast("error", msg)
      setIsLoading(false)
    }
  }

  const submitUserDetails = async () => {
    let {resp_code, resp_desc} = checkCredentials()
    if (!resp_code){
      ShowToast('error', resp_desc)
      return
    }

    if (firstName === "" || lastName === "" || email === "" || passcode === "" || username === ""){
      ShowToast('error', "Please fill all required fields")
      return
    }

    setIsLoading(true)

    const params = {"first_name": firstName, "last_name": lastName, "email": email, 
    "country": country, "password": passcode, "username": username}

    const { response_code, msg } = await signUp(params);
    if (response_code === 200){
      ShowToast("success", "Sign Up was successful")

      setUsername('')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPasscode('')
      setConfirmPasscode('')
      setCountry(null)

      setLoginSelect(true)
      setIsLoading(false)
    }else{
      ShowToast("error", msg)
      setIsLoading(false)
    }
  }

  const countries = ['United States', 'Canada']

  return (
    <>
      <div className='page-ht flex justify-center items-center relative'>
        <img src={ScribbleImg} className="absolute scribble-1-p" alt=""/>
        <img src={ScribbleImg} className="absolute scribble-2-p" alt=""/>
        <img src={LoginImg} className="absolute scribble-3-p" alt=""/>
        <div className='page-div flex flex-col space-y-12 p-8'>
          <div className='flex flex-row space-x-8'>
            <div className='cursor-pointer' onClick={() => router(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </div>
            <div className={`${loginSelect ? 'credential-header':'credential-header-alt'} cursor-pointer`} onClick={()=>setLoginSelect(true)}>Sign In</div>
            <div className={`${loginSelect ? 'credential-header-alt':'credential-header'} cursor-pointer`} onClick={()=>setLoginSelect(false)}>Sign Up</div>
            
          </div>
          {
            loginSelect ?
            <>
              <div className='flex flex-col space-y-4'>
                <input className='credential-input-b focus:outline-none' onChange={(e) => setUsername(e.target.value)} placeholder='Username' type="text"/>
                <input className='credential-input-b focus:outline-none' onChange={(e) => setPasscode(e.target.value)} placeholder='Passcode' type="password"/>
              </div>
              <div>
                {isLoading ? 
                  <button className='credential-button'>
                    <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin border border-solid border-white border-t-transparent"></div>
                    </span>
                  </button>
                  :
                  <button className='credential-button' onClick={() => loginUser()}>
                    <h1 className='credential-button-text'>Sign In</h1>
                  </button>
                }
                <a href="/forgotten_password" className='underline cursor-pointer forgotten-link'>Forgotten Password</a>
              </div>
            </>
            :
            <>
              <div className='flex flex-col space-y-4'>
                <input onChange={(e)=>setUsername(e.target.value)} className='credential-input-b focus:outline-none' placeholder='Username' type="text"/>
                <input onChange={(e)=>setFirstName(e.target.value)} className='credential-input-b focus:outline-none' placeholder='First Name' type="text"/>
                <input onChange={(e)=>setLastName(e.target.value)} className='credential-input-b focus:outline-none' placeholder='Last Name' type="text"/>
                <input onChange={(e)=>setEmail(e.target.value)} className='credential-input-b focus:outline-none' placeholder='Email Address' type="text"/>
                <input onChange={(e)=>setPasscode(e.target.value)} className='credential-input-b focus:outline-none' placeholder='Passcode' type="password"/>
                <input onChange={(e)=>setConfirmPasscode(e.target.value)} className='credential-input-b focus:outline-none' placeholder='Confirm Passcode' type="password"/>
                <Autocomplete
                  options={countries}
                  getOptionLabel={option => option}
                  value={country}
                  sx={{ width: '300px' }}
                  onChange={(event, newValue) => {
                    changeUserChoice(newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} variant="outlined" label="Select Country" />
                  )}
                />
              </div>
              <div>
                {isLoading ? 
                  <button className='credential-button'>
                    <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin border border-solid border-white border-t-transparent"></div>
                    </span>
                  </button>
                  :
                  <button className='credential-button' onClick={() => submitUserDetails()}>
                    <h1 className='credential-button-text'>Sign Up</h1>
                  </button>
                }
              </div>
            </>
          }
          
          <div class="gradLine3"></div>
          {loginSelect ? 
            <div className='flex flex-col items-center justify-center'>
              <h1 className='flex justify-center social-text'>Follow Us!</h1>
              <div className='flex flex-row space-x-4 mt-4'>
                <img className='social-handle-p' src={FacebookImg} alt=""/>
                <img className='social-handle-p' src={InstagramImg} alt=""/>
                <img className='social-handle-p' src={YouTubeImg} alt=""/>
              </div>
            </div>
            : 
            null
          }
          
        </div>
      </div>
    </>
  )
}