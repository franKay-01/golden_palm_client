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

export default function Forgotten(){
  const [submitData, setSubmitData] = useState({submitUsername: true, submitNewData: false, checkUserToken: false})
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [username, setUsername] = useState('')

  const [form, setForm] = useState({passcode: '', confirmPasscode:'', username: '', token: ''})
	
	const handleChange = (e) => {
    setForm({...form,[e.target.name]: e.target.value})
	}

  const { checkToken, sendUserToken, submitPasswordChange } = useFunctions();

  const router = useNavigate()

  const checkTokenDetails = async () => {
    const params = {"token": form.token}
    const { response_code } = await checkToken(params)
    if (response_code === 200){
      setSubmitData({...submitData, submitUsername: false, checkUserToken: false, submitNewData: true})
    }
  }

  const sendToken = async () => {
    setIsLoading(true)
    const params = {"username": form.username}
    const { response_code, response_message } = await sendUserToken(params)
    if (response_code === 200){
      setIsLoading(false)
      ShowToast("success", response_message)
      setSubmitData({...submitData, submitUsername: false, submitNewData: false, checkUserToken: true})
      return
    }

    setIsLoading(false)
    ShowToast("error", response_message)
    return
  }

  const checkCredentials = () => {
    if (passcode === confirmPasscode){
      return {"resp_code": true, "resp_desc": "Passwords match"}
    }else{
      return {"resp_code": false, "resp_desc": "Passwords do not match"}
    }
  }

  const changePasscode = async () => {

    if (form.passcode === "" || form.username === ""){
      ShowToast('error', "Please fill all required fields")
      return
    }
    const {resp_code} = checkCredentials()

    if (!resp_code){
      ShowToast('error', "Passwords do not match")
      return
    }

    const params = {"password": form.passcode, "username": form.username}

    setIsLoading(true)
    const { response_code, msg } = await submitPasswordChange(params);
    if (response_code === 200){
      setIsLoading(false)
      setForm({passcode: '', confirmPasscode:'', username: ''})
      router('/credentials')

    }else{
      ShowToast("error", msg)
      setIsLoading(false)
    }
  }

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
          </div>
          {
            submitData.submitUsername ?
            <>
              <div className='flex flex-col space-y-4'>
                <input name='username' className='credential-input-b focus:outline-none' value={form.username} onChange={handleChange} placeholder='Username' type="text"/>
              </div>
              <div>
                {isLoading ? 
                  <button className='credential-button'>
                    <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin border border-solid border-white border-t-transparent"></div>
                    </span>
                  </button>
                  :
                  <button className='credential-button' onClick={() => sendToken()}>
                    <h1 className='credential-button-text'>Submit</h1>
                  </button>
                }
              </div>
            </>
            :
            null
          }
           {
            submitData.checkUserToken ?
            <>
              <div className='flex flex-col space-y-4'>
                <input name='token' className='credential-input-b focus:outline-none' value={form.token} onChange={handleChange} placeholder='Token' type="text"/>
              </div>
              <div>
                {isLoading ? 
                  <button className='credential-button'>
                    <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin border border-solid border-white border-t-transparent"></div>
                    </span>
                  </button>
                  :
                  <button className='credential-button' onClick={() => checkTokenDetails()}>
                    <h1 className='credential-button-text'>Submit</h1>
                  </button>
                }
              </div>
            </>
            :
            null
          }
          {
            submitData.submitNewData ? 
            <>
              <div className='flex flex-col space-y-4'>
                <input onChange={handleChange} name='password' className='credential-input-b focus:outline-none' placeholder='Password' type="text"/>
                <input onChange={handleChange} name='confirmPasscode' className='credential-input-b focus:outline-none' placeholder='Confirm Passcode' type="password"/>
               
              </div>
              <div>
                {isLoading ? 
                  <button className='credential-button'>
                    <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin border border-solid border-white border-t-transparent"></div>
                    </span>
                  </button>
                  :
                  <button className='credential-button' onClick={() => changePasscode()}>
                    <h1 className='credential-button-text'>Confirm Change</h1>
                  </button>
                }
              </div>
            </>:null
          }
          <div class="gradLine3"></div>
        </div>
      </div>
    </>
  )
}