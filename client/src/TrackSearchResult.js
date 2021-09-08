import React from 'react'

export default function TrackSearchResult({ track, playTrack }) {
    return (
        <div className="d-flex my-2" style={{ cursor: 'pointer' }} onClick={() => playTrack(track)}>
            <img height="64px" width="64px" src={track.albumUrl} alt="Not available"/>
            <div className="d-flex flex-column m-2 cursor-pointer">
                <div>{track.name}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
        </div>
    )
}
