import React, { useEffect, useState, useContext } from "react"
import startPlayingPlaylist from "../services/start-playing-playlist"
import { playerContext } from "../../wrap-with-provider"
import "./playlist.scss"

const Playlist = ({ tracks, playlistUri }) => {
  const [xy, setXY] = useState({ x: 0, y: 0 })
  const context = useContext(playerContext)
  useEffect(() => {
    if (typeof window === "undefined") return <div></div>
    const { x, y } = document.querySelector("#body-box").getBoundingClientRect()
    const padding = 10
    setXY({ x: x + padding, y: y + window.scrollY + padding })
  }, [])
  useEffect(() => {
    context.initPlayer()
  }, [])
  if (typeof window === "undefined") return <div></div>

  return (
    <div
      className="playlist-container"
      style={{ color: "white", position: "absolute", top: xy.y, left: xy.x }}
    >
      {tracks &&
        tracks.map(track => {
          console.log(track)
          return (
            <div
              className="track"
              onClick={() => {
                context.playSpotifyTrack(playlistUri, track.trackUri)
              }}
              key={track.trackUri}
              id={track.trackUri.split(":")[2]}
            >
              {track.name}
            </div>
          )
        })}
    </div>
  )
}

export default Playlist
