import React from "react";
import LogoAlt from "../assets/images/logo.png"
import useFunctions from "../utils/functions";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { ShowToast } from "../components/showToast";

export default function AccountPage() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gp-light-green to-[#fff3e0]">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-2">
          <img src={LogoAlt} className="w-[5rem] h-[5rem]"/>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-caslon text-gray-800 mb-6">
        {loginSelect ? 'Good to see you again' : 'Create your account'}
      </h2>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] max-w-4xl">
        {loginSelect ? (
          /* Login Form */
          <form className="flex flex-col space-y-5" onSubmit={(e) => { e.preventDefault(); loginUser(); }}>
            {/* Username */}
            <div>
              <label className="block text-sm font-canaro-book text-gray-600 mb-1">Username</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-canaro-book text-gray-600 mb-1">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gp-light-green hover:bg-gp-dark-green text-white py-2 rounded-lg font-canaro-semibold transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Links */}
            <div className="flex justify-between text-sm mt-2">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setLoginSelect(false); }}
                className="text-gp-light-green hover:underline font-canaro-book"
              >
                Don't have an account?
              </a>
              <a href="#" className="text-gp-light-green hover:underline font-canaro-book">
                Forgot password?
              </a>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form className="flex flex-col space-y-5" onSubmit={(e) => { e.preventDefault(); submitUserDetails(); }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">First Name</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">Last Name</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">Username</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">Email</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8-4H8m-2 8h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">Country</label>
                <select
                  value={country || ''}
                  onChange={(e) => changeUserChoice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none text-gray-700 font-canaro-book"
                >
                  <option value="" disabled>Select your country</option>
                  {countries.map((c, index) => (
                    <option key={index} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Create a password"
                    className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-canaro-book text-gray-600 mb-1">Confirm Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Confirm your password"
                    className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400 font-canaro-book"
                  />
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gp-light-green hover:bg-gp-dark-green text-white py-2 rounded-lg font-canaro-semibold transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            {/* Link */}
            <div className="flex justify-center text-sm mt-2">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setLoginSelect(true); }}
                className="text-gp-light-green hover:underline font-canaro-book"
              >
                Already have an account?
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
