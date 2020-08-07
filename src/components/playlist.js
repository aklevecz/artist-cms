import React, { useEffect, useState, useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import "./playlist.scss"
import SpotifyButton from "../templates/spotify-button"
import Popup from "./popup"
import SignInAndPickDevice from "./signin-and-pick-device"

const Playlist = ({ tracks, playlistUri }) => {
  const [xy, setXY] = useState({ x: 0, y: 0 })
  const [popup, showPopup] = useState()
  const [queuedTrack, setQueuedTrack] = useState()
  const context = useContext(playerContext)

  useEffect(() => {
    if (typeof window === "undefined") return <div></div>
    const { x, y, height } = document
      .querySelector("#body-box")
      .getBoundingClientRect()
    const padding = 10
    // setXY({ x: x + padding, y: y + window.scrollY + padding })
    setXY({ x: x + padding, y: 0 })

    const midHeight = document
      .querySelector("#mid-container")
      .getBoundingClientRect().height
    const playlistContainer = document.querySelector(".playlist-container")
    playlistContainer.style.height = height - 20 + "px"
  }, [])
  useEffect(() => {
    context.initPlayer()
  }, [])
  if (typeof window === "undefined") return <div></div>

  return (
    <>
      {popup && (
        <SignInAndPickDevice
          showPopup={showPopup}
          playlistUri={playlistUri}
          queuedTrack={queuedTrack}
        />
      )}
      <div
        className="playlist-container"
        style={{
          color: "white",
          position: "absolute",
          top: xy.y,
          left: xy.x,
          width: window.innerWidth - xy.x - 50,
        }}
      >
        {/* <div
          style={{ position: "absolute", width: 320, cursor: "pointer" }}
          onClick={spotAuth}
        >
          {!context.spotifyAuth && <SpotifyButton />}
        </div> */}
        {tracks &&
          tracks.map(track => {
            return (
              <div
                className="track"
                onClick={() => {
                  if (!context.spotifyAuth && context.antiAuth) {
                    const songLink = `https://open.spotify.com/track/${
                      track.trackUri.split(":")[2]
                    }`
                    return window.open(songLink, "_blank")
                  }
                  if (!context.chosenDevice) {
                    showPopup(true)
                    setQueuedTrack(track.trackUri)
                  } else {
                    context.playSpotifyTrack(playlistUri, track.trackUri)
                  }
                }}
                key={track.trackUri}
                id={track.trackUri.split(":")[2]}
              >
                {track.name}
              </div>
            )
          })}
      </div>
    </>
  )
}

export default Playlist
