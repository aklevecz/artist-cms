import React, { useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"
import spotifyAuth from "../services/spotify-auth"
import SpotifyButton from "../templates/spotify-button"

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
  const title = context.spotifyAuth
    ? "Pick one of your Spotify devices"
    : "Login with Spotify?"
  return (
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
            <button onClick={spotifyAuth}>YES</button>
            <button onClick={() => showPopup(false)}>NO</button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default SignInAndPickDevice
