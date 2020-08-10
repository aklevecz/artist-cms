import React, { useState, useEffect, useContext, useRef } from "react"
import SVG from "react-inlinesvg"
import "./eolian.scss"
import {
  lerpTranslateXY,
  lerpOpacityOut,
  lerpOpacityIn,
} from "../templates/animations"
import SignInAndPickDevice from "../components/signin-and-pick-device"
import { playerContext } from "../../wrap-with-provider"
import pausePlaylistTrack from "../services/pause-playlist-track"
import startPlayingPlaylist from "../services/start-playing-playlist"
import SignInPopup from "../components/signin-popup"

const albumUri = "spotify:album:00DHViaM6QJwQjipBFoqsB"
const trackUris = {
  eolian: "spotify:track:495VVx56Vd5HkCw914GfCZ",
  losing_track: "spotify:track:2KjnarehBXAyjUc6FfcZ70",
  enklave: "spotify:track:5OfV5HdNjjUa8bvk1vBW6H",
  opulence: "spotify:track:4R6ofbEv0bcZzV4SgvzXVn",
  laze: "spotify:track:6afurbtcj10yYm4M1KMf0s",
  ae: "spotify:track:63m5LzFhvTRsze2CrWaAns",
}

const ebid = id => document.querySelector(`#${id}`)
const hel = e => (e.style.visibility = "hidden")
const getBaseId = e => e.id.split("-")[0]
const addClass = (e, c) => e.classList.add(c)
const isDesk = () => {
  if (typeof window !== "undefined")
    return window.innerWidth > window.innerHeight
}
const collectTextEls = g => {
  const texts = g.getElementsByTagName("text")
  return Array.from(texts)
}

const collectCoords = g => {
  const targets = g.getElementsByTagName("text")
  const data = {}
  Array.from(targets).forEach(target => {
    const baseId = getBaseId(target)
    const transform = target
      .getAttribute("transform")
      .split("(")[1]
      .split(")")[0]
      .split(" ")
    const x = parseFloat(transform[0])
    const y = parseFloat(transform[1])
    data[baseId] = { x, y }
  })
  return data
}

const DevicePicker = ({
  devices,
  pickDevice,
  setShowDevicePicker,
  queuedTrack,
}) => {
  const deviceBoxRef = useRef()
  const pickIcon = ebid("pick-device")
  const {
    x,
    y,
    width: pWidth,
    height: pHeight,
  } = pickIcon.getBoundingClientRect()
  useEffect(() => {
    const { height, width } = deviceBoxRef.current.getBoundingClientRect()
    deviceBoxRef.current.style.marginTop =
      -1 * (height / 2 + 20 * devices.length) + "px"
    deviceBoxRef.current.style.marginLeft = (-1 * width) / 2 + pWidth / 2 + "px"
  }, [devices])
  if (typeof window === "undefined") return <div></div>
  return (
    <div
      className="device-box-container"
      ref={deviceBoxRef}
      style={{
        top: y + window.scrollY,
        left: x,
      }}
    >
      {devices.slice(0, 3).map(device => (
        <div
          style={{ marginBottom: 10 }}
          key={device.id}
          onClick={() => {
            pickDevice(device.id, albumUri, queuedTrack)
            setShowDevicePicker(false)
          }}
        >
          {device.name}
        </div>
      ))}
      <div className="bottom-notch">
        <SVG src={require("../images/bottom-notch.svg")} />
      </div>
    </div>
  )
}

const Eolian = () => {
  const [src, setSrc] = useState(
    isDesk()
      ? require("../images/eolian-desk.svg")
      : require("../images/eolian-mobile.svg")
  )
  const [playerOpen, setPlayerOpen] = useState(false)
  const [track, setTrack] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [queuedTrack, setQueuedTrack] = useState("")
  const [showDevicePicker, setShowDevicePicker] = useState(false)
  const [cursor, setCursor] = useState({ progress: 0, duration: 0 })
  const [loaded, setLoaded] = useState(false)

  const context = useContext(playerContext)
  useEffect(() => {
    context.initPlayer().then(() => {
      context.getDevices()
    })
  }, [])
  useEffect(() => {
    if (!context.track) return
    const duration = context.track.item.duration_ms
    const progress = context.track.progress_ms
    const durationEl = ebid("duration")
    const dX1 = parseFloat(durationEl.getAttribute("x1"))
    const dX2 = parseFloat(durationEl.getAttribute("x2"))
    const length = dX2 - dX1
    const progressEl = ebid("progress")
    progressEl.setAttribute("x2", dX1 + length * (progress / duration))
    // setCursor({ duration, progress })
  }, [context.track])
  useEffect(() => {
    if (!loaded) return
    const player = ebid("player")
    const playerTarget = ebid("player-target")
    const tY = parseFloat(playerTarget.getAttribute("y"))
    const cY = parseFloat(player.querySelector("#bg").getAttribute("y"))
    if (playerOpen) {
      lerpTranslateXY(player, 1, 1, 0, tY - cY, 0.07)
    } else {
      const playerY = player
        .getAttribute("transform")
        .split("(")[1]
        .split(")")[0]
        .split(",")[1]
      lerpTranslateXY(player, 1, 1, parseFloat(playerY), 0, 0.07)
      setShowDevicePicker(false)
    }
    if (!context.spotifyAuth) {
      ebid("pick-device").style.display = "none"
    }
  }, [playerOpen])

  useEffect(() => {
    if (!loaded) return
    const currentTrack = ebid("track-name").textContent
    if (currentTrack !== track) {
      lerpOpacityOut(ebid("track-name")).then(() => {
        ebid("track-name").textContent = track
        lerpOpacityIn(ebid("track-name"))
      })
    }
    ebid("track-name").textContent = currentTrack
  }, [track])

  useEffect(() => {
    if (playerOpen) {
      context.playSpotifyTrack(albumUri, queuedTrack)
    }
    if (!playerOpen && context.chosenDevice) {
      context.playSpotifyTrack(albumUri, queuedTrack)
    }
  }, [queuedTrack])

  useEffect(() => {
    if (!loaded) return
    if (context.isPlaying) {
      ebid("pause").style.display = "inherit"
      ebid("play").style.display = "none"
    } else {
      ebid("pause").style.display = "none"
      ebid("play").style.display = "inherit"
    }
  }, [context.isPlaying])

  useEffect(() => {
    if (typeof window === "undefined") return
    const resize = () => {
      setSrc(
        isDesk()
          ? require("../images/eolian-desk.svg")
          : require("../images/eolian-mobile.svg")
      )
    }
    window.addEventListener("resize", resize, false)

    return () => window.removeEventListener("resize", resize, false)
  }, [])

  const toggleDevicePicker = () => {
    setShowDevicePicker(!showDevicePicker)
  }
  useEffect(() => {
    if (!loaded) return
    const devicePicker = ebid("pick-device")
    if (!context.spotifyAuth) {
      devicePicker.style.display = "none"
    } else {
      devicePicker.style.display = "inherit"
    }
    devicePicker.onclick = toggleDevicePicker
  }, [showDevicePicker, context.spotifyAuth])

  const startPlaying = () => {
    // startPlayingPlaylist(albumUri, queuedTrack).catch(() => {
    //   console.log('ferg')
    // })
    startPlayingPlaylist().catch(e => {
      console.log(e.message)
      startPlayingPlaylist(albumUri, queuedTrack)
    })
  }

  useEffect(() => {
    if (!loaded) return
    const play = ebid("play")
    play.onclick = () => startPlaying()
  }, [queuedTrack])

  const setup = () => {
    const viewBox = document.querySelector("#viewBox")
    document.body.style.background = viewBox.style.fill
    document.querySelector("html").style.background = viewBox.style.fill
    const svg = document.querySelector("svg")
    svg.setAttribute(
      "viewBox",
      `0 0 ${viewBox.getAttribute("width")} ${viewBox.getAttribute("height")}`
    )
    const tracksPre = ebid("tracks-pre")
    const tracksTarget = ebid("tracks-target")
    const listenButton = ebid("listen-button")
    hel(tracksTarget)
    const preTexts = collectTextEls(tracksPre)
    const tarCoords = collectCoords(tracksTarget)
    const preCoords = collectCoords(tracksPre)

    const pause = ebid("pause")
    pause.style.display = "none"
    pause.onclick = () => pausePlaylistTrack()
    const play = ebid("play")
    play.onclick = () => startPlaying()

    const close = ebid("player-close")
    const closePlayer = () => {
      setPlayerOpen(false)
    }
    close.onclick = closePlayer
    const openPlayer = e => {
      setTrack(e.currentTarget.id.split("-")[0].replace("_", " "))
      setPlayerOpen(true)
    }

    const moveTracks = () => {
      lerpOpacityOut(listenButton).then(() => {
        listenButton.remove()
      })
      preTexts.forEach(text => {
        const uri = trackUris[text.id.toLowerCase().split("-")[0]]
        text.onclick = e => {
          setShowPopup(true)
          setQueuedTrack(uri)
          openPlayer(e)
        }
        text.setAttribute("track-data", uri)
        addClass(text, "button")
        const baseId = getBaseId(text)
        lerpTranslateXY(
          text,
          preCoords[baseId].x,
          tarCoords[baseId].x,
          preCoords[baseId].y,
          tarCoords[baseId].y
        )
      })
    }

    const devicePicker = ebid("pick-device")
    devicePicker.onclick = toggleDevicePicker

    addClass(listenButton, "button")
    listenButton.onclick = moveTracks
    setLoaded(true)

    if (typeof window !== "undefined")
      ebid("bandcamp").onclick = () =>
        window.open("https://shallnotfade.bandcamp.com/album/eolian-ep")
    ebid("soundcloud").onclick = () =>
      window.open("https://soundcloud.com/eluize")
    ebid("spotify").onclick = () =>
      window.open("https://open.spotify.com/artist/4UynZk3RxczOK1AwaHR5ha")
  }

  return (
    <>
      {showPopup && !context.chosenDevice && (
        <SignInPopup showPopup={setShowPopup} />
      )}
      {showDevicePicker && (
        <DevicePicker
          devices={context.devices}
          pickDevice={context.pickDevice}
          setShowDevicePicker={setShowDevicePicker}
          queuedTrack={queuedTrack}
          cursor={cursor}
        />
      )}
      <SVG src={src} onLoad={setup} />
    </>
  )
}

export default Eolian
