import React, { useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"
import spotifyAuth from "../services/spotify-auth"

const DevicePicker = ({ devices, pickDevice }) => (
  <div>
    {devices.map(device => {
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
  </div>
)

const SignInAndPickDevice = ({ playlistUri, showPopup, queuedTrack }) => {
  const context = useContext(playerContext)
  const pickDevice = deviceId => {
    context.setPlayerType("spotify")
    context.pickDevice(deviceId)
    context.playSpotifyTrack(playlistUri, queuedTrack)
    showPopup(false)
  }

  const acceptSpotify = () => {
    spotifyAuth()
  }
  const denySpotify = () => {
    showPopup(false)
    context.setAntiAuth(true)
  }
  const title = context.spotifyAuth
    ? "Pick one of your Spotify devices"
    : "Login with Spotify?"
  return (
    <>
      {/* This is awkward because if they are already signed in it is then denying Spotify*/}
      <div onClick={denySpotify} class="popup-overlay"></div>
      <Popup title={title}>
        {context.spotifyAuth && (
          <DevicePicker devices={context.devices} pickDevice={pickDevice} />
        )}
        {!context.spotifyAuth && (
          <div style={{ color: "black" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <button onClick={acceptSpotify}>YES</button>
              <button onClick={denySpotify}>NO</button>
            </div>
          </div>
        )}
      </Popup>
    </>
  )
}

export default SignInAndPickDevice
