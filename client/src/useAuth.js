import { useState, useEffect } from "react"
import axios from "axios"


export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        if (!code) return

        const redirectUri = window.location.origin

        axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, { code, redirectUri }).then(response => {
            setAccessToken(response.data.accessToken)
            setRefreshToken(response.data.refreshToken)
            setExpiresIn(response.data.expiresIn)

            window.history.pushState({}, null, '/')
        }).catch(err => {
            //window.location = "/"
        })
    }, [code])

    useEffect(() => {
        if (!(refreshToken && expiresIn)) return

        const redirectUri = window.location.origin

        const refreshInterval = setInterval(() => {
            axios.post(`${process.env.REACT_APP_SERVER_URL}/refresh`, { refreshToken, redirectUri }).then(response => {
                setAccessToken(response.data.accessToken)
                setExpiresIn(response.data.expiresIn)
            }).catch(err => {
                window.location = "/"
            })
        }, (expiresIn-30)*1000)

        return () => clearInterval(refreshInterval)
    }, [refreshToken, expiresIn])

    return accessToken
}