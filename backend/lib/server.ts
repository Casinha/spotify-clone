import express from "express"
import cors from "cors"
import SpotifyWebApi from "spotify-web-api-node"
const lyricsFinder = require("../node_modules/lyrics-finder/src/index.js")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/testenv', (req, res)=>{
    res.json(process.env)
})

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        redirectUri: req.body.redirectUri,
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err => {
        console.error(err)
        res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        redirectUri: req.body.redirectUri
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err => {
        console.error(err)
        res.sendStatus(400)
    })
})

app.get('/lyrics', async (req, res) => {
    const track = req.query.track
    const artist = req.query.artist

    const lyrics = await lyricsFinder(artist, track) || "No lyrics found"

    res.json({ lyrics })
})

app.listen(process.env.HOST_PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.HOST_PORT}`)
})