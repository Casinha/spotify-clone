import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth({code}) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        if(!code) return

        axios.post(`http://localhost:3000/login`, {code}).then(response=>{

        })
    }, [code])
}