import { useState } from 'react'
import axios from "axios"

const useAxios = () => {
  const BASE_URL = process.env.API_URL || "https://api.goldenpalmfoods.com";
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  const token = localStorage.getItem("ttk")
  /*
  Execute Req
  */
  const executeGet = async (route) => {
    try {
      const res = await axios.get(`${BASE_URL}/${route}`, { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }})
      return res
    }
    catch (err) {
      return(err)
    }
  }

  const executeReq = async (route, body) => {
    setIsPending(true)

    try {
      const res = await axios.post(`${BASE_URL}/${route}`, body, { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }})
      return res
    }
    catch (err) {
      setError(err)
    }
  }
  /*
  Execute Req
  */

  return { executeReq, executeGet }
}

export default useAxios