import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import TrackSearchResult from './TrackSearchResult'
import SpotifyWebApi from 'spotify-web-api-node'
import Player from "./Player"
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
    clientId: "0ad91f9000364e4c8ca5d9f66b046075"
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [selectedTrack, setSelectedTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    const clickTrack = (track) => {
        setSelectedTrack(track)
        setSearchResults([])
        setLyrics("")
    }

    useEffect(() => {
        if (!selectedTrack) return
        axios.get(`http://localhost:3000/lyrics`, {
            params: {
                track: selectedTrack.name,
                artist: selectedTrack.artist
            }
        }).then((response) => setLyrics(response.data.lyrics))
    }, [selectedTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        const searchDelay = setTimeout(() => {
            spotifyApi.searchTracks(search).then((response) => {
                const searchResults = response.body.tracks.items.map(track => {
                    return {
                        name: track.name,
                        artist: track.artists[0].name,
                        albumUrl: track.album.images.reduce((a, b) => { return a.height > b.height ? b : a }, track.album.images[0]).url,
                        uri: track.uri,
                        key: track.id
                    }
                })
                setSearchResults(searchResults)
            }).catch((err) => { console.error(err) })
        }, 200)

        return () => clearTimeout(searchDelay)
    }, [search])

    return (
        <div>
            <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
                <Form.Control type="search" placeholder="Search Songs/Artists..." value={search} onChange={e => setSearch(e.target.value)}></Form.Control>
                <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                    {searchResults.map(track => (
                        <TrackSearchResult track={track} playTrack={clickTrack} key={track.key} />
                    ))}
                    {searchResults.length === 0 && (
                        <div className="text-center" style={{ whiteSpace: "pre" }}>
                            {lyrics}
                        </div>
                    )}
                </div>
                <Player accessToken={accessToken} trackUri={selectedTrack?.uri} />
            </Container>
        </div>
    )
}