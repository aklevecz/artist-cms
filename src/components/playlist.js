import React, { useEffect, useState, useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import "./playlist.scss"
import SpotifyButton from "../templates/spotify-button"
import Popup from "./popup"

const Playlist = ({ tracks, playlistUri }) => {
  const [xy, setXY] = useState({ x: 0, y: 0 })
  const [popup, showPopup] = useState()
  const [queuedTrack, setQueuedTrack] = useState()
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

  const spotAuth = () => {
    var scopes =
      "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"
    var redirect_uri = process.env.GATSBY_REDIRECT_URI
    window &&
      window.open(
        "https://accounts.spotify.com/authorize" +
          "?response_type=code" +
          "&client_id=" +
          process.env.GATSBY_SPOTIFY_CLIENT_ID +
          "&scope=" +
          encodeURIComponent(scopes) +
          "&redirect_uri=" +
          encodeURIComponent(redirect_uri),
        "login-popup",
        "width=500, height=400"
      )
  }
  const pickDevice = deviceId => {
    context.setPlayerType("spotify")
    context.pickDevice(deviceId)
    context.playSpotifyTrack(playlistUri, queuedTrack)
    showPopup(false)
  }
  return (
    <>
      {popup && (
        <Popup title="Pick one of your Spotify devices">
          {context.devices.map(device => {
            return (
              <div
                className="device"
                key={device.id}
                onClick={() => pickDevice(device.id)}
              >
                {device.name}
              </div>
            )
          })}
        </Popup>
      )}
      <div
        className="playlist-container"
        style={{ color: "white", position: "absolute", top: xy.y, left: xy.x }}
      >
        <div
          style={{ position: "absolute", width: 320, cursor: "pointer" }}
          onClick={spotAuth}
        >
          {!context.spotifyAuth && <SpotifyButton />}
        </div>
        {tracks &&
          tracks.map(track => {
            return (
              <div
                className="track"
                onClick={() => {
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
