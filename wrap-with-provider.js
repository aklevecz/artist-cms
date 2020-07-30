import React, { useState, useEffect } from "react"
import refreshToken from "./src/services/refresh-token"
import startPlayingPlaylist from "./src/services/start-playing-playlist"
import pausePlaylistTrack from "./src/services/pause-playlist-track"

export const playerContext = React.createContext()

const Provider = ({ children }) => {
  const [spotifyAuth, setSpotifyAuth] = useState()
  const [playerType, setPlayerType] = useState()
  const [player, setPlayer] = useState()
  const [scPlayer, setScPlayer] = useState()
  const [isPlaying, setIsPlaying] = useState()
  const [track, setTrack] = useState()

  const initSoundcloud = () => {
    const client_id = "68ca93c0637a090be108eb8c8f3f8729"
    if (!window.SC) return
    const SC = window.SC
    SC.initialize({
      client_id,
    })

    SC.stream("/tracks/861776977").then(function (player) {
      //   const listenButton = document.querySelector("#listen")
      //   listenButton.setAttribute("class", "button")
      setScPlayer(player)
      //   listenButton.onclick = () => {
      player.play()
      setIsPlaying(true)
      setPlayerType("soundcloud")
      //   }
    })
  }

  const pauseSoundcloud = () => {
    scPlayer.pause()
    setIsPlaying(false)
  }

  const playSpotifyTrack = (playlistUri, trackUri) => {
    if (isPlaying && playerType !== "spotify") pauseSoundcloud()
    setPlayerType("spotify")
    startPlayingPlaylist(playlistUri, trackUri)
  }

  const resumePlayback = () => {
    if (playerType === "spotify") {
      resumeSpotifyPlayback()
    } else if (playerType === "soundcloud") {
      scPlayer.play()
      setIsPlaying(true)
    }
  }
  const pausePlayback = () => {
    if (playerType === "spotify") {
      pausePlaylistTrack()
    } else if (playerType === "soundcloud") {
      pauseSoundcloud()
    }
  }
  const resumeSpotifyPlayback = () => startPlayingPlaylist()

  const initPlayer = () => {
    const player = new window.Spotify.Player({
      name: "Raptor Repo Player",
      getOAuthToken: cb => {
        cb(localStorage.getItem("arcsasT"))
      },
    })
    player.connect()
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id)
      localStorage.setItem("deviceId", device_id)
      //   context && context.setGroovePlayer(device_id)
      //   getUserDevices().then(data => {
      //     context.addSpotifyDevices(data.devices)
      //   })
      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message)
      })
      player.addListener("authentication_error", async ({ message }) => {
        console.log("auth error")
        if (localStorage.getItem("refrashT")) {
          const newToken = await refreshToken()
          console.log(newToken)
          localStorage.setItem("token", newToken.token)
          player = new window.Spotify.Player({
            name: "Groove Devotion Player",
            getOAuthToken: cb => {
              cb(newToken.token)
            },
          })
          player.connect()
        } else {
          console.log("this user is not remembered")
        }

        console.error(message)
      })
      player.addListener("account_error", ({ message }) => {
        console.error(message)
      })
      player.addListener("playback_error", ({ message }) => {
        console.error(message)
      })

      // Playback status updates
      player.addListener("player_state_changed", state => {
        if (!state) return
        const currentTrack = state.track_window.current_track
        const paused = state.paused
        try {
          const cPlaying = document.querySelector(".playing")
          if (cPlaying) {
            cPlaying.classList.remove("playing")
          }
          const element = document.getElementById(
            currentTrack.uri.split(":")[2]
          )
          element.classList.add("playing")
        } catch (err) {
          console.log("cant find this boy")
        }
        setTrack(currentTrack)
        setIsPlaying(!paused)
        console.log(currentTrack, paused)
      })

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id)
      })
      setPlayer(player)
    })
  }
  const getPlayerType = () => playerType
  return (
    <playerContext.Provider
      value={{
        getPlayerType,
        initPlayer,
        initSoundcloud,
        isPlaying,
        pausePlayback,
        pausePlaylistTrack,
        pauseSoundcloud,
        player,
        playSpotifyTrack,
        playerType,
        resumePlayback,
        setPlayerType,
        setSpotifyAuth,
        spotifyAuth,
      }}
    >
      {children}
    </playerContext.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
