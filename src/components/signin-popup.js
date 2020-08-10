import React, { useContext, useEffect } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"
import callSpotifyAuth from "../services/spotify-auth"
const SignInPopup = ({ showPopup }) => {
  const { getDevices, initPlayer, setAntiAuth, spotifyAuth } = useContext(
    playerContext
  )
  useEffect(() => {
    if (spotifyAuth) {
      initPlayer().then(() => {
        getDevices()
      })
      showPopup(false)
    }
  }, [])

  const acceptSpotify = () => {
    callSpotifyAuth()
    showPopup(false)
  }
  const denySpotify = () => {
    showPopup(false)
    setAntiAuth(true)
  }
  const title = "Login with Spotify"
  return (
    <>
      {/* This is awkward because if they are already signed in it is then denying Spotify*/}
      {/* <div onClick={denySpotify} className="popup-overlay"></div> */}
      <Popup title={title} overlayOnClick={denySpotify}>
        {!spotifyAuth && (
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

export default SignInPopup
