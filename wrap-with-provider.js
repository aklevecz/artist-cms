import React, { useState, useEffect } from "react"
import refreshToken from "./src/services/refresh-token"
import startPlayingPlaylist from "./src/services/start-playing-playlist"
import pausePlaylistTrack from "./src/services/pause-playlist-track"
import getUserDevices from "./src/services/get-user-devices"
import getUserCurrentlyPlaying from "./src/services/get-user-currently-playing"

const RAPTOR_REPO_NAME = "Raptor Repo Player"
export const playerContext = React.createContext()

const showActiveTrack = uri => {
  try {
    const cPlaying = document.querySelector(".playing")
    if (cPlaying) {
      cPlaying.classList.remove("playing")
    }
    const element = document.getElementById(uri)
    element.classList.add("playing")
  } catch (err) {
    console.log("cant find this boy")
  }
}
const Provider = ({ children }) => {
  const [appToken, setAppToken] = useState()
  const [antiAuth, setAntiAuth] = useState(false)
  const [spotifyAuth, setSpotifyAuth] = useState()
  const [playerType, setPlayerType] = useState()
  const [player, setPlayer] = useState()
  const [scPlayer, setScPlayer] = useState()
  const [isPlaying, setIsPlaying] = useState()
  const [chosenDevice, setChosenDevice] = useState()
  const [devices, setDevices] = useState()
  const [track, setTrack] = useState()

  useEffect(() => {
    if (!devices || playerType === "soundcloud") return
    let interval
    const raptorRepoDevice = devices.find(
      device => device.name === RAPTOR_REPO_NAME
    )
    if (!raptorRepoDevice || chosenDevice !== raptorRepoDevice.id) {
      // I'm not sure where this set should actually be
      //   setPlayerType("spotify")
      let errorCount = 0
      const pollPlaying = () => {
        if (errorCount > 10) {
          setChosenDevice(undefined)
          return clearInterval(interval)
        }
        getUserCurrentlyPlaying()
          .then(track => {
            showActiveTrack(track.item.id)
            playerType === "spotify" && setIsPlaying(track.is_playing)
            console.log("polling")
          })
          .catch(err => {
            errorCount++
          })
      }

      interval = setInterval(pollPlaying, 1000)
    }

    return () => {
      clearInterval(interval)
      console.log("clear")
    }
  }, [isPlaying, chosenDevice])

  const getAppToken = () => {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.GATSBY_BB}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `${encodeURIComponent("grant_type")}=${encodeURIComponent(
        "client_credentials"
      )}`,
    })
      .then(r => r.json())
      .then(data => {
        setAppToken(data.access_token)
        localStorage.setItem("appToken", data.access_token)
      })
  }

  const getDevices = () => {
    getUserDevices()
      .then(d => {
        setDevices(d.devices)
        setSpotifyAuth(true)
      })
      .catch(error => {
        setSpotifyAuth(false)
      })
  }
  const pickDevice = deviceId => {
    setChosenDevice(deviceId)
    localStorage.setItem("deviceId", deviceId)
    playSpotifyTrack()
  }
  const initSoundcloud = trackId => {
    // pausePlaylistTrack()
    const client_id = "68ca93c0637a090be108eb8c8f3f8729"
    if (!window.SC) return
    const SC = window.SC
    SC.initialize({
      client_id,
    })
    SC.stream(`/tracks/${trackId}`).then(function (player) {
      setScPlayer(player)
    })
  }
  const playSoundcloud = () => {
    console.log(scPlayer)
    pausePlaylistTrack()
    setPlayerType("soundcloud")
    scPlayer.play()
    setIsPlaying(true)
  }

  useEffect(() => {
    let interval
    if (playerType === "soundcloud") {
      interval = setInterval(() => {
        setIsPlaying(scPlayer.isActuallyPlaying())
      }, 500)
    }
    return () => {
      clearInterval(interval)
    }
  }, [playerType])
  const pauseSoundcloud = () => {
    console.log("pausing soundcloud")
    scPlayer.pause()
    setIsPlaying(false)
  }

  const playSpotifyTrack = (playlistUri, trackUri) => {
    if (isPlaying && scPlayer) pauseSoundcloud()
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
      name: RAPTOR_REPO_NAME,
      getOAuthToken: cb => {
        cb(localStorage.getItem("arcsasT"))
      },
    })
    player.connect()
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id)
      localStorage.setItem("deviceId", device_id)
      getDevices()
      //   setChosenDevice(device_id)

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
            name: RAPTOR_REPO_NAME,
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
        showActiveTrack(currentTrack.uri.split(":")[2])
        setTrack(currentTrack)
        setIsPlaying(!paused)
        console.log(currentTrack)
      })

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id)
      })
      setPlayer(player)
    })
  }
  return (
    <playerContext.Provider
      value={{
        antiAuth,
        chosenDevice,
        devices,
        getDevices,
        initPlayer,
        initSoundcloud,
        isPlaying,
        getAppToken,
        pausePlayback,
        pausePlaylistTrack,
        pauseSoundcloud,
        pickDevice,
        player,
        playSoundcloud,
        playSpotifyTrack,
        playerType,
        resumePlayback,
        setAntiAuth,
        setChosenDevice,
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
